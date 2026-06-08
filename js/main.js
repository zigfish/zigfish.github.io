/* ============================================================
   Fashion Factory - Public Site (Bilingual EN/CN)
   ============================================================ */

(function () {
  // ---- Render Company Info ----
  function renderCompanyInfo() {
    var company = DataManager.getCompanyInfo();

    document.title = (company.nameEn || company.name) + " - Product Showcase";

    // Header logo
    var logoContainer = document.getElementById("header-logo-img");
    if (company.logo) {
      logoContainer.innerHTML =
        '<img src="' + company.logo + '" alt="Logo">';
    } else {
      var initial = (company.nameEn || company.name).charAt(0).toUpperCase();
      logoContainer.innerHTML =
        '<div class="logo-placeholder">' + initial + "</div>";
    }

    // Header text
    document.getElementById("header-name-en").textContent =
      company.nameEn || company.name;
    document.getElementById("header-name-cn").textContent = company.name;

    // Hero
    document.getElementById("hero-name-en").textContent =
      company.nameEn || company.name;
    document.getElementById("hero-name-cn").textContent = company.name;

    // About
    document.getElementById("about-text-en").textContent =
      company.introEn || company.intro;
    document.getElementById("about-text-cn").textContent = company.intro;

    // Contact
    document.getElementById("contact-address-en").textContent =
      company.addressEn || company.address;
    document.getElementById("contact-address-cn").textContent =
      company.addressEn ? company.address : "";
    document.getElementById("contact-phone").textContent = company.phone;
    document.getElementById("contact-email").textContent = company.email;

    // Footer
    document.getElementById("footer-name").textContent =
      company.nameEn || company.name;
  }

  // ---- Render Social Links ----
  function renderSocialLinks() {
    var social = DataManager.getSocialLinks();
    var container = document.getElementById("social-links");
    var html = "";

    if (social.tiktok) {
      html +=
        '<a href="' +
        escapeAttr(social.tiktok) +
        '" target="_blank" rel="noopener" class="social-link">' +
        '<span class="social-icon">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>' +
        "</svg>" +
        "</span>" +
        '<span class="social-name">TikTok</span>' +
        "</a>";
    }

    if (social.facebook) {
      html +=
        '<a href="' +
        escapeAttr(social.facebook) +
        '" target="_blank" rel="noopener" class="social-link">' +
        '<span class="social-icon">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>' +
        "</svg>" +
        "</span>" +
        '<span class="social-name">Facebook</span>' +
        "</a>";
    }

    if (social.linkedin) {
      html +=
        '<a href="' +
        escapeAttr(social.linkedin) +
        '" target="_blank" rel="noopener" class="social-link">' +
        '<span class="social-icon">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>' +
        '<rect x="2" y="9" width="4" height="12"/>' +
        '<circle cx="4" cy="4" r="2"/>' +
        "</svg>" +
        "</span>" +
        '<span class="social-name">LinkedIn</span>' +
        "</a>";
    }

    if (!html) {
      container.innerHTML = "";
      var section = document.getElementById("social-section");
      if (section) section.style.display = "none";
    } else {
      container.innerHTML = html;
      var section2 = document.getElementById("social-section");
      if (section2) section2.style.display = "";
    }
  }

  // ---- Render Category Grid ----
  function renderCategories() {
    var categories = DataManager.getCategories();
    var grid = document.getElementById("category-grid");

    if (!categories.length) {
      grid.innerHTML =
        '<div class="empty-state">No categories yet. Please add them in the admin panel.</div>';
      return;
    }

    grid.innerHTML = categories
      .map(function (cat) {
        var hasImages = cat.images && cat.images.length > 0;
        var enName = cat.nameEn || cat.name;
        var cnName = cat.name;

        var imgHtml;
        if (hasImages) {
          imgHtml =
            '<img src="' +
            escapeAttr(cat.images[0]) +
            '" alt="' +
            escapeAttr(enName) +
            '" loading="lazy">' +
            '<span class="img-count">' +
            cat.images.length +
            "</span>";
        } else if (cat.placeholder) {
          imgHtml =
            '<div class="card-placeholder">' +
            '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
            "<span>Coming Soon</span>" +
            "</div>";
        } else {
          imgHtml =
            '<div class="card-placeholder">' +
            '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
            "<span>No Images</span>" +
            "</div>";
        }

        var badgeHtml = cat.placeholder
          ? '<span class="badge">Coming Soon</span>'
          : "";

        return (
          '<div class="category-card" data-category-id="' +
          cat.id +
          '">' +
          '<div class="card-img">' +
          imgHtml +
          "</div>" +
          '<div class="card-info">' +
          '<span class="en">' +
          escapeHtml(enName) +
          "</span>" +
          '<span class="cn">' +
          escapeHtml(cnName) +
          "</span>" +
          '<p class="desc">' +
          escapeHtml(cat.descriptionEn || cat.description) +
          "</p>" +
          badgeHtml +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    // Click handlers
    var cards = grid.querySelectorAll(".category-card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", function () {
        var catId = parseInt(this.getAttribute("data-category-id"));
        openGallery(catId);
      });
    }
  }

  function openGallery(categoryId) {
    var cat = DataManager.getCategory(categoryId);
    if (!cat) return;

    var overlay = document.getElementById("modal-overlay");
    var titleEn = document.getElementById("modal-title-en");
    var titleCn = document.getElementById("modal-title-cn");
    var gallery = document.getElementById("modal-gallery");

    titleEn.textContent = cat.nameEn || cat.name;
    titleCn.textContent = cat.name;

    if (!cat.images || cat.images.length === 0) {
      gallery.innerHTML =
        '<div class="no-images">' +
        "<p>No images available</p>" +
        "<p style='font-size:12px;color:#888;'>暂无图片</p>" +
        "</div>";
    } else {
      gallery.innerHTML = cat.images
        .map(function (img) {
          return (
            '<img src="' +
            escapeAttr(img) +
            '" alt="' +
            escapeAttr(cat.nameEn || cat.name) +
            '" loading="lazy">'
          );
        })
        .join("");
    }

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    var overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ---- Utility ----
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;");
  }

  // ---- Mobile Menu ----
  function initMobileMenu() {
    var btn = document.getElementById("mobile-menu-btn");
    var nav = document.getElementById("nav-links");
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    var links = nav.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        nav.classList.remove("open");
      });
    }
  }

  // ---- Back to Top ----
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Modal ----
  function initModal() {
    document
      .getElementById("modal-close")
      .addEventListener("click", closeGallery);
    document
      .getElementById("modal-overlay")
      .addEventListener("click", function (e) {
        if (e.target === this) closeGallery();
      });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeGallery();
    });
  }

  // ---- Smooth Scroll ----
  function initSmoothScroll() {
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
          var top =
            target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      });
    }
  }

  // ---- Active Nav Highlight ----
  function initNavHighlight() {
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-links a");
    window.addEventListener("scroll", function () {
      var scrollY = window.scrollY + 150;
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollY) {
          var id = sections[i].getAttribute("id");
          for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove("active");
            if (navLinks[j].getAttribute("href") === "#" + id) {
              navLinks[j].classList.add("active");
            }
          }
          break;
        }
      }
    });
  }

  // ---- Init ----
  function init() {
    renderCompanyInfo();
    renderSocialLinks();
    renderCategories();
    initMobileMenu();
    initBackToTop();
    initModal();
    initSmoothScroll();
    initNavHighlight();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
