/**
 * ============================================================================
 * OFFICIAL MIDNIGHT NETWORK CONTRACT DEPLOYMENT PIPELINE
 * ============================================================================
 * Strict Midnight Preprod Deployment Script using official `@midnight-ntwrk/midnight-js-contracts`.
 * Requires a funded Midnight wallet context and fails loudly if broadcast or compilation fails.
 * No mock addresses, timestamp fallback strings, or fake deployment confirmations are permitted.
 * ============================================================================
 */

import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Official Midnight SDK Imports
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

import { getActiveNetworkConfig } from './network.js';
import { ScholarshipEligibilityContract } from './contract.js';

const PRIVATE_STATE_ID = 'scholarshipEligibilityPrivateState';

export interface DeploymentConfig {
  scholarshipName: string;
  minimumMarks: bigint;
  maximumFamilyIncome: bigint;
  creatorAddress: string;
}

/**
 * Creates official Midnight SDK provider instances.
 * Requires a real walletContext with valid public key credentials.
 */
export function createMidnightProviders(
  zkConfigPath: string,
  walletContext: any
) {
  if (!walletContext || !walletContext.address || !walletContext.shieldedSecretKeys) {
    throw new Error(
      "[Midnight Deployment Error] Real deployment requires a valid, funded Midnight wallet context. Missing or fallback simulated addresses are strictly prohibited."
    );
  }

  const network = getActiveNetworkConfig();
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD;
  if (!privateStatePassword || privateStatePassword.length < 16) {
    throw new Error(
      "[Midnight Deployment Error] PRIVATE_STATE_PASSWORD environment variable must be set and at least 16 characters long for non-local deployment."
    );
  }

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);

  const walletProvider = {
    getCoinPublicKey: () => walletContext.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletContext.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      if (!walletContext.wallet || !walletContext.wallet.balanceUnboundTransaction) {
        throw new Error("[Midnight Deployment Error] Wallet context does not support balanceUnboundTransaction.");
      }
      const recipe = await walletContext.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletContext.shieldedSecretKeys, dustSecretKey: walletContext.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) }
      );
      return walletContext.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletContext.wallet.submitTransaction(tx)
  };

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'scholarship-eligibility-state',
      accountId: walletContext.address,
      privateStoragePasswordProvider: () => privateStatePassword
    }),
    publicDataProvider: indexerPublicDataProvider(network.indexerUrl, network.indexerUrl.replace('https', 'wss')),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(network.proofServerUrl, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider
  };
}

/**
 * Deploys the scholarship contract using official Midnight `deployContract` SDK API.
 * Strictly fails loudly if compilation artifacts or on-chain transaction broadcast fails.
 */
export async function deployScholarshipContractOnMidnight(
  config: DeploymentConfig,
  walletContext: any
): Promise<{ contract: ScholarshipEligibilityContract; contractAddress: string }> {
  const network = getActiveNetworkConfig();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'scholarship-eligibility');
  const contractBundlePath = path.join(zkConfigPath, 'contract', 'index.js');

  if (!fs.existsSync(contractBundlePath)) {
    throw new Error(
      `[Midnight Deployment Error] Compiled Compact contract bundle not found at: ${contractBundlePath}. Run the official Compact compiler toolchain before deploying.`
    );
  }

  console.log(`\n[Official Midnight Deploy] Initializing On-Chain Deployment to ${network.networkId}...`);
  console.log(`[Official Midnight Deploy] Target RPC Node: ${network.nodeRpcUrl}`);
  console.log(`[Official Midnight Deploy] Target Indexer: ${network.indexerUrl}`);
  console.log(`[Official Midnight Deploy] Target Proof Server: ${network.proofServerUrl}`);
  console.log(`[Official Midnight Deploy] Grant Title: "${config.scholarshipName}"`);
  console.log(`[Official Midnight Deploy] Min Marks: ${config.minimumMarks}%`);
  console.log(`[Official Midnight Deploy] Max Income: ₹${config.maximumFamilyIncome}`);
  console.log(`[Official Midnight Deploy] Creator Wallet Address: ${config.creatorAddress}`);

  const providers = createMidnightProviders(zkConfigPath, walletContext);

  const compiledContract = CompiledContract.make('scholarship-eligibility', ScholarshipEligibilityContract as any);
  const deployed = await deployContract(providers, {
    compiledContract: compiledContract as any,
    args: [config.scholarshipName, config.minimumMarks, config.maximumFamilyIncome, config.creatorAddress],
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {}
  });

  if (!deployed || !deployed.deployTxData || !deployed.deployTxData.public || !deployed.deployTxData.public.contractAddress) {
    throw new Error("[Midnight Deployment Error] On-chain deployment transaction failed to return a valid contract address.");
  }

  const contractAddress = deployed.deployTxData.public.contractAddress;
  const contract = new ScholarshipEligibilityContract(contractAddress);
  contract.createScholarship(
    config.scholarshipName,
    "Official Preprod Scholarship Grant",
    config.minimumMarks,
    config.maximumFamilyIncome,
    ["Academic Marksheet", "Family Income Certificate"],
    "Provider Admin",
    config.creatorAddress
  );

  console.log(`\n[Official Midnight Deploy] On-Chain Deployment Broadcast Complete!`);
  console.log(`[Official Midnight Deploy] Verified Contract Address: ${contractAddress}\n`);
  return { contract, contractAddress };
}

// Standalone execution entry point
if (typeof process !== "undefined" && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, "/"))) {
  console.error("[Midnight Deployment Error] Standalone script execution requires passing a funded walletContext and PRIVATE_STATE_PASSWORD environment variable.");
  process.exit(1);
}
