import crypto from 'crypto';

/**
 * Generates an immutable SHA-256 cryptographic seal of article content
 */
export function generateContentHash(title: string, summary: string, content: string): string {
  const payload = `${title.trim()}|${summary.trim()}|${content.trim()}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Validates whether the current content matches the recorded seal hash
 */
export function verifyContentIntegrity(title: string, summary: string, content: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const currentHash = generateContentHash(title, summary, content);
  return currentHash === storedHash;
}
