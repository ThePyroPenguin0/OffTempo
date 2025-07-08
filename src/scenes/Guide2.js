class Guide2 extends Phaser.Scene {
    init(data) {
        this.ingame = data && data.ingame === true;
    }
    constructor() {
        super('guide2Scene');
    }

    create() {
        const textStyle = {
            fontSize: '24px',
            fill: "#ffffff",
            align: 'left',
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true },
        };

        this.add.text(config.width * 0.45, config.height * 0.1, 
            `THE RESOURCES\nConsumption represents spending on programs to directly benefit the welfare of your citizens. In order to buy consumption, click on your Deputy Prime Minister (shown to the right) on the main game screen. Consumption serves no other purpose than to be your score at the end of a peaceful game.\n\nInvestment represents expansion of the nation's economy. The budget on the first turn is 100, but is increased by spending on investment. If you were to purchase 50 investment on turn one, then your budget for all future turns would increase by 50. Investment can be purchased from the Finance Minister.\n\nDefense represents your country's ability to defend itself against your opponent, and is bought at a ratio of 1:1. If 500 budget is allocated to defense, then your defense will increase by 500. Defense can be bought from the Defense Minister.\n\nOffense represents your nation's offensive capabilities. Unlike all other resources, offense is bought at a ratio of 1:2 instead of 1:1. If 500 budget is allocated to offense, 250 offense will be purchased. Offense can be bought from the National Security Advisor.\n\nIMPORTANT: All resources are cumulative and do not disappear.`, 
            textStyle
        ).setOrigin(0.5, 0);

        this.add.text(config.width * 0.5, config.height * 0.95, 
            "Press (LEFT ARROW) to return to the previous guide page. Press (ESCAPE) to exit to main menu. Press (RIGHT ARROW) to continue to the next guide page.", 
            { ...textStyle, padding: { x: 20, y: 20 } }
        ).setOrigin(0.5, 1);

        this.add.image(config.width*0.9, config.height*0.2, "deputyS").setOrigin(0.5).setScale(0.4);
        this.add.image(config.width*0.9, config.height*0.375, "bankerS").setOrigin(0.5).setScale(0.4);
        this.add.image(config.width*0.9, config.height*0.55, "defenseS").setOrigin(0.5).setScale(0.4);
        this.add.image(config.width*0.9, config.height*0.7, "jingoS").setOrigin(0.5).setScale(0.4);

        this.input.keyboard.on('keydown-ESC', () => {
            if(this.ingame) {
                this.ingame = false;
                this.scene.start('playScene');
            }
            else {
                this.scene.start('menuScene');
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            this.scene.start('guideScene', { ingame: this.ingame });
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            this.scene.start('guide3Scene', { ingame: this.ingame });
        });
    }

    update() {}
}
