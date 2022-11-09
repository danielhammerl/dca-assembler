import fs from "fs";
import { assemble } from "./assembler";

describe("assembler", () => {
  it("should work", () => {
    const input = fs.readFileSync("./test/input.txt").toString();
    const output = fs.readFileSync("./test/output.txt").toString();

    expect(output.length).toBeGreaterThan(10);
    expect(input.length).toBeGreaterThan(10);

    expect(assemble(input)).toEqual(output);
  });

  it("should work 2", () => {
    const input = fs.readFileSync("./test/input-2.txt").toString();
    const output = fs.readFileSync("./test/output-2.txt").toString();

    expect(output.length).toBeGreaterThan(10);
    expect(input.length).toBeGreaterThan(10);

    expect(assemble(input)).toEqual(output);
  });
});
