import IBoard from "./game/board"

export default interface IBuild {
	Id: string,
	Board: IBoard,
	AvailableCaptains: [ 0 ],
	AvailableAdjectives: [ string, string, string ],
	AvailableNouns:  [ string, string, string ]
}