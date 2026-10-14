import os
import json
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve,
    precision_recall_curve,
)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'z_alizadeh_sani_extension.csv')
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'artifacts')
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

TARGET_COLS = {
    'CAD': 'Cath',
    'LAD': 'LAD',
    'LCX': 'LCX',
    'RCA': 'RCA',
}

def load_and_clean_data():
    df = pd.read_csv(DATA_PATH)
    
    # Normalize string columns
    for col in df.select_dtypes(include=['object', 'string']).columns:
        df[col] = df[col].astype(str).str.strip()
    
    # Fix typo in Sex if present ('Fmale' -> 'Female')
    if 'Sex' in df.columns:
        df['Sex'] = df['Sex'].replace({'Fmale': 'Female'})
        
    return df

def get_feature_lists(df):
    all_targets = list(TARGET_COLS.values())
    
    # Feature columns exclude all target labels to strictly prevent data leakage
    candidate_features = [c for c in df.columns if c not in all_targets and c != 'Exertional CP']
    
    numeric_features = []
    categorical_features = []
    
    for c in candidate_features:
        if pd.api.types.is_numeric_dtype(df[c]):
            numeric_features.append(c)
        else:
            categorical_features.append(c)
            
    return candidate_features, numeric_features, categorical_features

def build_preprocessor(numeric_features, categorical_features):
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
    ])
    
    preprocessor = ColumnTransformer([
        ('num', num_pipeline, numeric_features),
        ('cat', cat_pipeline, categorical_features),
    ])
    
    return preprocessor

def train_and_evaluate():
    print("Loading Z-Alizadeh Sani Extension Dataset...")
    df = load_and_clean_data()
    feature_cols, num_cols, cat_cols = get_feature_lists(df)
    
    print(f"Total rows: {len(df)}")
    print(f"Total features: {len(feature_cols)} (Numeric: {len(num_cols)}, Categorical: {len(cat_cols)})")
    
    all_metrics = {}
    feature_importances = {}
    
    # Save Feature Schema
    schema = {
        'all_features': feature_cols,
        'numeric_features': num_cols,
        'categorical_features': cat_cols,
        'target_definitions': {
            'CAD': {'source_column': 'Cath', 'positive_class': 'CAD', 'negative_class': 'Normal'},
            'LAD': {'source_column': 'LAD', 'positive_class': 'Stenotic', 'negative_class': 'Normal'},
            'LCX': {'source_column': 'LCX', 'positive_class': 'Stenotic', 'negative_class': 'Normal'},
            'RCA': {'source_column': 'RCA', 'positive_class': 'Stenotic', 'negative_class': 'Normal'},
        },
        'categorical_categories': {c: sorted(df[c].unique().tolist()) for c in cat_cols},
        'numeric_ranges': {
            c: {'min': float(df[c].min()), 'max': float(df[c].max()), 'mean': float(df[c].mean())}
            for c in num_cols
        }
    }
    
    schema_path = os.path.join(ARTIFACTS_DIR, 'feature_schema.json')
    with open(schema_path, 'w') as f:
        json.dump(schema, f, indent=2)
    print(f"Saved feature schema to {schema_path}")

    X = df[feature_cols]

    for target_name, raw_target_col in TARGET_COLS.items():
        print(f"\n==================== Training Classifier: {target_name} ({raw_target_col}) ====================")
        
        # Binary target mapping
        if target_name == 'CAD':
            y = (df[raw_target_col].str.upper() == 'CAD').astype(int)
        else:
            y = (df[raw_target_col].str.lower() == 'stenotic').astype(int)
            
        pos_count = int(y.sum())
        neg_count = int(len(y) - pos_count)
        print(f"Class distribution: Positive = {pos_count} ({(pos_count/len(y)*100):.1f}%), Negative = {neg_count} ({(neg_count/len(y)*100):.1f}%)")
        
        # Stratified train/test split (80/20)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, stratify=y
        )
        
        preprocessor = build_preprocessor(num_cols, cat_cols)
        
        # Compare models
        models = {
            'RandomForest': RandomForestClassifier(n_estimators=150, max_depth=6, random_state=42),
            'GradientBoosting': GradientBoostingClassifier(n_estimators=100, max_depth=3, learning_rate=0.08, random_state=42),
            'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42)
        }
        
        best_name = None
        best_pipeline = None
        best_cv_auc = -1.0
        
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        
        for name, clf in models.items():
            pipe = Pipeline([
                ('preprocessor', preprocessor),
                ('classifier', clf)
            ])
            cv_scores = cross_val_score(pipe, X_train, y_train, cv=cv, scoring='roc_auc')
            mean_auc = float(cv_scores.mean())
            print(f"  [{name}] 5-Fold CV ROC-AUC: {mean_auc:.4f} (+/- {cv_scores.std():.4f})")
            
            if mean_auc > best_cv_auc:
                best_cv_auc = mean_auc
                best_name = name
                best_pipeline = pipe
                
        print(f"  Selected Model: {best_name} (CV ROC-AUC: {best_cv_auc:.4f})")
        
        # Fit on full train set
        best_pipeline.fit(X_train, y_train)
        
        # Evaluate on test set
        y_pred = best_pipeline.predict(X_test)
        y_prob = best_pipeline.predict_proba(X_test)[:, 1]
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        auc = float(roc_auc_score(y_test, y_prob))
        
        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = [int(v) for v in cm.ravel()]
        spec = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
        
        print(f"  Test Accuracy:    {acc:.4f}")
        print(f"  Test Precision:   {prec:.4f}")
        print(f"  Test Recall:      {rec:.4f} (Sensitivity)")
        print(f"  Test Specificity: {spec:.4f}")
        print(f"  Test F1-Score:    {f1:.4f}")
        print(f"  Test ROC-AUC:     {auc:.4f}")
        print(f"  Confusion Matrix: TP={tp}, FP={fp}, FN={fn}, TN={tn}")
        
        # Compute ROC curve samples for charting
        fpr, tpr, thresholds = roc_curve(y_test, y_prob)
        roc_data = []
        for i in range(len(fpr)):
            roc_data.append({
                'falsePositiveRate': round(float(fpr[i]), 3),
                'truePositiveRate': round(float(tpr[i]), 3),
                'threshold': round(float(thresholds[i]), 3) if thresholds[i] <= 1.0 else 1.0
            })
            
        all_metrics[target_name] = {
            'targetId': target_name,
            'modelArchitecture': best_name,
            'cvRocAucMean': round(best_cv_auc, 4),
            'metrics': {
                'accuracy': round(acc, 4),
                'precision': round(prec, 4),
                'recall': round(rec, 4),
                'specificity': round(spec, 4),
                'f1Score': round(f1, 4),
                'rocAuc': round(auc, 4),
            },
            'confusionMatrix': {
                'truePositive': tp,
                'falsePositive': fp,
                'falseNegative': fn,
                'trueNegative': tn,
                'totalSamples': len(y_test)
            },
            'sampleCounts': {
                'totalDataset': len(df),
                'trainSet': len(X_train),
                'testSet': len(X_test),
                'positiveTrain': int(y_train.sum()),
                'negativeTrain': int(len(y_train) - y_train.sum()),
                'positiveTest': int(y_test.sum()),
                'negativeTest': int(len(y_test) - y_test.sum()),
            },
            'rocCurveData': roc_data[::max(1, len(roc_data)//15)]  # sample 15 points
        }
        
        # Extract feature importances if Random Forest or Gradient Boosting
        clf = best_pipeline.named_steps['classifier']
        if hasattr(clf, 'feature_importances_'):
            # Retrieve encoded feature names
            cat_encoder = best_pipeline.named_steps['preprocessor'].named_transformers_['cat'].named_steps['encoder']
            cat_encoded_names = list(cat_encoder.get_feature_names_out(cat_cols))
            feature_names = num_cols + cat_encoded_names
            
            raw_importances = clf.feature_importances_
            
            # Aggregate importance back to original feature level
            orig_feature_imp = {feat: 0.0 for feat in feature_cols}
            for fn, imp in zip(feature_names, raw_importances):
                # Check which original feature it belongs to
                matched = False
                for orig in cat_cols:
                    if fn.startswith(f"{orig}_"):
                        orig_feature_imp[orig] += float(imp)
                        matched = True
                        break
                if not matched and fn in orig_feature_imp:
                    orig_feature_imp[fn] += float(imp)
                    
            sorted_imp = sorted(orig_feature_imp.items(), key=lambda x: x[1], reverse=True)
            feature_importances[target_name] = [
                {'feature': feat, 'importance': round(imp, 4), 'rank': idx + 1}
                for idx, (feat, imp) in enumerate(sorted_imp[:15])
            ]
        
        # Save Model Artifact
        model_file = os.path.join(ARTIFACTS_DIR, f'model_{target_name}.joblib')
        joblib.dump(best_pipeline, model_file)
        print(f"Saved model pipeline to {model_file}")

    # Save metrics JSON
    metrics_path = os.path.join(ARTIFACTS_DIR, 'evaluation_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\nSaved all target evaluation metrics to {metrics_path}")

    # Save feature importances JSON
    fi_path = os.path.join(ARTIFACTS_DIR, 'feature_importance.json')
    with open(fi_path, 'w') as f:
        json.dump(feature_importances, f, indent=2)
    print(f"Saved feature importances to {fi_path}")

    print("\nTraining complete! All 4 models and metrics successfully saved.")

if __name__ == '__main__':
    train_and_evaluate()
