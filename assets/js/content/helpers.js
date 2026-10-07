/* helpers.js - HTML builders shared by every content file.
   C: code block, S: shaped section, Q: callout, T: table, L: external link. */

function escH(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function C(lang, src) { return '<pre><code class="language-' + lang + '">' + escH(src.replace(/^\n+/, '').replace(/\s+$/, '')) + '</code></pre>'; }
function S(shape, title, html) { return '<section class="shape" data-shape="' + shape + '"><h2 data-shape="' + shape + '">' + title + '</h2>' + html + '</section>'; }
function Q(kind, html) { return '<blockquote data-callout="' + kind + '"><p>' + html + '</p></blockquote>'; }
function T(kind, head, rows) {
  var h = '<div class="table-scroll"><table data-table="' + kind + '"><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>';
  rows.forEach(function (r) { h += '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; });
  return h + '</tbody></table></div>';
}
function L(text, url) { return '<a href="' + url + '" target="_blank" rel="noopener">' + text + '</a>'; }
