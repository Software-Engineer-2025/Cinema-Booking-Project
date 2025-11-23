import {useEffect, useState} from "react";
import TicketPricing from "./TicketPricing";
import PromosTable from "./PromosTable";
import BlackButton from "../ui/BlackButton";
import {useQuery} from "@tanstack/react-query";
import {allPromosQuery} from "@/lib/utils/queries";
import {Promotion} from "@/client";

export default function PriceTab() {
  const [pricing, setPricing] = useState({
    bookingFee: 2.5,
    childPrice: 8.0,
    adultPrice: 12.0,
    seniorPrice: 10.0,
  });

  const basePromotion: Promotion = {
    discount: 15,
    end_date: "2024-12-31",
    promo_code: "SUMMER2024",
    promotion_id: -1,
    start_date: "2024-6-21",
  }

  const [promos, setPromos] = useState<Promotion[]>([
      basePromotion
  ]);

  const handleUpdatePricing = (field, value) => {
    setPricing((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSavePricing = () => {

  }

  const handleAddPromo = () => {
    const maxId =
      promos.length > 0 ? Math.max(...promos.map((p) => p.promotion_id)) : 0;
    const newPromo = {
      promotion_id: -(Date.now()),
      promo_code: "",
      start_date: "",
      end_date: "",
      discount: 0,
    };
    setPromos([...promos, newPromo]);
  };

  const handleUpdatePromo = (id, field, value) => {
    setPromos((prev) =>
      prev.map((p) => (p.promotion_id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDeletePromo = (id) => {
    setPromos((prev) => prev.filter((p) => p.promotion_id !== id));
  };

  const { data: allPromos = [], refetch: refetchPromos } = useQuery(allPromosQuery());

  console.log(allPromos)

  useEffect(() => {
    setPromos(allPromos)
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
