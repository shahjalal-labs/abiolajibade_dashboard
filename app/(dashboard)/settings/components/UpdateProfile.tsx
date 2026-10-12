"use client";

import { useEffect, useState } from "react";
import { CircleAlert, Camera } from "lucide-react";
import { toast } from "sonner";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/authApi";

const UpdateProfile = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery("");
  const [update, { isLoading: isUpdateLoading }] = useUpdateMyProfileMutation();

  const admin = profile?.result;

  const [userName, setUserName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // hydrate form when profile loads
  useEffect(() => {
    if (admin) {
      setUserName(admin.userName);
      setPreview(admin.profileImage);
    }
  }, [admin]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { userName };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(payload));

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      const response = await update(formData).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  if (isLoading) {
    return <div className="bg-white p-6 rounded-xl">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center border-b gap-2 pb-3 mb-6">
        <p className="font-medium">Profile Information</p>
        <CircleAlert className="w-4 h-4 text-gray-500" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex justify-start">
          <div className="relative w-24 h-24 group">
            <img
              src={preview || "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"}
              alt="Profile"
              className="w-24 h-24 rounded-xl object-cover border transition-transform group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <label className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Phone Number (readonly) */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            value={admin?.email || ""}
            readOnly
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Role (readonly) */}
        <div>
          <label className="block text-sm mb-1">Role</label>
          <input
            value={admin?.role || ""}
            readOnly
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          disabled={isUpdateLoading}
          className="bg-bprimary text-white px-5 py-2 rounded-md disabled:opacity-50"
        >
          {isUpdateLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
