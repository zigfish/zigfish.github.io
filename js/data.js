/* ============================================================
   Fashion Factory - Data Layer (localStorage)
   Bilingual support: Chinese editing, English+Chinese display
   ============================================================ */

var DataManager = (function () {
  var STORAGE_KEY = "fashion_factory_data";
  var MAX_STORAGE = 5 * 1024 * 1024;
  var _defaultPassword = (function(){var a="YWRtaW4xMjM=";return atob(a);})();

  var DATA_VERSION = 3;

  var DEFAULT_DATA = {
    dataVersion: 0,
    password: _defaultPassword,
    company: {
      name: "",
      nameEn: "",
      address: "",
      addressEn: "",
      phone: "",
      email: "",
      intro: "",
      introEn: "",
      logo: "",
      stats: [
        { labelEn:"Years Experience", labelCn:"行业经验",   value:"20+" },
        { labelEn:"Factories",        labelCn:"生产基地",   value:"5" },
        { labelEn:"Annual Output",    labelCn:"年产量",     value:"1M+" },
        { labelEn:"Countries Exported",labelCn:"出口国家",  value:"30+" }
      ],
      advantages: [
        { icon:"truck", titleEn:"Reliable Delivery", titleCn:"稳定交期", descEn:"On-time delivery is our baseline, not a promise. We plan backward from your deadlines.", descCn:"准时交货是我们的基本线。我们从您的截止日期倒推计划。" },
        { icon:"check-circle", titleEn:"Quality Control", titleCn:"品质管控", descEn:"Multi-stage inspection throughout production, from raw fabric to finished garment.", descCn:"从面料入厂到成衣出货，全流程多道检验。" },
        { icon:"users", titleEn:"Dedicated Team", titleCn:"用心团队", descEn:"Stable workforce averaging 8+ years. Low turnover means your orders stay in experienced hands.", descCn:"平均工龄8年以上的稳定团队，确保您的订单始终在熟练工人手中。" },
        { icon:"globe", titleEn:"Global Experience", titleCn:"全球经验", descEn:"Served brands across 30+ countries. We understand diverse market requirements and compliance standards.", descCn:"服务过30多个国家的品牌，深谙不同市场的需求与合规标准。" }
      ]
    },
    social: { tiktok: "", facebook: "", linkedin: "" },
    categories: [],
    coverImage: "",
    certificates: [],
    wechatQR: "",
    whatsapp: ""
  };

  var _externalData = null;

  try {
    if (window.location.protocol === "https:" || window.location.protocol === "http:") {
      var xhr2 = new XMLHttpRequest();
      xhr2.open("GET", "fashion-data.json", false);
      xhr2.timeout = 3000;
      xhr2.send();
      if (xhr2.status === 200) {
        _externalData = JSON.parse(xhr2.responseText);
      }
    }
  } catch (e) { /* use defaults */ }

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
        var mb = (json.length / 1024 / 1024).toFixed(2);
        throw new Error("存储空间不足，请删除部分图片后重试。当前数据大小: " + mb + "MB");
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
            } else { mergedCerts.push(tCert); }
          }
          for (var cid in certSourceMap) {
            if (certSourceMap.hasOwnProperty(cid)) mergedCerts.push(certSourceMap[cid]);
          }
          out[key] = mergedCerts;
        }
      } else if (key === "categories" && Array.isArray(source[key]) && Array.isArray(out[key])) {
        var mergedCats = [];
        var sourceMap = {};
        for (var si = 0; si < source[key].length; si++) {
          sourceMap[source[key][si].id] = source[key][si];
        }
        for (var ti = 0; ti < out[key].length; ti++) {
          var tCat = out[key][ti];
          if (sourceMap[tCat.id]) {
            var sCat = sourceMap[tCat.id];
            var merged = JSON.parse(JSON.stringify(sCat));
            if ((!sCat.images || sCat.images.length === 0) && tCat.images && tCat.images.length > 0) {
              merged.images = tCat.images;
            }
            mergedCats.push(merged);
            delete sourceMap[tCat.id];
          } else { mergedCats.push(tCat); }
        }
        for (var id in sourceMap) {
          if (sourceMap.hasOwnProperty(id)) mergedCats.push(sourceMap[id]);
        }
        out[key] = mergedCats;
      } else if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        out[key] = deepMerge(out[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  }

  // ---- Company ----
  function getCompanyInfo() { return getAllData().company; }
  function updateCompanyInfo(info) {
    var data = getAllData();
    data.company = Object.assign({}, data.company, info);
    saveAllData(data);
  }

  // ---- Social Links ----
  function getSocialLinks() { return getAllData().social; }
  function updateSocialLinks(links) {
    var data = getAllData();
    data.social = Object.assign({}, data.social, links);
    saveAllData(data);
  }

  // ---- Categories ----
  function getCategories() { return getAllData().categories; }
  function getCategory(id) { return getAllData().categories.find(function(c){return c.id===id;}); }
  function updateCategory(id, updates) {
    var data = getAllData();
    var idx = data.categories.findIndex(function(c){return c.id===id;});
    if (idx === -1) return;
    data.categories[idx] = Object.assign({}, data.categories[idx], updates);
    saveAllData(data);
  }
  function addCategory(cat) {
    var data = getAllData();
    var maxId = data.categories.reduce(function(max,c){return Math.max(max,c.id);},0);
    data.categories.push({
      id: maxId+1, name: cat.name, nameEn: cat.nameEn||"",
      description: cat.description||"", descriptionEn: cat.descriptionEn||"",
      images: [], placeholder: cat.placeholder||false
    });
    saveAllData(data);
  }
  function deleteCategory(id) {
    var data = getAllData();
    data.categories = data.categories.filter(function(c){return c.id!==id;});
    saveAllData(data);
  }

  // ---- Images ----
  function addImageToCategory(categoryId, dataUrl) {
    var data = getAllData();
    var cat = data.categories.find(function(c){return c.id===categoryId;});
    if (!cat) return;
    cat.images.push(dataUrl);
    if (cat.images.length > 0 && cat.placeholder) cat.placeholder = false;
    saveAllData(data);
  }
  function deleteImageFromCategory(categoryId, imageIndex) {
    var data = getAllData();
    var cat = data.categories.find(function(c){return c.id===categoryId;});
    if (!cat) return;
    cat.images.splice(imageIndex, 1);
    saveAllData(data);
  }
  function replaceImageInCategory(categoryId, imageIndex, dataUrl) {
    var data = getAllData();
    var cat = data.categories.find(function(c){return c.id===categoryId;});
    if (!cat) return;
    cat.images[imageIndex] = dataUrl;
    saveAllData(data);
  }

  // ---- Cover Image ----
  function getCoverImage() { return getAllData().coverImage||""; }
  function updateCoverImage(dataUrl) {
    var data = getAllData();
    data.coverImage = dataUrl;
    saveAllData(data);
  }

  // ---- Certificates ----
  function getCertificates() { return getAllData().certificates; }
  function getCertificate(id) { return getAllData().certificates.find(function(c){return c.id===id;}); }
  function addCertificate(cert) {
    var data = getAllData();
    var maxId = data.certificates.reduce(function(max,c){return Math.max(max,c.id);},0);
    data.certificates.push({
      id: maxId+1, name: cert.name, nameEn: cert.nameEn||"",
      image: cert.image||"", file: cert.file||""
    });
    saveAllData(data);
  }
  function updateCertificate(id, updates) {
    var data = getAllData();
    var idx = data.certificates.findIndex(function(c){return c.id===id;});
    if (idx===-1) return;
    data.certificates[idx] = Object.assign({}, data.certificates[idx], updates);
    saveAllData(data);
  }
  function deleteCertificate(id) {
    var data = getAllData();
    data.certificates = data.certificates.filter(function(c){return c.id!==id;});
    saveAllData(data);
  }

  // ---- Contact Settings ----
  function getContactSettings() {
    var d = getAllData();
    return { wechatQR: d.wechatQR||"", whatsapp: d.whatsapp||"" };
  }
  function updateContactSettings(settings) {
    var data = getAllData();
    if (settings.wechatQR !== undefined) data.wechatQR = settings.wechatQR;
    if (settings.whatsapp !== undefined) data.whatsapp = settings.whatsapp;
    saveAllData(data);
  }

  // ---- Password ----
  function verifyPassword(pwd) { return getAllData().password === pwd; }
  function updatePassword(newPwd) {
    var data = getAllData();
    data.password = newPwd;
    saveAllData(data);
  }

  // ---- Storage ----
  function getStorageUsage() {
    var raw = localStorage.getItem(STORAGE_KEY)||"";
    var used = new Blob([raw]).size;
    var pct = ((used/MAX_STORAGE)*100).toFixed(1);
    return { used:used, max:MAX_STORAGE, usedMB:(used/1024/1024).toFixed(2), percent:Math.min(Number(pct),100) };
  }
  function resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    saveAllData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
  }
  function compressImage(file, maxWidth, quality) {
    maxWidth = maxWidth||1200;
    quality = quality||0.75;
    return new Promise(function(resolve,reject){
      var reader = new FileReader();
      reader.onload = function(e){
        var img = new Image();
        img.onload = function(){
          var canvas = document.createElement("canvas");
          var w=img.width, h=img.height;
          if(w>maxWidth){ h=(h*maxWidth)/w; w=maxWidth; }
          canvas.width=w; canvas.height=h;
          var ctx=canvas.getContext("2d");
          ctx.drawImage(img,0,0,w,h);
          resolve(canvas.toDataURL("image/jpeg",quality));
        };
        img.onerror=reject;
        img.src=e.target.result;
      };
      reader.onerror=reject;
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
    compressImage: compressImage
  };
})();
