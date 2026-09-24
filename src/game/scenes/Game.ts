import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';
import { Apathy } from '../gameObjects/Apathy';
import { Subiugatum } from '../gameObjects/Subiugatum';
import eventCenter from '../helpers/EventCenter';
import CurrentSession from '../state/CurrentSession';
import { spawnMob } from '../systems/endlessSpawner';

type Keys = Phaser.Input.Keyboard.Key;

// TODO: Spawn new enemies in random locations
// TODO: Create a generic parent class for enemies
// TODO: Add pathing for enemies 
// TODO: Fix player dodging through corners of the map 

export class Game extends Scene
{
    platform!: Phaser.GameObjects.Arc;
    player!: Player;
    apathy!: Apathy;
    subiugatum!: Subiugatum;
    enemies!: Phaser.GameObjects.Group;
    enemyList!: (Apathy | Subiugatum)[]; //Separate array for handling enemy logic to avoid looping through the heavier group object
    keyW!: Keys;
    keyA!: Keys;
    keyS!: Keys;
    keyD!: Keys;
    keySPACE!: Keys;
    keyESC!: Keys;
    centerX!: number;
    centerY!: number;

    isFiring = false;
    spawnTimer = 0;

    session = new CurrentSession();

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.scene.launch('HUD');
        this.cameras.main.setBackgroundColor('#2A112E');

        // Increase tolerance for fast moving object collision
        this.physics.world.TILE_BIAS = 64;

        // Tilemap generation from the preloaded JSON and tilesheet
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('bullet-cat-endless-tileset', 'tiles');

        // Layer ID defined using Tiled
        const belowLayer = map.createLayer('Below Player', tileset!, 0, 0).setScale(3);
        const worldLayer = map.createLayer('World', tileset!, 0, 0).setScale(3);

        belowLayer.setDepth(-10);
        worldLayer.setDepth(-5);

        this.centerX = (map.widthInPixels*3)/2;
        this.centerY = (map.heightInPixels*3)/2;

        worldLayer.setCollisionBetween(0, 6);

        //this.lights.enable();
        //this.lights.addLight(512, 384, 700, 0xffffff, 1000, 100);

        this.player = new Player({ scene: this }).setScale(3);

        // Load enemy types and place them in a group
        this.apathy = new Apathy ({ scene: this });
        this.subiugatum = new Subiugatum({ scene: this });

        // Enemies are placed into an group for shared physics 
        this.enemies = this.add.group();
        this.enemies.addMultiple([this.apathy, this.subiugatum]);

        // Enemies are placed into an array for function calls 
        this.enemyList = [this.apathy, this.subiugatum];

        this.session.setScore(0);

        this.scene.get('HUD').events.once('create', () => 
        {
            eventCenter.emit('update-score', this.session.scoreTotal);
            eventCenter.emit('update-player-hp', this.player.hp);
        });

        eventCenter.on('add-score', this.addScore, this);

        this.keyW = this.input.keyboard!.addKey('W');
        this.keyA = this.input.keyboard!.addKey('A');
        this.keyS = this.input.keyboard!.addKey('S');
        this.keyD = this.input.keyboard!.addKey('D');
        this.keySPACE = this.input.keyboard!.addKey('SPACE');
        this.keyESC = this.input.keyboard!.addKey('ESC');

        this.player.start();
        this.player.setPosition(this.centerX, this.centerY + 200);

        for (let e of this.enemyList) {
            e.start();
            e.setPosition(this.centerX, this.centerY - 700);
        }

        this.cameras.main.startFollow(this.player);
        this.input.on('pointerdown', () => { this.isFiring = true; });
        this.input.on('pointerup',   () => { this.isFiring = false; });

        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.enemies, worldLayer);
    }

    update(time: number) {

        if (time > this.spawnTimer) spawnMob(this);

        this.input.activePointer.updateWorldPoint(this.cameras.main);

        for (let e of this.enemyList) e.update();

        if (!this.player.isDestroyed)
        {
            this.player.update();

            // Checks for vertical movement input
            if (this.keyW.isDown) this.player.move('up');
            else if (this.keyS.isDown) this.player.move('down');
            else this.player.move('noY');
            // Checks for horizontal movement input
            if (this.keyA.isDown) this.player.move('left');
            else if (this.keyD.isDown) this.player.move('right');
            else this.player.move('noX');

            if (this.keySPACE.isDown) this.player.dodge();
            if (this.isFiring) this.player.fire();
        }

        if (this.keyESC.isDown) 
        {
            eventCenter.destroy();
            this.scene.stop('HUD');
            this.scene.start('GameOver');
        }
    }

    addScore(addedScore: number)
    {
        this.session.addScore(addedScore);
    }
}
