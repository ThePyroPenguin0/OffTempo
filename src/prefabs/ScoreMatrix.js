class ScoreMatrix extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        this.matrix = Array.from({ length: 4 }, () =>
            Array.from({ length: 10 }, () => [0, 0])
        );
        this.turn = 1;
        this.budget = 100;
        this.turnBudget = this.budget; // this.turnBudget -= this.budget * percetnage allocated
        this.turnCodes = [145, 682, 185, 158, 973, 170, 709, 742, 288, 108];
        this.consumptionThreshold = 0;
    }

    updateMatrix(resource, turn, bud, value) {
        if (resource < 4 && turn < 10 && bud < 2) {
            this.matrix[resource][turn][bud] = value;
        }
        // Rows: Resources
        // Columns: Turn
        // Z Axis: 0 for absolute amount invested, 1 for percentage of budget
    }

    getMatrix() {
        return this.matrix;
    }

    nextTurn() {
        this.turn++;
    }

    getTurn() {
        return this.turn;
    }

    getBudget() {
        return this.budget;
    }

    updateBudget(turn) {
        console.log(`Old budget: ${this.budget}`);
        this.budget += this.getMatrixEntry(1, turn - 1, 0);
        this.turnBudget = this.budget;
        console.log(`Updated budget: ${this.budget} (added ${this.getMatrixEntry(1, turn - 1, 0)})`)
    }

    getTurnBudget() {
        return this.turnBudget;
    }

    getBudgetAbsolute(percent) {
        return (percent / 100) * this.budget;
    }

    subtTurnBudget(percent) {
        let subt = this.budget * (percent / 100);
        this.turnBudget -= subt;
    }

    restoreTurnBudget(percent) {
        let add = this.budget * (percent / 100);
        this.turnBudget += add;
    }


    getMatrixEntry(resource, turn, bud) {
        return this.matrix[resource][turn][bud];
    }

    advanceTurn() {
        this.turn++;
        return;
    }

    getTurnCode() {
        return this.turnCodes[this.turn - 1];
    }
    displayMatrix(scene) {
        const matrix = this.getMatrix();
        const matrixWidth = 4;
        const matrixHeight = 10;
        const startX = 400;
        const startY = 100;
        const entryWidth = 150;
        const entryHeight = 50;
        const lineWidth = 2;
        const labelOffset = 125;
        const headerY = startY - 30;

        const resourceNames = ['Consumption', 'Investment', 'Defense', 'Offense'];
        let totals = [0, 0, 0, 0];

        for (let row = 0; row < matrixWidth; row++) {
            const xPos = startX + row * (entryWidth + lineWidth);
            scene.add.text(xPos + 5, headerY, resourceNames[row], {
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0);
        }

        for (let col = 0; col < matrixHeight; col++) {
            const rowStart = col;
            const turnNumber = col + 1;
            const turnNumberX = startX - labelOffset;
            const turnNumberY = startY + rowStart * (entryHeight + lineWidth);
            scene.add.text(turnNumberX + entryWidth / 2, turnNumberY + entryHeight / 2, `Turn ${turnNumber}`, {
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            for (let row = 0; row < matrixWidth; row++) {
                const xPos = startX + row * (entryWidth + lineWidth);
                const yPos = startY + rowStart * (entryHeight + lineWidth);
                const value = matrix[row][col];
                const displayValue = `${value[0]}, (${value[1]}%)`;
                totals[row] += value[0];

                scene.add.graphics()
                    .lineStyle(lineWidth, 0xffffff)
                    .strokeRect(xPos, yPos, entryWidth, entryHeight);

                scene.add.text(xPos + entryWidth / 2, yPos + entryHeight / 2, displayValue, {
                    fontSize: '14px',
                    color: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);
            }
        }

        const totalsY = startY + matrixHeight * (entryHeight + lineWidth) + 10;
        for (let row = 0; row < matrixWidth; row++) {
            const xPos = startX + row * (entryWidth + lineWidth);
            scene.add.text(xPos + entryWidth / 2, totalsY, `Total: ${totals[row]}`, {
                fontSize: '12px',
                color: '#ffff00',
                align: 'center'
            }).setOrigin(0.5);
        }
    }

    consumptionUpdate() {
        this.consumptionThreshold += this.getMatrixEntry(0, this.getTurn() - 1, 0);
        console.log(`Running consumption total: ${this.consumptionThreshold}`)
        return this.consumptionThreshold;
    }

    sumRow(resource) {    
        return this.matrix[resource].reduce((sum, entry) => sum + entry[0], 0);
    }
    
    resetMatrix() {
        this.matrix = Array.from({ length: 4 }, () =>
            Array.from({ length: 10 }, () => [0, 0])
        );
    }
    
}

window.ScoreMatrix = ScoreMatrix;