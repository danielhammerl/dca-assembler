import { COMMENT_SIGN } from "./util/constants";
import { Byte, InstructionBinaryMap, registerBinaryCode } from "@danielhammerl/dca-architecture";
import { decToHalfWord, hexToDec, isInstruction, isRegister } from "./util/types";
import { throwError } from "./util/error";
import { EOL } from "os";

export const assemble = (input: string): string => {
  const sourceCodeWithoutComments = input
    .split(EOL)
    .map((line) => {
      const indexOfCommentSign = line.indexOf(COMMENT_SIGN);
      if (indexOfCommentSign === -1) {
        return line;
      }

      return line.substring(0, indexOfCommentSign);
    })
    .map((item) => item.trim());

  const binaryCode = sourceCodeWithoutComments
    .map((line, lineIndex) => {
      if (!line || line.length === 0) {
        return;
      }

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
