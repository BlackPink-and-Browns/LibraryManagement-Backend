import { NextFunction, Request, Response } from "express";
import httpException from "../exceptions/http.exception";
import { JWT_SECRET } from "../utils/constants";
import  jwt  from "jsonwebtoken";
import { EmployeeRole } from "../entities/employee.entity";


const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const token = req.headers.authorization
    if(!token) {
        throw new httpException(401,"unauthorized")
    }
    const tokenSplit = token.split(" ")
    if (tokenSplit.length!=2) {
        throw new httpException(401, "Invalid Token")
    }
    if(!tokenSplit[1]){
        throw new httpException(401, "unauthorized")
    }

    try{
        const payload = jwt.verify(tokenSplit[1],JWT_SECRET)
        req.user = payload
    }
    catch{
        throw new httpException(401,"Invalid or expired token")
    }
        
    next()
}

export default authMiddleware