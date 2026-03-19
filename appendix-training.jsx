import { C, CodeBlock, TrainingShell, Icon, InfoBox } from './src/components';

const SectionDivider = () => <hr style={{ border: "none", borderTop: "1px solid #040208", margin: "48px 0" }} />;

const SECTIONS = [
  { id: "tools", title: "Helpful Tools", icon: "wrench" },
  { id: "audio", title: "Audio Tips", icon: "speaker-wave" },
];

const ToolsSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Helpful Tools</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Tools and techniques that are useful across all modules — voice cloning, voice agents, and social engineering.
    </p>

    <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>yt-dlp</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Download audio from YouTube and other video platforms — useful for obtaining voice samples from public recordings like conference talks, interviews, and podcasts.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <CodeBlock language="bash" code={`# yt-dlp is pre-installed on Call Center Village laptops\ncd ~/callcentervillage/voice-cloning\n\n# Download audio only from a YouTube video\nyt-dlp -x --audio-format wav -o "downloaded.%(ext)s" "https://www.youtube.com/watch?v=EXAMPLE"\n\n# If the output isn't WAV, convert with FFmpeg\nffmpeg -i downloaded.webm -ar 16000 -ac 1 -c:a pcm_s16le sample.wav && play sample.wav\n\n# Download just a specific clip (e.g., 30 seconds starting at 1:05)\nyt-dlp -x --audio-format wav -o "clip.%(ext)s" \\\n  --download-sections "*1:05-1:35" \\\n  "https://www.youtube.com/watch?v=EXAMPLE"\n\n# Full pipeline: download, convert to 16kHz mono WAV, and play\nyt-dlp -x --audio-format wav -o "raw.%(ext)s" "https://www.youtube.com/watch?v=EXAMPLE" && \\\n  ffmpeg -i raw.wav -ar 16000 -ac 1 -c:a pcm_s16le sample.wav && \\\n  play sample.wav`} />
    </div>
    <InfoBox>Only download audio you have the right to use. Public recordings (conference talks, earnings calls, press conferences) are generally fair game for security research, but always check the terms and applicable laws.</InfoBox>
  </div>
);

const AudioSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Audio Tips</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Useful audio techniques for working with telephone systems and voice processing.
    </p>

    <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>DTMF Tone Generation</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Generate clean DTMF (touch-tone) signals with Audacity — especially helpful when working with telephone systems, IVR menus, and call center testing.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Using Audacity</div>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: C.muted, lineHeight: 2 }}>
        <li>Open Audacity</li>
        <li>Generate → DTMF Tones</li>
        <li>Enter the sequence you want (e.g. <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>18005551234</code> for a phone number)</li>
        <li>Set the duration and amplitude, then click OK</li>
        <li>File → Export Audio → save as WAV</li>
      </ol>
    </div>
  </div>
);

const COMPS = [ToolsSection, AudioSection];

export { SECTIONS, COMPS };

export default function AppendixTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Appendix" topOffset={48} />;
}
