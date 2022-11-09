export const throwError = (error: any, lineNumber: number) => {
  throw new Error("Error in line " + lineNumber + ": " + error);
};
