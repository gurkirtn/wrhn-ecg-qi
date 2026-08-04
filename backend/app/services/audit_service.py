from datetime import datetime, timezone


def audit_event(action: str, resource_id: str) -> dict[str, str]:
    return {"action": action, "resource_id": resource_id, "timestamp": datetime.now(timezone.utc).isoformat()}
