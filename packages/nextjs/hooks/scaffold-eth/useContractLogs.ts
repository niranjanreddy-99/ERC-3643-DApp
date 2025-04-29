import { useEffect, useState } from "react";
import { Address, Log } from "viem";
import { usePublicClient } from "wagmi";

const LOGS_FETCH_LIMIT = 100; // Limit number of logs per fetch to prevent overload

export const useContractLogs = (address: Address) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const client = usePublicClient();

  // Fetch logs from the blockchain
  const fetchLogs = async (fromBlock: bigint, toBlock: string) => {
    setLoading(true);
    try {
      const existingLogs = await client.getLogs({
        address: address,
        fromBlock,
        toBlock,
      });
      setLogs(existingLogs);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0n, "latest");

    // Watching for new blocks
    const unwatchBlock = client.watchBlockNumber({
      onBlockNumber: async (blockNumber, prevBlockNumber) => {
        if (blockNumber > prevBlockNumber) {
          // Only fetch logs for the new block if there is a change
          const newLogs = await client.getLogs({
            address: address,
            fromBlock: prevBlockNumber,
            toBlock: "latest",
          });

          // Append new logs to the previous logs, ensuring we don't exceed the limit
          setLogs((prevLogs) => {
            const updatedLogs = [...prevLogs, ...newLogs];
            return updatedLogs.slice(-LOGS_FETCH_LIMIT); // Keep the last N logs
          });
        }
      },
    });

    // Cleanup: Stop watching block number when component unmounts or address changes
    return () => {
      unwatchBlock();
    };
  }, [address, client]);

  return { logs, loading };
};
