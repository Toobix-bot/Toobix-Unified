/**
 * A simple calculator tool that can add, subtract, multiply, and divide two numbers
 * @param {Object} params - The parameters for the calculator
 * @param {number} params.num1 - The first number
 * @param {number} params.num2 - The second number
 * @param {("add" | "subtract" | "multiply" | "divide")} params.operation - The mathematical operation to perform
 * @returns {Promise<{ success: boolean; data: any }>} The result of the calculation
 */
export async function simpleCalculator(params: {
  num1: number;
  num2: number;
  operation: "add" | "subtract" | "multiply" | "divide";
}): Promise<{
  success: boolean;
  data: any;
}> {
  try {
    let result: number;
    switch (params.operation) {
      case "add":
        result = params.num1 + params.num2;
        break;
      case "subtract":
        result = params.num1 - params.num2;
        break;
      case "multiply":
        result = params.num1 * params.num2;
        break;
      case "divide":
        if (params.num2 === 0) {
          throw new Error("Cannot divide by zero");
        }
        result = params.num1 / params.num2;
        break;
      default:
        throw new Error("Invalid operation");
    }
    return { success: true, data: result };
  } catch (error) {
    return { success: false, data: error.message };
  }
}