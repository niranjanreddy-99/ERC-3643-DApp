import React, { ChangeEvent, useState } from "react";

interface TokenDetails {
  owner: string;
  name: string;
  symbol: string;
  decimals: string;
  irs: string;
  ONCHAINID: string;
  irAgents: string;
  tokenAgents: string;
  complianceModules: string;
  complianceSettings: string;
}

interface Errors {
  [key: string]: string;
}

const TokenDetailsInput = () => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    owner: "",
    name: "",
    symbol: "",
    decimals: "",
    irs: "",
    ONCHAINID: "",
    irAgents: "",
    tokenAgents: "",
    complianceModules: "",
    complianceSettings: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  // Handle change in form inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTokenDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    validateField(name, value); // Validate field on each change
  };

  // Validate individual fields
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "owner":
        error = validateOwner(value);
        break;
      case "name":
        error = validateName(value);
        break;
      // Add more validation cases for other fields as needed
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateOwner = (value: string) => {
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(value);
    if (!isAddress) return "Invalid Ethereum address format";
    if (value === "0x0000000000000000000000000000000000000000") return "Address cannot be the zero address";
    return "";
  };

  const validateName = (value: string) => {
    if (!value.trim()) return "Name is required.";
    if (value.length > 100) return "Name is too long.";
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
      return "Name contains invalid characters. Only alphanumeric, spaces, hyphens, and underscores are allowed.";
    }
    return "";
  };

  // Handle copy to clipboard for the generated tuple
  const handleCopy = () => {
    if (Object.values(errors).some(error => error)) {
      alert("Please fix the errors before copying the tuple.");
      return;
    }

    const complianceModulesArray = tokenDetails.complianceModules.split(",").filter(Boolean);
    const complianceSettingsArray = tokenDetails.complianceSettings.split(",").filter(Boolean);

    const complianceModulesString = complianceModulesArray.length
      ? `["${complianceModulesArray.join('","')}"]`
      : "[]";
    const complianceSettingsString = complianceSettingsArray.length
      ? `["${complianceSettingsArray.join('","')}"]`
      : "[]";
    const irAgentsArray = tokenDetails.irAgents.split(",").filter(Boolean).map(agent => `"${agent.trim()}"`).join(",");
    const tokenAgentsArray = tokenDetails.tokenAgents.split(",").filter(Boolean).map(agent => `"${agent.trim()}"`).join(",");

    const tupleString = `["${tokenDetails.owner}", "${tokenDetails.name}", "${tokenDetails.symbol}", ${tokenDetails.decimals}, "${tokenDetails.irs}", "${tokenDetails.ONCHAINID}", [${irAgentsArray}], [${tokenAgentsArray}], ${complianceModulesString}, ${complianceSettingsString}]`;

    navigator.clipboard
      .writeText(tupleString)
      .then(() => {
        alert("Tuple copied to clipboard!");
      })
      .catch(err => {
        alert("Failed to copy tuple: " + err);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Token Details Input</h2>
      <form className="space-y-4">
        {/* Owner Input */}
        <div>
          <label className="block text-sm font-medium">
            Owner (Address) <span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="owner"
            value={tokenDetails.owner}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678"
            required
          />
          {errors.owner && <p className="text-red-500 text-xs">{errors.owner}</p>}
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium">Name (String):</label>
          <input
            type="text"
            name="name"
            value={tokenDetails.name}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="TokenName"
            maxLength={100}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium">Symbol (String):</label>
          <input
            type="text"
            name="symbol"
            value={tokenDetails.symbol}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="TKN"
          />
        </div>

        {/* Decimals Input */}
        <div>
          <label className="block text-sm font-medium">Decimals (Uint8):</label>
          <input
            type="number"
            name="decimals"
            value={tokenDetails.decimals}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="18"
          />
        </div>

        {/* IRS Input */}
        <div>
          <label className="block text-sm font-medium">IRS (Address):</label>
          <input
            type="text"
            name="irs"
            value={tokenDetails.irs}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678"
          />
        </div>

        {/* ONCHAINID Input */}
        <div>
          <label className="block text-sm font-medium">ONCHAINID (Address):</label>
          <input
            type="text"
            name="ONCHAINID"
            value={tokenDetails.ONCHAINID}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678"
          />
        </div>

        {/* IR Agents Input */}
        <div>
          <label className="block text-sm font-medium">IR Agents (Address[] - comma separated):</label>
          <textarea
            name="irAgents"
            value={tokenDetails.irAgents}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>

        {/* Token Agents Input */}
        <div>
          <label className="block text-sm font-medium">Token Agents (Address[] - comma separated):</label>
          <textarea
            name="tokenAgents"
            value={tokenDetails.tokenAgents}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>

        {/* Compliance Modules Input */}
        <div>
          <label className="block text-sm font-medium">Compliance Modules (Address[] - comma separated):</label>
          <textarea
            name="complianceModules"
            value={tokenDetails.complianceModules}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>

        {/* Compliance Settings Input */}
        <div>
          <label className="block text-sm font-medium">Compliance Settings (Bytes[] - comma separated):</label>
          <textarea
            name="complianceSettings"
            value={tokenDetails.complianceSettings}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="0x1234...5678,0x1234...5678"
          ></textarea>
        </div>

        {/* Copy Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className={`bg-blue-500 text-white p-2 rounded-md ${
              Object.values(errors).some(error => error) ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={Object.values(errors).some(error => error)}
          >
            Copy Generated Tuple
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenDetailsInput;
