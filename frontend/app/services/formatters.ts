/**
 * Formatting and Helper Utilities for LumenLock v2
 */

// 1 XLM = 10,000,000 Stroops (7 decimal places)
export const STROOPS_PER_XLM = 10_000_000n;
export const USDC_DECIMALS = 10_000_000n; // Testnet SAC uses 7 decimals

/**
 * Formats a Stroop bigint or string value into human readable token amount.
 */
export function formatStroops(rawAmount: bigint | string | number, decimals: number = 7): string {
  try {
    const raw = typeof rawAmount === 'bigint' ? rawAmount : BigInt(rawAmount.toString());
    const isNegative = raw < 0n;
    const abs = isNegative ? -raw : raw;
    const divisor = 10n ** BigInt(decimals);
    
    const integerPart = abs / divisor;
    const remainder = abs % divisor;
    
    if (remainder === 0n) {
      return `${isNegative ? '-' : ''}${integerPart.toString()}`;
    }
    
    let decimalStr = remainder.toString().padStart(decimals, '0');
    // Trim trailing zeros
    decimalStr = decimalStr.replace(/0+$/, '');
    
    return `${isNegative ? '-' : ''}${integerPart.toString()}.${decimalStr}`;
  } catch {
    return '0';
  }
}

/**
 * Converts human readable amount (e.g. "12.5") to Stroops bigint.
 */
export function toStroops(amount: string | number, decimals: number = 7): bigint {
  try {
    const str = amount.toString().trim();
    if (!str || isNaN(Number(str))) return 0n;
    
    const parts = str.split('.');
    const integerPart = BigInt(parts[0] || '0');
    const divisor = 10n ** BigInt(decimals);
    
    if (parts.length === 1) {
      return integerPart * divisor;
    }
    
    let frac = parts[1].slice(0, decimals);
    frac = frac.padEnd(decimals, '0');
    const fracPart = BigInt(frac);
    
    return integerPart * divisor + fracPart;
  } catch {
    return 0n;
  }
}

/**
 * Truncates Stellar public key address (e.g., GABC...WXYZ).
 */
export function truncateAddress(address: string | null | undefined, start: number = 4, end: number = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Formats unix timestamp (in seconds) into locale date and time.
 */
export function formatDate(timestampSeconds: number): string {
  if (!timestampSeconds) return '—';
  const d = new Date(timestampSeconds * 1000);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats unix timestamp into full detailed string.
 */
export function formatDateTime(timestampSeconds: number): string {
  if (!timestampSeconds) return '—';
  const d = new Date(timestampSeconds * 1000);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculates remaining time until deadline.
 */
export function getRemainingTime(deadlineTimestampSeconds: number): {
  isExpired: boolean;
  formatted: string;
  days: number;
  hours: number;
  minutes: number;
} {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadlineTimestampSeconds - now;

  if (diff <= 0) {
    return {
      isExpired: true,
      formatted: 'Deadline Expired',
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) {
    return { isExpired: false, formatted: `${days}d ${hours}h remaining`, days, hours, minutes };
  }
  if (hours > 0) {
    return { isExpired: false, formatted: `${hours}h ${minutes}m remaining`, days, hours, minutes };
  }
  return { isExpired: false, formatted: `${minutes}m remaining`, days, hours, minutes };
}

/**
 * Returns explorer URL for an account or transaction.
 */
export function getExplorerUrl(
  identifier: string,
  type: 'account' | 'contract' | 'tx' = 'account',
  network: string = 'testnet'
): string {
  const base = network.toLowerCase().includes('main')
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet';

  return `${base}/${type}/${identifier}`;
}
