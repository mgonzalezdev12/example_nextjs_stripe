import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import ComponentSidebar from "@/components/component-sidebar";
import ComponentCard from "@/components/component-card";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export default async function FormsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sample Forms components
  const components = [
    {
      id: 3,
      title: "Login Form",
      image:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80",
      framework: "SwiftUI",
      category: "Forms",
      isPremium: false,
    },
    {
      id: 7,
      title: "Contact Form",
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
      framework: "React",
      category: "Forms",
      isPremium: true,
    },
    {
      id: 8,
      title: "Multi-step Form",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
      framework: "React",
      category: "Forms",
      isPremium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link
            href="/components"
            className="text-blue-600 hover:text-blue-700 mr-2"
          >
            Components
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="font-medium">Forms</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <ComponentSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Forms</h1>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search forms..."
                />
              </div>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Components Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  user={user}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
