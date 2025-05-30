import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { usePublicClient } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-eth/contract";

/**
 * Gets the matching contract info from the contracts file generated by `yarn deploy`
 * @param contractName - name of deployed contract
 */
export const useDeployedContractInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);
  const publicClient = usePublicClient({ chainId: scaffoldConfig.targetNetwork.id });

  const deployedContract = contracts?.[scaffoldConfig.targetNetwork.id]?.[0]?.contracts?.[contractName as ContractName];

  useEffect(() => {
    const checkContractDeployment = async () => {
      if (!deployedContract) {
        setStatus(ContractCodeStatus.NOT_FOUND);
        return;
      }

      try {
        const code = await publicClient.getBytecode({
          address: deployedContract.address,
        });

        if (code === "0x") {
          setStatus(ContractCodeStatus.NOT_FOUND);
        } else {
          setStatus(ContractCodeStatus.DEPLOYED);
        }
      } catch (error) {
        console.error("Error checking contract deployment:", error);
        setStatus(ContractCodeStatus.NOT_FOUND);
      }
    };

    checkContractDeployment();
  }, [deployedContract, publicClient]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
    status,
  };
};
