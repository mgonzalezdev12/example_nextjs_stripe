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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/supabase/client";
import { ArrowLeft, Mail, Plus, Trash } from "lucide-react";
import Link from "next/link";

export default function CollaboratorsPage({
  params,
}: {
  params: { id: string };
}) {
  const [repository, setRepository] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [permission, setPermission] = useState("push");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchRepositoryDetails();
    fetchCollaborators();
  }, []);

  async function fetchRepositoryDetails() {
    try {
      const { data: repos, error } = await supabase
        .from("github_repositories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setRepository(repos);
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError("Failed to load repository details");
    }
  }

  async function fetchCollaborators() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-github-integration",
        {
          body: {
            action: "list_collaborators",
            data: { repoId: params.id },
          },
        },
      );

      if (data?.success && data.collaborators) {
        setCollaborators(data.collaborators);
      } else {
        setError("Failed to fetch collaborators");
      }
    } catch (err) {
      setError("An error occurred while fetching collaborators");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addCollaborator() {
    if (!newEmail) {
      setError("Email address is required");
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
            action: "add_collaborator",
            data: {
              repoId: params.id,
              email: newEmail,
              permission: permission,
            },
          },
        },
      );

      if (data?.success && data.collaborator) {
        setSuccess(`Collaborator "${newEmail}" added successfully`);
        setNewEmail("");
        await fetchCollaborators();
      } else {
        setError(error?.message || data?.error || "Failed to add collaborator");
      }
    } catch (err) {
      setError("An error occurred while adding the collaborator");
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
            <Link
              href="/dashboard/github"
              className="flex items-center text-primary hover:underline mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Repositories
            </Link>
            <h1 className="text-3xl font-bold">
              {repository ? repository.repo_name : "Repository"} Collaborators
            </h1>
            <p className="text-muted-foreground">
              Manage collaborators for this repository
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

          {/* Add Collaborator Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add Collaborator</CardTitle>
              <CardDescription>
                Add a collaborator to your repository by email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="collaborator@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="permission" className="text-sm font-medium">
                    Permission Level
                  </label>
                  <Select value={permission} onValueChange={setPermission}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pull">Read (pull)</SelectItem>
                      <SelectItem value="push">Write (push)</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addCollaborator} disabled={loading || !newEmail}>
                <Plus className="mr-2 h-4 w-4" /> Add Collaborator
              </Button>
            </CardFooter>
          </Card>

          {/* Collaborators List */}
          <h2 className="text-2xl font-semibold mb-4">Current Collaborators</h2>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : collaborators.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {collaborators.map((collab) => (
                <Card key={collab.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{collab.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Permission: {collab.permission_level}
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash className="mr-2 h-4 w-4" /> Remove
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
                  You haven't added any collaborators yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
