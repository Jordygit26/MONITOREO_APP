/**
 * Helper utilities for formatting and logic
 */
const Utils = {
  /**
   * Determine signal category based on dBm
   * @param {number} dbm Signal strength in dBm
   * @returns {string} Category (excellent, acceptable, critical)
   */
  getSignalLevel(dbm) {
    if (dbm === null || dbm === undefined) return 'critical';
    if (dbm >= -60) return 'excellent';
    if (dbm >= -80) return 'acceptable';
    return 'critical';
  },

  /**
   * Format uptime from seconds to human readable string
   * @param {number} seconds 
   * @returns {string} Formatted string
   */
  formatUptime(seconds) {
    if (!seconds) return 'Offline';
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  },

  /**
   * Get current time string
   */
  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', { hour12: false });
  }
};
