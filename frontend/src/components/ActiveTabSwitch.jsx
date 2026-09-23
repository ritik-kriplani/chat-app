import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="p-2 mx-3 my-2 bg-orange-100/50 rounded-xl flex gap-1 border border-orange-200/60">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
          activeTab === "chats"
            ? "bg-white text-orange-600 shadow-sm shadow-orange-200"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
          activeTab === "contacts"
            ? "bg-white text-orange-600 shadow-sm shadow-orange-200"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;

