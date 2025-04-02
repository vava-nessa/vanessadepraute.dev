import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import { TypingAnimation } from "@/components/magicui/typing-animation";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

interface ChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isGenerating?: boolean;
  stop?: () => void;
  className?: string;
}

export function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isGenerating = false,
  stop,
  className,
}: ChatProps) {
  try {
    return (
      <ChatContainer className={className}>
        <ChatMessages>
          <MessageList messages={messages} isTyping={isGenerating} />
        </ChatMessages>
        <ChatForm handleSubmit={handleSubmit} isPending={isGenerating}>
          {() => (
            <MessageInput
              value={input}
              onChange={handleInputChange}
              isGenerating={isGenerating}
              stop={stop}
            />
          )}
        </ChatForm>
      </ChatContainer>
    );
  } catch (error) {
    console.error("Error rendering Chat:", error);
    return null;
  }
}

export function ChatContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  try {
    return (
      <div className={cn("flex flex-col flex-1 w-full h-full", className)}>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Error rendering ChatContainer:", error);
    return null;
  }
}

export function ChatMessages({ children }: { children: React.ReactNode }) {
  try {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
        {children}
      </div>
    );
  } catch (error) {
    console.error("Error rendering ChatMessages:", error);
    return null;
  }
}

export function MessageList({
  messages,
  isTyping,
}: {
  messages: Message[];
  isTyping: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error scrolling to bottom:", error);
    }
  }, [messages]);

  try {
    return (
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          // User messages don't need typing animation
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[85%] text-sm",
                  "ml-auto bg-primary text-primary-foreground px-3 py-2 rounded-lg"
                )}
              >
                {message.content}
              </div>
            );
          }

          // Assistant messages use typing animation
          return (
            <TypingAnimation
              key={message.id}
              className={cn(
                "flex max-w-[85%] text-sm bg-muted px-3 py-2 rounded-lg"
              )}
              duration={30}
              delay={300}
            >
              {message.content}
            </TypingAnimation>
          );
        })}
        {isTyping && (
          <div className="bg-muted w-max max-w-[85%] px-3 py-2 rounded-lg">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MessageList:", error);
    return null;
  }
}

export function ChatForm({
  handleSubmit,
  isPending,
  children,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  children: () => React.ReactNode;
}) {
  try {
    return (
      <form
        onSubmit={(e) => {
          try {
            handleSubmit(e);
          } catch (error) {
            console.error("Error in form submission:", error);
          }
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        {children()}
      </form>
    );
  } catch (error) {
    console.error("Error rendering ChatForm:", error);
    return null;
  }
}

export function MessageInput({
  value,
  onChange,
  isGenerating,
  stop,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isGenerating?: boolean;
  stop?: () => void;
}) {
  try {
    // Handle Enter key press to submit the form
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      try {
        // Submit on Enter without Shift key
        if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
          e.preventDefault();
          const form = e.currentTarget.form;
          if (form && value.trim()) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }
        }
      } catch (error) {
        console.error("Error handling key down:", error);
      }
    };

    return (
      <>
        <textarea
          value={value}
          onChange={(e) => {
            try {
              onChange(e);
            } catch (error) {
              console.error("Error in input change:", error);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-full px-4 py-2 border bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[40px] max-h-[120px]"
          rows={1}
          disabled={isGenerating}
        />
        {isGenerating && stop ? (
          <button
            type="button"
            onClick={() => {
              try {
                stop();
              } catch (error) {
                console.error("Error stopping generation:", error);
              }
            }}
            className="rounded-full w-10 h-10 flex items-center justify-center bg-destructive text-white"
          >
            ⨯
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-full w-10 h-10 flex items-center justify-center bg-primary text-white"
            disabled={!value.trim() || isGenerating}
          >
            →
          </button>
        )}
      </>
    );
  } catch (error) {
    console.error("Error rendering MessageInput:", error);
    return null;
  }
}
