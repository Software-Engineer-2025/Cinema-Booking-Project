export default function TicketPricing({ pricing, onUpdate }) {
  const priceFields = [
    { key: "bookingFee", label: "Booking Fee" },
    { key: "childPrice", label: "Child Ticket" },
    { key: "adultPrice", label: "Adult Ticket" },
    { key: "seniorPrice", label: "Senior Ticket" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Ticket Pricing</h2>
      <div className="bg-white/5 p-6 space-y-4">
        {priceFields.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-lg font-medium">{label}</label>
            <div className="flex items-center gap-2">
              <span className="text-lg">$</span>
              <input
                type="text"
                value={pricing[key]}
                onChange={(e) => onUpdate(key, e.target.value)}
                className="border rounded px-3 py-2 w-32 text-right bg-white/50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
