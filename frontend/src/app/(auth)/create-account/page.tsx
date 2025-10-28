"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import Link from "next/link";
import { useAuth, CreateUserParams } from "@/lib/context/AuthContext";

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
  const { signUp } = useAuth();

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
  const [paymentCard, setPaymentCard] = useState<Card>({
    cardNumber: "",
    name: "",
    expDate: "",
    cvv: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !repeatPassword ||
      !paymentCard.cardNumber ||
      !paymentCard.name ||
      !paymentCard.expDate ||
      !paymentCard.cvv
    ) {
      alert("Please complete all required fields");
      return;
    }

    if (password !== repeatPassword) {
      alert("Passwords do not match!");
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
      payment_cards: [paymentCard], // Single card in array for database trigger
    };

    try {
      await signUp(signUpData);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred during signup"
      );
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
            type="repeat-password"
            header="Repeat Password"
            placeholder="Enter Previous Password"
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

          {/* Shipping Address Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">
              Shipping Address
            </h3>
            <AuthInput
              type="text"
              header="Address Line 1"
              placeholder="123 Main St"
              value={shippingAddress.address1}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address1: e.target.value,
                })
              }
            />
            <AuthInput
              type="text"
              header="Address Line 2"
              placeholder="Apartment, Suite, etc."
              value={shippingAddress.address2}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address2: e.target.value,
                })
              }
            />
            <div className="flex gap-3 w-full">
              <AuthInput
                className="flex-1"
                type="text"
                header="City"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
              />
              <AuthInput
                className="flex-1"
                type="text"
                header="State"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-3 w-full">
              <AuthInput
                className="flex-1"
                type="text"
                header="ZIP Code"
                placeholder="12345"
                value={shippingAddress.zip}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    zip: e.target.value,
                  })
                }
              />
              <AuthInput
                className="flex-1"
                type="text"
                header="Country"
                placeholder="United States"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">
              Payment Method *
            </h3>
            <AuthInput
              type="text"
              header="Card Number"
              placeholder="1234 5678 9012 3456"
              value={paymentCard.cardNumber}
              onChange={(e) =>
                setPaymentCard({ ...paymentCard, cardNumber: e.target.value })
              }
              required
            />
            <AuthInput
              type="text"
              header="Name on Card"
              placeholder="John Doe"
              value={paymentCard.name}
              onChange={(e) =>
                setPaymentCard({ ...paymentCard, name: e.target.value })
              }
              required
            />
            <div className="flex gap-3 w-full">
              <AuthInput
                className="flex-1"
                type="text"
                header="Expiry Date"
                placeholder="MM/YY"
                value={paymentCard.expDate}
                onChange={(e) =>
                  setPaymentCard({ ...paymentCard, expDate: e.target.value })
                }
                required
              />
              <AuthInput
                className="flex-1"
                type="text"
                header="CVV"
                placeholder="123"
                value={paymentCard.cvv}
                onChange={(e) =>
                  setPaymentCard({ ...paymentCard, cvv: e.target.value })
                }
                required
              />
            </div>
          </div>

          <BlackButton type="submit" onClick={handleSubmit}>
            Sign Up
          </BlackButton>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline cursor-pointer">
              Sign in here
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
