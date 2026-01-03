import { useState, useEffect, useRef } from "react";
import ModelViewer from "../ModelViewer/ModelViewer";
import popCatModelPath from "/pop_cat2.glb";
import { Message } from "@/components/ui/chat";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

import catgpt from "./catgpt.json";
import "./CatBot.css";
import "@/components/ui/chat.css";


// Type for message with animation state
type CatMessage = Message & {
  showGif?: boolean;
  gifTimestamp?: number;
  hasBeenAnimated?: boolean;
  animationTimestamp?: number;
};

export function CatBot() {
  try {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<CatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const generationTimeoutRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const placeholders = [
      "Are you cat ?",
      "Why hate mouses ?",
      "Meow ?",
      "How to be cat ?",
      "Why ?",
    ];

    // Clean up any pending timeouts on unmount
    useEffect(() => {
      return () => {
        try {
          if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
          }
          if (generationTimeoutRef.current !== null) {
            clearTimeout(generationTimeoutRef.current);
          }
          // Reset generating state on unmount to avoid issues next time
          setIsGenerating(false);
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

    // Focus input after message is sent or received
    useEffect(() => {
      try {
        // Focus back on input after a new message is sent or received
        if (isChatOpen && !isGenerating && inputRef.current) {
          focusInput();
        }
      } catch (error) {
        console.error("Error focusing input after message:", error);
      }
    }, [isChatOpen, messages, isGenerating]);

    // Focus when chat is opened
    useEffect(() => {
      try {
        if (isChatOpen && !isGenerating) {
          setTimeout(focusInput, 100);
        }
      } catch (error) {
        console.error("Error focusing input when chat is opened:", error);
      }
    }, [isChatOpen]);

    // Helper function to focus the input
    const focusInput = () => {
      try {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Error focusing input:", error);
      }
    };

    // Generate a random ID for messages
    const generateId = () => {
      try {
        return Math.random().toString(36).substring(2, 15);
      } catch (error) {
        console.error("Error generating ID:", error);
        return Date.now().toString();
      }
    };

    // Get the appropriate data source
    const getDataSource = () => {
      try {
        return catgpt.responses;
      } catch (error) {
        console.error("Error getting data source:", error);
        return catgpt.responses; // Fallback
      }
    };

    // Get random response from the selected data source
    const getRandomResponse = () => {
      try {
        const dataSource = getDataSource();
        const randomIndex = Math.floor(Math.random() * dataSource.length);
        return dataSource[randomIndex];
      } catch (error) {
        console.error("Error getting random response:", error);
        return "Meow? (An error occurred)";
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
        // Prevent page reload
        e.preventDefault();

        // Don't submit empty messages
        if (!input.trim()) return;

        // Add user message
        const userMessage: CatMessage = {
          id: generateId(),
          content: input,
          role: "user",
          hasBeenAnimated: false,
          animationTimestamp: undefined,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsGenerating(true);

        // Clear any existing timeout
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        // Clear any existing generation timeout
        if (generationTimeoutRef.current !== null) {
          clearTimeout(generationTimeoutRef.current);
          generationTimeoutRef.current = null;
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
              hasBeenAnimated: false,
              animationTimestamp: undefined,
            };

            // Ajouter la réponse du bot (sans condition de vérification de isGenerating)
            setMessages((prev) => [...prev, botResponse]);

            // Keep isGenerating state for 4 more seconds after message is generated
            if (generationTimeoutRef.current !== null) {
              clearTimeout(generationTimeoutRef.current);
            }

            generationTimeoutRef.current = window.setTimeout(() => {
              setIsGenerating(false);
              generationTimeoutRef.current = null;

              // Focus the input field after the 4-second delay
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 4000);
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

        // Clear any existing generation timeout
        if (generationTimeoutRef.current !== null) {
          clearTimeout(generationTimeoutRef.current);
          generationTimeoutRef.current = null;
        }

        // Si le dernier message est en cours de génération (et qu'il vient du bot), on le supprime
        if (isGenerating && messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (
            lastMessage.role === "assistant" &&
            !lastMessage.hasBeenAnimated
          ) {
            setMessages(messages.slice(0, -1));
          }
        }

        setIsGenerating(false);

        // Focus back on the input field
        setTimeout(focusInput, 10);
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

    // Réinitialiser les animations lorsque le chat est fermé
    useEffect(() => {
      // Quand le chat est ouvert après avoir été fermé, on réinitialise les animations pour les messages
      // qui ont été animés il y a plus de 5 minutes
      if (isChatOpen) {
        const now = Date.now();
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            // Si le message a une timestamp d'animation (stockée quand il a été marqué comme animé)
            // et que ça fait plus de 5 minutes, on réinitialise l'animation
            if (
              msg.animationTimestamp &&
              now - msg.animationTimestamp > 5 * 60 * 1000
            ) {
              return {
                ...msg,
                hasBeenAnimated: false,
                animationTimestamp: undefined,
              };
            }
            return msg;
          })
        );
      }
    }, [isChatOpen]);

    // Render chat messages
    const renderMessages = () => {
      try {
        return messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="catbot-message user mt-5">
                <span className="catbot-message-bubble user">
                  {message.content}
                </span>
              </div>
            );
          }

          // For assistant messages
          const currentMessage = message;

          // Pour les messages de l'assistant qui n'ont pas encore été animés
          // on ne marque comme animé qu'après un certain temps
          if (!currentMessage.hasBeenAnimated) {
            setTimeout(() => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === currentMessage.id
                    ? {
                      ...msg,
                      hasBeenAnimated: true,
                      animationTimestamp: Date.now(),
                    }
                    : msg
                )
              );
            }, 3000); // Attendre 3 secondes pour laisser l'animation se jouer
          }

          // For all assistant messages, use TypingAnimation only if not yet animated
          return (
            <div key={message.id} className="catbot-message assistant">
              {currentMessage.showGif && (
                <div className="catbot-gif-container">
                  <img
                    src={`https://cataas.com/cat/gif?t=${currentMessage.gifTimestamp}`}
                    alt="Random cat gif"
                    className={`catbot-gif ${currentMessage.hasBeenAnimated ? "no-animation" : ""
                      }`}
                    onLoad={handleGifLoaded}
                  />
                </div>
              )}

              <div className="catbot-message-bubble assistant mt-5">
                {currentMessage.hasBeenAnimated ? (
                  message.content
                ) : (
                  <TypingAnimation>{message.content}</TypingAnimation>
                )}
              </div>
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
              {/* Messages container */}
              <div
                ref={messagesContainerRef}
                className="catbot-messages-container"
              >
                {messages.length === 0 ? (
                  <div className="catbot-message assistant">
                    <span className="catbot-message-bubble assistant mt-5">
                      Meow ! I am a CatBot.
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
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  value={input}
                  className="catbot-input"
                  spellCheck={false}
                  isGenerating={isGenerating}
                  onStopGeneration={stopGeneration}
                  ref={inputRef}
                />
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
