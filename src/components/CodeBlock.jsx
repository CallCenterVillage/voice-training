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

const CodeBlock = ({ code, language = "bash" }) => (
  <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px", paddingRight: 60, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14, lineHeight: 1.7, overflowX: "auto", position: "relative" }}>
    <div style={{ position: "absolute", top: 8, right: 12, fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, pointerEvents: "none" }}>{language}</div>
    <pre style={{ margin: 0, color: C.text, whiteSpace: "pre-wrap" }}>{language === "bash" ? highlightBash(code) : code}</pre>
  </div>
);

export default CodeBlock;
