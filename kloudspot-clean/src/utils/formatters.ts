// Utility functions for formatting data
export const formatDwellTime = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '00min 00sec';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}min ${remainingSeconds.toString().padStart(2, '0')}sec`;
};

export const formatTimestamp = (timestamp: string): string => {
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
};

export const formatNumber = (num: number): string => {
  if (!num && num !== 0) return '0';
  return num.toLocaleString();
};

export const formatPercentage = (percentage: number): { text: string; isPositive: boolean } => {
  if (!percentage && percentage !== 0) return { text: '0%', isPositive: true };
  
  const isPositive = percentage >= 0;
  const text = `${isPositive ? '+' : ''}${percentage.toFixed(1)}%`;
  
  return { text, isPositive };
};