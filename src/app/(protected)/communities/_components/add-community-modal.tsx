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
import React, { useState } from "react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";
import { useSession } from "next-auth/react";

interface AddCommunityModalProps {
  onCommunityAdded: () => void;
}

interface CommunityFormData {
  name: string;
  description: string;
  location: string;
}

export default function AddCommunityModal({
  onCommunityAdded,
}: AddCommunityModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();

  const form = useForm<CommunityFormData>({
    defaultValues: {
      description: "",
      name: "",
      location: "",
    },
  });

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const validationErrors = form.formState.errors;
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        setError(firstError.message || "Please check the form for errors");
        return;
      }
      //http://13.60.62.124:8000/api/v1/church-community/all
      const response = await fetch(`/api/v1/church-community/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add a community");
      }

      console.log("response", response);

      // const newUser = await response.json();
      onCommunityAdded();
      setOpen(false);
      form.reset();
      toast.success("Community added successfully");
    } catch (err) {
      console.log("error", err);
      const error = err as Error;
      const errorMessage = error.message || "Failed to add community";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          Add Community
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[22rem] md:max-w-lg p-4 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-left">Add Community</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            {error && (
              <ErrorAlert message={error} onClose={() => setError(null)} />
            )}

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Community name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nigerian Community" {...field} />
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
                    <Input placeholder="All Nigerians in Botwe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location of the community" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
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
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
