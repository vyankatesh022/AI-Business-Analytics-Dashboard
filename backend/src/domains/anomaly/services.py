import logging
import pandas as pd
import numpy as np
from datetime import datetime, timezone
from typing import List, Dict, Any
from .models import AnomalyRequest, AnomalyResponse, AnomalyDataPoint

logger = logging.getLogger(__name__)

class AnomalyService:
    def __init__(self):
        pass

    def detect_anomalies(self, request: AnomalyRequest) -> AnomalyResponse:
        if len(request.data) < 5:
            raise ValueError("Not enough historical data points to detect anomalies. Minimum 5 required.")

        df = pd.DataFrame([
            {"timestamp": pt.timestamp, "value": pt.value} 
            for pt in request.data
        ])
        
        df = df.sort_values(by="timestamp")
        
        algo_used = request.algorithm
        
        if algo_used == "auto" or algo_used == "zscore":
            algo_used = "zscore"
            # Z-Score method
            mean = df["value"].mean()
            std = df["value"].std()
            
            if std == 0:
                # No variance, no anomalies
                df["is_anomaly"] = False
                df["anomaly_score"] = 0.0
                df["lower_bound"] = mean
                df["upper_bound"] = mean
            else:
                df["anomaly_score"] = (df["value"] - mean).abs() / std
                threshold = request.sensitivity if request.sensitivity is not None else 3.0
                df["is_anomaly"] = df["anomaly_score"] > threshold
                df["lower_bound"] = mean - (threshold * std)
                df["upper_bound"] = mean + (threshold * std)
                
        elif algo_used == "isolation_forest":
            try:
                from sklearn.ensemble import IsolationForest
                
                # Reshape for sklearn
                X = df["value"].values.reshape(-1, 1)
                
                # contamination is roughly the expected proportion of outliers
                contamination = request.sensitivity if (request.sensitivity is not None and request.sensitivity < 0.5) else 0.05
                
                model = IsolationForest(contamination=contamination, random_state=42)
                preds = model.fit_predict(X)
                
                # Isolation Forest returns -1 for anomaly, 1 for normal
                df["is_anomaly"] = preds == -1
                
                # Scores are lower for more anomalous points, we invert it for readability
                scores = model.decision_function(X)
                df["anomaly_score"] = -scores
                
                df["lower_bound"] = None
                df["upper_bound"] = None
                
            except ImportError:
                logger.error("scikit-learn is not installed. Falling back to zscore.")
                algo_used = "zscore_fallback"
                mean = df["value"].mean()
                std = df["value"].std()
                if std == 0:
                    df["is_anomaly"] = False
                    df["anomaly_score"] = 0.0
                    df["lower_bound"] = mean
                    df["upper_bound"] = mean
                else:
                    df["anomaly_score"] = (df["value"] - mean).abs() / std
                    threshold = request.sensitivity if request.sensitivity is not None else 3.0
                    df["is_anomaly"] = df["anomaly_score"] > threshold
                    df["lower_bound"] = mean - (threshold * std)
                    df["upper_bound"] = mean + (threshold * std)
        else:
            raise ValueError(f"Unknown algorithm specified: {algo_used}")

        # Construct response
        response_data = []
        total_anomalies = 0
        
        for _, row in df.iterrows():
            is_anom = bool(row["is_anomaly"])
            if is_anom:
                total_anomalies += 1
                
            response_data.append(AnomalyDataPoint(
                timestamp=row["timestamp"],
                value=row["value"],
                is_anomaly=is_anom,
                anomaly_score=row["anomaly_score"] if pd.notna(row["anomaly_score"]) else None,
                lower_bound=row["lower_bound"] if pd.notna(row["lower_bound"]) else None,
                upper_bound=row["upper_bound"] if pd.notna(row["upper_bound"]) else None,
            ))

        return AnomalyResponse(
            metric_name=request.metric_name,
            algorithm_used=algo_used,
            total_anomalies=total_anomalies,
            data=response_data,
            created_at=datetime.now(timezone.utc)
        )
