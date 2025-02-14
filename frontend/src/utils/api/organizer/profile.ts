export const fetchProfile = async (userId: string) => {
  const response = await fetch(
    `${process.env.BASE_URL}/api/users/profile?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();
  console.log("API Response:", result);

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch profile");
  }

  return result;
};

export const updateProfile = async (userId: string, formData: FormData) => {
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
    `${process.env.BASE_URL}/api/users/profile/${userId}`,
    {
      method: "PUT",
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
  const response = await fetch(
    `${process.env.BASE_URL}/api/users/password/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to change password");
  }

  return response.json();
};
