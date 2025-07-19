import { useParams } from "react-router-dom";
import { useChatStore } from "../store/chatStore";
import { useState, useEffect, useRef,useMemo } from "react";
import Sidebar from "../features/Sidebar";
import { toast } from "react-toastify";
import { FiCopy, FiPlus } from "react-icons/fi";

export default function ChatroomPage() {
  const { id } = useParams(); // from URL /chat/:id
  const { chatrooms } = useChatStore();
  console.log(chatrooms)
  const chatroom = chatrooms.find((c) => c.id === id);
  const [imageFile, setImageFile] = useState([]);
 const { messagesByRoom, addMessage } = useChatStore();
const messages = useMemo(() => messagesByRoom[id] || [], [messagesByRoom, id]);


  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const [push, setPush] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const fileInputRef = useRef();
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 const sendMessage = () => {
  if (!input.trim()) return;

  const userMessage = {
    from: "user",
    text: input.trim(),
    image: imageFile,
    timestamp: new Date().toLocaleTimeString(),
  };

  addMessage(id, userMessage);
  setInput("");
  setImageFile([]);
  setIsTyping(true);

  setTimeout(() => {
    const aiReply = {
      from: "gemini",
      text: userMessage.text,
      timestamp: new Date().toLocaleTimeString(),
    };
    addMessage(id, aiReply);
    setIsTyping(false);
  }, 1500);
};


  if (!chatroom) return <p>Chatroom not found</p>;

  return (
    <div className="min-h-screen  flex flex-col md:flex-row  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar push={push} setPush={setPush} />
      <div
        className={`flex-1 flex flex-col p-4  ${
          push ? "ml-9 md:ml-64" : "ml-9 md:ml-12"
        }`}
      >
        <h1 className="text-xl font-semibold  text-gray-300">Gemni</h1>
        <h1 className="text-md font-semibold mb-4 text-gray-500">
          {chatroom.title}
        </h1>

        <div className="flex-1 pr-9 pl-7 overflow-y-auto space-y-2 mb-4 max-h-[calc(100vh-185px)] scrollbar-thin hide-scroll-arrows scrollbar-thumb-gray-400 scrollbar-track-transparent ">
          {messages.map((msg, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-4 rounded   ${
                msg.from === "user"
                  ? "bg-gray-50 dark:bg-gray-800 text-white self-end ml-auto max-w-sm "
                  : " self-start mr-auto max-w-5xl"
              }`}
            >
              <div className="relative">
                {hoveredIndex === index &&  (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(msg.text);
                      toast.success("Text copied!");
                    }}
                    className="absolute top-0 right-0 text-xs bg-gray-400 bg-opacity-10  text-white p-1 rounded hover:bg-opacity-50"
                  >
                    <FiCopy size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm">{msg.text}</p>
              <div className="w-full relative">
                {Array.isArray(msg.image)
                  ? msg.image.map((x, index) => (
                      <div key={index}>
                        <img
                          src={x}
                          alt="Preview"
                          className="mt-2 max-w-40 max-h-32 rounded"
                        />
                      </div>
                    ))
                  : msg.image && <img src={msg.image} />}
              </div>

              <p
                className={`text-[10px]  mt-1 opacity-70 ${
                  msg.from === "user" ? "text-right" : ""
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          ))}

          {isTyping && (
            <p className="text-sm italic text-gray-500 dark:text-gray-400">
              Gemini is typing...
            </p>
          )}

          <div ref={endRef} />
        </div>
        <div className="relative">
          <div className="absolute top-[-6rem] flex w-96  overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent ">
            {imageFile &&
              imageFile.map((x, index) => (
                <div key={index}>
                  <img
                    src={x}
                    alt="Preview"
                    className=" mt-2 ml-12 mb-2 z-10 max-w-20 max-h-16 rounded"
                  />
                </div>
              ))}
          </div>
          <div className="flex gap-2">
            <div>
              <input
                type="file"
                accept="image/*"
                placeholder=""
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageFile((prev) => [...prev, reader.result]); // base64 image
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 rounded-full  text-gray-600 bg-gray-600 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-700"
                title="Upload Image"
              >
                <FiPlus size={20} />
              </button>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-600 rounded dark:bg-gray-900 outline-none focus:border-gray-600 resize-none overflow-y-scroll scrollbar-thin hide-scroll-arrows scrollbar-thumb-gray-400 scrollbar-track-transparent"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-gray-600 text-white p-2.5 size-10  rounded-full"
            >
              <img src="/send.png" alt="" className="size-5 " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
