"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { checkResourceAccess } from "@/utils/subscription";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AccessGuardProps {
  resourceType: string;
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function AccessGuard({
  resourceType,
  children,
  fallbackMessage = "You need to upgrade your plan to access this content.",
}: AccessGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      // Check if user has access to this resource
      const canAccess = await checkResourceAccess(user.id, resourceType);
      setHasAccess(canAccess);
      setIsLoading(false);
    };

    checkAccess();
  }, [resourceType]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 mb-4">{fallbackMessage}</p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="default">
              <Link href="/pricing">View Plans</Link>
            </Button>
            {userId && (
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
