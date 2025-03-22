import { createClient } from "@/supabase/server";
import AccessGuard from "@/components/access-guard";
import DashboardNavbar from "@/components/dashboard-navbar";
import ComponentCard from "@/components/component-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

export default async function DashboardComponentsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's saved components
  const { data: savedComponentIds } = await supabase
    .from("user_components")
    .select("component_id")
    .eq("user_id", user.id);

  // Fetch all saved components
  let savedComponents: any[] = [];
  if (savedComponentIds && savedComponentIds.length > 0) {
    const ids = savedComponentIds.map((item) => item.component_id);
    const { data } = await supabase
      .from("components")
      .select("*")
      .in("id", ids);

    if (data) {
      savedComponents = data;
    }
  }

  // Fetch user profile to check subscription status
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_expires_at")
    .eq("id", user.id)
    .single();

  const hasActiveSubscription =
    !!profile?.subscription_tier &&
    !!profile?.subscription_expires_at &&
    new Date(profile.subscription_expires_at) > new Date();

  // Group components by language
  const componentsByLanguage: Record<string, any[]> = {};
  savedComponents.forEach((component) => {
    const language = component.language_type || "Other";
    if (!componentsByLanguage[language]) {
      componentsByLanguage[language] = [];
    }
    componentsByLanguage[language].push(component);
  });

  const languages = Object.keys(componentsByLanguage).sort();

  return (
    <AccessGuard>
      <DashboardNavbar />
      <div className="container mx-auto max-w-7xl py-8">
        <h1 className="mb-6 text-3xl font-bold">My Components</h1>

        {savedComponents.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No saved components</h3>
            <p className="mt-2 text-muted-foreground">
              You haven't saved any components yet. Browse the marketplace to
              find components you like.
            </p>
          </div>
        ) : (
          <Tabs defaultValue={languages[0] || "all"} className="w-full">
            <TabsList className="mb-6">
              {languages.map((language) => (
                <TabsTrigger key={language} value={language}>
                  {language}
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((language) => (
              <TabsContent key={language} value={language} className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {componentsByLanguage[language].map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      isSaved={true}
                      hasActiveSubscription={hasActiveSubscription}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AccessGuard>
  );
}
