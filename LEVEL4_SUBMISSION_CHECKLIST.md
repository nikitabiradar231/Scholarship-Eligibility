# Level 4 Submission Readiness Checklist

This document tracks the final submission requirements for the **Private Scholarship Eligibility Verification** application on the Midnight Network.

---

## 📋 Submission Checklist

### Repository & Documentation
- [ ] Repository is set to public on GitHub
- [x] `README.md` complete with problem statement, ZK solution, technology stack, and architecture
- [x] Installation and environment setup instructions documented (`SETUP.md` / `README.md`)
- [x] Comprehensive usage guide documented for Provider and Student workflows (`USAGE.md` / `README.md`)

### Smart Contract
- [x] Compact contract compiled with ZK proving keys generated
- [x] Contract deployed to Midnight Preprod Testnet
- [x] Preprod contract address verified on Midnight Network
- [x] Contract address recorded in `README.md`, `.env`, and `frontend/.env`

### Frontend Application
- [x] Frontend environment configuration ready for Preprod (`frontend/.env.example`)
- [x] Production build compiled and verified (`npm --prefix frontend run build`)
- [ ] Frontend deployed publicly (e.g. Vercel, Netlify, or Cloudflare Pages)
- [ ] Live demo tested and accessible via web browser

### CI/CD Pipeline
- [x] GitHub Actions workflow configured (`.github/workflows/ci.yml`)
- [x] Unit test suite passing cleanly (`npm test` — 9/9 tests passed)
- [ ] CI pipeline status verified passing on GitHub Actions

### Product Presence
- [ ] Product X (Twitter) profile created
- [ ] Product X profile link added to `README.md`

### Submission Artifacts
- [ ] Demo video recorded (wallet connection + credential verification + ZK proof execution)
- [ ] GitHub repository link ready
- [ ] Live demo link ready
- [ ] Verified Preprod contract address ready
- [ ] Product X profile link ready
- [ ] Minimum 15 meaningful git commits created
- [ ] Final submission links verified

---

## 🚀 Preprod Deployment & Environment Parameters

### Required Environment Variables

| Variable | Description | Example / Placeholder |
|---|---|---|
| `MIDNIGHT_NETWORK_ID` | Network Target | `preprod` |
| `MIDNIGHT_NODE_RPC_URL` | Node RPC Endpoint | `https://rpc.preprod.midnight.network` |
| `MIDNIGHT_PROOF_SERVER_URL` | ZK Proof Server | `https://proof-server.preprod.midnight.network` |
| `MIDNIGHT_INDEXER_URL` | Public Data Indexer | `https://indexer.preprod.midnight.network` |
| `PRIVATE_STATE_PASSWORD` | Key Store Password | `[Min 16 chars secret]` |
| `MIDNIGHT_SEED_HEX` | Deployer Wallet Seed | `[32-byte Hex Seed]` |
| `PREPROD_CONTRACT_ADDRESS` | Deployed Address | `[On-chain Address after deploy]` |

---

## 🔒 Verification & Compliance Status

- **Smart Contract Logic**: Compact ZK circuit evaluates `studentMarks >= minimumMarks` and `studentIncome <= maximumFamilyIncome` without exposing raw values.
- **Authorization Security**: Permanent role locking (`student` / `provider`) and creator ownership enforced.
- **Automated Tests**: 9/9 Vitest unit and security tests passing locally.
- **Frontend Build**: React 18 + Vite production bundle builds with 0 errors.
