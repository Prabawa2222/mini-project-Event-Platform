"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Attendee {
  userId: number;
  name: string;
  email: string;
  profilePicture: string;
  ticketType: string;
  quantity: number;
  purchaseDate: string;
  price: number;
}

interface AttendeeListProps {
  data: Attendee[];
  total: number;
}

const AttendeeList = ({ data, total }: AttendeeListProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl font-bold flex items-center justify-between">
          <span>Attendees List ({total})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price Per Ticket</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-right">Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((attendee, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {attendee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {attendee.name}
                    </TableCell>
                    <TableCell>{attendee.ticketType}</TableCell>
                    <TableCell className="text-center">
                      {attendee.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      Rp.{Number(attendee.price).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      Rp.
                      {(
                        Number(attendee.price) * attendee.quantity
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(attendee.purchaseDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="divide-y">
              {data.map((attendee, index) => (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-sm text-gray-500">
                        {attendee.ticketType}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Quantity</div>
                      <div>{attendee.quantity}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Price Per Ticket</div>
                      <div>Rp. {Number(attendee.price).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Price</div>
                      <div>
                        Rp.
                        {(
                          Number(attendee.price) * attendee.quantity
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Purchase Date</div>
                      <div>{formatDate(attendee.purchaseDate)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendeeList;
