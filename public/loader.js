// BlueAgent Dynamic Widget Loader
(function() {
  // Find the current script tag
  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Get formId from data attribute
  var formId = script.getAttribute('data-form-id');
  if (!formId) {
    console.error('[BlueAgent Widget] Missing data-form-id attribute on loader script.');
    return;
  }

  // Use blueagent-form-root as the root id
  var root = document.getElementById('blueagent-form-root');
  if (!root) {
    // Create the root if it doesn't exist
    root = document.createElement('div');
    root.id = 'blueagent-form-root';
    root.style.all = 'unset';
    root.style.position = 'relative';
    if (script.parentNode) {
      script.parentNode.insertBefore(root, script.nextSibling);
    } else {
      document.body.appendChild(root);
    }
  }

  // Expose formId globally for widget.js
  window.__BLUEAGENT_WIDGET_FORM_ID__ = formId;

  // Dynamically load the widget.js script from blueagent.co unless overridden
  var widgetScript = document.createElement('script');
  widgetScript.src = script.getAttribute('data-widget-src') || 'https://blueagent.co/widget.js';
  widgetScript.async = true;
  widgetScript.onload = function() {
    // Optionally, notify that widget.js loaded
  };
  widgetScript.onerror = function() {
    console.error('[BlueAgent Widget] Failed to load widget.js');
  };
  document.body.appendChild(widgetScript);
})(); 