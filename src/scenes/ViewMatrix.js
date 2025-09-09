class ViewMatrix extends Phaser.Scene {
    init() {
        this.turn = 0;
    }
    constructor() {
        super('reportScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.ScoreMatrix.displayMatrix(this);

        this.add.text(config.width / 2, config.height * 0.95, "Your team's moves so far are listed above, with each row representing one turn and each column representing its stated resource. The first part of an entry is the absolute quantity of that resource purchased on that turn, while the second part is the percentage of the turn's budget spent on that resource.").setOrigin(0.5, 1).setFontSize(22).setWordWrapWidth(config.width * 0.9).setAlign('center');
        this.exitButton = this.add.image(game.config.width * 0.95, game.config.height * 0.075, "exitButton").setScale(0.5, 0.5).setInteractive({ useHandCursor: true });
        this.exitButton.on('pointerdown', () => {
            this.sound.play('click');
            this.scene.start('playScene');
        });

        this.exitButton.on('pointerover', () => {
            this.exitButton.setTint(0xdddddd);
            this.sound.play('pop');
        });
        this.exitButton.on('pointerout', () => {
            this.exitButton.clearTint();
        });
        
        this.input.keyboard.on('keydown-ESC', () => {
            console.log(`Current stats:
                ${this.turn} turns played\n
                ${this.ScoreMatrix.sumRow(0)} spent on consumption\n
                ${this.ScoreMatrix.sumRow(1)} spent on investment\n
                ${this.ScoreMatrix.sumRow(2)} spent on defense\n
                ${this.ScoreMatrix.sumRow(3)} spent on offense\n
                `);
            this.scene.start('playScene', { turn: this.turn });
        });
    }

    update() {
    }
}