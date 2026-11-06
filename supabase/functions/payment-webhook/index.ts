import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Owner-Id",
};

const PLAN_IDS = ["starter", "pro", "creator"];
const encoder = new TextEncoder();

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hasValidSignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody)));
  return constantTimeEqual(expected, signature.trim().toLowerCase());
}

interface PaymentEvent {
  status: string;
  bookId: string;
  planId: string;
  email: string;
}

function parseEvent(value: unknown): PaymentEvent | null {
  if (typeof value !== "object" || value === null) return null;
  const { status, book_id, plan_id, email } = value as Record<string, unknown>;
  if (typeof status !== "string" || typeof book_id !== "string") return null;
  if (typeof plan_id !== "string" || !PLAN_IDS.includes(plan_id)) return null;
  if (typeof email !== "string" || email.length === 0) return null;
  return { status, bookId: book_id, planId: plan_id, email };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const secret = Deno.env.get("PAYMENT_WEBHOOK_SECRET");
    if (!secret) return json({ error: "Webhook is not configured" }, 503);

    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    if (!signature || !(await hasValidSignature(rawBody, signature, secret))) {
      return json({ error: "Invalid signature" }, 401);
    }

    const event = parseEvent(JSON.parse(rawBody));
    if (!event) return json({ error: "Invalid payment payload" }, 400);
    if (event.status !== "paid") return json({ received: true, ignored: true }, 200);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: story, error: storyError } = await admin
      .from("stories")
      .update({ is_unlocked: true })
      .eq("id", event.bookId)
      .select("user_id")
      .maybeSingle();
    if (storyError) throw storyError;
    if (!story) return json({ error: "Book not found" }, 404);

    const { error: userError } = await admin
      .from("users")
      .update({ email: event.email, current_subscription: event.planId })
      .eq("id", story.user_id);
    if (userError) throw userError;

    return json({ received: true, unlocked: true }, 200);
  } catch (error) {
    console.error("Payment webhook failed", error);
    return json({ error: "Webhook processing failed" }, 500);
  }
});
