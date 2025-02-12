"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizer } from "@/context/organizer/OrganizerContext";
import { fetchProfile, updateProfile, changePassword } from "@/lib/api/profile";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

const OrganizerProfilePage = () => {
  const { organizerId } = useOrganizer();
  const userId = organizerId;
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId as string),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return updateProfile(userId as string, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      return changePassword(userId as string, data);
    },
  });

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const oldPassword = form.oldPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    changePasswordMutation.mutate({ oldPassword, newPassword });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile?.data) {
    return <div>No profile data available</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-24 h-24">
                <Image
                  src={
                    imagePreview ||
                    profile.data.profilePicture ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div>
                <Label htmlFor="profilePicture" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                    Change Photo
                  </div>
                  <Input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={profile.data.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.data.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending
                ? "Updating..."
                : "Update Profile"}
            </Button>

            {updateProfileMutation.isError && (
              <p className="text-red-500 text-sm mt-2">
                {updateProfileMutation.error.message}
              </p>
            )}

            {updateProfileMutation.isSuccess && (
              <p className="text-green-500 text-sm mt-2">
                Profile updated successfully!
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Changing Password..."
                : "Change Password"}
            </Button>

            {changePasswordMutation.isError && (
              <p className="text-red-500 text-sm mt-2">
                {changePasswordMutation.error.message}
              </p>
            )}

            {changePasswordMutation.isSuccess && (
              <p className="text-green-500 text-sm mt-2">
                Password changed successfully!
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerProfilePage;
