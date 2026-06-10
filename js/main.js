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

    // Lightbox click handlers on gallery images
    var imgs = gallery.querySelectorAll("img");
    for (var g = 0; g < imgs.length; g++) {
      (function (idx) {
        imgs[g].addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(cat.images, idx);
        });
      })(g);
    }

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    var overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ---- Detail Modal (Stats & Advantages) ----
  function openDetailModal(item) {
    var overlay = document.getElementById("detail-modal");
    var titleEn = document.getElementById("detail-title-en");
    var titleCn = document.getElementById("detail-title-cn");
    var textEn = document.getElementById("detail-text-en");
    var textCn = document.getElementById("detail-text-cn");
    var imageWrap = document.getElementById("detail-image-wrap");
    var image = document.getElementById("detail-image");

    titleEn.textContent = item.titleEn || item.labelEn || "";
    titleCn.textContent = item.titleCn || item.labelCn || "";
    textEn.textContent = item.detailEn || "";
    textCn.textContent = item.detailCn || "";

    if (item.image) {
      image.src = item.image;
      imageWrap.style.display = "";
    } else {
      imageWrap.style.display = "none";
    }

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDetailModal() {
    document.getElementById("detail-modal").classList.remove("active");
    document.body.style.overflow = "";
  }

  function initDetailModal() {
    document.getElementById("detail-modal-close").addEventListener("click", closeDetailModal);
    document.getElementById("detail-modal").addEventListener("click", function (e) {
      if (e.target === this) closeDetailModal();
    });
  }

  // ---- Lightbox ----
  var _lightboxImages = [];
  var _lightboxIndex = 0;

  function openLightbox(images, index) {
    _lightboxImages = images;
    _lightboxIndex = index;
    updateLightboxImage();
    document.getElementById("lightbox-modal").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function updateLightboxImage() {
    document.getElementById("lightbox-img").src = _lightboxImages[_lightboxIndex];
    document.getElementById("lightbox-counter").textContent =
      (_lightboxIndex + 1) + " / " + _lightboxImages.length;
  }

  function lightboxPrev() {
    _lightboxIndex = (_lightboxIndex - 1 + _lightboxImages.length) % _lightboxImages.length;
    updateLightboxImage();
  }

  function lightboxNext() {
    _lightboxIndex = (_lightboxIndex + 1) % _lightboxImages.length;
    updateLightboxImage();
  }

  function closeLightbox() {
    document.getElementById("lightbox-modal").classList.remove("active");
    document.body.style.overflow = "";
  }

  function initLightbox() {
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", lightboxPrev);
    document.getElementById("lightbox-next").addEventListener("click", lightboxNext);
    document.getElementById("lightbox-modal").addEventListener("click", function (e) {
      if (e.target === this) closeLightbox();
    });
  }

  // ---- Combined Escape Handler ----
  function initGlobalEscape() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var gallery = document.getElementById("modal-overlay");
      var lightbox = document.getElementById("lightbox-modal");
      var detail = document.getElementById("detail-modal");
      var wechat = document.getElementById("wechat-modal");
      if (lightbox.classList.contains("active")) closeLightbox();
      else if (detail.classList.contains("active")) closeDetailModal();
      else if (wechat.classList.contains("active")) {
        wechat.classList.remove("active");
        document.body.style.overflow = "";
      } else if (gallery.classList.contains("active")) closeGallery();
    });
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

  // ---- Icon SVGs ----
  function getAdvantageIcon(iconName) {
    var icons = {
      "truck": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
      "check-circle": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      "users": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      "globe": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      "shield": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="9" y1="12" x2="11" y2="14"/><line x1="11" y1="14" x2="15" y2="10"/></svg>',
      "award": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
      "clock": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      "link": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      "package": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'
    };
    return icons[iconName] || icons["shield"];
  }

  // ---- Cover Image ----
  function renderCoverImage() {
    var cover = DataManager.getCoverImage();
    var bg = document.getElementById("hero-bg");
    if (cover) {
      bg.style.backgroundImage = "url(" + cover + ")";
      bg.classList.add("show");
    }
  }

  // ---- Certificates ----
  function renderCertificates() {
    var certs = DataManager.getCertificates();
    var grid = document.getElementById("certificates-grid");
    if (!certs.length) {
      document.getElementById("certificates").style.display = "none";
      return;
    }
    document.getElementById("certificates").style.display = "";
    grid.innerHTML = certs.map(function (cert) {
      var imgHtml = cert.image
        ? '<img src="' + escapeAttr(cert.image) + '" alt="' + escapeAttr(cert.nameEn || cert.name) + '">'
        : '<div class="cert-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="9 11 12 14 22 4"/></svg></div>';
      var downloadHtml = cert.file
        ? '<a class="cert-download btn btn-outline btn-sm" href="' + escapeAttr(cert.file) + '" target="_blank" rel="noopener">Download / 下载</a>'
        : "";
      return (
        '<div class="cert-card">' +
        '<div class="cert-img">' + imgHtml + '</div>' +
        '<div class="cert-info">' +
        '<span class="en">' + escapeHtml(cert.nameEn || cert.name) + '</span>' +
        '<span class="cn">' + escapeHtml(cert.name) + '</span>' +
        downloadHtml +
        '</div></div>'
      );
    }).join("");
  }


  // ---- Render Stats Counter ----
  function renderStats() {
    var company = DataManager.getCompanyInfo();
    var stats = company.stats;
    if (!stats || !stats.length) {
      document.getElementById("stats-section").style.display = "none";
      return;
    }
    document.getElementById("stats-section").style.display = "";
    var grid = document.getElementById("stats-grid");
    grid.innerHTML = stats.map(function (stat) {
      return (
        '<div class="stat-item">' +
        '<span class="stat-number" data-value="' + escapeAttr(stat.value) + '">' + escapeHtml(stat.value) + '</span>' +
        '<span class="stat-label">' + escapeHtml(stat.labelEn || "") + '</span>' +
        '<span class="stat-label-cn">' + escapeHtml(stat.labelCn || "") + '</span>' +
        '</div>'
      );
    }).join("");

    // Click handlers for detail modal
    var items = grid.querySelectorAll(".stat-item");
    for (var s = 0; s < items.length; s++) {
      (function (stat) {
        items[s].addEventListener("click", function () {
          openDetailModal(stat);
        });
      })(stats[s]);
    }
  }

  // ---- Render Advantages ----
  function renderAdvantages() {
    var company = DataManager.getCompanyInfo();
    var advantages = company.advantages;
    if (!advantages || !advantages.length) {
      document.getElementById("why-us").style.display = "none";
      return;
    }
    document.getElementById("why-us").style.display = "";
    var grid = document.getElementById("advantages-grid");
    grid.innerHTML = advantages.map(function (adv) {
      return (
        '<div class="advantage-card animate-in">' +
        '<div class="advantage-icon">' + getAdvantageIcon(adv.icon || "shield") + '</div>' +
        '<span class="advantage-title-en">' + escapeHtml(adv.titleEn || "") + '</span>' +
        '<span class="advantage-title-cn">' + escapeHtml(adv.titleCn || "") + '</span>' +
        '<p class="advantage-desc-en">' + escapeHtml(adv.descEn || "") + '</p>' +
        '</div>'
      );
    }).join("");

    // Click handlers for detail modal
    var advItems = grid.querySelectorAll(".advantage-card");
    for (var a = 0; a < advItems.length; a++) {
      (function (adv) {
        advItems[a].addEventListener("click", function () {
          openDetailModal(adv);
        });
      })(advantages[a]);
    }
  }

  // ---- Form Submit Handler ----
  function initInquiryForm() {
    var form = document.getElementById("inquiry-form");
    if (!form) return;
    var feedback = document.getElementById("form-feedback");
    form.addEventListener("submit", function (e) {
      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      if (!name || !email) {
        e.preventDefault();
        if (feedback) { feedback.className = "form-feedback error"; feedback.textContent = "Please fill in Name and Email / 请填写姓名和邮箱"; }
        return;
      }
      if (feedback) { feedback.className = "form-feedback sending"; feedback.textContent = "Sending... / 发送中..."; }
      // Let Netlify handle the actual submission
      setTimeout(function () {
        if (feedback) { feedback.className = "form-feedback success"; feedback.textContent = "Thank you! We will respond within 24 hours. / 感谢您的询价！我们会在24小时内回复。"; }
      }, 1500);
    });
  }

  // ---- Scroll Animation ----
  function initScrollAnimations() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, { threshold: 0.15 });
    var cards = document.querySelectorAll(".advantage-card, .stat-item");
    for (var i = 0; i < cards.length; i++) {
      observer.observe(cards[i]);
    }
  }

  // ---- Contact Section - bind WeChat modal ----
  function renderContact() {
    var settings = DataManager.getContactSettings();

    // Update WhatsApp link from data
    var waLink = document.getElementById("whatsapp-contact-link");
    if (waLink && settings.whatsapp) {
      waLink.href = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");
    }

    // WeChat click → open QR modal
    var trigger = document.getElementById("wechat-trigger");
    if (trigger && settings.wechatQR) {
      trigger.addEventListener("click", function () {
        document.getElementById("wechat-qr-img").src = settings.wechatQR;
        document.getElementById("wechat-modal").classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }
  }

  // ---- Inquiry Form ----
  function renderInquiryForm() {
    var categories = DataManager.getCategories();
    var select = document.querySelector('#inquiry-form select[name="product"]');
    if (!select) return;
    for (var i = 0; i < categories.length; i++) {
      var opt = document.createElement("option");
      opt.value = categories[i].nameEn || categories[i].name;
      opt.textContent = (categories[i].nameEn || categories[i].name) + " / " + categories[i].name;
      select.appendChild(opt);
    }
  }

  // ---- WeChat Modal ----
  function initWechatModal() {
    document.getElementById("wechat-modal-close").addEventListener("click", function () {
      document.getElementById("wechat-modal").classList.remove("active");
      document.body.style.overflow = "";
    });
    document.getElementById("wechat-modal").addEventListener("click", function (e) {
      if (e.target === this) {
        document.getElementById("wechat-modal").classList.remove("active");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var wm = document.getElementById("wechat-modal");
        if (wm && wm.classList.contains("active")) {
          wm.classList.remove("active");
          document.body.style.overflow = "";
        }
      }
    });
  }

  // ---- WhatsApp Float ----
  function initWhatsAppFloat() {
    var settings = DataManager.getContactSettings();
    var wa = document.getElementById("whatsapp-float");
    if (!settings.whatsapp) {
      wa.style.display = "none";
      return;
    }
    wa.href = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");
    wa.style.display = "";
  }

  // ---- Social Floating Buttons ----
  function renderSocialFloats() {
    var social = DataManager.getSocialLinks();
    var tiktok = document.getElementById("tiktok-float");
    var facebook = document.getElementById("facebook-float");
    if (social.tiktok) {
      tiktok.href = social.tiktok;
      tiktok.style.display = "";
    }
    if (social.facebook) {
      facebook.href = social.facebook;
      facebook.style.display = "";
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
    renderCoverImage();
    renderStats();
    renderSocialLinks();
    renderCategories();
    renderAdvantages();
    renderCertificates();
    renderContact();
    renderSocialFloats();
    renderInquiryForm();
    initWechatModal();
    initWhatsAppFloat();
    initDetailModal();
    initLightbox();
    initGlobalEscape();
    initInquiryForm();
    initScrollAnimations();
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
