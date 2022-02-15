import RequestHandler from "./requestHandler";
import Match from "./implementation/match";

// const handler = new RequestHandler("16");
// const match = new Match(handler);

async function play() {
	const handler = new RequestHandler("16");
	const match = new Match(handler);
	await match.init();
	await match.enqueue();
	await match.start();
	await match.buyPet(0, 0);
	await match.buyPet(1, 0);
	await match.buyPet(2, 0);
	await match.rollShop();
	match.printBoard();
}

play();
