/* The local review copy must never send an inquiry or show a false receipt. */
(function () {
  'use strict';
  if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname)) return;
  window.ZIGFISH_LOCAL_PREVIEW = true;
  var notice = 'Preview only — inquiries are not sent. / 当前为网站预览，询盘不会发送。';
  var robots = document.createElement('meta');
  robots.name = 'robots'; robots.content = 'noindex,nofollow'; document.head.appendChild(robots);
  var policy = document.createElement('meta');
  policy.httpEquiv = 'Content-Security-Policy'; policy.content = "form-action 'none'";
  document.head.appendChild(policy);
  function show(form) {
    var feedback = form && (form.querySelector('#form-feedback') || form.querySelector('[data-preview-feedback]'));
    if (feedback) { feedback.textContent = notice; feedback.className = 'form-feedback'; feedback.style.display = 'block'; feedback.style.color = '#555'; feedback.setAttribute('role', 'status'); }
  }
  document.addEventListener('submit', function (event) {
    event.preventDefault(); event.stopImmediatePropagation(); show(event.target);
  }, true);
  document.addEventListener('click', function (event) {
    var button = event.target.closest('button[type="submit"],input[type="submit"]');
    if (!button || !button.form) return;
    event.preventDefault(); event.stopImmediatePropagation(); show(button.form);
  }, true);
  HTMLFormElement.prototype.submit = function () { show(this); };
  HTMLFormElement.prototype.requestSubmit = function () { show(this); };
  function prepare() {
    document.querySelectorAll('form').forEach(function (form) {
      form.removeAttribute('data-netlify'); form.removeAttribute('netlify');
      form.removeAttribute('action'); form.removeAttribute('method');
      if (form.name === 'inquiry') form.name = 'inquiry-preview';
      form.querySelectorAll('input[name="form-name"]').forEach(function (input) { input.remove(); });
      form.querySelectorAll('[type="submit"]').forEach(function (button) { button.textContent = 'PREVIEW ONLY / 预览不发送'; });
    });
    var ribbon = document.createElement('div');
    ribbon.setAttribute('role', 'note');
    ribbon.style.cssText = 'background:#fafafa;color:#666;border-top:1px solid #eee;padding:8px 16px;text-align:center;font:12px/1.5 Arial,Microsoft YaHei,sans-serif';
    ribbon.textContent = '本机网站预览 · 询盘不发送';
    document.body.appendChild(ribbon);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare);
  else prepare();
})();
