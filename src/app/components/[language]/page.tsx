import { createClient } from "@/supabase/server";
import ComponentSidebar from "@/components/component-sidebar";
import ComponentCard from "@/components/component-card";
import { notFound } from "next/navigation";

export default async function ComponentsByLanguagePage({
  params,
}: {
  params: { language: string };
}) {
  const supabase = await createClient();
  const language = decodeURIComponent(params.language);

  // Get user to check subscription status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch components by language
  const { data: components, error } = await supabase.functions.invoke(
    "supabase-functions-get-components",
    {
      body: { languageType: language },
    },
  );

  if (error || !components?.data || components.data.length === 0) {
    return notFound();
  }

  // Fetch user's saved components if logged in
  let savedComponentIds: string[] = [];
  if (user) {
    const { data: savedComponents } = await supabase
      .from("user_components")
      .select("component_id")
      .eq("user_id", user.id);

    if (savedComponents) {
      savedComponentIds = savedComponents.map((item) => item.component_id);
    }
  }

  // Fetch user profile to check subscription status
  let hasActiveSubscription = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_expires_at")
      .eq("id", user.id)
      .single();

    hasActiveSubscription =
      !!profile?.subscription_tier &&
      !!profile?.subscription_expires_at &&
      new Date(profile.subscription_expires_at) > new Date();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ComponentSidebar activeLanguage={language} />
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {language} Components
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse and discover {language} components for your projects
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {components.data.map((component: any) => (
            <ComponentCard
              key={component.id}
              component={component}
              isSaved={savedComponentIds.includes(component.id)}
              hasActiveSubscription={hasActiveSubscription}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
