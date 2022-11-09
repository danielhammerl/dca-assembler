import {
  Byte,
  BYTE_LENGTH,
  HALF_WORD_LENGTH,
  HalfWord,
  Instructions,
  MAX_HALF_WORD_VALUE,
  Registers,
} from "@danielhammerl/dca-architecture";

export const isInstruction = (data: string): data is typeof Instructions[number] =>
  Instructions.includes(data as any);
export const isRegister = (data: string): data is typeof Registers[number] =>
  Registers.includes(data as any);

export const byteStringToHalfWord = (byteString: string): HalfWord => {
  const normalizedValue = byteString.padStart(HALF_WORD_LENGTH, "0");
  const first = normalizedValue.substring(0, BYTE_LENGTH) as Byte;
  const last = normalizedValue.substring(BYTE_LENGTH, HALF_WORD_LENGTH) as Byte;
  return [first, last];
};

export const decToHalfWord = (dec: number): HalfWord => {
  if (dec < 0) {
    throw new Error("decToHalfWord only supports positive numbers and zero");
  }
  const normalizedValue = dec % (MAX_HALF_WORD_VALUE + 1);
  const halfWordAsString = normalizedValue.toString(2).padStart(HALF_WORD_LENGTH, "0");
  return byteStringToHalfWord(halfWordAsString);
};

export const byteToDec = (byte: Byte): number => {
  return Number.parseInt(byte, 2);
};

export const halfWordToDec = (halfWord: HalfWord): number => {
  return Number.parseInt(halfWord.join(""), 2);
};

export const hexToDec = (hex: string): number => parseInt(hex.replaceAll("#", ""), 16);
