export type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  title?: string;
  items: FAQItem[];
};

export function FAQSection({ title = "Frequently asked questions", items }: FAQSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="faq-heading" className="space-y-4">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <dl className="divide-y rounded-lg border bg-card shadow-sm">
        {items.map((item) => (
          <div key={item.question} className="p-5">
            <dt className="font-semibold text-foreground">{item.question}</dt>
            <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
