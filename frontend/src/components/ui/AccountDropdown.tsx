"use client";
import { useEffect, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import {
  useAddPaymentCard,
  useDeletePaymentCard,
  useUpdatePaymentCard,
} from "@/lib/utils/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

interface Card {
  id?: string;
  card_id?: string;
  cardNumber?: string;
  card_last_four?: string;
  card_details?: {
    cardNumber: string;
    name: string;
    expDate: string;
    cvv: string;
  };
  name?: string;
  expDate?: string;
  cvv?: string;
}

interface ShippingAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AccountDropdownProps {
  label: string;
  type: "shipping" | "payment";
  defaultOpen?: boolean;
  className?: string;
  initialCards?: Card[];
  onShippingChange?: (address: ShippingAddress) => void;
  onSelectedCardChange?: (card: Card | null) => void;
}

export default function AccountDropdown({
  label,
  type,
  defaultOpen = false,
  className = "",
  initialCards,
  onShippingChange,
  onSelectedCardChange,
}: AccountDropdownProps) {
  const [open, setOpen] = useState(defaultOpen);
  const addPaymentCard = useAddPaymentCard();
  const deletePaymentCard = useDeletePaymentCard();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // shipping state
  const [shipping, setShipping] = useState<ShippingAddress>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // payment state
  const [cards, setCards] = useState<Card[]>(initialCards || []);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [selectedCardForPayment, setSelectedCardForPayment] = useState<number | null>(null);
  const [cardForm, setCardForm] = useState<Card>({
    cardNumber: "",
    name: "",
    expDate: "",
    cvv: "",
  });
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      setCards(initialCards);
      // Auto-select first card if available and none selected yet
      if (selectedCardForPayment === null) {
        setSelectedCardForPayment(0);
        onSelectedCardChange?.(initialCards[0]);
      }
    }
  }, [initialCards, selectedCardForPayment, onSelectedCardChange]);

  const handleSelectCard = (idx: number) => {
    setSelectedCardForPayment(idx);
    onSelectedCardChange?.(cards[idx]);
  };

  const updateShipping = (newShipping: ShippingAddress) => {
    setShipping(newShipping);
    onShippingChange?.(newShipping);
  };

  const updateCards = (newCards: Card[]) => {
    setCards(newCards);
  };

  const handleCardFormChange = (field: keyof Card, value: string) => {
    setCardForm({ ...cardForm, [field]: value });
  };

  // Add new card
  const handleSaveCard = () => {
    if (
      !cardForm.cardNumber ||
      !cardForm.name ||
      !cardForm.expDate ||
      !cardForm.cvv
    ) {
      return toast.error("Please fill in all card fields.");
    }

    // Prevent duplicates
    if (cards.some((c) => c.cardNumber === cardForm.cardNumber)) {
      return toast.error("This card is already added.");
    }

    if (!user) {
      const updatedCards = [...cards, cardForm];
      updateCards(updatedCards);
      setCardForm({ cardNumber: "", name: "", expDate: "", cvv: "" });
      setShowAddNew(false);
      return;
    }

    const payload = {
      details: {
        name: cardForm.name,
        cardNumber: cardForm.cardNumber,
        expDate: cardForm.expDate,
        cvv: cardForm.cvv,
      },
    };

    // mutation
    addPaymentCard.mutate(payload, {
      onSuccess: (newCard) => {
        if (Array.isArray(newCard)) {
          updateCards([...cards, ...newCard]);
        } else {
          updateCards([...cards, newCard]);
        }
        setCardForm({ cardNumber: "", name: "", expDate: "", cvv: "" });
        setShowAddNew(false);
        queryClient.invalidateQueries({ queryKey: ["cards"] });
        toast.success("Card saved successfully!");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to save card.");
      },
    });
  };

  // Delete card
  const handleDeleteCard = (idx: number) => {
    if (!user) {
      const updated = cards.filter((_, i) => i !== idx);
      updateCards(updated);
      return;
    }

    const card = cards[idx];
    if (!card.id) return toast.error("Card ID missing — cannot delete.");

    deletePaymentCard.mutate(card.id, {
      onSuccess: () => {
        updateCards(cards.filter((_, i) => i !== idx));
        if (selectedCardIdx === idx) handleCancel();
        queryClient.invalidateQueries({ queryKey: ["cards"] });
        toast.success("Card deleted successfully!");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to delete card.");
      },
    });
  };
  const handleAddNewCard = () => {
    setShowAddNew(true);
    setSelectedCardIdx(null);
    setCardForm({ cardNumber: "", name: "", expDate: "", cvv: "" });
  };

  return (
    <div
      className={`relative text-left font-body overflow-hidden ${className}`}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex border-b-2 border-white mb-4 justify-between items-center px-1 py-3 text-lg text-white focus:outline-none"
      >
        <span>
          {type === "shipping" ? "Shipping Address" : "Payment Methods"}
        </span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 15 15"
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* dropdown content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="rounded-b-md mb-6 flex flex-col gap-3">
          {/* shipping */}
          {type === "shipping" && (
            <div className="flex flex-col gap-2">
              <AuthInput
                type="text"
                header="Address Line 1"
                placeholder="123 Main St"
                value={shipping.address1}
                onChange={(e) =>
                  updateShipping({ ...shipping, address1: e.target.value })
                }
              />
              <AuthInput
                type="text"
                header="Address Line 2"
                placeholder="Apartment, Suite, etc."
                value={shipping.address2}
                onChange={(e) =>
                  updateShipping({ ...shipping, address2: e.target.value })
                }
              />
              <div className="flex gap-2">
                <AuthInput
                  type="text"
                  header="City"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) =>
                    updateShipping({ ...shipping, city: e.target.value })
                  }
                />
                <AuthInput
                  type="text"
                  header="State"
                  placeholder="State"
                  value={shipping.state}
                  onChange={(e) =>
                    updateShipping({ ...shipping, state: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <AuthInput
                  type="text"
                  header="Zip"
                  placeholder="ZIP"
                  value={shipping.zip}
                  onChange={(e) =>
                    updateShipping({ ...shipping, zip: e.target.value })
                  }
                />
                <AuthInput
                  type="text"
                  header="Country"
                  placeholder="Country"
                  value={shipping.country}
                  onChange={(e) =>
                    updateShipping({ ...shipping, country: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* payment */}
          {type === "payment" && (
            <div className="flex flex-col gap-2">
              {/* existing cards */}
              {cards.length > 0 &&
                cards.map((c, idx) => {
                  const lastFour = c?.card_last_four || c?.cardNumber?.slice(-4) || c?.card_details?.cardNumber?.slice(-4) || "****";
                  const isSelected = selectedCardForPayment === idx;
                  return (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-2 py-1 rounded ${
                      isSelected ? "border-white bg-white/10" : "border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="radio"
                        name="selected-card"
                        checked={isSelected}
                        onChange={() => handleSelectCard(idx)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div className="text-left">{`Card ending in ${lastFour}`}</div>
                    </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(idx)}
                        className="text-red-600 px-2 hover:text-red-800"
                      >
                        Delete
                      </button>
                  </div>
                )})}

              {/* add new card button */}
              {!showAddNew && (
                <button
                  type="button"
                  onClick={handleAddNewCard}
                  hidden={cards.length >= 3}
                  className="mt-2 bg-gray-400/60 rounded-lg text-left px-2 py-1 text-white hover:text-gray-700"
                >
                  + Add New Card
                </button>
              )}

              {/* card form */}
              {showAddNew && (
                <div className="mt-2 pt-2 flex flex-col gap-2">
                  <p className="font-bold">
                      Add New Payment Method
                  </p>
                  <AuthInput
                    type="text"
                    placeholder="Card Number"
                    value={cardForm.cardNumber}
                    onChange={(e) =>
                      handleCardFormChange("cardNumber", e.target.value)
                    }
                  />
                  <AuthInput
                    type="text"
                    placeholder="Name on Card"
                    value={cardForm.name}
                    onChange={(e) =>
                      handleCardFormChange("name", e.target.value)
                    }
                  />
                  <div className="flex gap-2 w-full">
                    <AuthInput
                      type="text"
                      placeholder="MM/YY"
                      className="flex-1"
                      value={cardForm.expDate}
                      onChange={(e) =>
                        handleCardFormChange("expDate", e.target.value)
                      }
                    />
                    <AuthInput
                      type="text"
                      className="flex-1"
                      placeholder="CVV"
                      value={cardForm.cvv}
                      onChange={(e) =>
                        handleCardFormChange("cvv", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <BlackButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveCard();
                      }}
                    >
                      Save Card Info
                    </BlackButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
