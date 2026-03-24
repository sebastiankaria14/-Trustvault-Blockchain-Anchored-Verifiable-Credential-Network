# 📚 TrustVault Documentation Rules

**Last Updated:** March 24, 2026

---

## 🎯 PURPOSE

This folder contains detailed documentation of EVERYTHING done in the TrustVault project. Every change, every decision, every feature built - all documented here.

---

## 📋 DOCUMENTATION STANDARDS

### 1. **File Naming Convention**

All documentation files MUST follow this format:

```
XX-DESCRIPTION.md
```

Where:
- `XX` = Two-digit number (01, 02, 03, etc.)
- `DESCRIPTION` = Short, clear description in UPPERCASE with hyphens

#### Examples:
- `00-RULES.md` - This file (documentation rules)
- `01-PROJECT-SETUP.md` - Initial project setup
- `02-LANDING-PAGE.md` - Landing page implementation
- `03-AUTHENTICATION-SYSTEM.md` - Auth implementation
- `04-USER-PORTAL.md` - User portal development

### 2. **What to Document**

Every documentation file should include:

✅ **Date & Phase** - When was this done?
✅ **What Was Done** - What did we build/change?
✅ **Why** - Why did we make these decisions?
✅ **Files Created/Modified** - List all files touched
✅ **Code Snippets** - Key code examples
✅ **Commands Run** - All terminal commands used
✅ **Dependencies Added** - New packages installed
✅ **Configuration Changes** - Any config updates
✅ **Issues Faced** - Problems encountered and solutions
✅ **Testing Done** - How we tested it
✅ **Next Steps** - What comes next

### 3. **Documentation Template**

```markdown
# XX - [FEATURE NAME]

**Date:** YYYY-MM-DD
**Phase:** Phase X
**Status:** ✅ Complete / 🟡 In Progress / ⏳ Pending

---

## 📝 SUMMARY

[Brief 2-3 sentence summary of what was done]

---

## 🎯 OBJECTIVES

- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

---

## 🛠️ WHAT WAS DONE

### 1. [First Task]
[Detailed explanation]

### 2. [Second Task]
[Detailed explanation]

---

## 📂 FILES CREATED/MODIFIED

### Created:
- `path/to/file1.js` - Description
- `path/to/file2.jsx` - Description

### Modified:
- `path/to/file3.js` - What changed

---

## 💻 CODE SNIPPETS

### Key Implementation 1
```javascript
// Code example
```

### Key Implementation 2
```javascript
// Code example
```

---

## 📦 DEPENDENCIES ADDED

```bash
npm install package-name
```

**Packages:**
- `package-name@version` - What it does

---

## ⚙️ CONFIGURATION CHANGES

- Config file: What changed
- Environment variable: Added/Updated

---

## 🐛 ISSUES & SOLUTIONS

**Issue 1:** [Problem description]
**Solution:** [How we fixed it]

---

## ✅ TESTING

- [x] Test 1
- [x] Test 2

**How to test:**
```bash
npm run dev
```

---

## 📸 SCREENSHOTS

[Add screenshots if applicable]

---

## 🔗 RELATED DOCUMENTATION

- See `XX-OTHER-DOC.md` for related info

---

## ⏭️ NEXT STEPS

1. Next task
2. Future improvements
3. Technical debt

---

## 📌 NOTES

Any additional notes or important information.
```

---

## 🔢 FILE NUMBERING SYSTEM

Start from `01` and increment for each new major feature/task:

- `00-RULES.md` - This file (always first)
- `01-PROJECT-SETUP.md` - Initial setup
- `02-LANDING-PAGE.md` - Landing page
- `03-DATABASE-SETUP.md` - Database configuration
- `04-AUTH-SYSTEM.md` - Authentication
- `05-USER-PORTAL.md` - User wallet portal
- `06-INSTITUTION-PORTAL.md` - Institution portal
- `07-VERIFIER-PORTAL.md` - Verifier portal
- `08-ADMIN-PANEL.md` - Admin panel
- `09-BLOCKCHAIN-INTEGRATION.md` - Blockchain
- `10-API-ENDPOINTS.md` - API documentation
- `11-DEPLOYMENT.md` - Deployment process
- `12+` - Continue numbering as needed

---

## 📊 DOCUMENTATION TYPES

### **Feature Documentation** (01-XX)
Document each major feature as it's built

### **Technical Documentation** (in /docs)
API docs, architecture diagrams, etc.

### **Process Documentation** (in this folder)
How we built things, decisions made

---

## ✍️ WRITING STYLE

- **Be Clear** - Write like you're explaining to a teammate
- **Be Complete** - Include all important details
- **Be Concise** - No fluff, just facts
- **Use Examples** - Show code snippets and commands
- **Use Emojis** - Makes it easier to scan (✅ 🎯 📝 💻 🐛)

---

## 🔄 UPDATING DOCUMENTATION

When revisiting a feature:
1. Update the existing file
2. Add "Updated: YYYY-MM-DD" at the top
3. Document what changed in a new section

---

## 📁 FOLDER ORGANIZATION

```
documentation/
├── 00-RULES.md                    ← This file
├── 01-PROJECT-SETUP.md            ← Project initialization
├── 02-LANDING-PAGE.md             ← Landing page
├── 03-DATABASE-SETUP.md           ← Database
├── 04-AUTH-SYSTEM.md              ← Authentication
├── ...                            ← Continue numbering
└── INDEX.md                       ← Master index (optional)
```

---

## 🎓 WHY DOCUMENT?

1. **Remember What You Did** - Easy to look back
2. **Share with Team** - Others can understand
3. **Track Progress** - See how far you've come
4. **Debug Faster** - Know what was changed
5. **Professional Practice** - Real projects do this

---

## ✅ CHECKLIST: Before Marking a Feature Complete

- [ ] Code is written and tested
- [ ] Documentation file created (XX-NAME.md)
- [ ] All files listed
- [ ] Code snippets included
- [ ] Testing documented
- [ ] DEVELOPMENT_PLAN.md updated

---

## 🚀 QUICK SUMMARY

**Simple Rules:**
1. Number files: 01, 02, 03...
2. Use UPPERCASE-WITH-HYPHENS for names
3. Document EVERYTHING you build
4. Include code examples
5. Update DEVELOPMENT_PLAN.md as you go

**That's it! Let's keep great documentation! 📚**
