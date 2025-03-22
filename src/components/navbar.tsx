import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Code, Search, UserCircle, Zap } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-black bg-black py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white">
        <Zap className="w-6 h-6 text-green-600" />
        BizViewCode
      </Link>

          <div className="hidden md:flex space-x-6">
            <Link
              href="/components"
              className="text-gray-600 hover:text-gray-900"
            >
              Browse Components
            </Link>
            <Link
              href="/frameworks/react"
              className="text-gray-600 hover:text-gray-900"
            >
              React
            </Link>
            <Link
              href="/frameworks/swiftui"
              className="text-gray-600 hover:text-gray-900"
            >
              SwiftUI
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Link
            href="/components"
            className="text-gray-600 hover:text-gray-900 md:hidden"
          >
            <Search className="w-5 h-5" />
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
