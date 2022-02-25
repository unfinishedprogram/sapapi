import * as blessed from "blessed"
import GameDisplay from "../gameDisplay";
import Shop from "../components/shop"
import Team from "../components/team"
import Button from "../components/button";
import loadingScreen from "../components/loadingScreen";
import Match from "../../implementation/match";
import IItemId from "../../types/game/itemId";
import IMinion from "types/game/minion";

export default class BuildMenu  {
	shop:Shop;
	team:Team;
	public match:Match;
	matchInfo: blessed.Widgets.TextElement;
	shopSelected: IItemId | null;
	teamSelected: number | null;
	elm:blessed.Widgets.BoxElement;

	constructor(private window:GameDisplay) {
		this.match = window.match;
		this.shop = new Shop(this);
		this.team = new Team(this);

		const roll = Button({ content:"Roll", left:0, bottom:0, width:16 });
		const endTurn = Button({ content:"End Turn", right:0, bottom:0, width:16 });
		const freeze = Button({ content:"Freeze", left:"center", bottom:0, width:16 });

		roll.on("click", async () => {
			loadingScreen(window, "Rolling...", window.match.rollShop().then(() => this.update()));
		})

		freeze.on("click", async () => {
			if(this.shopSelected){
				if(window.match.getShopItemById(this.shopSelected).Frozen) {
					window.match.unfreeze(this.shopSelected)
				}else {
					window.match.freeze(this.shopSelected)
				}
				
				this.update();
				this.shop.clearSelect();
			}
		})

		endTurn.on("click", async () => {
			loadingScreen(window, "Battling...", window.match.endBuild().then(() => this.update()))
		})

		this.matchInfo = blessed.text({
			content: this.infoText,
			height:"shrink",
			width:"shrink",
			border:"line",
			top:0,
			left:0,
		})

		this.elm = blessed.box({
			mouse: true,
			left: "center",
			top: "center",
			width:"100%-4",
			height:"100%-2",
			shadow: true,
			children:[this.shop.elm, this.team.elm, roll, freeze, endTurn, this.matchInfo],
		})

		this.update();
	}

	get infoText() {
		return `Gold:${this.match.gold} Health:${this.match.health} Wins:${this.match.victories} Turn:${this.match.turn}`
	}

	async buy(itemId: IItemId, teamPos:number) {
		const teamId = this.match.board.minions[teamPos]?.Id;
		const item = this.shop.getItemById(itemId);
		if((item as IMinion).Health) {
			// Minion
			await this.match.buyPet(itemId, teamPos);

		} else {
			// Item
			if(teamId){
				await this.match.buyFood(itemId, teamId);
			}
		}
	
		this.update();
	}

	update() {
		this.matchInfo.content = this.infoText;
		this.shop.update();
		this.team.update();
		this.window.render();
	}
	clearSelected(){
		this.shop.clearSelect();
		this.team.clearSelect();
	}
}
