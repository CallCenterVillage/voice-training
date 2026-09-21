# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

- Email **security@callcentervillage.com** — the same address published in
  [`/.well-known/security.txt`](public/.well-known/security.txt), which is
  generated from `SECURITY_CONTACT` in `src/siteMeta.js` on every build
- Or use GitHub's private vulnerability reporting: **Security → Report a
  vulnerability** on this repository

Include what you found, how to reproduce it, and what an attacker could do with
it. You will get an acknowledgement within a few days. Please give us a
reasonable window to fix the issue before disclosing it publicly.

## Scope

This repository builds a static training site. In scope:

- The application source in `src/`, the build scripts in `scripts/`, and the
  Netlify edge function in `netlify/edge-functions/`
- Anything that lets a visitor inject script into a page, or that leaks
  a secret from the build or deploy configuration
- The deployed site at https://voice-training.callcentervillage.com

Out of scope:

- Findings against third-party services merely described in the training
  content — report those to the vendor
- Vulnerabilities in the tools and models the training teaches, unless this
  project's instructions for them are themselves unsafe
- Missing hardening headers with no demonstrated impact, and automated scanner
  output without a working proof of concept

## A note on the content

This training describes voice cloning, voice agent attack surface and social
engineering techniques, for defenders. Content that teaches an attack is not a
vulnerability in this repository. If you believe a section gives away more than
a defender needs, open an issue or email us — that is an editorial discussion,
and we would rather have it.

## Secrets

No credentials belong in this repository. The edge function reads
`CLOUDFLARE_SHARED_SECRET` from the environment and fails closed when it is
unset. If you find a committed secret, report it privately using the contacts
above.
