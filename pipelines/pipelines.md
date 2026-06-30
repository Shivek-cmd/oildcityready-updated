# PL-01: Concrete Quote Pipeline

**Business:** Oil City Ready Mix Ltd.
**Purpose:** Track every quote request from form submission through to won or lost.

---

## Pipeline Overview

| Field         | Value                        |
|---------------|------------------------------|
| Pipeline Name | PL-01: Concrete Quote Pipeline |
| Entry Point   | Form submitted on website (quote request form) |
| Created By    | WF-01: Quote Form Submission workflow (Create Opportunity action) |

---

## Stages

| # | Stage Name       | Color  | Rotting Days | Description                                                   |
|---|------------------|--------|--------------|---------------------------------------------------------------|
| 1 | New Request      | Yellow | 1            | Form just submitted — team has not yet reviewed or responded  |
| 2 | Quote Sent       | Blue   | 3            | Team has sent the concrete quote to the contact               |
| 3 | Negotiating      | Orange | 5            | Contact responded — price, volume, or timeline being discussed |
| 4 | Won              | Green  | —            | Project confirmed, order placed. Terminal — positive          |
| 5 | Lost             | Red    | —            | Contact did not proceed. Terminal — negative                  |

---

## Stage Logic

### New Request
- **Entered by:** WF-01 (Create Opportunity action on form submit)
- **Exits to:** Quote Sent — when team manually sends quote or workflow moves it
- **Rotting alert:** 1 day — if still here after 1 day, team hasn't responded (violates the 1-business-day promise)

### Quote Sent
- **Entered by:** Team member manually moves it after sending quote, OR a future workflow action
- **Exits to:** Negotiating (contact replied) or Lost (no response after follow-up window)
- **Rotting alert:** 3 days — follow-up should happen if no contact response

### Negotiating
- **Entered by:** Manual drag when contact replies and discussion begins
- **Exits to:** Won or Lost
- **Rotting alert:** 5 days — deal should close or be lost within 5 days of negotiation

### Won
- **Terminal stage — positive**
- Contact confirmed the order
- No further automation needed from this pipeline

### Lost
- **Terminal stage — negative**
- Contact did not proceed
- Optional: tag contact with `quote-lost` for future re-engagement campaigns

---

## Opportunity Value

Set in WF-01 Create Opportunity action:
- Default value: `0` (unknown at form submit — no pricing info collected)
- Update manually when quote is sent and volume/pricing is known

---

## How to Build in GHL

1. Go to: **Opportunities → Pipelines → + Add Pipeline**
2. Name: `PL-01: Concrete Quote Pipeline`
3. Add stages in order: New Request → Quote Sent → Negotiating → Won → Lost
4. Set colors and rotting days as listed above
5. Save pipeline before building WF-01 (pipeline must exist before the workflow references it)

---

## Dependencies

| Depends On       | Status   |
|------------------|----------|
| Nothing          | Build first — no prerequisites |

| What Depends On This Pipeline | Component          |
|-------------------------------|--------------------|
| WF-01: Quote Form Submission  | workflows/01-quote-form-submission/ |
