/**
 * Complete Webflow Scheduler Script
 * Handles form data detection, scheduler injection, and fallback redirect
 */

(function () {
  'use strict';

  const DEBUG = window.location.search.includes('debug=true');

  function log(...args) {
    if (DEBUG) console.log('[Webflow Scheduler]', ...args);
  }

  // Configuration - revenue-based scheduler
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

  const HDYHAU_CONFIG = {
    portalId:
      (window.HDYHAU_CONFIG && window.HDYHAU_CONFIG.portalId) || '7507639',
    formId:
      (window.HDYHAU_CONFIG && window.HDYHAU_CONFIG.formId) ||
      window.HDYHAU_FORM_ID ||
      '2abfe31d-49b3-433d-9776-4ff663f8c0b9',
    sourcePropertyName:
      (window.HDYHAU_CONFIG && window.HDYHAU_CONFIG.sourcePropertyName) ||
      'how_did_you_hear_about_us',
    otherPropertyName:
      (window.HDYHAU_CONFIG && window.HDYHAU_CONFIG.otherPropertyName) ||
      'hdyhau_other_text',
  };

  const HDYHAU_OPTIONS = [
    'Search engine',
    'Social media',
    'Reddit',
    'AI research',
    'Podcast',
    'Blog, article, or news',
    'Influencer or content creator',
    'Postcard or mailer',
    'Professional association',
    'Therapy platform or tools',
    'Friend, family, or colleague',
    'Billboard',
  ];

  let HDYHAU_FORM_RENDERED = false;
  let HDYHAU_FORM_SUBMITTED = false;

  // Get form data from all storage sources
  function getStoredFormData() {
    // Try sessionStorage first since it includes scheduler_type.
    try {
      const storedData = sessionStorage.getItem('scheduler_router_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        log('Found router data in sessionStorage:', data);
        sessionStorage.removeItem('scheduler_router_data'); // Clear after reading
        return {
          formData: data.formData,
          schedulerType: data.scheduler_type,
          source: 'sessionStorage',
        };
      }
    } catch (e) {
      log('sessionStorage error:', e);
    }

    // Fallback to localStorage for form prefill data.
    try {
      const localStorageData = localStorage.getItem('hubspot_form_data');
      if (localStorageData) {
        const formData = JSON.parse(localStorageData);
        log('Found form data in localStorage:', formData);
        return { formData: formData, source: 'localStorage' };
      }
    } catch (e) {
      log('localStorage error:', e);
    }

    // Try cookies as fallback
    try {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      const schedulerType = getCookie('scheduler_type');
      const formDataCookie = getCookie('form_data');

      if (schedulerType || formDataCookie) {
        const formData = formDataCookie ? JSON.parse(atob(formDataCookie)) : {};

        // Clear cookies
        document.cookie = 'scheduler_type=; path=/; max-age=0';
        document.cookie = 'form_data=; path=/; max-age=0';

        log('Found data in cookies:', { schedulerType, formData });
        return {
          formData: formData,
          schedulerType: schedulerType,
          source: 'cookies',
        };
      }
    } catch (e) {
      log('cookie error:', e);
    }

    return null;
  }

  // Get URL parameters
  function getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  }

  function resolveSchedulerType(storedData, formData) {
    if (storedData && storedData.schedulerType) {
      return storedData.schedulerType;
    }

    if (
      storedData &&
      storedData.formData &&
      storedData.formData.scheduler_type
    ) {
      return storedData.formData.scheduler_type;
    }

    if (formData && formData.scheduler_type) {
      return formData.scheduler_type;
    }

    return 'under_100k';
  }

  function getHubSpotCookie() {
    try {
      const match = document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : '';
    } catch (e) {
      log('HubSpot cookie lookup error:', e);
      return '';
    }
  }

  function getContactEmail(formData) {
    if (!formData) return '';

    const emailFields = ['email', 'email_address', '0-1/email', '0-2/email'];

    for (const fieldName of emailFields) {
      if (formData[fieldName]) {
        return String(formData[fieldName]).trim();
      }
    }

    return '';
  }

  function shuffleOptions(options) {
    const shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return [...shuffled, 'Other'];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildHdyhauEndpoint() {
    if (!HDYHAU_CONFIG.formId) return '';

    return (
      'https://api.hsforms.com/submissions/v3/integration/submit/' +
      HDYHAU_CONFIG.portalId +
      '/' +
      HDYHAU_CONFIG.formId
    );
  }

  function submitHdyhauResponse(email, source, otherText) {
    const endpoint = buildHdyhauEndpoint();

    if (!endpoint) {
      return Promise.reject(new Error('Missing HDYHAU HubSpot form ID'));
    }

    const fields = [
      { name: 'email', value: email },
      { name: HDYHAU_CONFIG.sourcePropertyName, value: source },
    ];

    if (otherText) {
      fields.push({
        name: HDYHAU_CONFIG.otherPropertyName,
        value: otherText,
      });
    }

    const payload = {
      fields,
      context: {
        pageUri: window.location.href,
        pageName: document.title || 'Schedule Confirmation',
      },
    };

    const hutk = getHubSpotCookie();
    if (hutk) {
      payload.context.hutk = hutk;
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HubSpot HDYHAU submission failed: ${response.status}`);
      }

      return response;
    });
  }

  function ensureHdyhauStyles() {
    if (document.getElementById('hdyhau-styles')) return;

    const style = document.createElement('style');
    style.id = 'hdyhau-styles';
    style.textContent = `
      .hdyhau-modal {
        align-items: center;
        background: rgba(17, 24, 39, 0.48);
        box-sizing: border-box;
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 24px;
        position: fixed;
        z-index: 2147483000;
      }

      .hdyhau-modal[hidden] {
        display: none;
      }

      .hdyhau-dialog {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 24px 80px rgba(17, 24, 39, 0.24);
        box-sizing: border-box;
        max-height: min(720px, calc(100vh - 48px));
        max-width: 640px;
        overflow: auto;
        padding: 28px;
        position: relative;
        width: 100%;
      }

      .hdyhau-form {
        color: #1a1a1a;
        font-family: inherit;
        width: 100%;
      }

      .hdyhau-form[hidden] {
        display: none;
      }

      .hdyhau-close {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 8px;
        color: #4b5563;
        cursor: pointer;
        display: flex;
        font: inherit;
        font-size: 26px;
        height: 40px;
        justify-content: center;
        line-height: 1;
        padding: 0;
        position: absolute;
        right: 12px;
        top: 12px;
        width: 40px;
      }

      .hdyhau-close:hover,
      .hdyhau-close:focus {
        background: #f3f4f6;
        outline: none;
      }

      .hdyhau-question {
        border: 0;
        margin: 0;
        padding: 0;
      }

      .hdyhau-label {
        display: block;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 16px;
      }

      .hdyhau-options {
        display: grid;
        gap: 10px;
      }

      .hdyhau-option {
        align-items: flex-start;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        gap: 10px;
        line-height: 1.4;
        padding: 12px 14px;
      }

      .hdyhau-option input {
        flex: 0 0 auto;
        margin-top: 2px;
      }

      .hdyhau-other-field {
        margin-top: 14px;
      }

      .hdyhau-other-field label {
        display: block;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .hdyhau-other-field input {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        box-sizing: border-box;
        font: inherit;
        min-height: 48px;
        padding: 12px 14px;
        width: 100%;
      }

      .hdyhau-submit {
        background: #2e7d32;
        border: 0;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
        margin-top: 18px;
        min-height: 52px;
        padding: 14px 28px;
        width: 100%;
      }

      .hdyhau-submit:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .hdyhau-status {
        font-size: 15px;
        margin-top: 12px;
        min-height: 22px;
      }

      .hdyhau-status[data-state='error'] {
        color: #b91c1c;
      }

      @media (max-width: 640px) {
        .hdyhau-modal {
          align-items: flex-end;
          padding: 0;
        }

        .hdyhau-dialog {
          border-radius: 8px 8px 0 0;
          max-height: min(84vh, 720px);
          max-width: none;
          padding: 24px 18px calc(18px + env(safe-area-inset-bottom));
        }

        .hdyhau-label {
          font-size: 17px;
          padding-right: 40px;
        }

        .hdyhau-option {
          padding: 11px 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderHdyhauForm(formData, target) {
    if (HDYHAU_FORM_RENDERED || HDYHAU_FORM_SUBMITTED) return;

    const email = getContactEmail(formData);
    if (!email) {
      log('Skipping HDYHAU form because no contact email was found');
      return;
    }

    HDYHAU_FORM_RENDERED = true;
    ensureHdyhauStyles();

    const modal = document.createElement('div');
    modal.id = 'hdyhau-modal';
    modal.className = 'hdyhau-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'hdyhau-question-label');

    const dialog = document.createElement('div');
    dialog.className = 'hdyhau-dialog';

    const closeButton = document.createElement('button');
    closeButton.className = 'hdyhau-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.textContent = '×';

    const form = document.createElement('form');
    form.id = 'hdyhau-form';
    form.className = 'hdyhau-form';
    form.noValidate = true;

    const optionsHtml = shuffleOptions(HDYHAU_OPTIONS)
      .map((option, index) => {
        const id = `hdyhau-option-${index}`;
        return `
          <label class="hdyhau-option" for="${id}">
            <input
              id="${id}"
              name="hdyhau_source"
              type="radio"
              value="${escapeHtml(option)}"
              required
            >
            <span>${escapeHtml(option)}</span>
          </label>
        `;
      })
      .join('');

    form.innerHTML = `
      <input type="hidden" name="email" value="${escapeHtml(email)}">
      <fieldset class="hdyhau-question">
        <legend class="hdyhau-label" id="hdyhau-question-label">How did you hear about us?</legend>
        <div class="hdyhau-options">${optionsHtml}</div>
      </fieldset>
      <div class="hdyhau-other-field" hidden>
        <label for="hdyhau-other-text">Please describe</label>
        <input
          id="hdyhau-other-text"
          name="hdyhau_other_text"
          type="text"
          autocomplete="off"
        >
      </div>
      <button class="hdyhau-submit" type="submit" disabled>Submit</button>
      <div class="hdyhau-status" role="status" aria-live="polite"></div>
    `;

    dialog.appendChild(closeButton);
    dialog.appendChild(form);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    const submitButton = form.querySelector('.hdyhau-submit');
    const otherField = form.querySelector('.hdyhau-other-field');
    const otherInput = form.querySelector('#hdyhau-other-text');
    const status = form.querySelector('.hdyhau-status');
    const previouslyFocusedElement = document.activeElement;

    function handleHdyhauKeydown(event) {
      if (event.key === 'Escape' && document.body.contains(modal)) {
        closeHdyhauModal();
      }
    }

    function closeHdyhauModal() {
      modal.hidden = true;
      modal.remove();
      document.removeEventListener('keydown', handleHdyhauKeydown);

      if (
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus === 'function'
      ) {
        previouslyFocusedElement.focus();
      }
    }

    closeButton.addEventListener('click', closeHdyhauModal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeHdyhauModal();
      }
    });

    document.addEventListener('keydown', handleHdyhauKeydown);
    closeButton.focus();

    form.addEventListener('change', () => {
      const selected = form.querySelector(
        'input[name="hdyhau_source"]:checked'
      );
      const hasSelection = !!selected;
      const isOther = selected && selected.value === 'Other';

      submitButton.disabled = !hasSelection || HDYHAU_FORM_SUBMITTED;
      otherField.hidden = !isOther;

      if (!isOther) {
        otherInput.value = '';
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const selected = form.querySelector(
        'input[name="hdyhau_source"]:checked'
      );
      if (!selected || HDYHAU_FORM_SUBMITTED) return;

      submitButton.disabled = true;
      status.dataset.state = '';
      status.textContent = '';

      submitHdyhauResponse(email, selected.value, otherInput.value.trim())
        .then(() => {
          HDYHAU_FORM_SUBMITTED = true;
          form
            .querySelectorAll('input, button')
            .forEach((field) => (field.disabled = true));
          status.textContent = 'Thanks!';
          setTimeout(closeHdyhauModal, 1200);
          log('HDYHAU response submitted');
        })
        .catch((error) => {
          submitButton.disabled = false;
          status.dataset.state = 'error';
          status.textContent = 'Please try again.';
          log('HDYHAU submission error:', error);
        });
    });

    log('HDYHAU form rendered');
  }

  function isHubSpotMessageOrigin(origin) {
    try {
      const host = new URL(origin).hostname;
      return (
        host.endsWith('hubspot.com') ||
        host.endsWith('hsforms.com') ||
        host.endsWith('hsforms.net') ||
        host.endsWith('hsappstatic.net') ||
        host.includes('hubspot') ||
        host.includes('hsforms')
      );
    } catch (e) {
      return false;
    }
  }

  function messageLooksLikeSchedulerSubmission(data) {
    const raw =
      typeof data === 'string' ? data : data ? JSON.stringify(data) : '';
    const message = raw.toLowerCase();

    return (
      message.includes('meetingbooksucceeded') ||
      message.includes('hsmeetingsbooksucceeded') ||
      message.includes('meeting_booked') ||
      message.includes('meetingbooked') ||
      message.includes('meeting booked') ||
      message.includes('booking confirmed') ||
      message.includes('meeting scheduled')
    );
  }

  function elementLooksLikeSchedulerConfirmation(element) {
    const text = (element.textContent || element.innerText || '').toLowerCase();

    return (
      text.includes('booked') ||
      text.includes('scheduled') ||
      text.includes('confirmed') ||
      text.includes('you are all set') ||
      text.includes("you're all set")
    );
  }

  function watchForSchedulerCompletion(formData, target) {
    if (!target) return;

    const showHdyhauForm = () => renderHdyhauForm(formData, target);

    window.addEventListener('message', (event) => {
      if (!isHubSpotMessageOrigin(event.origin)) return;
      if (messageLooksLikeSchedulerSubmission(event.data)) {
        log('Detected scheduler completion via postMessage');
        showHdyhauForm();
      }
    });

    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;

          if (elementLooksLikeSchedulerConfirmation(node)) {
            log('Detected scheduler completion via DOM mutation');
            showHdyhauForm();
            observer.disconnect();
            return;
          }
        }
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  // Build enhanced scheduler URL with form data
  function buildSchedulerUrl(formData, schedulerType) {
    const config =
      SCHEDULER_CONFIG[schedulerType] || SCHEDULER_CONFIG.under_100k;
    const url = new URL(config.url);

    // Always add embed parameter
    url.searchParams.set('embed', 'true');

    // PartnerStack tracking
    const partnerstackId =
      formData.partnerstack_click_id ||
      formData.ps_xid ||
      formData['0-1/partnerstack_click_id'] ||
      formData['0-2/partnerstack_click_id'];
    if (partnerstackId) {
      url.searchParams.set('partnerstack_click_id', partnerstackId);
      log('Adding PartnerStack click id', partnerstackId);
    }

    // Pre-fill common fields
    const fieldMappings = {
      email: ['email', 'email_address', '0-1/email', '0-2/email'],
      firstname: [
        'firstname',
        'first_name',
        'fname',
        '0-1/firstname',
        '0-2/firstname',
      ],
      lastname: [
        'lastname',
        'last_name',
        'lname',
        '0-1/lastname',
        '0-2/lastname',
      ],
      company: [
        'company',
        'practice_name',
        'business_name',
        '0-1/company',
        '0-2/company',
      ],
      phone: ['phone', 'phone_number', 'telephone', '0-1/phone', '0-2/phone'],
    };

    Object.entries(fieldMappings).forEach(([paramName, fieldNames]) => {
      for (const fieldName of fieldNames) {
        if (formData[fieldName]) {
          url.searchParams.set(paramName, formData[fieldName]);
          log(`Mapping ${fieldName} -> ${paramName}: ${formData[fieldName]}`);
          break;
        }
      }
    });

    // Handle additional HubSpot-specific fields
    const additionalFields = [
      'is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_',
      'what_best_describes_your_practice_',
      'referrer',
      'submissionGuid',
      'uuid',
      'partnerstack_click_id',
    ];

    additionalFields.forEach((fieldName) => {
      // Check for exact field name first
      if (formData[fieldName]) {
        url.searchParams.set(fieldName, formData[fieldName]);
        log(`Adding additional field: ${fieldName} = ${formData[fieldName]}`);
      } else {
        // Check for prefixed versions
        const prefixedVersions = [`0-1/${fieldName}`, `0-2/${fieldName}`];
        for (const prefixedField of prefixedVersions) {
          if (formData[prefixedField]) {
            url.searchParams.set(fieldName, formData[prefixedField]);
            log(
              `Adding prefixed field: ${prefixedField} -> ${fieldName} = ${formData[prefixedField]}`
            );
            break;
          }
        }
      }
    });

    // Add UTM parameters if present
    const utmParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ];
    utmParams.forEach((param) => {
      if (formData[param]) {
        url.searchParams.set(param, formData[param]);
      }
    });

    log('Built scheduler URL:', url.toString());
    return url.toString();
  }

  // Fire lead tracking events
  function fireLeadEvents(schedulerType) {
    try {
      // Only run if we're on the live production domain
      if (window.location.hostname.includes('joinheard.com')) {
        // Reddit Pixel - Lead Event
        if (typeof rdt === 'function') {
          rdt('track', 'Lead');
        }

        // Meta (Facebook) Pixel - Lead Event
        if (typeof fbq === 'function') {
          fbq('track', 'Lead');
        }
      }

      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: schedulerType || 'unknown',
        });
      } else if (typeof ga !== 'undefined') {
        ga('send', 'event', 'Lead', 'Generate', schedulerType || 'unknown');
      }

      // PostHog
      if (typeof window.posthog !== 'undefined') {
        window.posthog.capture('scheduler_lead_generated', {
          scheduler_type: schedulerType || 'unknown',
          source: 'webflow_complete',
        });
      }

      // Amplitude
      if (typeof window.amplitude !== 'undefined') {
        window.amplitude.track('scheduler_lead_generated', {
          scheduler_type: schedulerType || 'unknown',
          source: 'webflow_complete',
        });
      }

      log('Lead events fired');
    } catch (e) {
      log('Lead tracking error:', e);
    }
  }

  // Inject scheduler into target element or enhance existing iframe
  function handleScheduler() {
    log('Starting scheduler setup...');

    const urlParams = getQueryParams();
    const storedData = getStoredFormData();

    // Merge URL params with any stored form data
    let allFormData = { ...urlParams };
    if (storedData && storedData.formData) {
      allFormData = { ...allFormData, ...storedData.formData };
      log('Merged form data from storage:', allFormData);
    }

    const schedulerType = resolveSchedulerType(storedData, allFormData);

    // Check if we have any meaningful form data (at least email or firstname)
    const hasFormData =
      allFormData.email ||
      allFormData.firstname ||
      allFormData.first_name ||
      allFormData['0-1/email'] ||
      allFormData['0-1/firstname'] ||
      allFormData['0-2/email'] ||
      allFormData['0-2/firstname'] ||
      Object.keys(allFormData).some(
        (key) =>
          key !== 'debug' &&
          key !== 'utm_source' &&
          key !== 'utm_medium' &&
          key !== 'utm_campaign' &&
          !key.startsWith('group[') && // Ignore HubSpot group fields
          allFormData[key]
      );

    if (!hasFormData) {
      log('No form data found, redirecting to /free-consult');
      window.location.href = '/free-consult';
      return;
    }

    log('Form data found, setting up scheduler');

    // Try to find existing target div
    let target = document.getElementById('scheduler-target');

    // If no target div exists, look for existing iframe to replace
    if (!target) {
      const existingIframe = document.querySelector(
        'iframe[src*="meetings.hubspot.com"]'
      );
      const iframeContainer = document.querySelector(
        '.meetings-iframe-container'
      );

      if (existingIframe || iframeContainer) {
        log('Found existing iframe/container, will enhance it');
        // Create a wrapper around existing iframe
        const wrapper = document.createElement('div');
        wrapper.id = 'scheduler-target';

        if (iframeContainer) {
          iframeContainer.parentNode.insertBefore(wrapper, iframeContainer);
          wrapper.appendChild(iframeContainer);
        } else if (existingIframe) {
          existingIframe.parentNode.insertBefore(wrapper, existingIframe);
          wrapper.appendChild(existingIframe);
        }

        target = wrapper;
      }
    }

    // If still no target, create one
    if (!target) {
      log('No target found, creating scheduler-target div');
      target = document.createElement('div');
      target.id = 'scheduler-target';
      target.style.cssText = 'min-height: 600px; width: 100%;';
      document.body.appendChild(target);
    }

    // Build scheduler URL with all form data
    const schedulerUrl = buildSchedulerUrl(allFormData, schedulerType);

    log('Injecting scheduler into target');
    log('Final URL:', schedulerUrl);

    // Clear target and inject new scheduler
    target.innerHTML = `<div class="meetings-iframe-container" data-src="${schedulerUrl}"></div>`;

    // Load HubSpot embed script
    const script = document.createElement('script');
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    script.onload = function () {
      log('HubSpot embed script loaded successfully');
      fireLeadEvents(schedulerType);
    };
    script.onerror = function () {
      console.error('[Webflow Scheduler] Failed to load HubSpot embed script');
    };
    document.head.appendChild(script);

    watchForSchedulerCompletion(allFormData, target);

    return true;
  }

  // Add debug panel if debug mode is enabled
  function addDebugPanel() {
    if (!DEBUG) return;

    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-width: 400px;
      z-index: 10000;
      border: 2px solid #226752;
    `;

    const storedData = getStoredFormData();
    const urlParams = new URLSearchParams(window.location.search);

    debugPanel.innerHTML = `
      <strong>🔧 Webflow Scheduler Debug</strong><br><br>
      <strong>Form Data Sources:</strong><br>
      📁 localStorage: ${localStorage.getItem('hubspot_form_data') ? '✅ Found' : '❌ Empty'}<br>
      💾 sessionStorage: ${sessionStorage.getItem('scheduler_router_data') ? '✅ Found' : '❌ Empty'}<br>
      🍪 Cookies: ${document.cookie.includes('form_data=') ? '✅ Found' : '❌ Empty'}<br><br>
      <strong>URL Parameters:</strong><br>
      ${urlParams.toString() || 'None'}<br><br>
      <strong>Stored Data:</strong><br>
      ${storedData ? `Source: ${storedData.source}<br>Fields: ${Object.keys(storedData.formData || {}).join(', ')}` : 'None found'}<br><br>
      <strong>Scheduler Type:</strong><br>
      ${resolveSchedulerType(storedData, getQueryParams())}<br><br>
      <strong>Action:</strong><br>
      ${storedData || urlParams.toString() ? '✅ Loading scheduler' : '❌ Will redirect to /free-consult'}
    `;

    document.body.appendChild(debugPanel);

    // Make it draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    debugPanel.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragOffset.x = e.clientX - debugPanel.offsetLeft;
      dragOffset.y = e.clientY - debugPanel.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        debugPanel.style.left = e.clientX - dragOffset.x + 'px';
        debugPanel.style.top = e.clientY - dragOffset.y + 'px';
        debugPanel.style.right = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Main initialization function
  function init() {
    log('Webflow Scheduler Complete initializing...');

    // Add debug panel if in debug mode
    addDebugPanel();

    // Handle scheduler setup
    handleScheduler();

    log('Webflow Scheduler Complete initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  if (DEBUG) {
    window.WebflowSchedulerComplete = {
      getStoredFormData,
      getQueryParams,
      buildSchedulerUrl,
      handleScheduler,
      renderHdyhauForm,
      fireLeadEvents,
      resolveSchedulerType,
      init,
      config: SCHEDULER_CONFIG,
    };
  }

  log('Webflow Scheduler Complete script loaded');
})();
