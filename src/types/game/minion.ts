import IAbility from "./ability"

export default interface IMinion {
	Abilities: IAbility[],
	Attack: {Permanent: number, Temporary: number}
	Cosmetic: number
	Dead: false
	Destroyed: false
	DestroyedBy: null
	Enum: number
	Exp: number
	Frozen: boolean
	Health: {Permanent: number, Temporary: number}
	Id: {BoardId: string, Unique: number}
	Level: number
	Location: number
	Owner: number
	Perk: null
	Point: {x: number, y: number}
	Price: number
	Unique:number
}
