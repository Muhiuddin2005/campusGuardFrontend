const memory = new Map<string, string>();

export async function getSecureItem(key: string) {
  return memory.get(key) ?? null;
}

export async function setSecureItem(key: string, value: string) {
  memory.set(key, value);
}

export async function deleteSecureItem(key: string) {
  memory.delete(key);
}
