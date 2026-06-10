// Build: inline fashion-data.json into js/data-inline.js for public site
var fs = require('fs');
var data = fs.readFileSync('./fashion-data.json', 'utf8');
fs.writeFileSync('./js/data-inline.js', 'window.INLINE_DATA = ' + data + ';', 'utf8');
console.log('OK: data-inline.js updated (' + (fs.statSync('./js/data-inline.js').size / 1024).toFixed(0) + ' KB)');
