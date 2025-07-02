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
            `THE RULES\n1. Each game of "Off Tempo" will last a maximum of ten turns. Within those ten turns, there are four ways to win:\n   - By reaching a threshold of 1000 units of consumption purchased\n    - By initiating a war by and having more offense than your opponent has defense\n- Defending successfully against an attacking opponent\n- By having the highest total consumption at the end of the game\n\n2. Each turn, you will be assigned a budget. With this budget, you can do four things - buy defensive capabilities, offensive capabilities, purchase consumption, or invest.\n\n3. Each budget only takes effect at the start of the following turn.\n\n4. Once the entire budget has been spent, clicking the "Next Turn" button will bring up a screen and ask for a turn code. The referee will provide the turn code in order to ensure that everyone advances to the next turn simultaneously.\n\n5. Pressing the "Turn History" button will allow you to view the history of your turns, showing what percentage of the budget was spent on that turn for each resource, and the absolute amount of each resource gained as a result in parentheses. At the bottom of the table, there will be a running total for the entire game.\n\n6. At any point before a turn is finished, pressing the "Attack!" button will cause your nation to attack your opponent.\n\n7. Should the war result in a tie, the defender wins by default.`, 
            textStyle
        ).setOrigin(0.5, 0);

        this.add.text(config.width * 0.5, config.height * 0.95, 
            "Press (ESCAPE) to exit to main menu or game. Press (RIGHT ARROW) to continue to the next guide page.", 
            { ...textStyle, padding: { x: 20, y: 20 } }
        ).setOrigin(0.5, 1);

        this.input.keyboard.on('keydown-ESC', () => {
            if(this.ingame) {
                this.ingame = false;
                this.scene.start('playScene');
            }
            else {
                this.scene.start('menuScene');
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            this.scene.start('guide2Scene', { ingame: this.ingame });
        });
    }

    update() {}
}
