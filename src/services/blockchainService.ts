import { ethers } from 'ethers';
import { toast } from 'sonner';

// Contract address and ABI
// Use a fallback address if the environment variable is not set
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const CONTRACT_ABI = [
  "function addBlock(string memory ipfsHash) public returns (uint256)",
  "function getBlock(uint256 index) public view returns (string memory)"
];

// Track if we're already requesting accounts
let isRequestingAccounts = false;

// Helper function to get provider and signer
const getProviderAndSigner = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask to use this feature');
  }

  // Check if already connected
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  if (accounts.length === 0) {
    // Only request accounts if not already requesting
    if (isRequestingAccounts) {
      throw new Error('Account request already in progress. Please wait.');
    }
    
    try {
      isRequestingAccounts = true;
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } finally {
      isRequestingAccounts = false;
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return { provider, signer };
};

export const storeSOSAlert = async (ipfsHash: string) => {
  try {
    console.log('Storing SOS alert on blockchain with IPFS hash:', ipfsHash);
    
    // Check if we're using the fallback address
    if (CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
      console.warn('Using fallback contract address. This is for testing only.');
      toast.warning('Using test contract address. This is for testing only.');
    }
    
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Check network connection
    const network = await signer.provider.getNetwork();
    console.log('Connected to network:', network.name);
    
    // Estimate gas before sending transaction
    const gasEstimate = await contract.addBlock.estimateGas(ipfsHash);
    console.log('Estimated gas:', gasEstimate.toString());
    
    // Send transaction with higher gas limit for safety
    const tx = await contract.addBlock(ipfsHash, { 
      gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
    });
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error storing data on blockchain:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds to complete the transaction');
      } else if (error.message.includes('nonce')) {
        throw new Error('Transaction nonce error. Please reset your MetaMask account');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again');
      } else if (error.message.includes('execution reverted')) {
        throw new Error('Transaction reverted. The contract may not be deployed at this address.');
      }
    }
    
    throw error;
  }
};

export const getSOSAlert = async (index: number) => {
  try {
    const { provider } = await getProviderAndSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log('Retrieving block at index:', index);
    const block = await contract.getBlock(index);
    console.log('Block retrieved:', block);
    
    return block;
  } catch (error) {
    console.error('Error retrieving data from blockchain:', error);
    throw error;
  }
}; 