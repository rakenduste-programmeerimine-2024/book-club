import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // When the user is not logged in
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <a href="/sign-in">Sign in</a>
        </Button>
        <Button asChild size="sm" variant="default">
          <a href="/sign-up">Sign up</a>
        </Button>
      </div>
    );
  }

  // When the user is logged in
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu.Root>
        {/* Trigger: Profile Icon */}
        <DropdownMenu.Trigger asChild>
          <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </button>
        </DropdownMenu.Trigger>

        {/* Dropdown Content */}
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white shadow-md rounded-md p-2 w-48"
            align="end"
            sideOffset={5}
          >
            {/* Logout Option */}
            <form action="/api/auth/logout" method="POST">
              <DropdownMenu.Item
                asChild
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded text-sm"
              >
                <Button type="submit" size="sm" variant="outline">
                  Sign out
                </Button>
              </DropdownMenu.Item>
            </form>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
