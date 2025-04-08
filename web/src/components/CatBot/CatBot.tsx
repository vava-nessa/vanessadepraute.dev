import { useState, useEffect, useRef } from "react";
import ModelViewer from "../ModelViewer/ModelViewer";
import popCatModelPath from "/pop_cat2.glb";
import { Message } from "@/components/ui/chat";
import { Select } from "@/components/ui/select";
import { TextGenerateEffect } from "../ui/text-generate-effect";

import catgpt from "./catgpt.json";
import deepcat from "./deepcat.json";
import claudecat from "./claudecat.json";
import "./CatBot.css";
import "@/components/ui/chat.css";

// Type for personality options
type PersonalityType = "catgpt" | "claudecat" | "deepcat";

// Type for message with animation state
type CatMessage = Message & {
  showGif?: boolean;
  gifTimestamp?: number;
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
    const messagesContainerRef = useRef<HTMLDivElement>(null);

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
        scrollToBottom();
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
        const delay = 400;

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

            // Determine if this response should show a GIF (50% chance)
            const showGif = Math.random() < 0.8;

            const botResponse: CatMessage = {
              id: generateId(),
              content: botResponseContent,
              role: "assistant",
              showGif: showGif,
              gifTimestamp: showGif ? Date.now() : undefined,
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

    // Fonction pour scroller vers le bas
    const scrollToBottom = (delay = 0) => {
      try {
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
          // Si messagesContainerRef existe, on peut aussi l'utiliser pour un scroll plus précis
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
              messagesContainerRef.current.scrollHeight;
          }
        }, delay);
      } catch (error) {
        console.error("Error scrolling to bottom:", error);
      }
    };

    // Gestionnaire d'événement pour quand un GIF est chargé
    const handleGifLoaded = () => {
      try {
        // Attendez un peu que le DOM se mette à jour
        scrollToBottom(50);
      } catch (error) {
        console.error("Error handling GIF load:", error);
      }
    };

    // Render chat messages
    const renderMessages = () => {
      try {
        return messages.map((message) => {
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                style={{
                  display: "block",
                  textAlign: "right",
                  marginBottom: "8px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "14px",
                    maxWidth: "80%",
                    textAlign: "left",
                  }}
                >
                  {message.content}
                </span>
              </div>
            );
          }

          // For assistant messages
          const currentMessage = message;

          // Common styles for all assistant messages
          const assistantMessageStyle = {
            display: "block",
            textAlign: "left" as const,
            marginBottom: "8px",
            width: "100%",
          };

          const assistantBubbleStyle = {
            backgroundColor: "rgb(255, 220, 246)",
            color: "white",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "14px",
            maxWidth: "80%",
            minHeight: "28px",
            textAlign: "left",
            boxShadow: "2px 2px 0px 0px #ff44c66b",
            border: "1px solid #ffbec99e",
          };

          const gifContainerStyle = {
            display: "block",
            marginTop: "8px",
            width: "100%",
          };

          const gifStyle = {
            display: "block",
            maxWidth: "100%",
            maxHeight: "150px",
            borderRadius: "6px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            filter: "blur(15px)",
            animation: "unblur-animation 3s forwards",
          };

          // For all assistant messages, use TextGenerateEffect
          return (
            <div key={message.id} style={assistantMessageStyle}>
              <div style={assistantBubbleStyle}>
                <TextGenerateEffect words={message.content} />
              </div>
              {currentMessage.showGif && (
                <div style={gifContainerStyle}>
                  <img
                    src={`https://cataas.com/cat/gif?t=${currentMessage.gifTimestamp}`}
                    alt="Random cat gif"
                    style={gifStyle}
                    onLoad={handleGifLoaded}
                  />
                </div>
              )}
            </div>
          );
        });
      } catch (error) {
        console.error("Error rendering messages:", error);
        return null;
      }
    };

    return (
      <div className="catbot_main">
        {isChatOpen && (
          <div
            style={{
              position: "fixed",
              bottom: "110px",
              right: "10px",
              width: "320px",
              margin: "0 auto",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(15px)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <style>
              {`
                @keyframes unblur-animation {
                  from { filter: blur(15px); }
                  to { filter: blur(0px); }
                }
              `}
            </style>
            <div
              style={{
                display: "block",
                height: "400px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #3f3f46",
                }}
              >
                <div style={{ display: "block", position: "relative" }}>
                  <div></div>
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      display: "inline-block",
                    }}
                  >
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
                      style={{
                        color: "#a1a1aa",
                        marginLeft: "8px",
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                      }}
                      onClick={closeChat}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages container */}
              <div
                ref={messagesContainerRef}
                style={{
                  padding: "12px",
                  height: "calc(100% - 110px)",
                  overflowY: "auto",
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      display: "block",
                      textAlign: "left",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#71717a",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "14px",
                        maxWidth: "80%",
                      }}
                    >
                      Hello! How can I assist you today?
                    </span>
                  </div>
                ) : (
                  renderMessages()
                )}
                {isGenerating && (
                  <div
                    style={{
                      display: "block",
                      textAlign: "left",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#71717a",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "14px",
                        maxWidth: "80%",
                        minHeight: "28px",
                      }}
                    >
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div
                style={{
                  padding: "8px 12px",
                  borderTop: "1px solid #3f3f46",
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "block", position: "relative" }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    style={{
                      display: "block",
                      width: "calc(100% - 70px)",
                      padding: "8px",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      backgroundColor: "#404040",
                      color: "white",
                      fontSize: "14px",
                    }}
                    disabled={isGenerating}
                  />
                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={stopGeneration}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontWeight: "bold",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        fontWeight: "bold",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: input.trim() ? "pointer" : "not-allowed",
                        opacity: input.trim() ? "1" : "0.5",
                        border: "none",
                      }}
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
        <div className="modelviewer_container">
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
