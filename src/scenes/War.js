class War extends Phaser.Scene {
    constructor() {
        super('warScene');
    }

    create() {
        this.add.image(config.width / 2, config.height / 2, "warTable").setOrigin(0.5, 0.5);
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.add.text(config.width / 2, config.height / 2, `Total offense: ${this.ScoreMatrix.sumRow(3)}\n\nTotal defense: ${this.ScoreMatrix.sumRow(2)}`, {
            fontSize: '18px',
            fill: "#000000",
            align: 'center',
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true },
        }).setOrigin(0.5);
        this.add.text(config.width * 0.5, config.height * 0.65, "If you attacked, compare your 'Total offense' score to your opponent's 'Total defense' score.\n\nIf you were attacked, compare your 'Total defense' score to your opponent's 'Total offense' score.").setOrigin(0.5, 1).setFill('#000000').setFontSize(12).setWordWrapWidth(config.width * 0.6).setAlign('center').setBackgroundColor('#ffffff').setPadding(10);


        let subtitleText =
        {
            fontSize: "22px",
            backgroundColor: "#074b8a",
            color: "#ffffffff",
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

        const nextPageButton = this.add.text(game.config.width * 0.85, game.config.height * 0.9, "Next Page ->", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        nextPageButton.setBackgroundColor('#0ab505ff');

        nextPageButton.on('pointerover', () => {
            nextPageButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        nextPageButton.on('pointerout', () => {
            nextPageButton.setBackgroundColor('#0ab505ff');
        });
        nextPageButton.on('pointerdown', () => {
            this.scene.start('reviewScene', { ingame: this.ingame });
            this.sound.play('click');
        });
    }
}