import { minionNames } from "./minions";
import { spellNames } from "./spells";
import petDB from "./petDB";

export function petId(num:number) {
	return `pet-${minionNames[num]}`
}
export function foodId(num:number) {
	return `food-${spellNames[num]}`
}
export function getPetData(num:number) {
	return petDB.pets[petId(num)];
}
export function getFoodData(num:number) {
	return petDB.foods[foodId(num)];
}