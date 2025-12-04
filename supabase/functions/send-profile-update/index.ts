// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { user_id, changes } = await req.json();

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const mailpitUrl =
    Deno.env.get("MAILPIT_URL") ?? "http://host.docker.internal:54324";

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: user, error: userError } = await supabase
    .from("userprofile")
    .select("email, first_name, last_name")
    .eq("user_id", user_id)
    .single();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const finalChanges = [...(changes ?? [])];

  if (!finalChanges.length) {
    return new Response(
      JSON.stringify({ success: true, message: "No changes to send" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const payload = {
    From: { Email: "admin@cinema.com", Name: "Cinema Admin" },
    To: [
      {
        Email: user.email,
        Name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      },
    ],
    Subject: "Your Profile Was Updated",

    HTML: `
    <p>The following changes were made to your profile:</p>
    <ul>
      ${finalChanges.map((c) => `<li>${c}</li>`).join("")}
    </ul>
  `.trim(),
  };

  const res = await fetch(`${mailpitUrl}/api/v1/send`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(
      JSON.stringify({ error: "Mailpit send failed", detail }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      emailed_to: user.email,
      changed_fields: finalChanges.length,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
