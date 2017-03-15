// all numbers (0-9) , + , - , space ,/ are allowed and can appear anywhere in the phone numbers
// e.g. 754-3010,(541) 754-3010,1-541-754-3010,1-541-754-3010,191 541 754 3010,(089) / 636-48018
const contactPhone = new RegExp(/^[0-9-+()/\s.]+$/);
export default contactPhone;
