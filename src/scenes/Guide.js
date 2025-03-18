class Guide extends Phaser.Scene {
    constructor() {
        super('guideScene');
    }

    create() {
        const textStyle = {
            fontSize: '18px',
            fill: "#ffffff",
            align: 'left',
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true },
        };

        this.add.text(config.width * 0.45, config.height * 0.1, 
            `THE RULES\n1. Each game of "Off Tempo" will last a maximum of ten turns. Within those ten turns, there are three ways to win:\n   - By reaching a threshold of 1000 units of consumption purchased\n    - By initiating a war by and having more offense than your opponent has defense (in case of a tie, the defender wins).\n- Defending successfully against an attacking opponent\n- By having the highest total consumption at the end of the game\n2. Each turn, you will be assigned a budget. With this budget, you can do four things - buy defensive capabilities, offensive capabilities, purchase consumption, or invest.\n3. Each budget only takes effect at the start of the following turn.\n4. Once the entire budget has been spent, clicking the "Next Turn" button will bring up a screen and ask for a turn code. The referee will provide the turn code in order to ensure that everyone advances to the next turn simultaneously.\n5. At any point before a turn is finished, pressing the "Attack!" button will cause your nation to attack your opponent.\n\nTHE RESOURCES\nConsumption represents spending on programs to directly benefit the welfare of your citizens. In order to buy consumption, click on your Deputy Prime Minister (shown to the right) on the main game screen. Consumption serves no other purpose than to be your score at the end of a peaceful game.\n\nInvestment represents expands nation's economy. The budget on the first turn is 100, but is increased by spending on investment. If you were to purchase 50 investment on turn one, then your budget for all future turns would increase by 50. Investment can be purchased from the Finance Minister.\n\nDefense represents your country's ability to defend itself against your opponent, and is bought at a ratio of 1:1. If 500 budget is allocated to defense, then your defense will increase by 500. Defense can be bought from the Defense Minister.\n\nOffense represents your nation's offensive capabilities, and should be maximized if you intend to attack your opponent. Unlike defense, offense is bought at a ratio of 1:2. If 500 budget is allocated to offense, 250 offense will be purchased. Offense can be bought from the National Security Advisor.\n\nNote: All resources are cumulative and do not disappear.`, 
            textStyle
        ).setOrigin(0.5, 0);

        this.add.text(config.width * 0.5, config.height * 0.9, 
            "Press (ESCAPE) to exit to main menu.", 
            { ...textStyle, padding: { x: 20, y: 20 } }
        ).setOrigin(0.5, 1);

        this.add.image(config.width*0.9, config.height*0.46, "deputyS").setOrigin(0.5).setScale(0.3);
        this.add.image(config.width*0.9, config.height*0.56, "bankerS").setOrigin(0.5).setScale(0.28);
        this.add.image(config.width*0.9, config.height*0.66, "defenseS").setOrigin(0.5).setScale(0.3);
        this.add.image(config.width*0.9, config.height*0.77, "jingoS").setOrigin(0.5).setScale(0.3);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('menuScene');
        });
    }

    update() {}
}
