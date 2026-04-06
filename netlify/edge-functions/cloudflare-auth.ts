export default async (request: Request) => {
    const secret = request.headers.get("x-netlify-shared-secret");
    const expected = Deno.env.get("CLOUDFLARE_SHARED_SECRET");

    console.log("Got:", secret, "Expected:", expected);

    if (secret !== expected) {
        return new Response(`Forbidden - got: ${secret}`, { status: 403 });
    }
};