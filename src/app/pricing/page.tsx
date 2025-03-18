import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Check } from "lucide-react";

export default async function Pricing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  // Features for each plan
  const planFeatures = {
    "Code Plan": [
      "Access to all SwiftUI components",
      "Component code snippets",
      "Documentation access",
      "Regular updates",
      "Community support",
    ],
    "Web Plan": [
      "Access to all React components",
      "Component code snippets",
      "Documentation access",
      "Regular updates",
      "Community support",
    ],
    "Premium Plan": [
      "Access to ALL components (React & SwiftUI)",
      "Priority support",
      "Early access to new components",
      "Custom component requests",
      "Team collaboration features",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Get access to premium
            components and accelerate your development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((item: any, index: number) => {
            const planName =
              index === 0
                ? "Code Plan"
                : index === 1
                  ? "Web Plan"
                  : "Premium Plan";
            const features =
              planFeatures[planName as keyof typeof planFeatures] || [];

            return (
              <div key={item.id} className="flex flex-col h-full">
                <PricingCard item={item} user={user} />

                {/* Features list */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 flex-grow">
                  <h3 className="font-semibold text-lg mb-4">
                    What's included:
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee if you're not satisfied
                with our service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                How often are new components added?
              </h3>
              <p className="text-gray-600">
                We add new components every week, and premium subscribers get
                early access to all new additions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                Can I use the components in commercial projects?
              </h3>
              <p className="text-gray-600">
                Yes, all our components come with a commercial license that
                allows you to use them in your client projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
