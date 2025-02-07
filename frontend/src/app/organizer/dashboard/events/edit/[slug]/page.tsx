"use client";

import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/lib/api/events";
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
      });
    }
  }, [event, form.reset]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ticketTypes",
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
    updateMutation.mutate(data);
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

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
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

                {fields.map((field, index) => (
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
