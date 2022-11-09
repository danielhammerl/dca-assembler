import fs from "fs";
import { assemble, assembleBinary } from "./assembler";
import {output, output2} from "../test/binaryData";

describe("assembler", () => {
  it("should work", () => {
    const input = fs.readFileSync("./test/input.txt").toString();
    const output = fs.readFileSync("./test/output.txt").toString();

    expect(output.length).toBeGreaterThan(10);
    expect(input.length).toBeGreaterThan(10);

    expect(assemble(input)).toEqual(output);

    const input2 = fs.readFileSync("./test/input-2.txt").toString();
    const output2 = fs.readFileSync("./test/output-2.txt").toString();

    expect(output2.length).toBeGreaterThan(10);
    expect(input2.length).toBeGreaterThan(10);

    expect(assemble(input2)).toEqual(output2);
  });

  it("should work as binary", () => {
    const input = fs.readFileSync("./test/input.txt").toString();
    expect(input.length).toBeGreaterThan(10);

    expect(assembleBinary(input).toJSON().data).toEqual(output);

    const input2 = fs.readFileSync("./test/input-2.txt").toString();
    expect(input2.length).toBeGreaterThan(10);

    expect(assembleBinary(input2).toJSON().data).toEqual(output2);
  });
});
