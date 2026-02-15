# Frontend Testing Guide - Vyapar Sathi

## Overview
We've set up **Jest** with **React Testing Library** for comprehensive frontend testing. This allows us to write unit tests, integration tests, and component tests to ensure code quality before merging to the main branch.

## Technology Stack
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **jest-environment-jsdom**: Browser-like environment for tests

## Project Structure

```
Frontend-Vyapar-Sathi/client/
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Test setup file
├── .babelrc                 # Babel configuration for JSX
├── src/
│   ├── test/
│   │   └── test-utils.js    # ⚙️ Testing utilities (NOT test files)
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.test.js   # ✅ Component tests (co-located)
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── LoginForm.test.js  # ✅ Feature component tests
│   │   │   └── services/
│   │   │       ├── authService.js
│   │   │       └── authService.test.js # ✅ Service tests
│   │   └── createStore/
│   └── servies/
│       ├── api.js
│       └── api.test.js      # ✅ Utility/Service tests
└── test/
    ├── setup.test.js        # ✅ Integration/E2E tests
    └── integration/         # ✅ Cross-feature integration tests
```

### 📁 Test Folder Structure Explained

#### **1. `src/test/` folder (UTILITIES ONLY)**
- **Purpose**: Contains testing utilities and helper functions
- **What goes here**: `test-utils.js`, mock data, custom matchers
- **NOT for test files**: Don't put `*.test.js` files here

#### **2. `test/` folder (INTEGRATION/E2E TESTS)**
- **Purpose**: Integration tests, end-to-end tests, setup verification
- **What goes here**: 
  - Tests that span multiple features
  - Tests that test the whole application flow
  - Setup verification tests
- **Example**: User login → Create store → Add product workflow

#### **3. Co-located tests (RECOMMENDED)**
- **Purpose**: Unit tests for specific components/services
- **Location**: Next to the file you're testing
- **Example**: 
  - `Navbar.js` → `Navbar.test.js` (same folder)
  - `authService.js` → `authService.test.js` (same folder)
- **Why**: Easier to find and maintain tests

## Available Commands

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm test:watch
```

### Run tests with coverage report
```bash
npm test:coverage
```

## Writing Tests

### 📝 Quick Reference: Where to Put Your Tests

| What You're Testing | Where to Put Test File | Example |
|-------------------|----------------------|---------|
| React Component | Same folder as component | `src/components/Navbar.test.js` |
| Service/API | Same folder as service | `src/features/auth/services/authService.test.js` |
| Utility Function | Same folder as utility | `src/servies/api.test.js` |
| Integration Test | `test/` folder | `test/integration/auth-flow.test.js` |
| Test Utilities | `src/test/` folder | `src/test/test-utils.js` |

---

### 1. Component Tests (Unit Tests)
**Location**: Co-located with the component (same folder)

Test React components to ensure they render correctly and handle user interactions.

**Example: Testing Navbar Component**
```javascript
// File: src/components/Navbar.test.js
import { render, screen, fireEvent } from '@/test/test-utils'
import Navbar from './Navbar'

describe('Navbar Component', () => {
  it('renders the navbar with logo', () => {
    render(<Navbar />)
    // Check if logo or brand name is visible
    expect(screen.getByText(/Vyapar Sathi/i)).toBeInTheDocument()
  })

  it('shows navigation links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  })

  it('handles user click on login button', () => {
    const mockOnClick = jest.fn()
    render(<Navbar onLoginClick={mockOnClick} />)
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    fireEvent.click(loginButton)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
```

---

### 2. Service/API Tests (Unit Tests)
**Location**: Same folder as the service file

Test API calls, helper functions, and business logic.

**Example: Testing Auth Service**
```javascript
// File: src/features/auth/services/authService.test.js
import { loginUser, registerUser } from './authService'

// Mock axios or fetch
jest.mock('axios')

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should login user successfully', async () => {
    const mockUser = { email: 'test@example.com', token: 'abc123' }
    // Mock API response
    axios.post.mockResolvedValue({ data: mockUser })

    const result = await loginUser('test@example.com', 'password123')
    
    expect(result).toEqual(mockUser)
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should handle login error', async () => {
    axios.post.mockRejectedValue(new Error('Invalid credentials'))

    await expect(loginUser('wrong@email.com', 'wrongpass'))
      .rejects
      .toThrow('Invalid credentials')
  })
})
```

---

### 3. Integration Tests
**Location**: `test/` folder

Test how multiple components work together or complete user flows.

**Example: Login Flow Integration Test**
```javascript
// File: test/integration/auth-flow.test.js
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import LoginPage from '@/app/(auth)/login/page'

describe('Login Flow Integration', () => {
  it('completes full login flow', async () => {
    render(<LoginPage />)

    // Find form elements
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Submit form
    fireEvent.click(submitButton)

    // Wait for redirect or success message
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })
  })
})
```

## Best Practices

### 🎯 The Simple Rule for Beginners

```
If you're testing a SINGLE file → Put test NEXT to that file
If you're testing MULTIPLE features together → Put test in test/ folder
```

**Example Decision Tree:**

```
Are you testing...
│
├─ A single component (Navbar, Button, etc.)?
│  → Put test next to it: src/components/Navbar.test.js
│
├─ A single service/function?
│  → Put test next to it: src/features/auth/services/authService.test.js
│
└─ Multiple features working together (login + redirect + store creation)?
   → Put in test/ folder: test/integration/user-flow.test.js
```

---

1. **File Naming**: Use `.test.js` or `.spec.js` suffix
   - `Button.test.js` for component tests ✅
   - `api.test.js` for service tests ✅
   - `utils.test.js` for utility tests ✅

2. **Test Organization**:
   - Use `describe()` blocks to group related tests
   - Write clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

3. **What to Test**:
   - ✅ Component rendering
   - ✅ User interactions (clicks, form submissions)
   - ✅ Conditional rendering
   - ✅ API calls and data flow
   - ✅ Edge cases and error handling

4. **What NOT to Test**:
   - ❌ Third-party library implementation
   - ❌ Implementation details (test behavior, not code)
   - ❌ External libraries like Firebase (use mocks)

---

### 🔧 Common Testing Patterns

#### Pattern 1: Testing User Input
```javascript
it('updates input value when user types', () => {
  render(<SearchBar />)
  const input = screen.getByPlaceholderText(/search/i)
  
  fireEvent.change(input, { target: { value: 'test search' } })
  
  expect(input.value).toBe('test search')
})
```

#### Pattern 2: Testing Async Operations
```javascript
it('loads and displays products', async () => {
  render(<ProductList />)
  
  // Initially shows loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  // Wait for products to load
  const product = await screen.findByText('Product Name')
  expect(product).toBeInTheDocument()
})
```

#### Pattern 3: Testing Conditional Rendering
```javascript
it('shows login button when user is not authenticated', () => {
  render(<Navbar isAuthenticated={false} />)
  expect(screen.getByText(/login/i)).toBeInTheDocument()
})

it('shows logout button when user is authenticated', () => {
  render(<Navbar isAuthenticated={true} />)
  expect(screen.getByText(/logout/i)).toBeInTheDocument()
})
```

#### Pattern 4: Mocking API Calls
```javascript
import axios from 'axios'
jest.mock('axios')

it('fetches data from API', async () => {
  const mockData = [{ id: 1, name: 'Product' }]
  axios.get.mockResolvedValue({ data: mockData })
  
  const result = await fetchProducts()
  
  expect(result).toEqual(mockData)
  expect(axios.get).toHaveBeenCalledWith('/api/products')
})
```

## Pre-Merge Checklist

Before merging to main branch, ensure:
- [ ] All tests pass: `npm test`
- [ ] No console errors or warnings
- [ ] Code coverage for critical features
- [ ] New features have corresponding tests

## GitHub Actions CI/CD Integration ✅

**Status: IMPLEMENTED** 

Automated testing is now set up to run on every push and pull request to the main branch!

**What happens automatically:**
1. When you create a PR or push to `main`, GitHub Actions will:
   - Install dependencies
   - Run all tests
   - Generate coverage report
   - Block merge if tests fail ❌

**Configuration**: See `.github/workflows/frontend-ci.yml`

**View test results**: Go to your GitHub repository → Actions tab

### How to Use in Your Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/add-cart-functionality
   ```

2. **Write your code and tests**

3. **Run tests locally before pushing:**
   ```bash
   npm test
   ```

4. **Push your branch:**
   ```bash
   git push origin feature/add-cart-functionality
   ```

5. **Create Pull Request:**
   - GitHub Actions will automatically run tests
   - You'll see a ✅ or ❌ status in the PR
   - Only merge when tests pass!

### Viewing Test Results

- Go to: GitHub Repository → **Actions** tab
- Click on your workflow run to see detailed results
- Failed tests will show error messages to help debug

## Resources
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

## Next Steps
1. Create tests for your authentication features
2. Create tests for store components
3. Create tests for cart functionality
4. Set up GitHub Actions for automated testing (optional)
