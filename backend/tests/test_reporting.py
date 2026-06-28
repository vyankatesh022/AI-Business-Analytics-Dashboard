import pytest
import uuid
from src.domains.reporting.models import (
    ReportCreate, ReportUpdate, ReportType, ReportStatus,
    ReportExportCreate, ExportFormat,
    ReportScheduleCreate, ScheduleType,
    ReportShareCreate, ShareType
)
from src.domains.reporting.services import ReportingService

class MockReportRepository:
    def __init__(self):
        self.reports = {}
        self.exports = {}
        self.schedules = {}
        self.shares = {}

    async def create_report(self, account_id, author_id, data):
        report_id = uuid.uuid4()
        report = {
            "id": report_id,
            "account_id": account_id,
            "author_id": author_id,
            "title": data.title,
            "description": data.description,
            "report_type": data.report_type,
            "status": ReportStatus.DRAFT,
            "version": 1,
            "blocks": data.blocks,
            "created_at": "now",
            "updated_at": "now"
        }
        self.reports[(account_id, report_id)] = report
        return report

    async def get_report(self, account_id, report_id):
        return self.reports.get((account_id, report_id))
        
    async def list_reports(self, account_id, skip=0, limit=50):
        return [r for (aid, rid), r in self.reports.items() if aid == account_id]

    async def update_report(self, account_id, report_id, data, author_id):
        if (account_id, report_id) in self.reports:
            r = self.reports[(account_id, report_id)]
            r['title'] = data.title
            r['status'] = data.status or r['status']
            r['version'] += 1
            return r
        return None

    async def delete_report(self, account_id, report_id):
        if (account_id, report_id) in self.reports:
            del self.reports[(account_id, report_id)]
            return True
        return False

@pytest.fixture
def service():
    repo = MockReportRepository()
    return ReportingService(repo)

@pytest.mark.asyncio
async def test_create_and_get_report(service):
    account_id = uuid.uuid4()
    author_id = uuid.uuid4()
    data = ReportCreate(title="Q3 Exec", report_type=ReportType.EXECUTIVE, blocks=[])
    
    report = await service.create_report(account_id, author_id, data)
    assert report['title'] == "Q3 Exec"
    
    fetched = await service.get_report(account_id, report['id'])
    assert fetched['title'] == "Q3 Exec"

@pytest.mark.asyncio
async def test_tenant_isolation(service):
    account_1 = uuid.uuid4()
    account_2 = uuid.uuid4()
    author = uuid.uuid4()
    
    # Create in account 1
    data = ReportCreate(title="Account 1 Report")
    report = await service.create_report(account_1, author, data)
    
    # Try fetch from account 2
    fetched = await service.get_report(account_2, report['id'])
    assert fetched is None
    
    # Try list from account 2
    reports_acc2 = await service.list_reports(account_2)
    assert len(reports_acc2) == 0

@pytest.mark.asyncio
async def test_update_report(service):
    account_id = uuid.uuid4()
    author_id = uuid.uuid4()
    data = ReportCreate(title="Draft")
    report = await service.create_report(account_id, author_id, data)
    assert report['version'] == 1
    assert report['status'] == ReportStatus.DRAFT
    
    update_data = ReportUpdate(title="Final", status=ReportStatus.PUBLISHED, blocks=[])
    updated = await service.update_report(account_id, report['id'], update_data, author_id)
    
    assert updated['title'] == "Final"
    assert updated['status'] == ReportStatus.PUBLISHED
    assert updated['version'] == 2
