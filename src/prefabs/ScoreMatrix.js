class ScoreMatrix extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        // Add a fifth resource for Budget
        this.matrix = Array.from({ length: 5 }, () =>
            Array.from({ length: 10 }, () => [0, 0])
        );
        this.turn = 1;
        this.budget = 100.00;
        this.turnBudget = this.budget; // this.turnBudget -= this.budget * percetnage allocated
        this.turnCodes = [145, 682, 185, 158, 973, 170, 709, 742, 288, 108];
        this.consumptionThreshold = 0;
        this.totalOffense = 0;
        this.totalDefense = 0;
    }

    updateMatrix(resource, turn, bud, value) {
        if (resource < 5 && turn < 10 && bud < 2) {
            // bud==0: absolute budget, round to two decimals; bud==1: percent, round to nearest whole
            if (bud === 0) {
                this.matrix[resource][turn][bud] = Math.round(value * 100) / 100;
            } else if (bud === 1) {
                this.matrix[resource][turn][bud] = Math.round(value);
            } else {
                this.matrix[resource][turn][bud] = value;
            }
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
        this.budget = Math.round(this.budget * 100) / 100;
        this.turnBudget = this.budget;
        this.matrix[4][turn][0] = this.budget;
        this.matrix[4][turn][1] = 0;
        console.log(`Updated budget: ${this.budget} (added ${this.getMatrixEntry(1, turn - 1, 0)})`)
    }

    getTurnBudget() {
        return Math.round(this.turnBudget);
    }

    getBudgetAbsolute(percent) {
        // return Math.round(((percent / 100) * this.budget) * 10) / 10;
        return (percent / 100) * this.budget;

    }

    getTurnBudgetPercent() {
        return Math.round((this.turnBudget / this.budget) * 100);
    }

    subtTurnBudget(percent) {
        let subt = Math.round((this.budget * (percent / 100)) * 10) / 10;
        this.turnBudget = Math.round((this.turnBudget - subt) * 10) / 10;
    }

    restoreTurnBudget(percent) {
        console.log(`Restoring turn budget with percent: ${percent}`);
        let add = Math.round((this.budget * (percent / 100)) * 10) / 10;
        this.turnBudget = Math.round((this.turnBudget + add) * 10) / 10;
        console.log(`Turn budget after restoration: ${this.turnBudget}`);
    }

    getMatrixEntry(resource, turn, bud) {
        // Return with correct rounding: absolute budget to two decimals, percent to whole number
        if (bud === 0) {
            return Math.round(this.matrix[resource][turn][bud] * 100) / 100;
        } else if (bud === 1) {
            return Math.round(this.matrix[resource][turn][bud]);
        }
    }

    advanceTurn() {
        this.turn++;
        return;
    }

    getTurnCode() {
        return this.turnCodes[this.turn - 1];
    }

    displayMatrix(scene) {
        this.updateMatrix(4, 0, 0, 100);
        const matrix = this.getMatrix();
        const matrixWidth = 5;
        const matrixHeight = 10;
        const totalMatrixWidth = matrixWidth * 150 + (matrixWidth - 1) * 2;
        const startX = (scene.sys.game.config.width / 2) - (totalMatrixWidth / 2);
        const startY = 100;
        const entryWidth = 150;
        const entryHeight = 50;
        const lineWidth = 2;
        const labelOffset = 125;
        const headerY = startY - 30;

        const resourceNames = ['Consumption', 'Investment', 'Defense', 'Offense', 'Turn Budget'];
        let totals = [0, 0, 0, 0, 0];

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
                let displayValue;
                if (row === 4) {
                    displayValue = `$${value[0]}`;
                } else {
                    displayValue = `${value[0]}, (${value[1]}%)`;
                }
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

    setBudgetForTurn(turn) {
        if (turn >= 0 && turn < 10) {
            this.matrix[4][turn][0] = Math.round(this.budget * 100) / 100;
            this.matrix[4][turn][1] = 0; // Percent column is not used for Budget. Do not change.
        }
    }

    consumptionUpdate() {
        this.consumptionThreshold += this.getMatrixEntry(0, this.getTurn() - 1, 0);
        // console.log(`Running consumption total: ${this.consumptionThreshold}`)
        return this.consumptionThreshold;
    }

    defenseUpdate() {
        console.log(`Defense update for turn ${this.getTurn()}: +${this.getMatrixEntry(2, this.getTurn() - 1, 0)}`);
        this.totalDefense += this.getMatrixEntry(2, this.getTurn() - 1, 0);
        console.log(`Running defense total: ${this.totalDefense}`);
    }

    offenseUpdate() {
        console.log(`Offense update for turn ${this.getTurn()}: +${this.getMatrixEntry(3, this.getTurn() - 1, 0)}`);
        this.totalOffense += this.getMatrixEntry(3, this.getTurn() - 1, 0);
        console.log(`Running offense total: ${this.totalOffense}`);
    }

    sumRow(resource) {
        return this.matrix[resource].reduce((sum, entry) => sum + entry[0], 0);
    }

    resetMatrix() {
        this.matrix = Array.from({ length: 5 }, () =>
            Array.from({ length: 10 }, () => [0, 0])
        );
        this.turn = 1;
        this.budget = 100.00;
        this.turnBudget = this.budget;
        this.consumptionThreshold = 0;
        this.totalDefense = 0;
        this.totalOffense = 0;
    }

    getMatrixAsText() {
        const resourceNames = ['Consumption', 'Investment', 'Defense', 'Offense', 'Budget'];
        // Header: For budget, only absolute column
        let header = ['Turn'];
        for (let i = 0; i < 4; i++) {
            header.push(`${resourceNames[i]} spending (absolute)`, `${resourceNames[i]} spending (percentage of turn budget)`);
        }
        header.push('Turn budget');
        let lines = [header.join(',')];

        for (let turn = 0; turn < 10; turn++) {
            let row = [`${turn + 1}`];
            for (let res = 0; res < 4; res++) {
                row.push(this.matrix[res][turn][0]);
                row.push(this.matrix[res][turn][1]);
            }
            // Only absolute value for Budget
            row.push(this.matrix[4][turn][0]);
            lines.push(row.join(','));
        }
        return lines.join('\n');
    }

}

window.ScoreMatrix = ScoreMatrix;