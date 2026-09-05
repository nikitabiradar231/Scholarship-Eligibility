/**
 * ============================================================================
 * MIDNIGHT NETWORK CONFIGURATION
 * ============================================================================
 * Network endpoints and connection configuration for local standalone Midnight node,
 * proof server, and indexer services.
 * ============================================================================
 */

export interface MidnightNetworkConfig {
  networkId: string;
  nodeRpcUrl: string;
  proofServerUrl: string;
  indexerUrl: string;
  isLocalStandalone: boolean;
}

export const LOCAL_MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: "undeployed-standalone-local",
  nodeRpcUrl: "http://127.0.0.1:9944",
  proofServerUrl: "http://127.0.0.1:6300",
  indexerUrl: "http://127.0.0.1:8088",
  isLocalStandalone: true
};

export const PREPROD_MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: "preprod",
  nodeRpcUrl: "https://rpc.preprod.midnight.network",
  proofServerUrl: "https://proof-server.preprod.midnight.network",
  indexerUrl: "https://indexer.preprod.midnight.network",
  isLocalStandalone: false
};

export function getActiveNetworkConfig(): MidnightNetworkConfig {
  const envNetwork = typeof process !== "undefined" && process.env ? process.env.MIDNIGHT_NETWORK_ID : undefined;
  if (envNetwork === "preprod" || envNetwork === "testnet") {
    return PREPROD_MIDNIGHT_CONFIG;
  }
  return PREPROD_MIDNIGHT_CONFIG;
}

