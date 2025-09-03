"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Clock } from "lucide-react";

type Message = {
  _id: string;
  chatId: string;
  sender: string;
  content: string;
  direction: "inbound" | "outbound";
  timestamp: string;
};

type Chat = {
  _id: string; 
  messages: Message[];
};

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setError(null);
        const res = await axios.get<Chat[]>("http://import.meta.env.VITE_API_URL;/api/messages");
        setChats(res.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load chats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Chats</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-3/4 ml-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Chats</h1>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Chats</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No chats found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Chats</h1>
        <Badge variant="secondary" className="ml-auto">
          {chats.length} chat{chats.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-6">
        {chats.map((chat) => (
          <Card key={chat._id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-4 w-4" />
                Chat: {chat._id}
                <Badge variant="outline" className="ml-auto">
                  {chat.messages?.length || 0} messages
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-64 w-full pr-4">
                <div className="space-y-3">
                  {chat.messages?.length > 0 ? (
                    chat.messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.direction === "inbound" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                            msg.direction === "inbound"
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-1 mt-2 opacity-70">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No messages in this chat
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatList;