"""Streamlit UI for reviewing mock medical scans."""

from __future__ import annotations

import streamlit as st

from doctor_scan_review import ReviewDecision, ReviewSession, load_default_scans


def _init_session() -> ReviewSession:
    """Create or return the persistent ReviewSession for the Streamlit app."""

    if "review_session" not in st.session_state:
        st.session_state.review_session = ReviewSession(load_default_scans())
    return st.session_state.review_session


def _record_decision(session: ReviewSession, decision: ReviewDecision) -> None:
    """Record a decision and show a confirmation toast."""

    review = session.record_decision(decision)
    st.toast(
        f"Recorded {decision.label().lower()} for {review.patient_name} at"
        f" {review.timestamp:%Y-%m-%d %H:%M:%S}.",
    )


def _render_summary(session: ReviewSession) -> None:
    summary = session.summary()
    st.subheader("Progress")
    cols = st.columns(4)
    cols[0].metric("Reviewed", summary["reviewed"])
    cols[1].metric("Healthy", summary["healthy"], help="Marked healthy")
    cols[2].metric("Sick", summary["sick"], help="Marked sick")
    cols[3].metric("Remaining", summary["remaining"])



def _render_current_scan(session: ReviewSession) -> None:
    scan = session.current_scan
    st.subheader("Current Scan")
    if scan is None:
        st.info("No scans remaining. Great work!")
        return

    left, right = st.columns([2, 1])
    with left:
        st.image(scan.image_url, caption=f"Scan of {scan.body_part}", use_column_width=True)
    with right:
        st.markdown(
            f"**Patient:** {scan.patient_name}\n\n"
            f"**Patient ID:** {scan.patient_id}\n\n"
            f"**Age:** {scan.age}\n\n"
            f"**Gender:** {scan.gender}\n\n"
            f"**Scan Type:** {scan.scan_type}\n\n"
            f"**Scan Date:** {scan.scan_date:%Y-%m-%d}\n\n"
            f"**Body Part:** {scan.body_part}"
        )

    healthy_disabled = scan is None
    sick_disabled = scan is None

    cols = st.columns(3)
    if cols[0].button("Mark Healthy", type="primary", disabled=healthy_disabled):
        _record_decision(session, ReviewDecision.HEALTHY)
    if cols[1].button("Mark Sick", type="secondary", disabled=sick_disabled):
        _record_decision(session, ReviewDecision.SICK)
    if cols[2].button("Undo last decision"):
        undone = session.undo()
        if undone is None:
            st.warning("No reviews to undo.")
        else:
            st.toast(
                f"Removed last decision for {undone.patient_name} made at"
                f" {undone.timestamp:%Y-%m-%d %H:%M:%S}.",
            )


def _render_recent_reviews(session: ReviewSession, limit: int = 5) -> None:
    st.subheader(f"Most recent {limit} reviews")
    recent = list(session.recent_reviews(limit=limit))
    if not recent:
        st.info("No reviews yet. Start by marking the current scan.")
        return

    for review in recent:
        decision_color = "green" if review.decision is ReviewDecision.HEALTHY else "red"
        st.markdown(
            f"- **{review.patient_name}** — "
            f"<span style='color:{decision_color}'>"
            f"{review.decision.label()}</span> at "
            f"{review.timestamp.strftime('%Y-%m-%d %H:%M:%S')}",
            unsafe_allow_html=True,
        )



def _render_footer() -> None:
    st.caption(
        "Decisions recorded in this demo are stored only for your current browser session."
    )


# ---- Page entrypoint ----
st.set_page_config(page_title="Doctor Scan Review", page_icon="🩺", layout="wide")
st.title("Doctor Scan Review")
st.write("Classify scans as healthy or sick, track progress, and review your history.")

session = _init_session()
_render_summary(session)
_render_current_scan(session)
_render_recent_reviews(session)
_render_footer()
