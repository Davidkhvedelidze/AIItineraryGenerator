import { MessageCircle } from "lucide-react";

type WhatsAppFloatingButtonProps = {
  pageUrl: string;
};

export function WhatsAppFloatingButton({ pageUrl }: WhatsAppFloatingButtonProps) {
  const message = `Hi! I have a question about my Georgia itinerary: ${pageUrl}`;
  const whatsappUrl = `https://wa.me/995551181358?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:bottom-8 sm:right-8"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}
