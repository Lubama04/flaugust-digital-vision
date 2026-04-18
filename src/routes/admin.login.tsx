import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-flaugust.png";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) throw redirect({ to: "/admin" });
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error("Identifiants incorrects.", { description: "Vérifiez vos accès et réessayez." });
      return;
    }
    toast.success("Connexion réussie.");
    window.location.href = "/admin";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-3">
          <img src={logo} alt="Flaugust Business" className="h-14 w-14 object-contain" />
          <div className="font-display text-xl font-bold text-primary">Flaugust Business</div>
          <h1 className="text-lg font-semibold text-foreground">Espace Administrateur</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[15px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              placeholder="contact@flaugustbusiness.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[15px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
