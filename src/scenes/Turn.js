class Turn extends Phaser.Scene {
    constructor() {
        super("turnScene");
    }
    create() {
        this.won = false;
        this.ScoreMatrix = this.plugins.get('ScoreMatrix');
        let promptText = this.add.text(game.config.width / 2, game.config.height / 2, `Enter the turn code given by your referee for turn ${this.ScoreMatrix.getTurn()}:`, {
            fontFamily: 'Times New Roman',
            bold: 'true',
            fontSize: '32px',
            fill: '#000000',
            align: 'center',
            backgroundColor: '#dddddd',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5);

        let inputText = this.add.text(game.config.width * 0.5, game.config.height * 0.6, "", {
            fontFamily: 'Courier, monospace',
            fontSize: '18px',
            align: 'center',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: 10,
            fixedWidth: 300 // Ensure enough space for text input
        }).setOrigin(0.5);

        if(this.ScoreMatrix.getTurn() == 10){
            inputText.visible = false;
            promptText.setText("Congratulations!\nAfter a long and arduous tenure as Prime Minister, you may now step down, knowing you have guided your nation well.\nBut did you lead your nation better than your opponent?\nThere is no need for a code this turn, simply press enter to review your game.");
        }
        else if(this.ScoreMatrix.consumptionUpdate() >= 1000){
            this.won = true;
            inputText.visible = false;            
            promptText.setText("Congratulations!\nYou have won through wise political maneuvering, otherwise called pouring resources into consumption.\nPress enter to review the game, and inform your opponent that the code to progress is 999.");
        }
        this.input.keyboard.on('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9') {
                inputText.setText(inputText.text + event.key);
            } else if (event.key === 'Backspace') {
                inputText.setText(inputText.text.slice(0, -1));
            }
            if (event.key === 'Enter') {
                if (inputText.text == this.ScoreMatrix.getTurnCode()) {
                    this.ScoreMatrix.advanceTurn();
                    this.ScoreMatrix.updateBudget(this.ScoreMatrix.getTurn()-1);
                    this.scene.start("playScene");
                }
                else if(this.ScoreMatrix.getTurn() == 10 || inputText.text == 999 || this.won)
                {
                    this.scene.start("reviewScene");
                }
                else {
                    promptText.setText("That is not the correct code. Try again.")
                }
            }
        });

        this.add.text(config.width/2, config.height*0.7, "If you were attacked after you ended your turn, press (W) to go to the war screen to see your defensive capability.",{
            fontFamily: 'Times New Roman',
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-W', () => {
            this.scene.start('warScene');
        });
    }
}