import { useCallback } from "react";
import { hexToString, isHex, stringToHex } from "viem";
import { CommonInputProps, InputBase } from "~~/components/scaffold-eth";

/**
 * Bytes32Input component for handling hex or string input
 * Converts input to a 32-byte string (hex or string)
 */
export const Bytes32Input = ({
  value,
  onChange,
  name,
  placeholder,
  disabled,
}: CommonInputProps) => {
  const convertStringToBytes32 = useCallback(() => {
    if (!value) return;

    const convertedValue = isHex(value) ? hexToString(value, { size: 32 }) : stringToHex(value, { size: 32 });
    onChange(convertedValue);
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
          onClick={convertStringToBytes32}
          title="Convert to 32 bytes"
        >
          #
        </div>
      }
    />
  );
};
