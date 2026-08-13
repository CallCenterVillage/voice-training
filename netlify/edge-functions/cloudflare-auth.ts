import type { Config } from "@netlify/edge-functions";

// Requires Cloudflare to inject `x-netlify-shared-secret` on every proxied
// request (Transform Rule -> Modify Request Header). Without that rule this
// 403s all traffic, including yours.
export const config: Config = {
    path: "/*",
    // Static assets are public anyway; excluding them avoids an edge invocation
    // per font/image/audio file.
    excludedPath: ["/assets/*", "/fonts/*", "/images/*", "/audio/*"],
};

// Length-independent comparison. Not a meaningful threat over the public
// internet, but it costs three lines and removes the question.
const timingSafeEqual = (a: string, b: string): boolean => {
    const enc = new TextEncoder();
    const x = enc.encode(a);
    const y = enc.encode(b);
    let diff = x.length ^ y.length;
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
        diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
    }
    return diff === 0;
};

export default async (request: Request) => {
    const secret = request.headers.get("x-netlify-shared-secret");
    const expected = Deno.env.get("CLOUDFLARE_SHARED_SECRET");

    // Unset or empty is a misconfiguration, never a pass. An empty string would
    // otherwise match a request sending an empty header value.
    if (!expected) {
        return new Response("Service unavailable", { status: 503 });
    }

    if (!secret || !timingSafeEqual(secret, expected)) {
        // No reflection of the supplied value, and nothing logged.
        return new Response("Forbidden", { status: 403 });
    }
};
