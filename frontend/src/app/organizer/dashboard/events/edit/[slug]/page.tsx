"use client";

import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/utils/api/organizer/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventFormData } from "@/types/event";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Plus } from "lucide-react";

const EventEditOrganizerPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
  });

  const form = useForm<EventFormData>({
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      price: event?.price || 0,
      startDate: event?.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
      endDate: event?.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      availableSeats: event?.availableSeats || 0,
      category: event?.category || "",
      location: event?.location || "",
      imageUrl: event?.imageUrl || "",
      ticketTypes: event?.ticketTypes || [],
      promotions: event?.promotions || [],
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        name: event.name || "",
        description: event.description || "",
        price: event.price || 0,
        startDate: event.startDate
          ? new Date(event.startDate).toISOString().slice(0, 16)
          : "",
        endDate: event.endDate
          ? new Date(event.endDate).toISOString().slice(0, 16)
          : "",
        availableSeats: event.availableSeats || 0,
        category: event.category || "",
        location: event.location || "",
        imageUrl: event.imageUrl || "",
        ticketTypes:
          event.ticketTypes?.map((ticket) => ({
            ...ticket,
            description: ticket.description || "",
          })) || [],
        promotions:
          event.promotions?.map((promo) => ({
            ...promo,
            startDate: new Date(promo.startDate).toISOString().slice(0, 16),
            endDate: new Date(promo.endDate).toISOString().slice(0, 16),
          })) || [],
      });
    }
  }, [event, form.reset]);

  const {
    fields: ticketFields,
    append: appendTicket,
    remove: removeTicket,
  } = useFieldArray({
    control: form.control,
    name: "ticketTypes",
  });

  const {
    fields: promotionFields,
    append: appendPromotion,
    remove: removePromotion,
  } = useFieldArray({
    control: form.control,
    name: "promotions",
  });

  const updateMutation = useMutation({
    mutationFn: (data: EventFormData) =>
      eventService.updateEvent(eventSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/organizer/dashboard/events");
    },
  });

  const onSubmit = (data: EventFormData) => {
    // Clean up the data before sending
    const cleanedData = {
      name: data.name,
      description: data.description,
      price: data.price,
      startDate: new Date(data.startDate).toISOString(), // Add full ISO string
      endDate: new Date(data.endDate).toISOString(), // Add full ISO string
      availableSeats: data.availableSeats,
      category: data.category,
      location: data.location,
      imageUrl: data.imageUrl,
      ticketTypes: data.ticketTypes.map((ticket) => ({
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        description: ticket.description,
      })),
      promotions: data.promotions.map((promo) => ({
        discount: promo.discount,
        maxUses: promo.maxUses,
        startDate: new Date(promo.startDate).toISOString(),
        endDate: new Date(promo.endDate).toISOString(),
      })),
    };

    console.log("Cleaned data:", cleanedData);
    updateMutation.mutate(cleanedData);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="p-6 space-y-6 w-[980px] mr-16">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Edit Event</CardTitle>
          <Button
            variant="outline"
            onClick={() => router.push("/organizer/dashboard/events")}
          >
            Cancel
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Event Basic Info */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
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
                      <FormLabel>End Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Entertainment">
                            Entertainment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ticket Types Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Ticket Types</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        name: "",
                        price: 0,
                        quantity: 0,
                        description: "",
                      })
                    }
                  >
                    Add Ticket Type
                  </Button>
                </div>

                {ticketFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`ticketTypes.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticket Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ticketTypes.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
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
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
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
                          name={`ticketTypes.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-4"
                        onClick={() => remove(index)}
                      >
                        Remove Ticket Type
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Promotions</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendPromotion({
                        discount: 0,
                        startDate: "",
                        endDate: "",
                        maxUses: undefined,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promotion
                  </Button>
                </div>

                {promotionFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`promotions.${index}.discount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  {...field}
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
                            <FormItem>
                              <FormLabel>Max Uses (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`promotions.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  {...field}
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
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  {...field}
                                  min={new Date().toISOString().slice(0, 16)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-4"
                        onClick={() => removePromotion(index)}
                      >
                        Remove Promotion
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/organizer/dashboard/events")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventEditOrganizerPage;
