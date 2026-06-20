import os
import json
import logging
from typing import List, Dict, Any
from datetime import datetime, timezone
from fastapi import HTTPException
from backend.services.dataset_service import _is_mock_mode, get_supabase_client

logger = logging.getLogger(__name__)

LOCAL_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp")
LOCAL_CHATS_PATH = os.path.join(LOCAL_DB_DIR, "local-chats.json")

def _load_mock_chats() -> List[Dict[str, Any]]:
    if not os.path.exists(LOCAL_DB_DIR):
        os.makedirs(LOCAL_DB_DIR, exist_ok=True)
    if os.path.exists(LOCAL_CHATS_PATH):
        try:
            with open(LOCAL_CHATS_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def _save_mock_chats(data: List[Dict[str, Any]]):
    with open(LOCAL_CHATS_PATH, "w") as f:
        json.dump(data, f, indent=2)

async def get_chat_history(user_id: str, dataset_id: str) -> List[Dict[str, Any]]:
    """Retrieve chat history for a specific user and dataset."""
    if _is_mock_mode():
        chats = _load_mock_chats()
        history = [c for c in chats if c.get("user_id") == user_id and c.get("dataset_id") == dataset_id]
        # Sort by created_at
        return sorted(history, key=lambda x: x.get("created_at", ""))

    try:
        async with get_supabase_client() as client:
            res = await client.get(
                f"/rest/v1/chats?user_id=eq.{user_id}&dataset_id=eq.{dataset_id}&order=created_at.asc"
            )
            if res.status_code >= 400:
                logger.warning(f"Failed to fetch chat history: {res.text}")
                return []
            return res.json()
    except Exception as e:
        logger.error(f"Error fetching chat history: {e}")
        return []

async def save_chat_message(user_id: str, dataset_id: str, message: Dict[str, Any]) -> Dict[str, Any]:
    """Save a single chat message to the history."""
    record = {
        "id": message.get("id"),
        "user_id": user_id,
        "dataset_id": dataset_id,
        "role": message.get("role"),
        "content": message.get("content"),
        "references": message.get("references", []),
        "suggested_questions": message.get("suggested_questions", []),
        "created_at": message.get("created_at", datetime.now(timezone.utc).isoformat())
    }

    if _is_mock_mode():
        chats = _load_mock_chats()
        chats.append(record)
        _save_mock_chats(chats)
        return record

    try:
        async with get_supabase_client() as client:
            res = await client.post(
                "/rest/v1/chats",
                json=record,
                headers={"Prefer": "return=representation"}
            )
            if res.status_code >= 400:
                logger.error(f"Failed to save chat message: {res.text}")
                # We do not raise here to prevent failing the chat completion if DB insert fails
            else:
                return res.json()[0]
    except Exception as e:
        logger.error(f"Error saving chat message: {e}")
        
    return record
