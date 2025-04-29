import { useMemo } from "react";
import { DisplayVariable } from "./DisplayVariable";
import { Abi, AbiFunction } from "abitype";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const ContractVariables = ({
  refreshDisplayVariables,
  deployedContractData,
}: {
  refreshDisplayVariables: boolean;
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
        // Filter to only view or pure functions with no inputs (contract variables)
        return (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;
      });
  }, [abi]);

  if (!functionsToDisplay.length) {
    return <p>No contract variables</p>;
  }

  return (
    <>
      {functionsToDisplay.map(fn => (
        <DisplayVariable
          key={fn.name}
          abiFunction={fn}
          contractAddress={address}
          refreshDisplayVariables={refreshDisplayVariables}
        />
      ))}
    </>
  );
};
