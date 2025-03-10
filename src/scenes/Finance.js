class Finance extends Phaser.Scene {
    constructor() {
        super('financeScene');
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
        grd.addColorStop(0, '#FFA8A8');
        grd.addColorStop(1, '#800000');
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        
        gradient.refresh();



        this.add.image(0, 0, 'gradientBG').setOrigin(0, 0);
        this.minister = this.add.image(config.width * 0.25, config.height * 0.6, 'banker').setScale(1.5).setInteractive();
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

        this.promptText = this.add.text(dialogX + 15, dialogY + 15, "Enter the percentage of this turn's budget you wish to allocate to offensive capabilities.\n\nClick the Finance Minister to see what he has to say.", {
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
                    if (this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn() - 1, 1) != 0) {
                        this.ScoreMatrix.restoreTurnBudget(this.ScoreMatrix.getMatrixEntry(1, this.ScoreMatrix.getTurn() - 1, 1));
                    }
                    this.clicked = true;
                    locked = true;
                    bubbleGraphics.visible = true;
                    this.dialogText.setVisible(true);
                    let newText = "";
                    let budgetPercent = parseInt(inputText.text.replace(/[|%]/g, ''), 10);
                    if (budgetPercent <= 10 && this.ScoreMatrix.getTurnBudget() > this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        newText = "Respectfully... sir... how do you expect to buy anything else when you have so little money to buy with?";
                        this.vibeSpeed *= 1.2;
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 30 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 1;
                        newText = "Are you sure, sir? Do try not to forget about the importance of a healthy economy...";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 70 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.8;
                        newText = "Ah, yes. A perfectly... acceptable sum.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 90 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.6;
                        newText = "Oh, yes sir! We'll be sure to put this to good use so you can put it to good use later.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 100 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.1;
                        newText = "I... Thank you, sir. We'll be extra careful not to get scammed this year.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(1, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else {
                        this.clicked = false;
                        locked = false;
                        newText = "Sir, it is to my great dismay I must inform you that deficit spending was outlawed after the Austrians took over. We are still working on getting that repealed. In the meantime, try again."
                    }
                    this.startTypewriterEffect(newText);
                    console.log(this.ScoreMatrix);
                    console.log(this.ScoreMatrix.getTurnBudget());
                }
            }
        });


        this.dialogOptions = [
            "Sir, I must advise you to give ALL of the budget to me- er, my department. The earlier we get started, the more of everything else we will be able to buy later.",
            "You think you have a lot of money now? Give me some more and see what happens.",
            "Recession? Sir, don't be silly. They're bad, unhelpful, and not fun. Why would we have them?",
            "There was a guy earlier who was demanding one billion dollars in exchange for sparing our country from his doomsday weapon. Could you factor that into the budget, sir?",
            "The economy is chugging along just fine, sir. But you know what would get it chugging a little faster?",
            `"Is there such a thing as too much money?" Sir... are you alright?`,
            "Some guy from Admin Affairs is asking for transparency about what we do with our money. Do you want to tell him or should I?",
            "You know, in Badland, one pound of flesh costs nearly five pounds? That's fine, but pounds of what?",
            `"Military Industrial Complex?" I don't know, seems pretty simple to me...`,
            "It's been my pleasure, sir. Any chance I could ask you to invest a bit more before you go..?"
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