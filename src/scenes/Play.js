class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.background = this.add.image(0, 0, "background").setOrigin(0);

        this.posLock = false;

        this.finance = this.add.image(game.config.width * 0.6, game.config.height * 0.65, "banker").setScale(1);
        this.finance.down = false;
        this.defense = this.add.image(game.config.width * 0.4, game.config.height * 0.6, "defense").setScale(1);
        this.defense.down = false;
        this.offense = this.add.image(game.config.width * 0.25, game.config.height * 0.7, "jingo").setScale(1);
        this.offense.down = false;
        this.consumption = this.add.image(game.config.width * 0.75, game.config.height * 0.7, "deputy").setScale(1);
        this.consumption.down = false;

        this.offense.setInteractive({
            pixelPerfect: true
        });
        this.offense.on('pointerover', () => {
            this.offense.setTint(0xdddddd);
        });

        this.defense.setInteractive({
            pixelPerfect: true
        });
        this.defense.on('pointerover', () => {
            this.defense.setTint(0xdddddd);
        });

        this.finance.setInteractive({
            pixelPerfect: true
        });
        this.finance.on('pointerover', () => {
            this.finance.setTint(0xdddddd);
        });

        this.consumption.setInteractive({
            pixelPerfect: true
        });
        this.consumption.on('pointerover', () => {
            this.consumption.setTint(0xdddddd);
        });

        this.offense.on('pointerout', () => {
            this.offense.clearTint();
        });
        this.defense.on('pointerout', () => {
            this.defense.clearTint();
        });
        this.finance.on('pointerout', () => {
            this.finance.clearTint();
        });
        this.consumption.on('pointerout', () => {
            this.consumption.clearTint();
        });

        this.desk = this.add.image(game.config.width / 2, game.config.height * 0.7, "desk").setScale(2, 0.9);

        this.bob = 0;

        this.offense.on('pointerdown', () => {
            this.offense.locked = true;
        });

        this.defense.on('pointerdown', () => {
            this.defense.locked = true;
        });

        this.finance.on('pointerdown', () => {
            this.finance.locked = true;
        });

        this.consumption.on('pointerdown', () => {
            this.consumption.locked = true;
        });

        this.add.text(config.width * 0.8, config.height * 0.1, "Turn: " + this.ScoreMatrix.getTurn(), {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 }});

            this.add.text(config.width * 0.05, config.height * 0.05, `This turn, the budget has been spent on:\nConsumption: ${this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn()-1, 1)}%\nInvestment: ${this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn()-1, 1)}%\nDefense: ${this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn()-1, 1)}%\nOffense: ${this.ScoreMatrix.getMatrixEntry(3, this.ScoreMatrix.getTurn()-1, 1)}%`, {
                fontSize: '16px',
                fill: '#ffffff',
                align: 'center',
                backgroundColor: '#000000',
                padding: { x: 20, y: 20 }});

        this.turnButton = this.add.image(game.config.width * 0.5, game.config.height * 0.95, "turnButton").setScale(1, 0.5).setInteractive();
        this.turnButton.on('pointerdown', () => {
            if (this.ScoreMatrix.getTurnBudget() != 0) {
                this.showPopup(`Not all money has been spent!\nThe turn will not end until all money has been allocated.\nCurrently, the budget is allocated as follows:\nConsumption: ${this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn()-1, 1)}\nInvestment: ${this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn()-1, 1)}\nDefense: ${this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn()-1, 1)}\nOffense:${this.ScoreMatrix.getMatrixEntry(3, this.ScoreMatrix.getTurn()-1, 1)}\n`);
            } else {
                this.scene.start("turnScene");
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('menuScene');
        });

        this.warButton = this.add.image(game.config.width * 0.7, game.config.height * 0.95, "warButton").setScale(1, 0.5).setInteractive();
        this.warButton.on('pointerdown', () => {
            this.scene.start("warScene");
        });

        // this.reviewButton = this.add.image(game.config.width * 0.9, game.config.height * 0.1, "reviewButton").setScale(1).setInteractive();
        // this.reviewButton.on('pointerdown', () => {
        //     this.scene.start("reviewScene");
        // });
    }

    update() {
        this.bob++;
        this.bobUpdate();

        if (this.defense.locked) {
            this.defense.x -= 20;
            this.defense.y = this.game.config.height * 0.7;
            if (this.defense.x < -200) {
                this.scene.start("defenseScene");
            }

        }
        if (this.offense.locked) {
            this.offense.x -= 20;
            this.offense.y = this.game.config.height * 0.7;
            if (this.offense.x < -200) {
                this.scene.start("offenseScene");
            }
        }
        if (this.finance.locked) {
            this.finance.x += 20;
            this.finance.y = this.game.config.height * 0.7;
            if (this.finance.x > config.width + 200) {
                this.scene.start("financeScene");
            }
        }
        if (this.consumption.locked) {
            this.consumption.x += 20;
            this.consumption.y = this.game.config.height * 0.7;
            if (this.consumption.x > config.width + 200) {
                this.scene.start("consumptionScene");
            }
        }
    }

    bobUpdate() {
        if (this.bob % 45 === 0 && !this.defense.down && !this.defense.locked) {
            this.defense.y += 25;
            this.defense.down = true;
        }
        else if (this.bob % 45 === 0 && this.defense.down) {
            this.defense.y -= 25;
            this.defense.down = false;
        }

        if (this.bob % 20 === 0 && !this.offense.down && !this.offense.locked) {
            this.offense.y += 25;
            this.offense.down = true;
        }
        else if (this.bob % 20 === 0 && this.offense.down) {
            this.offense.y -= 25;
            this.offense.down = false;
        }

        if (this.bob % 60 === 0 && !this.finance.down && !this.finance.locked) {
            this.finance.y += 25;
            this.finance.down = true;
        }
        else if (this.bob % 60 === 0 && this.finance.down) {
            this.finance.y -= 25;
            this.finance.down = false;
        }

        if (this.bob % 35 === 0 && !this.consumption.down && !this.consumption.locked) {
            this.consumption.y += 25;
            this.consumption.down = true;
        }
        else if (this.bob % 35 === 0 && this.consumption.down) {
            this.consumption.y -= 25;
            this.consumption.down = false;
        }
    }

    
    showPopup(message) {
        let popup = this.add.text(game.config.width / 2, game.config.height / 2, message, {
            fontSize: '24px',
            fill: '#fff',
            align: 'center',
            backgroundColor: '#000',
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5);
        
        this.time.delayedCall(8000, () => {
            popup.destroy();
        });
    }
}