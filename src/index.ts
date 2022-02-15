import RequestHandler from "./requestHandler";
import Match from "./implementation/match";
import * as readline from "node:readline";
import { stdin, stdout } from "node:process";

// const handler = new RequestHandler("16");
// const match = new Match(handler);

async function play() {
	const match = new Match(new RequestHandler("16"));
	await match.init();
	await match.enqueue();
	await match.start();
	match.printBoard();
	handleInput(match)

	// await match.buyPet(0, 0);
	// await match.buyPet(1, 0);
	// await match.buyPet(2, 0);
	// await match.rollShop();
	// match.printBoard();
}

async function handleInput(match:Match) {
	const rl = readline.createInterface({ input:stdin, output:stdout });
	let quit = false;
	const cmd = () => {
		if(quit) return;

		rl.question("Enter a command > ", async (answer) => {
			console.log(answer);
			const parsed = answer.split(" ");
			if (parsed[0] == "buypet") {
				await match.buyPet(Number(parsed[1]), Number(parsed[2]))
			} else if (parsed[0] == "buyfood") {
				await match.buyFood(Number(parsed[1]), Number(parsed[2]))
			} else if (parsed[0] == "roll") {
				await match.rollShop();
			} else if (parsed[0] == "freeze") {
				await match.freeze(Number(parsed[1]));
			} else if (parsed[0] == "unfreeze") {
				await match.unfreeze(Number(parsed[1]));
			}

			match.printBoard();
			cmd();
		})
	}
	cmd();
}

play();
