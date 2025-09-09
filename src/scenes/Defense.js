class Defense extends Phaser.Scene {
    constructor() {
        super('defenseScene');
    }

    create() {
        this.clicked = false;
        this.locked = false;
        this.typing = false;
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
        this.minister = this.add.image(config.width * 0.25, config.height * 0.6, 'defense').setScale(1.5).setInteractive({ pixelPerfect: true });
        this.minister.on('pointerover', () => {
            if (!this.clicked) {
                this.minister.setTint(0xdddddd);
                this.sound.play('pop');
            }
        });
        this.minister.on('pointerout', () => {
            this.minister.clearTint();
        });
        this.minister.on('pointerdown', () => {
            if (!this.clicked) {
                this.sound.play('click');
            }
        });
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

        this.promptText = this.add.text(dialogX + 15, dialogY + 15, "Enter the percentage of this turn's budget you wish to allocate to defensive capabilities.\n\nClick the Defense Minister to see what he has to say.\n\nPress (ENTER) to confirm your allocation.\nIf a budget has already been allocated, entering a new value will replace it.", {
            fontFamily: 'Courier, monospace',
            fontSize: '24px',
            color: '#ffffff',
            wordWrap: { width: dialogWidth - 30 }
        });


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

        // Center the dialogText in the speech bubble
        this.dialogText = this.add.text(0, 0, "You should not see this!", {
            fontFamily: 'Courier, monospace',
            fontSize: '28px',
            align: "center",
            color: '#000000',
            wordWrap: { width: bubbleWidth - 40 }
        });
        this.dialogText.setOrigin(0.5, 0.5);
        this.dialogText.setPosition(bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2);

        this.dialogText.setVisible(false);

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
                if (event.key === 'Enter' && !this.typing) {
                    this.clicked = true;
                    locked = true;
                    bubbleGraphics.visible = true;
                    this.dialogText.setVisible(true);
                    let newText = ``;
                    let budgetPercent = parseInt(inputText.text.replace(/[|%]/g, ''), 10);
                    let prevPercent = this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1);
                    if (prevPercent) {
                        this.ScoreMatrix.restoreTurnBudget(prevPercent);
                    }
                    let absToSpend = this.ScoreMatrix.getBudgetAbsolute(budgetPercent);
                    if (budgetPercent > 100 || budgetPercent > this.ScoreMatrix.getTurnBudgetPercent()) {
                        this.vibeSpeed = 50;
                        this.ScoreMatrix.subtTurnBudget(prevPercent);
                        newText = "Our men cannot live on bread alone, but studies show that they still need the bread. That means we need to pay them with real money, and not IOUs. Try again.";
                        this.startTypewriterEffect(newText);
                        let checkTyping = this.time.addEvent({
                            delay: 50,
                            loop: true,
                            callback: () => {
                                if (!this.typing) {
                                    this.clicked = false;
                                    locked = false;
                                    checkTyping.remove();
                                }
                            }
                        });
                        return;
                    }
                    if (this.ScoreMatrix.getBudgetAbsolute(budgetPercent) > this.ScoreMatrix.getTurnBudget()) {
                        absToSpend = Math.floor(this.ScoreMatrix.getTurnBudget());
                        console.warn(`Requested allocation exceeds remaining budget. Allocating the maximum possible ($${absToSpend}) instead.`);
                    }
                    if (budgetPercent <= 10) {
                        this.vibeSpeed = 60;
                        newText = "We're doomed.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, absToSpend);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 30) {
                        this.vibeSpeed = 50;
                        newText = "Sir, I must urge you - reconsider! It doesn't matter how popular or rich you are if we're dead!";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, absToSpend);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 70) {
                        this.vibeSpeed = 40;
                        newText = "Alright. It'll be a stretch, but we can make it work, sir.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, absToSpend);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 90) {
                        this.vibeSpeed = 30;
                        newText = "Excellent, sir! I assure you we will keep you extra safe with this much to work with.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, absToSpend);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else if (budgetPercent <= 100) {
                        this.vibeSpeed = 20;
                        newText = "Thank you, sir! I promise you this much money will keep us all safe.\nFor now, anyway.";
                        this.ScoreMatrix.subtTurnBudget(budgetPercent);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 0, absToSpend);
                        this.ScoreMatrix.updateMatrix(2, this.ScoreMatrix.getTurn() - 1, 1, budgetPercent);
                    }
                    else {
                        this.clicked = false;
                        locked = false;
                    }
                    if (!newText) {
                        newText = ("You probably tried to spend more thn 100% but less than 101% of budget.");
                        console.log("Budget Percent: " + budgetPercent);
                        console.log("Turn Budget Percent: " + this.ScoreMatrix.getTurnBudgetPercent());
                        console.log("Turn Budget: $" + this.ScoreMatrix.getTurnBudget());
                        console.log("Attempting to spend: $" + this.ScoreMatrix.getBudgetAbsolute(budgetPercent));
                    }
                    this.startTypewriterEffect(newText);
                    let checkTyping = this.time.addEvent({
                        delay: 50,
                        loop: true,
                        callback: () => {
                            if (!this.typing) {
                                this.clicked = false;
                                locked = false;
                                checkTyping.remove();
                            }
                        }
                    });
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

        backButton.on('pointerover', () => {
            backButton.setBackgroundColor('#AAAAAA');
            this.sound.play('pop');
        });
        backButton.on('pointerout', () => {
            backButton.setBackgroundColor('#DDDDDD');
        });

        backButton.on('pointerdown', () => {
            this.sound.play('click');
            this.scene.start('playScene');
        });
    }


    update(time, delta) {
        // Discrete bobbing, interval depends on budgetPercent
        if (!this.ministerBaseY) this.ministerBaseY = this.minister.y;
        let budgetPercent = this.ScoreMatrix.getMatrixEntry(2, this.ScoreMatrix.getTurn() - 1, 1) || 0;
        const minInterval = 300, maxInterval = 1200;
        let interval = maxInterval - ((maxInterval - minInterval) * (budgetPercent / 100));
        const bobAmount = 10;
        if (typeof time === "undefined") return;
        this.minister.y = this.ministerBaseY + ((Math.floor(time / interval) % 2 === 0) ? bobAmount : -bobAmount);
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
                if (this.typingIndex < text.length) {
                    this.dialogText.setText(this.dialogText.text + text[this.typingIndex]);
                    this.typingIndex++;
                }
                if (this.typingIndex >= text.length) {
                    this.typing = false;
                }
            }
        });
    }

}