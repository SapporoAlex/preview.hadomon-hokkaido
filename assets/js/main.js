/* Vanilla JS — no jQuery. Replaces the old s3Slider dependency
   and adds click-to-load YouTube embeds for faster first paint. */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".primary-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Hero image slider (fade, autoplay, pause on hover/reduced-motion) ----
  var visual = document.querySelector("[data-hero-slider]");
  if (visual) {
    var slides = Array.prototype.slice.call(visual.querySelectorAll(".slide"));
    var dotsWrap = visual.querySelector(".hero-dots");
    var current = 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "スライド " + (i + 1) + " を表示");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        go(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = i;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }
    function next() { go((current + 1) % slides.length); }
    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }
    if (!reduceMotion && slides.length > 1) {
      restart();
      visual.addEventListener("mouseenter", function () { clearInterval(timer); });
      visual.addEventListener("mouseleave", restart);
    }
  }

  // ---- Click-to-load YouTube facades ----
  document.querySelectorAll(".video-facade").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-yt-id");
      var title = btn.getAttribute("data-title") || "YouTube video";
      var wrap = document.createElement("div");
      wrap.className = "video-embed-wrap";
      wrap.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0" title="' + title.replace(/"/g, "&quot;") +
        '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
      btn.replaceWith(wrap);
    });
  });

  // ---- Footer year ----
  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
