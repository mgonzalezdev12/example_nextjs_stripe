import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Code,
  Palette,
  Copy,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  // Sample featured components
  const featuredComponents = [
    {
      id: 1,
      title: "Gradient Button",
      image:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      framework: "React",
      category: "UI Elements",
      isPremium: false,
    },
    {
      id: 2,
      title: "Card Carousel",
      image:
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80",
      framework: "React",
      category: "UI Elements",
      isPremium: true,
    },
    {
      id: 3,
      title: "Login Form",
      image:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80",
      framework: "SwiftUI",
      category: "Forms",
      isPremium: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Browse Component Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover high-quality components for your next project, organized
              by category.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Palette className="w-6 h-6" />,
                title: "UI Elements",
                description: "Buttons, cards, modals and more",
                link: "/components/ui-elements",
              },
              {
                icon: <Code className="w-6 h-6" />,
                title: "Forms",
                description: "Input fields, validation, and submission",
                link: "/components/forms",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Navigation",
                description: "Menus, tabs, and navigation bars",
                link: "/components/navigation",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Animations",
                description: "Transitions, loaders, and effects",
                link: "/components/animations",
              },
            ].map((category, index) => (
              <Link href={category.link} key={index}>
                <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full cursor-pointer">
                  <div className="text-blue-600 mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Components */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Components</h2>
            <Link
              href="/components"
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              View all components
              <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredComponents.map((component) => (
              <div
                key={component.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={component.image}
                    alt={component.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105"
                  />
                  {component.isPremium && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                      PRO
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{component.title}</h3>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {component.framework}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {component.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/components/${component.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View details
                    </Link>
                    <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                      <Copy className="w-4 h-4 mr-1" />
                      Copy code
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Components</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-blue-100">Frameworks</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-blue-100">Happy Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Search our entire library of components by name, framework, or
            category.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search components..."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Supercharge Your Development?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get access to our entire library of premium components and save
            countless hours of development time.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
