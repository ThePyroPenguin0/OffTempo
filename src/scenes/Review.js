class Review extends Phaser.Scene {
    constructor() {
        super('reviewScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.ScoreMatrix.displayMatrix(this);
       
        this.input.keyboard.on('keydown-ESC', () => {
            this.ScoreMatrix.resetMatrix();
            this.scene.start('menuScene');
        });

        this.exitButton = this.add.image(game.config.width * 0.95, game.config.height * 0.075, "exitButton").setScale(0.5, 0.5).setVisible(false);
        this.exitButton.on('pointerdown', () => {
            this.sound.play('click');
            this.ScoreMatrix.resetMatrix();
            this.scene.start('menuScene');
        });

        this.exitButton.on('pointerover', () => {
            this.exitButton.setTint(0xdddddd);
            this.sound.play('pop');
        });
        this.exitButton.on('pointerout', () => {
            this.exitButton.clearTint();
        });

        const downloadText = this.add.text(config.width / 2, config.height * 0.9, "Click to download your score matrix as a .CSV file.\nYou can then open it in Excel to review with your Discussion Leaders.", {
            fontSize: '22px',
            fill: '#ffffff',
            backgroundColor: '#074b8a',
            padding: { x: 10, y: 10 },
            align: 'center',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        downloadText.on('pointerover', () => {
            downloadText.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        downloadText.on('pointerout', () => {
            downloadText.setBackgroundColor('#074b8a');
        });

        downloadText.on('pointerdown', () => {
            const matrixText = this.ScoreMatrix.getMatrixAsText();
            const blob = new Blob([matrixText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'score_matrix.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.sound.play('click');
            this.exitButton.setVisible(true);
            this.exitButton.setInteractive({ useHandCursor: true });
        });

        
    }

    update() {
    }
}