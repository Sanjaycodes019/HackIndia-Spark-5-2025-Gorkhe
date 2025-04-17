import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Wallet, LogOut, Loader2 } from "lucide-react";

const ConnectWallet = () => {
  const { isConnected, walletAddress, connectWallet, disconnectWallet, isConnecting } = useWeb3();

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium hidden md:inline-block">
          {formatAddress(walletAddress)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="border-safety-purple text-safety-purple hover:bg-safety-purple/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-safety-purple hover:bg-safety-purple-dark text-white"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectWallet;
