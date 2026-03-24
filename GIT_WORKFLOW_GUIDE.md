# 🚀 TrustVault Team Git Workflow Guide

**This guide explains how to work together on the project without losing each other's code!**

---

## 📌 QUICK SUMMARY

Think of Git like this:
- **Your Branch** = Your personal workspace (only you edit files here)
- **Master** = The final, working code (everyone's approved changes)
- **GitHub** = Cloud backup + way to share code with team

---

## 🎯 THE BASIC RULE

**BEFORE YOU PULL, ALWAYS COMMIT!**

Git won't let you pull if you have uncommitted changes (to protect your work).

---

## 📖 STEP-BY-STEP WORKFLOW

### **Day 1: Start Working**

```bash
# Create your own branch (do this ONCE)
git checkout -b phase-3-user-wallet

# Push it to GitHub (do this ONCE)
git push origin phase-3-user-wallet
```

**What this means:**
- You now have your own workspace
- It's backed up on GitHub
- Your friend can see it but can't accidentally change it

---

### **Day 2-3: Work & Save Regularly**

```bash
# Make changes to files
# ... edit files ...

# Every few hours, save your work:
git add .
git commit -m "Description of what you did"

# Push to GitHub (backup):
git push origin phase-3-user-wallet
```

**What this means:**
- You're saving your work every few hours
- Your work is backed up on GitHub
- If computer crashes, your code is safe

---

### **IMPORTANT: Your Friend Finishes First**

**Scenario:** Your friend finished their work and it got merged to master, but you're still working!

```bash
# Step 1: Save YOUR work first (ALWAYS DO THIS)
git add .
git commit -m "WIP: Phase 3 improvements - halfway done"

# Step 2: Pull your friend's code
git pull origin master

# Step 3: Continue working (your code + their code now merged)
# ... keep editing ...

# Step 4: Keep saving
git add .
git commit -m "Continue Phase 3"
git push origin phase-3-user-wallet
```

**Why this matters:**
- You get their improvements integrated into your work
- No big conflicts at the end
- Cleaner code history

---

### **When YOU Finish**

```bash
# Step 1: Save everything
git add .
git commit -m "Complete Phase 3: User Wallet Portal"

# Step 2: Push to GitHub
git push origin phase-3-user-wallet

# Step 3: On GitHub, create Pull Request
# (Tell repo owner to review and merge)
```

**What happens next:**
- Your branch is on GitHub
- Repo owner reviews your code
- Owner merges to master
- Your code now in main project!

---

### **After Owner Merges Your PR**

```bash
# Get the latest code
git checkout master
git pull origin master

# Go back to your work (if continuing)
git checkout phase-3-user-wallet
```

---

## ❓ COMMON QUESTIONS & FIXES

### **Q: "Git won't let me pull - says I have uncommitted changes"**

**A:** Do this:
```bash
git add .
git commit -m "Save current work"
git pull origin master
```

---

### **Q: "I don't want to commit yet, just want to pull"**

**A:** Use stash (temporary hide):
```bash
git stash          # Hide your changes
git pull origin master   # Pull now
git stash pop      # Get your changes back
```

---

### **Q: "Did my friend's code get merged?"**

**A:** Check:
```bash
git log --oneline  # See all commits
```

Or go to GitHub and check "Commits" or "Pull Requests"

---

### **Q: "I have conflicts when I pull"**

**A:** This means you and friend changed same file. Don't panic:
1. Open the file with conflict
2. Git marks the conflict with `<<<<` and `>>>>`
3. Edit to keep what you want
4. Save and commit:
```bash
git add .
git commit -m "Resolve merge conflict"
```

---

## 📋 DAILY CHECKLIST

### **Morning:**
```bash
git checkout master
git pull origin master
git checkout your-branch
```
✅ You're updated with team

### **During Day:**
```bash
# Every 1-2 hours:
git add .
git commit -m "Your message"
git push origin your-branch
```
✅ Your work is backed up

### **When Friend Finishes:**
```bash
git add .
git commit -m "WIP: Your work"
git pull origin master
# Continue working
```
✅ You have their code integrated

### **When You Finish:**
```bash
git add .
git commit -m "Complete Phase X"
git push origin your-branch
# Create PR on GitHub
```
✅ Ready for review and merge

---

## 🌳 BRANCH NAMING

**Your branches:**
- `phase-3-user-wallet`
- `phase-4-institution-portal`
- `phase-5-verifier-portal`

**Main branch:** `master`

**Never push directly to master!** Always use a branch and PR.

---

## 🔄 THE FLOW (Simple View)

```
You Work → Commit → Push → Friend Works → Commit → Pull Your Code
     ↓
 Friend Finishes First
     ↓
You Pull Friend's Code
     ↓
You Continue Working
     ↓
You Finish → Create PR
     ↓
Owner Reviews & Merges
     ↓
You Pull Latest Master
     ↓
Start New Phase!
```

---

## 💡 GOLDEN RULES

1. ✅ **Commit before you pull** - Always!
2. ✅ **Pull frequently** - Don't wait til the end
3. ✅ **Push regularly** - Backup your work
4. ✅ **Communicate** - Tell team when you finish
5. ✅ **Read error messages** - They tell you what's wrong

---

## 🚨 WHAT NOT TO DO

❌ Don't push directly to master
❌ Don't forget to commit before pulling
❌ Don't wait 3 days to pull master
❌ Don't use `git push --force` (super dangerous!)
❌ Don't panic on conflicts - they're fixable!

---

## 📚 KEY COMMANDS REFERENCE

| Command | What It Does |
|---------|--------------|
| `git checkout -b branch-name` | Create new branch |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes with message |
| `git push origin branch-name` | Upload to GitHub |
| `git pull origin master` | Get latest master code |
| `git status` | See what changed |
| `git log --oneline` | See commit history |
| `git checkout master` | Switch to master |
| `git checkout my-branch` | Switch to your branch |

---

## 🎓 REAL EXAMPLE

```
Monday: I start Phase 3
  - git checkout -b phase-3-user-wallet
  - Work work work
  - git add . && git commit && git push

Tuesday: Friend working on Phase 1
  - I keep: git add . && git commit && git push
  - Friend: git add . && git commit && git push

Wednesday: Friend finishes Phase 1
  - Friend pushes Phase 1
  - Owner merges to master
  - I see: "Hey, Phase 1 done!"
  - I do: git add . && git commit && git pull origin master
  - I continue working with Phase 1 included

Friday: I finish Phase 3
  - git add . && git commit && git push
  - Create PR on GitHub
  - Owner reviews
  - Owner merges
  - New master has both Phase 1 + Phase 3!

Monday: Start Phase 4
  - git checkout master
  - git pull origin master
  - git checkout -b phase-4-institution-portal
  - Work work work!
```

---

## ❤️ REMEMBER

- **We're working as a team**
- Git helps us so we don't lose work
- Conflicts are normal and fixable
- Communicate when you finish
- Pull frequently = fewer problems

---

**Questions? Check this guide again!**

**Still confused? Look at the exact command you need and just copy-paste it.**

Good luck! 🚀
