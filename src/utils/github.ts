import { createClient } from "@/supabase/client";

/**
 * Creates a new GitHub repository for a component
 */
export async function createRepository(name: string, description: string = "") {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke(
    "supabase-functions-github-integration",
    {
      body: {
        action: "create_repo",
        data: {
          name,
          description,
          isPrivate: true,
        },
      },
    },
  );

  if (error) {
    throw new Error(`Failed to create repository: ${error.message}`);
  }

  return data?.repository;
}

/**
 * Adds a collaborator to a GitHub repository
 */
export async function addCollaborator(
  repoId: string,
  email: string,
  permission: "pull" | "push" | "admin" = "push",
) {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke(
    "supabase-functions-github-integration",
    {
      body: {
        action: "add_collaborator",
        data: {
          repoId,
          email,
          permission,
        },
      },
    },
  );

  if (error) {
    throw new Error(`Failed to add collaborator: ${error.message}`);
  }

  return data?.collaborator;
}

/**
 * Lists all GitHub repositories
 */
export async function listRepositories() {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke(
    "supabase-functions-github-integration",
    {
      body: {
        action: "list_repos",
      },
    },
  );

  if (error) {
    throw new Error(`Failed to list repositories: ${error.message}`);
  }

  return data?.repositories || [];
}

/**
 * Lists all collaborators for a repository
 */
export async function listCollaborators(repoId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke(
    "supabase-functions-github-integration",
    {
      body: {
        action: "list_collaborators",
        data: {
          repoId,
        },
      },
    },
  );

  if (error) {
    throw new Error(`Failed to list collaborators: ${error.message}`);
  }

  return data?.collaborators || [];
}

/**
 * Links a component to a GitHub repository
 */
export async function linkComponentToRepository(
  componentId: string,
  repoId: string,
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("components")
    .update({ github_repo_id: repoId })
    .eq("id", componentId);

  if (error) {
    throw new Error(`Failed to link component to repository: ${error.message}`);
  }

  return true;
}
