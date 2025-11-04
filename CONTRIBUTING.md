# Contributing Guide

Thank you for considering contributing to the AI Personal Finance Management project! This guide will help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-Personal-Finance-Management.git
   cd AI-Personal-Finance-Management
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/Radharamangurjar315/AI-Personal-Finance-Management.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. Start MongoDB:
   ```bash
   mongod
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Keeping Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## Code Style

### JavaScript Style Guide

We follow standard JavaScript conventions:

#### Naming Conventions
- **Variables/Functions**: camelCase (`userName`, `calculateTotal`)
- **Classes**: PascalCase (`UserModel`, `TransactionService`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_POINTS`, `DEFAULT_LEVEL`)
- **Files**: kebab-case (`user-routes.js`, `auth-middleware.js`)

#### Code Formatting
```javascript
// Good
async function getUserProfile(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error('User not found');
  }
}

// Bad
async function getUserProfile(userId){
try{
const user = await User.findById(userId);
return user;}catch(error){
throw new Error('User not found');}}
```

#### Comments
- Use comments to explain "why", not "what"
- Document complex algorithms
- Add JSDoc comments for public APIs

```javascript
/**
 * Calculates user level based on total points
 * @param {number} points - Total points earned
 * @returns {number} User level
 */
function calculateLevel(points) {
  return Math.floor(points / POINTS.LEVEL_THRESHOLD) + 1;
}
```

### Frontend Code Style

#### HTML
- Use semantic HTML5 elements
- Keep markup clean and readable
- Add ARIA labels for accessibility

#### CSS
- Use CSS custom properties for colors
- Follow BEM naming for complex components
- Keep selectors simple and specific

#### JavaScript
- Avoid global variables
- Use async/await over callbacks
- Handle errors gracefully
- Keep functions small and focused

## Testing

### Manual Testing
Before submitting a PR, test your changes:

1. **User Authentication**
   - Registration with valid/invalid data
   - Login with correct/incorrect credentials
   - Token expiration handling

2. **Core Features**
   - Transaction CRUD operations
   - Analytics calculations
   - Challenge generation and updates
   - Leaderboard display

3. **Edge Cases**
   - Empty states
   - Large datasets
   - Network failures
   - Invalid inputs

4. **Security**
   - Rate limiting
   - Input sanitization
   - Authorization checks

### API Testing
Use the curl commands in `TESTING.md` to verify API endpoints.

### Browser Testing
Test on multiple browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (if available)

## Submitting Changes

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(transactions): add CSV export functionality

Implemented CSV export for transaction history with filtering options.
Users can now download their transaction data.

Closes #123
```

```
fix(auth): prevent duplicate user registration

Added proper validation to check for existing email before registration.
Also improved error messages for better UX.

Fixes #456
```

### Pull Request Process

1. **Update your branch:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request:**
   - Go to GitHub and create a PR
   - Fill in the PR template
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

4. **PR Checklist:**
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] Manual testing completed
   - [ ] No console errors or warnings
   - [ ] Security considerations addressed

5. **Review Process:**
   - Respond to feedback promptly
   - Make requested changes
   - Keep PR focused and small
   - Resolve merge conflicts

6. **After Approval:**
   - Maintainer will merge your PR
   - Delete your feature branch
   - Update your local repo

## Feature Requests

### Proposing New Features

1. **Check existing issues** - Someone may have already suggested it
2. **Open a new issue** with the `enhancement` label
3. **Describe the feature:**
   - Problem it solves
   - Proposed solution
   - Alternative solutions considered
   - Impact on existing features
4. **Wait for discussion** before implementing

### Feature Proposal Template

```markdown
## Feature Request: [Feature Name]

### Problem
Describe the problem this feature would solve.

### Proposed Solution
Describe how you'd like this feature to work.

### Alternatives
What alternative solutions have you considered?

### Additional Context
Screenshots, mockups, or examples from other apps.
```

## Bug Reports

### Reporting Bugs

1. **Search existing issues** - Bug may already be reported
2. **Create a new issue** with the `bug` label
3. **Include:**
   - Clear, descriptive title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/logs
   - Environment details

### Bug Report Template

```markdown
## Bug Report: [Brief Description]

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Screenshots
If applicable

### Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 98]
- Node.js: [e.g., v16.13.0]
- MongoDB: [e.g., v5.0.6]

### Additional Context
Any other relevant information
```

## Areas for Contribution

We welcome contributions in these areas:

### High Priority
- [ ] Automated testing (unit, integration, e2e)
- [ ] Bank API integration (Plaid, Yodlee)
- [ ] Email verification and password reset
- [ ] Mobile responsive improvements
- [ ] Performance optimizations

### Medium Priority
- [ ] Export functionality (CSV, PDF)
- [ ] Advanced analytics and charts
- [ ] Budget alerts and notifications
- [ ] Recurring transactions
- [ ] Multi-currency support

### Nice to Have
- [ ] Dark mode
- [ ] Custom themes
- [ ] Social sharing
- [ ] Achievement sharing
- [ ] Friend connections

## Development Resources

### Useful Documentation
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [JWT Introduction](https://jwt.io/introduction)

### Project-Specific Docs
- `README.md` - Project overview and setup
- `ARCHITECTURE.md` - System architecture and design
- `TESTING.md` - Testing guidelines
- `API.md` - API documentation (to be created)

## Questions?

- Open an issue with the `question` label
- Check existing issues and documentation
- Reach out to maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in the project

Thank you for contributing! 🎉
