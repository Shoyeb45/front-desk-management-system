import bcrypt from "bcryptjs";  

export async function hashPassword(plainPassword: string) {
  const hash = await bcrypt.hash(plainPassword, 12);
  return hash; 
}