/* highlight.js - AI-901 guide
   Same tokenizer as the SC-500 guide, retargeted.

   AI-901 code is mostly Python (Foundry SDK, Speech SDK, Content Understanding),
   with bash for the Azure CLI and a little KQL, JSON and YAML. The rule that
   matters most is unchanged:

     DESTRUCTIVE AND BILLABLE TOKENS ARE MARKED IN THE COST COLOUR.

   In this exam the runaway meters are different ones: provisioned throughput
   deployments bill by the hour whether or not you call them, and Azure AI Search
   bills hourly from creation above the free tier. Deletes, purges and key
   regeneration are irreversible, so they get the same treatment. */

(function (global) {
  'use strict';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var DANGER = new RegExp([
    '\\baz\\s+group\\s+delete\\b', '\\bdelete\\b', '\\bpurge\\b',
    '--yes\\b', '--force\\b', '\\bkeys\\s+regenerate\\b',
    '\\b(?:Global|DataZone)?ProvisionedManaged\\b',
    '\\baz\\s+search\\s+service\\s+create\\b',
    '\\bRemove-Az[A-Za-z]*', '-Force\\b'
  ].join('|'), 'g');

  var LANGS = {
    python: {
      comment: /#[^\n]*/g,
      string: /[rRbBuUfF]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/g,
      keyword: /\b(?:import|from|as|def|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|with|try|except|finally|raise|class|lambda|pass|break|continue|async|await|yield)\b/g,
      fn: /\b[A-Za-z_]\w*(?=\()/g,
      number: /\b\d+(?:\.\d+)?\b/g
    },
    bash: {
      comment: /#[^\n]*/g,
      string: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,
      keyword: /\b(?:if|then|fi|for|do|done|while|case|esac|function|export|local|return|echo|source)\b/g,
      fn: /\b(?:az|pip|python3?|curl|git|sudo)\b/g,
      param: /(?:^|\s)--?[A-Za-z][\w-]*/g,
      variable: /\$\{?[A-Za-z_]\w*\}?/g,
      number: /\b\d+(?:\.\d+)?\b/g
    },
    kusto: {
      comment: /\/\/[^\n]*/g,
      string: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,
      keyword: /\b(?:where|summarize|project|project-away|extend|join|union|let|order|sort|by|take|top|count|distinct|render|make-series|mv-expand|parse|on|asc|desc|and|or|not|has|contains|startswith|in)\b/g,
      fn: /\b(?:ago|now|todatetime|tostring|toint|bin|strcat|split|iff|case|arg_max|arg_min|dcount|sum|avg|min|max|round|countif|make_set)\b(?=\s*\()/g,
      number: /\b\d+(?:\.\d+)?[dhms]?\b/g,
      table: /^\s*([A-Z]\w+)(?=\s*$|\s*\|)/gm
    },
    json: {
      key: /"(?:[^"\\]|\\.)*"(?=\s*:)/g,
      string: /"(?:[^"\\]|\\.)*"/g,
      keyword: /\b(?:true|false|null)\b/g,
      number: /-?\b\d+(?:\.\d+)?\b/g
    },
    yaml: {
      comment: /#[^\n]*/g,
      key: /^\s*[\w-]+(?=:)/gm,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
      number: /\b\d+(?:\.\d+)?\b/g
    },
    text: {}
  };

  var ALIAS = {
    py: 'python', python: 'python',
    sh: 'bash', bash: 'bash', shell: 'bash', console: 'bash',
    kql: 'kusto', kusto: 'kusto',
    json: 'json', yml: 'yaml', yaml: 'yaml', text: 'text'
  };

  function tokenize(src, rules) {
    var marks = new Array(src.length);
    var order = ['comment', 'string', 'key', 'table', 'keyword', 'fn', 'param', 'variable', 'number'];
    order.forEach(function (kind) {
      var re = rules[kind];
      if (!re) return;
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(src)) !== null) {
        if (m[0] === '') { re.lastIndex++; continue; }
        var start = m.index + (m[0].length - m[0].replace(/^\s+/, '').length);
        var end = m.index + m[0].length;
        var free = true;
        for (var i = start; i < end; i++) if (marks[i]) { free = false; break; }
        if (free) for (var j = start; j < end; j++) marks[j] = kind;
      }
    });
    DANGER.lastIndex = 0;
    var d;
    while ((d = DANGER.exec(src)) !== null) {
      for (var k = d.index; k < d.index + d[0].length; k++) marks[k] = 'danger';
    }
    var out = '', cur = null, buf = '';
    function flush() {
      if (!buf) return;
      out += cur ? '<span class="t-' + cur + '">' + esc(buf) + '</span>' : esc(buf);
      buf = '';
    }
    for (var p = 0; p < src.length; p++) {
      if (marks[p] !== cur) { flush(); cur = marks[p]; }
      buf += src[p];
    }
    flush();
    return out;
  }

  function highlightEl(code) {
    if (code.dataset.hl === 'done') return;
    var m = /language-([\w-]+)/.exec(code.className || '');
    var lang = m ? ALIAS[m[1].toLowerCase()] : null;
    code.dataset.hl = 'done';
    if (!lang || !LANGS[lang]) return;
    code.dataset.lang = lang === 'kusto' ? 'kql' : lang;
    code.innerHTML = tokenize(code.textContent, LANGS[lang]);
  }

  function mount(root) {
    var blocks = root.querySelectorAll('pre > code');
    for (var i = 0; i < blocks.length; i++) highlightEl(blocks[i]);
  }

  global.AI901Highlight = { mount: mount };
})(window);
