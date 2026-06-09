/* ============================================================
   Fashion Factory - Data Layer (localStorage)
   Bilingual support: Chinese editing, English+Chinese display
   ============================================================ */

var DataManager = (function () {
  var STORAGE_KEY = "fashion_factory_data";
  var MAX_STORAGE = 5 * 1024 * 1024;
  var DEFAULT_PASSWORD = "admin123";

  var DATA_VERSION = 2;

  var DEFAULT_DATA = {
    dataVersion: 0,
    password: DEFAULT_PASSWORD,
    company: {
      name: "示范服装工厂",
      nameEn: "SAMPLE GARMENT FACTORY",
      address: "中国广东省广州市服装工业园",
      addressEn: "Garment Industrial Park, Guangzhou, Guangdong, China",
      phone: "+86 020-8888-6666",
      email: "info@sample-garment.cn",
      intro: "我们是一家拥有20年历史的专业服装制造企业，专注于高品质服装的设计、生产与销售。工厂占地面积8000平方米，拥有先进的生产设备和经验丰富的技术团队。我们为国内外众多品牌提供OEM/ODM服务，以精湛的工艺和可靠的交期赢得了客户的信赖。",
      introEn: "We are a professional garment manufacturer with 20 years of experience, specializing in the design, production and sales of high-quality apparel. Our factory covers 8,000 sqm with advanced equipment and an experienced technical team. We provide OEM/ODM services for brands worldwide, earning trust through excellent craftsmanship and reliable delivery.",
      logo: ""
    },
    social: {
      tiktok: "",
      facebook: "",
      linkedin: ""
    },
    categories: [
      {
        id: 1,
        name: "防晒衣 / 防风衣",
        nameEn: "Sun Protection / Windbreaker",
        description: "轻薄透气防晒系列，UPF50+高效防护，适合户外运动与日常穿着",
        descriptionEn: "Lightweight breathable sun protection series, UPF50+ high-efficiency protection, ideal for outdoor sports and daily wear",
        images: [
          "images/products/sun-protection/sun-protection-01.png",
          "images/products/sun-protection/sun-protection-02.png",
          "images/products/sun-protection/sun-protection-03.png",
          "images/products/sun-protection/sun-protection-04.png",
          "images/products/sun-protection/sun-protection-05.png",
          "images/products/sun-protection/sun-protection-06.png",
          "images/products/sun-protection/sun-protection-07.png",
          "images/products/sun-protection/sun-protection-08.png"
        ],
        placeholder: false
      },
      {
        id: 2,
        name: "夹克",
        nameEn: "Jackets",
        description: "经典与潮流结合的夹克系列，精选面料，精工制作",
        descriptionEn: "A collection combining classic and trendy styles, selected fabrics, expertly crafted",
        images: [
          "images/products/jackets/jacket-01.jpg",
          "images/products/jackets/jacket-02.jpg",
          "images/products/jackets/jacket-03.jpg",
          "images/products/jackets/jacket-04.jpg",
          "images/products/jackets/jacket-05.jpg",
          "images/products/jackets/jacket-06.jpg",
          "images/products/jackets/jacket-07.jpg"
        ],
        placeholder: false
      },
      {
        id: 3,
        name: "韩国工作服",
        nameEn: "Korean Workwear",
        description: "韩版时尚工作服设计，兼顾功能性与美观度",
        descriptionEn: "Korean-style fashion workwear design, balancing functionality and aesthetics",
        images: [
          "images/products/workwear/workwear-01.png",
          "images/products/workwear/workwear-02.png",
          "images/products/workwear/workwear-03.png",
          "images/products/workwear/workwear-04.png",
          "images/products/workwear/workwear-05.png"
        ],
        placeholder: false
      },
      {
        id: 4,
        name: "孩童",
        nameEn: "Kids",
        description: "舒适安全的童装系列，A类面料标准，呵护孩子健康成长",
        descriptionEn: "Comfortable and safe kids' wear series, Class-A fabric standard, caring for children's healthy growth",
        images: [
          "images/products/kids/kids-01.jpg",
          "images/products/kids/kids-02.jpg",
          "images/products/kids/kids-03.jpg",
          "images/products/kids/kids-04.jpg",
          "images/products/kids/kids-05.jpg",
          "images/products/kids/kids-06.jpg"
        ],
        placeholder: false
      },
      {
        id: 5,
        name: "棉衣",
        nameEn: "Padded Jackets",
        description: "保暖棉衣系列，精选填充材料，温暖整个冬季",
        descriptionEn: "Warm padded jacket series, selected filling materials, keeping you warm all winter",
        images: [
          "images/products/padded/padded-01.jpg",
          "images/products/padded/padded-02.jpg",
          "images/products/padded/padded-03.jpg"
        ],
        placeholder: false
      },
      {
        id: 6,
        name: "沙滩短裤 / 泳装短裤",
        nameEn: "Beach Shorts / Swim Shorts",
        description: "时尚沙滩短裤与泳装短裤系列",
        descriptionEn: "Trendy beach shorts and swim shorts collection",
        images: [
          "images/products/beach-shorts/beach-shorts-01.png"
        ],
        placeholder: false
      },
      {
        id: 7,
        name: "运动短裤 / 长裤",
        nameEn: "Sports Shorts / Pants",
        description: "运动短裤与长裤系列，舒适透气",
        descriptionEn: "Sports shorts and pants collection, comfortable and breathable",
        images: [
          "images/products/sports-shorts/sports-shorts-01.jpg",
          "images/products/sports-shorts/sports-shorts-02.jpg",
          "images/products/sports-shorts/sports-shorts-03.jpg",
          "images/products/sports-shorts/sports-shorts-04.jpg",
          "images/products/sports-shorts/sports-shorts-05.jpg"
        ],
        placeholder: false
      },
      {
        id: 8,
        name: "运动裤 / 裤子",
        nameEn: "Sports Trousers / Pants",
        description: "运动裤与休闲裤系列",
        descriptionEn: "Sports trousers and casual pants collection",
        images: [
          "images/products/pants/pants-01.jpg"
        ],
        placeholder: false
      },
      {
        id: 9,
        name: "备用品类",
        nameEn: "Reserved Category",
        description: "图片待补充",
        descriptionEn: "Coming Soon",
        images: [],
        placeholder: true
      }
    ],
    coverImage: "",
    certificates: [],
    wechatQR: "",
    whatsapp: ""
  };

  var _externalData = null;

  // Try to load external data file (for deployed version)
  try {
    if (window.location.protocol === "https:" || window.location.protocol === "http:") {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "fashion-data.json", false);
      xhr.send();
      if (xhr.status === 200) {
        _externalData = JSON.parse(xhr.responseText);
      }
    }
  } catch (e) {
    // Ignore — use defaults
  }

  function getAllData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var seed;
        if (_externalData) {
          seed = deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), _externalData);
        } else {
          seed = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
        saveAllData(seed);
        return JSON.parse(JSON.stringify(seed));
      }
      var data = JSON.parse(raw);
      // If deployed data version is newer, re-seed from external file
      if (_externalData && _externalData.dataVersion > (data.dataVersion || 0)) {
        var newSeed = deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), _externalData);
        saveAllData(newSeed);
        return JSON.parse(JSON.stringify(newSeed));
      }
      var base = _externalData
        ? deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), _externalData)
        : JSON.parse(JSON.stringify(DEFAULT_DATA));
      return deepMerge(base, data);
    } catch (e) {
      console.error("Failed to read data:", e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function saveAllData(data) {
    try {
      var json = JSON.stringify(data);
      if (json.length > MAX_STORAGE) {
        throw new Error(
          "存储空间不足，请删除部分图片后重试。当前数据大小: " +
            (json.length / 1024 / 1024).toFixed(2) +
            "MB"
        );
      }
      localStorage.setItem(STORAGE_KEY, json);
      return true;
    } catch (e) {
      console.error("Failed to save data:", e);
      throw e;
    }
  }

  function deepMerge(target, source) {
    var out = JSON.parse(JSON.stringify(target));
    for (var key in source) {
      if (!source.hasOwnProperty(key)) continue;
      // Special handling: merge certificate arrays by id
      if (key === "certificates" && Array.isArray(source[key])) {
        if (!Array.isArray(out[key]) || out[key].length === 0) {
          out[key] = source[key];
        } else {
          var mergedCerts = [];
          var certSourceMap = {};
          for (var ci = 0; ci < source[key].length; ci++) {
            certSourceMap[source[key][ci].id] = source[key][ci];
          }
          for (var cj = 0; cj < out[key].length; cj++) {
            var tCert = out[key][cj];
            if (certSourceMap[tCert.id]) {
              mergedCerts.push(certSourceMap[tCert.id]);
              delete certSourceMap[tCert.id];
            } else {
              mergedCerts.push(tCert);
            }
          }
          for (var cid in certSourceMap) {
            if (certSourceMap.hasOwnProperty(cid)) {
              mergedCerts.push(certSourceMap[cid]);
            }
          }
          out[key] = mergedCerts;
        }
      // Special handling: merge categories array by id
      } else if (key === "categories" && Array.isArray(source[key]) && Array.isArray(out[key])) {
        var mergedCats = [];
        var sourceMap = {};
        for (var si = 0; si < source[key].length; si++) {
          sourceMap[source[key][si].id] = source[key][si];
        }
        for (var ti = 0; ti < out[key].length; ti++) {
          var tCat = out[key][ti];
          if (sourceMap[tCat.id]) {
            // Merge: source data wins for most fields, but preserve default images if source has none
            var sCat = sourceMap[tCat.id];
            var merged = JSON.parse(JSON.stringify(sCat));
            // If source has no images, keep default images (newly added paths)
            if ((!sCat.images || sCat.images.length === 0) && tCat.images && tCat.images.length > 0) {
              merged.images = tCat.images;
            }
            mergedCats.push(merged);
            delete sourceMap[tCat.id];
          } else {
            mergedCats.push(tCat);
          }
        }
        // Add any categories from source that aren't in target
        for (var id in sourceMap) {
          if (sourceMap.hasOwnProperty(id)) {
            mergedCats.push(sourceMap[id]);
          }
        }
        out[key] = mergedCats;
      } else if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        out[key] = deepMerge(out[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  }

  // ---- Company ----
  function getCompanyInfo() {
    return getAllData().company;
  }

  function updateCompanyInfo(info) {
    var data = getAllData();
    data.company = Object.assign({}, data.company, info);
    saveAllData(data);
  }

  // ---- Social Links ----
  function getSocialLinks() {
    return getAllData().social;
  }

  function updateSocialLinks(links) {
    var data = getAllData();
    data.social = Object.assign({}, data.social, links);
    saveAllData(data);
  }

  // ---- Categories ----
  function getCategories() {
    return getAllData().categories;
  }

  function getCategory(id) {
    return getAllData().categories.find(function (c) { return c.id === id; });
  }

  function updateCategory(id, updates) {
    var data = getAllData();
    var idx = data.categories.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return;
    data.categories[idx] = Object.assign({}, data.categories[idx], updates);
    saveAllData(data);
  }

  function addCategory(cat) {
    var data = getAllData();
    var maxId = data.categories.reduce(function (max, c) { return Math.max(max, c.id); }, 0);
    data.categories.push({
      id: maxId + 1,
      name: cat.name,
      nameEn: cat.nameEn || "",
      description: cat.description || "",
      descriptionEn: cat.descriptionEn || "",
      images: [],
      placeholder: cat.placeholder || false
    });
    saveAllData(data);
  }

  function deleteCategory(id) {
    var data = getAllData();
    data.categories = data.categories.filter(function (c) { return c.id !== id; });
    saveAllData(data);
  }

  // ---- Images ----
  function addImageToCategory(categoryId, dataUrl) {
    var data = getAllData();
    var cat = data.categories.find(function (c) { return c.id === categoryId; });
    if (!cat) return;
    cat.images.push(dataUrl);
    if (cat.images.length > 0 && cat.placeholder) {
      cat.placeholder = false;
    }
    saveAllData(data);
  }

  function deleteImageFromCategory(categoryId, imageIndex) {
    var data = getAllData();
    var cat = data.categories.find(function (c) { return c.id === categoryId; });
    if (!cat) return;
    cat.images.splice(imageIndex, 1);
    saveAllData(data);
  }

  function replaceImageInCategory(categoryId, imageIndex, dataUrl) {
    var data = getAllData();
    var cat = data.categories.find(function (c) { return c.id === categoryId; });
    if (!cat) return;
    cat.images[imageIndex] = dataUrl;
    saveAllData(data);
  }

  // ---- Cover Image ----
  function getCoverImage() {
    return getAllData().coverImage || "";
  }

  function updateCoverImage(dataUrl) {
    var data = getAllData();
    data.coverImage = dataUrl;
    saveAllData(data);
  }

  // ---- Certificates ----
  function getCertificates() {
    return getAllData().certificates;
  }

  function getCertificate(id) {
    return getAllData().certificates.find(function (c) { return c.id === id; });
  }

  function addCertificate(cert) {
    var data = getAllData();
    var maxId = data.certificates.reduce(function (max, c) { return Math.max(max, c.id); }, 0);
    data.certificates.push({
      id: maxId + 1,
      name: cert.name,
      nameEn: cert.nameEn || "",
      image: cert.image || "",
      file: cert.file || ""
    });
    saveAllData(data);
  }

  function updateCertificate(id, updates) {
    var data = getAllData();
    var idx = data.certificates.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return;
    data.certificates[idx] = Object.assign({}, data.certificates[idx], updates);
    saveAllData(data);
  }

  function deleteCertificate(id) {
    var data = getAllData();
    data.certificates = data.certificates.filter(function (c) { return c.id !== id; });
    saveAllData(data);
  }

  // ---- Contact Settings ----
  function getContactSettings() {
    var d = getAllData();
    return { wechatQR: d.wechatQR || "", whatsapp: d.whatsapp || "" };
  }

  function updateContactSettings(settings) {
    var data = getAllData();
    if (settings.wechatQR !== undefined) data.wechatQR = settings.wechatQR;
    if (settings.whatsapp !== undefined) data.whatsapp = settings.whatsapp;
    saveAllData(data);
  }

  // ---- Password ----
  function verifyPassword(pwd) {
    return getAllData().password === pwd;
  }

  function updatePassword(newPwd) {
    var data = getAllData();
    data.password = newPwd;
    saveAllData(data);
  }

  // ---- Storage ----
  function getStorageUsage() {
    var raw = localStorage.getItem(STORAGE_KEY) || "";
    var used = new Blob([raw]).size;
    var pct = ((used / MAX_STORAGE) * 100).toFixed(1);
    return {
      used: used,
      max: MAX_STORAGE,
      usedMB: (used / 1024 / 1024).toFixed(2),
      percent: Math.min(Number(pct), 100)
    };
  }

  function resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    saveAllData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
  }

  function compressImage(file, maxWidth, quality) {
    maxWidth = maxWidth || 1200;
    quality = quality || 0.75;
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement("canvas");
          var w = img.width;
          var h = img.height;
          if (w > maxWidth) {
            h = (h * maxWidth) / w;
            w = maxWidth;
          }
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return {
    getAllData: getAllData,
    saveAllData: saveAllData,
    getCompanyInfo: getCompanyInfo,
    updateCompanyInfo: updateCompanyInfo,
    getSocialLinks: getSocialLinks,
    updateSocialLinks: updateSocialLinks,
    getCategories: getCategories,
    getCategory: getCategory,
    updateCategory: updateCategory,
    addCategory: addCategory,
    deleteCategory: deleteCategory,
    addImageToCategory: addImageToCategory,
    deleteImageFromCategory: deleteImageFromCategory,
    replaceImageInCategory: replaceImageInCategory,
    updateCoverImage: updateCoverImage,
    getCoverImage: getCoverImage,
    getCertificates: getCertificates,
    getCertificate: getCertificate,
    addCertificate: addCertificate,
    updateCertificate: updateCertificate,
    deleteCertificate: deleteCertificate,
    getContactSettings: getContactSettings,
    updateContactSettings: updateContactSettings,
    verifyPassword: verifyPassword,
    updatePassword: updatePassword,
    getStorageUsage: getStorageUsage,
    resetToDefault: resetToDefault,
    compressImage: compressImage,
    DEFAULT_PASSWORD: DEFAULT_PASSWORD
  };
})();
