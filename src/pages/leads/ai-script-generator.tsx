import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Menu, Sparkles, Mail, Phone, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import FollowUpDialog from "@/components/follow-up/follow-up-dialog";
import { useFollowUpAiScriptsQuery } from "@/modules/followups/followups.hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

type ScriptItem = {
  id: string;
  name: string;
  type: "mail" | "phone";
  text: string;
  time: string;
  tag: {
    label: string;
    color: string;
  };
  createdAt?: string;
};

const toneClassByLabel: Record<string, string> = {
  professional: "bg-blue-100 text-blue-700",
  friendly: "bg-green-100 text-green-700",
  urgent: "bg-red-100 text-red-700",
};

function getScriptText(item: {
  script?: string;
  message?: string;
  content?: string;
  generatedScript?: string;
}) {
  return (
    item.script?.trim() ||
    item.generatedScript?.trim() ||
    item.content?.trim() ||
    item.message?.trim() ||
    ""
  );
}

function getRelativeTime(value?: string) {
  if (!value) {
    return "Recently";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const deltaInMinutes = Math.round((timestamp - Date.now()) / (1000 * 60));
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(deltaInMinutes) < 60) {
    return formatter.format(deltaInMinutes, "minute");
  }

  const deltaInHours = Math.round(deltaInMinutes / 60);
  if (Math.abs(deltaInHours) < 24) {
    return formatter.format(deltaInHours, "hour");
  }

  const deltaInDays = Math.round(deltaInHours / 24);
  return formatter.format(deltaInDays, "day");
}

export default function AiScriptGeneratorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const {
    data: aiScriptsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useFollowUpAiScriptsQuery();

  const scripts = useMemo<ScriptItem[]>(() => {
    const items = aiScriptsResponse?.data.scripts ?? [];

    return items.reduce<ScriptItem[]>((acc, item, index) => {
      const text = getScriptText(item);
      if (!text) {
        return acc;
      }

      const tagLabel = (item.tone || item.followupType || "professional")
        .trim()
        .toLowerCase();

      acc.push({
        id: item._id || item.id || `script-${index}`,
        name:
          item.customerName?.trim() ||
          item.customerId?.firstName?.trim() ||
          "Customer",
        type:
          item.channel?.toLowerCase() === "call" ||
          item.channel?.toLowerCase() === "phone"
            ? "phone"
            : "mail",
        text,
        time: getRelativeTime(item.createdAt),
        tag: {
          label: tagLabel,
          color: toneClassByLabel[tagLabel] ?? "bg-slate-100 text-slate-700",
        },
        createdAt: item.createdAt,
      });

      return acc;
    }, []);
  }, [aiScriptsResponse]);

  const effectiveSelectedScriptId =
    selectedScriptId && scripts.some((script) => script.id === selectedScriptId)
      ? selectedScriptId
      : (scripts[0]?.id ?? null);

  const selectedScript = useMemo(
    () => scripts.find((item) => item.id === effectiveSelectedScriptId) ?? null,
    [scripts, effectiveSelectedScriptId],
  );

  const messagesToRender = selectedScript
    ? [
        {
          id: `${selectedScript.id}-ai`,
          text: selectedScript.text,
          sender: "ai" as const,
          timestamp: selectedScript.createdAt
            ? new Date(selectedScript.createdAt)
            : new Date(),
        },
        ...messages,
      ]
    : [];

  const handleSendMessage = () => {
    if (!selectedScript || !inputMessage.trim()) {
      return;
    }

    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for your message. I'm processing your request...",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="bg-teal-400 text-white px-6 py-3 shadow-sm">
        <h1 className="text-lg font-medium">AI Follow-Up Script Generator</h1>
      </div>

      {/* Main Content */}
      <div className=" p-6">
        {/* Chat Header */}
        <Card className="bg-white shadow-sm mb-4 py-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-120 p-2 bg-white rounded-lg shadow-md">
                  <div className="space-y-2">
                    {scripts.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "border rounded-lg p-3 bg-white cursor-pointer",
                          effectiveSelectedScriptId === item.id &&
                            "border-blue-300 ring-1 ring-blue-200",
                        )}
                        onClick={() => {
                          setSelectedScriptId(item.id);
                          setMessages([]);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex  gap-3">
                            <div className="flex  justify-center w-8 h-8 mt-1">
                              {item.type === "mail" ? (
                                <Mail className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Phone className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <span
                                  className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${item.tag.color}`}
                                >
                                  {item.tag.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate max-w-100 whitespace-pre-wrap">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {item.time}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1 rounded hover:bg-gray-100"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void navigator.clipboard.writeText(item.text);
                              }}
                            >
                              <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100">
                              <Send className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {scripts.length === 0 && !isLoading && !isError ? (
                      <div className="border rounded-lg p-3 bg-white text-sm text-gray-500">
                        {aiScriptsResponse?.data.message ||
                          "No follow-ups scheduled for today"}
                      </div>
                    ) : null}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <h2 className="font-medium text-gray-900">
                AI Follow-Up Script Generator
              </h2>
            </div>

            <FollowUpDialog showClientSelector={true}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Sparkles className="h-4 w-4" />
                Use Script
              </Button>
            </FollowUpDialog>
          </div>

          {/* Messages Container */}
          <div className="p-6 space-y-4 min-h-125 max-h-125 overflow-y-auto">
            {isLoading ? (
              <div className="h-full min-h-105 flex items-center justify-center text-sm text-gray-500">
                Loading AI scripts...
              </div>
            ) : isError ? (
              <div className="h-full min-h-105 flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-600">
                  {getApiErrorMessage(error, "Failed to load AI scripts.")}
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            ) : messagesToRender.length === 0 ? (
              <div className="h-full min-h-105 flex items-center justify-center text-sm text-gray-500 text-center">
                {aiScriptsResponse?.data.message ||
                  "No follow-ups scheduled for today"}
              </div>
            ) : (
              messagesToRender.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-start" : "justify-end",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3",
                      message.sender === "user"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-blue-600 text-white",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white"
                disabled={!selectedScript || isLoading || isError}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                disabled={!selectedScript || isLoading || isError}
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
