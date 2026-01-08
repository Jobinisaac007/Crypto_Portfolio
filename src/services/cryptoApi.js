/**
 * CoinGecko API endpoint builders
 * Documentation: https://www.coingecko.com/en/api/documentation
 */

const BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * Get list of coins with market data
 * @param {string} currency - Currency (usd, inr, eur, etc.)
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Results per page (default: 100)
 * @returns {string} API URL
 */
export const CoinList = (currency = "inr", page = 1, perPage = 100) =>
  `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;

/**
 * Get detailed data for a single coin
 * @param {string} id - Coin ID (e.g., 'bitcoin', 'ethereum')
 * @returns {string} API URL
 */
export const SingleCoin = (id) =>
  `${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`;

/**
 * Get historical market data for a coin
 * @param {string} id - Coin ID
 * @param {number} days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 * @param {string} currency - Currency
 * @returns {string} API URL
 */
export const HistoricalChart = (id, days = 365, currency = "inr") =>
  `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

/**
 * Get trending coins
 * @param {string} currency - Currency
 * @returns {string} API URL
 */
export const TrendingCoins = (currency = "inr") =>
  `${BASE_URL}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

/**
 * Search for coins, exchanges, and categories
 * @param {string} query - Search query
 * @returns {string} API URL
 */
export const SearchCoins = (query) =>
  `${BASE_URL}/search?query=${encodeURIComponent(query)}`;

/**
 * Get global cryptocurrency data
 * @returns {string} API URL
 */
export const GlobalData = () =>
  `${BASE_URL}/global`;

/**
 * Get coin price by contract address
 * @param {string} platform - Platform (e.g., 'ethereum', 'binance-smart-chain')
 * @param {string} contractAddress - Contract address
 * @returns {string} API URL
 */
export const CoinByContract = (platform, contractAddress) =>
  `${BASE_URL}/coins/${platform}/contract/${contractAddress}`;

/**
 * Get OHLC data for a coin
 * @param {string} id - Coin ID
 * @param {string} currency - Currency
 * @param {number} days - Days (1, 7, 14, 30, 90, 180, 365, max)
 * @returns {string} API URL
 */
export const OHLCData = (id, currency = "inr", days = 7) =>
  `${BASE_URL}/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`;

/**
 * Fetches data from CoinGecko API
 * @param {string} url - API URL
 * @returns {Promise<any>}
 */
export const fetchCoinGeckoData = async (url) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("CoinGecko API Error:", error);
    throw error;
  }
};

/**
 * Rate limiting helper
 * CoinGecko free tier: 10-50 calls/minute
 */
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 1200; // 1.2 seconds between calls

export const rateLimitedFetch = async (url) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  
  if (timeSinceLastCall < MIN_CALL_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall)
    );
  }
  
  lastCallTime = Date.now();
  return fetchCoinGeckoData(url);
};