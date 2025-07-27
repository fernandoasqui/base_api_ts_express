import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const EXPIRES_IN = '1d';

if (!JWT_SECRET) {
  throw new Error('Secret key is not informed!');
}
export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
