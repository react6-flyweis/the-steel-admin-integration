import { useState } from "react";
import ChatArea from "@/components/communication/chat-area";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const aiAssistant = {
  id: "ai-assistant",
  name: "AI Assistant",
  type: "department" as const,
  subtitle: "Smart AI-powered chat",
  icon: "AI",
  iconBgColor: "bg-indigo-500",
  phone: "+1234567890", // set your default dial number
};

export default function AIChatPage() {
  //   const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-msg-1",
      sender: "AI Assistant",
      text: "Hello! I’m your AI assistant. Ask me anything about your project or status.",
      time: new Date().toLocaleTimeString(),
      isMe: false,
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "You",
      text: trimmed,
      time: new Date().toLocaleTimeString(),
      isMe: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: `ai-${Date.now()}`,
        sender: "AI Assistant",
        text: `Got it! You said: "${trimmed}". If you want, I can suggest next steps or summaries.`,
        time: new Date().toLocaleTimeString(),
        isMe: false,
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  const handleCallClick = () => {
    const phone = aiAssistant.phone?.trim();
    if (!phone) return;

    const telUrl = `tel:${encodeURIComponent(phone)}`;
    window.location.href = telUrl;
  };

  const augmentedMessages = isTyping
    ? [
        ...messages,
        {
          id: "ai-typing",
          sender: "AI Assistant",
          text: "AI is typing...",
          time: "",
          isMe: false,
        },
      ]
    : messages;

  return (
    <div className="p-5 min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Chat</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Talk to the AI assistant for quick answers, summaries and tips.
          </p>
        </div>
        {/* <Button variant="outline" onClick={() => navigate("/communication")}>
          Back to Communication
        </Button> */}
      </div>

      <div className="h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ChatArea
          selectedChat={aiAssistant}
          messages={augmentedMessages}
          messageInput={messageInput}
          onMessageInputChange={setMessageInput}
          onSendMessage={handleSendMessage}
          onCallClick={handleCallClick}
        />
      </div>
    </div>
  );
}
