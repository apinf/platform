/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// all numbers (0-9) , + , - , space ,/ are allowed and can appear anywhere in the phone numbers
// e.g. 754-3010,(541) 754-3010,1-541-754-3010,1-541-754-3010,191 541 754 3010,(089) / 636-48018
const contactPhone = new RegExp(/^[0-9-+()/\s.]+$/);
export default contactPhone;
