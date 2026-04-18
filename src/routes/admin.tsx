import { createFileRoute, Outlet, Link, redirect, useLocation, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  FileText,
  Mail,
  Star,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-flaugust.png";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    }
  },
  component: AdminLayout,
});

type LinkItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const links: LinkItem[] = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/portfolio", label: "Portfolio", icon: FolderOpen },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/testimonials", label: "Témoignages", icon: Star },
  { to: "/admin/stats", label: "Statistiques", icon: BarChart3 },
];

function AdminLayout() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");
      setUnread(count ?? 0);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const currentTitle =
    links.find((l) => (l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to)))
      ?.label ?? "Admin";

  const initials = (user?.email ?? "A").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[oklch(0.18_0.005_50)] text-white lg:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <img src={logo} alt="" className="h-8 w-8 object-contain" />
          <div>
            <div className="font-display text-base font-bold">Flaugust</div>
            <div className="text-xs text-white/60">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((l) => {
            const active = l.exact
              ? location.pathname === l.to
              : location.pathname.startsWith(l.to);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to as string}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-l-[3px] border-primary bg-primary/30 font-semibold text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{l.label}</span>
                {l.to === "/admin/messages" && unread > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-2 truncate text-xs text-white/50">{user?.email}</div>
          <button
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/admin/login" });
            }}
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-lg font-bold text-foreground">{currentTitle}</h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-primary md:inline-flex"
            >
              Voir le site <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-white">
              {initials}
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
