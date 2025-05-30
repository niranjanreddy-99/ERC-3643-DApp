import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Transaction, TransactionReceipt, formatEther, formatUnits } from "viem";
import { hardhat } from "viem/chains";
import { usePublicClient } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { decodeTransactionData, getFunctionDetails, getTargetNetwork } from "~~/utils/scaffold-eth";

const TransactionPage: NextPage = () => {
  const client = usePublicClient({ chainId: hardhat.id });
  const router = useRouter();
  const { txHash } = router.query as { txHash?: `0x${string}` };
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [functionCalled, setFunctionCalled] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const configuredNetwork = getTargetNetwork();

  useEffect(() => {
    if (txHash) {
      const fetchTransaction = async () => {
        setIsLoading(true);
        try {
          const tx = await client.getTransaction({ hash: txHash });
          const receipt = await client.getTransactionReceipt({ hash: txHash });

          const transactionWithDecodedData = decodeTransactionData(tx);
          setTransaction(transactionWithDecodedData);
          setReceipt(receipt);

          const functionCalled = transactionWithDecodedData.input.substring(0, 10);
          setFunctionCalled(functionCalled);
        } catch (error) {
          console.error("Error fetching transaction:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTransaction();
    }
  }, [client, txHash]);

  return (
    <div className="container mx-auto mt-10 mb-20 px-10 md:px-0">
      <button className="btn btn-sm btn-primary" onClick={() => router.back()}>
        Back
      </button>
      
      {isLoading ? (
        <p className="text-2xl text-base-content">Loading...</p>
      ) : transaction ? (
        <div className="overflow-x-auto">
          <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Transaction Details</h2>
          <table className="table rounded-lg bg-base-100 w-full shadow-lg md:table-lg table-md">
            <tbody>
              <tr>
                <td><strong>Transaction Hash:</strong></td>
                <td>{transaction.hash}</td>
              </tr>
              <tr>
                <td><strong>Block Number:</strong></td>
                <td>{Number(transaction.blockNumber)}</td>
              </tr>
              <tr>
                <td><strong>From:</strong></td>
                <td><Address address={transaction.from} format="long" /></td>
              </tr>
              <tr>
                <td><strong>To:</strong></td>
                <td>
                  {receipt?.contractAddress ? (
                    <span>
                      Contract Creation: <Address address={receipt.contractAddress} format="long" />
                    </span>
                  ) : (
                    transaction.to && <Address address={transaction.to} format="long" />
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Value:</strong></td>
                <td>{formatEther(transaction.value)} {configuredNetwork.nativeCurrency.symbol}</td>
              </tr>
              <tr>
                <td><strong>Function called:</strong></td>
                <td>
                  {functionCalled === "0x" ? (
                    "This transaction did not call any function."
                  ) : (
                    <span>
                      {getFunctionDetails(transaction)} <span className="badge badge-primary font-bold">{functionCalled}</span>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Gas Price:</strong></td>
                <td>{formatUnits(transaction.gasPrice || 0n, 9)} Gwei</td>
              </tr>
              <tr>
                <td><strong>Data:</strong></td>
                <td className="form-control">
                  <textarea readOnly value={transaction.input} className="p-0 textarea-primary bg-inherit h-[150px]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-2xl text-base-content">Transaction not found</p>
      )}
    </div>
  );
};

export default TransactionPage;
