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
import { PencilLine } from "lucide-react";
import { IPlaceofworship } from "./placesofworship-table";

interface UpdatePlaceOfWorshipModalProps {
  onPlaceOfWorshipUpdated: () => void;
  oldPlaceOfWorshipData: IPlaceofworship;
}

interface PlaceOfWorshipFormData {
  name: string;
  description: string;
  location: string;
  address?: string;
  mass_schedule?: string;
}

export default function UpdatePlaceOfWorshipModal({
  onPlaceOfWorshipUpdated,
  oldPlaceOfWorshipData,
}: UpdatePlaceOfWorshipModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();

  const form = useForm<PlaceOfWorshipFormData>({
    defaultValues: { ...oldPlaceOfWorshipData },
  });

  const onSubmit = async (data: PlaceOfWorshipFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const validationErrors = form.formState.errors;
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        setError(firstError.message || "Please check the form for errors");
        return;
      }
      //http://13.60.62.124:8000/api/v1/place-of-worship/all
      const response = await fetch(`/api/v1/place-of-worship/`, {
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
        throw new Error(
          errorData.detail || "Failed to update a place of worship"
        );
      }

      console.log("response", response);

      // const newUser = await response.json();
      onPlaceOfWorshipUpdated();
      setOpen(false);
      form.reset();
      toast.success("Place of worship updated successfully");
    } catch (err) {
      console.log("error", err);
      const error = err as Error;
      const errorMessage = error.message || "Failed to add Place of worship";
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
          <DialogTitle className="text-left">
            Update Place of Worship
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            {error && (
              <ErrorAlert message={error} onClose={() => setError(null)} />
            )}

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name of worship place is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Worship Place Name</FormLabel>
                  <FormControl>
                    <Input placeholder="St. Andrews" {...field} />
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
                      placeholder="A place of worship called St. Andrews"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address of the place of worship"
                      {...field}
                    />
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
                    <Input
                      placeholder="Location of the place of worship"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mass_schedule"
              rules={{ required: "Mass schedule is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mass Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="Times for mass" {...field} />
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
                {isSubmitting ? "Updating..." : "Update Place of Worship"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
