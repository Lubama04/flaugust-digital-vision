import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { company } from "@/data/company";
import { FadeInSection } from "@/components/FadeInSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Flaugust Business" },
      {
        name: "description",
        content:
          "Contactez Flaugust Business pour votre projet numérique. Réponse garantie sous 24h. WhatsApp, email, téléphone.",
      },
      { property: "og:title", content: "Contact — Flaugust Business" },
      {
        property: "og:description",
        content: "Discutons de votre projet — réponse garantie sous 24h.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer votre nom")
    .max(100, "Maximum 100 caractères"),
  organization: z.string().trim().max(150, "Maximum 150 caractères").optional(),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .max(255, "Maximum 255 caractères"),
  subject: z.string().min(1, "Veuillez choisir un objet"),
  budget: z.string().min(1, "Veuillez choisir un budget"),
  message: z
    .string()
    .trim()
    .min(10, "Message trop court (10 caractères minimum)")
    .max(2000, "Maximum 2000 caractères"),
});

type FormValues = z.infer<typeof schema>;

const subjects = [
  "Site web",
  "Application mobile",
  "Plateforme SaaS",
  "Agent IA",
  "Marketing digital",
  "Formation",
  "Conseil stratégique",
  "Autre",
];

const budgets = [
  "Moins de 200 000 FCFA",
  "200 000 – 500 000 FCFA",
  "500 000 FCFA – 1 000 000 FCFA",
  "Plus de 1 000 000 FCFA",
  "À définir ensemble",
];

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

      if (!serviceId || !templateId || !publicKey) {
        toast.success("Message reçu ! Nous vous répondrons dans les 24h.", {
          description:
            "(Configurez EmailJS dans .env pour activer l'envoi réel — voir .env.example)",
        });
        reset();
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          organization: data.organization ?? "—",
          subject: data.subject,
          budget: data.budget,
          message: data.message,
        },
        { publicKey },
      );
      toast.success("Message envoyé !", {
        description: "Nous vous répondrons dans les 24 heures.",
      });
      reset();
    } catch {
      toast.error("Une erreur est survenue.", {
        description: "Veuillez réessayer ou nous contacter directement par WhatsApp.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="container-page">
          <div className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Accueil
            </Link>{" "}
            <span className="mx-2">›</span> Contact
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
            Contact
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Discutons de votre projet. Réponse garantie sous 24 heures.
          </p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <FadeInSection className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8"
              noValidate
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Prénom et Nom *" error={errors.name?.message}>
                  <input className={inputCls} {...register("name")} placeholder="Votre nom" />
                </Field>
                <Field label="Organisation / Institution" error={errors.organization?.message}>
                  <input
                    className={inputCls}
                    {...register("organization")}
                    placeholder="Optionnel"
                  />
                </Field>
              </div>
              <Field label="Email *" error={errors.email?.message}>
                <input
                  type="email"
                  className={inputCls}
                  {...register("email")}
                  placeholder="vous@exemple.com"
                />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Objet du projet *" error={errors.subject?.message}>
                  <select className={inputCls} {...register("subject")} defaultValue="">
                    <option value="" disabled>
                      Sélectionnez…
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget estimatif *" error={errors.budget?.message}>
                  <select className={inputCls} {...register("budget")} defaultValue="">
                    <option value="" disabled>
                      Sélectionnez…
                    </option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Message *" error={errors.message?.message}>
                <textarea
                  rows={5}
                  className={inputCls}
                  {...register("message")}
                  placeholder="Décrivez votre projet, vos objectifs, vos délais…"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…
                  </>
                ) : (
                  <>Envoyer le message →</>
                )}
              </button>
            </form>
          </FadeInSection>

          <FadeInSection delay={0.1} className="space-y-4 lg:col-span-5">
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              iconColor="var(--color-primary)"
              label="Email professionnel"
            >
              <a
                href={`mailto:${company.email}`}
                className="text-foreground hover:text-primary"
              >
                {company.email}
              </a>
            </ContactCard>

            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              iconColor="var(--color-secondary)"
              label="Appel direct"
            >
              <a
                href={`tel:${company.phone1.replace(/\s/g, "")}`}
                className="block text-foreground hover:text-primary"
              >
                {company.phone1}
              </a>
              <a
                href={`tel:${company.phone2.replace(/\s/g, "")}`}
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                {company.phone2}
              </a>
            </ContactCard>

            <div className="rounded-xl border border-border bg-secondary-light p-5">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                  style={{ backgroundColor: "var(--color-lime)", color: "white" }}
                >
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                    WhatsApp — Réponse rapide
                  </div>
                  <div className="mt-1 font-semibold text-foreground">{company.whatsapp}</div>
                </div>
              </div>
              <a
                href={company.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-xl bg-lime py-2.5 text-center font-semibold text-white transition-opacity hover:opacity-90"
              >
                Ouvrir WhatsApp →
              </a>
            </div>

            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              iconColor="var(--color-accent)"
              label="Bureaux"
            >
              <div className="text-foreground">{company.address1}</div>
              <div className="text-sm text-muted-foreground">{company.address2}</div>
            </ContactCard>

            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title="Localisation N'Djaména"
                src="https://www.google.com/maps?q=N%27Djamena%2C+Tchad&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-accent">{error}</span>}
    </label>
  );
}

function ContactCard({
  icon,
  iconColor,
  label,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklab, ${iconColor} 15%, transparent)`, color: iconColor }}
        >
          {icon}
        </span>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
