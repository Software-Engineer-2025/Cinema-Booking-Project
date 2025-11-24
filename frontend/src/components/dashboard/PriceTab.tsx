import {useEffect, useState} from "react";
import TicketPricing from "./TicketPricing";
import PromosTable from "./PromosTable";
import BlackButton from "../ui/BlackButton";
import {useQuery} from "@tanstack/react-query";
import {
  allPricesQuery,
  allPromosQuery, useAddPriceCard,
  useAddPromoCard, useDeletePriceCard,
  useDeletePromoCard
} from "@/lib/utils/queries";
import {MovieCreate, Price, PriceCreate, Promotion, PromotionCreate} from "@/client";
import {toast} from "sonner";
import {dateRegex} from "@/lib/utils/regex";
import {isNumber} from "node:util";

export default function PriceTab() {

  const priceFields = [
    { key: "bookingFee", label: "Booking Fee" },
    { key: "childTicket", label: "Child Ticket" },
    { key: "adultTicket", label: "Adult Ticket" },
    { key: "seniorTicket", label: "Senior Ticket" },
  ];

  const [prices, setPrices] = useState<Price[]>([
      {
        price_id: 0,
        price_name: "bookingFee",
        amount: 0
      },
      {
        price_id: 1,
        price_name: "childTicket",
        amount: 0
      },
      { price_id: 2,
        price_name: "adultTicket",
        amount: 0
      },
      {
        price_id: 3,
        price_name: "seniorTicket",
        amount: 0
      }
  ]);


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
    setPromos(allPromos)
  }, [allPromos]);

  const { data: allPrices = [], refetch: refetchPrices } = useQuery(allPricesQuery());

  useEffect(() => {
    if(allPrices.length > 0) {
      setPrices(allPrices);
    }
  }, [allPrices]);

  const handleUpdatePricing = (field, value) => {
    setPrices(prevPrices =>
        prevPrices.map(price =>
            price.price_name === field
                ? { ...price, amount: value }
                : price
        )
    );
  };

  const deletePrice = useDeletePriceCard();
  const addPrice = useAddPriceCard();

  // Handles the changed to the prices in the correct order and sequentially so that it allows all changes to happen.
  const handleAsyncPriceChange = async (price) => {
    const currentPrice = prices.find(p => p.price_name === price.key);

    if (!currentPrice) {
      throw new Error(`Price not found for ${price.key}`);
    }

    const passablePrice: PriceCreate = {
      price_name: price.key,
      amount: currentPrice.amount
    };

    try {
      await deletePrice.mutateAsync(currentPrice.price_id);

      await addPrice.mutateAsync(passablePrice);
    } catch (error) {
      throw error;
    }
  }

  const handleSavePricing = async () => {
    try {
      for (const price of priceFields) {
        await handleAsyncPriceChange(price);
      }
      toast("The prices have been updated!", {
        description: "They are now able to be seen throughout the webapp.",
        action: {
          label: "done"
        }
      });
    } catch (error) {
      refetchPrices();
      toast("There was an error when trying to save the prices!", {
        description: error.message,
        action: {
          label: "done"
        }
      });
    }
    refetchPrices();
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
      deletePromo.mutate(id, {
        onSuccess: () => {
          toast("Promo deleted!", {
            description: `Promo id: ${id}, has been deleted.`,
            action: {
              label: "done"
            }
          });
          setPromos((prev) => prev.filter((p) => p.promotion_id !== id));
        },
        onError: () => {
          toast("The promo has failed to be deleted!", {
            description: `Promo id: ${id}, persists`,
            action: {
              label: "done"
            }
          });
        }
      });
    } else {
      setPromos((prev) => prev.filter((p) => p.promotion_id !== id));
      toast("The unsaved promo has been deleted!", {
        description: "Its not in the database, dont worry.",
        action: {
          label: "done"
        }
      });
    }
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
      // checks values if its empty or valid
      Object.keys(promo).forEach(key => {
        if(key != "promotion_id" && promo[key] == newPromo[key]) {
          throw new Error("Need to fill in value: " + key);
        }
        if((key == "start_date" || key == "end_date")
            && !(isValidDate(promo[key]))) {
          throw new Error("Need to have correct date structure ####-##-## and must be a valid date for " + key);
        }
      });

      // checks for duplicate promos
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

      // if promotion name is already in the database
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
        toast("Promo has been saved!", {
          description: "The values have been changed and updates should be able to be seen.",
          action: {
            label: "done"
          }
        });
      } else { // if the promotion name is not in the database already
        addPromo.mutate(passablePromo, {
          onSuccess: () => {
            refetchPromos();
          },
          onError: (error) => {
            refetchPromos();
          }
        });
        toast("Promo has been saved!", {
          description: "The promo is now available to be used and is in the database.",
          action: {
            label: "done"
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
      <TicketPricing priceFields={priceFields} onUpdate={handleUpdatePricing} onSave={handleSavePricing} prices={prices}/>

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
