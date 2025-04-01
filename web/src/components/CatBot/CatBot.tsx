import { useState, useEffect, useRef } from "react";

import { Chat, Message } from "@/components/ui/chat";
import { Select } from "@/components/ui/select";
import catImage from "../../assets/cat.webp";
import catBotData from "./catbotdata.json";
import angryCatData from "./angrycat.json";
import happyCatData from "./happycat.json";
import "./CatBot.css";
import "@/components/ui/chat.css";

// Type for personality options
type PersonalityType = "normal" | "angry" | "happy";

// Title mapping for different personalities
const personalityTitles: Record<PersonalityType, string> = {
  normal: "CatBot",
  angry: "GrumpyCat",
  happy: "HappyCat",
};

export function CatBot() {
  try {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [personality, setPersonality] = useState<PersonalityType>("normal");
    const timeoutRef = useRef<number | null>(null);

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
          case "angry":
            return angryCatData.responses;
          case "happy":
            return happyCatData.responses;
          case "normal":
          default:
            return catBotData.responses;
        }
      } catch (error) {
        console.error("Error getting data source:", error);
        return catBotData.responses; // Fallback to default
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

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        const userMessage: Message = {
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

            const botResponse: Message = {
              id: generateId(),
              content: getRandomResponse(),
              role: "assistant",
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsGenerating(false);
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

    return (
      <div className="catbot-container">
        {isChatOpen && (
          <div className="catbot-chat-container">
            <div className="catbot-close-button" onClick={closeChat}>
              ×
            </div>
            <div className="catbot-header">
              <h3 className="catbot-title">{personalityTitles[personality]}</h3>
              <Select
                className="catbot-select"
                value={personality}
                onChange={handlePersonalityChange}
                options={[
                  { value: "normal", label: "Normal Cat" },
                  { value: "angry", label: "Angry Cat" },
                  { value: "happy", label: "Happy Cat" },
                ]}
              />
            </div>
            <div className="catbot-chat-wrapper">
              <Chat
                messages={messages}
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isGenerating={isGenerating}
                stop={stopGeneration}
              />
            </div>
          </div>
        )}

        <img
          src={catImage}
          alt="CatBot"
          className="catbot-image"
          onClick={toggleChat}
          title="Chat with CatBot"
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering CatBot:", error);
    return null;
  }
}
