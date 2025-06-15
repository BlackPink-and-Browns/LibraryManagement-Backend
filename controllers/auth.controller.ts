import httpException from "../exceptions/http.exception";
import AuthService from "../services/auth.service";
import {Router,NextFunction} from 'express'


class AuthController{
    constructor(private authService : AuthService , private router:Router) {
        router.post("/login" , this.authenticateEmployee.bind(this))
    }

    async authenticateEmployee(req,res,next:NextFunction) {
        try{
            const {email,password} = req.body
            if(!email || !password) {
                throw new httpException(400, "Email or password is blank")
            }
            const data = await this.authService.login(email,password)
            res.status(200).send(data)
        }catch(err) {
            next(err)
        }
        
    }
}

export default AuthController