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
        let backButton = this.add.text(50, 50, 'BACK', {
            fontSize: '32px',
            fontFamily: 'Courier, monospace',
            color: '#FF0000',
            backgroundColor: '#DDDDDD',
            padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });

        backButton.on('pointerover', () => {
            backButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        backButton.on('pointerout', () => {
            backButton.setBackgroundColor('#DDDDDD');
        });

        backButton.on('pointerdown', () => {
            this.sound.play('click');
            this.scene.start('playScene');
        });
    }

    update() {
    }
}