import logging
import pandas as pd
from datetime import datetime, timezone
from typing import List, Dict, Any
from .models import ForecastRequest, ForecastResponse, ForecastDataPoint

logger = logging.getLogger(__name__)

class ForecastingService:
    def __init__(self):
        pass

    def generate_forecast(self, request: ForecastRequest) -> ForecastResponse:
        # Check if we have enough historical data
        if len(request.historical_data) < 2:
            raise ValueError("Not enough historical data points to generate a forecast. Minimum 2 required.")
            
        # Convert to pandas DataFrame
        df = pd.DataFrame([
            {"timestamp": pt.timestamp, "value": pt.value} 
            for pt in request.historical_data
        ])
        
        # Sort by timestamp
        df = df.sort_values(by="timestamp")
        df.set_index("timestamp", inplace=True)
        
        # Simple algorithm for demonstration (Exponential Smoothing or fallback)
        try:
            from statsmodels.tsa.holtwinters import ExponentialSmoothing
            
            # Fit model
            model = ExponentialSmoothing(df["value"], trend="add", seasonal=None, initialization_method="estimated")
            fit_model = model.fit()
            
            # Forecast
            forecast = fit_model.forecast(request.forecast_periods)
            
            # Construct response
            # Attempt to infer frequency or fallback to an arbitrary delta
            freq = pd.infer_freq(df.index)
            if freq is None:
                if len(df.index) >= 2:
                    delta = df.index[-1] - df.index[-2]
                else:
                    delta = pd.Timedelta(days=1)
            else:
                delta = pd.tseries.frequencies.to_offset(freq)
                
            last_timestamp = df.index[-1]
            future_timestamps = [last_timestamp + (delta * i) for i in range(1, request.forecast_periods + 1)]
            
            forecast_data = []
            for ts, val in zip(future_timestamps, forecast):
                # Basic standard deviation of residuals for confidence interval
                std_dev = fit_model.resid.std()
                margin_of_error = 1.96 * std_dev # 95% confidence roughly
                
                forecast_data.append(ForecastDataPoint(
                    timestamp=ts,
                    predicted_value=val,
                    lower_bound=val - margin_of_error,
                    upper_bound=val + margin_of_error
                ))
                
            algo_used = "exponential_smoothing"

        except Exception as e:
            logger.error(f"Failed to generate forecast with statsmodels: {e}")
            # Fallback to simple naive forecast (last value)
            logger.info("Falling back to naive forecast.")
            last_val = df["value"].iloc[-1]
            last_timestamp = df.index[-1]
            
            # Try to infer delta
            if len(df.index) >= 2:
                delta = df.index[-1] - df.index[-2]
            else:
                delta = pd.Timedelta(days=1)
                
            future_timestamps = [last_timestamp + (delta * i) for i in range(1, request.forecast_periods + 1)]
            
            forecast_data = []
            for ts in future_timestamps:
                forecast_data.append(ForecastDataPoint(
                    timestamp=ts,
                    predicted_value=last_val,
                    lower_bound=last_val * 0.9,
                    upper_bound=last_val * 1.1
                ))
            algo_used = "naive_fallback"

        return ForecastResponse(
            metric_name=request.metric_name,
            algorithm_used=algo_used,
            forecast_data=forecast_data,
            created_at=datetime.now(timezone.utc)
        )
