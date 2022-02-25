import ISpell from "../../types/game/spell"
import Button from "../components/button"
import { getFoodData } from "../../data/exports"
import { read } from "fs";

export default function foodButton(food: ISpell, onClick:Function) {
	let foodData = getFoodData(food.Enum);
	let abilityText = foodData.ability.description;

	let button = Button({
		content: `${foodData.name} ${food.Frozen ? '(frozen)' : ''}`,
		hoverText: abilityText,
		width:"shrink",
	});
	
	if(onClick){
		button.on("click", () => onClick());
	}


	return button;
}