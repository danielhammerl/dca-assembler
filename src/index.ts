#!/usr/bin/env ts-node-script
import fs from "fs";
import { assemble, assembleBinary } from "./assembler";
import { program } from "commander";

program
  .argument("[source]", "source file", "./source.dcabin")
  .argument("[output]", "output file")
  .option("-b, --binary", "as binary data", true)
  .action((source, output, options) => {
    const sourceCode = fs.readFileSync(source || "./input.txt", { encoding: "utf-8" }).toString();

    const result: string | Buffer = options.binary
      ? assembleBinary(sourceCode)
      : assemble(sourceCode);

    if (output) {
      fs.writeFileSync(output, result, { encoding: options.binary ? undefined : "utf-8" });
    } else {
      console.log(result);
    }
  });

program.parse();
