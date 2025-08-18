import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN, {
  environment: Environment.sandbox,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY // Use service role key on server
);

export async function POST(req) {
  try {
    // Read JSON body from client
    const {
      Packname,
      orderAmount,
      currencyCode = "USD",
      userId,
      credits,
    } = await req.json();

    // Create Paddle transaction dynamically
    const txn = await paddle.transactions.create({
      items: [
        {
          quantity: 1,
          price: {
            name: Packname,
            description: `${credits} Credits`,
            unitPrice: {
              currencyCode: currencyCode, // dynamic currency
              amount: String(orderAmount * 100), // amount in cents
            },
            product: {
              name: Packname,
              description: `${credits} credits`,
              taxCategory: "saas",
            },
          },
        },
      ],
      metadata: { userId, credits },
    });
    const { data, error } = await supabase.from("paddle_transactions").insert({
      user_id: userId,
      txn_id: txn.id,
      amount: orderAmount,
      credits: credits,
      status: "pending",
    });

    if (error) {
      console.error("Supabase insert error:", error);
    } else {
      console.log("Transaction inserted:", data);
    }

    return NextResponse.json({ txn: txn.id });
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
