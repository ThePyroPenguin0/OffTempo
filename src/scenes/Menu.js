class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {}

    create() {

        let titleText =
        {
            fontFamily: "Times New Roman",
            fontSize: "72px",
            backgroundColor: "#074b8a",
            color: "#ffffff",
            align: "center",
            padding:
            {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
            },
            fixedWidth: 0
        }

        let subtitleText =
        {
            fontFamily: "Times New Roman",
            fontSize: "24px",
            backgroundColor: "#074b8a",
            color: "#f0f0f0",
            align: "center",
            padding:
            {
                top: 10,
                bottom: 10,
                left: 30,
                right: 30,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width / 2, game.config.height / 3, "Off Tempo", titleText).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2, "A Resource Management Game for the Department of Defense Management", subtitleText).setOrigin(0.5);

        this.add.text(game.config.width * 0.25, game.config.height * 0.75, "Press (ENTER) to begin", subtitleText).setOrigin(0.5);
        this.add.text(game.config.width * 0.75, game.config.height * 0.75, "Press (R) to view rules", subtitleText).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESCAPE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyRESTART = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('playScene');
        });
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyRESTART)) {
            this.scene.start('guideScene');
        }
    }
}