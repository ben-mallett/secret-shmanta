import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenData = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const idUserRole = jwt.verify(token, process.env.JWT_SECRET);
        return {...idUserRole};
    } catch (error : any) {
        throw Error("Token Parse Error");
    }
}