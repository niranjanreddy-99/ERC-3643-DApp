import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { hardhat } from "viem/chains";
import { PaginationButton } from "~~/components/blockexplorer/PaginationButton";
import { SearchBar } from "~~/components/blockexplorer/SearchBar";
import { TransactionsTable } from "~~/components/blockexplorer/TransactionsTable";
import { useFetchBlocks } from "~~/hooks/scaffold-eth";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const Blockexplorer: NextPage = () => {
  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error, isLoading } = useFetchBlocks();
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

  const showNotification = (message: React.ReactNode) => {
    notification.error(message);
  };

  useEffect(() => {
    if (getTargetNetwork().id === hardhat.id && error) {
      showNotification(
        <>
          <p className="font-bold mt-0 mb-1">Cannot connect to local provider</p>
          <p className="m-0">
            - Did you forget to run <code className="italic bg-base-300 text-base font-bold">yarn chain</code>?
          </p>
          <p className="mt-1 break-normal">
            - Or you can change <code className="italic bg-base-300 text-base font-bold">targetNetwork</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">scaffold.config.ts</code>
          </p>
        </>
      );
      setIsNetworkError(true);
    }

    if (getTargetNetwork().id !== hardhat.id) {
      showNotification(
        <>
          <p className="font-bold mt-0 mb-1">
            <code className="italic bg-base-300 text-base font-bold">targetNetwork</code> is not localhost
          </p>
          <p className="m-0">
            - You are on <code className="italic bg-base-300 text-base font-bold">{getTargetNetwork().name}</code>. This
            block explorer is only for <code className="italic bg-base-300 text-base font-bold">localhost</code>.
          </p>
          <p className="mt-1 break-normal">
            - You can use{" "}
            <a className="text-accent" href={getTargetNetwork().blockExplorers?.default.url}>
              {getTargetNetwork().blockExplorers?.default.name}
            </a>{" "}
            instead.
          </p>
        </>
      );
      setIsNetworkError(true);
    }
  }, [error]);

  if (isNetworkError) return null; // Don't render if network error exists

  return (
    <div className="container mx-auto my-10">
      <SearchBar />
      {isLoading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : blocks?.length === 0 ? (
        <div className="text-center text-xl">No transactions available</div>
      ) : (
        <>
          <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} />
          <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default Blockexplorer;
