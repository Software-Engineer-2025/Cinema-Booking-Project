"use client"

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import { passwordRegex } from "@/lib/utils/regex";

import Link from "next/link";
import {ChangeEvent, useState} from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {toast} from "sonner";

export default function ResetPassword() {
    const { updatePassword, isLoading } = useAuth();
    const [password, setPassword] = useState("");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordRegex.test(password)) {
            toast("Invalid Password", {
                description: "Please ensure password is between 8-20 characters long and has 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
                action: {
                    label: "done"
                }
            });
        } else {
            const result = await updatePassword(password);
            if (result) {
                toast("An error occurred while updating password.", {
                    description: result,
                    action: {
                        label: "done"
                    }
                });
            } else {
                window.location.href = "/login"
            }
        }
    }

  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        <h2 className="">Reset Your Password</h2>
        <p>Enter a new secure password for your account.</p>
        <form className="flex flex-col gap-3">
          <AuthInput
              type="email"
              placeholder="Enter a secure password."
              onChange={(e: ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
              className="pb-7"
              required />
          <BlackButton className="mb-6" onClick={handleResetPassword} isDisabled={isLoading}>
              {isLoading ? "Loading…" : "Reset Password"}
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
