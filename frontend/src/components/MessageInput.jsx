import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    // Send text and optionally the selected image file
    sendMessage({ text: text.trim(), image: imagePreview }, selectedFile);
    setText("");
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 md:px-8 bg-white/70 border-t border-orange-100 backdrop-blur-xs">
      {imagePreview && (
        <div className="w-full mb-3 flex items-center">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border-2 border-orange-200 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-white hover:bg-stone-900 transition-colors shadow-xs"
              type="button"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="w-full flex items-center gap-3">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            className="w-full bg-orange-50/60 border border-orange-200/80 rounded-xl py-2.5 pl-4 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition-all shadow-xs"
            placeholder="Type a message..."
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`absolute right-3 p-1.5 rounded-lg text-stone-400 hover:text-orange-500 hover:bg-orange-100/50 transition-colors ${
              imagePreview ? "text-orange-500" : ""
            }`}
            title="Attach image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-2.5 font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;

