import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const githubToken = Deno.env.get("GITHUB_TOKEN");

    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: "GitHub token not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const { action, data } = await req.json();

    // Create a new GitHub repository
    if (action === "create_repo") {
      const { name, description = "", isPrivate = true } = data;

      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: true,
        }),
      });

      const repo = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: "Failed to create repository",
            details: repo,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: response.status,
          },
        );
      }

      // Store repository in database
      const { data: repoData, error } = await supabase
        .from("github_repositories")
        .insert({
          repo_name: repo.name,
          repo_owner: repo.owner.login,
          repo_url: repo.html_url,
          is_private: repo.private,
          github_repo_id: repo.id.toString(),
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to store repository data",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true, repository: repoData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Add collaborator to a repository
    else if (action === "add_collaborator") {
      const { repoId, email, permission = "push" } = data;

      // Get repository details from database
      const { data: repoData, error: repoError } = await supabase
        .from("github_repositories")
        .select("*")
        .eq("id", repoId)
        .single();

      if (repoError || !repoData) {
        return new Response(
          JSON.stringify({ error: "Repository not found", details: repoError }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          },
        );
      }

      // Add collaborator to GitHub
      const response = await fetch(
        `https://api.github.com/repos/${repoData.repo_owner}/${repoData.repo_name}/collaborators/${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permission: permission,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        return new Response(
          JSON.stringify({
            error: "Failed to add collaborator",
            details: errorData,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: response.status,
          },
        );
      }

      // Store collaborator in database
      const { data: collabData, error: collabError } = await supabase
        .from("github_collaborators")
        .insert({
          repository_id: repoId,
          email: email,
          permission_level: permission,
        })
        .select()
        .single();

      if (collabError) {
        return new Response(
          JSON.stringify({
            error: "Failed to store collaborator data",
            details: collabError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true, collaborator: collabData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // List repositories
    else if (action === "list_repos") {
      const { data: repos, error } = await supabase
        .from("github_repositories")
        .select("*");

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to fetch repositories",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true, repositories: repos }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // List collaborators for a repository
    else if (action === "list_collaborators") {
      const { repoId } = data;

      const { data: collaborators, error } = await supabase
        .from("github_collaborators")
        .select("*")
        .eq("repository_id", repoId);

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to fetch collaborators",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true, collaborators: collaborators }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
