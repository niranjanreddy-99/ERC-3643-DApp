import { useMemo } from "react";
import { WriteOnlyFunctionForm } from "./WriteOnlyFunctionForm";
import { Abi, AbiFunction } from "abitype";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const ContractWriteMethods = ({
  onChange,
  deployedContractData,
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData?.abi) {
    return null;
  }

  const { abi, address } = deployedContractData;

  const functionsToDisplay = useMemo(() => {
    return (abi as Abi)
      .filter(part => part.type === "function") // Filter to only functions
      .filter((fn: AbiFunction) => {
        // Filter to only writable functions (not view or pure)
        return fn.stateMutability !== "view" && fn.stateMutability !== "pure";
      });
  }, [abi]);

  if (!functionsToDisplay.length) {
    return <p>No write methods</p>;
  }

  return (
    <>
      {functionsToDisplay.map((fn, idx) => (
        <WriteOnlyFunctionForm
          key={`${fn.name}-${idx}`} // Ensure unique key by using both name and index
          abiFunction={fn}
          onChange={onChange}
          contractAddress={address}
        />
      ))}
    </>
  );
};
