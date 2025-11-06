import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import database from "../../config/database.config.ts";
import bcrypt from "bcrypt";


// Hasing password function
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string>{
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean>{
  return await bcrypt.compare(password, hashedPassword);
}


//  JWT token generation functions

type userPayLoad = {
  id: number;
  role: string;
}

export function generateAccessToken(user : userPayLoad){
  const payload = {
    id: user.id,
    role: user.role
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
   { expiresIn: "20m" }
  );
}


export function generateRefreshToken(user : userPayLoad){
  const payload = {
    id: user.id,
    role: user.role
  };
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
   { expiresIn: "3d" }
  );
}





export const registerPost = async (req: Request, res: Response) => {
  console.log(req.body);


  // Insert into databbase logic here 
  

  res.json({
    code: "error",
    message: "Email đã tồn tại trong hệ thống!",
  });
};


export const loginPost = async (req: Request, res: Response) => {
  console.log(req.body);
  // Check database logic here, then return id and role to generate tokens
  const email = req.body.email;
  const password = req.body.password;
  const [confirmRecords]  = await database.raw("SELECT id, password, role FROM users WHERE email = ?", [email]);
  
  if (confirmRecords.length === 0){
    return  res.json({
      code: "error",
      message: "Email hoặc mật khẩu không đúng!",
    });
  }

  const hashedPassword = confirmRecords[0].password;
  const userId = confirmRecords[0].id;
  const userRole = confirmRecords[0].role;  

  let passwordMatch = false;
  if (hashedPassword){  
    passwordMatch = await comparePassword(password, hashedPassword);
  }
  else{
    // Fake compare to prevent timing attack
    await comparePassword(password, "$2b$10$C/wG6kX1Y5v0OZ3Fh3pGxeu1jKqz1h6u8vE6OqO5jY5jY5jY5jY5e");
  }

  if (!passwordMatch){
    return res.status(401).json({
      code: "error",
      message: "Email hoặc mật khẩu không đúng!",
    });
  }


  const userPayload = { id: userId, role: userRole };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  // const accessToken = generateAccessToken({ id: 1, role: "bidder" });
  // const refreshToken = generateRefreshToken({ id: 1, role: "bidder" });
  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
    accessToken,
    refreshToken,
  });
};


export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken){
    return res.status(400).json({ code: 'error', message: 'Refresh token is missing' });
  }   
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err : any, user : any) => {
    if (err){
      return res.status(403).json({ code: 'error', message: 'Invalid refresh token' });
    }
    const userPayload = { id: (user as any).id, role: (user as any).role };
    const newAccessToken = generateAccessToken(userPayload);
    const newRefreshToken = generateRefreshToken(userPayload);
    res.json({
      code: 'success',
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
}