# TrustVault Development Workflow Guide

## Phase-Based Development Process

This document outlines the correct workflow for developing each phase of TrustVault.

### ✅ Correct Workflow for Each Phase

#### Step 1: Prepare
```bash
# Switch to master and get latest code
git checkout master
git pull origin master
```

#### Step 2: Create Phase Branch
```bash
# Create new branch from master (current phase branch name format)
git checkout -b siddhesh-phase-X-feature-name
# Example: git checkout -b siddhesh-phase-6-admin-portal
```

#### Step 3: Develop Features
```bash
# Make changes and commit regularly
git add .
git commit -m "Implement feature X"
git commit -m "Add feature Y"
# Continue development for days/weeks as needed
```

#### Step 4: Push to GitHub
```bash
git push origin siddhesh-phase-X-feature-name
```

#### Step 5: Merge via Pull Request (GitHub)
1. Go to: https://github.com/sebastiankaria14/-Trustvault-Blockchain-Anchored-Verifiable-Credential-Network
2. Click "Create Pull Request"
3. From: `siddhesh-phase-X-feature-name` → To: `master`
4. Review all changes
5. Click "Merge Pull Request"

#### Step 6: Sync Local Repository
```bash
# Switch to master and pull the merged changes
git checkout master
git pull origin master
```

---

### ❌ Common Mistakes to Avoid

| Mistake | Problem | How to Avoid |
|---------|---------|-------------|
| Creating branch from old master | Phase code gets split across branches | Always run `git pull origin master` before creating branch |
| Working directly on master | Merges become complicated | Always create a feature branch first |
| Forgetting to pull before branching | New branch misses latest commits | Run pull before checkout -b |
| Not merging back to master after PR | Next phase won't have previous phase code | Always sync local master after PR merge |
| Multiple PRs without syncing | Merge conflicts multiply | Sync master before starting new phase |

---

### 📋 Current Phase Status

**Completed Phases (on master):**
- ✅ Phase 1: Public Website
- ✅ Phase 2: Authentication System
- ✅ Phase 3: User Wallet Portal
- ✅ Phase 4: Institution Portal
- ✅ Phase 5: Verifier Portal with Verification Tracking

**In Development:**
- ⏳ Phase 6: Admin Portal (Create when ready)

---

### 🔄 Quick Checklist for Starting New Phase

- [ ] Run `git checkout master`
- [ ] Run `git pull origin master`
- [ ] Run `git checkout -b siddhesh-phase-X-feature-name`
- [ ] Develop features and commit regularly
- [ ] Run `git push origin siddhesh-phase-X-feature-name`
- [ ] Create PR on GitHub
- [ ] Merge PR on GitHub
- [ ] Run `git checkout master && git pull origin master`
- [ ] Ready for next phase!

---

### 📌 Important Notes

1. **Branch Naming Convention**: `siddhesh-phase-X-feature-description`
   - Phase 6: `siddhesh-phase-6-admin-portal`
   - Phase 7: `siddhesh-phase-7-analytics-dashboard`
   - etc.

2. **Always Use PRs**: Even for solo development, using PRs:
   - Creates clear commit history
   - Allows for code review
   - Maintains clean master branch
   - Prevents accidental direct pushes to master

3. **Pull Before Branching**: This ensures your new branch has all latest code from all previous phases

4. **Sync After Merge**: After merging PR to master, always pull master locally so your next phase has all code

---

Last updated: 2026-03-25
