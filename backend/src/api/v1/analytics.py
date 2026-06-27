from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from uuid import UUID
import logging

from ...security.auth import get_current_user
from ...security.rbac import require_permissions
from ...security.context import get_security_context, SecurityContext
from ...security.audit import log_audit_event
from ...domains.analytics.models import (
    DashboardCreate, DashboardResponse,
    KPICreate, KPIResponse, KPIResult,
    CohortCreate, CohortResponse, CohortResultCell,
    FunnelCreate, FunnelResponse, FunnelResultStep
)
from ...domains.analytics.services import AnalyticsEngineService

router = APIRouter(prefix="/analytics", tags=["Analytics"])
logger = logging.getLogger(__name__)

def get_analytics_service() -> AnalyticsEngineService:
    return AnalyticsEngineService()

@router.post("/dashboards", response_model=DashboardResponse, dependencies=[Depends(require_permissions(["analytics.write"]))])
async def create_dashboard(
    request: Request,
    data: DashboardCreate,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    dashboard = await service.create_dashboard(context.tenant_id, data)
    await log_audit_event("create_dashboard", "dashboard", str(dashboard.id), request)
    return dashboard

@router.get("/dashboards", response_model=List[DashboardResponse], dependencies=[Depends(require_permissions(["analytics.read"]))])
async def list_dashboards(
    request: Request,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    await log_audit_event("list_dashboards", "dashboard", None, request)
    return await service.get_dashboards(context.tenant_id)

@router.get("/dashboards/{dashboard_id}", response_model=DashboardResponse, dependencies=[Depends(require_permissions(["analytics.read"]))])
async def get_dashboard(
    dashboard_id: UUID,
    request: Request,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    dashboard = await service.get_dashboard(context.tenant_id, dashboard_id)
    if not dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    await log_audit_event("read_dashboard", "dashboard", str(dashboard_id), request)
    return dashboard

@router.post("/kpis", response_model=KPIResponse, dependencies=[Depends(require_permissions(["analytics.write"]))])
async def create_kpi(
    request: Request,
    data: KPICreate,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    kpi = await service.create_kpi(context.tenant_id, data)
    await log_audit_event("create_kpi", "kpi", str(kpi.id), request)
    return kpi

@router.get("/kpis/{kpi_id}/calculate", response_model=KPIResult, dependencies=[Depends(require_permissions(["analytics.read"]))])
async def calculate_kpi(
    kpi_id: UUID,
    request: Request,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    await log_audit_event("calculate_kpi", "kpi", str(kpi_id), request)
    return await service.calculate_kpi(context.tenant_id, kpi_id)

@router.post("/cohorts", response_model=CohortResponse, dependencies=[Depends(require_permissions(["analytics.write"]))])
async def create_cohort(
    request: Request,
    data: CohortCreate,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    cohort = await service.create_cohort(context.tenant_id, data)
    await log_audit_event("create_cohort", "cohort", str(cohort.id), request)
    return cohort

@router.get("/cohorts/{cohort_id}/calculate", response_model=List[CohortResultCell], dependencies=[Depends(require_permissions(["analytics.read"]))])
async def calculate_cohort(
    cohort_id: UUID,
    request: Request,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    await log_audit_event("calculate_cohort", "cohort", str(cohort_id), request)
    return await service.calculate_cohort(context.tenant_id, cohort_id)

@router.post("/funnels", response_model=FunnelResponse, dependencies=[Depends(require_permissions(["analytics.write"]))])
async def create_funnel(
    request: Request,
    data: FunnelCreate,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    funnel = await service.create_funnel(context.tenant_id, data)
    await log_audit_event("create_funnel", "funnel", str(funnel.id), request)
    return funnel

@router.get("/funnels/{funnel_id}/calculate", response_model=List[FunnelResultStep], dependencies=[Depends(require_permissions(["analytics.read"]))])
async def calculate_funnel(
    funnel_id: UUID,
    request: Request,
    context: SecurityContext = Depends(get_security_context),
    service: AnalyticsEngineService = Depends(get_analytics_service)
):
    await log_audit_event("calculate_funnel", "funnel", str(funnel_id), request)
    return await service.calculate_funnel(context.tenant_id, funnel_id)
