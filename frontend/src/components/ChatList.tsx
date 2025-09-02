"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Message = {
  _id: string;
  chatId: string;
  sender: string;
  content: string;
  direction: "inbound" | "outbound";
  timestamp: string;
};

type Chat = {
  _id: string; // chatId
  messages: Message[];
};

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get<Chat[]>("http://localhost:5001/api/messages");
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading chats...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>

      <div className="flex flex-col gap-6">
        {chats.map((chat) => (
          <div key={chat._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Chat: {chat._id}</h3>

            <div className="flex flex-col gap-2">
              {chat.messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-3 rounded-xl max-w-[70%] ${
                    msg.direction === "inbound"
                      ? "bg-gray-200 self-start"
                      : "bg-green-500 text-white self-end"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-[10px] opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
