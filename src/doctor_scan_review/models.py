"""Domain models for scan review."""

from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum
from typing import Literal


class ReviewDecision(str, Enum):
    """Supported review outcomes for a scan."""

    HEALTHY: Literal["healthy"] = "healthy"
    SICK: Literal["sick"] = "sick"

    def label(self) -> str:
        """Return a human-friendly label."""

        return "Healthy" if self is ReviewDecision.HEALTHY else "Sick"


@dataclass(frozen=True)
class Scan:
    """A medical scan awaiting review."""

    id: str
    patient_id: str
    patient_name: str
    age: int
    gender: str
    scan_type: str
    scan_date: date
    image_url: str
    body_part: str


@dataclass(frozen=True)
class Review:
    """An individual review decision for a scan."""

    scan_id: str
    patient_name: str
    decision: ReviewDecision
    timestamp: datetime


__all__ = ["ReviewDecision", "Scan", "Review"]
