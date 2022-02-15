import RequestHandler from "../../requestHandler";
import IArenaInfo from "../../types/arenaInfo";

export default async function enterArenaQueue(handler:RequestHandler, token:string) {
  return handler.getRequest<IArenaInfo>()
    .setPath("arena/queue")
    .setMethod("POST")
    .setAuth(token)
    .setBody({"SamePack" : true})
    .makeRequest()
}