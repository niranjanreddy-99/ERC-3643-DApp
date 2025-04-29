import { useState } from "react";
import { useRouter } from "next/router";
import { isAddress, isHex } from "viem";
import { hardhat } from "viem/chains";
import { usePublicClient } from "wagmi";

export const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const client = usePublicClient({ chainId: hardhat.id });

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!searchInput) {
      setError("Please enter a search term.");
      setLoading(false);
      return;
    }

    try {
      if (isHex(searchInput)) {
        const tx = await client.getTransaction({ hash: searchInput });
        if (tx) {
          router.push(`/blockexplorer/transaction/${searchInput}`);
          return;
        }
      }

      if (isAddress(searchInput)) {
        router.push(`/blockexplorer/address/${searchInput}`);
        return;
      }

      setError("Invalid transaction hash or address.");
    } catch (error) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center justify-end mb-5 space-x-3 mx-5">
      <input
        className="border-primary bg-base-100 text-base-content p-2 mr-2 w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        type="text"
        value={searchInput}
        placeholder="Search by hash or address"
        onChange={e => setSearchInput(e.target.value)}
      />
      <button className="btn btn-sm btn-primary" type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
    </form>
  );
};
