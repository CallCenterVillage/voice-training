import { C } from '../../components';
import { toAnchorId } from './_helpers';

export const resources = [
  { category: "Hugging Face", items: [
    { name: "Whisper.cpp Models", url: "https://huggingface.co/ggerganov/whisper.cpp", desc: "Pre-converted GGML models for whisper.cpp", archiveUrl: "https://web.archive.org/web/20260321191955/https://huggingface.co/ggerganov/whisper.cpp" },
    { name: "Hugging Face Audio Course", url: "https://huggingface.co/learn/audio-course", desc: "Comprehensive introduction to training and fine-tuning audio models", archiveUrl: "https://web.archive.org/web/20260321190820/https://huggingface.co/learn/audio-course/chapter0/introduction" },
  ] },
  { category: "Legal & Regulatory", items: [
    { name: "FTC — AI-Enabled Voice Cloning", url: "https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2023/11/preventing-harms-ai-enabled-voice-cloning", desc: "FTC guidance on preventing harms from voice cloning", archiveUrl: "https://web.archive.org/web/20260321191107/https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2023/11/preventing-harms-ai-enabled-voice-cloning" },
    { name: "FCC — AI Voices in Robocalls", url: "https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal", desc: "FCC ruling making AI-generated voice robocalls illegal", archiveUrl: "https://web.archive.org/web/20260303174307/https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal" },
    { name: "FCC — Consumer Guide to Robocalls", url: "https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts", desc: "Consumer guide on robocalls and AI voices", archiveUrl: "https://web.archive.org/web/20260314194700/https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts" },
    { name: "EU AI Act", url: "https://artificialintelligenceact.eu/", desc: "Official text and resources for the EU AI Act", archiveUrl: "https://web.archive.org/web/20260314014731/https://artificialintelligenceact.eu/" },
    { name: "NCSL — AI Legislation Tracker", url: "https://www.ncsl.org/technology-and-communication/artificial-intelligence-2024-legislation", desc: "State-level AI legislation tracker", archiveUrl: "https://web.archive.org/web/20260321191047/https://www.ncsl.org/technology-and-communication/artificial-intelligence-2024-legislation" },
    { name: "NCSL — Computer Crime Statutes", url: "https://www.ncsl.org/technology-and-communication/computer-crime-statutes", desc: "Computer crime statutes by state", archiveUrl: "https://web.archive.org/web/20260321191139/https://www.ncsl.org/technology-and-communication/computer-crime-statutes" },
    { name: "AI Voice Cloning and Consent", url: "https://sites.law.duq.edu/juris/2025/11/25/the-law-speaks-up-ai-voice-cloning-and-consent/", desc: "Duquesne Law review on AI voice cloning and consent", archiveUrl: "https://web.archive.org/web/20260321191044/https://sites.law.duq.edu/juris/2025/11/25/the-law-speaks-up-ai-voice-cloning-and-consent/" },
    { name: "California BOT Disclosure Act", url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001", desc: "California SB-1001 requiring bot disclosure", archiveUrl: "https://web.archive.org/web/20260321191121if_/https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001" },
    { name: "Keep Call Centers in America Act", url: "https://www.congress.gov/bill/119th-congress/senate-bill/2495/text", desc: "U.S. Senate bill on call center operations", archiveUrl: "https://web.archive.org/web/20260321191015/https://www.congress.gov/bill/119th-congress/senate-bill/2495/text" },
  ] },
  { category: "Security Frameworks", items: [
    { name: "MITRE ATT&CK — Phishing", url: "https://attack.mitre.org/techniques/T1598/", desc: "Phishing for information technique documentation", archiveUrl: "https://web.archive.org/web/20260304062642/https://attack.mitre.org/techniques/T1598/" },
    { name: "CISA — Recognize Phishing", url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing", desc: "CISA guide to recognizing and reporting phishing", archiveUrl: "https://web.archive.org/web/20260321191026/https://www.cisa.gov/secure-our-world/recognize-and-report-phishing" },
    { name: "FTC — Phishing Scams", url: "https://www.ftc.gov/news-events/topics/identity-theft/phishing-scams", desc: "FTC phishing scam prevention resources", archiveUrl: "https://web.archive.org/web/20260321191114/https://www.ftc.gov/news-events/topics/identity-theft/phishing-scams" },
    { name: "NIST — Social Engineering", url: "https://csrc.nist.gov/glossary/term/social_engineering", desc: "NIST definition and resources on social engineering", archiveUrl: "https://web.archive.org/web/20260321190947/https://csrc.nist.gov/glossary/term/social_engineering" },
    { name: "JP Morgan — When Callbacks Go Wrong", url: "https://www.jpmorgan.com/insights/cybersecurity/business-email-compromise/when-callbacks-go-wrong", desc: "How callback verification can fail and best practices for making it effective against BEC and vishing", archiveUrl: "https://web.archive.org/web/20260323072304/https://www.jpmorgan.com/insights/cybersecurity/business-email-compromise/when-callbacks-go-wrong" },
    { name: "NIST SP 800-63B — Authentication Guidelines", url: "https://pages.nist.gov/800-63-3/sp800-63b.html", desc: "NIST digital identity guidelines covering authenticator types, knowledge-based authentication limitations, and multi-factor requirements", archiveUrl: "https://web.archive.org/web/20260323072421/https://pages.nist.gov/800-63-3/sp800-63b.html" },
    { name: "National Cybersecurity Alliance — Safe Words in the Age of AI", url: "https://www.staysafeonline.org/articles/why-your-family-and-coworkers-need-a-safe-word-in-the-age-of-ai", desc: "Why families and coworkers need a safe word to defend against AI voice cloning scams", archiveUrl: "https://web.archive.org/web/20260323072436/https://www.staysafeonline.org/articles/why-your-family-and-coworkers-need-a-safe-word-in-the-age-of-ai" },
    { name: "FTC — AI Voice Cloning Scams", url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes", desc: "FTC consumer alert on how scammers use AI to enhance family emergency schemes" },
    { name: "NIST SP 800-63B — Out-of-Band Authenticators", url: "https://pages.nist.gov/800-63-4/sp800-63b/authenticators/", desc: "NIST guidelines on out-of-band authenticators and using separate communication channels for verification", archiveUrl: "https://web.archive.org/web/20260323072426/https://pages.nist.gov/800-63-4/sp800-63b/authenticators/" },
    { name: "FBI IC3 — Internet Crime Complaint Center", url: "https://www.ic3.gov/", desc: "FBI's portal for reporting internet crime including vishing and voice cloning scams" },
    { name: "KnowBe4 — Security Awareness Training", url: "https://www.knowbe4.com/products/security-awareness-training", desc: "Security awareness training platform with vishing simulations and deepfake training modules", archiveUrl: "https://web.archive.org/web/20260323072451/https://www.knowbe4.com/products/security-awareness-training" },
    { name: "Wire Transfer Best Practices", url: "https://www.fourscorelaw.com/resources/wire-transfers-best-practices", desc: "Fraud prevention best practices for wire transfers including dual control and voice verification procedures", archiveUrl: "https://web.archive.org/web/20260323072444/https://www.fourscorelaw.com/resources/wire-transfers-best-practices" },
    { name: "NIST SP 800-63B — Digital Identity Guidelines", url: "https://pages.nist.gov/800-63-4/sp800-63b.html", desc: "NIST guidelines on authentication including why voice biometrics alone are no longer sufficient", archiveUrl: "https://web.archive.org/web/20260323072457/https://pages.nist.gov/800-63-4/sp800-63b.html" },
    { name: "CISA — Avoiding Social Engineering Attacks", url: "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks", desc: "CISA guidance on recognizing and defending against social engineering and phishing attacks", archiveUrl: "https://web.archive.org/web/20260323072503/https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks" },
  ] },
  { category: "Reference", items: [
    { name: "FFmpeg/Libav Tutorial", url: "https://github.com/leandromoreira/ffmpeg-libav-tutorial", desc: "Learn FFmpeg libav the hard way — from zero to hero", archiveUrl: "https://web.archive.org/web/20260321190600/https://github.com/leandromoreira/ffmpeg-libav-tutorial" },
    { name: "Ultimate Guide to FFmpeg", url: "https://img.ly/blog/ultimate-guide-to-ffmpeg/", desc: "Comprehensive FFmpeg tutorial and reference", archiveUrl: "https://web.archive.org/web/20260321185713/https://img.ly/blog/ultimate-guide-to-ffmpeg/" },
    { name: "ASVspoof Challenge", url: "https://www.asvspoof.org", desc: "International challenge producing open-source anti-spoofing models", archiveUrl: "https://web.archive.org/web/20260311161316/https://www.asvspoof.org/" },
    { name: "Neural Speech Synthesis Survey", url: "https://arxiv.org/pdf/2106.15561", desc: "Academic survey on neural speech synthesis (arXiv)", archiveUrl: "https://web.archive.org/web/20260306112320/https://arxiv.org/pdf/2106.15561" },
    { name: "ARPAbet Phoneme Set", url: "https://en.wikipedia.org/wiki/ARPABET", desc: "The phoneme set used by most English TTS models" },
    { name: "Audio Deepfakes", url: "https://en.wikipedia.org/wiki/Audio_deepfake", desc: "Wikipedia overview of audio deepfake technology" },
    { name: "AUTOVON", url: "https://en.wikipedia.org/wiki/Autovon#Multilevel_precedence_and_preemption", desc: "Military telephone network that used DTMF keys A–D" },
    { name: "Call Recording Laws", url: "https://en.wikipedia.org/wiki/Telephone_call_recording_laws", desc: "Recording laws by jurisdiction" },
    { name: "Social Engineering", url: "https://en.wikipedia.org/wiki/Social_engineering_(security)", desc: "Wikipedia overview of social engineering in security" },
    { name: "Privacy Guides — Email Aliasing", url: "https://www.privacyguides.org/en/email-aliasing/", desc: "Guide to email aliasing for privacy", archiveUrl: "https://web.archive.org/web/20260321195812/https://www.privacyguides.org/en/email-aliasing/" },
    { name: "Nyquist–Shannon Sampling Theorem", url: "https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem", desc: "The fundamental limit on digital audio sampling rates" },
    { name: "Vector Databases", url: "https://en.wikipedia.org/wiki/Vector_database", desc: "How vector similarity search works" },
  ] },
];

const allResources = resources.flatMap(g => g.items.map(r => ({ ...r, category: g.category })))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const ResourcesSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Additional Resources</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      External websites, resources, and educational materials referenced throughout the training.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {allResources.map(r => (
        <div key={r.name} id={`res-${toAnchorId(r.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", scrollMarginTop: 120 }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{r.name}</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 8px 0" }}>{r.desc}</p>
          <div style={{ fontSize: 12 }}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>{r.url} ↗</a>
            {r.archiveUrl && <> [<a href={r.archiveUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.secondary, opacity: 0.6, textDecoration: "none" }}>archive</a>]</>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ResourcesSection;
