export async function sleep(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export function intToAlpha(num: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const base = alphabet.length

  if (num < base) {
    return alphabet[num]
  }

  const prefix = alphabet[Math.floor(num / base) - 1]
  const suffix = (num % base).toString()

  return prefix + suffix
}
