import { create } from "zustand";

const sampleMessages = {
  1752930361512: [
    { from: "user", text: "Hey, here's my pitch idea:", timestamp: "10:00 AM" },
    {
      from: "gemini",
      text: "Great! Start with a one-liner that captures your value.",
      timestamp: "10:01 AM",
    },
  ],
  1752930361513: [
    {
      from: "user",
      text: "Why is CSS Grid so confusing 😩",
      timestamp: "11:00 AM",
    },
    {
      from: "gemini",
      text: "Want a visual layout example?",
      timestamp: "11:01 AM",
    },
  ],
  1752930361514: [
    { from: "user", text: "Explain Redux like I'm 5", timestamp: "9:15 AM" },
    {
      from: "gemini",
      text: "Imagine a single big toy box (store)...",
      timestamp: "9:16 AM",
    },
  ],
  1752930361515: [
    {
      from: "user",
      text: "Can you give me blog post ideas?",
      timestamp: "8:45 AM",
    },
    {
      from: "gemini",
      text: "Sure. Topics on frontend performance, accessibility?",
      timestamp: "8:46 AM",
    },
  ],
};

const sampleChatrooms = [
  {
    id: "1752930361512",
    title: "Startup Pitch Draft",
    createdAt: "2025-07-18T12:00:00Z",
  },
  {
    id: "1752930361513",
    title: "CSS Grid Confusion 😩",
    createdAt: "2025-07-17T10:30:00Z",
  },
  {
    id: "1752930361514",
    title: "Explain Redux Like I'm 5",
    createdAt: "2025-07-16T09:15:00Z",
  },
  {
    id: "1752930361515",
    title: "Generate Blog Ideas (AI)",
    createdAt: "2025-07-15T08:45:00Z",
  },
];

export const useChatStore = create((set) => {
  const localChatrooms = JSON.parse(localStorage.getItem("chat-rooms") || "[]");
  const localMessages = JSON.parse(
    localStorage.getItem("chat-messages") || "null"
  );

  const chatrooms =
    localChatrooms.length > 0 ? localChatrooms : sampleChatrooms;
  const messagesByRoom = localMessages || sampleMessages;

  if (!localMessages) {
    localStorage.setItem("chat-messages", JSON.stringify(sampleMessages));
  }
  if (!localChatrooms || localChatrooms.length === 0) {
    localStorage.setItem("chat-rooms", JSON.stringify(sampleChatrooms));
  }

  return {
    chatrooms,
    messagesByRoom,
    addChatrooms: (title) =>
      set((state) => {
        const newId = Date.now().toString();
        const newChatroom = {
          id: newId,
          title,
          createdAt: new Date().toISOString(),
        };
        const updated = [...state.chatrooms, newChatroom];

        localStorage.setItem("chat-rooms", JSON.stringify(updated));

        return { chatrooms: updated };
      }),

    deleteChatrooms: (id) =>
      set((state) => {
        const updatedRooms = state.chatrooms.filter((room) => room.id !== id);
        const updatedMessages = { ...state.messagesByRoom };
        delete updatedMessages[id];

        localStorage.setItem("chat-rooms", JSON.stringify(updatedRooms));
        localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));

        return {
          chatrooms: updatedRooms,
          messagesByRoom: updatedMessages,
        };
      }),

    addMessage: (chatroomId, message) =>
      set((state) => {
        const id = chatroomId.toString(); // ensure it's string
        const prevMessages = state.messagesByRoom[id] || [];
        const updatedMessages = {
          ...state.messagesByRoom,
          [id]: [...prevMessages, message],
        };

        localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));

        return {
          messagesByRoom: updatedMessages,
        };
      }),

    editChatroomTitle: (id, newTitle) =>
      set((state) => {
        const updatedRooms = state.chatrooms.map((room) =>
          room.id === id ? { ...room, title: newTitle } : room
        );

        localStorage.setItem("chat-rooms", JSON.stringify(updatedRooms));

        return { chatrooms: updatedRooms };
      }),
  };
});
