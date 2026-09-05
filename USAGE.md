# User Guide: Private Scholarship Eligibility Verification

This guide provides step-by-step instructions for both **Student Applicants** and **Scholarship Providers / Verifiers** using the privacy-preserving scholarship eligibility verification system.

---

## 🚀 Step 1: Launch the Application

1. Start the local frontend development server:
   ```bash
   npm run frontend:dev
   ```
2. Open `http://localhost:3000` in your web browser.

---

## 👥 Step 2: Permanent Role Selection & Account Identity

Upon opening the application for a new wallet account, you will be prompted with:

> **"Select Permanent Account Role"**

Choose one of two role portals:

- 🎓 **I am a Student**: Permanently registers your wallet account as a Student to browse provider scholarships, submit credentials, and evaluate eligibility privately.
- 🏛️ **I am a Scholarship Provider**: Permanently registers your wallet account as a Scholarship Provider to create grants, review applicant credentials, and manage owned grants.

*(Note: Role registration is permanent per wallet address. You can test different roles or provider accounts using the **Account Switcher** dropdown in the top header).*

---

## 🎓 Step 3: Student Portal Workflow

### 1. Browse Available Scholarships
- Select any active scholarship published by a provider.
- Review criteria: Minimum Marks Required %, Maximum Family Income Ceiling ₹, and Required Documents.

### 2. Submit Credential Documents
- Upload files for your **Academic Marksheet** and **Family Income Certificate**.
- Click **Apply for Scholarship**.
- Your application status updates to **Documents Submitted**.

### 3. Private ZK Eligibility Verification
- Once the scholarship provider marks your credentials as **Verified**, the Midnight ZK circuit engine unlocks.
- Enter your private numbers (Academic Marks %, Family Income ₹).
- Click **Check Eligibility**.
- Your inputs remain strictly local inside your browser's private witness engine.

### 4. View Disclosed Outcome
- **✓ ELIGIBLE**: Displayed if `marks >= minMarks` AND `income <= maxIncome`.
- **✕ NOT ELIGIBLE**: Displayed if either condition fails.
- **ZK Proof Hash Digest**: Cryptographic hash proving valid circuit execution without exposing raw inputs.

---

## 🏛️ Step 4: Scholarship Provider Portal Workflow

### 1. Create & Publish New Scholarships
- Click **Create Scholarship**.
- Enter Title, Description, Minimum Marks %, Maximum Family Income ₹.
- Click **Publish Grant**. The grant is bound to your provider wallet address (`creatorAddress`).

### 2. Manage & Delete Owned Scholarships
- View list of active grants created by your provider account.
- Click **Delete Grant** to delete an owned grant and its applications (requires modal confirmation).
- Other providers cannot view management controls for or delete grants owned by your account.

### 3. Review Student Applicants
- View student applications submitted for your scholarships.
- Inspect submitted document metadata.
- Click **Verify Credentials** to approve credentials or **Reject Application** with a reason.

---

## 🔍 Step 5: Ledger & Privacy Inspector

1. Click **Developer Ledger Inspector** in the footer or top navigation.
2. Side-by-side verification:
   - **Public Ledger State**: Contains scholarship rules, creator address, credential statuses, verification counters, and disclosed results.
   - **Private Witness & Documents**: Displays local client memory where sensitive marks, family income, and raw document contents reside without touching the ledger.
3. Switch to **Raw Ledger JSON** view to audit the exact JSON payload on-chain.
