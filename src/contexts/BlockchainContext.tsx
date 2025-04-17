import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlockchainService } from '../lib/blockchain/BlockchainService';
import { MetaMaskInpageProvider } from '@metamask/providers';

// Get environment variables
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io';

interface BlockchainContextType {
  blockchain: BlockchainService | null;
  addAlert: (alertData: {
    details: string;
    timestamp: number;
    location: {
      latitude: number;
      longitude: number;
    };
  }) => Promise<void>;
  chain: any[];
  isConnected: boolean;
  connectMetaMask: () => Promise<void>;
  contractAddress: string | null;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blockchain, setBlockchain] = useState<BlockchainService | null>(null);
  const [chain, setChain] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  const connectMetaMask = async () => {
    try {
      const ethereum = window.ethereum as MetaMaskInpageProvider;
      
      if (!ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Replace these with your actual values
      const contractABI = []; // Add your contract ABI here
      const deployedContractAddress = ''; // Add your deployed contract address here
      
      if (!PINATA_API_KEY || !PINATA_API_SECRET) {
        throw new Error('Pinata credentials not found in environment variables');
      }
      
      const blockchainService = new BlockchainService(
        ethereum,
        deployedContractAddress,
        contractABI,
        IPFS_GATEWAY,
        PINATA_API_KEY,
        PINATA_API_SECRET
      );
      
      setBlockchain(blockchainService);
      setContractAddress(deployedContractAddress);
      setIsConnected(true);
      
      const initialChain = await blockchainService.getChain();
      setChain(initialChain);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setIsConnected(false);
    }
  };

  const addAlert = async (alertData: {
    details: string;
    timestamp: number;
    location: {
      latitude: number;
      longitude: number;
    };
  }) => {
    if (!blockchain) {
      throw new Error('Blockchain not connected');
    }
    
    await blockchain.addAlert(alertData);
    const updatedChain = await blockchain.getChain();
    setChain(updatedChain);
  };

  useEffect(() => {
    if (window.ethereum) {
      const ethereum = window.ethereum as MetaMaskInpageProvider;
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            connectMetaMask();
          }
        });
    }
  }, []);

  return (
    <BlockchainContext.Provider value={{ blockchain, addAlert, chain, isConnected, connectMetaMask, contractAddress }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}; 