import { useCallback } from "react";
import { bytesToString, isHex, toBytes, toHex } from "viem";
import { CommonInputProps, InputBase } from "~~/components/scaffold-eth";

/**
 * BytesInput component for handling bytes input.
 * Allows conversion between hex and string representations of bytes.
 */
export const BytesInput = ({
  value,
  onChange,
  name,
  placeholder,
  disabled,
}: CommonInputProps) => {
  const convertStringToBytes = useCallback(() => {
    if (!value) return; // Return early if value is not set

    try {
      // Check if the value is hex, otherwise convert string to hex
      const convertedValue = isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value));
      onChange(convertedValue);
    } catch (error) {
      console.error("Error in conversion:", error);
    }
  }, [onChange, value]);

  return (
    <InputBase
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      suffix={
        <div
          className="self-center cursor-pointer text-xl font-semibold px-4 text-accent"
          onClick={convertStringToBytes}
          title="Convert between hex and string"
        >
          #
        </div>
      }
    />
  );
};
