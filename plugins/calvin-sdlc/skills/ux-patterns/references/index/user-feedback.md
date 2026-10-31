# User Feedback: which pattern for which job

**Patterns (line range):** cookie-consent 7-14 · empty-states 15-22 · loading-indicator 23-30 · notification 31-38 · progress-indicator 39-46 · skeleton 47-54

User feedback and status indicators. Full pattern files: `patterns/user-feedback/<slug>.md`.

## cookie-consent: Cookie Consent

Inform users about the use of cookies. Build effort medium.
- **Also called:** cookie banner, GDPR banner
- **Use for:** Websites using analytics or marketing cookies; Regional consent requirements; Privacy preference updates after the first visit
- **Not for:** Use a quieter state when the event is too minor to interrupt the task; Avoid transient feedback for events users must be able to revisit later; Do not duplicate the same message in several channels without a hierarchy rule
- **Alternatives:** Notification (user-feedback/notification): when users need notification instead of cookie consent as the primary interaction | Modal (content-management/modal): when users need modal instead of cookie consent as the primary interaction | Toggle (forms/toggle): when users need toggle instead of cookie consent as the primary interaction

## empty-states: Empty States

Guide users when no content is available. Build effort low.
- **Also called:** blank state, zero state
- **Use for:** First-use dashboards and inboxes; Search or filter results with zero matches; Completed queues or cleared lists
- **Not for:** Use a quieter state when the event is too minor to interrupt the task; Avoid transient feedback for events users must be able to revisit later; Do not duplicate the same message in several channels without a hierarchy rule
- **Alternatives:** Notification (user-feedback/notification): when users need notification instead of empty states as the primary interaction | Filter Panel (data-display/filter-panel): when users need filter panel instead of empty states as the primary interaction | Loading Indicator (user-feedback/loading-indicator): when users need loading indicator instead of empty states as the primary interaction

## loading-indicator: Loading Indicator

Show users that content is being loaded. Build effort low.
- **Also called:** loader, loading, spinner
- **Use for:** Button submissions and saves; List or panel data fetching; Background sync and uploads with unknown duration
- **Not for:** Use a quieter state when the event is too minor to interrupt the task; Avoid transient feedback for events users must be able to revisit later; Do not duplicate the same message in several channels without a hierarchy rule
- **Alternatives:** Progress Indicator (user-feedback/progress-indicator): when users need progress indicator instead of loading indicator as the primary interaction | Skeleton (user-feedback/skeleton): when users need skeleton instead of loading indicator as the primary interaction | Notification (user-feedback/notification): when users need notification instead of loading indicator as the primary interaction

## notification: Notification

Inform users about important updates. Build effort medium.
- **Also called:** toast, snackbar, alert, banner
- **Use for:** Success and error toasts; System warnings and banners; Undo and retry prompts after an action
- **Not for:** Use a quieter state when the event is too minor to interrupt the task; Avoid transient feedback for events users must be able to revisit later; Do not duplicate the same message in several channels without a hierarchy rule
- **Alternatives:** Loading Indicator (user-feedback/loading-indicator): when users need loading indicator instead of notification as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of notification as the primary interaction | Modal (content-management/modal): when users need modal instead of notification as the primary interaction

## progress-indicator: Progress Indicator

Show completion status of an operation. Build effort low.
- **Also called:** progress bar
- **Use for:** File upload and export jobs; Multi-step setup or checkout flows; Background tasks with measurable completion
- **Not for:** Use a quieter state when the event is too minor to interrupt the task; Avoid transient feedback for events users must be able to revisit later; Do not duplicate the same message in several channels without a hierarchy rule
- **Alternatives:** Loading Indicator (user-feedback/loading-indicator): when users need loading indicator instead of progress indicator as the primary interaction | Wizard / Stepper (advanced/wizard): when users need wizard / stepper instead of progress indicator as the primary interaction | Skeleton (user-feedback/skeleton): when users need skeleton instead of progress indicator as the primary interaction

## skeleton: Skeleton

Show users that content is being loaded. Build effort low.
- **Also called:** skeleton screen, placeholder loading
- **Use for:** Content feeds and card grids; Dashboards with known layout; Loading states where reducing layout shift matters
- **Not for:** Use a quieter state when the event is too minor to interrupt the task; Avoid transient feedback for events users must be able to revisit later; Do not duplicate the same message in several channels without a hierarchy rule
- **Alternatives:** Loading Indicator (user-feedback/loading-indicator): when users need loading indicator instead of skeleton as the primary interaction | Empty States (user-feedback/empty-states): when users need empty states instead of skeleton as the primary interaction | Card Grid (data-display/card-grid): when users need card grid instead of skeleton as the primary interaction
