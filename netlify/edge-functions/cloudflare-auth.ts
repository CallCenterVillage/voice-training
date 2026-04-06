export default async (request: Request) => {
    const secret = request.headers.get("X-Netlify-Shared-Secret");

    if (secret !== Deno.env.get("CLOUDFLARE_SHARED_SECRET")) {
        return new Response("Forbidden", { status: 403 });
    }
    // Header matches — let the request through
};

export const config = {
    path: "/*",
};