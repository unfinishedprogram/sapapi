import IMinion from "../../types/game/minion"
import Button from "../components/button"
import { getPetData } from "../../data/exports"
import * as blessed from "blessed"
export default function petButton(pet: IMinion, onClick?:Function):blessed.Widgets.ButtonElement {
	let content;
	let abilityText

	if(!pet) {
		content = "-empty-"
		abilityText = "none";
	} else {
		let petData = getPetData(pet.Enum);
		let health = pet.Health.Permanent + pet.Health.Temporary;
		let attack = pet.Attack.Permanent + pet.Attack.Temporary;
		abilityText = petData[`level${pet.Level}Ability`].description;
		content = `${petData.name}(${health},${attack})${pet.Frozen ? "(frozen)" : "" }`;
	}

	let button = Button({
		content: content,
		hoverText: abilityText,
		width:"shrink",
	})

	if(onClick) {
		button.on("click", () => onClick());
	}

	return button;
}