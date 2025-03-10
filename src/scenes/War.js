class War extends Phaser.Scene {
    constructor() {
        super('warScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.add.text(config.width * 0.3, config.height / 2, `Total offense: ${this.ScoreMatrix.sumRow(3)}\n\nTotal defense: ${this.ScoreMatrix.sumRow(2)}`, {
            fontSize: '18px',
            fill: "#ffffff",
            align: 'left',
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true },
        })
        this.add.text(config.width * 0.5, config.height * 0.9, "Press (ENTER) to progress to the game review.").setOrigin(0.5, 1);
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('reviewScene');
        });
    }

    update() {
    }
}