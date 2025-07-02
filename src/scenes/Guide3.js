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
            `HINTS:\n\nClicking on advisors in their respective windows will have them share their advice and perspective on the current turn. They will always give you their genuine and honest advice. They will NOT always give you helpful advice.\n\nThis guide can be accessed at any time in-game by clicking the book icon (currently displayed on the right) in the top right corner of the game screen.`, 
            textStyle
        ).setOrigin(0.5, 0);

        this.add.text(config.width * 0.5, config.height * 0.95, 
            "Press (LEFT ARROW) to return to the previous guide page. Press (ESCAPE) to exit to main menu.", 
            { ...textStyle, padding: { x: 20, y: 20 } }
        ).setOrigin(0.5, 1);

        this.rulebook = this.add.image(game.config.width * 0.925, game.config.height * 0.33, "book").setScale(1).setInteractive();

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('menuScene');
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            this.scene.start('guide2Scene', { ingame: this.ingame });
        });
    }

    update() {}
}
