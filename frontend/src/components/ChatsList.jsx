import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-1.5">
      {chats.map((chat) => {
        const isSelected = selectedUser?._id === chat._id;
        const isOnline = onlineUsers.includes(chat._id);

        return (
          <div
            key={chat._id}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
              isSelected
                ? "bg-white border-orange-200 shadow-sm shadow-orange-100"
                : "bg-white/60 border-transparent hover:bg-white hover:border-orange-100"
            }`}
            onClick={() => setSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="size-11 rounded-full object-cover ring-2 ring-orange-200/70"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-stone-800 font-semibold text-sm truncate">{chat.fullName}</h4>
                <p className="text-xs text-stone-400 font-medium truncate">
                  {isOnline ? "Active now" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ChatsList;

