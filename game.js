function preload() {
    this.load.image('enemy', 'the path tot the image');
    this.load.image('platform', 'the path tot the image');
    this.load.image('hero', 'the path to the image');
}

const gameState = {
    score: 0
};

function create() {

    gameState.player = this.physics.add.sprite(225, 450, 'hero').setOrigin(0.5, 0.5).setSize(300, 600).setScale(0.15);

    const platforms = this.physics.add.staticGroup();

    platforms.create(225, 600, 'platform');

    gameState.scoreText = this.add.text(20, 10, `Score: 0`, { fontSize: '15px', fill: '#000000' })

    gameState.player.setCollideWorldBounds(true);

    this.physics.add.collider(gameState.player, platforms);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    const bugs = this.physics.add.group();

    function bugGen() {
        const xCoord = Math.random() * 450;
        bugs.create(xCoord, 10, 'enemy').setScale(0.1);
    }

    const bugGenLoop = this.time.addEvent({
        delay: 190,
        callback: bugGen,
        callbackScope: this,
        loop: true,
    });

    this.physics.add.collider(bugs, platforms, function(bug) {
        bug.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`)
    });

    this.physics.add.overlap(gameState.player, bugs, () => {
        bugGenLoop.destroy();
        this.physics.pause();
        this.add.text(120, 250, 'Killed by a Test Project\n', { fontSize: '15px', fill: '#000000' });
        this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });

        this.input.on('pointerup', () => {
            gameState.score = 0;
            this.scene.restart();

        });
    });
}

function update() {
    if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-250);
    } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(250);
    } else {
        gameState.player.setVelocityX(0);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 450,
    height: 600,
    backgroundColor: "b9eaff",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
            enableBody: true
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);