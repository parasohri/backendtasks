import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.jwt_secret,
    {
      expiresIn: "7d",
    }
  );

   
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
 
  res.setHeader("Authorization", `Bearer ${token}`);

  return token;
};
export const verifyToken = (req, res, next) => {
  let token;

 
  if (req.cookies?.token) {
    token = req.cookies.token;
    console.log("cookies",req.cookies.token);
  }


   
  
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    
  }
 
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    console.log("dd",decoded);
    
    req.user = decoded;  
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};