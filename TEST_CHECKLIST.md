# Testing Checklist

## Manual Testing Guide

### 🔐 Authentication Flow
- [ ] **Registration**
  - Enter valid email and password
  - Click "Register"
  - Verify success message
  - Check that user cannot register with same email twice
  
- [ ] **Login**
  - Enter registered credentials
  - Click "Login"
  - Verify successful login and UI change
  - Check that invalid credentials show error
  
- [ ] **Session Persistence**
  - Refresh page while logged in
  - Verify user stays logged in
  - Check vault items are still visible
  
- [ ] **Logout**
  - Click "Logout"
  - Verify UI returns to login state
  - Check that vault is cleared

### 🎲 Password Generator
- [ ] **Length Slider**
  - Move slider from 8 to 64
  - Verify generated password length matches
  - Test edge cases (minimum/maximum)
  
- [ ] **Character Options**
  - Toggle uppercase letters on/off
  - Toggle lowercase letters on/off
  - Toggle numbers on/off
  - Toggle symbols on/off
  - Verify generated passwords respect settings
  
- [ ] **Exclude Look-alikes**
  - Enable/disable option
  - Generate multiple passwords
  - Verify no confusing characters (i,l,1,L,0,O,o) when enabled
  
- [ ] **Generation Speed**
  - Click "Generate" rapidly
  - Verify instant response
  - Check passwords are different each time

### 💾 Vault Management
- [ ] **Create Item**
  - Fill all fields (title, username, password, URL, notes)
  - Click "Save to vault"
  - Verify item appears in list
  - Test with minimal data (title only)
  
- [ ] **View Items**
  - Create multiple items
  - Verify all items display correctly
  - Check encrypted data in network tab
  
- [ ] **Edit Item**
  - Click "Edit" on existing item
  - Modify title
  - Verify changes are saved and displayed
  
- [ ] **Delete Item**
  - Click "Delete" on item
  - Confirm deletion in prompt
  - Verify item is removed from list
  - Test canceling deletion

### 🔍 Search & Filter
- [ ] **Basic Search**
  - Create items with different titles
  - Type in search box
  - Verify real-time filtering
  
- [ ] **Search Scope**
  - Verify search works on title, username, URL
  - Test partial matches
  - Test case-insensitive search
  
- [ ] **Clear Search**
  - Enter search term
  - Clear search box
  - Verify all items return

### 📋 Clipboard Features
- [ ] **Copy Password**
  - Click "Copy" on vault item
  - Verify clipboard notification
  - Paste elsewhere to confirm copy worked
  
- [ ] **Auto-Clear**
  - Copy password
  - Wait 15+ seconds
  - Try to paste - should be empty
  - Verify clear notification appears

### 🔒 Security Verification
- [ ] **Network Traffic**
  - Open browser dev tools → Network tab
  - Perform vault operations
  - Verify only encrypted ciphertext in requests
  - Check no plaintext passwords visible
  
- [ ] **Database Inspection** (if access available)
  - Check MongoDB collections
  - Verify passwords are encrypted
  - Confirm kdfSalt is unique per user
  
- [ ] **Session Security**
  - Check cookies are HTTP-only
  - Verify no sensitive data in localStorage
  - Test session expiration

### 📱 UI/UX Testing
- [ ] **Responsive Design**
  - Test on mobile viewport
  - Verify all elements are accessible
  - Check touch targets are adequate
  
- [ ] **Loading States**
  - Test with slow network
  - Verify loading indicators
  - Check disabled states during operations
  
- [ ] **Error Handling**
  - Test with invalid inputs
  - Verify error messages are clear
  - Check graceful failure modes

### ⚡ Performance Testing
- [ ] **Load Time**
  - Measure initial page load
  - Should be under 2 seconds
  
- [ ] **Generation Speed**
  - Password generation should be instant
  - No noticeable delay on any length
  
- [ ] **Search Performance**
  - Create 50+ vault items
  - Test search responsiveness
  - Should filter instantly

## Automated Testing Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Security Test Scenarios

### Encryption Verification
1. Create vault item with known password
2. Check network requests in dev tools
3. Verify password is not visible in plaintext
4. Check MongoDB directly if possible

### Session Security
1. Login and note session cookie
2. Try to modify cookie value
3. Verify access is denied with invalid session
4. Test session persistence across browser restart

### Input Validation
1. Try SQL injection in login fields
2. Test XSS attempts in vault fields
3. Verify server validates all inputs
4. Check for proper error handling

## Performance Benchmarks
- Initial load: < 2 seconds
- Password generation: < 100ms
- Vault operations: < 500ms
- Search filtering: < 50ms

## Pass Criteria
✅ All authentication flows work correctly
✅ Password generator produces secure passwords
✅ Vault CRUD operations function properly
✅ Search filters results accurately
✅ Clipboard copy/clear works as expected
✅ No plaintext data visible in network/storage
✅ UI is responsive and user-friendly
✅ Performance meets benchmarks