import { UserData } from "./types/authTypes";

export function validateOrderDetails(userData: Partial<UserData>) {
  const { phoneNumber, city, state, address } = userData;
  let missingFields = [];
  if (!phoneNumber || !city || !state || !address) {
    if (!phoneNumber) missingFields.push("Phone no.");
    if (!city) missingFields.push("City");
    if (!state) missingFields.push("State");
    if (!address) missingFields.push("Address");
  }
  return missingFields;
}
