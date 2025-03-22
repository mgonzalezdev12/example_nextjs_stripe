import { createClient } from "@/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AccessGuard from "@/components/access-guard";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user's saved components count
  const { count: savedComponentsCount } = await supabase
    .from("user_components")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Fetch user's projects count
  const { count: projectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <AccessGuard>
      <DashboardNavbar />
      <div className="container mx-auto max-w-4xl py-8">
        <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile?.full_name || user.email || ""}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-semibold text-primary">
                      {profile?.full_name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">
                    {profile?.full_name || "User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p>{profile?.username || "Not set"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Website
                  </p>
                  <p>{profile?.website || "Not set"}</p>
                </div>

                <Button asChild variant="outline" className="mt-4">
                  <Link href="/dashboard/reset-password">Change Password</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Subscription Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Plan
                  </p>
                  <p className="font-medium">
                    {profile?.subscription_tier ? (
                      <span className="text-primary">
                        {profile.subscription_tier}
                      </span>
                    ) : (
                      <span>Free Plan</span>
                    )}
                  </p>
                </div>

                {profile?.subscription_expires_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Expires On
                    </p>
                    <p>
                      {format(
                        new Date(profile.subscription_expires_at),
                        "MMMM d, yyyy",
                      )}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer ID
                  </p>
                  <p className="font-mono text-xs">
                    {profile?.stripe_customer_id || "Not available"}
                  </p>
                </div>

                <Button asChild className="mt-4 w-full">
                  <Link href="/pricing">
                    {profile?.subscription_tier
                      ? "Manage Subscription"
                      : "Upgrade Plan"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Activity Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Saved Components
                  </p>
                  <p className="text-2xl font-bold">
                    {savedComponentsCount || 0}
                  </p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-1 h-auto p-0 text-sm"
                  >
                    <Link href="/dashboard/components">View Components</Link>
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Projects
                  </p>
                  <p className="text-2xl font-bold">{projectsCount || 0}</p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-1 h-auto p-0 text-sm"
                  >
                    <Link href="/dashboard/projects">View Projects</Link>
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Created
                  </p>
                  <p>
                    {profile?.created_at
                      ? format(new Date(profile.created_at), "MMMM d, yyyy")
                      : "Not available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccessGuard>
  );
}
