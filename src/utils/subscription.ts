import { createClient } from "@/supabase/client";

export type PlanType = "Code Plan" | "Web Plan" | "Premium Plan";

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface AccessPermission {
  resource_type: string;
  can_access: boolean;
}

/**
 * Check if a user has access to a specific resource type
 */
export async function checkResourceAccess(
  userId: string,
  resourceType: string,
): Promise<boolean> {
  if (!userId) return false;

  const supabase = createClient();

  // Get the user's active subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (subscriptionError || !subscription) return false;

  // Check if the plan has access to the requested resource
  const { data: permission, error: permissionError } = await supabase
    .from("access_permissions")
    .select("can_access")
    .eq("plan_id", subscription.plan_id)
    .eq("resource_type", resourceType)
    .single();

  if (permissionError || !permission) return false;

  return permission.can_access;
}

/**
 * Get all permissions for a user's active subscription
 */
export async function getUserPermissions(
  userId: string,
): Promise<AccessPermission[]> {
  if (!userId) return [];

  const supabase = createClient();

  // Get the user's active subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (subscriptionError || !subscription) return [];

  // Get all permissions for the plan
  const { data: permissions, error: permissionsError } = await supabase
    .from("access_permissions")
    .select("resource_type, can_access")
    .eq("plan_id", subscription.plan_id);

  if (permissionsError || !permissions) return [];

  return permissions;
}

/**
 * Get the user's current active plan
 */
export async function getUserActivePlan(userId: string): Promise<Plan | null> {
  if (!userId) return null;

  const supabase = createClient();

  // Get the user's active subscription with plan details
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      plan_id,
      plans:plan_id (
        id,
        name,
        price,
        description,
        features
      )
    `,
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error || !data || !data.plans) return null;

  return data.plans as Plan;
}
