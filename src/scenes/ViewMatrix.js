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

        this.add.text(config.width / 2, config.height * 0.9, "Press (ESCAPE) to resume the game.", {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5);
        
        this.input.keyboard.on('keydown-ESC', () => {
            console.log(`Current stats:
                ${this.turn} turns playedn\n
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