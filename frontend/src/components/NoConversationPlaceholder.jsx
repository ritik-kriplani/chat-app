import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 bg-gradient-to-tr from-amber-500/10 to-orange-500/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-orange-100/50">
        <MessageCircleIcon className="size-10 text-orange-500" />
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-2">Select a Conversation</h3>
      <p className="text-stone-500 text-sm max-w-sm leading-relaxed">
        Choose a contact or recent chat from the sidebar to start messaging.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;

