import { useMemo } from "react";
import { ReadOnlyFunctionForm } from "./ReadOnlyFunctionForm";
import { Abi, AbiFunction } from "abitype";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const ContractReadMethods = ({ deployedContractData }: { deployedContractData: Contract<ContractName> }) => {
  if (!deployedContractData?.abi) {
    return null;
  }

  const { abi, address } = deployedContractData;

  const functionsToDisplay = useMemo(() => {
    return (abi as Abi)
      .filter(part => part.type === "function") // Filter to only functions
      .filter((fn: AbiFunction) => {
        // Filter to only view or pure functions with inputs
        return (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length > 0;
      });
  }, [abi]);

  if (functionsToDisplay.length === 0) {
    return <>No read methods</>;
  }

  return (
    <>
      {functionsToDisplay.map(fn => (
        <ReadOnlyFunctionForm contractAddress={address} abiFunction={fn} key={fn.name} />
      ))}
    </>
  );
};
