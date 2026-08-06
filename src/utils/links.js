export function isConfigured(value) {
  if (!value) return false;
  const normalized = String(value).toLowerCase();
  return !normalized.includes('example.com') && !normalized.includes('00000');
}
