# Password Generator + Secure Vault (MVP)

A secure, privacy-first password manager built with Next.js, TypeScript, and MongoDB.

## 🚀 Features Implemented

### Must-Haves ✅
- **Password Generator**: Length slider (8-64), include/exclude numbers/letters/symbols, exclude look-alikes
- **Simple Authentication**: Email + password registration/login
- **Vault Management**: Store title, username, password, URL, notes
- **Client-Side Encryption**: AES encryption via crypto-js - server never sees plaintext
- **Copy to Clipboard**: Auto-clear after 15 seconds
- **Search & Filter**: Real-time search through vault items
- **Fast, Minimal UI**: Clean, responsive design

### Security Features 🔒
- **End-to-End Encryption**: All vault data encrypted client-side before transmission
- **PBKDF2 Key Derivation**: User password + unique salt generates encryption key
- **Zero-Knowledge Architecture**: Server only stores encrypted ciphertext
- **Secure Sessions**: HTTP-only cookies for authentication

## 🔐 Cryptography Implementation

**Library Used**: CryptoJS (AES-256 + PBKDF2)

**Why**: CryptoJS provides battle-tested AES encryption with PBKDF2 key derivation. The client derives an encryption key from the user's password using PBKDF2 with a unique salt, ensuring the server never has access to the plaintext encryption key or vault data.

**Flow**:
1. User registers → Server generates unique `kdfSalt`
2. Client derives AES key: `PBKDF2(password + kdfSalt, 1000 iterations)`
3. Vault items encrypted client-side with AES-256
4. Server stores only ciphertext + IV, never plaintext

## 🛠 Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB database (local or cloud)

### Local Development
1. **Clone and install**:
   ```bash
   git clone <repo-url>
   cd password-vault-mvp
   npm install
   ```

2. **Environment setup** - Create `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/passwordvault
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passwordvault
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### Production Deployment (Vercel)

1. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string



## 📱 Usage Flow

1. **Register/Login** with email and password
2. **Generate Password**: Use sliders and checkboxes to customize
3. **Save to Vault**: Add title, username, URL, notes
4. **Search & Manage**: Find, edit, copy, or delete entries
5. **Auto-Clear**: Copied passwords clear from clipboard after 15s

## 🏗 Tech Stack

- **Frontend**: Next.js 12, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Encryption**: CryptoJS (AES-256, PBKDF2)
- **Authentication**: HTTP-only cookies + bcrypt
- **Styling**: Custom CSS (minimal, fast)

## 📁 Project Structure

```
├── pages/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── vault/         # Vault CRUD operations
│   ├── index.tsx          # Main application
│   └── _app.tsx           # App wrapper
├── lib/
│   └── mongo.ts           # MongoDB connection
├── types/
│   └── global.d.ts        # TypeScript declarations
├── styles.css             # Application styles
└── README.md
```

## 🔒 Security Considerations

- **Client-Side Encryption**: All sensitive data encrypted before leaving browser
- **No Plaintext Storage**: Server never stores or logs plaintext passwords
- **Secure Key Derivation**: PBKDF2 with 1000 iterations + unique salt per user
- **Session Security**: HTTP-only cookies prevent XSS attacks
- **Input Validation**: Server-side validation on all endpoints

## 🚀 Performance

- **Instant Generation**: Password generation happens client-side
- **Minimal Bundle**: Lightweight dependencies, fast load times
- **Efficient Search**: Client-side filtering for instant results
- **Optimized Queries**: MongoDB indexes on user email

## 📋 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `GET /api/vault/list` - List user's vault items
- `POST /api/vault/create` - Create new vault item
- `POST /api/vault/update` - Update vault item
- `POST /api/vault/delete` - Delete vault item

## 🧪 Testing the App

1. Register a new account
2. Generate a strong password
3. Save it to your vault with details
4. Search for the item
5. Copy password (note auto-clear)
6. Edit/delete items
7. Check network tab - only encrypted data transmitted

## 📝 License

MIT License - feel free to use for personal or commercial projects.
# password_vault
