# SafeHer - AI & Blockchain-Powered Safety Companion for Women.

SafeHer is a decentralized safety application designed to help women feel safer in their daily lives. It combines AI &blockchain technology, real-time location sharing, and emergency alerts to provide a reliable safety network.

## What SafeHer Does

SafeHer helps you stay safe by:

- **Emergency SOS Button**: With one tap, you can alert your trusted contacts about an emergency
- **Location Sharing**: Your real-time location is shared with emergency contacts when you trigger an alert
- **Blockchain Security**: All alerts are stored on the Ethereum blockchain, making them tamper-proof
- **IPFS Storage**: Emergency data is stored on IPFS (InterPlanetary File System) for decentralized access
- **Email Notifications**: Your emergency contacts receive immediate email alerts
- **Contact Management**: You can add, edit, and remove trusted contacts who will be notified in emergencies

## How to Get Started

### Prerequisites

Before you can use SafeHer, you need:

- A computer with Node.js (version 16 or higher)
- The MetaMask browser extension (to connect to Ethereum)
- An Ethereum wallet with some test ETH (for blockchain transactions)
- Accounts for the following services:
  - Pinata (for IPFS storage)
  - EmailJS (for sending email alerts)
  - Supabase (for database storage)
  - Geoapify (for maps)

### Setting Up Your Environment

1. Create a file named `.env` in the main project folder with these settings:

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
VITE_OPENROUTER_KEY=your_openrouter_key
```

Replace the placeholder values with your actual API keys and credentials.

### Installing SafeHer

1. Download the project:
   ```bash
   git clone https://github.com/yourusername/safe-haven-blockchain.git
   cd safeher-blockchain
   ```

2. Install the required software:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open your web browser and go to `http://localhost:5173`

## How to Use SafeHer

### Creating an Account

1. Click "Create Account" on the home page
2. Enter your email and create a password
3. Your account will be created with basic information

### Setting Up Your Profile

1. After logging in, go to your profile settings
2. Add your name, phone number, and other details
3. Connect your Ethereum wallet if you want to use blockchain features

### Adding Emergency Contacts

1. Go to the "Trusted Contacts" page
2. Click "Add Contact"
3. Enter your contact's name, phone number, email, and wallet address (optional)
4. Toggle the "Emergency Contact" switch to make them an emergency contact
5. Click "Add Contact" to save

### Using the SOS Button

1. On the Dashboard, you'll see a prominent SOS button
2. In an emergency, press this button
3. The system will:
   - Record your current location
   - Store the alert data on IPFS
   - Record the alert on the Ethereum blockchain
   - Send email notifications to your emergency contacts
   - Show you a confirmation message

### Viewing Alert History

1. Go to the "Alerts" page
2. You'll see a list of all your past alerts
3. Each alert shows:
   - When it was triggered
   - Your location at the time
   - The status (active or resolved)
   - Who responded to the alert

## Technical Details

### Smart Contract

SafeHer uses a blockchain smart contract to store alert data. The contract:
- Creates a chain of blocks containing alert information
- Stores IPFS content identifiers (CIDs) instead of the actual data
- Ensures data integrity through cryptographic hashing
- Makes alert records tamper-proof and verifiable

### Data Storage

- **IPFS**: Stores detailed alert data in a decentralized way
- **Ethereum Blockchain**: Records alert hashes for verification
- **Supabase**: Stores user profiles and contact information

### Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, MetaMask
- **Storage**: IPFS (Pinata)
- **Email**: EmailJS
- **Database**: Supabase
- **Maps**: Geoapify

## Troubleshooting

### Common Issues

1. **SOS Button Not Working**
   - Check if you're logged in
   - Make sure your browser has permission to access your location
   - Verify that MetaMask is connected to the correct network

2. **Contacts Not Receiving Alerts**
   - Check if your contacts have valid email addresses
   - Verify that your EmailJS settings are correct
   - Make sure your contacts are marked as emergency contacts

3. **Blockchain Transactions Failing**
   - Ensure you have enough ETH for gas fees
   - Check if you're connected to the correct Ethereum network
   - Verify that your MetaMask wallet is properly connected
