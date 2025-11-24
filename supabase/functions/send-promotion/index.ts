// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { promo_code } = await req.json();
  if (!promo_code) {
    return new Response(JSON.stringify({ error: "promo_code required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const mailpitUrl = Deno.env.get("MAILPIT_URL") ?? "http://host.docker.internal:54324";

  const supabase = createClient(supabaseUrl, serviceKey);

  // Get promotion
  const { data: promotion, error: promoError } = await supabase
    .from("promotion")
    .select("promo_code, discount, start_date, end_date")
    .eq("promo_code", promo_code)
    .single();

  if (promoError || !promotion) {
    return new Response(JSON.stringify({ error: "Promotion not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get subscribed users
  const { data: users, error: usersError } = await supabase
    .from("userprofile")
    .select("email, first_name")
    .eq("promotion", true);

  if (usersError) {
    return new Response(JSON.stringify({ error: "Failed to load users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const recipients = (users ?? []).filter((u) => !!u.email);
  if (!recipients.length) {
    return new Response(
      JSON.stringify({ success: true, sent_to: 0, message: "No subscribed users" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Build email
  const payload = {
    From: { Email: "admin@cinema.com", Name: "Cinema Admin" },
    To: recipients.map((u) => ({
      Email: u.email!,
      Name: u.first_name ?? "",
    })),
    Subject: `New Promotion: ${promotion.promo_code}`,
    Text: `Code ${promotion.promo_code} for ${promotion.discount}% off`,
    HTML: `<p>Code <b>${promotion.promo_code}</b> for <b>${promotion.discount}%</b> off.</p>`,
  };

  const res = await fetch(`${mailpitUrl}/api/v1/send`, {
    method: "POST",
    headers: { "accept": "application/json", "content-type": "application/json" },
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
    JSON.stringify({ success: true, sent_to: recipients.length }),
    { headers: { "Content-Type": "application/json" } }
  );
});
