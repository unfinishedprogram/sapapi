import RequestHandler from "./requestHandler";
import Match from "./implementation/match";
import GameDisplay from "./tui/gameDisplay";

Object.defineProperty(String.prototype, "toUpper", {
	value: function() {
		return this.charAt(0).toUpperCase() + this.slice(1)
	}
});

// const handler = new RequestHandler("16");
// const match = new Match(handler);

async function play() {
	const match = new Match(new RequestHandler("16"));
	
	const display = new GameDisplay(match)
	display.render();
}

// screen.render();


// async function handleInput(match:Match) {
// 	const rl = readline.createInterface({ input:stdin, output:stdout });
// 	let quit = false;
// 	const cmd = () => {
// 		if(quit) return;

// 		rl.question("Enter a command > ", async (answer) => {
// 			console.log(answer);
// 			const parsed = answer.split(" ");
// 			if (parsed[0] == "buypet") {
// 				await match.buyPet(Number(parsed[1]), Number(parsed[2]))
// 			} else if (parsed[0] == "buyfood") {
// 				await match.buyFood(Number(parsed[1]), Number(parsed[2]))
// 			} else if (parsed[0] == "roll") {
// 				await match.rollShop();
// 			} else if (parsed[0] == "freeze") {
// 				match.freeze(Number(parsed[1]));
// 			} else if (parsed[0] == "unfreeze") {
// 				match.unfreeze(Number(parsed[1]));
// 			} else if (parsed[0] == "end") {
// 				await match.endBuild();
// 			}
// 			match.printBoard();
// 			cmd();
// 		})
// 	}
// 	cmd();
// }

play();
