from datetime import datetime, timedelta
import sys
import os

# Ensure src module can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from src.domains.anomaly.models import AnomalyRequest, TimeSeriesPoint
from src.domains.anomaly.services import AnomalyService

def run_test():
    print("Generating mock historical data with spikes...")
    now = datetime.now()
    historical_data = []
    
    # 60 days of normal data around 100
    for i in range(60):
        dt = now - timedelta(days=(60 - i))
        val = 100.0
        # Add a big spike at day 30
        if i == 30:
            val = 250.0
        historical_data.append(TimeSeriesPoint(timestamp=dt, value=val))
        
    request = AnomalyRequest(
        metric_name="mock_traffic",
        data=historical_data,
        algorithm="zscore",
        sensitivity=2.5
    )
    
    print("Testing AnomalyService...")
    service = AnomalyService()
    try:
        response = service.detect_anomalies(request)
        print("\n=== SUCCESS ===")
        print(f"Metric: {response.metric_name}")
        print(f"Algorithm Used: {response.algorithm_used}")
        print(f"Total Anomalies Found: {response.total_anomalies}")
        for data in response.data:
            if data.is_anomaly:
                print(f" - [ANOMALY] {data.timestamp.strftime('%Y-%m-%d')}: {data.value:.2f} (Score: {data.anomaly_score:.2f})")
    except Exception as e:
        print(f"\n=== ERROR ===")
        print(f"Error during anomaly detection: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_test()
