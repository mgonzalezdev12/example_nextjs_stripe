import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, stripeSubscriptionId, status } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Call the Supabase Edge Function to update the subscription
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-update-subscription",
      {
        body: {
          userId: user.id,
          planId,
          stripeSubscriptionId,
          status,
        },
      },
    );

    if (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in update-subscription route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
