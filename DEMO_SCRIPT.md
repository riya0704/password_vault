# Demo Script (60-90 seconds)

## Screen Recording Flow

### 1. Landing Page (5s)
- Show the clean, minimal interface
- Point out "Password Vault (MVP)" title
- Show login/register form

### 2. Registration (10s)
- Enter email: `demo@example.com`
- Enter password: `SecureDemo123!`
- Click "Register"
- Show success message
- Click "Login" with same credentials

### 3. Password Generation (15s)
- Show password generator section
- Adjust length slider (16 → 24)
- Toggle options (show symbols, exclude look-alikes)
- Click "Generate" multiple times
- Show different generated passwords
- Copy one to demonstrate

### 4. Save to Vault (15s)
- Fill in vault form:
  - Title: "GitHub Account"
  - Username: "demo_user"
  - Password: (use generated password)
  - URL: "github.com"
  - Notes: "Main development account"
- Click "Save to vault"
- Show success message

### 5. Add Another Item (10s)
- Generate new password
- Quick save:
  - Title: "Email Account"
  - Username: "demo@gmail.com"
  - Password: (generated)
- Save to vault

### 6. Vault Management (15s)
- Show vault list with 2 items
- Demonstrate search: type "git" → filters to GitHub item
- Clear search to show all items
- Click "Copy" on password → show clipboard notification
- Wait 5s, mention auto-clear feature

### 7. Edit & Delete (10s)
- Click "Edit" on GitHub item
- Change title to "GitHub - Personal"
- Show updated item
- Click "Delete" on email item
- Confirm deletion
- Show item removed from list

### 8. Security Demo (5s)
- Open browser dev tools → Network tab
- Refresh page or save new item
- Show encrypted ciphertext in network requests
- Highlight "no plaintext visible"

## Key Points to Mention

1. **"Client-side encryption ensures your passwords never leave your device in plaintext"**
2. **"Generated passwords are cryptographically secure with customizable options"**
3. **"Search works instantly across all your vault items"**
4. **"Clipboard auto-clears after 15 seconds for security"**
5. **"All data is encrypted before being sent to the server"**

## Technical Callouts

- "Using AES-256 encryption with PBKDF2 key derivation"
- "Built with Next.js and TypeScript for type safety"
- "MongoDB stores only encrypted ciphertext, never plaintext"
- "Zero-knowledge architecture - even we can't see your passwords"