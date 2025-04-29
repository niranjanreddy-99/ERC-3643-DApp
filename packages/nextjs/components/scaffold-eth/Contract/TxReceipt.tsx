import { TransactionReceipt } from "viem";
import { displayTxResult } from "~~/components/scaffold-eth";

type TxReceiptProps = {
  txResult: string | number | bigint | Record<string, any> | TransactionReceipt | undefined;
};

export const TxReceipt = ({ txResult }: TxReceiptProps) => {
  return (
    <div className="flex-wrap collapse collapse-arrow mb-2">
      <input type="checkbox" className="min-h-0 peer" id="tx-receipt-toggle" />
      <div
        className="collapse-title text-sm rounded-3xl peer-checked:rounded-b-none min-h-0 bg-secondary py-1.5"
        aria-labelledby="tx-receipt-toggle"
      >
        <strong>Transaction Receipt</strong>
      </div>
      <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl">
        <pre className="text-xs pt-4">{displayTxResult(txResult)}</pre>
      </div>
    </div>
  );
};
