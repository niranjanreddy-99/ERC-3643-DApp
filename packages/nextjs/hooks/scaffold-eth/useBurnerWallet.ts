import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Chain, Hex, HttpTransport, PrivateKeyAccount, createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { WalletClient, usePublicClient } from "wagmi";

const burnerStorageKey = "scaffoldEth2.burnerWallet.sk";

const isValidSk = (pk: Hex | string | undefined | null): boolean => {
  return pk?.length === 64 || pk?.length === 66;
};

const newDefaultPrivateKey = generatePrivateKey();

export const saveBurnerSK = (privateKey: Hex): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(burnerStorageKey, privateKey);
  }
};

export const loadBurnerSK = (): Hex => {
  let currentSk: Hex = "0x";
  if (typeof window !== "undefined") {
    currentSk = window.localStorage.getItem(burnerStorageKey)?.replaceAll('"', "") ?? "0x";
  }

  if (isValidSk(currentSk)) {
    return currentSk;
  } else {
    saveBurnerSK(newDefaultPrivateKey);
    return newDefaultPrivateKey;
  }
};

export type TBurnerSigner = {
  walletClient: WalletClient | undefined;
  account: PrivateKeyAccount | undefined;
  generateNewBurner: () => void;
  saveBurner: () => void;
};

export const useBurnerWallet = (): TBurnerSigner => {
  const [burnerSk, setBurnerSk] = useLocalStorage<Hex>(burnerStorageKey, newDefaultPrivateKey);
  const publicClient = usePublicClient();
  const [walletClient, setWalletClient] = useState<WalletClient<HttpTransport, Chain, PrivateKeyAccount>>();
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState<Hex>("0x");
  const [account, setAccount] = useState<PrivateKeyAccount>();
  const isCreatingNewBurnerRef = useRef(false);

  const saveBurner = useCallback(() => {
    setBurnerSk(generatedPrivateKey);
  }, [setBurnerSk, generatedPrivateKey]);

  const generateNewBurner = useCallback(() => {
    if (publicClient && !isCreatingNewBurnerRef.current) {
      console.log("🔑 Creating new burner wallet...");
      isCreatingNewBurnerRef.current = true;

      const randomPrivateKey = generatePrivateKey();
      const randomAccount = privateKeyToAccount(randomPrivateKey);

      const client = createWalletClient({
        chain: publicClient.chain,
        account: randomAccount,
        transport: http(),
      });

      setWalletClient(client);
      setGeneratedPrivateKey(randomPrivateKey);
      setAccount(randomAccount);

      setBurnerSk(() => {
        console.log("🔥 Saving new burner wallet");
        isCreatingNewBurnerRef.current = false;
