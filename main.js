/* Asad Rasheed — portfolio behaviour. No dependencies. */
(function () {
  "use strict";

  /* current year in the footer */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* nav gets a border once you've scrolled past the hero edge */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  var btn = document.getElementById("menuBtn");
  var menu = document.getElementById("mobileMenu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Reveal on scroll. A plain scroll check rather than IntersectionObserver:
     the content starts at opacity 0, so an observer that never reports back
     would leave the page blank. 21 elements is cheap to measure directly. */
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  /* stagger siblings so grids cascade instead of popping all at once */
  items.forEach(function (el) {
    var siblings = Array.prototype.slice.call(el.parentElement.children).filter(function (n) {
      return n.classList && n.classList.contains("reveal");
    });
    el.dataset.delay = String(siblings.indexOf(el) * 70);
  });

  var revealInView = function () {
    var edge = window.innerHeight - 60;
    items = items.filter(function (el) {
      if (el.getBoundingClientRect().top > edge) return true;
      setTimeout(function () { el.classList.add("in"); }, Number(el.dataset.delay || 0));
      return false;
    });
    if (!items.length) {
      window.removeEventListener("scroll", revealInView);
      window.removeEventListener("resize", revealInView);
    }
  };

  /* Called directly rather than through requestAnimationFrame — rAF is paused
     while a tab isn't painting, which would leave the page stuck at opacity 0. */
  revealInView();
  window.addEventListener("scroll", revealInView, { passive: true });
  window.addEventListener("resize", revealInView);

  /* contact form → opens the mail client with everything filled in */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var msg = form.message.value.trim();
      if (!name || !email || !msg) return;

      var subject = "Project enquiry from " + name;
      var body = msg + "\n\n—\n" + name + "\n" + email;
      window.location.href =
        "mailto:asadrasheeddev@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      var note = form.querySelector(".form-note");
      if (note) {
        note.className = "form-status";
        note.textContent = "Your mail app should be opening now. If nothing happens, email asadrasheeddev@gmail.com directly.";
      }
    });
  }
})();
