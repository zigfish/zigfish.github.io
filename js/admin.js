/* ============================================================
   Fashion Factory - Admin Panel (Bilingual + Social)
   ============================================================ */

(function () {
  var currentPanel = "company";
  var pendingImageCategoryId = null;

  // ---- Toast ----
  var toastTimer = null;
  function showToast(msg, type) {
    var toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.className = "toast toast-" + (type || "success") + " show";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  // ---- Login ----
  function initLogin() {
    var pwdInput = document.getElementById("login-password");
    var loginBtn = document.getElementById("login-btn");
    var errorEl = document.getElementById("login-error");

    function doLogin() {
      var pwd = pwdInput.value.trim();
      if (!pwd) {
        errorEl.textContent = "Please enter password";
        errorEl.classList.add("show");
        return;
      }
      if (DataManager.verifyPassword(pwd)) {
        errorEl.classList.remove("show");
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "flex";
        pwdInput.value = "";
        initDashboard();
      } else {
        errorEl.textContent = "Incorrect password / 密码错误";
        errorEl.classList.add("show");
        pwdInput.value = "";
      }
    }

    loginBtn.addEventListener("click", doLogin);
    pwdInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") doLogin();
    });
  }

  // ---- Logout ----
  function initLogout() {
    document.getElementById("logout-btn").addEventListener("click", function () {
      document.getElementById("login-screen").style.display = "flex";
      document.getElementById("admin-dashboard").style.display = "none";
      document.getElementById("login-password").value = "";
      document.getElementById("login-error").classList.remove("show");
    });
  }

  // ---- Dashboard Init ----
  function initDashboard() {
    updateStorageInfo();
    loadCurrentPanel();
  }

  function loadCurrentPanel() {
    if (currentPanel === "company") loadCompanyForm();
    if (currentPanel === "categories") loadCategoriesList();
    if (currentPanel === "social") loadSocialForm();
    updateStorageInfo();
  }

  // ---- Sidebar Navigation ----
  function initSidebar() {
    var links = document.querySelectorAll(".sidebar-nav a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) {
        e.preventDefault();
        var panel = this.getAttribute("data-panel");
        switchPanel(panel);
      });
    }
  }

  function switchPanel(panel) {
    currentPanel = panel;
    var links = document.querySelectorAll(".sidebar-nav a");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
      if (links[i].getAttribute("data-panel") === panel) {
        links[i].classList.add("active");
      }
    }
    var panels = document.querySelectorAll(".admin-panel");
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.remove("active");
    }
    var target = document.getElementById("panel-" + panel);
    if (target) target.classList.add("active");

    loadCurrentPanel();
  }

  // ---- Storage Info ----
  function updateStorageInfo() {
    var usage = DataManager.getStorageUsage();
    document.getElementById("storage-fill").style.width = usage.percent + "%";
    document.getElementById("storage-text").textContent = usage.usedMB + " / 5 MB";
  }

  // ==================== COMPANY INFO ====================

  function loadCompanyForm() {
    var co = DataManager.getCompanyInfo();
    document.getElementById("co-name").value = co.name || "";
    document.getElementById("co-name-en").value = co.nameEn || "";
    document.getElementById("co-address").value = co.address || "";
    document.getElementById("co-address-en").value = co.addressEn || "";
    document.getElementById("co-phone").value = co.phone || "";
    document.getElementById("co-email").value = co.email || "";
    document.getElementById("co-intro").value = co.intro || "";
    document.getElementById("co-intro-en").value = co.introEn || "";
    renderLogoPreview(co.logo);
  }

  function renderLogoPreview(logoDataUrl) {
    var preview = document.getElementById("logo-preview");
    if (logoDataUrl) {
      preview.innerHTML = '<img src="' + logoDataUrl + '" alt="Logo">';
    } else {
      preview.innerHTML = '<span class="no-logo">No Logo</span>';
    }
  }

  function initCompanyForm() {
    document.getElementById("save-company-btn").addEventListener("click", function () {
      var info = {
        name: document.getElementById("co-name").value.trim(),
        nameEn: document.getElementById("co-name-en").value.trim(),
        address: document.getElementById("co-address").value.trim(),
        addressEn: document.getElementById("co-address-en").value.trim(),
        phone: document.getElementById("co-phone").value.trim(),
        email: document.getElementById("co-email").value.trim(),
        intro: document.getElementById("co-intro").value.trim(),
        introEn: document.getElementById("co-intro-en").value.trim()
      };
      try {
        DataManager.updateCompanyInfo(info);
        showToast("Company info saved / 企业信息已保存");
        updateStorageInfo();
      } catch (e) {
        showToast("Save failed: " + e.message, "error");
      }
    });

    // Logo upload
    var logoInput = document.getElementById("logo-file-input");
    document.getElementById("logo-upload-btn").addEventListener("click", function () {
      logoInput.click();
    });
    logoInput.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      var file = this.files[0];
      if (file.size > 500 * 1024) {
        showToast("Logo file must be under 500KB", "error");
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        var dataUrl = e.target.result;
        DataManager.updateCompanyInfo({ logo: dataUrl });
        renderLogoPreview(dataUrl);
        showToast("Logo updated / Logo已更新");
        updateStorageInfo();
      };
      reader.readAsDataURL(file);
      this.value = "";
    });

    // Remove logo
    document.getElementById("logo-remove-btn").addEventListener("click", function () {
      DataManager.updateCompanyInfo({ logo: "" });
      renderLogoPreview("");
      showToast("Logo removed / Logo已移除");
      updateStorageInfo();
    });
  }

  // ==================== SOCIAL LINKS ====================

  function loadSocialForm() {
    var social = DataManager.getSocialLinks();
    document.getElementById("soc-tiktok").value = social.tiktok || "";
    document.getElementById("soc-facebook").value = social.facebook || "";
    document.getElementById("soc-linkedin").value = social.linkedin || "";
  }

  function initSocialForm() {
    document.getElementById("save-social-btn").addEventListener("click", function () {
      var links = {
        tiktok: document.getElementById("soc-tiktok").value.trim(),
        facebook: document.getElementById("soc-facebook").value.trim(),
        linkedin: document.getElementById("soc-linkedin").value.trim()
      };
      try {
        DataManager.updateSocialLinks(links);
        showToast("Social links saved / 社媒链接已保存");
        updateStorageInfo();
      } catch (e) {
        showToast("Save failed: " + e.message, "error");
      }
    });
  }

  // ==================== CATEGORIES ====================

  function loadCategoriesList() {
    var cats = DataManager.getCategories();
    var container = document.getElementById("category-admin-list");

    if (!cats.length) {
      container.innerHTML = '<div class="empty-state">No categories / 暂无品类</div>';
      return;
    }

    container.innerHTML = cats.map(function (cat) {
      var imageCount = cat.images ? cat.images.length : 0;
      var enName = cat.nameEn || "";
      var placeholderTag = cat.placeholder
        ? ' <span style="font-size:10px;color:#999;background:#f0f0f0;padding:1px 8px;margin-left:8px;">PLACEHOLDER</span>'
        : "";

      return (
        '<div class="category-list-item">' +
        '<div class="category-list-header" data-cat-id="' + cat.id + '">' +
        '<div class="info">' +
        "<h4>" + escapeHtml(cat.name) + placeholderTag + "</h4>" +
        (enName ? '<span class="en-name">' + escapeHtml(enName) + '</span>' : "") +
        '<span class="meta">' + imageCount + " images · " +
        escapeHtml((cat.descriptionEn || cat.description).substring(0, 40)) +
        (cat.description.length > 40 ? "..." : "") + "</span>" +
        "</div>" +
        '<div class="actions" onclick="event.stopPropagation()">' +
        '<button class="btn btn-outline btn-xs edit-cat-btn" data-id="' + cat.id + '">Edit</button>' +
        '<button class="btn btn-outline btn-xs upload-cat-btn" data-id="' + cat.id + '" style="color:var(--color-accent);">Upload</button>' +
        '<button class="btn btn-outline btn-xs delete-cat-btn" data-id="' + cat.id + '" style="color:#c0392b;">Delete</button>' +
        "</div>" +
        "</div>" +
        '<div class="category-list-body" data-body-id="' + cat.id + '">' +
        renderAdminImageGrid(cat) +
        "</div>" +
        "</div>"
      );
    }).join("");

    // Toggle expand
    var headers = container.querySelectorAll(".category-list-header");
    for (var i = 0; i < headers.length; i++) {
      headers[i].addEventListener("click", function () {
        var catId = this.getAttribute("data-cat-id");
        var body = container.querySelector('[data-body-id="' + catId + '"]');
        if (body) body.classList.toggle("open");
      });
    }

    // Edit buttons
    var editBtns = container.querySelectorAll(".edit-cat-btn");
    for (var j = 0; j < editBtns.length; j++) {
      editBtns[j].addEventListener("click", function (e) {
        e.stopPropagation();
        openEditCategoryModal(parseInt(this.getAttribute("data-id")));
      });
    }

    // Upload buttons (direct handlers)
    var uploadBtns = container.querySelectorAll(".upload-cat-btn");
    for (var k = 0; k < uploadBtns.length; k++) {
      uploadBtns[k].addEventListener("click", function (e) {
        e.stopPropagation();
        pendingImageCategoryId = parseInt(this.getAttribute("data-id"));
        document.getElementById("hidden-image-input").click();
      });
    }

    // Delete buttons
    var deleteBtns = container.querySelectorAll(".delete-cat-btn");
    for (var m = 0; m < deleteBtns.length; m++) {
      deleteBtns[m].addEventListener("click", function (e) {
        e.stopPropagation();
        var catId = parseInt(this.getAttribute("data-id"));
        var cat = DataManager.getCategory(catId);
        if (cat && confirm('Delete category "' + cat.name + '" and all its images?')) {
          DataManager.deleteCategory(catId);
          loadCategoriesList();
          updateStorageInfo();
          showToast("Category deleted / 品类已删除");
        }
      });
    }

    // Delete image buttons
    var delImgBtns = container.querySelectorAll(".del-img-btn");
    for (var n = 0; n < delImgBtns.length; n++) {
      delImgBtns[n].addEventListener("click", function (e) {
        e.stopPropagation();
        var catId = parseInt(this.getAttribute("data-cat-id"));
        var imgIdx = parseInt(this.getAttribute("data-img-idx"));
        DataManager.deleteImageFromCategory(catId, imgIdx);
        loadCategoriesList();
        updateStorageInfo();
        showToast("Image deleted / 图片已删除");
      });
    }

    // Replace image buttons
    var replImgBtns = container.querySelectorAll(".replace-img-btn");
    for (var p = 0; p < replImgBtns.length; p++) {
      replImgBtns[p].addEventListener("click", function (e) {
        e.stopPropagation();
        var catId = parseInt(this.getAttribute("data-cat-id"));
        var imgIdx = parseInt(this.getAttribute("data-img-idx"));
        replaceSingleImage(catId, imgIdx);
      });
    }
  }

  function renderAdminImageGrid(cat) {
    var images = cat.images || [];
    var html = '<div class="admin-image-grid">';
    for (var i = 0; i < images.length; i++) {
      var src = images[i];
      // Handle both relative paths and data URLs
      html +=
        '<div class="admin-image-item">' +
        '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(cat.name) + '">' +
        '<div class="img-actions">' +
        '<button class="replace-img-btn" data-cat-id="' + cat.id + '" data-img-idx="' + i + '" title="Replace">&#8635;</button>' +
        '<button class="del-img-btn" data-cat-id="' + cat.id + '" data-img-idx="' + i + '" title="Delete">&times;</button>' +
        "</div>" +
        "</div>";
    }
    html += "</div>";
    if (images.length === 0) {
      html += '<div class="empty-state" style="padding:20px;">No images — click Upload button above</div>';
    }
    html +=
      '<button class="btn btn-outline btn-sm upload-cat-btn" data-id="' + cat.id + '" style="color:var(--color-accent);">+ Upload Images</button>';
    return html;
  }

  // ---- Image Upload ----
  function initImageUpload() {
    var input = document.getElementById("hidden-image-input");
    input.addEventListener("change", function () {
      if (!this.files || !this.files.length) return;
      if (pendingImageCategoryId === null) return;

      var files = this.files;
      var catId = pendingImageCategoryId;
      var loaded = 0;
      var total = files.length;
      var errors = [];

      function processNext(index) {
        if (index >= files.length) {
          loadCategoriesList();
          updateStorageInfo();
          if (errors.length) {
            showToast("Done: " + loaded + " ok, " + errors.length + " failed", "error");
          } else {
            showToast("Uploaded " + loaded + " images / 已上传 " + loaded + " 张图片");
          }
          pendingImageCategoryId = null;
          input.value = "";
          return;
        }

        var file = files[index];
        if (file.size > 3 * 1024 * 1024) {
          errors.push(file.name + " exceeds 3MB");
          processNext(index + 1);
          return;
        }

        DataManager.compressImage(file, 1200, 0.75)
          .then(function (dataUrl) {
            try {
              DataManager.addImageToCategory(catId, dataUrl);
              loaded++;
            } catch (e) {
              errors.push(file.name + " " + e.message);
            }
            processNext(index + 1);
          })
          .catch(function () {
            errors.push(file.name + " read failed");
            processNext(index + 1);
          });
      }

      processNext(0);
    });
  }

  function replaceSingleImage(catId, imgIdx) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function () {
      if (!this.files || !this.files[0]) return;
      var file = this.files[0];
      if (file.size > 3 * 1024 * 1024) {
        showToast("Image must be under 3MB", "error");
        return;
      }
      DataManager.compressImage(file, 1200, 0.75).then(function (dataUrl) {
        try {
          DataManager.replaceImageInCategory(catId, imgIdx, dataUrl);
          loadCategoriesList();
          updateStorageInfo();
          showToast("Image replaced / 图片已替换");
        } catch (e) {
          showToast("Replace failed: " + e.message, "error");
        }
      });
    };
    input.click();
  }

  // ---- Delegated upload handler (for body buttons rendered dynamically) ----
  function initDelegatedUpload() {
    document.getElementById("category-admin-list").addEventListener("click", function (e) {
      var uploadBtn = e.target.closest(".upload-cat-btn");
      if (uploadBtn) {
        e.stopPropagation();
        pendingImageCategoryId = parseInt(uploadBtn.getAttribute("data-id"));
        document.getElementById("hidden-image-input").click();
      }
    });
  }

  // ==================== CATEGORY MODAL ====================

  function openEditCategoryModal(catId) {
    var cat = DataManager.getCategory(catId);
    if (!cat) return;
    document.getElementById("add-cat-modal-title").textContent = "Edit Category / 编辑品类";
    document.getElementById("add-cat-name").value = cat.name || "";
    document.getElementById("add-cat-name-en").value = cat.nameEn || "";
    document.getElementById("add-cat-desc").value = cat.description || "";
    document.getElementById("add-cat-desc-en").value = cat.descriptionEn || "";
    document.getElementById("add-cat-placeholder").checked = !!cat.placeholder;
    document.getElementById("add-cat-edit-id").value = catId;
    document.getElementById("add-cat-modal").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function openAddCategoryModal() {
    document.getElementById("add-cat-modal-title").textContent = "Add Category / 新增品类";
    document.getElementById("add-cat-name").value = "";
    document.getElementById("add-cat-name-en").value = "";
    document.getElementById("add-cat-desc").value = "";
    document.getElementById("add-cat-desc-en").value = "";
    document.getElementById("add-cat-placeholder").checked = false;
    document.getElementById("add-cat-edit-id").value = "";
    document.getElementById("add-cat-modal").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCategoryModal() {
    document.getElementById("add-cat-modal").classList.remove("active");
    document.body.style.overflow = "";
  }

  function initCategoryModal() {
    document.getElementById("add-category-btn").addEventListener("click", openAddCategoryModal);
    document.getElementById("add-cat-modal-close").addEventListener("click", closeCategoryModal);
    document.getElementById("add-cat-modal").addEventListener("click", function (e) {
      if (e.target === this) closeCategoryModal();
    });

    document.getElementById("add-cat-save-btn").addEventListener("click", function () {
      var name = document.getElementById("add-cat-name").value.trim();
      var nameEn = document.getElementById("add-cat-name-en").value.trim();
      var desc = document.getElementById("add-cat-desc").value.trim();
      var descEn = document.getElementById("add-cat-desc-en").value.trim();
      var placeholder = document.getElementById("add-cat-placeholder").checked;
      var editId = document.getElementById("add-cat-edit-id").value;

      if (!name) {
        showToast("Please enter category name (CN)", "error");
        return;
      }

      if (editId) {
        DataManager.updateCategory(parseInt(editId), {
          name: name,
          nameEn: nameEn,
          description: desc,
          descriptionEn: descEn,
          placeholder: placeholder
        });
        showToast("Category updated / 品类已更新");
      } else {
        DataManager.addCategory({
          name: name,
          nameEn: nameEn,
          description: desc,
          descriptionEn: descEn,
          placeholder: placeholder
        });
        showToast("Category added / 品类已添加");
      }

      closeCategoryModal();
      loadCategoriesList();
      updateStorageInfo();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var modal = document.getElementById("add-cat-modal");
        if (modal.classList.contains("active")) closeCategoryModal();
      }
    });
  }

  // ==================== PASSWORD ====================

  function initPasswordForm() {
    document.getElementById("save-pwd-btn").addEventListener("click", function () {
      var oldPwd = document.getElementById("old-pwd").value;
      var newPwd = document.getElementById("new-pwd").value;
      var confirmPwd = document.getElementById("confirm-pwd").value;
      var errorEl = document.getElementById("pwd-error");

      if (!DataManager.verifyPassword(oldPwd)) {
        errorEl.textContent = "Current password incorrect / 当前密码错误";
        errorEl.classList.add("show");
        return;
      }
      if (!newPwd || newPwd.length < 4) {
        errorEl.textContent = "New password must be at least 4 characters";
        errorEl.classList.add("show");
        return;
      }
      if (newPwd !== confirmPwd) {
        errorEl.textContent = "Passwords do not match / 两次密码不一致";
        errorEl.classList.add("show");
        return;
      }

      DataManager.updatePassword(newPwd);
      errorEl.classList.remove("show");
      document.getElementById("old-pwd").value = "";
      document.getElementById("new-pwd").value = "";
      document.getElementById("confirm-pwd").value = "";
      showToast("Password updated / 密码已更新");
    });
  }

  // ---- Utility ----
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
  }

  // ---- Export Data ----
  function initExport() {
    document.getElementById("export-nav-btn").addEventListener("click", function (e) {
      e.preventDefault();
      var allData = DataManager.getAllData();
      // Remove password from export for security
      var exportData = JSON.parse(JSON.stringify(allData));
      delete exportData.password;
      var json = JSON.stringify(exportData, null, 2);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "fashion-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Data exported / 数据已导出");
    });
  }

  // ---- Init ----
  function init() {
    initLogin();
    initLogout();
    initExport();
    initSidebar();
    initCompanyForm();
    initSocialForm();
    initImageUpload();
    initDelegatedUpload();
    initCategoryModal();
    initPasswordForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
