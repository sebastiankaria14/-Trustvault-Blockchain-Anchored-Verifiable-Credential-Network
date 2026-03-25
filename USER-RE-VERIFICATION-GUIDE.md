# Re-Verification Requests - User Portal Guide

## Overview
When a verifier requests re-verification of one of your credentials, you will see it in your **Re-verification Requests** page.

---

## Where to Find Re-verification Requests

### User Portal Navigation
1. **Login** to your TrustVault user account
2. **Sidebar** → **Re-verification Requests** (the 📋 icon)
3. Or navigate to: `http://localhost:3000/user/re-verification-requests`

---

## What You'll See

### Page Layout
- **Title**: "Re-verification Requests"
- **Subtitle**: "Companies have requested to re-verify some of your credentials. Review and approve or decline each request."
- **Three Status Tabs**: Pending | Approved | Declined

### Each Request Card Shows:
- **Credential Name** (e.g., "Bachelor of Science")
- **Credential Type** (e.g., "degree")
- **Company Name** that requested re-verification
- **Company Industry** (e.g., "technology", "finance")
- **Company's Reason** (optional) - Why they want to re-verify
- **Requested Date** - When they requested it
- **Expiry Date** - When the request expires (30 days default)

---

## How to Respond

### Pending Requests
When you have pending requests:

1. **Review** the request card to see:
   - Which company wants re-verification
   - Their reason (if provided)
   - Credential details

2. **Click** "Review & Respond" button

3. A form appears with:
   - Text field: "Your reason (Optional)"
   - Buttons: "✓ Approve" | "✗ Decline" | "Cancel"

4. **Optionally** add your reason (e.g., "Thanks for updating", "Not at this time")

5. **Click** either:
   - **✓ Approve** - The company can now re-verify this credential
   - **✗ Decline** - The company cannot re-verify this credential

### After You Respond
- Request moves to "Approved" or "Declined" tab
- Company is notified of your decision
- If approved: Their status changes from "pending" to "pending verification"
- If declined: The request is closed

---

## Request Timeline

```
Day 1: Company requests re-verification
   ↓
You see it in "Pending" tab
   ↓
You approve or decline (within 30 days)
   ↓
Moved to "Approved" or "Declined" tab
   ↓
If approved: Company can verify immediately
```

---

## Important Notes

1. **Auto-Expiry**: If you don't respond within 30 days, the request automatically expires
2. **Multiple Verifiers**: Different companies can request re-verification of the same credential
3. **Your Control**: You decide which companies get to re-verify
4. **No Auto-Approval**: Expiring requests don't auto-approve (they just expire)

---

## Notification Integration (Future)

*Coming Soon*: Notifications in:
- Dashboard badge showing pending count
- Email notification when new request arrives
- In-app notification alerts

---

## Example Scenarios

### Scenario 1: Company Wants Updated Verification
> **Company**: HR Department of XYZ Corp
> **Reason**: "We need updated verification with latest employment status"
> **Your Action**: Approve (✓)
> **Result**: They can immediately re-verify your degree

### Scenario 2: You Want to Decline
> **Company**: Unknown company
> **Reason**: "For compliance audit"
> **Your Action**: Decline (✗), "I don't recognize this request"
> **Result**: Request is saved as declined, they cannot re-verify

### Scenario 3: Ignore for Later
> **Company**: ABC Tech
> **Reason**: "Routine security check"
> **Your Action**: Come back in 2 days
> **Result**: Request stays in pending until you respond

---

## Re-verification Workflow (Complete)

```
INSTITUTION SIDE:
Issues credential → Stores on blockchain
        ↓
USER SIDE:
Receives credential in wallet → Shares with company
        ↓
COMPANY SIDE:
Verifies credential (automatic hash comparison)
        ↓
Shows AUTHENTIC or FAKE result
        ↓
Later: Requests re-verification
        ↓
USER SIDE (THIS PAGE):
Sees request in "Pending" tab → Reviews reason
        ↓
Approves or Declines
        ↓
COMPANY SIDE:
Notified of your decision
        ↓
If Approved: Can verify again immediately
If Declined: Must request again
```

---

## FAQ

### Q: What happens if I approve a re-verification request?
**A**: The company can immediately verify your credential again. The verification status in your "Verification History" will be updated with the new result.

### Q: Can I change my decision after approving/declining?
**A**: No, once you respond, the request is final. If you change your mind, the company must request re-verification again.

### Q: Why would a company request re-verification?
**A**: Common reasons:
- Document quality improved
- Need updated employment/status information
- Routine security audit
- Legal compliance requirement

### Q: Can I see who verified my credential in the past?
**A**: Yes, go to **My Credentials** → Click credential → **Verification History** tab to see all past verifications.

### Q: What if a request expires?
**A**: The request automatically moves to expired status after 30 days if not answered.

---

## Related Pages

- **My Credentials**: See all your credentials and their verification history
- **Audit Log**: Complete history of all verification activities
- **Profile**: Manage your account settings

---

**Your credentials, your control!** 🔐
