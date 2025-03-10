class Load extends Phaser.Scene {
    constructor() {
        super('loadingScene');
    }

    preload() {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x00FF00, 1);
        this.loadBar.fillRect(game.config.width * 0.4, game.config.height * 0.5, game.config.width * 0.2, 20);
        
        this.loadingText = this.add.text(game.config.width * 0.5, game.config.height * 0.45, 'Loading... 0%', {
            fontFamily: 'Times New Roman',
            fontSize: '24px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);



        this.load.on('progress', (percent) => {
            this.loadBar.clear();
            this.loadBar.fillStyle(0x00F0FF, 1);
            this.loadBar.fillRect(game.config.width * 0.4, game.config.height * 0.5, game.config.width * 0.2 * percent, 20);

            this.loadingText.setText(`Loading... ${Math.floor(percent * 100)}%`);
        });
        
        // Load images
        this.load.path = "./assets/images/";
        this.load.image("background", "background_new.png");
        this.load.image("desk", "desk_med.png");
        this.load.image("deputy", "DPM_med.png");
        this.load.image("banker", "FIN_med.png");
        this.load.image("jingo", "NSA_med.png")
        this.load.image("defense", "zhukovwalmart_med.png");
        this.load.image("deputyS", "DPM_small.png");
        this.load.image("bankerS", "FIN_small.png");
        this.load.image("defenseS", "zhukovwalmart_small.png");
        this.load.image("jingoS", "NSA_small.png");
        this.load.image("turnButton", "nextturn.png");
        this.load.image("warButton", "warButton.png");
        
        // Load audio
        this.load.path = "./assets/audio";
    }

    create() {
        this.scene.start('menuScene');
    }
}