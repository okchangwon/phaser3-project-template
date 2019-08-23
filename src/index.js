import { Game } from "phaser";
import GameScene from "./js/GameScene";

class App extends Game {
    constructor() {
        const config = {
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: [ GameScene ],
            backgroundColor: "#FFFFFF",
        };

        super(...config);
    }
}

window.game = new App();