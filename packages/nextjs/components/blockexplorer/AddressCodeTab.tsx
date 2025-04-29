type AddressCodeTabProps = {
  bytecode: string;
  assembly: string;
};

export const AddressCodeTab = ({ bytecode, assembly }: AddressCodeTabProps) => {
  const formattedAssembly = assembly.split(" ").join("\n");

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="font-bold">Bytecode</div>
      <div className="mockup-code -indent-5 overflow-y-auto max-h-[500px]">
        <pre className="px-5 max-h-[200px] overflow-auto">
          <code className="whitespace-pre-wrap break-words">{bytecode}</code>
        </pre>
      </div>

      <div className="font-bold">Opcodes</div>
      <div className="mockup-code -indent-5 overflow-y-auto max-h-[500px]">
        <pre className="px-5 max-h-[200px] overflow-auto">
          <code className="whitespace-pre-wrap break-words">{formattedAssembly}</code>
        </pre>
      </div>
    </div>
  );
};
