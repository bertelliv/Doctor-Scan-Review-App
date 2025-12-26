"""Stateful review session logic."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Iterable, List, Sequence

from .models import Review, ReviewDecision, Scan


@dataclass
class ReviewSession:
    """Encapsulate review progress for a set of scans."""

    scans: Sequence[Scan]
    reviews: List[Review] = field(default_factory=list)
    current_index: int = 0

    def __post_init__(self) -> None:
        self.scans = list(self.scans)

    @property
    def current_scan(self) -> Scan | None:
        """Return the scan at the current index, if available."""

        if self.current_index >= len(self.scans):
            return None
        return self.scans[self.current_index]

    @property
    def remaining(self) -> int:
        """Return the number of scans left to review."""

        return max(len(self.scans) - self.current_index, 0)

    def record_decision(self, decision: ReviewDecision) -> Review:
        """Record a decision for the current scan and advance the index."""

        scan = self.current_scan
        if scan is None:
            raise IndexError("No scans left to review.")

        review = Review(
            scan_id=scan.id,
            patient_name=scan.patient_name,
            decision=decision,
            timestamp=datetime.now(),
        )
        self.reviews.append(review)
        self.current_index += 1
        return review

    def mark_healthy(self) -> Review:
        """Mark the current scan as healthy."""

        return self.record_decision(ReviewDecision.HEALTHY)

    def mark_sick(self) -> Review:
        """Mark the current scan as sick."""

        return self.record_decision(ReviewDecision.SICK)

    def undo(self) -> Review | None:
        """Undo the most recent review and rewind the index."""

        if not self.reviews:
            return None

        last_review = self.reviews.pop()
        self.current_index = max(self.current_index - 1, 0)
        return last_review

    def healthy_count(self) -> int:
        """Count scans marked as healthy."""

        return sum(review.decision is ReviewDecision.HEALTHY for review in self.reviews)

    def sick_count(self) -> int:
        """Count scans marked as sick."""

        return sum(review.decision is ReviewDecision.SICK for review in self.reviews)

    def summary(self) -> dict[str, int]:
        """Return aggregate statistics for the session."""

        return {
            "reviewed": len(self.reviews),
            "healthy": self.healthy_count(),
            "sick": self.sick_count(),
            "remaining": self.remaining,
        }

    def recent_reviews(self, limit: int = 5) -> Iterable[Review]:
        """Yield the most recent reviews, newest first."""

        for review in reversed(self.reviews[-limit:]):
            yield review


__all__ = ["ReviewSession"]
