import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";

type Web3ContextType = {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  sendTransaction: (method: string, params: any[]) => Promise<string>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Check for previously connected wallet
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async (): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error("Please install MetaMask to connect your wallet");
        return false;
      }

      // Create a new provider
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      // Request accounts
      const accounts = await newProvider.send("eth_requestAccounts", []);
      const address = accounts[0];

      if (!address) {
        throw new Error("No accounts found");
      }

      setWalletAddress(address);
      setIsConnected(true);
      localStorage.setItem("walletAddress", address);
      
      toast.success("Wallet connected successfully");
      return true;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setProvider(null);
    localStorage.removeItem("walletAddress");
    toast.info("Wallet disconnected");
  };

  const sendTransaction = async (method: string, params: any[]): Promise<string> => {
    if (!isConnected || !provider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: params[0],
        value: ethers.parseEther(params[1]),
      });
      
      await tx.wait();
      toast.success("Transaction sent successfully");
      return tx.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed");
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isConnecting,
        sendTransaction,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
