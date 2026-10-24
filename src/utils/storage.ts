const PREFIX = 'ninjadle-';

/** Lê um JSON do localStorage. Volta `null` se não existir, estiver corrompido ou falhar a validação. */
export function loadJSON<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    // localStorage pode estar bloqueado (aba anônima, permissões): o jogo segue sem salvar.
    return null;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Sem armazenamento disponível: ignora.
  }
}
