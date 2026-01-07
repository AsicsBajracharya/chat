import { useAuthUser, useUpdateProfile } from "@/features/auth/auth.hooks";
import React, { useRef, useState } from "react";
import Image from "next/image";
const UserCard = ({ name, email }: any) => {
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const { data: user, isLoading } = useAuthUser();
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.readAsDataURL(file);
    
        reader.onloadend = async () => {
          const base64Image = reader.result;
          if (typeof base64Image === "string") {
            setSelectedImg(base64Image);
            updateProfile({ profilePicture: base64Image });
          }
          updateProfile({ profilePicture: base64Image });
        };
      };

  return (
    <div className="p-2 md:p-4">
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-2 md:p-4">
          <div className="flex gap-5 items-center">
          <div className="avatar avatar-online">
            <button
              className="size-8 md:size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={selectedImg || user.profilePicture || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
                width={40}
                height={40}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
            <div>
              <div className="text-xs opacity-70">Logged in as</div>
              <div className="font-semibold truncate">
                {name || email || "User"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
