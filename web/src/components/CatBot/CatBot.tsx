import { useState, useEffect, useRef } from "react";
import ModelViewer from "../ModelViewer/ModelViewer";
import popCatModelPath from "/pop_cat2.glb";
import { Message } from "@/components/ui/chat";
import { Select } from "@/components/ui/select";
import { TypingAnimation } from "@/registry/magicui/terminal";

import catgpt from "./catgpt.json";
import deepcat from "./deepcat.json";
import claudecat from "./claudecat.json";
import "./CatBot.css";
import "@/components/ui/chat.css";

// Type for personality options
type PersonalityType = "catgpt" | "claudecat" | "deepcat";

// Type for message with animation state
type CatMessage = Message & {
  animationShown?: boolean;
};

export function CatBot() {
  try {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<CatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [personality, setPersonality] = useState<PersonalityType>("catgpt");
    const timeoutRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Clean up any pending timeouts on unmount
    useEffect(() => {
      return () => {
        try {
          if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
          }
        } catch (error) {
          console.error("Error clearing timeout:", error);
        }
      };
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
      try {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error scrolling to bottom:", error);
      }
    }, [messages, isGenerating]);

    // Focus input when chat opens
    useEffect(() => {
      try {
        if (isChatOpen && inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Error focusing input:", error);
      }
    }, [isChatOpen]);

    // Focus input after message is sent or received
    useEffect(() => {
      try {
        // Focus back on input after a new message is sent or received
        if (isChatOpen && !isGenerating && inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Error focusing input after message:", error);
      }
    }, [isChatOpen, messages, isGenerating]);

    // Generate a random ID for messages
    const generateId = () => {
      try {
        return Math.random().toString(36).substring(2, 15);
      } catch (error) {
        console.error("Error generating ID:", error);
        return Date.now().toString();
      }
    };

    // Get the appropriate data based on personality
    const getDataSource = () => {
      try {
        switch (personality) {
          case "claudecat":
            return claudecat.responses;
          case "deepcat":
            return deepcat.responses;
          case "catgpt":
          default:
            return catgpt.responses;
        }
      } catch (error) {
        console.error("Error getting data source:", error);
        return catgpt.responses; // Fallback to default
      }
    };

    // Get random response from the selected data source
    const getRandomResponse = () => {
      try {
        const responses = getDataSource();
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
      } catch (error) {
        console.error("Error getting random response:", error);
        return "Meow?";
      }
    };

    // Generate random delay between 500ms and 2000ms
    const getRandomDelay = () => {
      try {
        return Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
      } catch (error) {
        console.error("Error generating random delay:", error);
        return 1000; // Default to 1 second if there's an error
      }
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      try {
        setInput(e.target.value);
      } catch (error) {
        console.error("Error handling input change:", error);
      }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();

        // Don't submit empty messages
        if (!input.trim()) return;

        // Add user message
        const userMessage: CatMessage = {
          id: generateId(),
          content: input,
          role: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsGenerating(true);

        // Clear any existing timeout
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        // Generate CatBot response after random delay
        const delay = getRandomDelay();

        // Store the timeout ID so we can clean it up if needed
        timeoutRef.current = window.setTimeout(() => {
          try {
            timeoutRef.current = null;
            let botResponseContent = "";

            try {
              botResponseContent = getRandomResponse();
            } catch (error) {
              console.error("Error getting random response:", error);
              botResponseContent = "Meow? (An error occurred)";
            }

            const botResponse: CatMessage = {
              id: generateId(),
              content: botResponseContent,
              role: "assistant",
              animationShown: false,
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsGenerating(false);

            // Focus input after adding response
            if (inputRef.current) {
              inputRef.current.focus();
            }
          } catch (error) {
            console.error("Error generating bot response:", error);
            setIsGenerating(false);
          }
        }, delay);
      } catch (error) {
        console.error("Error submitting message:", error);
        setIsGenerating(false);
      }
    };

    const stopGeneration = () => {
      try {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsGenerating(false);
      } catch (error) {
        console.error("Error stopping generation:", error);
      }
    };

    const toggleChat = () => {
      try {
        setIsChatOpen(!isChatOpen);
      } catch (error) {
        console.error("Error toggling chat:", error);
      }
    };

    const closeChat = (e: React.MouseEvent) => {
      try {
        e.stopPropagation(); // Prevent event from bubbling up
        setIsChatOpen(false);
      } catch (error) {
        console.error("Error closing chat:", error);
      }
    };

    // Handle personality change
    const handlePersonalityChange = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      try {
        const newPersonality = e.target.value as PersonalityType;
        setPersonality(newPersonality);
      } catch (error) {
        console.error("Error changing personality:", error);
      }
    };

    // Handle Escape key to close chat
    useEffect(() => {
      try {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape" && isChatOpen) {
            setIsChatOpen(false);
          }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      } catch (error) {
        console.error("Error setting up keyboard listener:", error);
      }
    }, [isChatOpen]);

    // Render chat messages
    const renderMessages = () => {
      try {
        return messages.map((message) => {
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className="chat-message self-end bg-blue-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm"
              >
                {message.content}
              </div>
            );
          }

          // For assistant messages
          const currentMessage = message;
          if (currentMessage.animationShown === false) {
            // Update the animation state so it's only shown once
            currentMessage.animationShown = true;

            return (
              <div
                key={message.id}
                className="chat-message self-start bg-zinc-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm min-h-[28px]"
              >
                <TypingAnimation delay={0}>{message.content}</TypingAnimation>
              </div>
            );
          }

          // For messages that have already shown animation
          return (
            <div
              key={message.id}
              className="chat-message self-start bg-zinc-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm min-h-[28px]"
            >
              {message.content}
            </div>
          );
        });
      } catch (error) {
        console.error("Error rendering messages:", error);
        return null;
      }
    };

    return (
      <div className="catbot-container">
        {isChatOpen && (
          <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col h-[400px]">
              <div className="px-4 py-3 border-b dark:border-zinc-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                    CatGPT
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Online
                    </div>
                    <Select
                      className="catbot-select text-sm"
                      value={personality}
                      onChange={handlePersonalityChange}
                      options={[
                        { value: "catgpt", label: "CatGPT 4.5" },
                        { value: "claudecat", label: "CatClaude Sonnet 3.7" },
                        { value: "deepcat", label: "DeepCat R3" },
                      ]}
                    />
                    <button
                      className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-white"
                      onClick={closeChat}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
                {messages.length === 0 ? (
                  <>
                    <div className="chat-message self-start bg-zinc-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm min-h-[28px]">
                      Hello! How can I assist you today?
                    </div>
                  </>
                ) : (
                  renderMessages()
                )}
                {isGenerating && (
                  <div className="chat-message self-start bg-zinc-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm min-h-[28px]">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-3 py-2 border-t dark:border-zinc-700">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
                    disabled={isGenerating}
                  />
                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={stopGeneration}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
                      disabled={!input.trim() || isGenerating}
                    >
                      Send
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
        <div style={{ border: "1px solid transparent" }}>
          <ModelViewer
            playAnimation={isChatOpen}
            modelPath={popCatModelPath}
            height="150px"
            width="150px"
            onClick={toggleChat}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering CatBot:", error);
    return null;
  }
}
