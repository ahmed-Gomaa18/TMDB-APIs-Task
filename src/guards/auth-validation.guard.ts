import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthValidationGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const req = context.switchToHttp().getRequest();

            if(!req.headers['authorization']){
                throw new Error('Unauthorized User');
            }
            // verify
            const decodedToken = this.jwtService.verify(req.headers['authorization'].split(' ')[1], {publicKey: process.env.JWTSECRETKEY});
            
            // inject userId in request body
            req.body.userId = decodedToken.userId;

            return true;
        }catch(error: any){
            throw new UnauthorizedException(error.message);
        };
    }
};