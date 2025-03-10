class Review extends Phaser.Scene {
    constructor() {
        super('reviewScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.ScoreMatrix.displayMatrix(this);

        this.add.text(config.width / 2, config.height * 0.9, "Press (ESCAPE) to exit to main menu.", {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ESC', () => {
            this.ScoreMatrix.resetMatrix();
            this.scene.start('menuScene');
        });
    }

    update() {
    }
}