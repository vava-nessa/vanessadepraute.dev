import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface Accordion05Props {
  items: FAQItem[];
  defaultValue?: string;
}

export function Accordion05({ items, defaultValue = "1" }: Accordion05Props) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" defaultValue={defaultValue} collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="last:border-b">
            <AccordionTrigger className="text-left pl-6 md:pl-14 overflow-hidden duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 [&>svg]:hidden">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs text-muted-foreground transition-colors">{item.id}</p>
                <h1
                  className={cn(
                    "uppercase relative text-left text-3xl md:text-5xl text-muted-foreground transition-colors"
                  )}
                >
                  {item.question}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground pb-6 pl-6 md:px-20">
              <div
                dangerouslySetInnerHTML={{
                  __html: item.answer.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary">$1</strong>')
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
