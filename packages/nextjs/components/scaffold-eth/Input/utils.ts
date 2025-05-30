// Enum for integer variants in different bit lengths (both signed and unsigned)
export enum IntegerVariant {
  // Unsigned Integer Variants
  UINT8 = "uint8",
  UINT16 = "uint16",
  UINT24 = "uint24",
  UINT32 = "uint32",
  UINT40 = "uint40",
  UINT48 = "uint48",
  UINT56 = "uint56",
  UINT64 = "uint64",
  UINT72 = "uint72",
  UINT80 = "uint80",
  UINT88 = "uint88",
  UINT96 = "uint96",
  UINT104 = "uint104",
  UINT112 = "uint112",
  UINT120 = "uint120",
  UINT128 = "uint128",
  UINT136 = "uint136",
  UINT144 = "uint144",
  UINT152 = "uint152",
  UINT160 = "uint160",
  UINT168 = "uint168",
  UINT176 = "uint176",
  UINT184 = "uint184",
  UINT192 = "uint192",
  UINT200 = "uint200",
  UINT208 = "uint208",
  UINT216 = "uint216",
  UINT224 = "uint224",
  UINT232 = "uint232",
  UINT240 = "uint240",
  UINT248 = "uint248",
  UINT256 = "uint256",
  
  // Signed Integer Variants
  INT8 = "int8",
  INT16 = "int16",
  INT24 = "int24",
  INT32 = "int32",
  INT40 = "int40",
  INT48 = "int48",
  INT56 = "int56",
  INT64 = "int64",
  INT72 = "int72",
  INT80 = "int80",
  INT88 = "int88",
  INT96 = "int96",
  INT104 = "int104",
  INT112 = "int112",
  INT120 = "int120",
  INT128 = "int128",
  INT136 = "int136",
  INT144 = "int144",
  INT152 = "int152",
  INT160 = "int160",
  INT168 = "int168",
  INT176 = "int176",
  INT184 = "int184",
  INT192 = "int192",
  INT200 = "int200",
  INT208 = "int208",
  INT216 = "int216",
  INT224 = "int224",
  INT232 = "int232",
  INT240 = "int240",
  INT248 = "int248",
  INT256 = "int256",
}

// Regular expression for valid signed numbers
export const SIGNED_NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

// Regular expression for valid unsigned numbers
export const UNSIGNED_NUMBER_REGEX = /^\d+(\.\d+)?$/;

/**
 * Validates if the value is a valid integer based on the given variant type.
 * It handles both signed and unsigned integers as well as the correct bit length.
 * 
 * @param dataType - The integer variant (e.g., "uint8", "int16", etc.)
 * @param value - The value to validate (could be a string or bigint)
 * @param strict - Whether to strictly validate (default: true)
 * @returns boolean - Returns true if the value is valid, otherwise false.
 */
export const isValidInteger = (dataType: IntegerVariant, value: bigint | string, strict = true): boolean => {
  const isSigned = dataType.startsWith("i"); // Check if the integer is signed
  const bitcount = Number(dataType.slice(isSigned ? 3 : 4)); // Extract the bitcount from the data type string

  let valueAsBigInt: bigint;

  // Try converting the value to BigInt
  try {
    valueAsBigInt = BigInt(value);
  } catch {
    valueAsBigInt = null!;
  }

  // If the value is not a valid BigInt or if it's a string/invalid number, handle validation differently
  if (typeof valueAsBigInt !== "bigint") {
    if (strict) {
      return false;
    }
    if (!value || typeof value !== "string") {
      return true; // If value is empty or a non-string, return true (valid in non-strict mode)
    }
    return isSigned ? SIGNED_NUMBER_REGEX.test(value) || value === "-" : UNSIGNED_NUMBER_REGEX.test(value);
  }

  // Check for negative numbers in unsigned types
  if (!isSigned && valueAsBigInt < 0) {
    return false;
  }

  // Convert BigInt value to hexadecimal and check against the bit length
  const hexString = valueAsBigInt.toString(16);
  const significantHexDigits = hexString.match(/.*x0*(.*)$/)?.[1] ?? "";
  
  // If the value exceeds the bit length or is not valid, return false
  if (
    significantHexDigits.length * 4 > bitcount ||
    (isSigned && significantHexDigits.length * 4 === bitcount && parseInt(significantHexDigits.slice(-1), 16) < 8)
  ) {
    return false;
  }

  return true;
};

/**
 * Checks if the provided address is an ENS (Ethereum Name Service) name.
 * 
 * @param address - The address to check
 * @returns boolean - Returns true if the address is a valid ENS name, otherwise false.
 */
const ensRegex = /.+\..+/;
export const isENS = (address: string = ""): boolean => ensRegex.test(address);
