
// regular expression for formatted phone numbers
export const phoneRegex = new RegExp("^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})\\s*$");

// regular expression for emails
// Gotten off of stack overflow
export const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$");

// regular expression for passwords 8-20 digits longs. Must have 1 upper, 1 lower, 1 number, 1 special character.
// Gotten off of stack overflow
export const passwordRegex = new RegExp("^(?=.*[a-z](?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@!%*?&]{8-20}$");
