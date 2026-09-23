import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-4 md:px-8 overflow-y-auto py-6" style={{ background: "#fffbf7" }}>
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="w-full space-y-4">
            {messages.map((msg) => {
              const isSentByMe = msg.senderId === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl shadow-xs text-sm ${
                      isSentByMe
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-xs shadow-orange-500/10"
                        : "bg-white text-stone-800 border border-orange-100/80 rounded-bl-xs shadow-orange-950/5"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-xl max-h-72 w-full object-cover mb-2"
                      />
                    )}
                    {msg.text && <p className="leading-relaxed font-normal">{msg.text}</p>}
                    <div
                      className={`text-[10px] mt-1.5 font-medium ${
                        isSentByMe ? "text-orange-100 text-right" : "text-stone-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;

