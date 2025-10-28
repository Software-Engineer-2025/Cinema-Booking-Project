
// regular expression for formatted phone numbers
export const phoneRegex = new RegExp("^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})\\s*$");

// regular expression for emails - more permissive version
// Accepts most common email formats
export const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

// regular expression for passwords 8-20 digits longs. Must have 1 upper, 1 lower, 1 number, 1 special character.
// Gotten off of stack overflow
export const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$@!%&*?])[A-Za-z\\d#$@!%&*?]{8,20}$");

// regular expression for US zip codes
export const zipRegex = new RegExp("^(?=.5\\d)$");