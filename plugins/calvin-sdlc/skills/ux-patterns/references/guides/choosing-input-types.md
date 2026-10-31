# Text vs Number vs Email Input: When to Use Each HTML5 Type

**Sections (line range):** Input Types Decision Flow 11-57 · Implementation Considerations 58-71 · Next steps 72-79

> Select the most appropriate HTML input type based on your data collection needs and user experience requirements

Selecting the right input type is crucial for creating efficient and user-friendly forms. Each input type serves specific purposes and comes with built-in features and validations. The choice impacts user experience, data accuracy, and form completion rates.

Use our interactive decision flow below to guide your choice based on factors like data type, validation requirements, and user interaction patterns. Follow the path that best matches your needs to find the recommended input type for your form.

### Input Types Decision Flow

1. **What type of data are you collecting?** Consider the type of information you need from the user
   - Text → go to step 2
   - Selection → go to step 6
   - Special → go to step 9
2. **Is it free-form text?** Does the user need to enter custom text?
   - Complex → go to step 3
   - Simple → go to step 4
   - Formatted → go to step 5
3. **Need rich formatting?** Does the input require special formatting or complex interaction?
   - Rich Text → **Use Rich Text Editor**: Best for formatted text with styling options (patterns/forms/rich-text-editor.md)
   - Signature → **Use Signature Pad**: Best for capturing handwritten signatures (patterns/forms/signature-pad.md)
4. **Multiple lines needed?** Will users need to enter multiple lines of text?
   - Yes → **Use Textarea**: Best for multi-line text entry (patterns/forms/text-field.md)
   - No → **Use Text Input**: Best for single-line text entry (patterns/forms/text-field.md)
5. **Is it a special format?** Does the input require specific validation or formatting?
   - Email → **Use Email Input**: Includes email format validation (patterns/forms/text-field.md)
   - Number → **Use Number Input**: Best for numeric data entry (patterns/forms/text-field.md)
   - Currency → **Use Currency Input**: Best for monetary values with formatting (patterns/forms/currency-input.md)
   - Phone → **Use Phone Input**: Best for phone numbers with formatting (patterns/forms/phone-number.md)
6. **Are options predefined?** Do users choose from a set list of options?
   - Multiple? → go to step 7
   - Single → go to step 8
7. **Multiple selections allowed?** Can users select more than one option?
   - Simple → **Use Checkboxes**: Best for multiple selections (patterns/forms/checkbox.md)
   - With Search → **Use Multi-select**: Best for multiple selections with search (patterns/forms/multi-select-input.md)
   - Tags → **Use Tag Input**: Best for multiple text entries as tags (patterns/forms/tag-input.md)
8. **How many options?** Consider the number of choices available
   - < 5 → **Use Radio Buttons**: Best for single selection from few options (patterns/forms/radio.md)
   - > 5 → **Use Select Dropdown**: Best for single selection from many options (patterns/forms/selection-input.md)
9. **What kind of special input?** Select the specific type of input needed
   - Date → **Use Date Input**: Best for date selection (patterns/forms/date-input.md)
   - Time → **Use Time Input**: Best for time selection (patterns/forms/time-input.md)
   - File → **Use File Input**: Best for file uploads (patterns/forms/file-input.md)
   - Range → **Use Range Input**: Best for numeric ranges (patterns/forms/slider.md)
   - Color → **Use Color Picker**: Best for color selection (patterns/forms/color-picker.md)
   - Rating → **Use Rating Input**: Best for collecting ratings or scores (patterns/forms/rating-input.md)
   - Code → **Use Code Input**: Best for verification codes or OTP (patterns/forms/code-confirmation.md)
   - Boolean → **Use Toggle Switch**: Best for boolean options (patterns/forms/toggle.md)

- **Text Input** (patterns/forms/text-field.md): Best for single-line text entry and basic data collection. Best for: Single-line text entry; Basic user input; Short responses; Simple data collection; Form fields like name, email
- **Textarea** (patterns/forms/textarea.md): Ideal for multi-line content and rich text editing. Best for: Multi-line text entry; Long-form content; Rich text editing; Comments and descriptions; Detailed responses
- **Select** (patterns/forms/selection-input.md): Perfect for choosing from predefined options. Best for: Predefined options; Space-efficient interface; Large option sets; Structured data input; Hierarchical selection
- **Radio** (patterns/forms/radio.md): Best for mutually exclusive choices. Best for: Single choice from few options; Mutually exclusive selections; Visual comparison needed; Immediate option visibility; Simple decision making
- **Checkbox** (patterns/forms/checkbox.md): Ideal for multiple selections and toggles. Best for: Multiple selections allowed; Boolean states; Independent options; Toggle functionality; Group selections

### Implementation Considerations

- **Accessibility Support:** Native support for screen readers and keyboard navigation
- **Mobile Usability:** Touch-friendly interface and mobile keyboard optimization
- **Browser Support:** Cross-browser compatibility and consistent behavior

- **Text Input**: Accessibility Support 90 (green): Strong native support; Mobile Usability 95 (green): Excellent; Browser Support 100 (green): Universal
- **Number Input**: Accessibility Support 85 (green): Good native support; Mobile Usability 80 (yellow): Numeric keyboard; Browser Support 95 (green): Well supported
- **Date Input**: Accessibility Support 75 (yellow): Varies by browser; Mobile Usability 85 (green): Native pickers; Browser Support 80 (yellow): Inconsistent UI
- **File Input**: Accessibility Support 80 (green): Basic support; Mobile Usability 75 (yellow): Device dependent; Browser Support 90 (green): Well supported
- **Password Input**: Accessibility Support 85 (green): Good support; Mobile Usability 90 (green): Password keyboard; Browser Support 100 (green): Universal
- **Color Input**: Accessibility Support 70 (yellow): Limited support; Mobile Usability 75 (yellow): Varies by device; Browser Support 85 (yellow): Modern browsers
- **Range Input**: Accessibility Support 75 (yellow): Needs ARIA enhancement; Mobile Usability 80 (yellow): Touch friendly; Browser Support 90 (green): Well supported

## Next steps

Ready to implement your chosen pattern? Check out our detailed implementation guides:

- **Text Input Implementation** (patterns/forms/text-field.md): How to implement and style text inputs
- **Select Component Guide** (patterns/forms/selection-input.md): Building accessible select components
- **Radio Pattern** (patterns/forms/radio.md): Best practices for option selection
