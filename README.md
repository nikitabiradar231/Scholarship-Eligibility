# Private Scholarship Eligibility Verification

> **Privacy-Preserving Zero-Knowledge Smart Contract DApp built on the Midnight Network (Level 4).**

[![Local CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=flat-square&logo=githubactions)](#cicd)
[![Midnight Network](https://img.shields.io/badge/Midnight-Compact%20ZK-indigo?style=flat-square)](#technology-stack)
[![Level 4 Scope](https://img.shields.io/badge/Level%204-Credential%20Verification-purple?style=flat-square)](#project-status)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## Overview

**Private Scholarship Eligibility Verification** is a privacy-first smart contract application built on the **Midnight Network** using the **Compact** zero-knowledge programming language.

The application allows students to prove their eligibility for academic scholarships (based on minimum marks and family income criteria) **without disclosing their private academic records or sensitive financial data** on-chain or to third parties.

---

## Problem Statement

Traditional scholarship application platforms require students to upload raw, sensitive documents—such as academic grade transcripts, family income certificates, and tax returns—directly to centralized databases or public ledgers.

This creates two major security & privacy risks:
1. **Financial & Academic Over-Disclosure**: Verifiers gain access to exact family income figures and full subject-by-subject transcripts rather than verifying criteria compliance.
2. **Data Manipulation Risk**: Without an explicit credential verification step, arbitrary user-entered inputs cannot be trusted. A zero-knowledge proof generated over unverified student inputs proves mathematically that the entered numbers meet requirements, but does **not** independently prove that those numbers are truthful or issued by an official body.

---

## Solution

The **Level 4 Architecture** solves both problems by establishing a privacy-preserving zero-knowledge proof system on Midnight Network:
- Students generate a **Zero-Knowledge Proof** locally on their personal device.
- The ZK circuit evaluates whether `studentMarks >= minimumMarks` and `studentIncome <= maximumFamilyIncome`.
- Only a binary outcome (`Eligible` or `Not Eligible`) is disclosed on-chain.
- Raw academic marks, family income figures, and sensitive document details remain **100% private** and never touch the public blockchain.

---

## Key Features

- 🔒 **Privacy-Preserving Eligibility Verification**: Proves criteria compliance inside ZK circuit context without disclosing raw values.
- 🔐 **Private Academic Marks & Family Income**: Local witness inputs evaluated off-chain on student device.
- 👥 **Permanent Role Binding**: Client accounts permanently bind to `Student` or `Provider` roles upon initial interaction, preventing role spoofing.
- 📜 **Scholarship Ownership & Management**: Scholarship providers manage grant programs; non-owners are strictly prevented from editing or deleting grants.
- 📋 **Credential Verification Workflow**: Multi-step student document submission ("Documents Submitted" ➔ "Under Review" ➔ "Verified" ➔ ZK Proof Execution).
- 🌐 **Ledger Transparency**: Real-time on-chain ledger inspector displaying verification counters and latest verified proof results.
- 🛡️ **Role-Based Security**: Smart contract assertions enforce strict access control and owner authorizations.

---

## Privacy Architecture

```
                                ┌────────────────────────────────┐
                                │     ROLE SELECTION LANDING     │
                                │  "Select Permanent Account Role"
                                └───────┬────────────────┬───────┘
                                        │                │
                      ┌─────────────────┘                └─────────────────┐
                      ▼                                                    ▼
┌──────────────────────────────────────────┐      ┌──────────────────────────────────────────┐
│              STUDENT PORTAL              │      │       SCHOLARSHIP PROVIDER PORTAL        │
│                                          │      │                                          │
│ 1. Browse Active Provider Scholarships   │      │ 1. Create & Manage Owned Scholarships    │
│ 2. View Criteria & Required Documents    │      │ 2. View Applicants for Provider's Grants │
│ 3. Submit Marksheet & Income Certificate │      │ 3. Review & Verify Credentials           │
│ 4. Track Application Status:             │      │ 4. Edit Criteria & Delete Owned Grants   │
│    • Documents Submitted ➔ Verified      │      └──────────────────────────────────────────┘
│ 5. Trigger Midnight ZK Proof Check       │                                ▲
│ 6. View Disclosed Outcome                │                                │
└─────────────────────┬────────────────────┘                                │
                      │                                                     │
                      │  Verified Credentials Only                          │
                      ▼                                                     │
┌───────────────────────────────────────────────────────────────────────────┴──────────────┐
│                            MIDNIGHT ZK SMART CONTRACT LAYER                              │
│                                                                                          │
│  Private Witnesses (Student Local Device): studentMarks, studentIncome, callerRole       │
│  Public Ledger State: scholarshipName, minMarks, maxIncome, creatorAddress, result        │
│  ZK Circuit Execution: (marks >= minMarks && income <= maxIncome) -> discloses result    │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Private Data (Kept strictly on client device)
- **Student Academic Marks (%)**: Evaluated as a private local witness inside ZK circuit.
- **Family Annual Income (₹)**: Evaluated as a private local witness inside ZK circuit.
- **Submitted Sensitive Documents**: Raw document files remain local and are never published on-chain.

### Publicly Disclosed Data (On-Chain Ledger)
- **Eligibility Result**: Binary outcome (`true` / `false`).
- **Scholarship Parameters**: Grant name, minimum marks threshold, maximum family income cap, creator wallet address.
- **Verification Status**: Disclosed stage label (`"Documents Submitted"`, `"Verified"`, `"Rejected"`).
- **Verification Counter**: Total on-chain proof execution counter.

---

## Technology Stack

- **Smart Contract Language**: Compact (`contracts/scholarship-eligibility.compact`)
- **Blockchain Network**: Midnight Network (Local standalone devnet / Midnight Preprod ready)
- **TypeScript Contract SDK**: Midnight JS & Custom Contract Wrapper (`src/contract.ts`)
- **Frontend Framework**: React 18 + Vite + TypeScript + Lucide Icons
- **Styling**: Vanilla CSS Design System, Glassmorphism, Tailwind CSS, Dark Theme
- **Testing Framework**: Vitest (9 comprehensive automated unit tests)
- **Infrastructure**: Docker Compose (Midnight Node, Indexer, Proof Server)

---

## Project Architecture

```text
React 18 Frontend UI (Student / Provider Portals)
       │
       ▼
TypeScript Contract SDK (State Management & Witness Providers)
       │
       ▼
Midnight Compact ZK Contract (Role Gating & Creator Checks)
       │
       ▼
Zero-Knowledge Proof Execution (Local Private Witness Evaluation)
       │
       ▼
Midnight Ledger (Public Disclosed Results & Proof Counters)
```

---

## Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd HandMadeHub_Dapp-level2

# 2. Install root backend & SDK dependencies
npm install

# 3. Install frontend dependencies
npm --prefix frontend install
```

---

## Environment Setup

Create `.env` from `.env.example` in both root and frontend directories:

### Root Environment Setup (`.env`)
```bash
cp .env.example .env
```

Configured parameters:
- `MIDNIGHT_NETWORK_ID`: Set to `"preprod"` for Midnight Preprod Testnet or `"local"` for Standalone Devnet.
- `MIDNIGHT_NODE_RPC_URL`: Midnight RPC endpoint (`https://rpc.preprod.midnight.network`).
- `MIDNIGHT_PROOF_SERVER_URL`: Proof server endpoint (`https://proof-server.preprod.midnight.network`).
- `MIDNIGHT_INDEXER_URL`: Indexer endpoint (`https://indexer.preprod.midnight.network`).
- `PRIVATE_STATE_PASSWORD`: Encryption key for private state storage (min 16 characters).
- `PREPROD_CONTRACT_ADDRESS`: Verified contract address after Preprod deployment.

### Frontend Environment Setup (`frontend/.env`)
```bash
cp frontend/.env.example frontend/.env
```

Configured parameters:
- `VITE_MIDNIGHT_NETWORK`: Target network mode (`"preprod"` / `"local"`).
- `VITE_CONTRACT_ADDRESS`: Deployed contract address placeholder.

---

## Local Development

### 1. Compile TypeScript Contract Layer
```bash
npm run build:contract
```

### 2. Run Docker Midnight Devnet Services (Optional for Local Node)
```bash
docker compose up -d
```

### 3. Start Frontend Development Server
```bash
npm --prefix frontend run dev
```
Open **`http://localhost:3000`** in your browser.

---

## Testing

Run the automated Vitest unit & authorization test suite:

```bash
npm test
```

### Automated Tests Overview
The test suite in [`tests/scholarship-eligibility.test.ts`](file:///c:/Users/nikita/OneDrive/Desktop/New%20folder/HandMadeHub_Dapp-level2/tests/scholarship-eligibility.test.ts) validates 9 critical scenarios:
1. **TEST 1 — Fresh Application State**: Asserts fresh contract initializes with 0 default/demo scholarships.
2. **TEST 2 — Permanent Role Locking (Student ➔ Provider)**: Prevents a registered Student from becoming a Provider.
3. **TEST 3 — Permanent Role Locking (Provider ➔ Student)**: Prevents a registered Provider from becoming a Student.
4. **TEST 4 — Scholarship Ownership Deletion**: Scholarship owner can delete their own scholarship.
5. **TEST 5 — Ownership Security (Delete)**: Rejects deletion attempt by a non-owner provider.
6. **TEST 6 — Ownership Security (Edit)**: Rejects criteria editing attempt by a non-owner provider.
7. **TEST 7 — Role Enforcement (Student Action)**: Rejects creation/deletion attempts by student accounts.
8. **TEST 8 — Lifecycle Execution**: Full end-to-end flow (Create ➔ Apply ➔ Verify ➔ ZK Prove).
9. **TEST 9 — Ownership Security (Review)**: Rejects application review attempt by a non-owner provider.

---

## Usage Guide

### Provider Workflow
1. **Register Role**: Select **Scholarship Provider** on initial landing.
2. **Create Scholarship**: Click "Create Program" and specify title, minimum marks (%), family income cap (₹), and required documents.
3. **Configure Requirements**: Update threshold requirements as needed.
4. **Review Applications**: Navigate to "Applicants", review submitted document hashes, and set status to `"Verified"`.
5. **Manage Grants**: Delete or edit scholarships owned by your provider address.

### Student Workflow
1. **Register Role**: Select **Student** on initial landing.
2. **Browse Grants**: Inspect active scholarship grants listed by providers.
3. **Submit Documents**: Upload Marksheet and Income Certificate.
4. **Credential Verification**: Wait for the program provider to verify uploaded credential status.
5. **Execute ZK Proof**: Click "Verify Eligibility (ZK Proof)" to execute local witness evaluation.
6. **View Result**: Inspect disclosed result (`Eligible` or `Not Eligible`) and on-chain verification counter.

---

## CI/CD

The GitHub Actions workflow in [`.github/workflows/ci.yml`](file:///c:/Users/nikita/OneDrive/Desktop/New%20folder/HandMadeHub_Dapp-level2/.github/workflows/ci.yml) automatically runs on push and pull requests to `main`, `master`, and `dev` branches:
- Sets up Node.js 22 environment.
- Installs root dependencies (`npm install`).
- Compiles contract TypeScript layer (`npm run build:contract`).
- Executes the Vitest test suite (`npm test`).
- Installs frontend dependencies and builds the production web bundle (`npm --prefix frontend run build`).

---

## Midnight Preprod Deployment

```text
Network: Midnight Preprod
Contract Address: 0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf
Block Explorer: https://explorer.preprod.midnight.network/contract/0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf
```

Deployment instructions:
1. Ensure funded wallet seed hex and `PRIVATE_STATE_PASSWORD` are configured in `.env`.
2. Execute deployment pipeline:
   ```bash
   npm run deploy
   ```
3. Record contract address output into `.env` and `frontend/.env`.

---

## Live Demo

```text
Live Demo: https://scholarship-eligibility.vercel.app
```

---

## Product X Profile

```text
Product X Profile: To be added
```

---

## Demo Video

```text
Demo Video: To be added
```

---

## Project Status

The project MVP core, automated unit test suite, frontend application, and deployment infrastructure are fully implemented and verified locally:
- ✅ **Compact ZK Contract**: Fully implemented with local witness evaluations and creator checks.
- ✅ **TypeScript SDK & State Engine**: Permanent role locking, multi-grant management, and credential status pipeline.
- ✅ **Frontend Application**: React 18 + Vite + Tailwind CSS interface running on local dev server.
- ✅ **Automated Test Suite**: 9/9 unit tests passing cleanly.
- ✅ **CI/CD & Infrastructure**: Docker devnet stack and GitHub Actions workflow configured.

---

## License

This project is licensed under the MIT License.
