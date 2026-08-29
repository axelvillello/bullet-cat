import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';
import { Apathy } from '../gameObjects/Apathy';
import { Subiugatum } from '../gameObjects/Subiugatum';
import eventCenter from '../helpers/EventCenter';
import CurrentSession from '../state/CurrentSession';

type Keys = Phaser.Input.Keyboard.Key;

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

    isFiring = false;

    session = new CurrentSession();

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.scene.launch('HUD');
        this.cameras.main.setBackgroundColor('#884496');

        this.platform = this.add.circle(512, 384, 700, 0xffffff, 0.5);

        //this.lights.enable();
        //this.lights.addLight(512, 384, 700, 0xffffff, 1000, 100);

        this.player = new Player({ scene: this }).setScale(3);

        this.apathy = new Apathy ({ scene: this });
        this.subiugatum = new Subiugatum({ scene: this });
        this.enemies = this.add.group();
        this.enemies.addMultiple([this.apathy, this.subiugatum]);
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

        for (let e of this.enemyList) e.start();

        this.cameras.main.startFollow(this.player);
        this.input.on('pointerdown', () => { this.isFiring = true; });
        this.input.on('pointerup',   () => { this.isFiring = false; });

    }

    update() {
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
