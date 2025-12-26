"""Seed data for the scan review CLI."""

from datetime import date
from typing import Iterable

from .models import Scan


def load_default_scans() -> Iterable[Scan]:
    """Return the default mock scans used by the demo CLI."""

    return [
        Scan(
            id="1",
            patient_id="PT-2024-001",
            patient_name="Sarah Johnson",
            age=45,
            gender="Female",
            scan_type="PET/CT",
            scan_date=date(2024, 12, 24),
            image_url=(
                "https://images.unsplash.com/photo-1706065638524-eb52e7165abf"
                "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                "&ixlib=rb-4.1.0&q=80&w=1080"
            ),
            body_part="Chest",
        ),
        Scan(
            id="2",
            patient_id="PT-2024-002",
            patient_name="Michael Chen",
            age=62,
            gender="Male",
            scan_type="PET Scan",
            scan_date=date(2024, 12, 24),
            image_url=(
                "https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca"
                "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                "&ixlib=rb-4.1.0&q=80&w=1080"
            ),
            body_part="Full Body",
        ),
        Scan(
            id="3",
            patient_id="PT-2024-003",
            patient_name="Emma Davis",
            age=38,
            gender="Female",
            scan_type="Brain MRI",
            scan_date=date(2024, 12, 25),
            image_url=(
                "https://images.unsplash.com/photo-1758691463569-66de91d76452"
                "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                "&ixlib=rb-4.1.0&q=80&w=1080"
            ),
            body_part="Brain",
        ),
        Scan(
            id="4",
            patient_id="PT-2024-004",
            patient_name="Robert Wilson",
            age=55,
            gender="Male",
            scan_type="Chest X-Ray",
            scan_date=date(2024, 12, 25),
            image_url=(
                "https://images.unsplash.com/photo-1584555684040-bad07f46a21f"
                "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                "&ixlib=rb-4.1.0&q=80&w=1080"
            ),
            body_part="Chest",
        ),
        Scan(
            id="5",
            patient_id="PT-2024-005",
            patient_name="Lisa Martinez",
            age=51,
            gender="Female",
            scan_type="CT Scan",
            scan_date=date(2024, 12, 26),
            image_url=(
                "https://images.unsplash.com/photo-1631563020912-213371f1d768"
                "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                "&ixlib=rb-4.1.0&q=80&w=1080"
            ),
            body_part="Abdomen",
        ),
    ]


__all__ = ["load_default_scans"]
