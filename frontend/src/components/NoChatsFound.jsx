import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-7 h-7 text-orange-500" />
      </div>
      <div>
        <h4 className="text-stone-800 font-semibold text-sm mb-1">No conversations yet</h4>
        <p className="text-stone-500 text-xs px-4 leading-relaxed">
          Start a new chat by selecting someone from your contacts tab.
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-3.5 py-1.5 text-xs font-semibold text-orange-600 bg-orange-100/60 rounded-xl hover:bg-orange-200/60 transition-colors"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;

