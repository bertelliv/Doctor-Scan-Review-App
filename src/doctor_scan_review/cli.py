"""Command line entrypoint for the scan review workflow."""

from __future__ import annotations

from typing import Optional

import typer
from rich import box
from rich.console import Console
from rich.table import Table

from . import ReviewDecision, ReviewSession, load_default_scans

app = typer.Typer(help="Quickly classify scans as healthy or sick.")
console = Console()


def _format_scan_table(session: ReviewSession) -> Table:
    table = Table(title="Current Scan", box=box.SIMPLE_HEAVY)
    table.add_column("Field", style="bold")
    table.add_column("Value")

    scan = session.current_scan
    if scan is None:
        table.add_row("Status", "No scans remaining")
        return table

    table.add_row("Patient", scan.patient_name)
    table.add_row("Patient ID", scan.patient_id)
    table.add_row("Age", str(scan.age))
    table.add_row("Gender", scan.gender)
    table.add_row("Scan Type", scan.scan_type)
    table.add_row("Body Part", scan.body_part)
    table.add_row("Scan Date", scan.scan_date.isoformat())
    table.add_row("Image URL", scan.image_url)
    return table


def _format_summary_table(session: ReviewSession) -> Table:
    table = Table(title="Progress", box=box.SIMPLE_HEAVY)
    table.add_column("Metric", style="bold")
    table.add_column("Value")

    summary = session.summary()
    table.add_row("Reviewed", str(summary["reviewed"]))
    table.add_row("Healthy", str(summary["healthy"]))
    table.add_row("Sick", str(summary["sick"]))
    table.add_row("Remaining", str(summary["remaining"]))
    return table


def _render_recent(session: ReviewSession, limit: int = 5) -> None:
    recent_reviews = list(session.recent_reviews(limit))
    if not recent_reviews:
        console.print("No recent reviews yet.")
        return

    table = Table(title=f"Most Recent {len(recent_reviews)} Reviews", box=box.SIMPLE)
    table.add_column("Patient", style="bold")
    table.add_column("Decision")
    table.add_column("Reviewed At")

    for review in recent_reviews:
        decision_color = "green" if review.decision is ReviewDecision.HEALTHY else "red"
        decision_label = f"[{decision_color}]{review.decision.label()}[/{decision_color}]"
        table.add_row(review.patient_name, decision_label, review.timestamp.isoformat(timespec="seconds"))

    console.print(table)


def _get_session(ctx: typer.Context) -> ReviewSession:
    # ctx.obj is where shared state lives in Typer/Click
    if ctx.obj is None:
        raise typer.BadParameter("App context not initialized.")
    return ctx.obj["session"]


@app.command()
def status(ctx: typer.Context) -> None:
    """Show the current scan and review progress."""
    session = _get_session(ctx)
    console.print(_format_scan_table(session))
    console.print(_format_summary_table(session))


@app.command()
def mark(ctx: typer.Context, decision: ReviewDecision) -> None:
    """Mark the current scan as healthy or sick."""
    session = _get_session(ctx)
    review = session.record_decision(decision)
    console.print(
        f"Recorded {decision.label().lower()} for {review.patient_name} at {review.timestamp:%Y-%m-%d %H:%M:%S}."
    )
    console.print(_format_summary_table(session))


@app.command()
def undo(ctx: typer.Context) -> None:
    """Undo the most recent review, if any."""
    session = _get_session(ctx)
    undone = session.undo()
    if undone is None:
        console.print("No reviews to undo.")
        return
    console.print(f"Removed last decision for {undone.patient_name} made at {undone.timestamp:%Y-%m-%d %H:%M:%S}.")
    console.print(_format_summary_table(session))


@app.command("recent")
def recent_reviews(
    ctx: typer.Context,
    limit: int = typer.Option(5, help="Number of recent reviews to show."),
) -> None:
    """Display the most recent decisions."""
    session = _get_session(ctx)
    _render_recent(session, limit=limit)


@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    seed: Optional[int] = typer.Option(None, help="Placeholder to mirror original app state."),
) -> None:
    """Initialize a review session and optionally show status."""
    ctx.ensure_object(dict)

    # Lazy init of session so commands reuse one instance *for this process run*.
    if "session" not in ctx.obj:
        ctx.obj["session"] = ReviewSession(load_default_scans())

    if ctx.invoked_subcommand is None:
        status(ctx)


if __name__ == "__main__":
    app()

