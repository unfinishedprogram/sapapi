import IUserInfo from "../../types/userInfo";
import RequestHandler from "../../requestHandler";

export default async function getCurrentUserInfo(handler:RequestHandler, token:string){
	return handler.getRequest<IUserInfo>()
		.setMethod("GET")
		.setAuth(token)
		.setPath("user/current")
		.makeRequest();
}
