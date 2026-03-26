import { C } from "./colors";

const highlightBash = (code) => {
  return code.split("\n").map((line, i) => {
    const trimmed = line.trimStart();
    const isComment = trimmed.startsWith("#");
    return (
      <span key={i}>
        {isComment ? <span style={{ color: C.dim }}>{line}</span> : line}
        {i < code.split("\n").length - 1 ? "\n" : ""}
      </span>
    );
  });
};

const PY_KEYWORDS = new Set([
  "import", "from", "def", "class", "return", "if", "elif", "else", "for",
  "while", "try", "except", "finally", "with", "as", "in", "not", "and",
  "or", "is", "None", "True", "False", "async", "await", "yield", "raise",
  "pass", "break", "continue", "lambda", "global", "nonlocal",
]);

const highlightPython = (code) => {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trimStart();
    const indent = line.slice(0, line.length - trimmed.length);

    // Full-line comment
    if (trimmed.startsWith("#")) {
      return <span key={lineIdx}>{indent}<span style={{ color: C.dim }}>{trimmed}</span>{lineIdx < lines.length - 1 ? "\n" : ""}</span>;
    }

    // Decorator
    if (trimmed.startsWith("@")) {
      return <span key={lineIdx}>{indent}<span style={{ color: C.tertiary }}>{trimmed}</span>{lineIdx < lines.length - 1 ? "\n" : ""}</span>;
    }

    // Tokenize the line
    const tokens = [];
    let pos = 0;
    while (pos < trimmed.length) {
      // Inline comment
      if (trimmed[pos] === "#") {
        tokens.push({ type: "comment", value: trimmed.slice(pos) });
        pos = trimmed.length;
      }
      // Triple-quoted strings
      else if (trimmed.slice(pos, pos + 3) === '"""' || trimmed.slice(pos, pos + 3) === "'''") {
        const quote = trimmed.slice(pos, pos + 3);
        const end = trimmed.indexOf(quote, pos + 3);
        if (end !== -1) {
          tokens.push({ type: "string", value: trimmed.slice(pos, end + 3) });
          pos = end + 3;
        } else {
          tokens.push({ type: "string", value: trimmed.slice(pos) });
          pos = trimmed.length;
        }
      }
      // Strings
      else if (trimmed[pos] === '"' || trimmed[pos] === "'") {
        const quote = trimmed[pos];
        let end = pos + 1;
        while (end < trimmed.length && trimmed[end] !== quote) {
          if (trimmed[end] === "\\") end++;
          end++;
        }
        tokens.push({ type: "string", value: trimmed.slice(pos, end + 1) });
        pos = end + 1;
      }
      // f-string prefix
      else if ((trimmed[pos] === "f" || trimmed[pos] === "b" || trimmed[pos] === "r") && (trimmed[pos + 1] === '"' || trimmed[pos + 1] === "'")) {
        const quote = trimmed[pos + 1];
        let end = pos + 2;
        while (end < trimmed.length && trimmed[end] !== quote) {
          if (trimmed[end] === "\\") end++;
          end++;
        }
        tokens.push({ type: "string", value: trimmed.slice(pos, end + 1) });
        pos = end + 1;
      }
      // Words (identifiers / keywords)
      else if (/[a-zA-Z_]/.test(trimmed[pos])) {
        let end = pos;
        while (end < trimmed.length && /[a-zA-Z0-9_]/.test(trimmed[end])) end++;
        const word = trimmed.slice(pos, end);
        if (PY_KEYWORDS.has(word)) {
          tokens.push({ type: "keyword", value: word });
        } else if ((word === "def" || word === "class") || (tokens.length > 0 && tokens[tokens.length - 1].value === "def")) {
          tokens.push({ type: "funcname", value: word });
        } else {
          tokens.push({ type: "plain", value: word });
        }
        pos = end;
      }
      // Numbers
      else if (/[0-9]/.test(trimmed[pos])) {
        let end = pos;
        while (end < trimmed.length && /[0-9._]/.test(trimmed[end])) end++;
        tokens.push({ type: "number", value: trimmed.slice(pos, end) });
        pos = end;
      }
      // Everything else
      else {
        let end = pos;
        while (end < trimmed.length && !/[a-zA-Z_0-9#"'fb]/.test(trimmed[end])) end++;
        if (end === pos) end = pos + 1;
        tokens.push({ type: "plain", value: trimmed.slice(pos, end) });
        pos = end;
      }
    }

    // Mark function names (word after "def" or "class")
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "keyword" && (tokens[i].value === "def" || tokens[i].value === "class")) {
        for (let j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === "plain" && tokens[j].value.trim()) {
            tokens[j] = { ...tokens[j], type: "funcname" };
            break;
          }
        }
      }
    }

    const colorMap = {
      keyword: C.accent,
      string: C.tertiary,
      comment: C.dim,
      funcname: C.highlight,
      number: C.secondary,
      plain: C.text,
    };

    return (
      <span key={lineIdx}>
        {indent}
        {tokens.map((t, ti) => (
          <span key={ti} style={{ color: colorMap[t.type] || C.text }}>{t.value}</span>
        ))}
        {lineIdx < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
};

const highlightCode = (code, language) => {
  if (language === "bash") return highlightBash(code);
  if (language === "python") return highlightPython(code);
  return code;
};

const CodeBlock = ({ code, language = "bash" }) => (
  <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px", paddingRight: 60, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14, lineHeight: 1.7, overflowX: "auto", position: "relative" }}>
    <div style={{ position: "absolute", top: 8, right: 12, fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, pointerEvents: "none" }}>{language}</div>
    <pre style={{ margin: 0, color: C.text, whiteSpace: "pre-wrap" }}>{highlightCode(code, language)}</pre>
  </div>
);

export default CodeBlock;
