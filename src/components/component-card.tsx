"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "../../supabase/supabase";

interface Component {
  id: number;
  title: string;
  image: string;
  framework: string;
  category: string;
  isPremium: boolean;
}

export default function ComponentCard({
  component,
  user,
}: {
  component: Component;
  user: User | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    // In a real app, this would copy the actual component code
    // For now, we'll just simulate the copy action
    navigator.clipboard.writeText(`// ${component.title} component code`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePremiumAccess = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=components";
      return;
    }

    // Check if user has subscription
    // If not, redirect to pricing page
    window.location.href = "/pricing";
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
          {component.isPremium && !user ? (
            <Button
              onClick={handlePremiumAccess}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Unlock Pro
            </Button>
          ) : (
            <button
              onClick={handleCopyCode}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
            >
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copied!" : "Copy code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
