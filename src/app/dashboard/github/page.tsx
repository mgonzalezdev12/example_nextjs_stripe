"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/supabase/client";
import { GitBranch, Plus, Users } from "lucide-react";
import Link from "next/link";

export default function GitHubManagementPage() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchRepositories();
  }, []);

  async function fetchRepositories() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-github-integration",
        {
          body: {
            action: "list_repos",
          },
        },
      );

      if (data?.success && data.repositories) {
        setRepositories(data.repositories);
      } else {
        setError("Failed to fetch repositories");
      }
    } catch (err) {
      setError("An error occurred while fetching repositories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createRepository() {
    if (!newRepoName) {
      setError("Repository name is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-github-integration",
        {
          body: {
            action: "create_repo",
            data: {
              name: newRepoName,
              description: newRepoDescription,
              isPrivate: true,
            },
          },
        },
      );

      if (data?.success && data.repository) {
        setSuccess(`Repository "${newRepoName}" created successfully`);
        setNewRepoName("");
        setNewRepoDescription("");
        await fetchRepositories();
      } else {
        setError(
          error?.message || data?.error || "Failed to create repository",
        );
      }
    } catch (err) {
      setError("An error occurred while creating the repository");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">GitHub Repository Management</h1>
            <p className="text-muted-foreground">
              Manage your private GitHub repositories and collaborators
            </p>
          </header>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <Tabs defaultValue="repositories">
            <TabsList className="mb-4">
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
              <TabsTrigger value="create">Create Repository</TabsTrigger>
            </TabsList>

            <TabsContent value="repositories">
              <h2 className="text-2xl font-semibold mb-4">Your Repositories</h2>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : repositories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repositories.map((repo) => (
                    <Card key={repo.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <GitBranch className="mr-2 h-5 w-5" />
                          {repo.repo_name}
                        </CardTitle>
                        <CardDescription>
                          {repo.description || "No description"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" asChild>
                            <Link
                              href={`/dashboard/github/collaborators/${repo.id}`}
                              className="flex items-center"
                            >
                              <Users className="mr-2 h-4 w-4" /> Manage
                              Collaborators
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <a
                              href={repo.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on GitHub
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      You don't have any repositories yet. Create one to get
                      started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Repository</CardTitle>
                  <CardDescription>
                    Create a new private GitHub repository for your components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="repoName" className="text-sm font-medium">
                        Repository Name
                      </label>
                      <Input
                        id="repoName"
                        value={newRepoName}
                        onChange={(e) => setNewRepoName(e.target.value)}
                        placeholder="my-component-library"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description (Optional)
                      </label>
                      <Input
                        id="description"
                        value={newRepoDescription}
                        onChange={(e) => setNewRepoDescription(e.target.value)}
                        placeholder="A collection of my custom components"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createRepository}
                    disabled={loading || !newRepoName}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Repository
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
