import bcrypt from "bcrypt";
const saltRounds = 10;

export const bcryptPassword = async (password: string) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw new Error(error.message);
  }
}
