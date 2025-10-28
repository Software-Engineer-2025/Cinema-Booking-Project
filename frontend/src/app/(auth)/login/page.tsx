"use client"

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import { emailRegex, passwordRegex } from "@/lib/utils/regex";

import Link from "next/link";
import {ChangeEvent, useState} from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {getRememberCookie, updateRememberCookie} from "@/lib/utils/cookies";

export default function LoginPage() {

  const { logIn } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  /*
   * Handles submission of log in form.
   * Alerts user if any improper input information is put in or login fails.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!emailRegex.test(email)){
      alert("Not a valid email to log in with!");
    } else if (!passwordRegex.test(password)) {
      alert("Not a valid password to log in with!");
    } else {
      updateRememberCookie(rememberMe);
      console.log("remember me?: " + getRememberCookie());

      // clears previous sessions if the remember me is false
      if (!rememberMe && typeof window !== 'undefined') {
        const authKeys = Object.keys(localStorage).filter(key =>
            key.includes('sb-') && key.includes('-auth-')
        );
        authKeys.forEach(key => localStorage.removeItem(key));
      }

      const result = await logIn(email, password);

      if (result) {
        alert(result);
      }
    }
  }

  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        {/* icon */}
        <div className="inline-flex items-center justify-center w-15 h-15 rounded-lg bg-gray-400 mx-auto">
          <svg
            width="30"
            height="30"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            <path
              d="M4.5 1C4.22386 1 4 1.22386 4 1.5C4 1.77614 4.22386 2 4.5 2H12V13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14H12C12.5523 14 13 13.5523 13 13V2C13 1.44772 12.5523 1 12 1H4.5ZM6.60355 4.89645C6.40829 4.70118 6.09171 4.70118 5.89645 4.89645C5.70118 5.09171 5.70118 5.40829 5.89645 5.60355L7.29289 7H0.5C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H7.29289L5.89645 9.39645C5.70118 9.59171 5.70118 9.90829 5.89645 10.1036C6.09171 10.2988 6.40829 10.2988 6.60355 10.1036L8.85355 7.85355C9.04882 7.65829 9.04882 7.34171 8.85355 7.14645L6.60355 4.89645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="mx-auto">Log In</h1>
        <p className="mx-auto">Sign into an existing account.</p>
        <form className="flex flex-col gap-3">
          <AuthInput type="email"
                     placeholder="Email Address"
                     className="text-gray-500"
                     onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                     icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}
                     required />
          <AuthInput
            type="password"
            placeholder="Password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            icon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                className="text-gray-500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
            required
          />
          <div className={"flex flex-row justify-center space-between gap-10"}>
            <div className={"flex flex-row gap-1"}>
              <input type="checkbox" onChange={() => setRememberMe(prevState => !prevState)}/>
              <label className="text-white font-medium">
                Remember Me
              </label>
            </div>
            <Link
                href="/forgot-password"
                className="underline text-right text-sm cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          <BlackButton onClick={handleLogin}>Sign In</BlackButton>
          <p className="text-sm text-center">
            Don't have an account?{" "}
            <Link
                href="/create-account"
                className="underline cursor-pointer"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
