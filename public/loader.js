// MatBot Dynamic Widget Loader
(function() {
  // Find the current script tag
  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Get formId from data attribute
  var formId = script.getAttribute('data-form-id');
  if (!formId) {
    console.error('[MatBot Widget] Missing data-form-id attribute on loader script.');
    return;
  }

  // Prevent duplicate widget root
  if (document.getElementById('matbot-widget-root')) {
    return;
  }

  // Create widget root container
  var root = document.createElement('div');
  root.id = 'matbot-widget-root';
  root.style.all = 'unset';
  root.style.position = 'relative';
  // Optionally, allow host to control placement with a placeholder div
  document.body.appendChild(root);

  // Expose formId globally for widget.js
  window.__MATBOT_WIDGET_FORM_ID__ = formId;

  // Dynamically load the widget.js script
  var widgetScript = document.createElement('script');
  widgetScript.src = (script.getAttribute('data-widget-src') || '/widget.js');
  widgetScript.async = true;
  widgetScript.onload = function() {
    // Optionally, notify that widget.js loaded
  };
  widgetScript.onerror = function() {
    console.error('[MatBot Widget] Failed to load widget.js');
  };
  document.body.appendChild(widgetScript);
})(); 