import RequestHandler from "../../requestHandler";
import IAccountInfo from "../../types/accountInfo";

export default async function registerGuest(handler:RequestHandler) {
	return handler.getRequest<IAccountInfo>()
		.setMethod("POST")
		.setPath("user/register-guest")
		.makeRequest();
}