import RequestHandler from "../../requestHandler";
import { IMoveData } from "../../api/build/buildStart";
import IBoard from "../../types/game/board";

interface IEndResponse {
  Data:{
    Seed:number, Hash:number
  }
  Event: {
    Owner:number
  }
  NewBoardState:number
}

export default async function endBuild(
  handler:RequestHandler, 
  token:string, 
  moveData:IMoveData
  ) {
  return handler.getRequest<IEndResponse>()
    .setPath("build/end")
    .setMethod("POST")
    .setBody({data: moveData})
    .setAuth(token)
    .makeRequest()
}