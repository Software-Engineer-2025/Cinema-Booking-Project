import {useEffect, useState} from "react";
import TicketPricing from "./TicketPricing";
import PromosTable from "./PromosTable";
import BlackButton from "../ui/BlackButton";
import {useQuery} from "@tanstack/react-query";
import {
  allPromosQuery,
  useAddPromoCard,
  useDeletePromoCard
} from "@/lib/utils/queries";
import {MovieCreate, Promotion, PromotionCreate} from "@/client";
import {toast} from "sonner";
import {dateRegex} from "@/lib/utils/regex";

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
    start_date: "2024-06-21",
  }

  const newPromo = {
    promotion_id: -(Date.now()),
    promo_code: "",
    start_date: "",
    end_date: "",
    discount: 0,
  };

  const [promos, setPromos] = useState<Promotion[]>([
      basePromotion
  ]);

  const { data: allPromos = [], refetch: refetchPromos } = useQuery(allPromosQuery());

  useEffect(() => {
    console.log("called");
    setPromos(allPromos)
  }, [allPromos]);

  const handleUpdatePricing = (field, value) => {
    setPricing((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSavePricing = () => {

  }

  const handleAddPromo = () => {
    const maxId =
      promos.length > 0 ? Math.max(...promos.map((p) => p.promotion_id)) : 0;
    setPromos([...promos, newPromo]);
  };

  const handleUpdatePromo = (id, field, value) => {
    setPromos((prev) =>
      prev.map((p) => (p.promotion_id === id ? { ...p, [field]: value } : p))
    );
  };

  const deletePromo = useDeletePromoCard();
  const addPromo = useAddPromoCard();

  const handleDeletePromo = (id) => {
    if(id > 0) {
      deletePromo.mutate(id);
    }
    setPromos((prev) => prev.filter((p) => p.promotion_id !== id));
  };

  const isValidDate = (dateString) => {
    if (!dateRegex.test(dateString)) {
      return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
  };

  const handleSavePromo = (promo: Promotion) => {
    try {
      Object.keys(promo).forEach(key => {
        if(key != "promotion_id" && promo[key] == newPromo[key]) {
          throw new Error("Need to fill in value: " + key);
        }
        if((key == "start_date" || key == "end_date")
            && !(isValidDate(promo[key]))) {
          throw new Error("Need to have correct date structure ####-##-## and must be a valid date for " + key);
        }
      });


      const duplicate = allPromos.find(
          p => p.promo_code.toLowerCase() === promo.promo_code.toLowerCase() &&
              p.promotion_id > 0 &&
              p.promotion_id !== promo.promotion_id
      );

      if (duplicate) {
        throw new Error(`Promotion code "${promo.promo_code}" already exists`);
      }

      const passablePromo: PromotionCreate = {
        promo_code: promo.promo_code,
        start_date: promo.start_date,
        end_date: promo.end_date,
        discount: promo.discount,
      }

      if (promo.promotion_id > 0) {
        deletePromo.mutate(promo.promotion_id, {
          onSuccess: () => {
            addPromo.mutate(passablePromo, {
              onSuccess: () => {
                refetchPromos();
              },
              onError: () => {
                refetchPromos();
              }
            });
          }
        });
      } else {
        addPromo.mutate(passablePromo, {
          onSuccess: () => {
            refetchPromos();
          },
          onError: (error) => {
            refetchPromos();
          }
        });
      }
    } catch (error) {
      refetchPromos();
      toast("There was an error when trying to save the promo!", {
        description: error.message,
        action: {
          label: "done"
        }
      });
    }
  };

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
          onSave={handleSavePromo}
        />
      </div>
    </div>
  );
}
