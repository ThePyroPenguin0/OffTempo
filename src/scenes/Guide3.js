class Guide3 extends Phaser.Scene {
    init(data) {
        this.ingame = data && data.ingame === true;
    }
    constructor() {
        super('guide3Scene');
    }

    create() {
        const textStyle = {
            fontSize: '24px',
            fill: "#ffffff",
            align: 'left',
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true },
        };

        this.add.text(config.width * 0.5, config.height * 0.1,
            `HINTS:\n\nClicking on advisors in their respective windows will have them share their advice and perspective on the current turn. They will always give you their genuine and honest advice. They will NOT always give you helpful advice.\n\nThis guide can be accessed at any time in-game by clicking the book icon (currently displayed on the right) in the top right corner of the game screen.\n\nIf moving your mouse over an object highlights it and plays a "pop" sound, that object can be clicked on for an interaction. Try it on the book icon or the minister icons on the previous page!`,
            textStyle
        ).setOrigin(0.5, 0);

        this.rulebook = this.add.image(game.config.width * 0.925, game.config.height * 0.33, "book").setScale(1).setInteractive();
        this.rulebook.on('pointerover', () => {
            this.rulebook.setTint(0xdddddd);
            this.sound.play('pop');
        });
        this.rulebook.on('pointerout', () => {
            this.rulebook.clearTint();
        });
        this.rulebook.on('pointerdown', () => {
            this.sound.play('click');
        });
        let subtitleText =
        {
            fontSize: "22px",
            backgroundColor: "#074b8a",
            color: "#f0f0f0",
            align: "center",
            padding:
            {
                top: 20,
                bottom: 20,
                left: 30,
                right: 30,
            },
            fixedWidth: 0
        }

        const prevPageButton = this.add.text(game.config.width * 0.155, game.config.height * 0.9, "<- Previous Page", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        prevPageButton.setBackgroundColor('#074b8a');

        prevPageButton.on('pointerover', () => {
            prevPageButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        prevPageButton.on('pointerout', () => {
            prevPageButton.setBackgroundColor('#074b8a');
        });
        prevPageButton.on('pointerdown', () => {
            this.scene.start('guide2Scene', { ingame: this.ingame });
            this.sound.play('click');
        });

        const escapeButton = this.add.text(game.config.width * 0.85, game.config.height * 0.9, "Exit", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        escapeButton.setBackgroundColor('#074b8a');

        escapeButton.on('pointerover', () => {
            escapeButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        escapeButton.on('pointerout', () => {
            escapeButton.setBackgroundColor('#074b8a');
        });
        escapeButton.on('pointerdown', () => {
            if (this.ingame) {
                this.ingame = false;
                this.scene.start('playScene');
            }
            else {
                this.scene.start('menuScene');
            }
            this.sound.play('click');
        });


    }

    update() { }
}
