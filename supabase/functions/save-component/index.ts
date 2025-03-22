import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse request body
    const { componentId } = await req.json();

    if (!componentId) {
      throw new Error("Component ID is required");
    }

    // Check if component exists
    const { data: component, error: componentError } = await supabaseClient
      .from("components")
      .select("*")
      .eq("id", componentId)
      .single();

    if (componentError || !component) {
      throw new Error("Component not found");
    }

    // Check if user already saved this component
    const { data: existingSave } = await supabaseClient
      .from("user_components")
      .select("*")
      .eq("user_id", user.id)
      .eq("component_id", componentId)
      .single();

    if (existingSave) {
      // If already saved, remove it
      const { error: deleteError } = await supabaseClient
        .from("user_components")
        .delete()
        .eq("user_id", user.id)
        .eq("component_id", componentId);

      if (deleteError) throw deleteError;

      return new Response(
        JSON.stringify({
          message: "Component removed from saved items",
          saved: false,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    } else {
      // If not saved, add it
      const { error: insertError } = await supabaseClient
        .from("user_components")
        .insert({
          user_id: user.id,
          component_id: componentId,
        });

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({
          message: "Component saved successfully",
          saved: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
