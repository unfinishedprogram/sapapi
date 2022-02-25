import GameDisplay from "tui/gameDisplay";
import verticalList from "../components/verticalList"
import BuildMenu from "../components/buildMenu";
import Button from "../components/button";

export default function mainMenu (window:GameDisplay) {
	const exit = Button({ content: "Exit" });
	const arena = Button({ content:"Arena Mode" });

	let menu = verticalList([arena, exit], {
		mouse: true,
		label: "Main Menu",
		left: "center",
		top: "center",
		shadow: true,
	})	

	exit.on("click", () => process.exit(0))
	arena.on("click", async () => {
		await window.match.enqueue();
		await window.match.start();
		window.setMenu(new BuildMenu(window).elm);
	} )
	return menu
}
