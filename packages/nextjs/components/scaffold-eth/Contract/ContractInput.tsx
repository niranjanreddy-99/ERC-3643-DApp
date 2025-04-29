import { Dispatch, SetStateAction } from "react";
import { AbiParameter } from "abitype";
import {
  AddressInput,
  Bytes32Input,
  BytesInput,
  InputBase,
  IntegerInput,
  IntegerVariant,
} from "~~/components/scaffold-eth";

type ContractInputProps = {
  setForm: Dispatch<SetStateAction<Record<string, any>>>;
  form: Record<string, any> | undefined;
  stateObjectKey: string;
  paramType: AbiParameter;
};

/**
 * Generic Input component to handle input's based on their function param type
 */
export const ContractInput = ({ setForm, form, stateObjectKey, paramType }: ContractInputProps) => {
  const inputProps = {
    name: stateObjectKey,
    value: form?.[stateObjectKey],
    placeholder: paramType.name ? `${paramType.type} ${paramType.name}` : paramType.type,
    onChange: (value: any) => {
      setForm((prevForm) => ({ ...prevForm, [stateObjectKey]: value }));
    },
  };

  switch (paramType.type) {
    case "address":
      return <AddressInput {...inputProps} />;
    case "bytes32":
      return <Bytes32Input {...inputProps} />;
    case "bytes":
      return <BytesInput {...inputProps} />;
    case "string":
      return <InputBase {...inputProps} />;
    default:
      if (paramType.type.includes("int") && !paramType.type.includes("[")) {
        return <IntegerInput {...inputProps} variant={paramType.type as IntegerVariant} />;
      }
      return <InputBase {...inputProps} />;
  }
};
