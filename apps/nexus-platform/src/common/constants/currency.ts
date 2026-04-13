export const SUPPORTED_CURRENCIES = {
    USD: "USD",
    INR: "INR",
}as const; //first const is JS protects Currency from reassigning completely
//But Currency.USD = ABC is also possible so we use as const in TS which also protects its values

export type Currency = typeof SUPPORTED_CURRENCIES[keyof typeof SUPPORTED_CURRENCIES];

export const CURRENCY_VALUES = Object.values(SUPPORTED_CURRENCIES);

/*typeof: give typeof values for all keys in obj
typeOf SUPPORTED_CURRENCIES gives 
{USD: "USD",
INR: "INR",}
keyof: extracts keys of na obj type: 
keyof ({USD: "USD",
INR: "INR",}) gives "USD" | "INR"
*/