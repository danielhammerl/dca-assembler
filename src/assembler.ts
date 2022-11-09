import { COMMENT_SIGN } from "./util/constants";
import { Byte, InstructionBinaryMap, registerBinaryCode } from "@danielhammerl/dca-architecture";
import {
  byteToDec,
  decToHalfWord,
  halfWordToDec,
  hexToDec,
  isInstruction,
  isRegister,
} from "./util/types";
import { throwError } from "./util/error";
import { EOL } from "os";

const splitStringAndRemoveComments = (input: string): string[] => {
  return input
    .split(EOL)
    .map((line) => {
      const indexOfCommentSign = line.indexOf(COMMENT_SIGN);
      if (indexOfCommentSign === -1) {
        return line;
      }

      return line.substring(0, indexOfCommentSign);
    })
    .map((item) => item.trim())
    .filter((item) => !!item && item.length > 0);
};

export const assemble = (input: string): string => {
  const sourceCodeWithoutComments = splitStringAndRemoveComments(input);

  const binaryCode = sourceCodeWithoutComments
    .map((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      const [operation, operand1, operand2] = line.split(" ");
      let translated: Byte[] = [];
      if (!isInstruction(operation)) {
        throwError("Operation " + operation + " is not a valid dca instruction", lineNumber);
        return;
      }

      translated.push(InstructionBinaryMap[operation]);

      [operand1, operand2]
        .map((operand) => operand.toUpperCase())
        .map((operand) => {
          if (isRegister(operand)) {
            translated.push(...registerBinaryCode[operand]);
          } else {
            const operandAsDecNumber = hexToDec(operand);
            if (isNaN(operandAsDecNumber)) {
              throwError(
                "Operand " + operand + " is neither a valid register nor a valid hex number",
                lineNumber
              );
            }
            translated.push(...decToHalfWord(operandAsDecNumber));
          }
        });

      return translated.join(" ");
    })
    .filter(Boolean);

  return binaryCode.join(" ");
};

export const assembleBinary = (input: string): Buffer => {
  const sourceCodeWithoutComments = splitStringAndRemoveComments(input);
  const buffer = Buffer.allocUnsafe(sourceCodeWithoutComments.length * 5);

  sourceCodeWithoutComments.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    const [operation, operand1, operand2] = line.split(" ");
    if (!isInstruction(operation)) {
      throwError("Operation " + operation + " is not a valid dca instruction", lineNumber);
      return;
    }
    buffer.writeUInt8(byteToDec(InstructionBinaryMap[operation]), lineIndex * 5);

    [operand1, operand2]
      .map((operand) => operand.toUpperCase())
      .map((operand, operandIndex) => {
        if (isRegister(operand)) {
          buffer.writeUInt16BE(
            halfWordToDec(registerBinaryCode[operand]),
            lineIndex * 5 + (operandIndex * 2 + 1)
          );
        } else {
          const operandAsDecNumber = hexToDec(operand);
          if (isNaN(operandAsDecNumber)) {
            throwError(
              "Operand " + operand + " is neither a valid register nor a valid hex number",
              lineIndex
            );
          }

          buffer.writeUInt16BE(operandAsDecNumber, lineIndex * 5 + (operandIndex * 2 + 1));
        }
      });
  });

  return buffer;
};
