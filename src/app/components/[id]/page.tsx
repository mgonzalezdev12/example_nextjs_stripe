import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { ArrowLeft, Check, Download, FileCode, Palette, GitBranch } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeCopyButton from "@/components/code-copy-button";

export default async function ComponentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Redirect to the new route structure
  return redirect(`/components/react/${params.id}`);
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
    htmlCode: `<button class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
  Click Me
</button>`,
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
      \${className}\`}
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
    phpCode: `<?php
function renderGradientButton($text = "Click Me", $additionalClasses = "") {
    $classes = "px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 " .
               "text-white font-medium rounded-lg hover:opacity-90 transition-opacity " .
               "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 " .
               $additionalClasses;
    
    return "<button class=\"$classes\">$text</button>";
}
?>`,
  };

  // Check user's subscription plan
  let userPlan = "free";
  
  if (user) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_id, plans:plan_id(name)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();
    
    if (subscription?.plans) {
      const planName = (subscription.plans as any).name;
      if (planName === "Code Plan") userPlan = "code";
      else if (planName === "Web Plan") userPlan = "web";
      else if (planName === "Premium Plan") userPlan = "premium";
    }
  }
  
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
                {component.isPremium && userPlan === "free" && (
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Upgrade to Access
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Code Tabs */}
            <Tabs defaultValue="html" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="swiftui">SwiftUI</TabsTrigger>
                <TabsTrigger value="design">Design Files</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="usage">Usage Guide</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="relative">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>{component.htmlCode}</code>
                  </pre>
                </div>
                <CodeCopyButton code={component.htmlCode} />
              </TabsContent>

              <TabsContent value="react" className="relative">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>
                      {(userPlan === "code" || userPlan === "web" || userPlan === "premium")
                        ? component.reactCode
                        : component.reactCode
                            .split("\n")
                            .slice(0, 8)
                            .join("\n") +
                          "\n\n// Upgrade to Code Plan or higher to access the full code"}
                    </code>
                  </pre>
                </div>
                {(userPlan === "code" || userPlan === "web" || userPlan === "premium") && 
                  <CodeCopyButton code={component.reactCode} />
                }
              </TabsContent>

              <TabsContent value="swiftui" className="relative">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>
                      {(userPlan === "code" || userPlan === "web" || userPlan === "premium")
                        ? component.swiftUICode
                        : component.swiftUICode
                            .split("\n")
                            .slice(0, 8)
                            .join("\n") +
                          "\n\n// Upgrade to Code Plan or higher to access the full code"}
                    </code>
                  </pre>
                </div>
                {(userPlan === "code" || userPlan === "web" || userPlan === "premium") && 
                  <CodeCopyButton code={component.swiftUICode} />
                }
              </TabsContent>
              
              <TabsContent value="php" className="relative">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>
                      {(userPlan === "web" || userPlan === "premium")
                        ? component.phpCode
                        : "// Upgrade to Web Plan or higher to access PHP code"}
                    </code>
                  </pre>
                </div>
                {(userPlan === "web" || userPlan === "premium") && 
                  <CodeCopyButton code={component.phpCode} />
                }
              </TabsContent>
              
              <TabsContent value="design" className="mt-4">
                {(userPlan === "code" || userPlan === "web" || userPlan === "premium") ? (
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Design Assets</h3>
                      <Button className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <Palette className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium">Figma Design File</p>
                            <p className="text-sm text-gray-500">Complete UI design with components</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="w-3 h-3" /> Download
                        </Button>
                      </div>
                      <div className="border rounded-md p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileCode className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <p className="font-medium">Sketch Source File</p>
                            <p className="text-sm text-gray-500">Original design assets</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="w-3 h-3" /> Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-4">Design Files Access</h3>
                    <p className="text-gray-600 mb-4">Upgrade to Code Plan or higher to access design files</p>
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="github" className="mt-4">
                {(userPlan === "web" || userPlan === "premium") ? (
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">GitHub Repository</h3>
                      <Button className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Clone Repository
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4 mb-4">
                      <p className="font-mono text-sm">git clone https://github.com/component-marketplace/gradient-button.git</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Repository Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Branch:</span>
                            <span>main</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Last Updated:</span>
                            <span>2 days ago</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Stars:</span>
                            <span>24</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Forks:</span>
                            <span>8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-4">GitHub Repository Access</h3>
                    <p className="text-gray-600 mb-4">Upgrade to Web Plan or higher to access GitHub repositories</p>
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="usage" className="mt-4">
                {userPlan === "premium" ? (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Usage Guide</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium mb-2">Installation</h4>
                        <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                          <pre className="text-gray-300 font-mono text-sm">
                            <code>npm install @component-marketplace/gradient-button</code>
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium mb-2">Basic Usage</h4>
                        <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto relative">
                          <pre className="text-gray-300 font-mono text-sm">
                            <code>{`import { GradientButton } from '@component-marketplace/gradient-button';

function MyComponent() {
  return (
    <GradientButton 
      text="Sign Up" 
      onClick={() => console.log('Button clicked!')} 
    />
  );
}`}</code>
                          </pre>
                          <CodeCopyButton code={`import { GradientButton } from '@component-marketplace/gradient-button';

function MyComponent() {
  return (
    <GradientButton 
      text="Sign Up" 
      onClick={() => console.log('Button clicked!')} 
    />
  );
}`} />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium mb-2">Props Reference</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">text</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Click Me"</td>
                                <td className="px-6 py-4 text-sm text-gray-500">The text to display on the button</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">onClick</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">() => {}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">Function called when the button is clicked</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">className</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                                <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-4">Usage Guide Access</h3>
                    <p className="text-gray-600 mb-4">Upgrade to Premium Plan to access detailed usage guides</p>
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
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
