import { useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export const TransactionHash = ({ hash }: { hash: string }) => {
  const [addressCopied, setAddressCopied] = useState(false);

  return (
    <div className="flex items-center">
      <Link href={`/blockexplorer/transaction/${hash}`} className="text-primary-content hover:underline">
        {hash?.substring(0, 6)}...{hash?.substring(hash.length - 4)}
      </Link>
      {addressCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
          title="Copied to clipboard"
        />
      ) : (
        <CopyToClipboard
          text={hash}
          onCopy={() => {
            setAddressCopied(true);
            setTimeout(() => {
              setAddressCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
            title="Copy to clipboard"
          />
        </CopyToClipboard>
      )}
    </div>
  );
};
