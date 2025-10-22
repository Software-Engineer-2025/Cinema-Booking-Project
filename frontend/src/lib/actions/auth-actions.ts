'use server'

import { createClient } from "@/lib/supabase/server";
import { CreateUserParams} from "@/lib/context/AuthContext";
import {revalidatePath} from "next/cache";

const phoneRegex = new RegExp("^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})\\s*$");

/*
    Signs up the user and adds them to the Supabase auth.users table.
 */
export async function signUpAction(userData: CreateUserParams) {
    try {
        const supabase = await createClient();

        if (userData.password !== userData.repeatPassword) {
            return { error: "Passwords don't match." };
        }

        if (!phoneRegex.test(userData.phoneNumber)) {
            return { error: "Phone number is not formatted in any valid way." };
        } else {
            userData.phoneNumber = userData.phoneNumber.replace(/\D/g, '');
        }

        const result = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
            }
        });

        revalidatePath('/', 'layout');
        //redirect('/')

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * Logs in the user and creates a session for the user
 */
export async function logInAction(email: string, password: string) {
    try {
        const supabase = await createClient();

        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // re add this when the login page is set up
        //revalidatePath('/login', 'layout');

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * Sends the reset password email.
 */
export async function forgotPasswordAction(email: string) {
    try {
        const supabase = await createClient();

        const result = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'auth/update-password',
        });

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * Updates the user's password based on the given password.
 */
export async function updatePasswordAction(password: string) {
    try {
        const supabase = await createClient();

        const result = await supabase.auth.updateUser({password: password});

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * checks the server side user session.
 */
export async function checkUserAction() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user) {
            console.log("here is the user", user);
        } else {
            console.log("no user session in server side");
        }
        return error ? error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}