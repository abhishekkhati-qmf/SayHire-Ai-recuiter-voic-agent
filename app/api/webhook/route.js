import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { createClient } from "@supabase/supabase-js";

// Initialize Paddle
const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN, {
  environment: Environment.sandbox, // change to live in production
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY // service role key for server-side access
);

export async function POST(req) {
  const rawRequestBody = await req.text(); // important: raw text for signature
  const signature = req.headers.get("paddle-signature");
  const secretKey = process.env.WEBHOOK_SECRET_KEY;

  try {
    // Verify Paddle webhook
    const eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      secretKey,
      signature
    );

    if (eventData.eventType !== "transaction.completed") {
      return new Response("Ignored event type", { status: 200 });
    }

    const txnId = eventData.data.id;

    // Fetch transaction record from Supabase
    const { data: txnRecord, error } = await supabase
      .from("paddle_transactions")
      .select("*")
      .eq("txn_id", txnId)
      .single();

    if (error || !txnRecord) {
      console.error("Transaction not found in DB:", txnId, error);
      return new Response("Transaction not found", { status: 404 });
    }

    // Calculate credits based on amount
    const creditsToAdd =
      txnRecord.amount === 29
        ? 10
        : txnRecord.amount === 59
        ? 25
        : txnRecord.amount === 99
        ? 50
        : 0;

    // Update user's credits
     const { error: updateError } = await supabase.rpc("increment_credits", {
      uid: txnRecord.user_id,
      increment: creditsToAdd,
    });

    if (updateError) {
      console.error("Failed to update user credits:", updateError);
      return new Response("Failed to update credits", { status: 500 });
    }

    console.log(`✅ Transaction ${txnId} completed. Added ${creditsToAdd} credits to user ${txnRecord.user_id}`);

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }
}

