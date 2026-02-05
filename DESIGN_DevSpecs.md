# Design: In-App Specs & Scenario-Driven Dev for A/B Platform

## 1. Core Philosophy
The goal is to eliminate the context switch between "Reading Docs" and "Coding/Testing". We will embed the PRD directly into the application layer, visible only when needed.

## 2. Architecture Components

### A. The "Living Spec" System (UI Overlay)
*   **`SpecContext`**: A React Context holding the state of "Show Specs" (true/false).
*   **`<SpecOverlay>` Component**: A wrapper component used around functional UI parts.
    *   **Props**:
        *   `id`: Unique Key links to the spec dictionary.
        *   `trigger`: Interaction type (hover, click).
        *   `placement`: Where the tooltip appears.
    *   **Visuals**: varying styles for "Critical Rule" (Red), "Info" (Blue), "Flow" (Green).
*   **`specDefinitions.js`**: A central file containing the text from the PRD, indexed by ID. This ensures the "Doc" is version-controlled with the code.

### B. The "Mock Scenario" System (Data Layer)
*   **Scenario Manager**: A wrapper around the existing `mockStore`.
*   **Scenarios**: Pre-defined states that instantly put the app into complex situations.
    *   *Scenario 1: Happy Path* (Default clean state)
    *   *Scenario 2: Layer Overflow* (Layer 1 is 100% full, testing validation logic)
    *   *Scenario 3: Conflict Mode* (Two experiments targeting same audience)
*   **`DevToolbar`**: A floating widget in the bottom-right corner.
    *   Toggle: [👁️ Show Specs]
    *   Select: [ ⬇️ Load Scenario: Layer Overflow ]

## 3. Implementation Plan

### Phase 1: Infrastructure
1.  Check `mockStore.js` and wrap it to support "Reset to Scenario X".
2.  Create `src/components/DevTools/` directory.
3.  Implement `DevToolbar.jsx`, `SpecOverlay.jsx`, and `SpecContext.jsx`.

### Phase 2: Data Migration (The "Mock" part)
1.  Define 3-4 key scenarios based on the PRD edge cases.
2.  Update `mockStore.js` to export these presets.

### Phase 3: Annotation Injection (The "Info" part)
1.  Extract rules from `PRD_Experiment_Management.md`.
2.  Create `src/specs/experiment.js` with these rules.
3.  Modify `CreateExperiment/Step2Strategy.jsx` and `ExperimentList.jsx` to wrap key logic blocks with `<SpecOverlay>`.

## 4. Example Usage
**Developer View**:
> "I need to implement the traffic validation."
> *Clicks 'Load Scenario: Traffic Full'*
> App immediately fills Layer 1 with 100% traffic.
> *Enables 'Show Specs'*
> Input field now has a red dashed border. Hovering says: *"Rule 2.1: Total traffic in a layer cannot exceed 100%. Alert user immediately if sum > 100."*

## 5. Next Steps
- User Approval of this design.
- I will begin with Phase 1 (Infrastructure).
