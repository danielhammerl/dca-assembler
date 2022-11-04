#!/usr/bin/env ts-node-script
import fs from "fs";
import { EOL } from "os";
import { COMMENT_SIGN } from "./constants";
import { Byte, InstructionBinaryMap, registerBinaryCode } from "@danielhammerl/dca-architecture";
import { decToHalfWord, hexToDec, isInstruction, isRegister } from "./types";
import { throwError } from "./error";

const output = process.argv[3] || "./source.dcabin";

const sourceCode = fs
  .readFileSync(process.argv[2] || "./source.dcaasm", { encoding: "utf-8" })
  .toString()
  .split(EOL);

// first, remove comments

const sourceCodeWithoutComments = sourceCode
  .map((line) => {
    const indexOfCommentSign = line.indexOf(COMMENT_SIGN);
    if (indexOfCommentSign === -1) {
      return line;
    }

    return line.substring(0, indexOfCommentSign);
  })
  .map((item) => item.trim());

const binaryCode = sourceCodeWithoutComments.map((line, lineIndex) => {
  const lineNumber = lineIndex + 1;
  const [operation, operand1, operand2] = line.split(" ");
  let translated: Byte[] = [];
  if (!isInstruction(operation)) {
    throwError("Operation " + operation + " is not a valid dca instruction", lineNumber);
    return;
  }

  translated.push(InstructionBinaryMap[operation]);

  [operand1, operand2].map((operand) => {
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
});

console.log(binaryCode);
fs.writeFileSync(output, binaryCode.join(" "), { encoding: "utf-8" });
