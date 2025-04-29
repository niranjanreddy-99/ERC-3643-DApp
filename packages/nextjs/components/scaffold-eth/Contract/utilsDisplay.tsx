import { ReactElement } from "react";
import { TransactionBase, TransactionReceipt, formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { replacer } from "~~/utils/scaffold-eth/common";

type DisplayContent =
  | string
  | number
  | bigint
  | Record<string, any>
  | TransactionBase
  | TransactionReceipt
  | undefined
  | unknown;

/**
 * Utility function to display the result of a transaction or any data.
 * @param displayContent The content to display (can be various types)
 * @param asText Flag to return content as plain text
 * @returns {string | ReactElement | number} Formatted display content
 */
export const displayTxResult = (
  displayContent: DisplayContent | DisplayContent[],
  asText = false,
): string | ReactElement | number => {
  if (displayContent == null) {
    return "";
  }

  // Handle 'bigint' values, format as Ether if needed
  if (typeof displayContent === "bigint") {
    const asNumber = Number(displayContent);
    if (asNumber <= Number.MAX_SAFE_INTEGER && asNumber >= Number.MIN_SAFE_INTEGER) {
      return asNumber; // Convert to number if within safe integer range
    }
    return `Ξ${formatEther(displayContent)}`; // Format as Ether if large value
  }

  // Handle Ethereum address (42 characters starting with '0x')
  if (typeof displayContent === "string" && displayContent.startsWith("0x") && displayContent.length === 42) {
    return asText ? displayContent : <Address address={displayContent} />;
  }

  // Handle arrays and apply text formatting for readability
  if (Array.isArray(displayContent)) {
    const mostReadable = (v: DisplayContent) =>
      ["number", "boolean"].includes(typeof v) ? v : displayTxResultAsText(v);

    const displayable = JSON.stringify(displayContent.map(mostReadable), replacer);

    return asText ? (
      displayable
    ) : (
      <span style={{ overflowWrap: "break-word", width: "100%" }}>{displayable.replaceAll(",", ",\n")}</span>
    );
  }

  // Default: Return JSON stringified content (with pretty-printing)
  return JSON.stringify(displayContent, replacer, 2);
};

// Helper function for displaying content as plain text
const displayTxResultAsText = (displayContent: DisplayContent) => displayTxResult(displayContent, true);
