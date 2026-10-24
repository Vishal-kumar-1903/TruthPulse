export interface TipRecord {
  id: string;
  articleId: string;
  authorName: string;
  reporterUpiVpa: string;
  amount: number;
  donorName: string;
  timestamp: string;
  truthCreditsGranted: number;
}

export const PRESET_TIP_TIERS = [
  { amount: 10, label: 'Chai Support', icon: '☕', credits: 5 },
  { amount: 25, label: 'Field Petrol', icon: '🛵', credits: 15 },
  { amount: 50, label: 'Investigation Grant', icon: '🔍', credits: 35 },
  { amount: 100, label: 'Civic Guardian', icon: '🏆', credits: 75 }
];

/**
 * Builds standard National Payments Corporation of India (NPCI) UPI Intent URL
 */
export function generateUpiIntentUrl(params: {
  vpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
}): string {
  const { vpa, payeeName, amount, transactionNote } = params;
  const note = encodeURIComponent(transactionNote.slice(0, 40));
  const name = encodeURIComponent(payeeName.slice(0, 30));
  return `upi://pay?pa=${vpa}&pn=${name}&am=${amount.toFixed(2)}&cu=INR&tn=${note}`;
}
