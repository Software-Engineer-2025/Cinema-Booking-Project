"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {
  logInAction,
  updatePasswordAction,
  updateProfileAction,
} from "@/lib/actions/auth-actions";
import Button from "@/components/ui/Button";
import AccountDropdown from "@/components/ui/AccountDropdown";
import { useQuery } from "@tanstack/react-query";
import { cardsQuery } from "@/lib/utils/queries";

interface Card {
  cardNumber: string;
  name: string;
  expDate: string;
  cvv: string;
  card_id?: string;
  card_last_four?: string;
}

interface ShippingAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: userCards } = useQuery(cardsQuery());

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<Card[]>([]);
  const [promotions, setPromotions] = useState(false);

  // Load user info
  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    setFirstName(meta.first_name || "");
    setLastName(meta.last_name || "");
    setPhone(meta.phone || "");
    setShippingAddress({
      address1: meta.address1 || "",
      address2: meta.address2 || "",
      city: meta.city || "",
      state: meta.state || "",
      zip: meta.zip || "",
      country: meta.country || "",
    });
    setPromotions(meta.promotions || false);
  }, [user]);

  const handleSave = async () => {
    try {
      // Handle password change
      if (currentPassword || newPassword || repeatPassword) {
        if (!currentPassword || !newPassword || !repeatPassword) {
          return alert("Please fill out all password fields.");
        }
        if (newPassword !== repeatPassword)
          return alert("New passwords do not match.");
        const loginError = await logInAction(
          user?.email || "",
          currentPassword
        );
        if (loginError) return alert("Current password is incorrect.");
        await updatePasswordAction(newPassword);
        alert("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
      }

      console.log("what test", paymentMethods);

      // Update profile info
      const { error } = await updateProfileAction({
        first_name: firstName,
        last_name: lastName,
        phone,
        ...shippingAddress,
        promotions,
      });

      if (error) return alert(error);
      alert("Profile updated");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 text-white flex flex-col gap-10">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-sm text-white/60 mt-1">
          Manage your personal info, security, and preferences
        </p>
      </header>

      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={firstName}
            onChange={setFirstName}
          />
          <InputField
            label="Last Name"
            value={lastName}
            onChange={setLastName}
          />
          <InputField
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            className="md:col-span-2"
          />
        </div>
      </Section>

      <Section title="Security">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <div></div>
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <InputField
            label="Repeat New Password"
            type="password"
            value={repeatPassword}
            onChange={setRepeatPassword}
          />
        </div>
      </Section>

      <Section title="Payment Methods">
        <AccountDropdown
          label="Payment Methods"
          type="payment"
          initialCards={userCards?.map((card) => ({
            id: card.card_id,
            cardNumber: card.card_details.cardNumber,
            name: card.card_details.name,
            expDate: card.card_details.expDate,
            cvv: card.card_details.cvv,
          }))}
          onPaymentChange={setPaymentMethods}
        />
        <p className="text-sm text-white/60 mt-2">
          You can store up to 3 payment cards.
        </p>
      </Section>

      <Section title="Shipping Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Address Line 1"
            value={shippingAddress.address1}
            onChange={(v) => setShippingAddress((s) => ({ ...s, address1: v }))}
          />
          <InputField
            label="Address Line 2"
            value={shippingAddress.address2}
            onChange={(v) => setShippingAddress((s) => ({ ...s, address2: v }))}
          />
          <InputField
            label="City"
            value={shippingAddress.city}
            onChange={(v) => setShippingAddress((s) => ({ ...s, city: v }))}
          />
          <InputField
            label="State"
            value={shippingAddress.state}
            onChange={(v) => setShippingAddress((s) => ({ ...s, state: v }))}
          />
          <InputField
            label="ZIP Code"
            value={shippingAddress.zip}
            onChange={(v) => setShippingAddress((s) => ({ ...s, zip: v }))}
          />
          <InputField
            label="Country"
            value={shippingAddress.country}
            onChange={(v) => setShippingAddress((s) => ({ ...s, country: v }))}
          />
        </div>
      </Section>

      <Section title="Promotions & Preferences">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={promotions}
            onChange={(e) => setPromotions(e.target.checked)}
            className="w-4 h-4 accent-white cursor-pointer"
          />
          <label className="text-sm text-white/80">
            Receive promotional emails and updates
          </label>
        </div>
      </Section>

      <Button className="mt-4 self-start" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-b border-white/10 pb-10">
      <div>
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <div className="h-px w-16 bg-white/20 mt-1"></div>
      </div>
      {children}
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm text-white/80">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
      />
    </div>
  );
}
