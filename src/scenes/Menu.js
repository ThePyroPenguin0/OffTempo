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
        this.add.text(game.config.width / 2, game.config.height / 2, "A Resource Management Game for the Department of Defense Management, Naval Postgraduate School", subtitleText).setOrigin(0.5);

        // Create Start Game button
        const startButton = this.add.text(game.config.width * 0.25, game.config.height * 0.75, "Start Game", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        startButton.on('pointerover', () => {
            startButton.setBackgroundColor('#AAAAAA');
        });
        startButton.on('pointerout', () => {
            startButton.setBackgroundColor('#074b8a');
        });
        startButton.on('pointerdown', () => {
            this.scene.start('playScene');
        });

        // Create View Rules button
        const rulesButton = this.add.text(game.config.width * 0.75, game.config.height * 0.75, "View Rules", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        rulesButton.on('pointerover', () => {
            rulesButton.setBackgroundColor('#AAAAAA');
        });
        rulesButton.on('pointerout', () => {
            rulesButton.setBackgroundColor('#074b8a');
        });
        rulesButton.on('pointerdown', () => {
            this.scene.start('guideScene');
        });

        // Remove keyboard navigation for these actions
    }

    update() {
    }
}