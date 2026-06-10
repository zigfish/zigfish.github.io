/* ============================================================
   Fashion Factory - Public Data Layer
   Reads from window.INLINE_DATA (embedded in page) — NO XHR.
   Falls back to DEFAULT_DATA if inline data is missing.
   ============================================================ */

var DataManager = (function () {
  var _data = null;

  var DEFAULT_DATA = {
    dataVersion: 0,
    password: "",
    company: {
      name: "", nameEn: "", address: "", addressEn: "",
      phone: "", email: "", intro: "", introEn: "", logo: "",
      stats: [],
      advantages: [],
      capabilities: []
    },
    social: { tiktok: "", facebook: "", linkedin: "" },
    categories: [],
    coverImage: "",
    certificates: [],
    wechatQR: "",
    whatsapp: ""
  };

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
        for (var sid in sourceMap) {
          if (sourceMap.hasOwnProperty(sid)) mergedCats.push(sourceMap[sid]);
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

  function getAllData() {
    if (_data) return _data;
    var external = window.INLINE_DATA || null;
    if (external) {
      _data = deepMerge(DEFAULT_DATA, external);
    } else {
      _data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return _data;
  }

  // ---- Read-only getters ----
  function getCompanyInfo() { return getAllData().company; }
  function getSocialLinks() { return getAllData().social; }
  function getCategories() { return getAllData().categories; }
  function getCategory(id) { return getAllData().categories.find(function(c){return c.id===id;}); }
  function getCoverImage() { return getAllData().coverImage||""; }
  function getCertificates() { return getAllData().certificates; }
  function getCertificate(id) { return getAllData().certificates.find(function(c){return c.id===id;}); }
  function getCapabilities() {
    var co = getAllData().company;
    return co.capabilities || [];
  }
  function getContactSettings() {
    var d = getAllData();
    return { wechatQR: d.wechatQR||"", whatsapp: d.whatsapp||"" };
  }

  return {
    getAllData: getAllData,
    getCompanyInfo: getCompanyInfo,
    getSocialLinks: getSocialLinks,
    getCategories: getCategories,
    getCategory: getCategory,
    getCoverImage: getCoverImage,
    getCertificates: getCertificates,
    getCertificate: getCertificate,
    getCapabilities: getCapabilities,
    getContactSettings: getContactSettings
  };
})();
