export function simplifyUrl(url: string): string {
  const urlObject = new URL(url);
  return urlObject.hostname;
}
