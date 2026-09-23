import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-1.5">
      {allContacts.map((contact) => {
        const isSelected = selectedUser?._id === contact._id;
        const isOnline = onlineUsers.includes(contact._id);

        return (
          <div
            key={contact._id}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
              isSelected
                ? "bg-white border-orange-200 shadow-sm shadow-orange-100"
                : "bg-white/60 border-transparent hover:bg-white hover:border-orange-100"
            }`}
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                  className="size-11 rounded-full object-cover ring-2 ring-orange-200/70"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-stone-800 font-semibold text-sm truncate">{contact.fullName}</h4>
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
export default ContactList;

