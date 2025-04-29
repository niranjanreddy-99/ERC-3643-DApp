import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

// Card component to display content in a consistent layout
const Card = ({
  icon,
  title,
  description,
  linkHref,
  linkText,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
}) => (
  <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-sm text-neutral mb-4">{description}</p>
    <Link href={linkHref} passHref>
      <a className="link text-primary">{linkText}</a>
    </Link>
  </div>
);

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 mb-10">
          <h1 className="text-center mb-4 text-2xl sm:text-4xl font-bold">Welcome to Scaffold-ETH 2</h1>
          <p className="text-center text-lg mb-4">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <Card
              icon={<BugAntIcon className="h-8 w-8 fill-secondary" />}
              title="Debug Contract"
              description="Tinker with your smart contract using the Debug Contract tab."
              linkHref="/debug"
              linkText="Debug Contract"
            />
            <Card
              icon={<MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />}
              title="Block Explorer"
              description="Explore your local transactions with the Block Explorer tab."
              linkHref="/blockexplorer"
              linkText="Block Explorer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
