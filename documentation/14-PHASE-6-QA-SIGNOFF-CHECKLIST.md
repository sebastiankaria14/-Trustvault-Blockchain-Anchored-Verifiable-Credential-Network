# 14 - Phase 6 QA Sign-Off Checklist

Purpose:
Use this sheet to validate end-to-end completion of Phase 6 (approval gating, verification center, centralized admin review, and audit workflow).

Date: March 29, 2026
Version: 1.0
Status: Ready for Execution

---

## Test Run Metadata

- Test Run ID:
- Tester Name:
- Environment: Local / Staging / Production-like
- Backend URL:
- Frontend URL:
- Database:
- Branch Name:
- Start Time:
- End Time:

---

## Pre-Flight Validation

| ID | Check | Command or Action | Expected Result | Actual Result | Status (Pass/Fail) | Evidence |
|---|---|---|---|---|---|---|
| PF-01 | Backend dependencies installed | npm install (backend) | Completes without critical errors |  |  |  |
| PF-02 | Frontend dependencies installed | npm install (frontend) | Completes without critical errors |  |  |  |
| PF-03 | Migration 09 verification | npm run verify:migrate:09 | tables=admin_approval_logs,notification_events |  |  |  |
| PF-04 | Migration 10 verification | npm run verify:migrate:10 | checklist tables exist, templates=user:4,institution:4,verifier:4 |  |  |  |
| PF-05 | Migration 11 verification | npm run verify:migrate:11 | tables=verification_documents |  |  |  |
| PF-06 | Frontend production build | npm run build (frontend) | Build succeeds |  |  |  |

---

## Account Registration and Login Flow

| ID | Scenario | Steps | Expected Result | Actual Result | Status (Pass/Fail) | Evidence |
|---|---|---|---|---|---|---|
| AL-01 | Register user account | Register new user | Registration succeeds, no auto-login token bypass |  |  |  |
| AL-02 | Register institution account | Register new institution | Registration succeeds, no auto-login token bypass |  |  |  |
| AL-03 | Register verifier account | Register new verifier | Registration succeeds, no auto-login token bypass |  |  |  |
| AL-04 | Pending user login | Login as pending user | Login succeeds and redirects to Verification Center |  |  |  |
| AL-05 | Pending institution login | Login as pending institution | Login succeeds and redirects to Verification Center |  |  |  |
| AL-06 | Pending verifier login | Login as pending verifier | Login succeeds and redirects to Verification Center |  |  |  |
| AL-07 | Suspended institution login | Suspend institution then login | Login blocked with suspension message |  |  |  |
| AL-08 | Suspended verifier login | Suspend verifier then login | Login blocked with suspension message |  |  |  |

---

## Verification Center Workflow

| ID | Scenario | Steps | Expected Result | Actual Result | Status (Pass/Fail) | Evidence |
|---|---|---|---|---|---|---|
| VC-01 | View status card | Open Verification Center | Shows account status and required document summary |  |  |  |
| VC-02 | Upload valid PDF | Upload required doc as PDF | Upload succeeds and doc appears as pending |  |  |  |
| VC-03 | Upload valid image | Upload JPG/PNG/WEBP | Upload succeeds and doc appears as pending |  |  |  |
| VC-04 | Invalid file type | Upload unsupported file type | Upload rejected with validation message |  |  |  |
| VC-05 | Rejection reason visibility | Admin rejects document, refresh page | Rejection reason is visible to account owner |  |  |  |
| VC-06 | Re-upload rejected document | Upload same doc type after rejection | New document version accepted as pending |  |  |  |

---

## Admin Review Workbench (Single Decision Surface)

| ID | Scenario | Steps | Expected Result | Actual Result | Status (Pass/Fail) | Evidence |
|---|---|---|---|---|---|---|
| RW-01 | Open from Users list | Click Go To Review on user | Review Workbench opens user case |  |  |  |
| RW-02 | Open from Institutions list | Click Go To Review on institution | Review Workbench opens institution case |  |  |  |
| RW-03 | Open from Verifiers list | Click Go To Review on verifier | Review Workbench opens verifier case |  |  |  |
| RW-04 | Approve one document | Document Review -> Approve | Document status changes to approved |  |  |  |
| RW-05 | Reject one document with reason | Document Review -> Reject | Rejection reason required and stored |  |  |  |
| RW-06 | Checklist item update | Set passed/failed + notes and save | Checklist row persists after reload |  |  |  |
| RW-07 | Final approve blocked when incomplete | Try final approve with missing required items | API/UI blocks approval with incomplete review message |  |  |  |
| RW-08 | Final approve when complete | Complete required docs + checklist and approve | Final approval succeeds |  |  |  |

---

## Governance Rules and Audit Logging

| ID | Scenario | Steps | Expected Result | Actual Result | Status (Pass/Fail) | Evidence |
|---|---|---|---|---|---|---|
| GR-01 | Reason-required action: reject | Perform reject without reason then with reason | Without reason blocked, with reason succeeds |  |  |  |
| GR-02 | Reason-required action: suspend | Perform suspend without reason then with reason | Without reason blocked, with reason succeeds |  |  |  |
| GR-03 | Reason-required action: request_more_info | Perform request_more_info without reason then with reason | Without reason blocked, with reason succeeds |  |  |  |
| GR-04 | Reason-required action: block | Perform block without reason then with reason | Without reason blocked, with reason succeeds |  |  |  |
| GR-05 | Approval logs visibility | Open Approval Logs page and filter | All decisions visible with action, reason, statuses, admin, timestamp |  |  |  |

---

## Protected API Enforcement

| ID | Scenario | Steps | Expected Result | Actual Result | Status (Pass/Fail) | Evidence |
|---|---|---|---|---|---|---|
| API-01 | Pending user protected API access | Call protected user endpoint with pending token | Access denied (pending approval) |  |  |  |
| API-02 | Approved user protected API access | Call protected user endpoint with approved token | Access granted |  |  |  |
| API-03 | Pending institution protected API access | Call institution protected endpoint with pending token | Access denied (pending approval) |  |  |  |
| API-04 | Approved institution protected API access | Call institution protected endpoint with approved token | Access granted |  |  |  |
| API-05 | Pending verifier protected API access | Call verifier protected endpoint with pending token | Access denied (pending approval) |  |  |  |
| API-06 | Approved verifier protected API access | Call verifier protected endpoint with approved token | Access granted |  |  |  |
| API-07 | Verification center access while pending | Call verification center endpoints with pending token | Access granted for active pending account |  |  |  |
| API-08 | Inactive account access | Call protected endpoints with inactive account token | Access denied (account not active) |  |  |  |

---

## Final Sign-Off Summary

- Total Test Cases:
- Passed:
- Failed:
- Blocked:
- Not Executed:

Overall Phase 6 Result:
- [ ] PASS
- [ ] FAIL

Known Issues (if any):
1.
2.
3.

Sign-Off:
- QA Engineer:
- Engineering Lead:
- Date:

---

## Exit Criteria

Phase 6 can be marked complete only if all are true:
1. All pre-flight checks pass.
2. Verification Center works for pending accounts across user, institution, verifier roles.
3. Protected APIs are blocked for non-approved accounts and allowed for approved accounts.
4. Review Workbench handles documents, checklist, and final decisions from one page.
5. Final approve is blocked until required documents and required checklist items are complete.
6. Approval logs capture decisions with reason and actor details.
