"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Plus, X } from "lucide-react";

import Image from "next/image";
import { eventService } from "@/utils/api/organizer/events";
import { CreateEventFormValues, createEventSchema } from "@/lib/schema";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizer } from "@/context/organizer/OrganizerContext";

const CreateEventPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { organizerId, isOrganizer, isLoading } = useOrganizer();

  useEffect(() => {
    console.log("Context values:", {
      organizerId,
      isOrganizer,
      isLoading,
    });
  }, [organizerId, isOrganizer, isLoading]);

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      //Jangan lupa ganti
      organizerId: 0,
      name: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      category: "OTHER",
      ticketTypes: [{ name: "", price: 0, quantity: 1 }],
      image: undefined,
      promotions: [],
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        console.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.error("Image size should be less than 5MB");
        return;
      }

      form.setValue("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", undefined);
    setImagePreview(null);
  };

  const addTicketType = () => {
    const currentTicketTypes = form.getValues("ticketTypes");
    form.setValue("ticketTypes", [
      ...currentTicketTypes,
      { name: "", price: 0, quantity: 1 },
    ]);
  };

  const removeTicketType = (index: number) => {
    const currentTicketTypes = form.getValues("ticketTypes");
    if (currentTicketTypes.length > 1) {
      form.setValue(
        "ticketTypes",
        currentTicketTypes.filter((_, i) => i !== index)
      );
    }
  };

  const addPromotion = () => {
    const currentPromotions = form.getValues("promotions") || [];
    form.setValue("promotions", [
      ...currentPromotions,
      {
        discount: 0,
        startDate: "",
        endDate: "",
        maxUses: undefined,
      },
    ]);
  };

  const removePromotion = (index: number) => {
    const currentPromotions = form.getValues("promotions") || [];
    form.setValue(
      "promotions",
      currentPromotions.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: CreateEventFormValues) => {
    console.log("Form submission started");
    setIsSubmitting(true);
    try {
      const totalSeats = data.ticketTypes.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0
      );
      const basePrice = Math.min(
        ...data.ticketTypes.map((ticket) => ticket.price)
      );

      const formattedData = {
        ...data,
        organizerId: Number(organizerId),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        availableSeats: totalSeats,
        price: basePrice,
        category: data.category,
      };
      await eventService.createEvent(formattedData);
      router.push("/organizer/dashboard/events");
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) => {
                console.log("Form submit event triggered");
                console.log("Form data:", data);
                onSubmit(data);
              })}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter event name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-4">
                        {imagePreview ? (
                          <div className="relative w-full max-w-d aspect-video">
                            <Image
                              src={imagePreview}
                              alt="Event preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full max-w-md aspect-video relative">
                            <label
                              htmlFor="image-upload"
                              className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImagePlus className="h-12 w-12 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Click to upload event image
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter event description"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MUSIC">Music</SelectItem>
                          <SelectItem value="SPORTS">Sports</SelectItem>
                          <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                          <SelectItem value="BUSINESS">Business</SelectItem>
                          <SelectItem value="EDUCATION">Education</SelectItem>
                          <SelectItem value="ENTERTAINMENT">
                            Entertainment
                          </SelectItem>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-5">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter event location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Ticket Types</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTicketType}
                  >
                    Add Ticket Type
                  </Button>
                </div>
                {form.watch("ticketTypes").map((_, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Ticket Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Regular, VIP"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeTicketType(index)}
                      disabled={form.watch("ticketTypes").length <= 1}
                      className="mb-6"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Promotions</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPromotion}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promotion
                  </Button>
                </div>
                {(form.watch("promotions") || []).map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`promotions.${index}.discount`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                max="100"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`promotions.${index}.maxUses`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Max Uses (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`promotions.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`promotions.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removePromotion(index)}
                      >
                        Remove Promotion
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventPage;
