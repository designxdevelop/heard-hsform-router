# Heard Local Scheduler

A JavaScript-based routing system for HubSpot forms that intelligently directs users to appropriate scheduling pages based on their form responses.

## Overview

This project provides a seamless integration between HubSpot forms and HubSpot Meeting schedulers, automatically routing users to the correct consultation type based on their practice ownership structure. The system handles form data persistence, scheduler injection, fallback redirects, and PartnerStack tracking.

## Features

- **Smart Routing**: Automatically routes users to appropriate schedulers based on revenue question responses
- **Partial Fill Detection**: Captures email addresses early and submits them to HubSpot when users leave before completing the form
- **Multistep Form Support**: Robust fallback mechanism for multistep forms, detecting completion via DOM "Thank You" messages when standard callbacks fail
- **Data Persistence**: Preserves form data across page transitions using localStorage, sessionStorage, and cookies
- **Scheduler Injection**: Dynamically embeds HubSpot Meeting schedulers with pre-filled information (name, email, company, phone)
- **Post-scheduling Attribution**: Shows a required “How did you hear about us?” radio form after a scheduler booking is detected and submits the selected value back to HubSpot by email
- **PartnerStack Tracking**: Automatic ps_xid parameter management for attribution tracking, including hidden form field population
- **Analytics Integration**: Fires conversion events to Reddit, Meta (Facebook), Google Analytics, PostHog, and Amplitude
- **Debug Mode**: Built-in draggable debug panel for inspecting stored form data and routing decisions
- **Fallback Support**: Graceful handling when schedulers fail to load

## Files

- `global-cookie.js` - Universal cookie management and PartnerStack tracking
- `hubspot-form-router.js` - Main routing logic that listens for HubSpot form submissions
- `wf-scheduler-injection.js` - Handles scheduler injection and form data prefilling
- `form.css` - Heard brand styling for HubSpot forms
- `welcome-form.css` - Minor UI adjustments for radio and checkbox label weights
- `embed.html` - Example HTML implementation
- `test-ps-xid.html` - Test page for PartnerStack tracking functionality

## Installation

```bash
# Install dependencies (if any)
bun install

# Build minified production files
bun run build
```

The build process creates minified versions in the `dist/` directory.

## Usage

### Basic Implementation

1. Include the form embed code and router script on your page:

```html
<!-- HubSpot Form -->
<script
  src="https://js.hsforms.net/forms/embed/developer/7507639.js"
  defer
></script>
<div
  class="hs-form-html"
  data-form-id="YOUR-FORM-ID"
  data-portal-id="7507639"
></div>

<!-- Load the Router -->
<script src="hubspot-form-router.js"></script>
```

2. On your scheduler page, include the complete scheduler script:

```html
<script src="wf-scheduler-injection.js"></script>
```

### Routing Logic

The system routes based on the revenue question:

- **Over $100k** → `https://meetings.hubspot.com/bz/consultation`
- **Under $100k or not answered** → `https://meetings.hubspot.com/bz/consultations`

### Debug Mode

Enable debug logging by adding `?debug=true` to any URL:

```
https://yoursite.com/scheduler?debug=true
```

## Configuration

Scheduler URLs and routing logic are configured in the main script:

```javascript
const SCHEDULER_CONFIG = {
  over_100k: {
    url: 'https://meetings.hubspot.com/bz/consultation',
    name: 'Consultation Scheduler',
    description: 'Revenue over $100k',
  },
  under_100k: {
    url: 'https://meetings.hubspot.com/bz/consultations',
    name: 'Consultations Scheduler',
    description: 'Revenue under $100k or not provided',
  },
};

const ROUTE_DESTINATIONS = {
  success: '/thank-you/success', // Disqualified users
  schedule: '/thank-you/schedule', // Qualified users
};
```

**Note**: Routing is determined by the revenue question and defaults to the under-$100k scheduler if no response is available.

## Development

```bash
# Format code with Prettier
bunx prettier --write .

# Build for production
bun run build

# Watch mode (rebuild on changes)
bun run watch

# Test (when tests are added)
bun test
```

### Code Style

- Vanilla JavaScript (ES6+)
- IIFE pattern for script isolation
- Prettier formatting (single quotes, 2-space indent, semicolons)
- Try-catch blocks for storage operations
- Conditional logging with DEBUG flag

## Browser Compatibility

- Modern browsers with ES6 support
- localStorage and sessionStorage support required
- Works with HubSpot's embed/developer forms

## License

Private repository - Heard internal use only

## Support

For issues or questions, contact the Heard development team.

## Script Details

### 1. `global-cookie.js`

Universal cookie management and tracking script that runs on all pages.

**Features:**

- Captures PartnerStack tracking IDs (`ps_xid`, `ps_partner_key`) from URL parameters
- Stores IDs in cross-domain cookies (90-day expiration) and localStorage for redundancy
- Sanitizes input to prevent XSS attacks
- Works across all subdomains via `.joinheard.com` cookie domain
- **Auto-appends ps_xid to URLs** on pages with HubSpot forms or key conversion pages:
  - Automatically detects HubSpot form elements and APIs
  - Monitors for dynamically added forms with MutationObserver
  - Preserves existing URL parameters
  - Updates URL without page reload using History API
  - Targets specific paths: `/free-consult`, `/thank-you`, `/schedule`, `/consultation`
  - Ensures consistent tracking across the entire conversion funnel

**Usage:**

```html
<!-- Add to all pages, especially those with forms -->
<script src="global-cookie.js"></script>
```

### 2. `hubspot-form-router.js`

Handles form submission routing and data capture.

**Features:**

- Listens for HubSpot form submissions via postMessage
- Captures form data from developer embeds
- Routes users based on an exhaustive list of revenue field values
- Stores form data (including scheduler type) for scheduler prefilling
- Manages PartnerStack attribution and hidden `partnerstack_click_id` field population
- **Partial fill detection**: Monitors email inputs and submits to HubSpot via `fetch` with `keepalive` when users navigate away before completing the form
- **Multistep fallback**: Uses a timer and DOM observation to detect "Thank You" messages when standard form submission callbacks fail
- Active input monitoring for developer-embed forms and radio selections

### 3. `wf-scheduler-injection.js`

Injects and configures HubSpot Meeting schedulers.

**Features:**

- Retrieves stored form data from sessionStorage, localStorage, and cookies
- Builds enhanced scheduler URLs with prefilled data (name, email, company, phone)
- Renders the post-scheduling HDYHAU form only after HubSpot Meetings appears to confirm a booking
- Submits HDYHAU responses to HubSpot with `email`, `how_did_you_hear_about_us`, and optional `hdyhau_other_text` fields
- Handles fallback to form page if no data exists
- Fires conversion events to multiple platforms: Reddit, Meta (Facebook), Google Analytics, PostHog, and Amplitude
- Includes a draggable debug panel (enabled via `?debug=true`) for inspecting stored data and routing decisions

**HDYHAU HubSpot setup:**

Create or confirm a HubSpot form with these fields:

- `email`
- `how_did_you_hear_about_us`
- `hdyhau_other_text`

The production HDYHAU form is configured in `wf-scheduler-injection.js`:

```html
<script
  src="https://js.hsforms.net/forms/embed/developer/7507639.js"
  defer
></script>
<div
  class="hs-form-html"
  data-region="na1"
  data-form-id="2abfe31d-49b3-433d-9776-4ff663f8c0b9"
  data-portal-id="7507639"
></div>
```

The HDYHAU form uses the email passed to `/thank-you/schedule` in the query string or stored router data to match and update the existing contact.

## Changelog

### October 23, 2025

- **Added**: Automatic ps_xid URL parameter management in `global-cookie.js`
  - Auto-appends ps_xid to pages with HubSpot forms for consistent tracking
  - Syncs between cookie and localStorage for redundancy
  - Monitors for dynamically added forms
  - Preserves existing URL parameters
  - Added test page for verification

### February 5, 2026

- **Updated**: Revenue-based routing restored
  - Over $100k routes to consultation scheduler
  - Under $100k or blank routes to consultations scheduler
  - Updated scheduler configuration and docs

### February 2026

- **Added**: Partial fill detection for early email capture
  - Submits captured email to HubSpot via `fetch` with `keepalive` on `beforeunload`
  - Switched from Blob to direct fetch for improved reliability
- **Added**: Enhanced form data storage with scheduler type
- **Improved**: Multistep form completion detection fallback via DOM "Thank You" message observation
- **Improved**: Unified logging approach across all scripts for consistency
- **Added**: Watch mode build script (`bun run watch`)
- **Added**: `welcome-form.css` for radio/checkbox label styling
