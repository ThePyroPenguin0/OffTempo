class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        this.background = this.add.image(0, 0, "background").setOrigin(0);

        this.posLock = false;

        this.finance = this.add.image(game.config.width * 0.6, game.config.height * 0.65, "banker");
        this.finance.down = false;
        this.defense = this.add.image(game.config.width * 0.4, game.config.height * 0.6, "defense");
        this.defense.down = false;
        this.offense = this.add.image(game.config.width * 0.25, game.config.height * 0.7, "jingo");
        this.offense.down = false;
        this.consumption = this.add.image(game.config.width * 0.75, game.config.height * 0.7, "deputy");
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

        this.desk = this.add.image(game.config.width / 2, game.config.height * 0.71, "desk").setScale(2, 0.9);

        this.bob = 0;
        this.lastBobUpdate = 0; // Track last bob update time

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
            padding: { x: 20, y: 20 }
        });

        this.add.text(config.width * 0.05, config.height * 0.05, `This turn, the budget has been spent on:\nConsumption: ${this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn() - 1, 1)}%\nInvestment: ${this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn() - 1, 1)}%\nDefense: ${this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1)}%\nOffense: ${this.ScoreMatrix.getMatrixEntry(3, this.ScoreMatrix.getTurn() - 1, 1)}%\nTurn budget remaining: $${this.ScoreMatrix.getTurnBudget()}\nTurn budget percent remaining: ${this.ScoreMatrix.getTurnBudgetPercent()}%`, {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 }
        });

        this.turnButton = this.add.image(game.config.width * 0.5, game.config.height * 0.95, "turnButton").setScale(1, 0.5).setInteractive();
        this.turnButton.on('pointerdown', () => {
            if (this.ScoreMatrix.getTurnBudget() != 0) {
                this.showPopup(`Not all money has been spent!\nThe turn will not end until all money has been allocated.\nCurrently, the budget is allocated as follows:\nConsumption: ${this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn() - 1, 1)}\nInvestment: ${this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn() - 1, 1)}\nDefense: ${this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1)}\nOffense:${this.ScoreMatrix.getMatrixEntry(3, this.ScoreMatrix.getTurn() - 1, 1)}\n`);
            } else {
                this.scene.start("turnScene");
            }
        });

        this.warButton = this.add.image(game.config.width * 0.7, game.config.height * 0.95, "warButton").setScale(1, 0.5).setInteractive();
        this.warButton.on('pointerdown', () => {
            this.scene.start("warScene");
        });

        this.reportButton = this.add.image(game.config.width * 0.3, game.config.height * 0.95, "reportButton").setScale(1, 0.5).setInteractive();
        this.reportButton.on('pointerdown', () => {
            this.scene.start("reportScene");
        });

        this.exitButton = this.add.image(game.config.width * 0.95, game.config.height * 0.075, "exitButton").setScale(0.5, 0.5).setInteractive();
        this.exitButton.on('pointerdown', () => {
            this.ScoreMatrix.resetMatrix();
            this.scene.start('menuScene');
        });

        this.rulebook = this.add.image(game.config.width * 0.95, game.config.height * 0.15, "book").setScale(1).setInteractive();
        this.rulebook.on('pointerdown', () => {
            this.scene.start('guideScene', {ingame: true});
        });

        this.lastDefenseBob = 0;
        this.lastOffenseBob = 0;
        this.lastFinanceBob = 0;
        this.lastConsumptionBob = 0;
    }

    update(time, delta) {
        this.bob++;
        this.bobUpdate(time);

        if (this.defense.locked) {
            this.defense.x -= 7;
            this.defense.y = this.game.config.height * 0.7;
            if (this.defense.x < -200) {
                this.scene.start("defenseScene");
            }

        }
        if (this.offense.locked) {
            this.offense.x -= 5;
            this.offense.y = this.game.config.height * 0.7;
            if (this.offense.x < -200) {
                this.scene.start("offenseScene");
            }
        }
        if (this.finance.locked) {
            this.finance.x += 3;
            this.finance.y = this.game.config.height * 0.7;
            if (this.finance.x > config.width + 200) {
                this.scene.start("financeScene");
            }
        }
        if (this.consumption.locked) {
            this.consumption.x += 5;
            this.consumption.y = this.game.config.height * 0.7;
            if (this.consumption.x > config.width + 200) {
                this.scene.start("consumptionScene");
            }
        }
    }

    bobUpdate(time) {
        if (!this.lastDefenseBob || time - this.lastDefenseBob >= 500) {
            this.lastDefenseBob = time;
            if (!this.defense.down && !this.defense.locked) {
                this.defense.y += 25;
                this.defense.down = true;
            } else if (this.defense.down) {
                this.defense.y -= 25;
                this.defense.down = false;
            }
        }

        if (!this.lastOffenseBob || time - this.lastOffenseBob >= 575) {
            this.lastOffenseBob = time;
            if (!this.offense.down && !this.offense.locked) {
                this.offense.y += 25;
                this.offense.down = true;
            } else if (this.offense.down) {
                this.offense.y -= 25;
                this.offense.down = false;
            }
        }

        if (!this.lastFinanceBob || time - this.lastFinanceBob >= 900) {
            this.lastFinanceBob = time;
            if (!this.finance.down && !this.finance.locked) {
                this.finance.y += 25;
                this.finance.down = true;
            } else if (this.finance.down) {
                this.finance.y -= 25;
                this.finance.down = false;
            }
        }

        if (!this.lastConsumptionBob || time - this.lastConsumptionBob >= 750) {
            this.lastConsumptionBob = time;
            if (!this.consumption.down && !this.consumption.locked) {
                this.consumption.y += 25;
                this.consumption.down = true;
            } else if (this.consumption.down) {
                this.consumption.y -= 25;
                this.consumption.down = false;
            }
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