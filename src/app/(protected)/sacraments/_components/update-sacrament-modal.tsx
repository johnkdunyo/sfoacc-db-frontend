// UpdateSacramentModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilLine } from "lucide-react";
import { ISacrament } from "./sacraments-table";

interface UpdateSacramentModalProps {
  onSacramentUpdated: () => void;
  oldSacramentData: ISacrament;
}

interface SacramentFormData {
  name: string;
  description: string;
  once_only: boolean;
}

export default function UpdateSacramentModal({
  onSacramentUpdated,
  oldSacramentData,
}: UpdateSacramentModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const form = useForm<SacramentFormData>({
    defaultValues: {
      name: oldSacramentData.name,
      description: oldSacramentData.description,
      once_only: oldSacramentData.once_only,
    },
  });

  // Reset form when oldSacramentData changes
  useEffect(() => {
    form.reset({
      name: oldSacramentData.name,
      description: oldSacramentData.description,
      once_only: oldSacramentData.once_only,
    });
  }, [oldSacramentData, form]);

  const onSubmit = async (data: SacramentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/v1/sacraments/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update a Sacrament");
      }

      onSacramentUpdated();
      setOpen(false);
      toast.success("Sacrament updated successfully");
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || "Failed to update Sacrament";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PencilLine className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
      </DialogTrigger>
      <DialogContent className="max-w-[22rem] md:max-w-lg p-4 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-left">Update Sacrament</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <ErrorAlert message={error} onClose={() => setError(null)} />
            )}

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name of Sacrament is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sacrament Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Holy Communion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A Sacrament called Holy Matrimony"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="once_only"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mt-0">Received only once</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Updating..." : "Update Sacrament"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
