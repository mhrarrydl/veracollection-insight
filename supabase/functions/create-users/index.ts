import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const users = [
    { email: "veracollection@veracollection.local", password: "veraadmin123", full_name: "Vera Collection", role: "owner" },
    { email: "karyawan@veracollection.local", password: "karyawan123", full_name: "Karyawan", role: "karyawan" },
  ];

  const results = [];

  for (const u of users) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name },
    });

    if (error) {
      results.push({ email: u.email, error: error.message });
      continue;
    }

    // Update role if owner
    if (u.role === "owner" && data.user) {
      await supabaseAdmin.from("user_roles").update({ role: "owner" }).eq("user_id", data.user.id);
    }

    results.push({ email: u.email, success: true, id: data.user?.id });
  }

  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
});
