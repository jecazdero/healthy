# Healthy — Product Requirements Document

## 1. Executive Summary

We're building a real-time queue, capacity, and wait-time management system for patients, nurses, and doctors at Healthy — a non-profit community clinic — to solve the clinic's lack of queue transparency and operational visibility, which will result in reduced patient anxiety, less manual crowd-management friction for nursing staff, and elimination of blind spots for physicians during breaks.

## 2. Problem Statement

**Who has this problem, what is it, why does it hurt, and what's the evidence?**

### Who has this problem?
Patients waiting to be seen at the clinic; nursing staff managing the floor and the queue; doctors conducting consultations under high-throughput conditions.

### What is the problem?
The clinic lacks a real-time capacity and wait-time tracking mechanism.

### Why is it painful?

**User impact (patients):** Patients wait for long, unbounded periods with no visibility into whether they will be seen that day, causing anxiety and a loss of time autonomy.

**User impact (nurses):** Nurses absorb the friction of manually calming a queue of tired, anxious patients with no system support for crowd management.

**User impact (doctors):** Doctors are overwhelmed by consultation volume and remain anxious about waiting-room conditions even during breaks, since they have no visibility once they step away.

**Business impact:** Volume unpredictability drives operational blind spots and staff burnout clinic-wide.

## 3. Target Users & Personas

*Who exactly are you building for?*

### Persona 1: Patient (End User / Queue Consumer)

**Definition:** Insured, underinsured, or uninsured individuals seeking essential primary medical care.

**Goals / needs:** Psychological safety, clarity of daily access, and time autonomy — explicit confirmation their care will be delivered that day, plus visibility into their relative place in line (not just an abstract wait-time estimate).

**Core capabilities required:**
- View exact queue placement
- Schedule a time slot, or register directly at the floor counter with a nurse
- Trigger an instant request for immediate medical assistance due to sudden symptoms
- Access personal longitudinal visit history and active medication therapies

**Jobs-to-be-done:**
- When I need care, I want to schedule an appointment in under 5 clicks, so I can secure a slot with minimal effort.
- When my plans change, I want to reschedule in under 3 clicks, so I don't lose my spot or waste a trip.
- When I'm deciding whether to head to the clinic, I want to check the current wait time in under 30 seconds on a basic smartphone, so I can plan my day around it.
- When my condition suddenly worsens, I want to alert a nurse in under 3 clicks, so I get urgent help without delay.
- When I'm waiting, I want to see how many patients are ahead of me in under 30 seconds, so I know roughly how much longer I'll wait.
- When I arrive, I want to know which doctor I'm seeing and their room/office location in under 30 seconds, so I can find my way without asking staff.
- When I'm managing my health, I want to see my visit history and past therapies, so I have a clear record of my care.
- When I check in, I want to see my queue number in under 30 seconds, so I know exactly where I stand.

### Persona 2: Nurse (System Administrator / Floor Coordinator)

**Definition:** Clinical floor staff managing client reception, physical triage sequencing, and overall line workflow.

**Goals / needs:** Immediate, high-level operational visibility and non-disruptive, direct communication lines to doctors to maintain crowd control.

**Core capabilities required:**
- Global waiting-room analytics: total count, arrival sequence, who's in the exam room, exam duration in minutes
- View patient identifiers, names, clinical history, and active therapies
- Track and budget physician break schedules, factored into patient wait calculations
- Silently alert a doctor to an emerging emergency without opening the door or interrupting a live exam
- Securely book their own break slots inside the system

**Jobs-to-be-done:**
- When preparing for the next patient, I want to see who's next in line in under 30 seconds, so I can get the exam room ready.
- When planning my shift, I want to see how many patients are scheduled for the day in under 30 seconds, so I can gauge workload.
- When I need a break, I want to register for it in under 2 clicks, so logging it doesn't add friction to my day.
- When I'm on break, I want to be notified if someone needs immediate assistance, so urgent cases don't go unhandled.
- When a doctor needs help in the exam room, I want to be notified immediately, so I can respond without delay.
- When coordinating coverage, I want to see when a doctor has registered for a break, so I can plan the floor accordingly.
- When a patient's situation changes, I want to reschedule their time slot myself, so the queue stays accurate.
- When a patient can't self-serve, I want to schedule on their behalf, so walk-ins and less tech-savvy patients aren't blocked.
- When treating a returning patient, I want to see their full visit history, so I have context before they're seen.
- When coordinating with a doctor, I want to know their name and office address at a glance, so I can direct patients and calls correctly.
- When there's an urgent case, I want to notify a doctor in under 3 clicks, so help arrives fast.
- When forecasting the schedule, I want to know a doctor's approximate processing time per patient, so I can set realistic expectations.
- When a walk-in can't be seen that day, I want to know immediately and rebook them for another day/slot, so they aren't left without a plan.
- When planning ahead, I want to see patient counts for today, previous days, and upcoming days, so I can anticipate busy periods.

### Persona 3: Doctor (Service Provider / Queue Processor)

**Definition:** Medical professionals conducting clinical consultations under high-throughput conditions.

**Goals / needs:** Maximized processing focus, absolute predictability of upcoming workload, and stress-free break intervals.

**Core capabilities required:**
- Instant access to the active patient's name, history, and active therapies
- Real-time visibility into the exact number of remaining patients waiting outside
- Securely flag the start and duration of an upcoming break
- One-click digital request for nurse assistance in the exam room
- Silent, priority triage alerts to adjust, shorten, or pause a routine exam for an incoming critical emergency

**Jobs-to-be-done:**
- When I'm consulting, I want to see the waiting list, who's currently in the office, and who's next, so I can keep the flow moving without asking staff.
- When documenting a visit, I want to fill in a patient's diagnosis and therapy in under 10 clicks, so charting doesn't eat into consultation time.
- When I need help, I want to call a nurse in under 3 clicks, so support arrives quickly without leaving the room.
- When I need rest, I want to register for a break directly in the system, so my availability stays accurate.
- When planning coverage, I want to see if and when a nurse has registered for a break, so I know who's on the floor.
- When a nurse steps away, I want to see who their replacement is, so I know who to contact if needed.
- When an emergency arises, I want to be alerted in under 10 seconds, so I can respond immediately without disrupting the current exam more than necessary.
- When reviewing my day, I want to see patient counts for today, previous days, and upcoming days, so I can track and plan my workload.

## 4. Strategic Context

*Why does this matter to the business, and why now?*

**Business goals:** To transform the clinic waiting experience from an anxious operational blind spot into a transparent, predictable, and synchronized workflow that restores time autonomy to patients and protects staff from burnout.

**Why now?** Healthy operates as a critical healthcare safety net in medically underserved regions, treating all patients regardless of insurance status, income, or socioeconomic background.

## 5. Solution Overview

### High-level description
A unified queue, capacity, and communication system connecting patients, nurses, and doctors in real time, delivered as a single application with three tailored views for the roles above.

### Target experience (user flow narrative)

**Intake Initialization:** Nurses launch the desktop suite to view all scheduled allocations. As unscheduled walk-ins arrive, the nurse runs a quick triage assessment and places the patient into an optimized empty slot in the timeline.

**Continuous Consultation:** Doctors call patients sequentially. If an urgent case enters, the system establishes absolute priority automatically. Doctors stay aware of their exact remaining daily workload, allowing them to plan rest breaks confidently.

**Patient Autonomy:** Patients check in, verify presence with the coordinator, and can step out. They track their line progression dynamically from their mobile device, reducing waiting-room density.

### Key features (by persona)

- **Patient:** queue placement view, self-scheduling / floor registration, emergency assistance request, personal visit/therapy history
- **Nurse:** waiting-room analytics dashboard, patient identity/history lookup, physician break tracking, silent emergency alert to doctor, self-service break booking
- **Doctor:** active patient + queue view, remaining-patient count, break flagging, one-click nurse assistance request, silent priority triage alerts

### Platform requirements
One central application engine delivering three tailored, responsive viewport profiles: desktop, tablet, mobile.

## 6. Success Metrics

*How will you know this worked?*

_(Not yet defined — open item.)_

## 7. User Stories & Requirements

### Epic hypothesis
We believe that giving patients, nurses, and doctors real-time, role-specific visibility into clinic queue and capacity will restore patient time autonomy and protect staff from burnout. We'll know this is true when patient wait-time anxiety and staff-reported crowd-management friction visibly decrease.

### Patient stories & acceptance criteria

**Scheduling:** As a patient, I want to schedule an appointment in minimal steps, so that I can secure a slot with low effort.
- `AT-P-01`: Schedule an appointment within a max of 5 clicks from the landing screen
- `AT-P-02`: Modify an existing appointment within a max of 3 clicks

**Wait-time & queue visibility:** As a patient, I want to see my status and position, so that I have confidence and clarity while waiting.
- `AT-P-03`: Load and locate current estimated wait time in under 30 seconds, even on a low-spec mobile device
- `AT-P-05`: View exact position status (e.g., patients ahead of them) in under 30 seconds
- `AT-P-06`: Find assigned doctor's name and precise room location within 30 seconds
- `AT-P-08`: Find assigned unique daily queue number in under 30 seconds

**Emergency escalation:** As a patient, I want to alert staff quickly if my condition changes, so that I get urgent help without delay.
- `AT-P-04`: Trigger an immediate alert to clinical nurses in less than 3 clicks

**Medical history access:** As a patient, I want to view my own records, so that I can track my care history.
- `AT-P-07`: Securely pull up and read historical visits and active therapy entries

### Nurse stories & acceptance criteria

**Floor operations visibility:** As a nurse, I want a live view of the queue and daily load, so that I can manage the floor efficiently.
- `AT-N-01`: Locate the next sequential patient's identity/record within 30 seconds
- `AT-N-02`: See total individuals pre-scheduled for the day in under 30 seconds
- `AT-N-13`: View total client counts and schedule loads for current, past, and upcoming days
- `AT-N-11`: See approximate average consultation time per doctor

**Break management:** As a nurse, I want to log my own breaks and track physician breaks, so that coverage stays predictable.
- `AT-N-03`: Initiate and log a personal break slot within a max of 2 clicks
- `AT-N-04`: Receive an immediate override/notification while on break if a patient triggers an assistance request
- `AT-N-06`: Be notified immediately when a doctor registers "On Break" status

**Communication with doctors:** As a nurse, I want silent alert channels to doctors, so that I don't interrupt live exams unnecessarily.
- `AT-N-05`: Receive an instant alert the moment a doctor calls for assistance

**Patient & scheduling management:** As a nurse, I want to manage patient records and slots directly, so that I can handle walk-ins and changes.
- `AT-N-07`: Manually drag/drop or reschedule any patient's time slot
- `AT-N-08`: Complete a full scheduling workflow on behalf of a walk-in patient at the counter
- `AT-N-09`: Load complete visit history and therapy checklist for any chosen patient
- `AT-N-10`: View corresponding physician's name, room number, and office address
- `AT-N-12`: If a walk-in can't be seen today, be explicitly informed and able to book them for a subsequent day

### Doctor stories & acceptance criteria

**Clinical workflow:** As a doctor, I want a unified view of my queue and active patient, so that I can stay focused and efficient.
- `AT-D-01`: View unified screen with active waiting list, current patient, and next-in-line
- `AT-D-02`: Fully document a patient's assessment and save prescribed therapy in under 10 clicks/keystrokes
- `AT-D-07`: View own patient processing totals and schedule counts for current, past, and future days

**Staff coordination:** As a doctor, I want quick ways to call for help and track coverage, so that patient care isn't interrupted.
- `AT-D-03`: Broadcast a high-priority assistance call to nurses' floor tablets in under 3 clicks
- `AT-D-05`: Instantly verify if a nurse is on break, their checkout time, and the active floor replacement

**Break management:** As a doctor, I want to log my breaks, so that the system reflects my true availability.
- `AT-D-04`: Flag start and intended duration of a break

**Emergency handling:** As a doctor, I want silent priority alerts, so that I can respond to emergencies without disrupting the current exam more than necessary.
- `AT-D-06`: Terminal displays a high-priority silent visual warning within 10 seconds of a nurse elevating an urgent case

### Constraints & edge cases

- **Technical constraint:** One central application engine must serve three tailored, responsive viewport profiles (desktop, tablet, mobile) with unified state.
- All roles should be visible on desktop, tablet and mobile view.
- Add in app header a dropdown, so that we can easily switch among roles and see solutions.
- **Privacy constraint:** Strict patient anonymity — the patient-facing view must never expose the names, health issues, or presence identifiers of other patients. Cross-patient statistics must be shown only as abstract counters (e.g., total queue length).

## 8. Out of Scope

*Not included in this release (prototype):*

- Login / authentication process — not built for the prototype.
- A real database — not required for the prototype; data is mocked instead.
- Real user accounts — replaced with mocked data for 3 users (covering the Patient, Nurse, and Doctor personas).

## 9. Dependencies & Risks

### Dependencies

- **Design:** Figma Canvas design workspace for UI/prototype architecture.
- **Technical:** Unified, responsive application engine supporting desktop, tablet, and mobile views from one shared state.

## 10. Open Questions

*Unresolved decisions — call out the decision once made.*

_(None documented yet.)_

## Self-Assessment (before sharing)

- **Strongest section:** _(not yet filled in)_
- **Weakest section / needs more work:** _(not yet filled in)_
- **Top assumptions to validate before build:** _(not yet filled in)_
- **Recommended next step:** _(not yet filled in)_
