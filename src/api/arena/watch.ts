import RequestHandler from "../../requestHandler";
import IArenaInfo from "../../types/arenaInfo";

export default async function watch(
  handler:RequestHandler, 
  token:string, 
  participationId:string,
  ) {
  return handler.getRequest<IArenaInfo>()
    .setPath("arena/watch")
    .setMethod("POST")
    .setBody({ParticipationId:participationId})
    .setAuth(token)
    .makeRequest()
}