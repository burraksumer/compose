import { createFileRoute, redirect } from "@tanstack/react-router";

import UpdateNameForm from "@/components/update-name-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Profile Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {session.user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {session.user.email}
            </p>
            {session.user.image && (
              <div>
                <span className="font-medium">Profile Image:</span>
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="ml-2 mt-2 h-16 w-16 rounded-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Name</CardTitle>
            <CardDescription>Change your display name</CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateNameForm currentName={session.user.name || ""} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
