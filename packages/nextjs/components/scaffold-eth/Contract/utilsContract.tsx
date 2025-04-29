import { AbiFunction, AbiParameter } from "abitype";
import { BaseError as BaseViemError } from "viem";

/**
 * @dev Utility function to generate key corresponding to function metaData
 * @param {string} functionName
 * @param {AbiParameter} input - Object containing function name and input type corresponding to index
 * @param {number} inputIndex
 * @returns {string} key
 */
const getFunctionInputKey = (functionName: string, input: AbiParameter, inputIndex: number): string => {
  const name = input?.name ?? `input_${inputIndex}_`;
  return `${functionName}_${name}_${input.internalType}_${input.type}`;
};

/**
 * @dev Utility function to parse error
 * @param e - Error object (can be of type `BaseViemError` or generic error)
 * @returns {string} Parsed error message
 */
const getParsedError = (e: any | BaseViemError): string => {
  let message = e.message ?? "An unknown error occurred";

  if (e instanceof BaseViemError) {
    message = e.details ?? e.shortMessage ?? e.message ?? e.name ?? message;
  }

  return message;
};

// Regex for array types in the form of `type[size]`
const ARRAY_TYPE_REGEX = /\[.*\]$/;

/**
 * @dev Parse form input with array support
 * @param {Record<string, any>} form - Form object containing key-value pairs
 * @returns {any[]} Parsed arguments
 */
const getParsedContractFunctionArgs = (form: Record<string, any>): any[] => {
  return Object.keys(form).map(key => {
    try {
      const keySplitArray = key.split("_");
      const baseTypeOfArg = keySplitArray[keySplitArray.length - 1];
      let valueOfArg = form[key];

      if (ARRAY_TYPE_REGEX.test(baseTypeOfArg) || baseTypeOfArg === "tuple") {
        valueOfArg = JSON.parse(valueOfArg);
      } else if (baseTypeOfArg === "bool") {
        // Convert string/hex representations of booleans to 1 or 0
        valueOfArg = ["true", "1", "0x1", "0x01", "0x0001"].includes(valueOfArg) ? 1 : 0;
      }
      return valueOfArg;
    } catch (error) {
      // Ignore error, as it will be handled when sending/reading from a function
      return undefined;
    }
  }).filter(arg => arg !== undefined);  // Remove undefined entries
};

/**
 * @dev Generate initial form state from the ABI function inputs
 * @param {AbiFunction} abiFunction
 * @returns {Record<string, any>} Initial form state
 */
const getInitialFormState = (abiFunction: AbiFunction): Record<string, any> => {
  const initialForm: Record<string, any> = {};
  if (!abiFunction.inputs) return initialForm;

  abiFunction.inputs.forEach((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    initialForm[key] = "";  // Initialize each input field with an empty string
  });

  return initialForm;
};

export { getFunctionInputKey, getInitialFormState, getParsedContractFunctionArgs, getParsedError };
