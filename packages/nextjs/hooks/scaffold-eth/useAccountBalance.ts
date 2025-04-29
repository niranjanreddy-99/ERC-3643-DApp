import { useCallback, useEffect, useState } from "react";
import { useBalance } from "wagmi";
import { useGlobalState } from "~~/services/store/store";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export function useAccountBalance(address?: string) {
  const [isEthBalance, setIsEthBalance] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const price = useGlobalState(state => state.nativeCurrencyPrice);

  const { data: fetchedBalanceData, isError, isLoading } = useBalance({
    address,
    watch: true,
    chainId: getTargetNetwork().id,
  });

  // Toggle balance view between ETH and USD
  const onToggleBalance = useCallback(() => {
    if (price > 0) {
      setIsEthBalance(prev => !prev); // Flip the boolean value
    }
  }, [price]);

  // Update balance state whenever fetchedBalanceData changes
  useEffect(() => {
    if (fetchedBalanceData?.formatted) {
      setBalance(Number(fetchedBalanceData.formatted));
    }
  }, [fetchedBalanceData]);

  return {
    balance,
    price,
    isError,
    isLoading,
    onToggleBalance,
    isEthBalance,
  };
}
