"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import AccountDropdown from "@/components/ui/AccountDropdown";
import Link from "next/link";
import { useAuth, CreateUserParams } from "@/lib/context/AuthContext";
import { toast } from "sonner"

interface Card {
  cardNumber: string;
  name: string;
  expDate: string;
  cvv: string;
}

interface ShippingAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CreateAccount() {
  const { signUp, isLoading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<Card[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toast("Passwords do not match!", {
        description: "please ensure password and repeat password match.",
        action: {
          label: "done"
        }
      });
      return;
    }

    const signUpData: CreateUserParams = {
      email: email,
      password: password,
      repeatPassword: repeatPassword,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address_line_1: shippingAddress.address1,
      address_line_2: shippingAddress.address2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.zip,
      country: shippingAddress.country,
    };

    console.log(
      "Data being sent to signUp function:",
      JSON.stringify(signUpData, null, 2)
    );
    // You will need to update your `signUp` function in `AuthContext`
    // to accept this new structure and pass it to supabase.auth.signUp()
    const result = await signUp(signUpData);

    if (result) {
      toast("An error occurred while signing up.", {
        description: result,
        action: {
          label: "done"
        }
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        <h1 className="mx-auto">Sign Up</h1>
        <p className="mx-auto">
          Register a new account to unlock all features.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* container for first name and last name */}
          <div className="flex gap-3 w-full">
            <AuthInput
              className="flex-1"
              type="text"
              header="First Name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <AuthInput
              className="flex-1"
              type="text"
              placeholder="Doe"
              header="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <AuthInput
            type="email"
            header="Email Address"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthInput
            type="password"
            header="Password"
            placeholder="Enter secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <AuthInput
            type="password"
            header="Repeat Password"
            placeholder="Enter previous password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          <AuthInput
            type="text"
            header="Phone Number"
            placeholder="+1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* shipping address */}
          <AccountDropdown
            label="Add Shipping Address"
            type="shipping"
            onShippingChange={setShippingAddress}
          />

          {/* payment methods Dropdown */}
          <AccountDropdown
            label="Add Payment Method"
            type="payment"
            onPaymentChange={setPaymentMethods}
          />

          <BlackButton type="submit" onClick={handleSubmit} isDisabled={isLoading}>
            {isLoading ? "Loading…" : "Sign Up"}
          </BlackButton>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className={`underline cursor-pointer ${isLoading ? "pointer-events-none" : ""}`}>
              {isLoading ? "Loading…" : "Sign in here"}
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
