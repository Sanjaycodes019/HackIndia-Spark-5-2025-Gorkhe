# SafeHer
A decentralized safety companion for women — blending AI, IPFS, and Ethereum blockchain to provide instant emergency alerts in danger with location to emergency contacts and these details are stored in blockchain based IPFS(Inter Planetary File Storage) which is tamper proof so that no one can alter it and becomes a proof in legal case.
Also there is a safety assistant chatbot based on OOLAMA language model which gives answers to the problems/questions asked by woman in emergency situations.
You can also ask for the location and contact details of nearby police stations, hospitals, woman helpline and other emergency services during emergency situations.



## Features
-Emergency SOS button for one-tap alerts
-AI-powered chatbot to assist victims during panic powered using OOLAMA
-Real-time location sharing with trusted/emergency contacts
-Decentralized data storage using IPFS for tamper proof data helpful for legal matters
-Immutable records on Ethereum blockchain


## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, MetaMask
- **Storage**: IPFS (Pinata)
- **Email**: EmailJS
- **Database**: Supabase
- **Maps**: Geoapify
- **LLM** :OOLAMA (using fastapi of python)


## Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- Ethereum wallet with test ETH
- Pinata account for IPFS storage
- EmailJS account for email alert
- Supabase account for database
- Geoapify API key for maps


## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_API_SECRET=your_pinata_api_secret
VITE_PINATA_JWT=your_pinata_jwt
VITE_IPFS_GATEWAY=your_ipfs_gateway
VITE_GEOAPIFY_KEY=your_geoapify_key
```
Links of the service:
#https://app.pinata.cloud (IPFS storage supported by blockchain) 

#https://www.geoapify.com/

#https://www.emailjs.com/

#https://www.supabase.com




## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/safe-haven-blockchain.git
   cd safeHer-blockchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
npm run dev
```

4.Deploy the LLM
# cd LLM
# python main.py

Make sure OOLAMA is installed on your computer
To install and serve OOLAMA model follow these steps:

# For Windows - download the installer from https://ollama.com/download
# Run this command in terminal to pull OOLAMA Model:ollama pull mistral:7b(or any other model)
#Install the required dependecies to serve modeal via fastapi
 pip install fastapi uvicorn pydantic requests
 or 
 pip install -r requirements.txt

 The performance of LLM depends on your system.


## Smart Contract Deployment

1. Make sure MetaMask is connected to the correct network
2. Ensure you have enough ETH for gas fees
3. Test the SOS button functionality on the Dashboard
4. Verify that alerts are being stored on IPFS and the blockchain
5. Check that emergency contacts are being notified

## Troubleshooting

### IPFS Issues
- Verify your Pinata API keys are correct
- Check if the IPFS gateway is accessible
- Ensure your data is properly formatted

### Blockchain Issues
- Make sure MetaMask is installed and connected
- Verify you're on the correct network
- Ensure you have enough ETH for gas fees
- Check if the contract address is correct
