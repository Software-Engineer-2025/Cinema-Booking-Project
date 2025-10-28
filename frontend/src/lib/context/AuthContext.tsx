"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-js";
import {
  signUpAction,
  logInAction,
  forgotPasswordAction,
  updatePasswordAction,
  checkUserAction,
  checkVerificationAction,
} from "@/lib/actions/auth-actions";
import { supabaseClient } from "@/lib/supabase/client";

// User params for a user to sign up
export interface CreateUserParams {
  email: string;
  //phoneNumber: string,
  password: string;
  repeatPassword: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  // Shipping/Billing Address
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  // Payment cards
  payment_cards?: Array<{
    cardNumber: string;
    name: string;
    expDate: string;
    cvv: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  signUp: (userData: CreateUserParams) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
 * The component that wraps the components that need access to the Auth methods and vars.
 *
 * Should be used in the layout to make use of the properties of separating client and server components.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // checks for user session on page load.
    const getInitialUser = async () => {
      setIsLoading(true);

      try {
        const {
          data: { user },
          error,
        } = await supabaseClient.auth.getUser();

        if (error) {
          console.error("Error getting session:", error);
        } else {
          setUser(user);
        }
      } catch (unexpectedError) {
        console.error("Unexpected error getting session:", unexpectedError);
      }

      setIsLoading(false);
    };

    getInitialUser();

    // performs various actions based on the users session condition (signed in or not)
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setIsLoading(false);

      switch (event) {
        case "SIGNED_IN":
          setUser(session?.user ?? null);
          if (window.location.pathname === "/login") {
            window.location.href = "/";
          }
          break;
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          setUser(session?.user ?? null);
          break;
        case "SIGNED_OUT":
          setUser(null);
          if (window.location.pathname != "/") {
            window.location.href = "/";
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  /*
   * Callable function from the browser to sign up a user. Calls the signUpAction to be done server side more securely.
   *
   * Uses CreateUserParams for now until different interface is set up.
   * Need to set up an interface for the user data type being passed to signUp action.
   */
  const signUp = async (userData: CreateUserParams) => {
    setIsLoading(true);

    const errorMessage = await signUpAction(userData);

    if (errorMessage) {
      console.error("Error during sign-up:", errorMessage);
    } else {
      // This needs to be updated to a page that states sign up success when it's set up.
      window.location.href = "verify-email";
    }

    setIsLoading(false);
  };

  /*
   * Callable function from the browser to log in a user. Calls the logInAction to be done server side more securely.
   */
  const logIn = async (email: string, password: string) => {
    setIsLoading(true);

    const errorMessage = await logInAction(email, password);

    if (errorMessage) {
      console.error("Error during log-in:", errorMessage);
    } else {
      const validated = await checkVerification();
      if (validated) {
        window.location.replace("/");
      } else {
        window.location.replace("/verify-email");
      }
    }

    setIsLoading(false);
  };

  /*
   * Logs the user out.
   *
   * this is run server side so that Supabase can properly clean up all browser storage and trigger all
   * necessary events.
   */
  const logOut = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        console.error("Error during log-out:", error.message);
      }
    } catch (unexpectedError) {
      console.error("Unexpected error during log-out:", unexpectedError);
    }

    setIsLoading(false);
  };

  /*
   * Callable function from the browser if a user forgot their password.
   * Calls the forgotPasswordAction to be done server side more securely.
   */
  const forgotPassword = async (email: string) => {
    setIsLoading(true);

    const errorMessage = await forgotPasswordAction(email);

    if (errorMessage) {
      console.error("Error during forgot password:", errorMessage);
    }
    setIsLoading(false);
  };

  /*
   * Callable function from the browser to update a user's password.
   * Calls the updatePasswordAction to be done server side more securely.
   */
  const updatePassword = async (password: string) => {
    setIsLoading(true);

    const errorMessage = await updatePasswordAction(password);

    if (errorMessage) {
      console.error("Error during password update:", errorMessage);
    }
    setIsLoading(false);
  };

  // Checks if a user is in session.
  const checkUser = async () => {
    const errorMessage = await checkUserAction();

    if (errorMessage) {
      console.error("Error during check user:", errorMessage);
    }
  };

  // Checks if a user is validated.
  const checkVerification = async () => {
    const result = await checkVerificationAction();

    if (result === null) {
      console.error("Error during check verification");
      return null;
    }
    return result;
  };

  // The callable methods passed to the component from importing.
  const value: AuthContextType = {
    // State
    user,
    isLoading,

    // Methods
    signUp,
    logIn,
    logOut,
    forgotPassword,
    updatePassword,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/*
 * Sets up the use of the Auth methods and vars within the component.
 *
 * The component must be within an AuthContext component or an error will be thrown.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
