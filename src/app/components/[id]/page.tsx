import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Copy, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ComponentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // In a real app, you would fetch the component data from your database
  // For now, we'll use a sample component
  const component = {
    id: parseInt(params.id),
    title: "Gradient Button",
    description:
      "A beautiful gradient button with hover effects and customizable colors. Perfect for call-to-action elements in your UI.",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    framework: "React",
    category: "UI Elements",
    isPremium: params.id === "2" || params.id === "4" || params.id === "6",
    author: "Component Marketplace Team",
    dateAdded: "2023-09-15",
    downloads: 1250,
    reactCode: `import React from 'react';

export const GradientButton = ({ 
  text = "Click Me", 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={\`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
      text-white font-medium rounded-lg hover:opacity-90 transition-opacity 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
      ${className}\`}
    >
      {text}
    </button>
  );
};

export default GradientButton;`,
    swiftUICode: `import SwiftUI

struct GradientButton: View {
    var text: String = "Click Me"
    var action: () -> Void = {}
    
    var body: some View {
        Button(action: action) {
            Text(text)
                .fontWeight(.medium)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.blue, Color.purple]),
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(8)
        }
    }
}

struct GradientButton_Previews: PreviewProvider {
    static var previews: some View {
        GradientButton(text: "Sign Up", action: {})
            .padding()
            .previewLayout(.sizeThatFits)
    }
}`,
  };

  const hasAccess = !component.isPremium || user !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/components"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to components
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Component Header */}
          <div className="relative h-64 w-full">
            <Image
              src={component.image}
              alt={component.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {component.isPremium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-3 py-1.5 rounded-md">
                PRO
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{component.title}</h1>
                <div className="flex space-x-2 mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {component.framework}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {component.category}
                  </span>
                </div>
                <p className="text-gray-600">{component.description}</p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                <div className="text-sm text-gray-600 mb-2">
                  Added on {component.dateAdded}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {component.downloads} downloads
                </div>
                {!hasAccess && (
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Code Tabs */}
            <Tabs defaultValue="react" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="swiftui">SwiftUI</TabsTrigger>
              </TabsList>

              <TabsContent value="react" className="relative">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>
                      {hasAccess
                        ? component.reactCode
                        : component.reactCode
                            .split("\n")
                            .slice(0, 8)
                            .join("\n") +
                          "\n\n// Upgrade to Pro to access the full code"}
                    </code>
                  </pre>
                </div>
                {hasAccess && (
                  <button
                    className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-md"
                    onClick={() =>
                      navigator.clipboard.writeText(component.reactCode)
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </TabsContent>

              <TabsContent value="swiftui" className="relative">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>
                      {hasAccess
                        ? component.swiftUICode
                        : component.swiftUICode
                            .split("\n")
                            .slice(0, 8)
                            .join("\n") +
                          "\n\n// Upgrade to Pro to access the full code"}
                    </code>
                  </pre>
                </div>
                {hasAccess && (
                  <button
                    className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-md"
                    onClick={() =>
                      navigator.clipboard.writeText(component.swiftUICode)
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </TabsContent>
            </Tabs>

            {/* Features */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <ul className="space-y-2">
                {[
                  "Customizable gradient colors",
                  "Responsive design",
                  "Accessible with keyboard navigation",
                  "Smooth hover animations",
                  "Easy to integrate",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
