import { C, InfoBox } from '../../components';

const ThankYouSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Thank You</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
      Call Center Village wouldn't exist without the people who've supported us along the way.
    </p>

    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <h2 id="the-conferences" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>The Conferences</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          To every conference that gave Call Center Village a chance — and let us come back even after we failed. Thank you for the floor space, the badge access, and the willingness to take the risk on something new. Every iteration of the village has been better because of the communities that hosted us.
        </p>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <h2 id="the-people" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>The People</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          To everyone who's shared resources, ideas, feedback, and encouragement — you've shaped what this project has become. There are countless people not named here who've helped us along the way — thank you so much.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {["Patrick", "Jay", "Sarah", "Brendan", "Canis", "DEF CON Dan", "ChiefGyk3d", "DC614", "Our families"].map(name => (
            <span key={name} style={{ background: C.codeBg, border: `1px solid ${C.border}`, padding: "4px 12px", borderRadius: 6, fontSize: 13, color: C.text, fontWeight: 600 }}>{name}</span>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <h2 id="the-customers" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>The Customers</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          To the customers who trusted us enough to let us test on their systems — thank you. The real-world access you provided is what makes this training grounded in reality rather than theory. None of this training would be possible without your willingness to participate.
        </p>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <h2 id="the-sponsors" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>The Sponsors</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          We're still looking for sponsors! If you'd like to support Call Center Village, visit <a href="https://www.callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>callcentervillage.com/sponsors</a>.
        </p>
      </div>
    </div>

    <div style={{ marginTop: 32 }} />
    <InfoBox>Please submit village feedback at <a href="https://www.callcentervillage.com/contact" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>callcentervillage.com/contact</a> or email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "none" }}>support@callcentervillage.com</a>.<br />Feel free to use an <a href="https://www.privacyguides.org/en/email-aliasing/" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>email alias</a> if you'd like to remain anonymous.</InfoBox>

    <div style={{ textAlign: "center", marginTop: 48, fontSize: 18, fontStyle: "italic", lineHeight: 1.8 }}>
      <span style={{ color: C.muted }}>Thank you so much for your support,</span><br />
      <span style={{ fontSize: 32, fontWeight: 800, fontStyle: "normal", background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Call Center Village</span>
    </div>

    <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
      {[
        { label: "Our Website", url: "https://www.callcentervillage.com" },
        { label: "Mastodon", url: "https://defcon.social/@callcentervillage" },
        { label: "Village Schedule", url: "https://www.callcentervillage.com/schedule" },
        { label: "Sponsor Us", url: "https://www.callcentervillage.com/sponsors" },
      ].map(link => (
        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
          style={{ color: C.muted, fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "8px 16px", border: `1px solid ${C.border}`, borderRadius: 8, transition: "all 0.2s ease" }}>
          {link.label} <span style={{ color: C.accent, fontSize: 12 }}>↗</span>
        </a>
      ))}
    </div>
  </div>
);

export default ThankYouSection;
