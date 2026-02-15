# 📚 Where to Put Your Tests - Visual Guide

## 🎯 Quick Decision Guide

```
┌─────────────────────────────────────────────────────────┐
│  "I want to test a..."                                  │
└─────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    
   Single File    Multiple Files    Test Helper
   (Unit Test)   (Integration Test)  (Utility)
         │               │               │
         ▼               ▼               ▼
         
   Put NEXT to     Put in test/     Put in src/test/
   that file         folder          folder
```

---

## 📂 Folder Structure with Real Examples

### ✅ CORRECT Structure

```
client/
│
├── src/
│   │
│   ├── 📁 components/               👈 Your components
│   │   ├── Navbar.js               ← Component
│   │   ├── Navbar.test.js          ← ✅ Test next to it
│   │   ├── Footer.js               ← Component  
│   │   └── Footer.test.js          ← ✅ Test next to it
│   │
│   ├── 📁 features/
│   │   ├── 📁 auth/
│   │   │   ├── 📁 components/
│   │   │   │   ├── LoginForm.jsx           ← Component
│   │   │   │   └── LoginForm.test.js       ← ✅ Test next to it
│   │   │   │
│   │   │   └── 📁 services/
│   │   │       ├── authService.js          ← Service
│   │   │       └── authService.test.js     ← ✅ Test next to it
│   │   │
│   │   └── 📁 createStore/
│   │       ├── 📁 components/
│   │       │   ├── StoreForm.jsx           ← Component
│   │       │   └── StoreForm.test.js       ← ✅ Test next to it
│   │       │
│   │       └── 📁 services/
│   │           ├── storeService.js         ← Service
│   │           └── storeService.test.js    ← ✅ Test next to it
│   │
│   ├── 📁 servies/
│   │   ├── api.js                  ← Utility
│   │   └── api.test.js             ← ✅ Test next to it
│   │
│   └── 📁 test/                    👈 Testing UTILITIES only
│       └── test-utils.js           ← Helper functions (NOT tests)
│
└── test/                           👈 Integration tests
    ├── setup.test.js               ← ✅ Setup verification
    ├── EXAMPLES.test.js            ← ✅ Example patterns
    │
    └── 📁 integration/             
        ├── auth-flow.test.js       ← ✅ Login → Navigate flow
        ├── store-creation.test.js  ← ✅ Create store → Add product
        └── cart-checkout.test.js   ← ✅ Add to cart → Checkout
```

---

## 🔍 Real-World Examples

### Example 1: Testing Navbar Component

**Your file:** `src/components/Navbar.js`

**Where to put test:** `src/components/Navbar.test.js` ✅

```javascript
// src/components/Navbar.test.js
import { render, screen } from '@/test/test-utils'
import Navbar from './Navbar'  // ← Import from same folder

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText(/home/i)).toBeInTheDocument()
  })
})
```

---

### Example 2: Testing Auth Service

**Your file:** `src/features/auth/services/authService.js`

**Where to put test:** `src/features/auth/services/authService.test.js` ✅

```javascript
// src/features/auth/services/authService.test.js
import { loginUser } from './authService'  // ← Import from same folder

describe('authService', () => {
  it('logs in user successfully', async () => {
    const result = await loginUser('email', 'password')
    expect(result).toBeDefined()
  })
})
```

---

### Example 3: Testing Complete User Flow (Integration)

**What you're testing:** Login → Create Store → Dashboard

**Where to put test:** `test/integration/user-flow.test.js` ✅

```javascript
// test/integration/user-flow.test.js
import { render, screen, fireEvent } from '@/test/test-utils'

describe('Complete User Flow', () => {
  it('user can login and create a store', async () => {
    // Test spans multiple features
    // Step 1: Login
    // Step 2: Navigate to create store
    // Step 3: Fill form
    // Step 4: Verify store created
  })
})
```

---

## 🚫 Common Mistakes

### ❌ WRONG: Putting component tests in test/ folder

```
test/
└── components/
    └── Navbar.test.js      ❌ Don't do this!
```

**Why wrong?** It's far from the component, harder to maintain.

**✅ CORRECT:**
```
src/components/
├── Navbar.js
└── Navbar.test.js          ✅ Do this instead!
```

---

### ❌ WRONG: Putting test files in src/test/

```
src/test/
├── test-utils.js
└── Navbar.test.js          ❌ Don't do this!
```

**Why wrong?** `src/test/` is for utilities, not test files.

**✅ CORRECT:**
```
src/test/
└── test-utils.js           ✅ Only utilities here

src/components/
└── Navbar.test.js          ✅ Tests next to components
```

---

## 📝 Simple Memory Aid

**Think of it like this:**

1. **Unit Test** (testing ONE thing)
   - 📍 Location: Next to the file
   - 🎯 Example: `Navbar.js` → `Navbar.test.js`

2. **Integration Test** (testing MANY things together)
   - 📍 Location: `test/` folder
   - 🎯 Example: `test/integration/checkout-flow.test.js`

3. **Test Utilities** (helper code for tests)
   - 📍 Location: `src/test/` folder
   - 🎯 Example: `src/test/test-utils.js`

---

## ✅ Checklist Before Writing a Test

- [ ] Am I testing ONE file? → Put test next to it
- [ ] Am I testing MULTIPLE features? → Put in `test/` folder
- [ ] Am I creating a helper function? → Put in `src/test/` folder

---

## 🎓 Start Here (Your First Test)

1. Pick a simple component (like Footer or Button)
2. Create `ComponentName.test.js` in the SAME FOLDER
3. Copy an example from `test/EXAMPLES.test.js`
4. Run `npm test`
5. See it pass! ✅

**Need help?** Look at `test/EXAMPLES.test.js` for copy-paste patterns!
