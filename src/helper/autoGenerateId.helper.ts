import { customAlphabet } from "nanoid";

export const generateNumericId = (): number => {
  const idString = customAlphabet("0123456789", 10)();
  return Number(idString);
};
