class Consumption extends Phaser.Scene {
    constructor() {
        super('consumptionScene');
    }

    create() {
        this.clicked = false;
        this.turnPercent = 0;
        this.vibeSpeed = 50;
        this.add.graphics();
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        let width = this.scale.width;
        let height = this.scale.height;

        if (this.textures.exists('gradientBG')) {
            this.textures.remove('gradientBG');
        }
        
        let gradient = this.textures.createCanvas('gradientBG', width, height);
        let ctx = gradient.getSourceImage().getContext('2d');
        
        let grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, '#FFF9C4');
        grd.addColorStop(1, '#FFD700');
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        
        gradient.refresh();
        

        this.add.image(0, 0, 'gradientBG').setOrigin(0, 0);
        this.minister = this.add.image(config.width * 0.25, config.height * 0.6, 'deputy').setScale(1.5).setInteractive();
        this.frames = 0;
        this.minDown = false;

        let dialogWidth = width * 0.5;
        let dialogHeight = height * 0.4;
        let dialogX = width - dialogWidth - 20;
        let dialogY = height - dialogHeight - 20;
        let padding = 10;

        let graphics = this.add.graphics();

        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(dialogX - padding, dialogY - padding, dialogWidth + padding * 2, dialogHeight + padding * 2);
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

        this.promptText = this.add.text(dialogX + 15, dialogY + 15, "Enter the percentage of this turn's budget you wish to allocate to offensive capabilities.\n\nClick your Deputy Prime Minister to see what he has to say.", {
            fontFamily: 'Courier, monospace',
            fontSize: '24px',
            color: '#ffffff',
            wordWrap: { width: dialogWidth - 30 }
        });


        // Minister's Speech Bubble
        let bubbleWidth = 600;
        let bubbleHeight = 200;
        let bubbleX = this.minister.x + 200;
        let bubbleY = this.minister.y - 400;

        let bubbleGraphics = this.add.graphics();
        bubbleGraphics.fillStyle(0xffffff, 1);
        bubbleGraphics.fillRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
        bubbleGraphics.fillTriangle(
            bubbleX + 50, bubbleY + bubbleHeight,
            bubbleX + 125, bubbleY + bubbleHeight,
            this.minister.x + 150, this.minister.y - 100
        );
        bubbleGraphics.setVisible(false);

        this.dialogText = this.add.text(bubbleX + 20, bubbleY + 20, "text test", {
            fontFamily: 'Courier, monospace',
            fontSize: '28px',
            align: "center",
            color: '#000000',
            wordWrap: { width: dialogWidth * 0.9 - 30 }

        });

        this.dialogText.setVisible(false);

        // Number Input Box
        let inputBoxWidth = dialogWidth - 30;
        let inputBoxHeight = 40;
        let inputBoxX = dialogX + 15;
        let inputBoxY = dialogY + dialogHeight - 60;

        let inputGraphics = this.add.graphics();
        inputGraphics.fillStyle(0xffffff, 1);
        inputGraphics.fillRect(inputBoxX, inputBoxY, inputBoxWidth, inputBoxHeight);

        let inputText = this.add.text(inputBoxX + 10, inputBoxY + 10, "", {
            fontFamily: 'Courier, monospace',
            fontSize: '18px',
            color: '#000000'
        });

        let locked = false;
        this.input.keyboard.on('keydown', (event) => {
            if (!locked) {
                if (event.key >= '0' && event.key <= '9') {
                    inputText.setText(inputText.text + event.key);
                } else if (event.key === 'Backspace') {
                    inputText.setText(inputText.text.slice(0, -1));
                }
                if (event.key === 'Enter') {
                    if(this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn()-1, 1) != 0)
                    {
                        this.ScoreMatrix.restoreTurnBudget(this.ScoreMatrix.getMatrixEntry(0, this.ScoreMatrix.getTurn()-1, 1));
                    }
                    this.clicked = true;
                    locked = true;
                    bubbleGraphics.visible = true;
                    this.dialogText.setVisible(true);
                    let newText = "";
                    let budgetPercent = parseInt(inputText.text.replace(/[|%]/g, ''), 10);

                    if (budgetPercent <= 10 && this.ScoreMatrix.getTurnBudget() > this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        newText = "Surely this is a mistake? A typographical error?!";
                        this.vibeSpeed *= 1.2;
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 30 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 1;
                        newText = "Prime Minister, the public will notice how much you spent on them - and how much you didn't!";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 70 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.8;
                        newText = "That'll definitely get the media's attention and boost your popularity!";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 90 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.6;
                        newText = `I can see it now - "Hero of the Common Man!" with a big and flattering picture of you on the front page. Good choice!`;
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 100 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.1;
                        newText = "I don't even know what to do with so much- actually, nevermind, I'll think of something. Thank you, Prime Minister!";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(0, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else {
                        this.clicked = false;
                        locked = false;
                        newText = "Between you and me, I think this is fine. The public, however, really doesn't like deficits. Try again."
                    }
                    this.startTypewriterEffect(newText);
                    console.log(this.ScoreMatrix);
                    console.log(this.ScoreMatrix.getTurnBudget());
                }
            }
        });


        this.dialogOptions = [
            `Congratulations, Prime Minister! Now, I know other things matter too, but remember - you were elected to give the people what they want. What do they want, you ask? Give me the funding, and I'll figure it out.`,
            `Prime Minister! Glad to see a scandal hasn't wiped your career out yet. Just remember that you still have a public to make happy, and that the bureaucrats who make them happy aren't cheap.`,
            `We're trialing a new program - everyone who is unemployed will receive a subsidy they can live off of until they find a job. I hear it'll be popular!`,
            `Turns out popularity is expensive, if you catch my drift Prime Minister.`,
            `Your polls are doing just fantastic, Prime Minister!\nBut you know what would make them even better?`,
            `Prime Minister, things are starting to get a bit dicey. I hear word that Badland is actually HAPPIER than we are as a whole than us. We need to show them who can throw more money at their citizens!`, // Sadland!
            `Ha! The opposition is calling our spending "reckless!" Don't worry - that just means that they're worried about their election chances.`,
            `Alright... election season is coming up soon. If there's anything more you're going to do to secure votes, I'd start doing it now.`,
            `Prime Minister, please - we really need a show of how invested the government is in its citizens right now. What if Badland is doing it better?`,
            `Good luck at the polls, Prime Minister. We've got your back. Perhaps one last round of consumption spending to really maximize your chances at victory?`
        ];

        this.minister.on('pointerdown', () => {
            bubbleGraphics.setVisible(true);
            this.dialogText.setVisible(true);
            if (!this.clicked) {
                let newText = this.dialogOptions[this.ScoreMatrix.getTurn() - 1];
                this.startTypewriterEffect(newText);
                this.clicked = true;
            }
        });

        let backButton = this.add.text(50, 50, 'BACK', {
            fontSize: '32px',
            fontFamily: 'Courier, monospace',
            color: '#FF0000',
            backgroundColor: '#DDDDDD',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('playScene');
        });
    }

    update() {
        this.frames++;
        this.vibeCheck(this.frames, this.vibeSpeed);
    }

    startTypewriterEffect(text) {
        this.currentText = text;
        this.typingIndex = 0;
        this.dialogText.setText("");
        this.typing = true;

        this.time.addEvent({
            delay: 50,
            repeat: text.length - 1,
            callback: () => {
                this.dialogText.setText(this.dialogText.text + text[this.typingIndex]);
                this.typingIndex++;
            }
        });
    }

    vibeCheck(frames, rate) {
        if (frames % rate == 0 && !this.minDown) {
            this.minister.y += 30;
            this.minDown = true;
        }
        else if (frames % rate == 0 && this.minDown) {
            this.minister.y -= 30;
            this.minDown = false;
        }
    }
}