// heavily inspired by: https://www.geeksforgeeks.org/how-to-set-cookie-in-reactjs/

// Function to set a cookie
const setCookieFunction = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

// Function to get a cookie by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

// Function to update the cookie
export const updateRememberCookie = (passedVal: boolean) => {
    setCookieFunction("remember-me", passedVal, 1); // Set cookie for a day
};

// Function to retrieve cookie
export const getRememberCookie = () => {
    const customCookie = getCookie("remember-me");
    if (customCookie) {
        return customCookie;
    } else {
        return "false";
    }
};
