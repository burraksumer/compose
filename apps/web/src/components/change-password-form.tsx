import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function ChangePasswordForm() {
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      const { error } = await authClient.changePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: false,
        },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Password changed successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );

      if (error) {
        toast.error(error.message || "Failed to change password");
      }
    },
    validators: {
      onSubmit: z
        .object({
          currentPassword: z.string().min(1, "Current password is required"),
          newPassword: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="currentPassword">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Current Password</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-sm text-destructive">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="newPassword">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>New Password</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-sm text-destructive">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Confirm New Password</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-sm text-destructive">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Subscribe>
        {(state) => (
          <Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
            {state.isSubmitting ? "Changing Password..." : "Change Password"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
