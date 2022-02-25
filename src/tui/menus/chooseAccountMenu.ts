import GameDisplay from "../gameDisplay";
import loginMenu from "./loginMenu"
import verticalList from "../components/verticalList"
import Button from "../components/button";
import loadingScreen from "../components/loadingScreen"

export default function choseAccountMenu (window:GameDisplay) {
	let loginButton = Button({ content: "Login" });
	let registerButton = Button({ content: "Register" });
	let guestButton = Button({ content: "Guest" });
	let exit = Button({ content: "Exit" });

	let menu = verticalList([loginButton, registerButton, guestButton, exit], {
		mouse: true,
		label: "Home",
		left: "center",
		top: "center",
		shadow: true,
	})

	loginButton.on("click", () => {
		window.setMenu(loginMenu(window, (email, password) => {
				window.login(email, password)
			})
		)
	})

	guestButton.on("click", () => {
		loadingScreen(window, "Logging in...", window.guestLogin());
	})

	exit.on("click", () => {
		return process.exit(0);
	})

	return menu;
}