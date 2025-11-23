import {useEffect, useState} from "react";
import TicketPricing from "./TicketPricing";
import PromosTable from "./PromosTable";
import BlackButton from "../ui/BlackButton";
import {useQuery} from "@tanstack/react-query";
import {allMoviesQuery} from "@/lib/utils/queries";

export default function PriceTab() {
  const [pricing, setPricing] = useState({
    bookingFee: 2.5,
    childPrice: 8.0,
    adultPrice: 12.0,
    seniorPrice: 10.0,
  });

  const [promos, setPromos] = useState([
    {
      promo_id: 1,
      promo_code: "SUMMER2024",
      expiration_date: "2024-12-31",
      discount: 15,
    },
  ]);

  const handleUpdatePricing = (field, value) => {
    setPricing((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSavePricing = () => {

  }

  const handleAddPromo = () => {
    const maxId =
      promos.length > 0 ? Math.max(...promos.map((p) => p.promo_id)) : 0;
    const newPromo = {
      promo_id: maxId + 1,
      promo_code: "",
      expiration_date: "",
      discount: 0,
    };
    setPromos([...promos, newPromo]);
  };

  const handleUpdatePromo = (id, field, value) => {
    setPromos((prev) =>
      prev.map((p) => (p.promo_id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDeletePromo = (id) => {
    setPromos((prev) => prev.filter((p) => p.promo_id !== id));
  };

  const { data: allPromos = [], refetch: refetchPromos } = useQuery(allPromosQuery());

  useEffect(() => {
    setPromos(allPromos);
  }, [allPromos]);

  return (
    <div className="space-y-8">
      <TicketPricing pricing={pricing} onUpdate={handleUpdatePricing} onSave={handleSavePricing}/>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Promo Codes</h2>
          <BlackButton onClick={handleAddPromo} className="text-white">
            + Add Promo
          </BlackButton>
        </div>
        <PromosTable
          promos={promos}
          onUpdate={handleUpdatePromo}
          onDelete={handleDeletePromo}
        />
      </div>
    </div>
  );
}
