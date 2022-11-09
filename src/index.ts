#!/usr/bin/env ts-node-script
import fs from "fs";
import { assemble } from "./assembler";

const output = process.argv?.[3];

const sourceCode = fs
  .readFileSync(process.argv[2] || "./input.txt", { encoding: "utf-8" })
  .toString();

// first, remove comments

const result = assemble(sourceCode);

if (output) {
  fs.writeFileSync(output, result, { encoding: "utf-8" });
} else {
  console.log(result);
}
