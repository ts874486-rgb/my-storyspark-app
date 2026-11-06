const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Owner-Id",
};

const PLAN_CHECKOUT_SECRETS: Record<string, string> = {
  starter: "CHECKOUT_URL_STARTER",
  pro: "CHECKOUT_URL_PRO",
  creator: "CHECKOUT_URL_CREATOR",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOOK_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface CheckoutInput {
  bookId: string;
  planId: string;
  email: string;
}

function parseInput(value: unknown): CheckoutInput | null {
  if (typeof value !== "object" || value === null) return null;
  const { bookId, planId, email } = value as Record<string, unknown>;
  if (typeof bookId !== "string" || !BOOK_ID_PATTERN.test(bookId)) return null;
  if (typeof planId !== "string" || !Object.hasOwn(PLAN_CHECKOUT_SECRETS, planId)) return null;
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) return null;
  return { bookId, planId, email: email.trim() };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const input = parseInput(await req.json());
    if (!input) return json({ error: "Invalid checkout details" }, 400);

    const webhookSecret = Deno.env.get("PAYMENT_WEBHOOK_SECRET");
    const checkoutBase = Deno.env.get(PLAN_CHECKOUT_SECRETS[input.planId]);
    if (!webhookSecret || !checkoutBase) {
      return json({ error: "Hosted checkout is not configured" }, 503);
    }

    const url = new URL(checkoutBase);
    if (url.protocol !== "https:") return json({ error: "Hosted checkout is not configured" }, 503);
    url.searchParams.set("email", input.email);
    url.searchParams.set("custom_book_id", input.bookId);
    url.searchParams.set("custom_plan_id", input.planId);

    return json({ url: url.toString() }, 200);
  } catch (error) {
    console.error("Checkout creation failed", error);
    return json({ error: "Checkout could not be created" }, 500);
  }
});
