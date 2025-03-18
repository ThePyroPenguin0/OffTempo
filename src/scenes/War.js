class War extends Phaser.Scene {
    constructor() {
        super('warScene');
    }

    create() {
        this.add.image(config.width / 2, config.height / 2, "warTable").setOrigin(0.5, 0.5);
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.add.text(config.width/2, config.height / 2, `Total offense: ${this.ScoreMatrix.sumRow(3)}\n\nTotal defense: ${this.ScoreMatrix.sumRow(2)}`, {
            fontSize: '18px',
            fill: "#000000",
            align: 'center',
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true },
        }).setOrigin(0.5);
        this.add.text(config.width * 0.2, config.height * 0.9, "Press (ENTER) to progress to the game review.").setOrigin(0.5, 1);
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('reviewScene');
        });
    }
}