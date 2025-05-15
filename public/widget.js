// BlueAgent Widget UI (Dynamic Loader + JWT + Submission)
(function() {
  var root = document.getElementById('blueagent-form-root');
  if (!root) {
    console.error('[BlueAgent Widget] #blueagent-form-root not found.');
    return;
  }

  var formId = window.__BLUEAGENT_WIDGET_FORM_ID__;
  if (!formId) {
    root.innerHTML = '<div style="color: red; font-family: sans-serif;">[BlueAgent Widget] No form ID provided.</div>';
    return;
  }

  // Basic styles for the widget container
  root.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  root.style.maxWidth = '400px';
  root.style.margin = '24px auto';
  root.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
  root.style.borderRadius = '12px';
  root.style.background = '#fff';
  root.style.padding = '24px';
  root.style.border = '1px solid #e5e7eb';

  // Render loading state
  root.innerHTML = '<div id="blueagent-widget-loading" style="text-align:center; color:#888;">Loading BlueAgent Widget...</div>';

  // Fetch JWT and config from blueagent.co
  fetch('https://blueagent.co/api/widget/init?formId=' + encodeURIComponent(formId))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        root.innerHTML = '<div style="color: red; font-family: sans-serif;">[BlueAgent Widget] ' + data.error + '</div>';
        return;
      }
      // Store JWT and config for later use
      window.__BLUEAGENT_WIDGET_JWT__ = data.token;
      window.__BLUEAGENT_WIDGET_CONFIG__ = data.formConfig;
      // Render the form (UI only, no submission yet)
      renderForm();
    })
    .catch(function(err) {
      root.innerHTML = '<div style="color: red; font-family: sans-serif;">[BlueAgent Widget] Failed to load widget. Please try again later.</div>';
    });

  function renderForm() {
    root.innerHTML = `
      <form id="blueagent-widget-form">
        <h2 style="font-size:1.25rem; font-weight:600; margin-bottom:1rem;">Request a Call</h2>
        <div style="margin-bottom:1rem;">
          <label for="blueagent-widget-name" style="display:block; font-weight:500;">Full Name <span style="color:#ef4444;">*</span></label>
          <input id="blueagent-widget-name" name="name" type="text" required style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;">
        </div>
        <div style="margin-bottom:1rem;">
          <label for="blueagent-widget-phone" style="display:block; font-weight:500;">Phone Number <span style="color:#ef4444;">*</span></label>
          <input id="blueagent-widget-phone" name="phone" type="tel" required style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;">
        </div>
        <div style="margin-bottom:1rem;">
          <label for="blueagent-widget-email" style="display:block; font-weight:500;">Email</label>
          <input id="blueagent-widget-email" name="email" type="email" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;">
        </div>
        <div style="margin-bottom:1rem;">
          <label for="blueagent-widget-notes" style="display:block; font-weight:500;">Notes</label>
          <textarea id="blueagent-widget-notes" name="notes" rows="2" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;"></textarea>
        </div>
        <button type="submit" id="blueagent-widget-submit" style="width:100%;background:#3b82f6;color:#fff;font-weight:600;padding:10px 0;border:none;border-radius:6px;cursor:pointer;">Request Call</button>
        <div id="blueagent-widget-error" style="color:#ef4444;margin-top:0.5rem;display:none;"></div>
        <div style="margin-top:1rem;text-align:center;font-size:0.9rem;color:#888;">Powered by <a href="https://blueagent.co" target="_blank" rel="noopener" style="color:#3b82f6;font-weight:500;">BlueAgent</a></div>
      </form>
    `;
    var form = document.getElementById('blueagent-widget-form');
    var submitBtn = document.getElementById('blueagent-widget-submit');
    var errorDiv = document.getElementById('blueagent-widget-error');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      errorDiv.style.display = 'none';
      // Validate required fields
      var name = document.getElementById('blueagent-widget-name').value.trim();
      var phone = document.getElementById('blueagent-widget-phone').value.trim();
      var email = document.getElementById('blueagent-widget-email').value.trim();
      var notes = document.getElementById('blueagent-widget-notes').value.trim();
      if (!name) {
        showError('Please enter your name');
        return;
      }
      if (!phone) {
        showError('Please enter your phone number');
        return;
      }
      // Basic phone validation
      var phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phonePattern.test(phone)) {
        showError('Please enter a valid phone number');
        return;
      }
      // Disable button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      // Prepare data
      var payload = { name: name, phone: phone };
      if (email) payload.email = email;
      if (notes) payload.notes = notes;
      // Submit
      fetch('https://blueagent.co/api/widget/submit?formId=' + encodeURIComponent(formId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.__BLUEAGENT_WIDGET_JWT__,
        },
        body: JSON.stringify(payload)
      })
        .then(function(res) { return res.json().then(function(data) { return { status: res.status, data: data }; }); })
        .then(function(resp) {
          if (resp.status === 200 && resp.data.success) {
            showSuccess();
          } else {
            showError(resp.data.error || 'Submission failed.');
          }
        })
        .catch(function() {
          showError('Network error. Please try again.');
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Call';
        });
    });
    function showError(msg) {
      errorDiv.textContent = msg;
      errorDiv.style.display = 'block';
    }
    function showSuccess() {
      root.innerHTML = `
        <div style="text-align:center;padding:2rem 0;">
          <svg width="48" height="48" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="margin-bottom:1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <h2 style="font-size:1.25rem;font-weight:600;">Thank You!</h2>
          <p>Your request has been received. Our team will contact you soon.</p>
        </div>
      `;
    }
  }
})(); 