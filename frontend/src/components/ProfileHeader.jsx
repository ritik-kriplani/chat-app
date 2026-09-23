import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-4 border-b border-orange-100">
      <div className="flex items-center justify-between">
        {/* AVATAR + NAME */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="size-12 rounded-full overflow-hidden ring-2 ring-orange-300 ring-offset-2 ring-offset-white transition-all hover:ring-orange-400 group relative"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User avatar"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <span className="text-white text-[10px] font-semibold">Change</span>
              </div>
            </button>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-sm" />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & STATUS */}
          <div>
            <h3 className="text-stone-800 font-semibold text-sm max-w-[140px] truncate leading-tight">
              {authUser.fullName}
            </h3>
            <p className="text-green-500 text-xs font-medium flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-1 items-center">
          {/* SOUND TOGGLE */}
          <button
            className="icon-btn"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
            title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-4" />
            ) : (
              <VolumeOffIcon className="size-4" />
            )}
          </button>

          {/* LOGOUT */}
          <button
            className="icon-btn"
            onClick={logout}
            title="Sign out"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
