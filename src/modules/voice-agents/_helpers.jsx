import { useState } from "react";
import { C, Icon } from "../../components";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const SystemPromptExplainer = () => {
  // Hover alone left this content unreachable by keyboard and on touch, so a
  // click/Enter/Space toggle pins it open independently of the pointer.
  const [hoveredSection, setHoveredSection] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const isShown = (i) => hoveredSection === i || openSection === i;
  const sections = [
    {
      color: C.accent,
      title: "ROLE DEFINITION",
      tooltip: "The opening line sets the agent's identity and scope. Keep it narrow and specific — specialized agents with a clearly defined role have fewer edge cases, clearer success criteria, and faster response times than broad 'do everything' agents.",
      lines: ["You are a helpful customer service agent for Acme Corp."],
    },
    {
      color: C.secondary,
      title: "VOICE-SPECIFIC RULES",
      tooltip: "These rules are unique to voice agents. TTS models work best with alphabetical text — digits and symbols like '@' or '$' can cause mispronunciations. Keep responses under 3 sentences unless asked for detail. Every unnecessary word is a potential source of misinterpretation.",
      lines: [
        "- Keep responses SHORT (1-3 sentences). Long responses feel like lectures.",
        "- Use conversational language, not formal writing.",
        '- Never use markdown, bullet points, or formatting — the caller can\'t see it.',
        '- Spell out numbers and abbreviations: say "twenty three dollars" not "$23".',
        '- Include filler words naturally: "Sure thing!", "Let me check on that."',
        '- If you need to do a long task, say "One moment please" to fill silence.',
        '- Handle mishearing gracefully: "I want to make sure I got that right..."',
      ],
    },
    {
      color: C.highlight,
      title: "TOOLS AVAILABLE",
      tooltip: "Tool definitions tell the LLM what actions it can take. Include descriptions for all parameters, specify expected formats with examples (e.g., 'phone number as 10 digits: 5551234567'), and add 'when to use' guidance for each tool. Speech-to-text can produce spoken-form values, so account for conversions like 'at' → '@'.",
      lines: [
        "- lookup_account(phone_number) → returns account details",
        "  Format: 10-digit number, e.g. 5551234567",
        "- check_balance(account_id) → returns current balance",
        "- transfer_to_human(reason) → connects to live agent",
        "  Use when: customer requests a human, or issue is beyond your scope",
      ],
    },
    {
      color: C.tertiary,
      title: "GUARDRAILS",
      tooltip: "List all non-negotiable rules in a dedicated guardrails section. Some models are tuned to pay extra attention to this heading. Centralize compliance rules here for easier auditing. Include handling instructions for edge cases like abusive callers or unknown answers.",
      lines: [
        "- Never guess or make up information. If unsure, say so.",
        "- Verify caller identity before sharing any account details. This step is important.",
        "- Never process refunds over $500 without transferring to a human.",
        "- If the caller becomes abusive, calmly offer to transfer to a supervisor.",
      ],
    },
    {
      color: C.accent,
      title: "ERROR HANDLING",
      tooltip: "Tools can fail due to network issues, missing data, or permission errors. Include explicit recovery instructions for every tool — never let the agent hallucinate a response when a tool fails. Specify retry logic and fallback options like escalation or callbacks.",
      lines: [
        "- If a tool call fails, apologize and offer to try again or transfer.",
        "- Never invent account details or balances.",
        "- If you cannot verify the caller, explain what they need and offer a callback.",
      ],
    },
    {
      color: C.secondary,
      title: "TURN-TAKING",
      tooltip: "Turn-taking rules control the flow of conversation. Voice is real-time — unlike text, the caller can't scroll back or re-read. End each turn with a clear question or pause point. Use brief affirmations and check for understanding after complex steps.",
      lines: [
        "- End your turns with a clear question or pause point.",
        "- If the caller seems confused, ask a simpler question.",
        "- If you don't understand, ask them to repeat — don't guess.",
        '- After complex steps, confirm: "Does that make sense so far?"',
      ],
    },
  ];

  return (
    <div style={{ background: C.codeBg, borderRadius: 8, padding: 16, fontSize: 13, fontFamily: "monospace", lineHeight: 1.8, position: "relative" }}>
      {sections.map((section, i) => (
        <div
          key={i}
          role="button"
          tabIndex={0}
          aria-expanded={isShown(i)}
          onMouseEnter={() => setHoveredSection(i)}
          onMouseLeave={() => setHoveredSection(null)}
          onFocus={() => setHoveredSection(i)}
          onBlur={() => setHoveredSection(null)}
          onClick={() => setOpenSection(prev => (prev === i ? null : i))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpenSection(prev => (prev === i ? null : i));
            }
          }}
          style={{
            padding: "8px 12px",
            marginBottom: 4,
            borderRadius: 6,
            cursor: "help",
            transition: "background 0.2s ease",
            background: isShown(i) ? `${section.color}15` : "transparent",
            borderLeft: `3px solid ${isShown(i) ? section.color : "transparent"}`,
            position: "relative",
          }}
        >
          <div style={{ color: section.color, fontWeight: 700, marginBottom: 2 }}>{section.title}:</div>
          {section.lines.map((line, j) => (
            <div key={j} style={{ color: C.muted }}>{line}</div>
          ))}
          {isShown(i) && (
            <div style={{
              marginTop: 8,
              background: `${section.color}18`, border: `1px solid ${section.color}44`,
              borderRadius: 8, padding: 12, fontSize: 13, fontFamily: "inherit",
              color: C.text, lineHeight: 1.6,
            }}>
              {section.tooltip}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const AnimatedFlow = ({ nodes, activeNode = -1, onNodeClick }) => (
  <div style={{ overflowX: "auto", padding: "16px 0" }}>
    {/* Node row */}
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {nodes.map((node, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < nodes.length - 1 ? 1 : undefined }}>
          <div
            onClick={() => onNodeClick && onNodeClick(i)}
            {...(onNodeClick ? {
              role: "button",
              tabIndex: 0,
              onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNodeClick(i); } },
            } : {})}
            style={{
              background: i === activeNode ? `${C.secondary}15` : C.card,
              border: `1.5px solid ${i === activeNode ? C.secondary : C.border}`,
              borderRadius: 12,
              padding: "14px 18px",
              minWidth: 100,
              textAlign: "center",
              cursor: onNodeClick ? "pointer" : "default",
              transition: "all 0.3s ease",
              boxShadow: i === activeNode ? `0 0 24px ${C.secondary}22` : "none",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}><Icon name={node.icon} size={24} /></div>
            <div style={{ fontSize: 14, color: i === activeNode ? C.secondary : C.muted, fontWeight: 600 }}>{node.label}</div>
            {node.latency && <div style={{ fontSize: 14, color: node.latencyColor || C.dim, fontWeight: 600, marginTop: 2 }}>{node.latency}</div>}
          </div>
          {i < nodes.length - 1 && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
              <ArrowRightIcon style={{ width: 16, height: 16, color: C.border }} aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
    {/* Wire labels row */}
    {nodes.some(n => n.wire) && <div style={{ position: "relative", marginTop: 12 }}>
      {/* Dashed line spanning full width */}
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 0, borderTop: `1px dashed ${C.border}` }} />
      {/* "Data Format" label pinned to left */}
      <div style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, whiteSpace: "nowrap", background: C.bg, padding: "0 6px", zIndex: 1 }}>Data Format</div>
      {/* Labels positioned over the line */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
        {nodes.map((node, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < nodes.length - 1 ? 1 : undefined }}>
            <div style={{ minWidth: 100, padding: "0 18px" }} />
            {i < nodes.length - 1 && (
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                {node.wire && <div style={{ fontSize: 11, color: C.dim, fontWeight: 600, background: C.codeBg, padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{node.wire}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>}
  </div>
);

export const LatencyMeter = ({ label, ms, max = 2000 }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
      <span style={{ color: C.muted }}>{label}</span>
      {/* C.primary as text is 2.6:1 — the slowest latencies were the least legible. */}
      <span style={{ color: ms < 300 ? C.accent : ms < 800 ? C.tertiary : C.primaryText, fontWeight: 700, fontFamily: "monospace" }}>{ms}ms</span>
    </div>
    <div role="progressbar" aria-valuenow={ms} aria-valuemin={0} aria-valuemax={max} aria-label={label} style={{ background: C.codeBg, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{
        width: `${Math.min((ms / max) * 100, 100)}%`,
        height: "100%",
        borderRadius: 4,
        background: ms < 300 ? C.accent : ms < 800 ? C.tertiary : C.primaryText,
        transition: "width 0.5s ease",
      }} />
    </div>
  </div>
);
