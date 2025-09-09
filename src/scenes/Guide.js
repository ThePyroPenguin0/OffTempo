class Guide extends Phaser.Scene {
    init(data) {
        this.ingame = data && data.ingame === true;
    }
    constructor() {
        super('guideScene');
    }

    create() {
        console.log("In game? " + this.ingame);
        const textStyle = {
            fontSize: '22px',
            fill: "#ffffff",
            align: 'left',
            wordWrap: { width: config.width * 0.9, useAdvancedWrap: true },
        };

        this.add.text(config.width * 0.5, config.height * 0.1,
            `THE RULES\n1. Each game of "Off Tempo" will last a maximum of ten turns. Within those ten turns, there are four ways to win:\n   - By reaching a threshold of 1000 units of consumption accumulated\n    - By initiating a war by and having more offense than your opponent has defense\n- By having your opponent initiate a war and having equal to or more defense than your opponent has offense\n- By having the highest total consumption at the end of the game\n\n2. Each turn, you will be assigned a budget. With this budget, you can do four things - buy defensive capabilities, offensive capabilities, purchase consumption, or invest.\n\n3. Each budget only takes effect at the start of the following turn.\n\n4. Once the entire budget has been spent, clicking the "Next Turn" button will bring up a screen and ask for a turn code. The referee will provide the turn code in order to ensure that everyone advances to the next turn simultaneously.\n\n5. Pressing the "Turn History" button will allow you to view the history of your turns, showing how much of each resource was purchased every turn, and the percentage of the budget used that turn to buy that resource. At the bottom of the table, there will be a running total for the entire game.\n\n6. At any point before a turn is finished, pressing the "Attack!" button will cause your nation to attack your opponent's. When this button is pressed, calmly inform your discussion leader that you have by screaming "WE ATTACK!" as a group.\n\n7. Should the war result in a tie, the defender wins by default.`,
            textStyle
        ).setOrigin(0.5, 0);

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.ingame) {
                this.ingame = false;
                this.scene.start('playScene');
            }
            else {
                this.scene.start('menuScene');
            }
        });

        let subtitleText =
        {
            fontSize: "22px",
            backgroundColor: "#074b8a",
            color: "#f0f0f0",
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
        nextPageButton.setBackgroundColor('#074b8a');

        nextPageButton.on('pointerover', () => {
            nextPageButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        nextPageButton.on('pointerout', () => {
            nextPageButton.setBackgroundColor('#074b8a');
        });
        nextPageButton.on('pointerdown', () => {
            this.scene.start('guide2Scene', { ingame: this.ingame });
            this.sound.play('click');
        });

        const escapeButton = this.add.text(game.config.width * 0.1, game.config.height * 0.9, "Exit", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        escapeButton.setBackgroundColor('#074b8a');

        escapeButton.on('pointerover', () => {
            escapeButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        escapeButton.on('pointerout', () => {
            escapeButton.setBackgroundColor('#074b8a');
        });
        escapeButton.on('pointerdown', () => {
            if(this.ingame) {
                this.ingame = false;
                this.scene.start('playScene');
            }
            else {
                this.scene.start('menuScene');
            }
            this.sound.play('click');
        });
    }

    update() { }
}
