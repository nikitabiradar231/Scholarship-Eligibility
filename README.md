# 🔐 Private Scholarship Eligibility Verification

> **Privacy-Preserving Zero-Knowledge Smart Contract DApp built on the Midnight Network — Level 4: Waxing Gibbous**

[![Midnight Network](https://img.shields.io/badge/Midnight-Network-6f42c1?style=flat-square)](https://midnight.network/)
[![Compact](https://img.shields.io/badge/Smart%20Contract-Compact-blue?style=flat-square)](https://docs.midnight.network/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6e9f18?style=flat-square)](https://vitest.dev/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088ff?style=flat-square&logo=githubactions)](https://github.com/features/actions)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 🌔 Level 4 — Waxing Gibbous

This project implements a **privacy-preserving scholarship eligibility verification system** using zero-knowledge smart contracts on the **Midnight Network**.

The goal is to allow students to prove that they satisfy scholarship requirements **without publicly revealing sensitive personal information or raw supporting documents**.

### 🎥 Demo Video

[Watch the project demonstration](https://drive.google.com/file/d/1PDimWU0LdBNXhSAvg0VNqeSYoWi-xLO-/view?usp=drive_link)

### 🚀 Live Preprod MVP

**Live Application:**
https://scholarship-eligibility.vercel.app/

**Network:** Midnight Preprod

**Contract Address:**

```text
0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf
```

**Explorer:**
https://explorer.preprod.midnight.network/contract/0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf

**Product X:**
https://x.com/ScholarShieldZ

---

# 📌 Problem Statement

Scholarship applications commonly require students to submit sensitive information such as:

* Academic records
* Income information
* Eligibility documents
* Supporting certificates
* Personal information

Traditional scholarship verification systems often require applicants to upload these documents to centralized platforms.

This creates several challenges:

* 🔴 Sensitive information can be exposed.
* 🔴 Documents must be stored and managed by centralized services.
* 🔴 Students have limited control over their personal information.
* 🔴 Verification processes can be difficult to audit.
* 🔴 Institutions must securely manage large amounts of sensitive data.

The project addresses these problems by using **zero-knowledge verification on Midnight**.

---

# 💡 Solution

The application separates **private student information** from **public blockchain verification data**.

Instead of publishing sensitive documents on-chain, the student uses private information to generate a zero-knowledge proof.

The blockchain verifies the proof and records only the information required for the scholarship workflow.

### Privacy Flow

```text
Student
   │
   │ Private credentials
   ▼
Local Application
   │
   │ Zero-Knowledge Proof
   ▼
Midnight Smart Contract
   │
   │ Verify eligibility
   ▼
Public Verification Result
```

The system allows a student to demonstrate eligibility while minimizing unnecessary disclosure of personal information.

---

# ✨ Key Features

### 🔐 Privacy-Preserving Verification

Students can use private credentials to prove scholarship eligibility without publishing raw documents on-chain.

### 🧑‍🎓 Student Workflow

Students can:

* View available scholarships
* Apply for scholarships
* Provide private eligibility information
* Generate zero-knowledge proofs
* Track application status

### 🏛️ Provider Workflow

Scholarship providers can:

* Create scholarships
* Define eligibility criteria
* Verify submitted proofs
* Manage scholarship information

### 🛡️ Role-Based Access Control

The smart contract separates permissions between:

* Students
* Scholarship providers

Unauthorized users cannot perform restricted administrative actions.

### 📜 Scholarship Ownership

Scholarship management is protected using ownership checks.

Only the scholarship owner can perform restricted operations such as:

* Editing scholarship criteria
* Deleting scholarships
* Managing scholarship-specific data

### 🧾 Credential Verification

Eligibility information can be represented through private credentials and verified through zero-knowledge proofs.

### 🔗 Midnight Preprod Deployment

The smart contract is deployed to the **Midnight Preprod network** and can be independently inspected using the Midnight Explorer.

### 🧪 Automated Testing

The project includes automated tests covering core smart-contract behavior and complete workflow scenarios.

### ⚙️ CI/CD

GitHub Actions automatically performs project validation, including contract building, testing, and frontend building.

---

# 🔒 Privacy Architecture

The system follows a **private-input / public-result** architecture.

## Private Data

The following information is intended to remain private:

* Personal student information
* Income-related information
* Academic credentials
* Supporting documents
* Eligibility inputs
* Other sensitive application data

Raw sensitive documents are not intended to be published directly to the blockchain.

## Public Data

The blockchain may contain only the information necessary for application and verification workflows, such as:

* Scholarship information
* Application state
* Verification status
* Public identifiers
* Proof-related state/counters
* Contract state required by the application

This separation reduces unnecessary exposure of sensitive information.

---

# 🧠 Zero-Knowledge Verification

The project uses Midnight's privacy-oriented smart-contract architecture to perform verification using private inputs.

Conceptually:

```text
Private Eligibility Data
        │
        ▼
┌─────────────────────┐
│ Zero-Knowledge      │
│ Proof Generation    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Midnight Smart      │
│ Contract            │
└──────────┬──────────┘
           │
           ▼
    Verification Result
```

The contract verifies whether the submitted information satisfies the defined eligibility conditions without requiring all underlying private information to become public.

---

# 🏗️ Technology Stack

| Component          | Technology                       |
| ------------------ | -------------------------------- |
| Smart Contract     | Midnight Compact                 |
| Blockchain         | Midnight Network                 |
| Deployment Network | Midnight Preprod                 |
| Contract SDK       | Midnight JavaScript / TypeScript |
| Frontend           | React 18 + Vite + TypeScript     |
| UI                 | CSS / Tailwind CSS               |
| Testing            | Vitest                           |
| Infrastructure     | Docker Compose                   |
| CI/CD              | GitHub Actions                   |
| Deployment         | Vercel                           |

---

# 📂 Project Architecture

```text
Scholarship-Eligibility/
│
├── contracts/
│   └── scholarship-eligibility.compact
│
├── src/
│   └── contract.ts
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── test/
│   └── *.test.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

---

# 📜 Smart Contract

The main smart contract is:

```text
contracts/scholarship-eligibility.compact
```

The contract implements the core scholarship and eligibility verification logic.

The generated contract SDK is used by the application through:

```text
src/contract.ts
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/nikitabiradar231/Scholarship-Eligibility.git
cd Scholarship-Eligibility
```

## 2. Install Project Dependencies

```bash
npm install
```

## 3. Install Frontend Dependencies

```bash
npm --prefix frontend install
```

---

# 🔧 Environment Setup

Create the root environment file:

```bash
cp .env.example .env
```

Create the frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

Configure the required Midnight network variables.

Example:

```env
MIDNIGHT_NETWORK_ID=preprod
MIDNIGHT_NODE_RPC_URL=<Midnight Preprod RPC>
MIDNIGHT_PROOF_SERVER_URL=<Midnight Preprod Proof Server>
MIDNIGHT_INDEXER_URL=<Midnight Preprod Indexer>
PREPROD_CONTRACT_ADDRESS=<deployed-contract-address>
```

Frontend configuration:

```env
VITE_MIDNIGHT_NETWORK=preprod
VITE_CONTRACT_ADDRESS=<deployed-contract-address>
```

Replace the placeholder values with the appropriate environment configuration.

---

# 🛠️ Local Development

## Build the Compact Contract

```bash
npm run build:contract
```

## Start Infrastructure

```bash
docker compose up -d
```

## Start the Frontend

```bash
npm --prefix frontend run dev
```

The development application is available at:

```text
http://localhost:3000
```

---

# 🧪 Testing

The project uses **Vitest** for automated testing.

Run the complete test suite with:

```bash
npm test
```

The test suite currently covers **9 meaningful scenarios**, including:

1. Fresh application state
2. Permanent Student → Provider role protection
3. Permanent Provider → Student role protection
4. Provider scholarship creation and ownership storage
5. Student application submission and document tracking
6. Provider application verification workflow
7. Zero-Knowledge proof eligibility check
8. Full Create → Apply → Verify → ZK Prove lifecycle
9. Non-owner application review rejection

These tests validate both access-control rules and the primary scholarship workflow.

---

# 🔄 Provider Workflow

```text
Provider
   │
   ▼
Connect Wallet
   │
   ▼
Create Scholarship
   │
   ▼
Define Eligibility Criteria
   │
   ▼
Receive Applications
   │
   ▼
Review Applications
   │
   ▼
Verify Eligibility Proof
   │
   ▼
Update Application Status
```

---

# 🧑‍🎓 Student Workflow

```text
Student
   │
   ▼
Connect Wallet
   │
   ▼
Browse Scholarships
   │
   ▼
Select Scholarship
   │
   ▼
Submit Application
   │
   ▼
Provide Private Eligibility Data
   │
   ▼
Generate ZK Proof
   │
   ▼
Submit Proof
   │
   ▼
Receive Verification Result
```

---

# 🔄 CI/CD

The repository includes a GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

The CI pipeline validates the project automatically.

### CI Process

```text
Git Push / Pull Request
        │
        ▼
Install Dependencies
        │
        ▼
Build Smart Contract
        │
        ▼
Run Tests
        │
        ▼
Build Frontend
        │
        ▼
   CI Validation
```

The workflow uses **Node.js 22** and validates the main application components.

---

# 🌐 Deployment

The frontend is deployed using **Vercel**.

The smart contract is deployed on:

```text
Midnight Preprod
```

### Deployed Contract

```text
0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf
```

### Midnight Explorer

https://explorer.preprod.midnight.network/contract/0x09f417e8910d540263f1011867160ad3b0f5904972e29fbcd1e6d97c36a6a1bf

---

# 📢 Build in Public

The project is being developed and shared publicly as part of the Midnight developer journey.

### Product X

https://x.com/ScholarShieldZ

The project profile is used to share development progress, updates, and the scholarship verification concept.

---

# 🌔 Level 4 Submission Requirements

| Requirement                   | Status                  |
| ----------------------------- | ----------------------- |
| Working MVP                   | ✅ Completed             |
| Midnight Preprod Deployment   | ✅ Completed             |
| Verifiable Contract Address   | ✅ Completed             |
| README Documentation          | ✅ Completed             |
| Setup Documentation           | ✅ Completed             |
| Usage Documentation           | ✅ Completed             |
| CI/CD Workflow                | ✅ Implemented           |
| Product X Profile             | ✅ Linked                |
| Demo Video                    | ✅ Available             |
| Minimum 15 Meaningful Commits | 🔎 Verify in repository |

---

# 📊 Project Status

The **Level 4 MVP is implemented, deployed on Midnight Preprod, and available for public demonstration**.

### Current Components

* ✅ Privacy-preserving Compact smart contract
* ✅ Student workflow
* ✅ Scholarship provider workflow
* ✅ Role-based access control
* ✅ Scholarship ownership protection
* ✅ Eligibility verification workflow
* ✅ Zero-knowledge proof workflow
* ✅ Automated test suite
* ✅ CI/CD pipeline
* ✅ Midnight Preprod deployment
* ✅ Live frontend deployment
* ✅ Product X profile
* ✅ Demo video

---

# 🚀 Next Phase

Future development can extend the platform with:

* Improved credential integrations
* More advanced eligibility rules
* Additional scholarship-provider features
* Enhanced student dashboards
* Improved privacy-preserving credential management
* Expanded testing and user feedback
* Additional production-oriented infrastructure

---

# 📄 License

This project is provided for educational, research, and development purposes.

---

# 👤 Author

**Nikita Biradar**

B.Sc. Blockchain Technology
Savitribai Phule Pune University

GitHub:
https://github.com/nikitabiradar231

Project Repository:
https://github.com/nikitabiradar231/Scholarship-Eligibility

---

## ⭐ Acknowledgements

Built as part of the **Midnight Network developer journey** and the **Level 4 — Waxing Gibbous** submission.

Special thanks to the Midnight ecosystem and developer community for the tools, documentation, and infrastructure supporting privacy-preserving blockchain applications.
