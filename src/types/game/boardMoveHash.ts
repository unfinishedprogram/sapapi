export default interface IBoardMoveHash {
	Data: {
		Seed: number, 
		Hash: number
	}
	Event: {
		Outcome: unknown,
		Owner: number
	}
}