import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full h-full">
      <BorderAnimatedContainer>
        {/* LEFT SIDEBAR */}
        <div className="w-80 md:w-88 flex flex-col border-r border-orange-100/80 flex-shrink-0"
          style={{ background: "linear-gradient(180deg, #fff9f4 0%, #fef3e8 100%)" }}>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT CHAT PANEL */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: "#fffbf7" }}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;

