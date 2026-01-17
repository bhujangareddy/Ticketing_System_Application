const namePattern = "^[A-Za-z]+(?: [A-Za-z]+)*$"

const consecutiveSpacePattern = "^(?!.* {2})(?!\s)(?!.*\s$).*";
const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

const pwdRule = "Password must include uppercase, lowercase, number, and special symbol!";
const emailEnd = "@gmail.com";

// Text Input(Title)

const onlyLettersAndSpaces = /^[A-Za-z ]+$/;   // No numbers, no symbols, no emojis
const noConsecutiveSpaces = / {2}/;            // Detect two or more spaces

export { namePattern, consecutiveSpacePattern, pwdPattern, pwdRule, emailEnd, onlyLettersAndSpaces, noConsecutiveSpaces };