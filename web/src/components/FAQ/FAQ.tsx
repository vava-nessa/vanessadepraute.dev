import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FAQ.css";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}

function FAQItem({ question, answer, isOpen, onClick, index }: FAQItemProps) {
    return (
        <div
            className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <button
                onClick={onClick}
                className="faq-question"
                aria-expanded={isOpen}
            >
                <span className="faq-question-text">{question}</span>
                <span className={`faq-icon ${isOpen ? "faq-icon-open" : ""}`}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 5v14M5 12h14" className={`faq-icon-plus ${isOpen ? "faq-icon-hidden" : ""}`} />
                        <path d="M5 12h14" className="faq-icon-minus" />
                    </svg>
                </span>
            </button>
            <div className={`faq-answer-wrapper ${isOpen ? "faq-answer-open" : ""}`}>
                <div
                    className="faq-answer"
                    dangerouslySetInnerHTML={{
                        __html: answer.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary">$1</strong>')
                    }}
                />
            </div>
        </div>
    );
}

export function FAQ() {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqItems = t("faq.items", { returnObjects: true }) as Array<{
        question: string;
        answer: string;
    }>;

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!Array.isArray(faqItems)) return null;

    return (
        <section className="faq-section">
            <div className="faq-container">
                <div className="faq-header">
                    <span className="faq-emoji">💬</span>
                    <h2 className="faq-title">{t("faq.title")}</h2>
                    <p className="faq-subtitle">{t("faq.subtitle")}</p>
                </div>

                <div className="faq-list">
                    {faqItems.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleClick(index)}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
