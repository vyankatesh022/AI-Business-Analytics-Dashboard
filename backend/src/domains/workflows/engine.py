import logging
from uuid import UUID
from typing import Dict, Any, List
import time
from .repositories import WorkflowRepository
from ...database.connection import get_db_dsn

logger = logging.getLogger(__name__)

async def execute_action_node(node: Dict[str, Any], payload: Dict[str, Any]) -> Dict[str, Any]:
    # In a real system, this would branch to specific action implementations
    # like sending an email, calling an API, generating AI insight, etc.
    action_type = node.get('data', {}).get('actionType')
    logger.info(f"Executing action {action_type} for node {node.get('id')}")
    # Simulating work
    time.sleep(1)
    return {"status": "SUCCESS"}

async def execute_condition_node(node: Dict[str, Any], payload: Dict[str, Any]) -> bool:
    # Simulating condition evaluation (e.g. revenue > 1000)
    logger.info(f"Evaluating condition for node {node.get('id')}")
    return True

async def execute_workflow_dag(ctx, account_id: str, workflow_id: str, execution_id: str, trigger_payload: dict):
    """
    Main worker task for ARQ. Evaluates the DAG and executes nodes.
    """
    dsn = get_db_dsn()
    repo = WorkflowRepository(dsn)
    
    try:
        # 1. Update execution status to RUNNING
        repo.update_execution(UUID(account_id), UUID(execution_id), status="RUNNING")
        
        # 2. Fetch Workflow
        workflow = repo.get_workflow(UUID(account_id), UUID(workflow_id))
        if not workflow:
            raise Exception("Workflow not found")
            
        nodes = workflow.get('nodes', [])
        edges = workflow.get('edges', [])
        
        # 3. Build DAG representation
        node_map = {n['id']: n for n in nodes}
        adjacency_list = {n['id']: [] for n in nodes}
        for edge in edges:
            if edge['source'] in adjacency_list:
                adjacency_list[edge['source']].append(edge['target'])
                
        # Find trigger node
        trigger_nodes = [n for n in nodes if n.get('type') == 'trigger']
        if not trigger_nodes:
            raise Exception("No trigger node found")
            
        current_nodes = [trigger_nodes[0]['id']]
        processed = set()
        
        payload = trigger_payload.copy()
        
        # 4. Traverse and execute DAG
        while current_nodes:
            next_nodes = []
            for node_id in current_nodes:
                if node_id in processed:
                    continue
                    
                node = node_map.get(node_id)
                if not node:
                    continue
                    
                start_time = time.time()
                status = "SUCCESS"
                error_msg = None
                
                try:
                    node_type = node.get('type')
                    if node_type == 'action':
                        await execute_action_node(node, payload)
                    elif node_type == 'condition':
                        result = await execute_condition_node(node, payload)
                        # If false, we might want to branch or halt.
                        # For simplicity, we just continue along edges if true
                        if not result:
                            status = "SKIPPED"
                except Exception as e:
                    status = "FAILED"
                    error_msg = str(e)
                finally:
                    duration_ms = int((time.time() - start_time) * 1000)
                    if status != "SKIPPED":
                        repo.log_audit(
                            UUID(account_id), UUID(execution_id), node_id, 
                            status, duration_ms, error_msg
                        )
                
                processed.add(node_id)
                
                # If this node failed, depending on retry logic, we might halt
                if status == "FAILED":
                    raise Exception(f"Node {node_id} failed: {error_msg}")
                    
                if status != "SKIPPED":
                    next_nodes.extend(adjacency_list.get(node_id, []))
                    
            current_nodes = next_nodes
            
        # 5. Complete execution
        repo.update_execution(UUID(account_id), UUID(execution_id), status="COMPLETED")
        
    except Exception as e:
        logger.error(f"Execution {execution_id} failed: {e}")
        repo.update_execution(UUID(account_id), UUID(execution_id), status="FAILED", error=str(e))
