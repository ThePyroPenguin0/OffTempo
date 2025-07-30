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
            if (this.ScoreMatrix.getTurnBudget() > 1) { // Temporary fix to allow game progression
                this.showPopup(`Not all money has been spent!\nThe turn will not end until all money has been allocated.\nCurrently, the budget is allocated as follows:\nConsumption: ${this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn() - 1, 1)}\nInvestment: ${this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn() - 1, 1)}\nDefense: ${this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1)}\nOffense:${this.ScoreMatrix.getMatrixEntry(3, this.ScoreMatrix.getTurn() - 1, 1)}\n`);
                console.log(`Turn budget remaining: $${this.ScoreMatrix.getTurnBudget()}`);
            } else {
                this.scene.start("turnScene");
            }
        });

        this.turnButton.on('pointerover', () => {
            this.turnButton.setTint(0xdddddd);
        });
        this.turnButton.on('pointerout', () => {
            this.turnButton.clearTint();
        });

        this.warButton = this.add.image(game.config.width * 0.7, game.config.height * 0.95, "warButton").setScale(1, 0.5).setInteractive();
        this.warButton.on('pointerdown', () => {
            this.scene.start("warScene");
        });

        this.warButton.on('pointerover', () => {
            this.warButton.setTint(0xdddddd);
        });
        this.warButton.on('pointerout', () => {
            this.warButton.clearTint();
        });

        this.reportButton = this.add.image(game.config.width * 0.3, game.config.height * 0.95, "reportButton").setScale(1, 0.5).setInteractive();
        this.reportButton.on('pointerdown', () => {
            this.scene.start("reportScene");
        });

        this.reportButton.on('pointerover', () => {
            this.reportButton.setTint(0xdddddd);
        });
        this.reportButton.on('pointerout', () => {
            this.reportButton.clearTint();
        });

        this.exitButton = this.add.image(game.config.width * 0.95, game.config.height * 0.075, "exitButton").setScale(0.5, 0.5).setInteractive();
        this.exitButton.on('pointerdown', () => {
            this.ScoreMatrix.resetMatrix();
            this.scene.start('menuScene');
        });

    this.exitButton.on('pointerover', () => {
        this.exitButton.setTint(0xdddddd);
    });
    this.exitButton.on('pointerout', () => {
        this.exitButton.clearTint();
    });

        this.rulebook = this.add.image(game.config.width * 0.95, game.config.height * 0.15, "book").setScale(1).setInteractive();
        this.rulebook.on('pointerdown', () => {
            this.scene.start('guideScene', {ingame: true});
        });

    this.rulebook.on('pointerover', () => {
        this.rulebook.setTint(0xdddddd);
    });
    this.rulebook.on('pointerout', () => {
        this.rulebook.clearTint();
    });

        this.lastDefenseBob = 0;
        this.lastOffenseBob = 0;
        this.lastFinanceBob = 0;
        this.lastConsumptionBob = 0;
    }

    update(time, delta) {
        this.bobUpdate(time, delta);

        const defenseSpeed = 500;
        const offenseSpeed = 400;
        const financeSpeed = 300;
        const consumptionSpeed = 400;

        if (!this.defense.moveElapsed) this.defense.moveElapsed = 0;
        if (!this.offense.moveElapsed) this.offense.moveElapsed = 0;
        if (!this.finance.moveElapsed) this.finance.moveElapsed = 0;
        if (!this.consumption.moveElapsed) this.consumption.moveElapsed = 0;

        const moveStepMs = 16;
        const defenseStep = defenseSpeed * (moveStepMs / 1000);
        const offenseStep = offenseSpeed * (moveStepMs / 1000);
        const financeStep = financeSpeed * (moveStepMs / 1000);
        const consumptionStep = consumptionSpeed * (moveStepMs / 1000);

        if (this.defense.locked) {
            this.defense.moveElapsed += delta;
            while (this.defense.moveElapsed >= moveStepMs) {
                this.defense.x -= defenseStep;
                this.defense.moveElapsed -= moveStepMs;
            }
            this.defense.y = this.game.config.height * 0.7;
            if (this.defense.x < -200) {
                this.scene.start("defenseScene");
            }
        }
        if (this.offense.locked) {
            this.offense.moveElapsed += delta;
            while (this.offense.moveElapsed >= moveStepMs) {
                this.offense.x -= offenseStep;
                this.offense.moveElapsed -= moveStepMs;
            }
            this.offense.y = this.game.config.height * 0.7;
            if (this.offense.x < -200) {
                this.scene.start("offenseScene");
            }
        }
        if (this.finance.locked) {
            this.finance.moveElapsed += delta;
            while (this.finance.moveElapsed >= moveStepMs) {
                this.finance.x += financeStep;
                this.finance.moveElapsed -= moveStepMs;
            }
            this.finance.y = this.game.config.height * 0.7;
            if (this.finance.x > config.width + 200) {
                this.scene.start("financeScene");
            }
        }
        if (this.consumption.locked) {
            this.consumption.moveElapsed += delta;
            while (this.consumption.moveElapsed >= moveStepMs) {
                this.consumption.x += consumptionStep;
                this.consumption.moveElapsed -= moveStepMs;
            }
            this.consumption.y = this.game.config.height * 0.7;
            if (this.consumption.x > config.width + 200) {
                this.scene.start("consumptionScene");
            }
        }
    }

    bobUpdate(time, delta) {
        const defenseInterval = 500;
        const offenseInterval = 575;
        const financeInterval = 900;
        const consumptionInterval = 750;
        const bobAmount = 10;

        function discreteBob(baseY, time, interval, amount) {
            return baseY + (Math.floor(time / interval) % 2 === 0 ? amount : -amount);
        }

        if (!this.defense.locked) {
            this.defense.y = discreteBob(this.game.config.height * 0.6, time, defenseInterval, bobAmount);
        }
        if (!this.offense.locked) {
            this.offense.y = discreteBob(this.game.config.height * 0.7, time, offenseInterval, bobAmount);
        }
        if (!this.finance.locked) {
            this.finance.y = discreteBob(this.game.config.height * 0.65, time, financeInterval, bobAmount);
        }
        if (!this.consumption.locked) {
            this.consumption.y = discreteBob(this.game.config.height * 0.7, time, consumptionInterval, bobAmount);
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