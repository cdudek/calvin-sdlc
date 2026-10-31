# Forms: which pattern for which job

**Patterns (line range):** autocomplete 7-16 · button 17-24 · checkbox 25-32 · code-confirmation 33-40 · color-picker 41-47 · currency-input 48-55 · date-input 56-62 · date-picker 63-70 · date-range 71-78 · file-input 79-86 · form-validation 87-94 · multi-select-input 95-102 · password 103-109 · phone-number 110-117 · radio 118-122 · rating-input 123-130 · rich-text-editor 131-138 · search-field 139-146 · selection-input 147-153 · signature-pad 154-160 · slider 161-168 · tag-input 169-176 · text-field 177-186 · textarea 187-194 · time-input 195-202 · toggle 203-210

Form components and input patterns. Full pattern files: `patterns/forms/<slug>.md`.

## autocomplete: Autocomplete

Suggest options as users type. Build effort medium. Popularity high.
- **Also called:** autosuggest, typeahead, combobox, suggestions
- **Best for:** Long option lists where typing can narrow the field; Inputs where users may know only part of the answer; Repeated data entry that benefits from speed
- **Avoid when:** The option set is short enough for radio buttons or select; Matching is unreliable and suggestions will feel noisy; Users need to compare all options at once
- **Use for:** Users select from large sets of predefined options (country selection, airport codes); Users need faster option selection than scrolling through long dropdowns; Reducing errors by guiding users to valid input options; Input has finite, known valid responses; Combining free text input with suggestion functionality
- **Not for:** Fewer than 10 options exist (use standard dropdown/select instead); Users enter completely free-form text without restrictions; All options need simultaneous visibility for comparison; Network latency significantly delays suggestion results; Input field requires exact, verbatim text entry (passwords)
- **Alternatives:** Text Field (forms/text-field): when users need complete freedom in their input without suggestions | Multi-Select (forms/multi-select-input): when users need to select multiple items from a predefined list | Date Picker (forms/date-picker): when users need to select dates with calendar visualization

## button: Button

Trigger actions and submit forms. Build effort low. Popularity high.
- **Also called:** CTA
- **Use for:** To trigger an immediate action or event (e.g., "Save", "Delete", "Send"); To submit a form; To open or close interactive elements (modals, dialogs, menus); To toggle between states (e.g., play/pause, show/hide); To download files or content; To navigate between steps in a multi-step process
- **Not for:** For navigation between pages (use links instead); When the action isn't immediately clear to users; For text-only content that doesn't trigger an action; When the interaction would be better served by a different component (e.g., checkbox, toggle switch); When multiple conflicting actions are grouped together; When the action requires additional context that isn't immediately available
- **Alternatives:** Link (navigation/link): when navigating to different pages or sections | Toggle Switch (forms/toggle): when switching between two states or on/off settings

## checkbox: Checkbox

Enable single or multiple selections. Build effort low. Popularity high.
- **Also called:** tick box, selection box
- **Use for:** Form preferences; Filter selections; Settings toggles; Multi-select lists; Agreement checkboxes; Feature selection
- **Not for:** For single selections → radio; For binary on/off states → toggle; When space is limited → selection-input; For immediate actions → button; When options are mutually exclusive
- **Alternatives:** Radio Button (forms/radio): when only one option can be selected | Toggle Switch (forms/toggle): when binary on/off states or settings | Multi-select Dropdown (forms/multi-select-input): when many options with limited space

## code-confirmation: Code Confirmation

Verify codes with segmented input. Build effort medium. Popularity medium.
- **Also called:** OTP input, PIN, verification code
- **Use for:** Two-factor authentication (2FA); Email verification; Password reset flows; Transaction confirmation; Access codes
- **Not for:** Long passwords or passphrases; Free-form text entry; When the code length is unknown or variable; Codes longer than 8 digits
- **Alternatives:** Text Field (forms/text-field): when entering free-form text, long codes, or alphanumeric strings of variable length | PIN Entry (forms/text-field): when entering a short numeric PIN (typically 4–6 digits) for device unlock or payment confirmation | Password Field (forms/text-field): when users enter a long secret they know by heart (not one sent to them)

## color-picker: Color Picker

Select colors with visual feedback. Build effort high. Popularity medium.
- **Use for:** Theme and brand customization; Design and creative tools; Data visualization; Product configuration; Annotation and markup
- **Not for:** When colors are fixed options; When the exact color value doesn't matter to the user; In mobile-primary, simple forms; When accessibility is paramount
- **Alternatives:** Swatch Selector (forms/selection-input): when colors are predefined from a fixed palette | Text Field (forms/text-field): when users enter exact hex or RGB values directly | Dropdown / Select (forms/selection-input): when choosing from a small named set of colors (< 10 options)

## currency-input: Currency Input

Enter and format monetary values. Build effort medium. Popularity medium.
- **Also called:** money, amount
- **Use for:** E-commerce checkout; Banking and finance forms; Expense reporting; Subscription and pricing configuration; Budget and forecasting tools
- **Not for:** Displaying prices (read-only); Quantities without monetary meaning; Very large or very small scientific values; When the currency is irrelevant
- **Alternatives:** Text Field (forms/text-field): when entering financial values without formatting requirements | Number Input (forms/text-field): when entering numeric quantities without monetary context | Slider Input (forms/text-field): when selecting a value within a known bounded range (e.g., budget up to $500)

## date-input: Date Input

Enter dates in a structured text format. Build effort medium. Popularity medium.
- **Use for:** Known, precise dates; Historical dates; Age or duration entry; High-frequency data entry; Date of birth
- **Not for:** Scheduling and appointments → date-picker; Relative date selection; Date ranges → date-range; When users need to see surrounding dates
- **Alternatives:** Date Picker (forms/date-picker): when users need to select a date visually or see surrounding context (scheduling, availability) | Text Field (forms/text-field): when collecting free-form date-like text with no strict validation required | Date Range (forms/date-range): when users need to enter both a start and end date

## date-picker: Date Picker

Select dates from a calendar interface. Build effort high. Popularity high.
- **Also called:** calendar input
- **Use for:** Appointment scheduling; Delivery and shipping dates; Event creation; Hotel and travel booking; Report or filter date
- **Not for:** Known, historical dates → date-input; Date ranges → date-range; Mobile-only contexts; Very distant dates
- **Alternatives:** Date Input (forms/date-input): when users know the exact date and don't need visual calendar context | Date Range (forms/date-range): when users need to select both a start and end date | Text Field (forms/text-field): when collecting an approximate or relative date description

## date-range: Date Range

Select a range between two dates. Build effort high. Popularity medium.
- **Also called:** from-to dates
- **Use for:** Hotel/travel booking; Event duration; Reporting periods; Rental and reservation systems; Leave and time-off requests
- **Not for:** Single date selection → date-picker; Open-ended filters; Very long date ranges; When start and end can be the same day
- **Alternatives:** Date Picker (forms/date-picker): when only a single date needs to be selected | Two Date Inputs (forms/date-input): when start and end dates are logically separate and not visually related | Preset Selector (forms/selection-input): when users choose from fixed ranges (Today, Last 7 days, This month, This quarter)

## file-input: File Input

Upload and handle files. Build effort medium. Popularity high.
- **Also called:** upload, dropzone
- **Use for:** Profile and avatar upload; Document submission; Media uploads; Bulk import; Email attachments
- **Not for:** Camera capture on mobile; Cloud file selection; Very large files; Real-time streaming content
- **Alternatives:** Camera Capture Input (forms/text-field): when user should take a new photo rather than select an existing file | URL Input (forms/text-field): when users can link to an existing online resource instead of uploading | Paste / Clipboard (forms/text-field): when users frequently paste screenshots or copied images

## form-validation: Form Validation

Validate and provide feedback. Build effort medium.
- **Also called:** inline errors, error messages
- **Use for:** Account creation; Checkout and billing forms; Workflow forms with both client and server rules
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Text Field (forms/text-field): when users need text field instead of form validation as the primary interaction | Date Input (forms/date-input): when users need date input instead of form validation as the primary interaction | Button (forms/button): when users need button instead of form validation as the primary interaction

## multi-select-input: Multi-select Input

Choose multiple items from a list. Build effort medium. Popularity high.
- **Also called:** tags picker, recipients, multi-select dropdown
- **Use for:** Category and tag assignment; Permissions and role management; Filter panels; Recipient selection; Feature selection
- **Not for:** Freeform text with suggestions → autocomplete; Single selection from a small list → selection-input, radio; Binary choices → checkbox; Very large option sets (> 1000 items)
- **Alternatives:** Checkbox List (forms/checkbox): when the number of options is small (< 10) and all should be visible at once | Autocomplete (forms/autocomplete): when users need to search through a large dataset and can also create new values | Native Select Multiple (forms/selection-input): when simplicity is critical and the number of items is small

## password: Password

Secure password entry with feedback. Build effort medium.
- **Also called:** show/hide, strength meter
- **Use for:** Login and authentication forms; Account creation and password updates; Two-factor authentication (2FA) or PIN entry; Security-sensitive fields
- **Not for:** For non-sensitive text input → text-field; For one-time codes (OTP) or PINs → code-confirmation; For password confirmation fields

## phone-number: Phone Number

Format and validate phone numbers. Build effort medium.
- **Also called:** tel input
- **Use for:** Contact and delivery forms; Verification and MFA setup; Support or profile forms with international audiences
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Text Field (forms/text-field): when users need text field instead of phone number as the primary interaction | Selection Input (forms/selection-input): when users need selection input instead of phone number as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of phone number as the primary interaction

## radio: Radio Button

Select a single option from a group. Build effort low.
- **Also called:** radio buttons, single choice

## rating-input: Rating Input

Rate something with a number of stars. Build effort low.
- **Also called:** stars
- **Use for:** Product and content reviews; Service feedback; Quick satisfaction surveys
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Radio (forms/radio): when users need radio instead of rating input as the primary interaction | Like Button (social/like-button): when users need like button instead of rating input as the primary interaction | Slider (forms/slider): when users need slider instead of rating input as the primary interaction

## rich-text-editor: Rich Text Editor

Edit and format text content. Build effort high.
- **Also called:** WYSIWYG
- **Use for:** Knowledge-base authoring; Long-form content creation; Formatted internal notes and descriptions
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Textarea (forms/textarea): when users need textarea instead of rich text editor as the primary interaction | Button (forms/button): when users need button instead of rich text editor as the primary interaction | Tag Input (forms/tag-input): when users need tag input instead of rich text editor as the primary interaction

## search-field: Search Field

Search through content efficiently. Build effort medium.
- **Also called:** search input, search bar, search box
- **Use for:** Site-wide content search; Scoped table and list filtering; Quick command or object lookup
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Command Palette (advanced/command-palette): when users need one keyboard-first surface for actions, destinations, recent items, and power-user shortcuts | Autocomplete (forms/autocomplete): when users benefit from strong suggestions while typing and often know the item they want | Text Field (forms/text-field): when the input is freeform text but is not actually performing search or retrieval

## selection-input: Selection Input

Choose from predefined options.
- **Also called:** dropdown, select
- **Use for:** When users need to select a single option from a list of predefined choices; When the list of options is relatively short (less than 10-15 items); When screen space is limited, and displaying all options at once is not feasible; When the selected option doesn't need to be visible at all times
- **Not for:** When users need to select multiple options (use checkboxes or a multi-select instead) → multi-select-input; When the list of options is very long (consider using an autocomplete or a typeahead) → autocomplete; When users need to input free-form text (use a regular text input instead); When the options are complex or require additional information or visual aids

## signature-pad: Signature Pad

Allow users to sign their name. Build effort medium.
- **Use for:** Consent and approval capture; Delivery confirmation; Document-signing tasks
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** File Input (forms/file-input): when users need file input instead of signature pad as the primary interaction | Button (forms/button): when users need button instead of signature pad as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of signature pad as the primary interaction

## slider: Slider

Select values from a range. Build effort medium.
- **Also called:** range input
- **Use for:** Price and range filtering; Volume or intensity controls; Score and preference selection
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Selection Input (forms/selection-input): when users need selection input instead of slider as the primary interaction | Rating Input (forms/rating-input): when users need rating input instead of slider as the primary interaction | Toggle (forms/toggle): when users need toggle instead of slider as the primary interaction

## tag-input: Tag Input

Enter and format tags. Build effort medium.
- **Also called:** chips input, tokens
- **Use for:** Labels and keywords; Recipient entry; Topic and taxonomy assignment
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Multi-Select Input (forms/multi-select-input): when users need multi-select input instead of tag input as the primary interaction | Autocomplete (forms/autocomplete): when users need autocomplete instead of tag input as the primary interaction | Text Field (forms/text-field): when users need text field instead of tag input as the primary interaction

## text-field: Text Field

Enter and edit text content. Build effort low. Popularity high.
- **Also called:** input
- **Best for:** Short freeform answers such as names, titles, and labels; Structured input with lightweight validation; Familiar one-line data entry in forms
- **Avoid when:** Users need formatting, long-form writing, or rich content; The answer should come from a known list of options; The field has multiple tightly related values
- **Use for:** Login and authentication fields; Search fields; Forms and surveys; Messaging interfaces; Data entry fields
- **Not for:** For pre-defined options → selection-input, radio, checkbox; For structured data inputs → date-picker, currency-input; For short selections → autocomplete; When voice input or selections are better
- **Alternatives:** Autocomplete (forms/autocomplete): when users select from predefined options while typing | Date Picker (forms/date-picker): when users need to input dates with calendar visualization | Multi-Select (forms/multi-select-input): when users select multiple items from predefined options

## textarea: Textarea

Multi-line text input for longer content. Build effort low.
- **Also called:** multi-line input
- **Use for:** Comments and support notes; Descriptions and bios; Issue reports and feedback
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Text Field (forms/text-field): when users need text field instead of textarea as the primary interaction | Rich Text Editor (forms/rich-text-editor): when users need rich text editor instead of textarea as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of textarea as the primary interaction

## time-input: Time Input

Enter time in a structured format. Build effort medium.
- **Also called:** time picker
- **Use for:** Availability and scheduling; Booking windows; Shift or reminder configuration
- **Not for:** Use a simpler native control when the value is binary, tiny, or fully constrained; Avoid custom behavior when a native browser input already solves the main job well; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Date Input (forms/date-input): when users need date input instead of time input as the primary interaction | Date Picker (forms/date-picker): when users need date picker instead of time input as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of time input as the primary interaction

## toggle: Toggle

Switch between two states. Build effort low.
- **Also called:** switch
- **Use for:** Settings and preferences; Feature enablement; Notification or privacy controls
- **Not for:** Prefer a native checkbox input for settings and forms when the value is simply on or off; Use a button with `aria-pressed` only when the control represents an action state such as play/pause or show/hide; Do not add extra formatting or validation if the product does not benefit from it
- **Alternatives:** Checkbox (forms/checkbox): when persisted settings, preferences, and form-bound binary values | Button (forms/button): when pressed and unpressed actions like show or hide, play or pause, or mute or unmute
