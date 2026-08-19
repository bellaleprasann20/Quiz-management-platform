from datetime import datetime

def calculate_time_spent(start_time: datetime, end_time: datetime) -> int:
    """Returns the time spent in seconds between two datetimes."""
    if not start_time or not end_time:
        return 0
    time_diff = end_time - start_time
    return int(time_diff.total_seconds())

def format_duration(seconds: int) -> str:
    """Converts raw seconds into a human-readable format (e.g., '14m 30s')."""
    if seconds < 0:
        return "0s"
        
    minutes, secs = divmod(seconds, 60)
    if minutes > 0:
        return f"{minutes}m {secs}s"
    return f"{secs}s"