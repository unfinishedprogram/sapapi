import Match from "../implementation/match";
import * as blessed from "blessed";
import errorMessage from "./components/errorMessage"

import IMinion from "../types/game/minion";
import ISpell from "../types/game/spell";

import { minionNames } from "../data/minions";
import { spellNames } from "../data/spells";
import choseAccountMenu from "./menus/chooseAccountMenu";

import mainMenu from "./menus/mainMenu";

export default class GameDisplay {
	screen:blessed.Widgets.Screen;
	mainContainer:blessed.Widgets.BoxElement;

	shopPetList:blessed.Widgets.ListElement;
	shopFoodList:blessed.Widgets.ListElement;
	teamPetList:blessed.Widgets.ListElement;

	constructor(public match:Match) { 
		match.onError = ((message:string) => {
			this.error(message);
		})

		this.screen = blessed.screen({
			fullUnicode: true,
			smartCSR:true,
			mouse:true,
		});

		this.mainContainer = blessed.box({
			parent:this.screen,
			width:"100%",
			height:"100%",
			bg:"#CCC",
		})
	
		this.screen.title = "Super Auto Pets"

		this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
			return process.exit(0);
		});

		this.mainContainer.append(choseAccountMenu(this));
	}

	async guestLogin(){
		await this.match.loginAsGuest().then(() => {
			if(this.match.authToken) {
				this.setMenu(mainMenu(this))
			}
		}).catch(this.error);
	}

	login(username: string, password:string) {

	}

	setMenu(menu:blessed.Widgets.BoxElement){
		this.mainContainer.children[0].destroy();
		this.mainContainer.append(menu);
		this.render();
	}
	getMenu():blessed.Widgets.BoxElement {
		return this.mainContainer.children[0] as blessed.Widgets.BoxElement;
	}

	capitalize(str:string) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	render() {
		this.screen.render();
	}

	error(message:string) {
		errorMessage(this, message);
	}
}
