/**
 * @fileoverview Utility functions for handling and formatting dates.
 */

/**
 * Formats an ISO date string into a compact, relative "time ago" format.
 * Examples: "5m", "2h", "3d", "1y".
 * @param {string} isoDate - The ISO 8601 date string from the API.
 * @returns {string} The formatted relative time string.
 */
export const formatTimeAgo = (isoDate: string): string => {
  const now = new Date();
  const date = new Date(isoDate);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // More than a year
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  // More than a month
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }
  // More than a day
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  // More than an hour
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  // More than a minute
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  // Less than a minute
  return Math.max(0, Math.floor(seconds)) + "s";
};
