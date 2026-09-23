import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-orange-100/60">
        <MessageCircleIcon className="size-8 text-orange-500" />
      </div>
      <h3 className="text-lg font-bold text-stone-800 mb-2">
        Say hello to {name}!
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-stone-500 text-xs leading-relaxed">
          This is the start of your direct conversation. Break the ice with a quick message below!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-orange-300/60 to-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;

