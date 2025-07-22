import { useParams } from "react-router-dom";
import { useChatStore } from "../store/chatStore";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Sidebar from "../features/Sidebar";
import { toast } from "react-toastify";
import { FiCopy, FiPlus } from "react-icons/fi";

const geminiReplies = [
  `That's a really interesting thought! To approach this properly, we need to break it down into smaller pieces. First, consider the core problem you're trying to solve — is it technical, conceptual, or strategic? Once we have clarity on that, we can start identifying potential solutions. I’d love to dive deeper if you share more context.`,

  `Great question. Let's think about this logically: every complex system starts with a simple foundation. The trick is understanding how the building blocks fit together. Whether it’s a coding problem, a product decision, or a design challenge, the key is to work backward from the outcome you want and test small pieces along the way.`,

  `You're definitely on the right track! But there might be a couple of nuances worth exploring. For example, have you considered how this scales or performs under edge cases? These little details can really shape the outcome. I can also help visualize the logic or suggest best practices if you’d like.`,

  `Interesting! Here’s what I’d suggest: try rephrasing your problem in terms of inputs, expected outcomes, and possible blockers. This not only makes it easier to debug or plan, but also helps identify any assumptions that might be hiding in plain sight. If you’re stuck at a particular step, let’s zoom in there.`,

  `That’s a classic scenario! Many developers/designers/strategists run into similar issues. A good starting point might be to look at how others solved this in similar contexts. For example, certain patterns repeat across projects — like debounce logic in frontend apps, or failover systems in backends. I can even walk you through a working example if you want.`,

  `Let’s approach this like a mini strategy session. First, write down what success looks like. Then, identify the tools, libraries, or mental models that could help you reach that. Whether it’s React state management, content architecture, or performance optimization — there’s always a structured way forward.`,

  `You’re thinking deeply — I like that. A lot of people skip over the planning stage and jump straight into code. But stepping back to ask, “What’s the best way to do this long term?” is what sets apart junior devs from senior ones. Let's explore a scalable, maintainable path forward.`,

  `Let me expand on that. This reminds me of a common principle in software design: “favor composition over inheritance.” In other words, try to build things that are modular, testable, and easy to replace. It might seem like overkill now, but future-you will thank you when the project grows.`,

  `What you’ve described is actually a great use case for a pattern like the observer, pub-sub, or even state machines depending on complexity. It depends a bit on whether the changes are local to one component or shared across many. If you describe your component flow, I’ll help you choose the right tool.`,

  `Let’s break this down step by step. First: what is the input to your function/system/page? Second: what transformation happens? Third: what should the final result be? Thinking in this structure makes even complex ideas feel manageable. It’s a powerful debugging and design approach.`,
];

export default function ChatroomPage() {
  const { id } = useParams(); // from URL /chat/:id
  const { chatrooms, editChatroomTitle } = useChatStore();
  const chatroom = chatrooms.find((c) => c.id === id);
  const [imageFile, setImageFile] = useState([]);
  const { messagesByRoom, addMessage } = useChatStore();
  const messages = useMemo(
    () => messagesByRoom[id] || [],
    [messagesByRoom, id]
  );

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const [newTitle, setNewTitle] = useState(chatroom.title);
  const [edit, setEdit] = useState(false);
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
      const randomIndex = Math.floor(Math.random() * geminiReplies.length);
      const aiReply = {
        from: "gemini",
        text: geminiReplies[randomIndex],
        timestamp: new Date().toLocaleTimeString(),
      };

      addMessage(id, aiReply);
      setIsTyping(false);
    }, 1500);
  };

  const handleNewTitleSubmit = (e) => {
    e.preventDefault();
    if (newTitle === chatroom.title) {
      setEdit(false);
      return;
    }
    editChatroomTitle(id, newTitle);
    setEdit(false);
  };
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setEdit(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    setEdit(false);
    setNewTitle(chatroom.title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const memoizedSetPush = useCallback((val) => {
    setPush(val);
  }, []);
  if (!chatroom) return <p>Chatroom not found</p>;

  return (
    <div className="min-h-screen  flex flex-col md:flex-row  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar push={push} setPush={memoizedSetPush} />
      <div
        className={`flex-1 flex flex-col p-4  ${
          push ? "ml-9 md:ml-64" : "ml-9 md:ml-12"
        }`}
      >
        <h1 className="text-xl font-semibold  text-gray-300">Gemni</h1>
        {!edit && (
          <h1
            onClick={() => setEdit(true)}
            className="text-md font-semibold mb-4 text-gray-500"
          >
            {chatroom.title}
          </h1>
        )}
        {edit && (
          <form onSubmit={handleNewTitleSubmit}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-40 pr-2 pl-2 pt-0.5 pb-0.5 outline-none border-b-2  border-gray-300 text-gray-900 rounded-md focus:ring-primary-600 focus:border-primary-600   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 placeholder:text-sm dark:text-white dark:focus:ring-blue-500 "
              autoFocus
            />
          </form>
        )}

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
                {hoveredIndex === index && (
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
