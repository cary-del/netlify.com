// The Celiac Sisters — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Simple front-end only "success" message for forms until a real
  // email/form service is connected. See the publishing guide.
  var forms = document.querySelectorAll('form[data-demo-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-success');
      if (msg) {
        msg.style.display = 'block';
      }
      form.reset();
    });
  });
});
