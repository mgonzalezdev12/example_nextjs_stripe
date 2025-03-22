import { createClient } from "@/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeCopyButton from "@/components/code-copy-button";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SubscriptionCheck from "@/components/subscription-check";

export default async function ComponentDetailPage({
  params,
}: {
  params: { id: string; language: string };
}) {
  const supabase = await createClient();

  // Get user to check subscription status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch component details
  const { data: component, error } = await supabase
    .from("components")
    .select("*")
    .eq("id", params.id)
    .eq("language_type", decodeURIComponent(params.language))
    .single();

  if (error || !component) {
    return notFound();
  }

  // Check if component is premium and user has active subscription
  if (component.is_premium) {
    if (!user) {
      return redirect("/sign-in");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_expires_at")
      .eq("id", user.id)
      .single();

    const hasActiveSubscription =
      !!profile?.subscription_tier &&
      !!profile?.subscription_expires_at &&
      new Date(profile.subscription_expires_at) > new Date();

    if (!hasActiveSubscription) {
      return redirect("/pricing");
    }
  }

  // Check if user has saved this component
  let isSaved = false;
  if (user) {
    const { data: savedComponent } = await supabase
      .from("user_components")
      .select("*")
      .eq("user_id", user.id)
      .eq("component_id", component.id)
      .single();

    isSaved = !!savedComponent;
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href={`/components/${params.language}`}
            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to {decodeURIComponent(params.language)} Components
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {component.name}
          </h1>
          <p className="mt-2 text-muted-foreground">{component.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {component.git_repo_url && (
            <Button asChild variant="outline">
              <Link href={component.git_repo_url} target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Clone Repository
              </Link>
            </Button>
          )}

          {user && (
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.functions.invoke(
                  "supabase-functions-save-component",
                  {
                    body: { componentId: component.id },
                  },
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {isSaved ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                      <code>{component.code || "No code available"}</code>
                    </pre>
                    {component.code && (
                      <div className="absolute right-2 top-2">
                        <CodeCopyButton code={component.code} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <div className="prose max-w-none dark:prose-invert">
                    {component.installation_guide ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: component.installation_guide,
                        }}
                      />
                    ) : (
                      <p>No installation guide available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <div className="prose max-w-none dark:prose-invert">
                    {component.documentation ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: component.documentation,
                        }}
                      />
                    ) : (
                      <p>No documentation available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Preview</h3>
              {component.preview_image_url ? (
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={component.preview_image_url}
                    alt={component.name}
                    width={400}
                    height={300}
                    className="w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-md bg-muted">
                  <p className="text-muted-foreground">No preview available</p>
                </div>
              )}

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Component Details</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{component.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Language</dt>
                    <dd className="font-medium">{component.language_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${component.is_premium ? "bg-primary/10 text-primary" : "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"}`}
                      >
                        {component.is_premium ? "Premium" : "Free"}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {component.is_premium && (
                <div className="mt-6">
                  <SubscriptionCheck>
                    <p className="text-sm text-muted-foreground">
                      You have access to this premium component with your
                      current subscription.
                    </p>
                  </SubscriptionCheck>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
