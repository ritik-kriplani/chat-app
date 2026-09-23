import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-white/80 backdrop-blur border-b border-orange-100 h-16 px-6 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-11 rounded-full object-cover ring-2 ring-orange-300 ring-offset-1"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full shadow-xs ${
              isOnline ? "bg-emerald-500" : "bg-stone-300"
            }`}
          />
        </div>

        <div>
          <h3 className="text-stone-800 font-semibold text-sm">{selectedUser.fullName}</h3>
          <p className="text-stone-400 text-xs font-medium flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-stone-300"
              }`}
            />
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="size-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-orange-100/50 transition-colors"
        title="Close chat (Esc)"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
export default ChatHeader;

