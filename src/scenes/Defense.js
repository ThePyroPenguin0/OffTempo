class Defense extends Phaser.Scene {
    constructor() {
        super('defenseScene');
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
        grd.addColorStop(0, '#ADD8E6');
        grd.addColorStop(1, '#00008B');  
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        
        gradient.refresh();


        this.add.image(0, 0, 'gradientBG').setOrigin(0, 0);
        this.minister = this.add.image(config.width * 0.25, config.height * 0.6, 'defense').setScale(1.5).setInteractive();
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

        this.promptText = this.add.text(dialogX + 15, dialogY + 15, "Enter the percentage of this turn's budget you wish to allocate to offensive capabilities.\n\nClick the Defense Minister to see what he has to say.", {
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
                    if (this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1) != 0) {
                        this.ScoreMatrix.restoreTurnBudget(this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1));
                    }
                    this.clicked = true;
                    locked = true;
                    bubbleGraphics.visible = true;
                    this.dialogText.setVisible(true);
                    let newText = "";
                    let budgetPercent = parseInt(inputText.text.replace(/[|%]/g, ''), 10);

                    if (budgetPercent <= 10 && this.ScoreMatrix.getTurnBudget() > this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        newText = "We're doomed.";
                        this.vibeSpeed *= 1.2;
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 30 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 1;
                        newText = "Sir, I must urge you - reconsider! It doesn't matter how popular or rich you are if we're dead!";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 70 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.8;
                        newText = "Alright. It'll be a stretch, but we can make it work, sir.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 90 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.6;
                        newText = "Excellent, sir! I assure you we will keep you extra safe with this much to work with.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 100 && this.ScoreMatrix.getTurnBudget() >= this.ScoreMatrix.getBudgetAbsolute(budgetPercent)) {
                        this.vibeSpeed *= 0.1;
                        newText = "Thank you, sir! I promise you this much money will keep us all safe.\nFor now, anyway.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else {
                        this.clicked = false;
                        locked = false;
                        newText = "I'd love to, but I can't pay our soldiers in IOUs. Try again."
                    }
                    this.startTypewriterEffect(newText);
                    console.log(this.ScoreMatrix);
                    console.log(this.ScoreMatrix.getTurnBudget());
                }
            }
        });


        this.dialogOptions = [
            "Sir! I can't stress how important this is! I need AT LEAST half of the budget to make sure we even survive your transition into office!",
            "Okay, so we survived the first few weeks... But we could still get attacked at any moment! I need more money, sir!",
            "Sir, Badland could be ready to launch an attack any second now! Or now! Maybe now? You never know with them.",
            "I've got an idea, sir. I need a bit of the budget to develop chaff that can be used to confuse enemy ballistic missiles.",
            `We've been working on a new infantry rifle for our troops. We call it\n"The Killamajig."`,
            `"If you want peace, nine millimeter..?"\nWho wrote this!?`,
            "I know things look peaceful now, sir, but that could change at any moment. Don't forget to fund defense!",
            "Things are looking quiet and boring. Just the way I like them, sir.\nBut that could change!",
            "We have reports that Badland is developing an anti-missile-missile. I propose we fund the creation of an anti-anti-missile-missile-missile.",
            "We made it, sir! We survived! Finally I can go get some sleep."
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