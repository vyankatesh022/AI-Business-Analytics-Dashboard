import json
import logging
import asyncio
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
import redis.asyncio as redis
from pydantic import BaseModel

from .models import (
    DashboardCreate, DashboardResponse,
    KPICreate, KPIResponse, KPIResult,
    CohortCreate, CohortResponse, CohortResultCell,
    FunnelCreate, FunnelResponse, FunnelResultStep,
    SegmentCreate, SegmentResponse, SegmentResult,
    RevenueTrendResult, RevenueTrendDataPoint,
    RetentionCurveResult, RetentionCurveDataPoint
)
from .repositories import AnalyticsRepository
from ...database.connection import get_db_connection

logger = logging.getLogger(__name__)

# Basic Cache Wrapper
class AnalyticsCache:
    def __init__(self):
        # We will use a fallback memory dict if redis isn't available
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        self.memory_fallback = {}
    
    async def get(self, key: str) -> Optional[str]:
        try:
            return await self.redis_client.get(key)
        except Exception as e:
            logger.warning(f"Redis get failed for {key}: {e}")
            return self.memory_fallback.get(key)
            
    async def set(self, key: str, value: str, ex: int = 300):
        try:
            await self.redis_client.set(key, value, ex=ex)
        except Exception as e:
            logger.warning(f"Redis set failed for {key}: {e}")
            self.memory_fallback[key] = value

analytics_cache = AnalyticsCache()

class AnalyticsEngineService:
    """Service layer for Analytics calculations, caching, and CRUD."""
    
    def __init__(self):
        self.repo = AnalyticsRepository()
        self.cache = analytics_cache

    async def create_dashboard(self, account_id: UUID, data: DashboardCreate) -> DashboardResponse:
        return await self.repo.create_dashboard(account_id, data)

    async def get_dashboards(self, account_id: UUID) -> List[DashboardResponse]:
        return await self.repo.get_dashboards(account_id)
        
    async def get_dashboard(self, account_id: UUID, dashboard_id: UUID) -> Optional[DashboardResponse]:
        return await self.repo.get_dashboard_by_id(account_id, dashboard_id)

    async def create_kpi(self, account_id: UUID, data: KPICreate) -> KPIResponse:
        return await self.repo.create_kpi(account_id, data)
        
    async def create_cohort(self, account_id: UUID, data: CohortCreate) -> CohortResponse:
        return await self.repo.create_cohort(account_id, data)
        
    async def create_funnel(self, account_id: UUID, data: FunnelCreate) -> FunnelResponse:
        return await self.repo.create_funnel(account_id, data)

    async def create_segment(self, account_id: UUID, data: SegmentCreate) -> SegmentResponse:
        return await self.repo.create_segment(account_id, data)

    async def get_segments(self, account_id: UUID) -> List[SegmentResponse]:
        return await self.repo.get_segments(account_id)

    async def get_segment(self, account_id: UUID, segment_id: UUID) -> Optional[SegmentResponse]:
        return await self.repo.get_segment_by_id(account_id, segment_id)

    # Execution Engines
    
    async def calculate_kpi(self, account_id: UUID, kpi_id: UUID) -> KPIResult:
        cache_key = f"kpi:{account_id}:{kpi_id}"
        cached = await self.cache.get(cache_key)
        if cached:
            data = json.loads(cached)
            return KPIResult(**data)
            
        # In a real scenario, this executes parameterized SQL against the workspace dataset tables
        # For this demonstration platform, we mock the dynamic query execution
        logger.info(f"Executing KPI Engine calculation for KPI {kpi_id}")
        await asyncio.sleep(0.2) # Simulate processing < 500ms
        
        result = KPIResult(
            value=12540.50,
            previous_value=11200.00,
            trend=11.96
        )
        
        await self.cache.set(cache_key, result.model_dump_json(), ex=300)
        return result

    async def calculate_cohort(self, account_id: UUID, cohort_id: UUID) -> List[CohortResultCell]:
        cache_key = f"cohort:{account_id}:{cohort_id}"
        cached = await self.cache.get(cache_key)
        if cached:
            data = json.loads(cached)
            return [CohortResultCell(**item) for item in data]
            
        logger.info(f"Executing Cohort Engine calculation for {cohort_id}")
        await asyncio.sleep(0.3)
        
        results = [
            CohortResultCell(cohort_date="2026-06-01", period=0, users=1000, retention_rate=100.0),
            CohortResultCell(cohort_date="2026-06-01", period=1, users=400, retention_rate=40.0),
            CohortResultCell(cohort_date="2026-06-01", period=2, users=250, retention_rate=25.0),
            CohortResultCell(cohort_date="2026-06-08", period=0, users=1200, retention_rate=100.0),
            CohortResultCell(cohort_date="2026-06-08", period=1, users=540, retention_rate=45.0),
        ]
        
        await self.cache.set(cache_key, json.dumps([r.model_dump() for r in results]), ex=300)
        return results

    async def calculate_funnel(self, account_id: UUID, funnel_id: UUID) -> List[FunnelResultStep]:
        cache_key = f"funnel:{account_id}:{funnel_id}"
        cached = await self.cache.get(cache_key)
        if cached:
            data = json.loads(cached)
            return [FunnelResultStep(**item) for item in data]
            
        logger.info(f"Executing Funnel Engine calculation for {funnel_id}")
        await asyncio.sleep(0.3)
        
        results = [
            FunnelResultStep(step_name="Sign Up", users=5000, conversion_rate=100.0),
            FunnelResultStep(step_name="Complete Profile", users=3000, conversion_rate=60.0),
            FunnelResultStep(step_name="Create Dashboard", users=1500, conversion_rate=50.0),
            FunnelResultStep(step_name="Upgrade Plan", users=150, conversion_rate=10.0),
        ]
        
        await self.cache.set(cache_key, json.dumps([r.model_dump() for r in results]), ex=300)
        return results

    async def calculate_segment(self, account_id: UUID, segment_id: UUID) -> SegmentResult:
        cache_key = f"segment:{account_id}:{segment_id}"
        cached = await self.cache.get(cache_key)
        if cached:
            return SegmentResult(**json.loads(cached))
            
        logger.info(f"Executing Segment Engine calculation for {segment_id}")
        await asyncio.sleep(0.1)
        
        result = SegmentResult(
            segment_size=12500,
            percentage_of_total=25.5
        )
        
        await self.cache.set(cache_key, result.model_dump_json(), ex=300)
        return result

    async def calculate_revenue_metrics(self, account_id: UUID) -> RevenueTrendResult:
        cache_key = f"revenue:{account_id}:trend"
        cached = await self.cache.get(cache_key)
        if cached:
            return RevenueTrendResult(**json.loads(cached))
            
        logger.info(f"Executing Revenue Engine calculation for {account_id}")
        await asyncio.sleep(0.3)
        
        result = RevenueTrendResult(
            current_mrr=52000.0,
            mrr_growth_rate=15.2,
            data=[
                RevenueTrendDataPoint(date="2026-01-01", revenue=40000.0, mrr=40000.0, arr=480000.0),
                RevenueTrendDataPoint(date="2026-02-01", revenue=42000.0, mrr=42000.0, arr=504000.0),
                RevenueTrendDataPoint(date="2026-03-01", revenue=45000.0, mrr=45000.0, arr=540000.0),
                RevenueTrendDataPoint(date="2026-04-01", revenue=48000.0, mrr=48000.0, arr=576000.0),
                RevenueTrendDataPoint(date="2026-05-01", revenue=52000.0, mrr=52000.0, arr=624000.0)
            ]
        )
        
        await self.cache.set(cache_key, result.model_dump_json(), ex=300)
        return result

    async def calculate_retention_metrics(self, account_id: UUID) -> RetentionCurveResult:
        cache_key = f"retention:{account_id}:curve"
        cached = await self.cache.get(cache_key)
        if cached:
            return RetentionCurveResult(**json.loads(cached))
            
        logger.info(f"Executing Retention Engine calculation for {account_id}")
        await asyncio.sleep(0.2)
        
        result = RetentionCurveResult(
            overall_retention_rate=65.5,
            curve=[
                RetentionCurveDataPoint(day=0, retention_rate=100.0),
                RetentionCurveDataPoint(day=1, retention_rate=80.0),
                RetentionCurveDataPoint(day=7, retention_rate=65.0),

    async def analyze_file(self, account_id: UUID, file_content: bytes, filename: str) -> FileAnalysisResult:
        import csv
        import io
        
        # Decode file content
        try:
            content_str = file_content.decode('utf-8')
        except UnicodeDecodeError:
            content_str = file_content.decode('latin-1')
            
        reader = csv.reader(io.StringIO(content_str))
        headers = next(reader, [])
        
        rows = []
        for row in reader:
            if row:
                rows.append(row)
                
        row_count = len(rows)
        column_count = len(headers)
        
        # Build metadata
        columns_meta = []
        for i, header in enumerate(headers):
            # Simple type inference
            is_numeric = True
            missing = 0
            uniques = set()
            for r in rows:
                if i < len(r):
                    val = r[i]
                    if not val.strip():
                        missing += 1
                    else:
                        uniques.add(val)
                        try:
                            float(val)
                        except ValueError:
                            is_numeric = False
            
            columns_meta.append(ColumnMetadata(
                name=header,
                type="numeric" if is_numeric and len(uniques) > 0 else "categorical",
                missing_count=missing,
                unique_count=len(uniques)
            ))
            
        # Build preview (first 5 rows)
        preview = []
        for r in rows[:5]:
            row_dict = {}
            for i, header in enumerate(headers):
                if i < len(r):
                    row_dict[header] = r[i]
            preview.append(row_dict)
            
        return FileAnalysisResult(
            filename=filename,
            row_count=row_count,
            column_count=column_count,
            columns=columns_meta,
            preview=preview
        )
