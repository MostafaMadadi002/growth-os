# Software Requirements Specification (SRS) - GrowthOS Phase 1 MVP

## 1. Functional Requirements

| ID | Module | Requirement | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Tasks & Goals** | System must allow users to decompose long-term goals (e.g., 3-month course) into daily/weekly actionable tasks. | **P0** |
| **FR-02** | **Tasks & Goals** | Users can define frequency (e.g., 2 sessions per week) and the system automatically schedules them. | **P0** |
| **FR-03** | **Heatmap** | GitHub-style visual heatmap: Green (Full completion), Yellow/Light Green (Partial), Empty (No progress). | **P0** |
| **FR-04** | **Habit Tracker** | System must allow tracking "Negative Habits" (Extra/Unnecessary activities like News, Gaming, Social Media). | **P1** |
| **FR-05** | **Habit Tracker** | Weekly reports identifying which bad habits consumed the most time and offering "Replacement" suggestions. | **P1** |
| **FR-06** | **Trading Journal** | Support for Forex/Crypto markets with dedicated fields (Entry, SL, TP, Fees, Spread, Leverage/Lot). | **P0** |
| **FR-07** | **Trading Journal** | Record outcome status: Win, Loss, Break-Even (Risk-Free), or Open. | **P0** |
| **FR-08** | **Trading Journal** | Post-trade reflection fields: "Reason for Loss" and "Reason for Profit Missed." | **P1** |
| **FR-09** | **Fitness** | Tracking module for daily Weight, Sleep duration, and Nutritional intake. | **P2** |
| **FR-10** | **Fitness** | Workout plan management and execution tracking. | **P2** |
| **FR-11** | **Analytics** | Aggregated performance reports: Daily, Weekly, and Monthly summaries for all domains. | **P1** |

---

## 2. Non-Functional Requirements

| ID | Requirement | Target |
| :--- | :--- | :--- |
| **NFR-01** | **Offline First** | App must allow data entry without an active internet connection. |
| **NFR-02** | **Performance** | Dashboard and Heatmap rendering must be under 200ms on modern Android devices. |
| **NFR-03** | **Data Security** | Financial and Personal data must be encrypted locally and during sync. |
| **NFR-04** | **Usability** | The "Add Trade" flow must be completed in fewer than 6 taps. |

---

## 3. User Stories

1. **As a Student**, I want to divide my React course into 2 sessions per week over 3 months so that I have a manageable daily routine.
2. **As a Productive User**, I want to see a green heatmap cell when I finish my tasks so that I feel motivated by my consistent streak.
3. **As a Self-Improver**, I want to track how much time I spend scrolling social media so that I can replace that time with reading or exercise.
4. **As a Trader**, I want to log my Crypto entry price, leverage, and fees so that I can calculate my real ROI without using messy Excel sheets.
5. **As a Trader**, I want to update my "Open" trades to "Risk-Free" status so that I can track my active market exposure accurately.
6. **As an Athlete**, I want to record my sleep and weight daily so that I can see how recovery affects my workout performance.
7. **As a User**, I want a weekly report on my bad habits so that I can identify which ones are sabotaging my long-term goals.

---

## 4. Acceptance Criteria: Trading Journal

The **Trading Journal** module is considered complete when:

- [ ] **Market Support**: User can toggle between "Forex" and "Crypto" modes.
- [ ] **Dynamic Fields**:
    - **Crypto**: Shows Fees, Leverage, Pair Name, Entry/SL/TP.
    - **Forex**: Shows Spread, Lots, Pair Name, Entry/SL/TP.
- [ ] **State Management**:
    - A trade can be saved as "Open."
    - User can update an "Open" trade to "Win," "Loss," or "Risk-Free" at a later time.
- [ ] **Calculation Logic**: System calculates Net Profit/Loss (including fees/spreads).
- [ ] **Reflection Hooks**: The system forces (or suggests) entering a reflection reason upon closing a trade.
- [ ] **Reporting**: The User can filter trade history by Daily, Weekly, or Monthly performance views.
