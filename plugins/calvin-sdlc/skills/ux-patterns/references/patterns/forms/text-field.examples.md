# Text Field: demo code

**Sections (line range):** basic 7-71 · character-counter 72-236 · helper-text 237-374 · input-types 375-617 · required 618-928 · validation 929-1075 · with-icons 1076-1305

Code of the live demos on https://uxpatterns.dev/patterns/forms/text-field. Plain HTML, CSS and JS.

## basic

```html
<div class="text-field">
  <label for="username">Username</label>
  <input 
    type="text" 
    id="username" 
    name="username" 
    placeholder="Enter your username"
  />
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .text-field {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input[type="text"]:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
```

## character-counter

```html
<div class="container">
  <!-- Short text field with counter -->
  <div class="text-field">
    <label for="title">Article Title</label>
    <input 
      type="text" 
      id="title" 
      name="title"
      placeholder="Enter article title"
      maxlength="60"
      aria-describedby="title-counter"
    />
    <div class="text-field__counter" id="title-counter">0/60</div>
  </div>

  <!-- Textarea with counter -->
  <div class="text-field">
    <label for="bio">Bio</label>
    <textarea 
      id="bio" 
      name="bio"
      placeholder="Tell us about yourself..."
      maxlength="160"
      aria-describedby="bio-counter"
    ></textarea>
    <div class="text-field__counter" id="bio-counter">0/160</div>
  </div>

  <!-- Pre-filled example showing warning state -->
  <div class="text-field text-field--warning">
    <label for="tweet">Tweet</label>
    <textarea 
      id="tweet" 
      name="tweet"
      placeholder="What's happening?"
      maxlength="280"
      aria-describedby="tweet-counter"
    >This is a longer tweet that demonstrates the warning state when approaching the character limit. The counter should change color as we get close to the maximum allowed characters for this field.</textarea>
    <div class="text-field__counter text-field__counter--warning" id="tweet-counter">225/280</div>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .text-field {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"], textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-family: inherit;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: vertical;
  }

  textarea {
    min-height: 100px;
  }

  input[type="text"]:focus, textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .text-field__counter {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    text-align: right;
    color: #6b7280;
    transition: color 0.2s;
  }

  .text-field__counter--warning {
    color: #d97706;
  }

  .text-field__counter--danger {
    color: #dc2626;
  }

  .text-field--warning input, .text-field--warning textarea {
    border-color: #f59e0b;
  }

  .text-field--danger input, .text-field--danger textarea {
    border-color: #ef4444;
  }
```

```js
// Character counter functionality
  function updateCounter(input, counter) {
    const current = input.value.length;
    const max = parseInt(input.getAttribute('maxlength'));
    const remaining = max - current;
    
    counter.textContent = current + '/' + max;
    
    const field = input.closest('.text-field');
    field.classList.remove('text-field--warning', 'text-field--danger');
    counter.classList.remove('text-field__counter--warning', 'text-field__counter--danger');
    
    if (remaining <= max * 0.05) { // 95% full
      field.classList.add('text-field--danger');
      counter.classList.add('text-field__counter--danger');
    } else if (remaining <= max * 0.2) { // 80% full
      field.classList.add('text-field--warning');
      counter.classList.add('text-field__counter--warning');
    }
  }

  // Initialize all character counters
  document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
    const counterId = input.getAttribute('aria-describedby');
    const counter = document.getElementById(counterId);
    
    if (counter) {
      // Initial count
      updateCounter(input, counter);
      
      // Update on input
      input.addEventListener('input', () => updateCounter(input, counter));
    }
  });
```

## helper-text

```html
<div class="container">
  <!-- Helper text below -->
  <div class="text-field">
    <label for="email">Email Address</label>
    <input 
      type="text" 
      id="email" 
      name="email"
      placeholder="Enter your email"
      aria-describedby="email-help"
    />
    <p class="text-field__helper" id="email-help">
      We'll never share your email with anyone else.
    </p>
  </div>

  <!-- Helper text above for formatting requirements -->
  <div class="text-field">
    <label for="phone">Phone Number</label>
    <p class="text-field__helper text-field__helper--above" id="phone-format">
      Format: +1 (555) 123-4567
    </p>
    <input 
      type="tel" 
      id="phone" 
      name="phone"
      placeholder="+1 (555) 123-4567"
      aria-describedby="phone-format"
    />
  </div>

  <!-- Password with requirements above -->
  <div class="text-field">
    <label for="password">
      Password <span class="required">(Required)</span>
    </label>
    <p class="text-field__helper text-field__helper--above" id="password-requirements">
      Must be at least 8 characters with one number and special character.
    </p>
    <input 
      type="password" 
      id="password" 
      name="password"
      required
      aria-describedby="password-requirements"
    />
  </div>

  <!-- Multiple lines of helper text -->
  <div class="text-field">
    <label for="username">Username</label>
    <input 
      type="text" 
      id="username" 
      name="username"
      placeholder="Choose a username"
      aria-describedby="username-help"
    />
    <p class="text-field__helper" id="username-help">
      Your username will be visible to other users. It can contain letters, numbers, and underscores only. Must be between 3-20 characters.
    </p>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .text-field {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"], input[type="tel"], input[type="password"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="tel"]:focus, input[type="password"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .text-field__helper {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .text-field__helper--above {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 500;
  }

  .required {
    color: #dc2626;
  }
```

## input-types

```html
<div class="container">
  <!-- Email -->
  <div class="text-field">
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      placeholder="user@example.com"
      required
    />
    <div class="text-field__helper">Shows email keyboard on mobile</div>
  </div>

  <!-- Phone -->
  <div class="text-field">
    <label for="phone">Phone</label>
    <input 
      type="tel" 
      id="phone" 
      name="phone"
      placeholder="+1 (555) 123-4567"
    />
    <div class="text-field__helper">Shows numeric keypad on mobile</div>
  </div>

  <!-- URL -->
  <div class="text-field">
    <label for="website">Website</label>
    <input 
      type="url" 
      id="website" 
      name="website"
      placeholder="https://example.com"
    />
    <div class="text-field__helper">Validates URL format</div>
  </div>

  <!-- Number -->
  <div class="text-field">
    <label for="age">Age</label>
    <input 
      type="number" 
      id="age" 
      name="age"
      min="18"
      max="120"
      placeholder="25"
    />
    <div class="text-field__helper">Number input with min/max</div>
  </div>

  <!-- Date -->
  <div class="text-field">
    <label for="birthdate">Birth Date</label>
    <input 
      type="date" 
      id="birthdate" 
      name="birthdate"
      max="2006-01-01"
    />
    <div class="text-field__helper">Native date picker</div>
  </div>

  <!-- Time -->
  <div class="text-field">
    <label for="appointment">Time</label>
    <input 
      type="time" 
      id="appointment" 
      name="appointment"
      min="09:00"
      max="18:00"
    />
    <div class="text-field__helper">Business hours only</div>
  </div>

  <!-- Color -->
  <div class="text-field">
    <label for="color">Favorite Color</label>
    <input 
      type="color" 
      id="color" 
      name="color"
      value="#3b82f6"
    />
    <div class="text-field__helper">Native color picker</div>
  </div>

  <!-- Range -->
  <div class="text-field">
    <label for="volume">Volume</label>
    <input 
      type="range" 
      id="volume" 
      name="volume"
      min="0"
      max="100"
      value="50"
    />
    <div class="text-field__helper">Slider input: <span id="volume-value">50</span>%</div>
  </div>

  <!-- Search -->
  <div class="text-field text-field--full">
    <label for="search">Search</label>
    <input 
      type="search" 
      id="search" 
      name="search"
      placeholder="Search products, articles, or help..."
    />
    <div class="text-field__helper">Search input with clear button (browser dependent)</div>
  </div>

  <!-- Password -->
  <div class="text-field text-field--full">
    <label for="password">Password</label>
    <input 
      type="password" 
      id="password" 
      name="password"
      placeholder="Enter secure password"
      minlength="8"
      required
    />
    <div class="text-field__helper">Masked input with minimum length validation</div>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .text-field {
    width: 100%;
  }

  .text-field--full {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input:invalid {
    border-color: #ef4444;
  }

  input:invalid:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .text-field__helper {
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  @media (max-width: 640px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
```

```js
// Update range value display
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volume-value');

  volumeSlider.addEventListener('input', function() {
    volumeValue.textContent = this.value;
  });

  // Form validation feedback
  const form = document.querySelector('form') || document.body;
  const inputs = document.querySelectorAll('input[required]');

  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.validity.valid) {
        this.style.borderColor = '#10b981';
      } else if (this.value.length > 0) {
        this.style.borderColor = '#ef4444';
      }
    });

    input.addEventListener('input', function() {
      if (this.validity.valid && this.value.length > 0) {
        this.style.borderColor = '#10b981';
      } else {
        this.style.borderColor = '#d1d5db';
      }
    });
  });
```

## required

```html
<div class="container">
  <!-- Best Practice: Explicit Required Label -->
  <div class="form-section">
    <h3>✅ Best Practice: Explicit "Required"</h3>
    <div class="form-note">Most accessible - clear for all users</div>
    
    <div class="text-field">
      <label for="username1">Username <span class="required">(Required)</span></label>
      <input 
        type="text" 
        id="username1" 
        name="username1"
        required
        placeholder="Enter your username"
      />
    </div>
    
    <div class="text-field">
      <label for="email1">Email Address <span class="required">(Required)</span></label>
      <input 
        type="email" 
        id="email1" 
        name="email1"
        required
        placeholder="Enter your email"
      />
    </div>
  </div>

  <!-- Asterisk with ARIA Explanation -->
  <div class="form-section">
    <h3>✅ Asterisk with ARIA Support</h3>
    <div class="form-note">Common practice with proper accessibility</div>
    <p id="required-legend" class="form-legend">Fields marked with an asterisk (*) are required.</p>
    
    <div class="text-field">
      <label for="username2">Username <span class="required-icon" aria-hidden="true">*</span></label>
      <input 
        type="text" 
        id="username2" 
        name="username2"
        required
        aria-describedby="required-legend"
        placeholder="Enter your username"
      />
    </div>
    
    <div class="text-field">
      <label for="password2">Password <span class="required-icon" aria-hidden="true">*</span></label>
      <input 
        type="password" 
        id="password2" 
        name="password2"
        required
        aria-describedby="required-legend"
        placeholder="Enter your password"
      />
    </div>
  </div>

  <!-- Visually Hidden Text -->
  <div class="form-section">
    <h3>⚠️ Visually Hidden (Screen Reader Only)</h3>
    <div class="form-note">Clean UI but no visual indicator for sighted users</div>
    
    <div class="text-field">
      <label for="email3">Email <span class="sr-only">(Required)</span></label>
      <input 
        type="email" 
        id="email3" 
        name="email3"
        required
        placeholder="Enter your email"
      />
    </div>
    
    <div class="text-field">
      <label for="username3">Username <span class="sr-only">(Required)</span></label>
      <input 
        type="text" 
        id="username3" 
        name="username3"
        required
        placeholder="Enter your username"
      />
    </div>
  </div>

  <!-- Tooltip Approach -->
  <div class="form-section">
    <h3>💡 Interactive Tooltip</h3>
    <div class="form-note">Provides guidance on hover/focus</div>
    
    <div class="text-field">
      <label for="username4">
        Username 
        <span class="tooltip required-icon" data-tooltip="This field is required" tabindex="0">*</span>
      </label>
      <input 
        type="text" 
        id="username4" 
        name="username4"
        required
        aria-describedby="username4-help"
        placeholder="Enter your username"
      />
      <span id="username4-help" class="sr-only">Username is required</span>
    </div>
  </div>

  <!-- Anti-Pattern: Required Attribute Only -->
  <div class="form-section">
    <h3>❌ Anti-Pattern: HTML5 Only</h3>
    <div class="form-note">No visible indicator until form submission</div>
    
    <div class="text-field">
      <label for="email4">Email</label>
      <input 
        type="email" 
        id="email4" 
        name="email4"
        required
        placeholder="Enter your email"
      />
    </div>
    
    <div class="text-field">
      <label for="password4">Password</label>
      <input 
        type="password" 
        id="password4" 
        name="password4"
        required
        placeholder="Enter your password"
      />
    </div>
    
    <button type="submit" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
      Submit (Try without filling fields)
    </button>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .form-section h3 {
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .text-field {
    width: 100%;
    margin-bottom: 1rem;
  }

  .text-field:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"], input[type="email"], input[type="password"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input[type="text"]:invalid, input[type="email"]:invalid, input[type="password"]:invalid {
    border-color: #ef4444;
  }

  .required {
    color: #dc2626;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .form-note {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.375rem;
    border-left: 4px solid #3b82f6;
  }

  .required-icon {
    color: #dc2626;
    font-weight: bold;
  }

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: white;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 1;
  }

  .form-legend {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
```

```js
// Add form validation feedback
  document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      input.addEventListener('invalid', function() {
        this.style.borderColor = '#ef4444';
      });
      
      input.addEventListener('input', function() {
        if (this.validity.valid) {
          this.style.borderColor = '#10b981';
        } else {
          this.style.borderColor = '#d1d5db';
        }
      });
    });

    // Prevent actual form submission for demo
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Form submission prevented for demo purposes. Check the required field validation!');
      });
    }
  });
```

## validation

```html
<div class="container">
  <!-- Error State -->
  <div class="text-field text-field--error">
    <label for="password">Password</label>
    <input 
      type="text" 
      id="password" 
      name="password"
      value="123"
      aria-invalid="true"
      aria-describedby="password-error"
    />
    <output class="text-field__message text-field__error" id="password-error">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      Password must be at least 8 characters
    </output>
  </div>

  <!-- Success State -->
  <div class="text-field text-field--success">
    <label for="username">Username</label>
    <input 
      type="text" 
      id="username" 
      name="username"
      value="john_doe_2024"
      aria-describedby="username-success"
    />
    <output class="text-field__message text-field__success" id="username-success">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Username is available
    </output>
  </div>

  <!-- Normal State -->
  <div class="text-field">
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      placeholder="Enter your email"
    />
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .text-field {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"], input[type="email"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="email"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Error state */
  .text-field--error input {
    border-color: #ef4444;
  }

  .text-field--error input:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* Success state */
  .text-field--success input {
    border-color: #10b981;
  }

  .text-field--success input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .text-field__message {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .text-field__error {
    color: #dc2626;
  }

  .text-field__success {
    color: #059669;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }
```

## with-icons

```html
<div class="container">
  <!-- Search with prefix icon -->
  <div class="text-field text-field--prefix">
    <label for="search">Search</label>
    <div class="text-field__wrapper">
      <svg class="text-field__icon text-field__prefix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input 
        type="search" 
        id="search" 
        name="search"
        placeholder="Search products..."
      />
    </div>
  </div>

  <!-- Email with suffix icon -->
  <div class="text-field text-field--suffix">
    <label for="email">Email Address</label>
    <div class="text-field__wrapper">
      <input 
        type="email" 
        id="email" 
        name="email"
        placeholder="Enter your email"
      />
      <svg class="text-field__icon text-field__suffix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
      </svg>
    </div>
  </div>

  <!-- URL with both prefix and suffix -->
  <div class="text-field text-field--both">
    <label for="website">Website URL</label>
    <div class="text-field__wrapper">
      <svg class="text-field__icon text-field__prefix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
      </svg>
      <input 
        type="url" 
        id="website" 
        name="website"
        placeholder="https://example.com"
      />
      <button type="button" class="text-field__suffix--button" aria-label="Visit website">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </button>
    </div>
  </div>

  <!-- Password with toggle visibility button -->
  <div class="text-field text-field--suffix">
    <label for="password">Password</label>
    <div class="text-field__wrapper">
      <input 
        type="password" 
        id="password" 
        name="password"
        placeholder="Enter your password"
      />
      <button type="button" class="text-field__suffix--button" id="toggle-password" aria-label="Show password">
        <svg id="eye-closed" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828l4.242 4.242M12 7c.796 0 1.559.156 2.268.428m2.679 2.1A10.05 10.05 0 0121 12c-.77 2.722-2.347 5.149-4.5 6.825m-1.236.275A10.05 10.05 0 0112 19"></path>
        </svg>
        <svg id="eye-open" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .text-field {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .text-field__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="password"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="email"]:focus, input[type="search"]:focus, input[type="url"]:focus, input[type="password"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .text-field--prefix input {
    padding-left: 2.5rem;
  }

  .text-field--suffix input {
    padding-right: 2.5rem;
  }

  .text-field--both input {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .text-field__icon {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
    pointer-events: none;
  }

  .text-field__prefix {
    left: 0.75rem;
  }

  .text-field__suffix {
    right: 0.75rem;
  }

  .text-field__suffix--button {
    right: 0.5rem;
    pointer-events: auto;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s, background-color 0.2s;
  }

  .text-field__suffix--button:hover {
    color: #374151;
    background: #f3f4f6;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
```

```js
// Password toggle functionality
  const toggleButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const eyeClosed = document.getElementById('eye-closed');
  const eyeOpen = document.getElementById('eye-open');

  toggleButton.addEventListener('click', function() {
    const isPassword = passwordInput.type === 'password';
    
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleButton.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    
    eyeClosed.style.display = isPassword ? 'none' : 'block';
    eyeOpen.style.display = isPassword ? 'block' : 'none';
  });

  // Visit website functionality
  const websiteInput = document.querySelector('input[name="website"]');
  const visitButton = document.querySelector('.text-field__suffix--button[aria-label="Visit website"]');

  if (visitButton && websiteInput) {
    visitButton.addEventListener('click', function() {
      const url = websiteInput.value.trim();
      if (url) {
        // Add protocol if missing
        const fullUrl = url.startsWith('http') ? url : 'https://' + url;
        window.open(fullUrl, '_blank');
      }
    });
  }
```
