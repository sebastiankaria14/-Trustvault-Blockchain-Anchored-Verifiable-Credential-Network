# 05 - GIT COLLABORATION GUIDE

**Date:** 2026-03-24
**Status:** ✅ Reference Guide

---

## 📌 QUICK SETUP

### First Time Only
```bash
# Clone repo (if not already done)
git clone <repo-url>
cd TrustVault

# Create your branch
git checkout -b phase-3-user-wallet

# Push it
git push origin phase-3-user-wallet
```

---

## 👤 YOUR WORKFLOW (Phase 3 - User Wallet)

### Daily Work
```bash
# Start of day - get latest master changes
git checkout master
git pull origin master
git checkout phase-3-user-wallet
git merge master

# Make changes to files...

# End of day - save work
git add .
git commit -m "Brief description of changes"
git push origin phase-3-user-wallet
```

---

## 👥 YOUR FRIEND'S WORKFLOW (Phase 1 - Improvements)

Same as yours but different branch:
```bash
git checkout -b phase-1-improvements
git push origin phase-1-improvements
```

---

## 📥 WHEN YOUR FRIEND MERGES FIRST (Still Working?)

Your friend finishes and merges to master, but you're still working? **PULL HIS CHANGES:**

```bash
# Switch to master
git checkout master

# Pull his merged changes
git pull origin master

# Switch back to your branch
git checkout phase-3-user-wallet

# Merge master into your branch
git merge master

# Continue working on Phase 3...
```

This keeps your branch updated with latest code!

---

## ✅ WHEN YOU'RE DONE WITH PHASE 3

1. Go to **GitHub.com**
2. Click **Pull Requests** → **New Pull Request**
3. Choose: `phase-3-user-wallet` → `master`
4. Click **Create Pull Request**
5. Owner **reviews** and **merges**

---

## 🔄 AFTER YOUR MERGE

Get the latest:
```bash
git checkout master
git pull origin master
git checkout phase-3-user-wallet
git merge master
```

---

## ⚠️ IMPORTANT NOTES

| Rule | Why |
|------|-----|
| **Always work on your branch** | Prevents conflicts |
| **Push daily** | Backup and collaboration |
| **Pull before starting** | Stay updated |
| **Different files = no conflict** | Phase 1 and Phase 3 don't overlap |

---

## 🚨 IF SOMETHING GOES WRONG

```bash
# See your changes
git status

# Undo last commit (keep files)
git reset --soft HEAD~1

# See commit history
git log --oneline -5
```

---

## 📝 BRANCH NAMES

- **Phase 1 Improvements**: `phase-1-improvements`
- **Phase 3 User Wallet**: `phase-3-user-wallet`
- **Main**: `master`

---

That's it! Keep it simple and collaborate smoothly. 🚀
