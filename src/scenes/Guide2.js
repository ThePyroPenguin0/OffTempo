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

    const deputySprite = this.add.image(config.width * 0.9, config.height * 0.2, "deputyS").setOrigin(0.5).setScale(0.4).setInteractive({ useHandCursor: true });
        deputySprite.on('pointerover', () => {
            deputySprite.setTint(0xdddddd);
            this.sound.play('pop');
        });
        deputySprite.on('pointerout', () => {
            deputySprite.clearTint();
        });
        deputySprite.on('pointerdown', () => {
            this.sound.play('click');
        });

    const bankerSprite = this.add.image(config.width * 0.9, config.height * 0.375, "bankerS").setOrigin(0.5).setScale(0.4).setInteractive({ useHandCursor: true });
        bankerSprite.on('pointerover', () => {
            bankerSprite.setTint(0xdddddd);
            this.sound.play('pop');
        });
        bankerSprite.on('pointerout', () => {
            bankerSprite.clearTint();
        });
        bankerSprite.on('pointerdown', () => {
            this.sound.play('click');
        });

    const defenseSprite = this.add.image(config.width * 0.9, config.height * 0.55, "defenseS").setOrigin(0.5).setScale(0.4).setInteractive({ useHandCursor: true });
        defenseSprite.on('pointerover', () => {
            defenseSprite.setTint(0xdddddd);
            this.sound.play('pop');
        });
        defenseSprite.on('pointerout', () => {
            defenseSprite.clearTint();
        });
        defenseSprite.on('pointerdown', () => {
            this.sound.play('click');
        });

    const jingoSprite = this.add.image(config.width * 0.9, config.height * 0.7, "jingoS").setOrigin(0.5).setScale(0.4).setInteractive({ useHandCursor: true });
        jingoSprite.on('pointerover', () => {
            jingoSprite.setTint(0xdddddd);
            this.sound.play('pop');
        });
        jingoSprite.on('pointerout', () => {
            jingoSprite.clearTint();
        });
        jingoSprite.on('pointerdown', () => {
            this.sound.play('click');
        });
        jingoSprite.on('pointerdown', () => {
            this.sound.play('click');
        });

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
            this.scene.start('guide3Scene', { ingame: this.ingame });
            this.sound.play('click');
        });

        const prevPageButton = this.add.text(game.config.width * 0.155, game.config.height * 0.9, "<- Previous Page", subtitleText)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        prevPageButton.setBackgroundColor('#074b8a');

        prevPageButton.on('pointerover', () => {
            prevPageButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        prevPageButton.on('pointerout', () => {
            prevPageButton.setBackgroundColor('#074b8a');
        });
        prevPageButton.on('pointerdown', () => {
            this.scene.start('guideScene', { ingame: this.ingame });
            this.sound.play('click');
        });

        const escapeButton = this.add.text(game.config.width * 0.5, game.config.height * 0.9, "Exit", subtitleText)
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
