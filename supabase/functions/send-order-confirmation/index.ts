// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const {
    user_id,
    movie_title,
    showtime,
    seats,
    adultTickets,
    childTickets,
    seniorTickets,
    discount,
    subtotal,
    salesTax,
    bookingFee,
    totalPrice,
  } = await req.json();

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const mailpitUrl =
    Deno.env.get("MAILPIT_URL") ?? "http://host.docker.internal:54324";

  const supabase = createClient(supabaseUrl, serviceKey);

  // Get user email
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

  // Build email
  const payload = {
    From: { Email: "admin@cinema.com", Name: "Cinema Booking System" },
    To: [
      {
        Email: user.email,
        Name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      },
    ],
    Subject: "Your Order Has Been Confirmed",

    HTML: `
    <h2>Your Order Has Been Confirmed</h2>
    <p><b>Movie:</b> ${movie_title}</p>
    <p><b>Showtime:</b> ${showtime}</p>
    <p><b>Seats:</b> ${seats.join(", ")}</p>

    <h3>Tickets</h3>
    <ul>
      ${adultTickets > 0 ? `<li>Adult: ${adultTickets}</li>` : ""}
      ${childTickets > 0 ? `<li>Child: ${childTickets}</li>` : ""}
      ${seniorTickets > 0 ? `<li>Senior: ${seniorTickets}</li>` : ""}
    </ul>

    <p><b>Subtotal:</b> $${subtotal.toFixed(2)}</p>
    <p><b>Sales Tax:</b> $${salesTax.toFixed(2)}</p>
    <p><b>Booking Fee:</b> $${bookingFee.toFixed(2)}</p>

    <h3>Total Paid: $${totalPrice}</h3>
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
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
