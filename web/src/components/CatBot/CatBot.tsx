import { useState, useEffect, useRef } from "react";
import ModelViewer from "../ModelViewer/ModelViewer";
import popCatModelPath from "/pop_cat2.glb";
import { Message } from "@/components/ui/chat";
import { Select } from "@/components/ui/select";
import { TypingAnimation } from "@/components/magicui/typing-animation";
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
              <div key={message.id} className="catbot-message user">
                <span className="catbot-message-bubble user">
                  {message.content}
                </span>
              </div>
            );
          }

          // For assistant messages
          const currentMessage = message;

          // For all assistant messages, use TypingAnimation
          return (
            <div key={message.id} className="catbot-message assistant">
              <div className="catbot-message-bubble assistant">
                <TypingAnimation>{message.content}</TypingAnimation>
              </div>
              {currentMessage.showGif && (
                <div className="catbot-gif-container">
                  <img
                    src={`https://cataas.com/cat/gif?t=${currentMessage.gifTimestamp}`}
                    alt="Random cat gif"
                    className="catbot-gif"
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
          <div className="catbot-chat-window">
            <div className="catbot-chat-inner">
              {/* Header */}
              <div className="catbot-header">
                <div className="catbot-header-tools">
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
                  <button className="catbot-close-btn" onClick={closeChat}>
                    ×
                  </button>
                </div>
              </div>

              {/* Messages container */}
              <div
                ref={messagesContainerRef}
                className="catbot-messages-container"
              >
                {messages.length === 0 ? (
                  <div className="catbot-message assistant">
                    <span className="catbot-message-bubble system">
                      Hello! How can I assist you today?
                    </span>
                  </div>
                ) : (
                  renderMessages()
                )}
                {isGenerating && (
                  <div className="catbot-message assistant">
                    <span className="catbot-message-bubble system">
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
              <div className="catbot-input-area">
                <form onSubmit={handleSubmit} className="catbot-form">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="catbot-input"
                    disabled={isGenerating}
                  />
                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={stopGeneration}
                      className="catbot-button stop"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`catbot-button send ${
                        !input.trim() ? "disabled" : ""
                      }`}
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
