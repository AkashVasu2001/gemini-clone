import { useChatStore } from "../store/chatStore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({setPush}) {
  const { chatrooms, addChatrooms, deleteChatrooms } = useChatStore();
  const [newChatroom, setNewChatroom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(chatrooms);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      setFiltered(
        chatrooms.filter((c) => c.title.toLowerCase().includes(lower))
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, chatrooms]);
  useEffect(() => {
    if (open) setPush(true)
    else setPush(false)
  },[open])
  const handleCreate = () => {
    if (!newChatroom.trim()) return;
    addChatrooms(newChatroom.trim());
    toast.success("Chatroom created");
    setNewChatroom("");
  };

  const handleDelete = (id) => {
    deleteChatrooms(id);
    toast.info("Chatroom deleted");
  };

  return (
    <>
      <div
        style={{ width: open ? "16rem" : "fit-content" }}
        className="p-4 space-y-10 fixed bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-screen z-50"
      >
        <button onClick={() => setOpen(!open)}>
          <img
            src="/hamburger.svg"
            alt=""
            className="size-4 text-white color-white"
          />
        </button>
        {open && (
          <div className="space-y-6 ">
            <div className="flex space-x-1">
              <input
                type="text"
                value={newChatroom}
                onChange={(e) => setNewChatroom(e.target.value)}
                placeholder="New chat"
                className="w-40 pr-2 pl-2 pt-0.5 pb-0.5 outline-none border border-gray-300 text-gray-900 rounded-md focus:ring-primary-600 focus:border-primary-600   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 placeholder:text-sm dark:text-white dark:focus:ring-blue-500 "
              />

              <button onClick={handleCreate} className="text-sm text-gray-400 bg-gray-700 border rounded-md border-gray-600 pr-2 pl-2 hover:bg-gray-600">
                Create
              </button>
            </div>
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chatrooms..."
                className="w-56 pr-2 pl-2 pt-0.5 pb-0.5 mt-2 outline-none rounded-md placeholder:text-sm bg-gray-700 border border-gray-600"
              />

              <ul className="mt-3">
                {filtered.map((room) => (
                  <li key={room.id} className="text-sm group pt-4 text-gray-400 flex justify-between">
                    <Link to={`/chat/${room.id}`} className="">
                      {room.title}
                    </Link>
                    <button onClick={() => handleDelete(room.id)} className="group-hover:opacity-100 transition-opacity opacity-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-gray-400">No chatrooms found.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
