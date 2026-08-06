import { Scene, Cameras } from 'phaser';
import { Player } from '../gameObjects/Player';
import { Bullet } from '../gameObjects/Bullet';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#884496');
        this.camera = this.cameras.main;

        //this.walls = this.physics.add.staticGroup();

        this.platform = this.add.circle(512, 384, 1000, '#ffffff', 0.5);

        this.lights.enable();
        this.lights.addLight({x: 512, y: 384, z: 50, intensity: 100, radius: 500});

        this.player = new Player({ scene: this }).setScale(3);

        //this.physics.add.collider(this.player, this.platformBounds);

        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyESC = this.input.keyboard.addKey('ESC');
        this.keySPACE = this.input.keyboard.addKey('SPACE');

        this.pointer = this.input.activePointer;

        this.player.start();
        this.camera.startFollow(this.player);

        this.isFiring = false;
        this.input.on('pointerdown', () => { this.isFiring = true; });
        this.input.on('pointerup',   () => { this.isFiring = false; });

        this.fireRate = 200;
        this.lastFired = 0;

        this.dodgeRate = 400;
        this.lastDodged = 0;

        this.scene.launch('HUD');
        
    
    }

    update(time) {

        this.pointer.updateWorldPoint(this.camera);

        this.player.update();

        if (this.keyW.isDown) {
            this.player.move('up');
        }
        else if (this.keyS.isDown) {
            this.player.move('down');
        }
        else {
            this.player.move('noY');
        }
        
        if (this.keyA.isDown) {
            this.player.move('left');
        }
        else if (this.keyD.isDown) {
            this.player.move('right');
        }
        else {
            this.player.move('noX');
        }
        
        if (this.keyESC.isDown) {
            this.scene.stop('HUD');
            this.scene.start('GameOver');
        }

        if (this.keySPACE.isDown && time - this.lastDodged > this.dodgeRate) {
            this.player.dodge();
            this.time.delayedCall(100, () => { this.lastDodged = time }, [], this);
        }

        if (this.isFiring && time - this.lastFired > this.fireRate) 
        {
            const bullet = new Bullet({ scene: this }).setScale(4);
            bullet.start();
            this.lastFired = time;
        }

    }
}
