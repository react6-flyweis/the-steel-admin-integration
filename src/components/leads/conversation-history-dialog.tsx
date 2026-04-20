import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
// import { ChevronDown, ChevronUp } from "lucide-react";

type Lead = {
  id: string;
  name: string;
};

type ConversationMessage = {
  id: number;
  from: "lead" | "agent";
  text: string;
  time: string;
};

type ConversationThread = {
  id: string;
  status: string;
  date: string;
  messagesCount: number;
  amount: string;
  messages: ConversationMessage[];
};

type Props = {
  lead: Lead;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const mockThreads: ConversationThread[] = [
  {
    id: "CAa4336e",
    status: "Active",
    date: "18 April 2026, 4.45",
    messagesCount: 43,
    amount: "$18,000 - $30,000",
    messages: [
      {
        id: 1,
        from: "lead",
        text: "Hi, I need a quote for a 40*60 workshop in Texas.",
        time: "2024-10-10 09:30 pm",
      },
      {
        id: 2,
        from: "agent",
        text: "Hello John! I'd be happy to help you with that. Can you tell me more about the intended use and any specific requirements?",
        time: "2024-10-10 09:30 pm",
      },
      {
        id: 3,
        from: "lead",
        text: "Please do. I also need insulation and two roll-up doors.",
        time: "2024-10-10 09:36 pm",
      },
    ],
  },
  {
    id: "CAa4336f",
    status: "Pending",
    date: "17 April 2026, 1.20",
    messagesCount: 28,
    amount: "$12,000 - $22,000",
    messages: [
      {
        id: 1,
        from: "lead",
        text: "Do you also handle site preparation and foundation work?",
        time: "2024-10-09 11:10 am",
      },
      {
        id: 2,
        from: "agent",
        text: "Yes, we can include site prep and foundation options in the quote.",
        time: "2024-10-09 11:15 am",
      },
    ],
  },
  {
    id: "CAa43370",
    status: "Closed",
    date: "15 April 2026, 8.05",
    messagesCount: 61,
    amount: "$30,000 - $45,000",
    messages: [
      {
        id: 1,
        from: "lead",
        text: "Can you send the final proposal today?",
        time: "2024-10-08 02:05 pm",
      },
      {
        id: 2,
        from: "agent",
        text: "The proposal is ready and has been emailed to you.",
        time: "2024-10-08 02:20 pm",
      },
    ],
  },
];

export default function ConversationHistoryDialog({
  lead,
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-4xl h-[90vh] p-0 overflow-y-auto">
        <div className="h-full min-h-0 p-4 sm:p-5 flex flex-col">
          <DialogHeader className="space-y-1 text-left pr-10">
            <DialogTitle className="text-xl font-semibold tracking-tight text-[#111827]">
              Conversation history
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-[#374151]">
              {lead.name} • {lead.id}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 ">
            <div className="space-y-3">
              {mockThreads.map((thread) => {
                const isExpanded = expandedThreadId === thread.id;
                return (
                  <div>
                    <div
                      key={thread.id}
                      className="rounded-xl border border-[#c5cad3] "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedThreadId(isExpanded ? null : thread.id)
                        }
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="grid grid-cols-5 items-center gap-3 text-sm text-[#111827]">
                            <span className="font-medium">{thread.id}</span>
                            <Badge className="rounded-full border-0 bg-[#f0e8d8] px-3 py-0.5 text-xs font-medium text-[#b18a28] hover:bg-[#f0e8d8]">
                              {thread.status}
                            </Badge>
                            <span className="font-medium text-[#1f2937]">
                              {thread.date}
                            </span>
                            <span className="font-medium text-[#6b7280]">
                              {thread.messagesCount} Messages
                            </span>
                            <span className="font-medium text-[#2563eb]">
                              {thread.amount}
                            </span>
                          </div>
                        </div>
                        {/* {isExpanded ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-[#6b7280]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#6b7280]" />
                        )} */}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="p-5 pt-0">
                        <div className="space-y-3 border border-[#c5cad3]  px-3 py-3 sm:px-4 border-t-0 rounded-t-none  rounded-lg">
                          {thread.messages.map((message) => {
                            const isAgent = message.from === "agent";

                            return (
                              <div
                                key={message.id}
                                className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[90%] rounded-lg px-3 py-2.5 sm:max-w-[66%] ${
                                    isAgent
                                      ? "bg-[#2563eb] text-white"
                                      : "bg-[#e6e8eb] text-[#1f2937]"
                                  }`}
                                >
                                  <p className="text-sm leading-6 font-normal">
                                    {message.text}
                                  </p>
                                  <p
                                    className={`mt-1.5 text-xs ${
                                      isAgent
                                        ? "text-blue-100"
                                        : "text-[#8a9099]"
                                    }`}
                                  >
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
