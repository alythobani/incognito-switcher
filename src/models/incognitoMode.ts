export type IncognitoMode = "normal" | "incognito";

export function modeToIncognitoBoolean(mode: IncognitoMode): boolean {
  return mode === "incognito";
}

export function incognitoBooleanToMode(incognito: boolean): IncognitoMode {
  return incognito ? "incognito" : "normal";
}
