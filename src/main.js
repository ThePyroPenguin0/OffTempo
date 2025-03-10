// const ScoreMatrix = window.ScoreMatrix;
let config =
{
    type: Phaser.AUTO,
    width: 1366,
    height: 768,
    scene: [Load, Menu, Play, War, Review, Guide, Defense, Finance, Offense, Consumption, Turn],
    plugins: {
        global: [
            { key: 'ScoreMatrix', plugin: ScoreMatrix, start: true }
        ]
    }
};

console.log("Width: " + config.width + "\nHeight: " + config.height);

let game = new Phaser.Game(config);
let keyRESTART, keyESCAPE, keyLEFT, keyRIGHT;