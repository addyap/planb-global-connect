import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/contact";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const { t } = useTranslation();
  const msg = encodeURIComponent(t("contact.whatsappPrefill"));
  const href = `https://wa.me/${CONTACT.whatsapp}?text=${msg}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-elegant hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" fill="white" />
    </a>
  );
};
