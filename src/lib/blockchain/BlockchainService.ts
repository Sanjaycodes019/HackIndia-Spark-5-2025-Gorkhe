import Web3 from 'web3';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { IPFSService } from '../ipfs/IPFSService';

interface Block {
  index: number;
  timestamp: number;
  ipfsCID: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

interface AlertData {
  details: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export class BlockchainService {
  private web3: Web3;
  private contractAddress: string;
  private contract: any;
  private ipfsService: IPFSService;

  constructor(
    provider: MetaMaskInpageProvider,
    contractAddress: string,
    contractABI: any,
    ipfsGateway: string,
    pinataApiKey: string,
    pinataSecretKey: string
  ) {
    this.web3 = new Web3(provider as any);
    this.contractAddress = contractAddress;
    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
    this.ipfsService = new IPFSService(ipfsGateway, pinataApiKey, pinataSecretKey);
  }

  public async addAlert(alertData: AlertData): Promise<void> {
    try {
      // Upload alert data to IPFS
      const ipfsCID = await this.ipfsService.uploadAlertToIPFS(alertData);
      
      // Add block to blockchain with IPFS CID
      const accounts = await this.web3.eth.getAccounts();
      await this.contract.methods.addBlock(ipfsCID).send({ from: accounts[0] });
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  }

  public async getChainLength(): Promise<number> {
    return await this.contract.methods.getChainLength().call();
  }

  public async getBlock(index: number): Promise<Block> {
    const block = await this.contract.methods.getBlock(index).call();
    return {
      index: Number(block.index),
      timestamp: Number(block.timestamp),
      ipfsCID: block.ipfsCID,
      previousHash: block.previousHash,
      hash: block.hash,
      nonce: Number(block.nonce)
    };
  }

  public async getChain(): Promise<Block[]> {
    const length = await this.getChainLength();
    const chain: Block[] = [];
    
    for (let i = 0; i < length; i++) {
      const block = await this.getBlock(i);
      chain.push(block);
    }
    
    return chain;
  }

  public async getAlertData(ipfsCID: string): Promise<AlertData> {
    return await this.ipfsService.retrieveAlertFromIPFS(ipfsCID);
  }
} 