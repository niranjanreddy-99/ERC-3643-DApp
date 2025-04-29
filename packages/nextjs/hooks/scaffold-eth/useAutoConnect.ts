import { useEffect } from "react";
import { useEffectOnce, useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { hardhat } from "viem/chains";
import { Connector, useAccount, useConnect } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { burnerWalletId, defaultBurnerChainId } from "~~/services/web3/wagmi-burner/BurnerConnector";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const SCAFFOLD_WALLET_STORAGE_KEY = "scaffoldEth2.wallet";
const WAGMI_WALLET_STORAGE_KEY = "wagmi.wallet";
const SAFE_ID = "safe";

/**
 * This function returns the initial wallet connector to connect to based on config and previous wallet
 */
const getInitialConnector = (previousWalletId: string, connectors: Connector[]) => {
  const targetNetwork = getTargetNetwork();
  const allowBurner = scaffoldConfig.onlyLocalBurnerWallet ? targetNetwork.id === hardhat.id : true;

  // Look for the SAFE connector instance and connect to it instantly if it's available
  const safeConnector = connectors.find(connector => connector.id === SAFE_ID && connector.ready);
  if (safeConnector) return { connector: safeConnector };

  // If no previous wallet was connected and auto-connect is allowed for the burner
  if (!previousWalletId && allowBurner && scaffoldConfig.walletAutoConnect) {
    const burnerConnector = connectors.find(f => f.id === burnerWalletId);
    return { connector: burnerConnector, chainId: defaultBurnerChainId };
  }

  // If the user was connected to a wallet previously, reconnect the previous wallet
  if (previousWalletId && scaffoldConfig.walletAutoConnect) {
    const connector = connectors.find(f => f.id === previousWalletId);
    if (connector && !(previousWalletId === burnerWalletId && !allowBurner)) {
      return { connector };
    }
  }

  return undefined;
};

/**
 * Hook that automatically connects the user to a wallet based on stored information and configuration
 */
export const useAutoConnect = (): void => {
  const wagmiWalletValue = useReadLocalStorage<string>(WAGMI_WALLET_STORAGE_KEY);
  const [walletId, setWalletId] = useLocalStorage<string>(SCAFFOLD_WALLET_STORAGE_KEY, wagmiWalletValue ?? "");
  const { connect, connectors } = useConnect();
  const { isConnected, connector } = useAccount();

  // Store the connected walletId in localStorage when the user connects
  useEffect(() => {
    if (isConnected && connector) {
      setWalletId(connector.id);
    } else {
      // Reset walletId when disconnected
      window.localStorage.setItem(WAGMI_WALLET_STORAGE_KEY, JSON.stringify(""));
      setWalletId("");
    }
  }, [isConnected, connector, setWalletId]);

  // Automatically connect the user on mount based on stored walletId
  useEffect(() => {
    const initialConnector = getInitialConnector(walletId, connectors);
    if (initialConnector?.connector) {
      connect({ connector: initialConnector.connector, chainId: initialConnector.chainId });
    }
  }, [walletId, connectors, connect]);
};
