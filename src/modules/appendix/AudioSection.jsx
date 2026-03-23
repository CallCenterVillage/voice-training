import { C, CodeBlock, InfoBox } from '../../components';
import { SectionDivider } from './_helpers';

const AudioSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Audio Tips</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Useful audio techniques for working with telephone systems and voice processing.
    </p>

    <div id="dtmf-table" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>DTMF Frequency Table</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Each key on a telephone keypad produces a unique pair of frequencies — one from the row and one from the column. This dual-tone multi-frequency (DTMF) system is how phones signal digits to the network.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "center" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.dim, fontWeight: 700 }}></th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1209 Hz</th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1336 Hz</th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1477 Hz</th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1633 Hz</th>
          </tr>
        </thead>
        <tbody>
          {[
            { row: "697 Hz", keys: ["1", "2", "3", "A"] },
            { row: "770 Hz", keys: ["4", "5", "6", "B"] },
            { row: "852 Hz", keys: ["7", "8", "9", "C"] },
            { row: "941 Hz", keys: ["*", "0", "#", "D"] },
          ].map(r => (
            <tr key={r.row}>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>{r.row}</td>
              {r.keys.map(k => (
                <td key={k} style={{ padding: "8px 12px", borderBottom: `1px solid ${C.border}`, color: C.text, fontWeight: 600, fontSize: 16 }}>{k}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p style={{ color: C.dim, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>Keys A–D were originally used in the military's <a href="https://en.wikipedia.org/wiki/Autovon#Multilevel_precedence_and_preemption" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>AUTOVON</a> network for precedence and preemption signaling, and can still be found in some amateur radio and PBX systems.</p>

    <SectionDivider />

    <div id="dtmf" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>DTMF Tone Generation</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Generate clean DTMF (touch-tone) signals — especially helpful when working with telephone systems, IVR menus, and call center testing.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Using FFmpeg (CLI)</div>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: "0 0 12px 0" }}>
        Each DTMF digit is two sine waves mixed together. FFmpeg can generate and mix these from the command line.
      </p>
      <CodeBlock language="bash" code={`# Generate a single DTMF digit (e.g. "5" = 770 Hz + 1336 Hz)
# Standard DTMF: 250ms tone
ffmpeg -f lavfi -i "sine=frequency=770:duration=0.25" \\
       -f lavfi -i "sine=frequency=1336:duration=0.25" \\
       -filter_complex amix=inputs=2 -ar 16000 -ac 1 digit5.wav -y \\
  && play digit5.wav`} />
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Using Audacity (GUI)</div>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: C.muted, lineHeight: 2 }}>
        <li>Open Audacity</li>
        <li>Generate → DTMF Tones</li>
        <li>Enter the sequence you want (e.g. <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>18005551234</code> for a phone number)</li>
        <li>Set the duration and amplitude, then click OK</li>
        <li>File → Export Audio → save as WAV</li>
      </ol>
    </div>

    <SectionDivider />

    <div id="telephone-tones" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Telephone Tones</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Generate standard telephone signaling tones with SoX — useful for testing IVR systems, simulating call flows, and understanding PSTN audio.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <CodeBlock language="bash" code={`# Dial tone (North American)
sox -n -r 8000 -c 1 dialtone.wav \\
  synth 3 sine 350 sine 440 \\
  && play dialtone.wav

# Busy signal
sox -n -r 8000 -c 1 busy.wav \\
  synth 0.5 sine 480 sine 620 \\
  pad 0 0.5 repeat 4 \\
  && play busy.wav

# Ringback tone
sox -n -r 8000 -c 1 ringback.wav \\
  synth 2 sine 440 sine 480 \\
  pad 0 4 repeat 3 \\
  && play ringback.wav

# Off-hook warning (receiver left off hook)
sox -n -r 8000 -c 1 offhook.wav \\
  synth 0.1 sine 1400 sine 2060 sine 2450 sine 2600 \\
  pad 0 0.1 repeat 20 \\
  && play offhook.wav

# Comfort noise (low hiss for dead-air filling)
sox -n -r 8000 -c 1 comfort_noise.wav \\
  synth 5 brownnoise vol 0.02 \\
  && play comfort_noise.wav

# Call waiting beep
sox -n -r 8000 -c 1 callwaiting.wav \\
  synth 0.3 sine 440 \\
  pad 0 9.7 repeat 2 \\
  && play callwaiting.wav

# SIT tones (Special Information Tones — the "your call cannot be completed" intro)
sox -n -r 8000 -c 1 sit.wav \\
  synth 0.33 sine 913.8 : \\
  synth 0.33 sine 1370.6 : \\
  synth 0.33 sine 1776.7 \\
  && play sit.wav

# PSTN bandpass filter (make any audio sound like it's over a phone line)
sox input.wav -r 8000 -c 1 phoneline.wav \\
  sinc 300-3400 \\
  && play phoneline.wav`} />
    </div>

    <SectionDivider />

    <div id="yt-dlp" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Extracting Audio (yt-dlp)</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Download audio from YouTube and other video platforms — useful for obtaining voice samples from public recordings like conference talks, interviews, and podcasts.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <CodeBlock language="bash" code={`# yt-dlp is pre-installed on Call Center Village laptops\ncd ~/callcentervillage/voice-cloning\n\n# Download audio only from a YouTube video\nyt-dlp -x --audio-format wav -o "downloaded.%(ext)s" "https://www.youtube.com/watch?v=EXAMPLE"\n\n# If the output isn't WAV, convert with FFmpeg\nffmpeg -i downloaded.webm -ar 16000 -ac 1 -c:a pcm_s16le sample.wav && play sample.wav\n\n# Download just a specific clip (e.g., 30 seconds starting at 1:05)\nyt-dlp -x --audio-format wav -o "clip.%(ext)s" \\\n  --download-sections "*1:05-1:35" \\\n  "https://www.youtube.com/watch?v=EXAMPLE"\n\n# Full pipeline: download, convert to 16kHz mono WAV, and play\nyt-dlp -x --audio-format wav -o "raw.%(ext)s" "https://www.youtube.com/watch?v=EXAMPLE" && \\\n  ffmpeg -i raw.wav -ar 16000 -ac 1 -c:a pcm_s16le sample.wav && \\\n  play sample.wav`} />
    </div>
    <InfoBox>Only download audio you have the right to use. Public recordings (conference talks, earnings calls, press conferences) are generally fair game for security research, but always check the terms and applicable laws.</InfoBox>
  </div>
);

export default AudioSection;
