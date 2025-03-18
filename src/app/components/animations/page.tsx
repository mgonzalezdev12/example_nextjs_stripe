import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import ComponentSidebar from "@/components/component-sidebar";
import ComponentCard from "@/components/component-card";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export default async function AnimationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sample Animations components
  const components = [
    {
      id: 6,
      title: "Animated Loader",
      image:
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
      framework: "React",
      category: "Animations",
      isPremium: true,
    },
    {
      id: 11,
      title: "Fade Transition",
      image:
        "https://images.unsplash.com/photo-1579403124614-197f69d8187b?w=400&q=80",
      framework: "SwiftUI",
      category: "Animations",
      isPremium: false,
    },
    {
      id: 12,
      title: "Parallax Scroll",
      image:
        "https://images.unsplash.com/photo-1550645612-83f5d594b671?w=400&q=80",
      framework: "React",
      category: "Animations",
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
          <span className="font-medium">Animations</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <ComponentSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Animations</h1>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search animations..."
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
