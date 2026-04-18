import { MessageCircle } from "lucide-react";
import { company } from "@/data/company";

export function WhatsAppButton() {
  return (
    <a
      href={company.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110"
      aria-label="WhatsApp"
    >
      <span className="whatsapp-pulse absolute inset-0 rounded-full" aria-hidden />
      <MessageCircle className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
        Discutez avec nous sur WhatsApp
      </span>
    </a>
  );
}
