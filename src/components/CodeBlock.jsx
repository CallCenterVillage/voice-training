import { C } from "./colors";

const CodeBlock = ({ code, language = "bash" }) => (
  <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14, lineHeight: 1.7, overflowX: "auto", position: "relative" }}>
    <div style={{ position: "absolute", top: 8, right: 12, fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{language}</div>
    <pre style={{ margin: 0, color: C.text, whiteSpace: "pre-wrap" }}>{code}</pre>
  </div>
);

export default CodeBlock;
