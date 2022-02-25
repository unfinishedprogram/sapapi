import IItemId from "./itemId"

export default interface IBoardFreezes {
	[index:number]: {
		ItemId: IItemId
		Freeze:boolean
	}
}