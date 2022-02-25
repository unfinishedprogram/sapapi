import IItemId from "./itemId"

export default interface IBoardOrders {
	[index:number]: {
		MinionId: IItemId
		Point:{x:number, y:number}
	}
}