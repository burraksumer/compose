import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function UpdateNameForm({ currentName }: { currentName: string }) {
  const { refetch } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      name: currentName,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.updateUser(
        {
          name: value.name,
        },
        {
          onSuccess: () => {
            refetch();
            toast.success("Name updated successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );

      if (error) {
        toast.error(error.message || "Failed to update name");
      }
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
      }),
    },
  });

  useEffect(() => {
    form.setFieldValue("name", currentName);
  }, [currentName, form]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
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
            {state.isSubmitting ? "Updating..." : "Update Name"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
