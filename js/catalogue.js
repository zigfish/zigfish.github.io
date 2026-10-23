/* Product catalogue. Reads public watermarked assets; never submits enquiries. */
(function () {
  "use strict";

  var featured = document.getElementById("catalogue-featured");
  var browser = document.getElementById("catalogue-browser");
  if (!featured && !browser) return;

  var GROUPS = [
    ["outer", "Outdoor & Padded Outerwear", "户外外套 / 棉服"],
    ["pu", "PU Collection", "PU系列"],
    ["beach", "Beach Shorts", "沙滩短裤"],
    ["sport", "Sportswear", "运动服"],
    ["kids", "Kidswear", "童装"],
    ["work", "Workwear", "工装"],
    ["casual", "Casualwear", "休闲服"]
  ];
  var products = [];
  var state = { category: "all", page: 1, item: null };
  var pageSize = responsivePageSize();
  var dialog;
  var dialogImage;
  var viewIndex = 0;
  var activeItem = null;
  var origin = null;
  var savedOverflow = "";
  var touchStart = null;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function groupExists(id) { return GROUPS.some(function (g) { return g[0] === id; }); }
  function findProduct(id) { return products.find(function (p) { return p.id === id; }); }
  function responsivePageSize() { return window.innerWidth <= 640 ? 4 : window.innerWidth <= 1024 ? 6 : 8; }
  function filteredProducts() { return products.filter(function (p) { return state.category === "all" || p.group === state.category; }); }
  function totalPages() { return Math.max(1, Math.ceil(filteredProducts().length / pageSize)); }
  function reference(id) {
    var prefixes = { outer: "O", pu: "P", beach: "B", sport: "S", kids: "K", work: "W", casual: "C" };
    var match = String(id).match(/^([a-z]+)-(\d+)$/);
    return match && prefixes[match[1]] ? "ZF-" + prefixes[match[1]] + match[2].padStart(3, "0") : String(id);
  }

  function safeAsset(path) {
    if (typeof path !== "string" || !path) return "";
    try {
      var url = new URL(path, window.location.href);
      return url.origin === window.location.origin && /\.webp$/i.test(url.pathname) ? path : "";
    } catch (_) { return ""; }
  }

  function normalizeProducts(data) {
    if (!data || !Array.isArray(data.products)) throw new Error("Missing catalogue products");
    var seen = new Set();
    var valid = data.products.filter(function (p) {
      if (!p || !p.id || seen.has(String(p.id)) || !groupExists(p.group) || !safeAsset(p.thumb) || !safeAsset(p.hero)) return false;
      seen.add(String(p.id));
      return true;
    }).map(function (p) {
      return { id: String(p.id), group: p.group, nameEn: String(p.nameEn || "Garment sample"), nameZh: String(p.nameZh || "服装样品"), thumb: p.thumb, hero: p.hero, views: Array.from(new Set([p.hero].concat(Array.isArray(p.views) ? p.views.filter(safeAsset) : []))) };
    });
    if (!valid.length) throw new Error("No catalogue products");
    var queues = GROUPS.map(function (g) { return valid.filter(function (p) { return p.group === g[0]; }); });
    var interleaved = [];
    for (var round = 0; queues.some(function (q) { return q.length > round; }); round++) {
      queues.forEach(function (q) { if (q[round]) interleaved.push(q[round]); });
    }
    return interleaved;
  }

  function productCard(product, isLink) {
    var query = new URLSearchParams({ category: product.group, item: product.id });
    var tag = isLink ? 'a href="catalogue.html?' + escapeHtml(query.toString()) + '"' : 'button type="button" data-catalogue-item="' + escapeHtml(product.id) + '"';
    var end = isLink ? "a" : "button";
    return "<" + tag + ' class="zf-catalogue-card" data-product-id="' + escapeHtml(product.id) + '" aria-label="' + escapeHtml(product.nameEn + " / " + product.nameZh) + '">' +
      '<span class="zf-catalogue-card-photo"><img src="' + escapeHtml(product.thumb) + '" alt="' + escapeHtml(product.nameEn) + '" loading="lazy" decoding="async" width="600" height="600"></span>' +
      '<span class="zf-catalogue-card-name">' + escapeHtml(product.nameEn) + '</span><span class="zf-catalogue-card-cn">' + escapeHtml(product.nameZh) + '</span>' +
      '<span class="zf-catalogue-card-ref">REF. ' + escapeHtml(reference(product.id)) + "</span></" + end + ">";
  }

  function renderFeatured() {
    var preferred = ["outer-012", "pu-011", "beach-001", "sport-013", "kids-001", "work-001"];
    var selected = preferred.map(findProduct).filter(Boolean);
    GROUPS.forEach(function (g) {
      if (selected.length < 6 && !selected.some(function (p) { return p.group === g[0]; })) {
        var first = products.find(function (p) { return p.group === g[0]; });
        if (first) selected.push(first);
      }
    });
    featured.innerHTML = '<div class="zf-catalogue-featured-grid">' + selected.slice(0, 6).map(function (p) { return productCard(p, true); }).join("") + '</div><div class="zf-catalogue-featured-footer"><a class="zf-catalogue-all-link" href="catalogue.html">View Catalogue / 浏览产品目录 →</a></div>';
    featured.setAttribute("aria-busy", "false");
  }

  function readLocation() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get("category") || "all";
    state.category = groupExists(category) ? category : "all";
    state.page = Math.max(1, parseInt(params.get("page"), 10) || 1);
    state.item = findProduct(params.get("item")) ? params.get("item") : null;
    if (state.item) {
      var product = findProduct(state.item);
      if (state.category !== "all" && state.category !== product.group) state.category = product.group;
      var index = filteredProducts().findIndex(function (p) { return p.id === state.item; });
      if (index < (state.page - 1) * pageSize || index >= state.page * pageSize) state.page = Math.floor(index / pageSize) + 1;
    }
    state.page = Math.min(state.page, totalPages());
  }

  function writeLocation(replace, modalOrigin) {
    var url = new URL(window.location.href);
    url.searchParams.set("category", state.category);
    url.searchParams.set("page", String(state.page));
    if (state.item) url.searchParams.set("item", state.item); else url.searchParams.delete("item");
    var previous = history.state && history.state.zfCatalogue;
    var marker = { modal: !!state.item, origin: state.item ? modalOrigin || (previous && previous.origin) || null : null };
    history[replace ? "replaceState" : "pushState"](Object.assign({}, history.state || {}, { zfCatalogue: marker }), "", url);
  }

  function buildBrowser() {
    var groups = [["all", "All Samples", "全部款式"]].concat(GROUPS);
    browser.innerHTML = '<div class="zf-catalogue-filters" role="group" aria-label="Product categories / 产品分类">' + groups.map(function (g) {
      return '<button class="zf-catalogue-filter" type="button" data-category="' + g[0] + '" aria-pressed="false">' + g[1] + '<span class="zf-cn">' + g[2] + "</span></button>";
    }).join("") + '</div><div class="zf-catalogue-select-wrap"><label for="zf-catalogue-category">Category / 产品分类</label><select class="zf-catalogue-select" id="zf-catalogue-category">' + groups.map(function (g) { return '<option value="' + g[0] + '">' + g[1] + " / " + g[2] + "</option>"; }).join("") + '</select></div><div class="zf-catalogue-toolbar"><h2 class="zf-catalogue-results" id="zf-catalogue-results" tabindex="-1" aria-live="polite"></h2><span class="zf-catalogue-compact-page"></span></div><div class="zf-catalogue-grid"></div><nav class="zf-catalogue-pagination" aria-label="Catalogue pages / 目录翻页"></nav>';
    browser.setAttribute("aria-busy", "false");
    browser.addEventListener("click", function (event) {
      var category = event.target.closest("button[data-category]");
      var item = event.target.closest("button[data-catalogue-item]");
      var page = event.target.closest("button[data-catalogue-page]");
      if (category) changeCategory(category.dataset.category);
      if (item) openProduct(item.dataset.catalogueItem);
      if (page && !page.disabled) changePage(parseInt(page.dataset.cataloguePage, 10));
    });
    browser.querySelector("select").addEventListener("change", function (event) { changeCategory(event.target.value); });
    renderBrowser();
  }

  function renderBrowser() {
    state.page = Math.min(Math.max(1, state.page), totalPages());
    var filtered = filteredProducts();
    var start = (state.page - 1) * pageSize;
    browser.querySelector(".zf-catalogue-grid").innerHTML = filtered.slice(start, start + pageSize).map(function (p) { return productCard(p, false); }).join("");
    browser.querySelectorAll("button[data-category]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.category === state.category)); });
    browser.querySelector("select").value = state.category;
    browser.querySelector(".zf-catalogue-results").textContent = (start + 1) + "–" + Math.min(start + pageSize, filtered.length) + " / " + filtered.length + " samples · 款式";
    browser.querySelector(".zf-catalogue-compact-page").textContent = "Page " + state.page + " / " + totalPages();
    browser.querySelector(".zf-catalogue-pagination").innerHTML = '<button type="button" class="zf-catalogue-page-button" data-catalogue-page="' + (state.page - 1) + '"' + (state.page === 1 ? " disabled" : "") + '>← Previous / 上一页</button><span class="zf-catalogue-page-indicator">' + state.page + " / " + totalPages() + '</span><button type="button" class="zf-catalogue-page-button" data-catalogue-page="' + (state.page + 1) + '"' + (state.page === totalPages() ? " disabled" : "") + '>Next / 下一页 →</button>';
  }

  function browseTop() { browser.scrollIntoView({ behavior: "auto", block: "start" }); }
  function changeCategory(category) {
    if (category === state.category) return;
    state.category = groupExists(category) ? category : "all";
    state.page = 1; state.item = null;
    renderBrowser(); writeLocation(false);
  }
  function changePage(page) {
    state.page = Math.min(Math.max(1, page), totalPages());
    renderBrowser(); writeLocation(false); browseTop();
    browser.querySelector(".zf-catalogue-results").focus({ preventScroll: true });
  }

  function createDialog() {
    dialog = document.createElement("dialog");
    dialog.className = "zf-catalogue-dialog";
    dialog.setAttribute("aria-labelledby", "zf-catalogue-dialog-title");
    dialog.setAttribute("aria-describedby", "zf-catalogue-dialog-reference");
    dialog.innerHTML = '<button class="zf-catalogue-dialog-close" type="button" aria-label="Close sample / 关闭样品">×</button><div class="zf-catalogue-dialog-photo" data-loading="true"><img decoding="async" alt=""></div><div class="zf-catalogue-dialog-info"><h2 class="zf-catalogue-dialog-title" id="zf-catalogue-dialog-title"></h2><p class="zf-catalogue-dialog-cn"></p><p class="zf-catalogue-dialog-reference" id="zf-catalogue-dialog-reference"></p><div class="zf-catalogue-views"><button class="zf-catalogue-view-button" type="button" data-view-step="-1" aria-label="Previous view / 上一张">‹</button><div class="zf-catalogue-view-count" aria-live="polite"><span>Views / 图片</span><strong></strong></div><button class="zf-catalogue-view-button" type="button" data-view-step="1" aria-label="Next view / 下一张">›</button></div><div class="zf-catalogue-product-nav"><button type="button" data-product-step="-1">← Previous sample / 上一款</button><button type="button" data-product-step="1">Next sample / 下一款 →</button></div><a class="zf-catalogue-dialog-contact" href="index.html#contact">Contact us / 联系我们 →</a></div>';
    document.body.appendChild(dialog);
    dialogImage = dialog.querySelector(".zf-catalogue-dialog-photo img");
    dialogImage.addEventListener("load", function () { dialog.querySelector(".zf-catalogue-dialog-photo").dataset.loading = "false"; });
    dialogImage.addEventListener("error", function () { dialog.querySelector(".zf-catalogue-dialog-photo").dataset.loading = "false"; dialogImage.alt = "Image could not load. Please try another view. / 图片加载失败，请切换其他视角。"; });
    dialog.addEventListener("cancel", function (event) { event.preventDefault(); closeProduct(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        var rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProduct();
      }
      if (event.target.closest(".zf-catalogue-dialog-close")) closeProduct();
      var viewButton = event.target.closest("button[data-view-step]");
      var productButton = event.target.closest("button[data-product-step]");
      if (viewButton && !viewButton.disabled) changeView(Number(viewButton.dataset.viewStep));
      if (productButton && !productButton.disabled) stepProduct(Number(productButton.dataset.productStep));
    });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault(); changeView(event.key === "ArrowLeft" ? -1 : 1);
      }
    });
    var photo = dialog.querySelector(".zf-catalogue-dialog-photo");
    photo.addEventListener("touchstart", function (event) { if (event.touches.length === 1) touchStart = [event.touches[0].clientX, event.touches[0].clientY]; }, { passive: true });
    photo.addEventListener("touchend", function (event) {
      if (!touchStart || !event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - touchStart[0];
      var dy = event.changedTouches[0].clientY - touchStart[1];
      touchStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) changeView(dx < 0 ? 1 : -1);
    }, { passive: true });
    photo.addEventListener("touchcancel", function () { touchStart = null; }, { passive: true });
  }

  function renderDialog(product, resetView) {
    activeItem = product;
    if (resetView) viewIndex = 0;
    dialog.querySelector(".zf-catalogue-dialog-title").textContent = product.nameEn;
    dialog.querySelector(".zf-catalogue-dialog-cn").textContent = product.nameZh;
    dialog.querySelector(".zf-catalogue-dialog-reference").innerHTML = "Reference / 展示编号: " + escapeHtml(reference(product.id)) + "<small>Zigfish sample reference / Zigfish 自有样品参考编号</small>";
    var list = filteredProducts();
    var index = list.findIndex(function (p) { return p.id === product.id; });
    dialog.querySelector('[data-product-step="-1"]').disabled = index <= 0;
    dialog.querySelector('[data-product-step="1"]').disabled = index >= list.length - 1;
    renderView();
  }

  function renderView() {
    viewIndex = Math.max(0, Math.min(viewIndex, activeItem.views.length - 1));
    var path = activeItem.views[viewIndex];
    dialog.querySelector(".zf-catalogue-dialog-photo").dataset.loading = "true";
    dialogImage.alt = activeItem.nameEn + " — view " + (viewIndex + 1) + " of " + activeItem.views.length;
    dialogImage.src = path;
    if (dialogImage.complete && dialogImage.naturalWidth) dialog.querySelector(".zf-catalogue-dialog-photo").dataset.loading = "false";
    dialog.querySelector(".zf-catalogue-view-count strong").textContent = (viewIndex + 1) + " / " + activeItem.views.length;
    dialog.querySelector('[data-view-step="-1"]').disabled = activeItem.views.length < 2;
    dialog.querySelector('[data-view-step="1"]').disabled = activeItem.views.length < 2;
  }
  function changeView(step) {
    if (!activeItem || activeItem.views.length < 2) return;
    viewIndex = (viewIndex + step + activeItem.views.length) % activeItem.views.length;
    renderView();
  }
  function stepProduct(step) {
    var list = filteredProducts();
    var index = list.findIndex(function (p) { return p.id === activeItem.id; });
    var product = list[index + step];
    if (!product) return;
    state.item = product.id; state.page = Math.floor((index + step) / pageSize) + 1;
    renderDialog(product, true); writeLocation(true);
  }

  function showProductUI(product) {
    if (!dialog) createDialog();
    renderDialog(product, true);
    if (!dialog.open) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
    }
  }
  function openProduct(id) {
    var product = findProduct(id);
    if (!product) return;
    origin = { category: state.category, page: state.page, scrollY: window.scrollY, focusId: id };
    state.item = id;
    writeLocation(false, origin); showProductUI(product);
  }
  function closeUI() {
    if (!dialog || !dialog.open) return;
    dialog.close(); document.body.style.overflow = savedOverflow; activeItem = null;
  }
  function restoreOrigin(fallbackId) {
    var restore = origin;
    requestAnimationFrame(function () {
      var id = restore && restore.focusId || fallbackId;
      var card = Array.from(browser.querySelectorAll("[data-product-id]")).find(function (element) { return element.dataset.productId === id; });
      if (card) card.focus({ preventScroll: true });
      if (restore && Number.isFinite(restore.scrollY)) window.scrollTo({ top: restore.scrollY, behavior: "instant" });
    });
  }
  function closeProduct() {
    var id = state.item;
    var marker = history.state && history.state.zfCatalogue;
    closeUI();
    if (marker && marker.modal && marker.origin) {
      origin = marker.origin;
      history.back();
    } else {
      state.item = null;
      renderBrowser(); writeLocation(true); restoreOrigin(id);
    }
  }

  function initBrowser() {
    readLocation(); buildBrowser();
    var marker = history.state && history.state.zfCatalogue;
    origin = marker && marker.origin || null;
    writeLocation(true);
    if (state.item) showProductUI(findProduct(state.item));
    window.addEventListener("popstate", function () {
      var oldId = state.item;
      readLocation();
      if (!state.item && oldId && origin) {
        state.category = groupExists(origin.category) ? origin.category : "all";
        var originalIndex = filteredProducts().findIndex(function (p) { return p.id === origin.focusId; });
        if (originalIndex >= 0) state.page = Math.floor(originalIndex / pageSize) + 1;
        writeLocation(true);
      }
      renderBrowser();
      if (state.item) {
        var current = history.state && history.state.zfCatalogue;
        origin = current && current.origin || origin;
        showProductUI(findProduct(state.item));
      } else {
        closeUI();
        if (oldId) restoreOrigin(oldId);
      }
    });
    var resizeQueued = false;
    window.addEventListener("resize", function () {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(function () {
        resizeQueued = false;
        var nextSize = responsivePageSize();
        if (nextSize === pageSize) return;
        var list = filteredProducts();
        var anchor = state.item || (list[(state.page - 1) * pageSize] && list[(state.page - 1) * pageSize].id);
        pageSize = nextSize;
        var anchorIndex = list.findIndex(function (p) { return p.id === anchor; });
        state.page = Math.floor(Math.max(0, anchorIndex) / pageSize) + 1;
        renderBrowser(); writeLocation(true);
      });
    });
  }

  function initPageBrand() {
    if (!document.body.classList.contains("zf-catalogue-page")) return;
    var company = window.INLINE_DATA && window.INLINE_DATA.company;
    if (company) {
      document.getElementById("header-name-en").textContent = company.nameEn || "ZIGFISH";
      document.getElementById("header-name-cn").textContent = company.name || "";
      document.getElementById("footer-name").textContent = company.nameEn || "ZIGFISH";
      if (company.logo && /^data:image\/(?:png|jpe?g|webp|svg\+xml);/i.test(company.logo)) {
        var logo = document.createElement("img"); logo.src = company.logo; logo.alt = "ZIGFISH";
        document.getElementById("header-logo-img").appendChild(logo);
      }
    }
    document.getElementById("catalogue-year").textContent = String(new Date().getFullYear());
    var menu = document.getElementById("mobile-menu-btn");
    var links = document.getElementById("nav-links");
    menu.addEventListener("click", function () { var open = !links.classList.contains("open"); links.classList.toggle("open", open); menu.setAttribute("aria-expanded", String(open)); menu.setAttribute("aria-label", open ? "Close navigation / 关闭导航" : "Open navigation / 打开导航"); });
    links.addEventListener("click", function (event) { if (event.target.closest("a")) { links.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") { links.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });
  }

  function loadCatalogue() {
    return fetch("catalogue-data.json", { credentials: "same-origin" }).then(function (response) { if (!response.ok) throw new Error("Catalogue response " + response.status); return response.json(); }).then(function (data) {
      products = normalizeProducts(data);
      if (featured) renderFeatured();
      if (browser) initBrowser();
    }).catch(function () {
      var target = browser || featured;
      target.setAttribute("aria-busy", "false");
      target.innerHTML = '<p class="zf-catalogue-message" role="status">Catalogue could not load. Please try again.<br>产品目录暂时未能加载，请重试。<button class="zf-catalogue-retry" type="button">Reload / 重新加载</button></p>';
      target.querySelector("button").addEventListener("click", function () { target.setAttribute("aria-busy", "true"); loadCatalogue(); });
    });
  }
  initPageBrand();
  loadCatalogue();
})();
