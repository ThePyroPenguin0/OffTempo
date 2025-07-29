class Review extends Phaser.Scene {
    constructor() {
        super('reviewScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.ScoreMatrix.displayMatrix(this);

        this.add.text(config.width / 2, config.height * 0.9, "Take a screenshot of this screen.\nUse (Windows key + Shift + S) on Windows or (Command + Shift + 4) on Mac and save it.\nWhen you are done, press (ESCAPE) to exit to main menu.", {
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