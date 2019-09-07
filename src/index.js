import { Game } from "phaser";
import GameScene from "./js/GameScene";
import { SCALE_RATIO } from "./js/constants";

const baseWidth = window.innerWidth;
const baseHeight = window.innerHeight;

class App extends Game {
    constructor() {
        const config = {
            type: Phaser.CANVAS,
            width: baseWidth,
            height: baseHeight,
            physics: {
                default: 'matter',
                matter: {
                    gravity: {
                        x: 0,
                        y: 0.5 * SCALE_RATIO,
                    },
                    setBounds: {
                        width: baseWidth,
                        height: baseHeight,
                    },
                }
            },
            scene: [ GameScene ],
            backgroundColor: "#FFFFFF",
        };

        super(...config);
    }
}

window.game = new App();