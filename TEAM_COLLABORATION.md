# 👥 Team Collaboration Guide

## Onboarding New Developers

### Step 1: Project Setup (5 min)
```bash
# Clone the repository
git clone https://github.com/your-org/project-name.git
cd project-name

# Create environment file from template
cp .env.example .env.local

# Ask team lead for .env.local credentials
# (or set manually from secure storage)

# Install dependencies
npm install

# Start development
npm run dev
```

### Step 2: Documentation Review (30 min)
New team members should read:
1. **START_HERE.md** - Project overview
2. **QUICK_START.md** - Setup & common tasks
3. **PROJECT_STRUCTURE.md** - File organization
4. **ARCHITECTURE.md** - System design

### Step 3: First Task
- Start with small bug fix or UI improvement
- Reference QUICK_START.md for patterns
- Ask questions in team chat

---

## Code Standards

### TypeScript
✅ **Always use types**
```typescript
// ✅ Good
const [data, setData] = useState<Karyawan[]>([]);

// ❌ Bad
const [data, setData] = useState<any>(null);
```

### Error Handling
✅ **Always wrap async operations**
```typescript
// ✅ Good
try {
  const result = await service.operation();
  // handle success
} catch (error) {
  console.error('Failed:', error);
  showNotification('error', 'Error', 'Message');
}

// ❌ Bad
const { error } = await supabase.from('...').select();
```

### Components
✅ **Keep components focused**
```typescript
// ✅ Good - component focused on UI
export const MyComponent = () => {
  const handleAction = async () => {
    const result = await myService.operation();
    // handle result
  };
  return <div onClick={handleAction}>Action</div>;
};

// ❌ Bad - too much logic
export const MyComponent = () => {
  // 100 lines of business logic + UI
};
```

### Services
✅ **Keep services focused on logic**
```typescript
// ✅ Good - service handles all logic
export const myService = {
  async operation() {
    try {
      const result = await supabase.from('table')...;
      return result;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
};
```

---

## Git Workflow

### Branch Naming
```
feature/add-attendance-photo   # New feature
bugfix/camera-permission       # Bug fix
docs/update-readme             # Documentation
refactor/cleanup-admin         # Refactoring
```

### Commit Messages
```
✅ Good:
  git commit -m "feat: add camera preview component"
  git commit -m "fix: resolve video stream memory leak"
  git commit -m "docs: update project structure"

❌ Bad:
  git commit -m "update"
  git commit -m "fixed stuff"
  git commit -m "asdf"
```

### Pull Request Process
1. Create feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and commit
   ```bash
   git add src/
   git commit -m "feat: describe your changes"
   ```

3. Push to remote
   ```bash
   git push origin feature/my-feature
   ```

4. Create Pull Request
   - Write clear description
   - Reference any issues
   - Wait for review

5. Merge after approval
   ```bash
   git merge --squash feature/my-feature
   git push origin main
   ```

---

## Code Review Checklist

When reviewing pull requests, check:

### ✅ Technical
- [ ] No `any` types (use proper interfaces)
- [ ] Error handling present (try-catch)
- [ ] No console.log left in
- [ ] Memory cleanup if needed (useEffect)
- [ ] Props have TypeScript types
- [ ] Service calls use error handling

### ✅ Functionality
- [ ] Feature works as described
- [ ] No regression in existing features
- [ ] Error cases handled
- [ ] Loading states present
- [ ] Works on mobile/tablet

### ✅ Code Quality
- [ ] No code duplication
- [ ] Follows project patterns
- [ ] Components are focused
- [ ] Services are reusable
- [ ] Readable variable names

### ✅ Documentation
- [ ] Comments for complex logic
- [ ] Type definitions updated
- [ ] No breaking changes
- [ ] Updated if API changed

---

## Communication

### Slack/Teams Channels

| Channel | Purpose |
|---------|---------|
| #dev-general | General development chat |
| #bugs | Bug reports |
| #code-review | Code reviews |
| #deployments | Deployment updates |
| #documentation | Doc updates |

### Daily Standup
Share:
- What you did yesterday
- What you'll do today
- Any blockers

### Code Review
- Be respectful
- Ask questions don't demand
- Explain why something is better
- Approve when satisfied

---

## Troubleshooting as Team

### Problem: TypeScript Error
1. Check `src/types/index.ts` for interface
2. Verify prop types match
3. Use `node_modules/.bin/tsc --noEmit`
4. Ask in #dev-general if stuck

### Problem: Git Conflict
1. Pull latest main: `git pull origin main`
2. Resolve conflicts in editor
3. Test before commit: `npm run dev`
4. Commit: `git commit -m "resolve merge conflict"`

### Problem: Feature Not Working
1. Check service in `src/services/`
2. Add console.log for debugging
3. Check browser console for errors
4. Ask teammate for pair programming

### Problem: Build Fails
1. Run `npm install` (missing deps)
2. Run `npm run dev` (Vite issues)
3. Check `.env.local` (missing credentials)
4. Check TypeScript errors: `node_modules/.bin/tsc --noEmit`

---

## Knowledge Sharing

### Weekly Tech Talk
- Share learnings (1 hour)
- Discuss architecture decisions
- Code review together
- Troubleshoot issues

### Documentation Updates
If you:
- Find a bug
- Learn something new
- Improve a process

Then:
- Update relevant documentation
- Share in team chat
- Create pull request

### Pair Programming
When:
- Learning new pattern
- Solving complex bug
- Code review together
- Mentoring junior dev

---

## Performance Expectations

### Productivity
- 6 hours/day coding
- 1 hour/day meetings
- 1 hour/day learning/review

### Quality
- All code reviewed before merge
- 95% TypeScript type coverage
- Zero console errors
- All tests passing

### Communication
- Daily standup (15 min)
- Code review response (4 hours)
- Chat response (1 hour)

---

## Learning Resources

### For Getting Better
1. Study existing code in `src/`
2. Read documentation files
3. Follow code patterns
4. Ask senior devs questions
5. Pair program regularly

### Recommended Topics
- TypeScript deep dive
- React hooks patterns
- Error handling strategies
- Performance optimization
- Testing best practices

---

## Team Metrics

Track these for team health:

| Metric | Target | Status |
|--------|--------|--------|
| Code review time | <4 hours | ✅ |
| Test coverage | >80% | ⏳ |
| Deploy frequency | Daily | ✅ |
| Bug escape rate | <5% | ✅ |
| Team satisfaction | >8/10 | ⏳ |

---

## Questions?

### Ask:
1. **Implementation Q** → Ask in code comment
2. **Architecture Q** → Ask senior dev
3. **General Q** → Ask in #dev-general
4. **Urgent Q** → Ask immediately

Never hesitate to ask! Learning together makes us better. 🤝

---

**Welcome to the team!** 🎉

Let's build something great together!
