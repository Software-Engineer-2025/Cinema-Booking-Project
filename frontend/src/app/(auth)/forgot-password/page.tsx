"use client"

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import { useAuth } from "@/lib/context/AuthContext";
import {ChangeEvent, useState} from "react";
import { emailRegex } from "@/lib/utils/regex";

import Link from "next/link";
import {toast} from "sonner";

export default function ForgotPassword() {
   const { forgotPassword, isLoading } = useAuth();
   const [email, setEmail] = useState<string>("");

   /*
    * Handles the input for the forgot password form submission.
    */
   const handleForgotPassword = async (e: React.FormEvent) => {
       e.preventDefault();

       if (!emailRegex.test(email)) {
           toast("Please insert valid email before submitting!", {
               description: "Must have username, @, and domain.",
               action: {
                   label: "done"
               }
           });
       } else {
           const result = await forgotPassword(email);
           if (result) {
               toast("An error occurred while doing forgot password.", {
                   description: result,
                   action: {
                       label: "done"
                   }
               });
           } else {
               toast("Email Sent!", {
                   description: "Email sent to provided email assuming it has an account.",
                   action: {
                       label: "done"
                   }
               });
           }
       }
   }

  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        <h2 className="">Forgot your password?</h2>
        <p>Enter the email address for the associated account.</p>
        <form className="flex flex-col gap-3">
          <AuthInput
              type="email"
              placeholder="example@example.com"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="pb-7"
              required/>
          <BlackButton className="mb-6" onClick={handleForgotPassword} isDisabled={isLoading}>
              {isLoading ? "Loading…" : "Request Reset Password"}
          </BlackButton>
          <Link
            href="/login"
            className={`underline text-center text-sm cursor-pointer ${isLoading ? "pointer-events-none" : ""}`}
          >
              {isLoading ? "Loading…" : "Return to Login Page"}
          </Link>
        </form>
      </AuthCard>
    </div>
  );
}
