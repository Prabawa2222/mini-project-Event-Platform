import { getSession } from "next-auth/react";
import { fetchWithAuth } from "../auth";

export const fetchProfile = async (userId: string) => {
  const result = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API}/api/users/profile?userId=${userId}`
  );
  console.log("API Response:", result);

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch profile");
  }

  return result;
};

export const updateProfile = async (userId: string, formData: FormData) => {
  const session = await getSession();
  if (!session?.user?.accessToken) {
    throw new Error("No authentication token available");
  }

  const requestFormData = new FormData();

  const profileData = {
    name: formData.get("name"),
  };
  requestFormData.append("data", JSON.stringify(profileData));

  const imageFile = formData.get("profilePicture") as File;
  if (imageFile && imageFile.size > 0) {
    requestFormData.append("image", imageFile);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/users/profile/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: requestFormData,
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to update profile");
  }

  return result;
};

export const changePassword = async (
  userId: string,
  data: { oldPassword: string; newPassword: string }
) => {
  return fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API}/api/users/password/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
};
