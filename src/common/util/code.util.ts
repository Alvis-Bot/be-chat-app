import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
export const correctPassword = async (
  candidatePassword: string, // 123456
  userPassword: string, // $2a$12)
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const createOTP =  async (otp: string): Promise<string> => {
    return await bcrypt.hash(otp, 12);
}

export const correctOTP = async (
    candidateOTP: string, // 123456
    userOTP: string, // $2a$12
): Promise<boolean> => {
    return await bcrypt.compare(candidateOTP, userOTP);
}

export const randomOTP = () : string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
}

export const createPasswordResetToken =   () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(resetToken);
  const expires = addMinutes(new Date() , 10)
  return { resetToken, hashedToken, expires };
};

export const hashToken = async (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
