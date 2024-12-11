export async function hashPassword(password: string): Promise<string> {
  const hash = await Bun.password.hash(password);
  return hash;
}
