import { useTranslation } from "react-i18next";
import { Accordion05 } from "@/components/ui/accordion-05";
import "./FAQ.css";

export function FAQ() {
  const { t } = useTranslation();

  const faqItems = t("faq.items", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  if (!Array.isArray(faqItems)) return null;

  // Transform items to match the Accordion05 format
  const transformedItems = faqItems.map((item, index) => ({
    id: String(index + 1),
    question: item.question,
    answer: item.answer,
  }));

  return (
    <section className="faq-section">
      <div className="faq-container-new">
        <div className="faq-header">
          <h2 className="faq-title">{t("faq.title")}</h2>
          <p className="faq-subtitle">{t("faq.subtitle")}</p>
        </div>

        <Accordion05 items={transformedItems} defaultValue="1" />
      </div>
    </section>
  );
}

export default FAQ;
