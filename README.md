# A/B Platform Demo

## Overview
This is a React + Ant Design demo of the A/B Testing Platform console, based on the provided logic diagram.
It focuses on the "Blue Phase" (Current Phase) requirements:
- Experiment List Management.
- 3-Step Experiment Creation Wizard (Basic Info -> Strategy -> Grouping).
- Traffic Layering and Mutual Exclusion UI.
- Feature Flag Configuration.

## Project Structure
- `src/layouts/MainLayout.jsx`: Application shell with Sidebar and Header.
- `src/pages/ExperimentList.jsx`: Dashboard showing all experiments with status and traffic layer indicators.
- `src/pages/CreateExperiment/`: The wizard component.
    - `index.jsx`: Main container managing the wizard state.
    - `Step1BasicInfo.jsx`: Name, Owner, Schedule.
    - `Step2Strategy.jsx`: Traffic Layer selection, Orthogonality check, Audience targeting.
    - `Step3Grouping.jsx`: Group allocation (Control/Variant), Traffic Ratio, and Feature/JSON config.

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173

## Key Features Implemented (Mock)
- **Visual Statuses**: Color-coded tags for Experiment Status (Running, Draft, Ended) and Layers.
- **Form Wizard**: Step-by-step creation flow.
- **Dynamic Fields**: Ability to add/remove Feature Parameters (Key, Type, Value) dynamically in Step 3.
