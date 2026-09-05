# 🔐 Private Scholarship Eligibility Verification

> **Privacy-Preserving Zero-Knowledge Smart Contract DApp built on the Midnight Network — Level 4: Waxing Gibbous.**

[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=flat-square\&logo=githubactions)](#cicd)
[![Midnight Network](https://img.shields.io/badge/Midnight-Compact%20ZK-indigo?style=flat-square)](#technology-stack)
[![Level 4](https://img.shields.io/badge/Level%204-Preprod%20MVP-purple?style=flat-square)](#project-status)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌕 Level 4 — Waxing Gibbous

**Private Scholarship Eligibility Verification** is a working privacy-preserving MVP deployed on the **Midnight Preprod network**.

The application allows students to prove scholarship eligibility based on academic marks and family income without exposing their private values as public blockchain data.

The Level 4 MVP combines:

* Zero-knowledge eligibility verification
* Private student witness data
* Scholarship provider management
* Student application workflow
* Credential verification
* Role-based authorization
* Midnight Preprod deployment
* Automated testing
* CI/CD
* Public product presence

---

## 🎥 Project Demo

The demo video shows the complete MVP workflow, including the student and scholarship-provider flows and the zero-knowledge eligibility verification process.

▶️ **[Watch the Level 4 MVP Demo](https://drive.google.com/file/d/1PDimWU0LdBNXhSAvg0VNqeSYoWi-xLO-/view?usp=drive_link)**

---

## 🌐 Live Preprod MVP

**Live Application:**
https://scholarship-eligibility.vercel.app

**Network:** Midnight Preprod

**Contract Address:**

```text
0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf
```

**Preprod Contract Explorer:**
https://explorer.preprod.midnight.network/contract/0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf

The deployed contract address allows the Level 4 MVP to be independently verified on Midnight Preprod.

---

# Problem Statement

Traditional scholarship platforms often require students to submit sensitive academic and financial information to centralized systems.

This creates two major privacy and security concerns:

### 1. Financial & Academic Over-Disclosure

Students may be required to expose exact family income figures and detailed academic records even when a scholarship provider only needs to know whether the student satisfies predefined eligibility criteria.

### 2. Data Integrity Risk

A zero-knowledge proof can prove that supplied values satisfy a mathematical condition, but a ZK proof alone does not establish that those values were originally issued by an official institution.

Therefore, the MVP separates:

* **Credential verification**
* **Private eligibility computation**
* **Public eligibility result**

---

# Solution

The application uses the **Midnight Network** and its privacy-preserving programming model to evaluate scholarship eligibility.

The core eligibility conditions are:

```text
studentMarks >= minimumMarks
AND
studentIncome <= maximumFamilyIncome
```

The student supplies the sensitive values as private witness data.

The system then produces an eligibility result without publishing the raw marks or family income values on the public ledger.

### Privacy Flow

```text
Student Private Data
        │
        ├── Academic Marks
        ├── Family Income
        └── Credential Data
        │
        ▼
Local Private Witness
        │
        ▼
Midnight ZK Circuit
        │
        ├── marks >= minimumMarks
        └── income <= maximumFamilyIncome
        │
        ▼
Eligibility Result
        │
        ▼
Public Ledger
```

Only the information intended to be disclosed is recorded on-chain.

---

# Key Features

### 🔒 Privacy-Preserving Eligibility Verification

Scholarship eligibility is evaluated using private witness values inside the ZK circuit.

### 🔐 Private Academic & Financial Data

Student marks and family income are treated as private witness inputs rather than publicly disclosed blockchain values.

### 👥 Permanent Role Binding

Accounts are permanently bound to either:

* `Student`
* `Provider`

This prevents an account from switching roles after registration.

### 📜 Scholarship Management

Scholarship providers can:

* Create scholarship programs
* Configure eligibility requirements
* Review applications
* Edit their own scholarships
* Delete their own scholarships

### 🛡️ Ownership Enforcement

Providers can only manage scholarships that belong to their provider address.

### 📋 Credential Verification Workflow

The student application follows a structured workflow:

```text
Documents Submitted
        ↓
Under Review
        ↓
Verified
        ↓
ZK Proof Execution
        ↓
Eligibility Result
```

### 🌐 On-Chain Transparency

The application displays relevant public ledger information including verification status, eligibility results, and proof execution counters.

---

# Privacy Architecture

```text
                    ┌──────────────────────────────┐
                    │      ROLE SELECTION          │
                    │   Student / Scholarship      │
                    │          Provider            │
                    └──────────────┬───────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  │                                 │
                  ▼                                 ▼
       ┌────────────────────┐          ┌────────────────────────┐
       │   STUDENT PORTAL   │          │   PROVIDER PORTAL      │
       │                    │          │                        │
       │ Browse Scholarships│          │ Create Scholarships    │
       │ View Requirements  │          │ Configure Criteria     │
       │ Submit Documents   │          │ Review Applications    │
       │ Track Status       │          │ Verify Credentials     │
       │ Execute ZK Proof   │          │ Manage Owned Grants    │
       └─────────┬──────────┘          └───────────┬────────────┘
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │      MIDNIGHT ZK SMART CONTRACT        │
              │                                        │
              │ Private Witnesses:                     │
              │ • studentMarks                         │
              │ • studentIncome                        │
              │ • callerRole                           │
              │                                        │
              │ Public Ledger State:                   │
              │ • scholarshipName                      │
              │ • minimumMarks                         │
              │ • maximumFamilyIncome                  │
              │ • creatorAddress                       │
              │ • eligibilityResult                    │
              │                                        │
              │ ZK Evaluation:                         │
              │ marks >= minimumMarks                  │
              │ AND                                    │
              │ income <= maximumFamilyIncome          │
              └────────────────────────────────────────┘
```

---

## Private Data

The following information is treated as private witness data:

* **Student academic marks**
* **Family annual income**
* **Sensitive credential information**
* **Raw submitted document contents**

The MVP is designed so that raw academic and financial values are not published as public ledger state.

---

## Publicly Disclosed Data

The public application/ledger can expose:

* Eligibility result
* Scholarship name
* Minimum marks requirement
* Maximum income requirement
* Scholarship creator address
* Application/verification status
* Verification counter

---

# Technology Stack

| Component          | Technology                   |
| ------------------ | ---------------------------- |
| Smart Contract     | Midnight Compact             |
| Blockchain         | Midnight Network             |
| Deployment Network | Midnight Preprod             |
| Contract SDK       | Midnight JS / TypeScript     |
| Frontend           | React 18 + Vite + TypeScript |
| UI                 | CSS / Tailwind CSS           |
| Testing            | Vitest                       |
| Infrastructure     | Docker Compose               |
| CI/CD              | GitHub Actions               |
| Deployment         | Vercel                       |

### Smart Contract

```text
contracts/scholarship-eligibility.compact
```

### Contract SDK

```text
src/contract.ts
```

---

# Project Architecture

```text
React 18 Frontend
(Student / Provider Portals)
             │
             ▼
TypeScript Contract SDK
(State Management / Witness Providers)
             │
             ▼
Midnight Compact Smart Contract
(Role / Ownership / Eligibility Logic)
             │
             ▼
Zero-Knowledge Proof Execution
(Private Witness Evaluation)
             │
             ▼
Midnight Preprod Ledger
(Public Disclosed Results)
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/nikitabiradar231/Scholarship-Eligibility.git
cd Scholarship-Eligibility
```

## 2. Install Root Dependencies

```bash
npm install
```

## 3. Install Frontend Dependencies

```bash
npm --prefix frontend install
```

---

# Environment Setup

Create `.env` from `.env.example`.

```bash
cp .env.example .env
```

Configure the required Midnight parameters:

```text
MIDNIGHT_NETWORK_ID=preprod
MIDNIGHT_NODE_RPC_URL=<Midnight Preprod RPC>
MIDNIGHT_PROOF_SERVER_URL=<Midnight Preprod Proof Server>
MIDNIGHT_INDEXER_URL=<Midnight Preprod Indexer>
PRIVATE_STATE_PASSWORD=<your-private-state-password>
PREPROD_CONTRACT_ADDRESS=<deployed-contract-address>
```

For frontend configuration:

```bash
cp frontend/.env.example frontend/.env
```

Configure:

```text
VITE_MIDNIGHT_NETWORK=preprod
VITE_CONTRACT_ADDRESS=<deployed-contract-address>
```

> Never commit private wallet seeds, passwords, or other secrets to GitHub.

---

# Local Development

## Compile Contract Layer

```bash
npm run build:contract
```

## Start Local Midnight Infrastructure

```bash
docker compose up -d
```

## Start Frontend

```bash
npm --prefix frontend run dev
```

The local frontend will be available at:

```text
http://localhost:3000
```

---

# Testing

Run the automated test suite:

```bash
npm test
```

The test suite covers critical authorization and application lifecycle scenarios.

### Test Coverage

1. Fresh application state
2. Permanent Student → Provider role protection
3. Permanent Provider → Student role protection
4. Scholarship ownership deletion
5. Non-owner deletion rejection
6. Non-owner criteria editing rejection
7. Student action role enforcement
8. Full Create → Apply → Verify → ZK Prove lifecycle
9. Non-owner application review rejection

---

# Provider Workflow

1. Select **Scholarship Provider**.
2. Create a scholarship program.
3. Define minimum marks.
4. Define maximum family income.
5. Define required documents.
6. Review submitted applications.
7. Verify student credentials.
8. Manage scholarships owned by the provider account.

---

# Student Workflow

1. Select **Student**.
2. Browse available scholarships.
3. Select a scholarship.
4. Submit the required credentials.
5. Wait for provider verification.
6. Execute **Verify Eligibility (ZK Proof)**.
7. View the eligibility result.
8. Inspect the publicly disclosed verification result.

---

# CI/CD

The project uses **GitHub Actions** for continuous integration.

Workflow:

```text
Git Push / Pull Request
          │
          ▼
     Node.js Setup
          │
          ▼
    Install Dependencies
          │
          ▼
  Compile Contract Layer
          │
          ▼
     Run Vitest Tests
          │
          ▼
    Build Frontend
          │
          ▼
       CI Result
```

The workflow is located at:

```text
.github/workflows/ci.yml
```

The CI pipeline automatically:

* Sets up Node.js 22
* Installs dependencies
* Builds the contract TypeScript layer
* Runs automated tests
* Installs frontend dependencies
* Builds the production frontend

---

# 🌐 Build in Public

**ScholarShield** is being developed publicly as a privacy-preserving scholarship eligibility verification product.

### Product X Profile

**X:** https://x.com/ScholarShieldZ

The product profile is used to share:

* Product development updates
* MVP progress
* Midnight ecosystem updates
* Release announcements
* Project demonstrations

### Live Application

https://scholarship-eligibility.vercel.app

---

# 🌙 Level 4 Submission Requirements

This project is developed against the **Level 4 — Waxing Gibbous** requirements.

| Requirement                          | Status                  |
| ------------------------------------ | ----------------------- |
| Working MVP live on Midnight Preprod | ✅                       |
| Verifiable Preprod contract address  | ✅                       |
| README documentation                 | ✅                       |
| Setup documentation                  | ✅                       |
| Usage documentation                  | ✅                       |
| CI/CD workflow                       | ✅                       |
| Product X profile                    | ✅                       |
| Product X profile linked in README   | ✅                       |
| MVP demo video                       | ✅                       |
| Minimum 15 meaningful commits        | 🔎 Verify in repository |

### Level 4 Deliverables

**Public GitHub Repository**

https://github.com/nikitabiradar231/Scholarship-Eligibility

**Live MVP**

https://scholarship-eligibility.vercel.app

**Midnight Preprod Contract**

```text
0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf
```

**Product X Profile**

https://x.com/ScholarShieldZ

**Demo Video**

https://drive.google.com/file/d/1PDimWU0LdBNXhSAvg0VNqeSYoWi-xLO-/view?usp=drive_link

---

# Project Status

## 🌔 Level 4 — Waxing Gibbous

The **Private Scholarship Eligibility Verification** MVP is implemented and prepared for public demonstration on Midnight Preprod.

### Current MVP Status

* ✅ **Midnight Compact ZK Contract**
* ✅ **Private witness-based eligibility evaluation**
* ✅ **Student portal**
* ✅ **Scholarship provider portal**
* ✅ **Permanent role binding**
* ✅ **Scholarship ownership controls**
* ✅ **Credential verification workflow**
* ✅ **Eligibility verification workflow**
* ✅ **Automated test suite**
* ✅ **CI/CD pipeline**
* ✅ **Midnight Preprod contract deployment**
* ✅ **Live frontend deployment**
* ✅ **Product X profile**
* ✅ **Project documentation**
* 🎥 **MVP demo available**

The project is now moving from MVP implementation toward **real-user testing, feedback collection, and iterative refinement**.

---

# 🔮 Next Phase

Following the Level 4 MVP, the project can continue into the next stage of development by onboarding real Preprod users and establishing a structured feedback loop.

Future work includes:

* Real-user onboarding
* Structured user feedback
* Usability improvements
* Documentation updates based on feedback
* Larger-scale Preprod testing
* Continued product development

---

# License

This project is licensed under the **MIT License**.
