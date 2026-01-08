/**
 * Risk assessment utilities for cryptocurrency tokens
 * In production, integrate with actual risk APIs like:
 * - Etherscan Token Tracker
 * - CryptoScamDB
 * - CoinGecko Trust Score
 */

// Known high-risk coins (meme coins, high volatility)
const HIGH_RISK_COINS = [
  "shiba-inu",
  "dogecoin",
  "pepe",
  "floki",
  "babydoge",
  "safemoon",
  "elongate",
  "saitama",
];

// Known scam indicators in coin names
const SCAM_KEYWORDS = [
  "scam",
  "moon",
  "safe",
  "elon",
  "pump",
  "inu",
  "baby",
  "rocket",
];

// Risk levels
export const RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

/**
 * Checks if a coin is flagged as high risk
 * @param {string} coinId - CoinGecko coin ID
 * @returns {boolean}
 */
export const isRisky = (coinId) => {
  if (!coinId) return false;
  
  const id = coinId.toLowerCase();
  
  // Check against known high-risk list
  if (HIGH_RISK_COINS.includes(id)) {
    return true;
  }
  
  // Check for scam keywords
  return SCAM_KEYWORDS.some((keyword) => id.includes(keyword));
};

/**
 * Gets detailed risk assessment for a coin
 * @param {string} coinId - CoinGecko coin ID
 * @param {object} coinData - Optional coin data (market cap, volume, etc.)
 * @returns {object} Risk assessment
 */
export const getRiskAssessment = (coinId, coinData = {}) => {
  const id = coinId.toLowerCase();
  let riskLevel = RISK_LEVELS.LOW;
  const riskFactors = [];
  
  // Check high-risk list
  if (HIGH_RISK_COINS.includes(id)) {
    riskLevel = RISK_LEVELS.HIGH;
    riskFactors.push("Known high-volatility asset");
  }
  
  // Check for scam indicators
  const hasScamKeyword = SCAM_KEYWORDS.some((kw) => id.includes(kw));
  if (hasScamKeyword) {
    riskLevel = RISK_LEVELS.HIGH;
    riskFactors.push("Name contains risk keywords");
  }
  
  // Check market cap (if provided)
  if (coinData.marketCap && coinData.marketCap < 10000000) {
    riskLevel = RISK_LEVELS.MEDIUM;
    riskFactors.push("Low market capitalization");
  }
  
  // Check trading volume
  if (coinData.volume24h && coinData.marketCap) {
    const volumeRatio = coinData.volume24h / coinData.marketCap;
    if (volumeRatio < 0.01) {
      riskLevel = RISK_LEVELS.MEDIUM;
      riskFactors.push("Low trading volume");
    }
  }
  
  return {
    coinId,
    riskLevel,
    isRisky: riskLevel === RISK_LEVELS.HIGH || riskLevel === RISK_LEVELS.CRITICAL,
    riskFactors,
    recommendation: getRiskRecommendation(riskLevel),
  };
};

/**
 * Gets recommendation based on risk level
 * @param {string} riskLevel
 * @returns {string}
 */
const getRiskRecommendation = (riskLevel) => {
  switch (riskLevel) {
    case RISK_LEVELS.CRITICAL:
      return "Avoid this asset. High risk of loss.";
    case RISK_LEVELS.HIGH:
      return "Exercise extreme caution. Only invest what you can afford to lose.";
    case RISK_LEVELS.MEDIUM:
      return "Moderate risk. Do thorough research before investing.";
    case RISK_LEVELS.LOW:
    default:
      return "Relatively safe, but always DYOR (Do Your Own Research).";
  }
};

/**
 * Gets risk color for UI display
 * @param {string} riskLevel
 * @returns {string} Tailwind color class
 */
export const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case RISK_LEVELS.CRITICAL:
      return "text-red-600";
    case RISK_LEVELS.HIGH:
      return "text-red-400";
    case RISK_LEVELS.MEDIUM:
      return "text-yellow-400";
    case RISK_LEVELS.LOW:
    default:
      return "text-green-400";
  }
};

/**
 * Validates contract address (basic validation)
 * @param {string} address - Contract address
 * @returns {boolean}
 */
export const isValidContractAddress = (address) => {
  if (!address) return false;
  
  // Ethereum address validation (0x followed by 40 hex chars)
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethRegex.test(address);
};

/**
 * Mock function to check contract on Etherscan
 * In production, integrate with Etherscan API
 * @param {string} address - Contract address
 * @returns {Promise<object>}
 */
export const checkContractReputation = async (address) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    address,
    verified: Math.random() > 0.3,
    hasAudit: Math.random() > 0.5,
    scamReports: Math.floor(Math.random() * 5),
    trustScore: Math.random() * 100,
  };
};

/**
 * Gets a human-readable risk description
 * @param {boolean} isRisky
 * @returns {string}
 */
export const getRiskDescription = (isRisky) => {
  return isRisky
    ? "This asset has been flagged as high risk. Invest with extreme caution."
    : "This asset appears to be relatively safe, but always do your own research.";
};