# Doctor Scan Review CLI

An idiomatic Python rewrite of the Doctor Scan Review app. The project now ships as a command-line workflow that preserves the original review logic (mark scans healthy/sick, undo decisions, and view progress) while using Python data classes and Typer for a straightforward interface.

## Getting started

1. Install typer.

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install the project in editable mode:
   ```bash
   pip install -e .
   ```
4. Run the CLI:
   ```bash
   doctor-scan-review
   ```

The default invocation shows the current scan and progress. Additional commands:

- Mark a scan: `doctor-scan-review mark healthy` or `doctor-scan-review mark sick`
- Undo last decision: `doctor-scan-review undo`
- View recent reviews: `doctor-scan-review recent --limit 5`

## Development notes

The core review behavior lives in `src/doctor_scan_review/session.py` with immutable models in `src/doctor_scan_review/models.py` and seed data in `src/doctor_scan_review/data.py`. The `doctor-scan-review` console script is registered in `pyproject.toml`.
