import BlackButton from "@/components/ui/BlackButton";

export default function TicketPricing({priceFields, onUpdate, onSave, prices}) {
  return (
      <div>
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Ticket Pricing</h2>
              <BlackButton onClick={onSave} className="text-white">
                  Save Pricing
              </BlackButton>
          </div>
          <div className="bg-white/5 p-6 space-y-4">
              {priceFields.map(({key, label}) => (
                  <div key={key} className="flex items-center justify-between">
                      <label className="text-lg font-medium">{label}</label>
                      <div className="flex items-center gap-2">
                          <span className="text-lg">$</span>
                          <input
                              type="text"
                              value={prices.find(p => p.price_name === key)?.amount || 0}
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
