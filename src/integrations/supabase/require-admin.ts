import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "./auth-middleware";

// Requires a valid session (401 otherwise) AND admin role via is_admin() (403 otherwise).
// is_admin() runs with the caller's own token, never with the service-role client.
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await context.supabase.rpc("is_admin");
    if (error) {
      console.error("is_admin check failed", error.message);
      throw new Response("Forbidden", { status: 403 });
    }
    if (data !== true) throw new Response("Forbidden", { status: 403 });
    return next();
  });
