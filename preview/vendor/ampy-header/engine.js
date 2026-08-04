/* ============================================================================
   Ampy Header — production JS (FluentSnippets: JS Snippet, Frontend / wp_footer)
   FORMAT ONLY — behaviour-identical to the approved prototype.
   IIFE + strict; DOM queries scoped to the .ampy-hdr-root root; booted-guarded.
   The few genuinely page-level effects (body scroll-lock, body state classes,
   Escape, breakpoint watcher) are on document/body on purpose — this is site
   chrome, not an embedded widget.
   ============================================================================ */
(function () {
  "use strict";

  function init(root) {
    if (root.dataset.booted === "1") return;
    root.dataset.booted = "1";

    var body = document.body;
    var rmq = matchMedia("(prefers-reduced-motion:reduce)");

    var closeMegas = function () {
      root.querySelectorAll(".nav__item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".nav__link").setAttribute("aria-expanded", "false");
      });
      body.classList.remove("aph-menu");
    };

    /* desktop mega: hover-intent (mouse only, per-item timers) + click + focus-out */
    root.querySelectorAll(".nav__item[data-menu]").forEach(function (item) {
      var link = item.querySelector(".nav__link");
      var openItem = function () {
        clearTimeout(item._closeTimer);
        root.querySelectorAll(".nav__item.open").forEach(function (o) {
          if (o !== item) { o.classList.remove("open"); o.querySelector(".nav__link").setAttribute("aria-expanded", "false"); }
        });
        item.classList.add("open");
        link.setAttribute("aria-expanded", "true");
        body.classList.add("aph-menu");
      };
      item.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        clearTimeout(item._closeTimer);
        item._openTimer = setTimeout(openItem, 80);
      });
      item.addEventListener("pointerleave", function (e) {
        if (e.pointerType !== "mouse") return;
        clearTimeout(item._openTimer);
        item._closeTimer = setTimeout(function () {
          item.classList.remove("open");
          link.setAttribute("aria-expanded", "false");
          if (!root.querySelector(".nav__item:hover, .mega:hover")) body.classList.remove("aph-menu");
        }, 250);
      });
      link.addEventListener("click", function () {
        clearTimeout(item._openTimer);
        item.classList.contains("open") ? closeMegas() : openItem();
      });
      item.addEventListener("focusout", function (e) {
        if (!item.contains(e.relatedTarget)) {
          item.classList.remove("open");
          link.setAttribute("aria-expanded", "false");
          if (!root.querySelector(".nav__item.open")) body.classList.remove("aph-menu");
        }
      });
    });

    /* mobile drawer: inert(+aria-hidden fallback), iOS-safe body scroll-lock, focus return */
    var burger = root.querySelector(".burger");
    var drawer = root.querySelector(".drawer");
    var pageMain = document.querySelector("main");
    var supportsInert = "inert" in drawer;
    if (supportsInert) drawer.inert = true; else drawer.setAttribute("aria-hidden", "true");

    var lockY = 0;
    var lockBody = function () {
      lockY = window.scrollY;
      var s = body.style; s.position = "fixed"; s.top = -lockY + "px"; s.left = "0"; s.right = "0"; s.width = "100%";
    };
    var unlockBody = function () {
      var s = body.style; s.position = ""; s.top = ""; s.left = ""; s.right = ""; s.width = ""; window.scrollTo(0, lockY);
    };
    var setDrawer = function (open) {
      if (open === body.classList.contains("aph-open")) return;   /* idempotent */
      body.classList.toggle("aph-open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
      if (supportsInert) { drawer.inert = !open; if (pageMain) pageMain.inert = open; }
      else { drawer.setAttribute("aria-hidden", String(!open)); if (pageMain) pageMain.setAttribute("aria-hidden", String(open)); }
      if (open) { lockBody(); var f = drawer.querySelector("button,a"); if (f) f.focus(); }
      else { unlockBody(); burger.focus(); }
    };
    burger.addEventListener("click", function () { setDrawer(!body.classList.contains("aph-open")); });
    root.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", function () { setDrawer(false); closeMegas(); });
    });
    matchMedia("(min-width:993px)").addEventListener("change", function (e) { if (e.matches) setDrawer(false); });

    /* two-level accordions — reduced-motion safe, animated sibling close, correct parent height */
    var accId = 0;
    root.querySelectorAll("[data-acc]").forEach(function (acc) {
      var head = acc.querySelector(":scope > .acc__head");
      var abody = acc.querySelector(":scope > .acc__body");
      var bid = "aph-acc-" + (++accId);
      abody.id = bid;
      head.setAttribute("aria-expanded", "false");
      head.setAttribute("aria-controls", bid);
      abody.addEventListener("transitionend", function (e) {
        if (e.target === abody && acc.classList.contains("open")) abody.style.maxHeight = "none";
      });
      head.addEventListener("click", function () {
        var isOpen = acc.classList.contains("open");
        var reduce = rmq.matches;
        var parent = acc.parentElement.closest("[data-acc]");
        acc.parentElement.querySelectorAll(":scope > [data-acc].open").forEach(function (o) {
          if (o !== acc) {
            o.classList.remove("open");
            o.querySelector(":scope > .acc__head").setAttribute("aria-expanded", "false");
            var ob = o.querySelector(":scope > .acc__body");
            if (ob.style.maxHeight === "none") { ob.style.maxHeight = ob.scrollHeight + "px"; void ob.offsetHeight; }
            ob.style.maxHeight = null;
          }
        });
        if (isOpen) {
          if (abody.style.maxHeight === "none") { abody.style.maxHeight = abody.scrollHeight + "px"; void abody.offsetHeight; }
          acc.classList.remove("open");
          head.setAttribute("aria-expanded", "false");
          abody.style.maxHeight = null;
        } else {
          acc.classList.add("open");
          head.setAttribute("aria-expanded", "true");
          abody.style.maxHeight = reduce ? "none" : abody.scrollHeight + "px";
        }
        if (parent) {
          var pb = parent.querySelector(":scope > .acc__body");
          if (pb.style.maxHeight !== "none") pb.style.maxHeight = pb.scrollHeight + "px";
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var openNav = root.querySelector(".nav__item.open");
        if (openNav) openNav.querySelector(".nav__link").focus();
        closeMegas();
        setDrawer(false);
      }
    });

    /* decorative chevrons / arrows / phone glyphs are named by adjacent text — hide from AT */
    root.querySelectorAll(".hdr svg, .drawer svg, .go").forEach(function (s) { s.setAttribute("aria-hidden", "true"); });
  }

  function boot() { document.querySelectorAll(".ampy-hdr-root").forEach(init); }
  document.readyState !== "loading" ? boot() : document.addEventListener("DOMContentLoaded", boot);
})();
