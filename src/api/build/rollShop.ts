import RequestHandler from "../../requestHandler";
import { IMoveData } from "../../api/build/buildStart";
import IBoardMoveHash from "../../types/game/boardMoveHash";

export default async function rollShop(
  handler:RequestHandler, 
  token:string, 
  moveData:IMoveData
  ) {
  return handler.getRequest<IBoardMoveHash>()
    .setPath("build/roll")
    .setMethod("POST")
    .setBody({data: moveData})
    .setAuth(token)
    .makeRequest()
}