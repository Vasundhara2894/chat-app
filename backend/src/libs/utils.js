import jwt from "jsonwebtoken"


//we have passed userif to token 
export const generateToken=(userId,res)  =>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'});
    console.log("Generated Token:", token);
    res.cookie("jwt",token,{
        maxAge :7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
    });
    console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]);

    return token;
}