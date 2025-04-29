import { ChangeEvent, ReactNode, useCallback } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type InputBaseProps<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export const InputBase = <T extends string | number | undefined = string>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix,
}: InputBaseProps<T>) => {
  // Determine the class modifier based on the input state (error/disabled)
  const modifier = error
    ? "border-error"
    : disabled
    ? "border-disabled bg-base-300"
    : "";

  // Handle the change event and ensure proper typing for the value
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Convert value to the correct type before passing to onChange
      const newValue = e.target.value as unknown as T;
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent ${modifier}`}>
      {prefix}
      <input
        className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
      />
      {suffix}
    </div>
  );
};
