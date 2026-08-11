import { Physics } from 'phaser';
import { Bullet } from './Bullet';

export class Apathy extends Physics.Arcade.Sprite {

    state = 'standby';
    fireRate = 2000;
    lastFired = 0;

    constructor({scene}) {

        super(scene, 512, -200, 'apathy');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        this.body.setSize(60, 80);
        this.scene.physics.add.overlap(this, this.scene.player, this.scene.player.takeDamage, null, this.scene.player); 
    }

    createAnimations() {
        if (!this.scene.anims.exists('apathy_idle')) {
            this.scene.anims.create({
                key: 'apathy_idle',
                frames: this.anims.generateFrameNumbers('apathy', { frames: [ 0, 1 ] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    start() {
        this.state = 'can_move';
        this.anims.play('apathy_idle', true);
    }

    update() {
        if (this.state == 'can_move') this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 100, 0);

        if (this.scene.time.now - this.lastFired > this.fireRate) 
        {
            const bullet = new Bullet({ 
                scene: this.scene, 
                originX: this.x, 
                originY: this.y,
                targetX: this.scene.player.x,
                targetY: this.scene.player.y,
                speed: 300,
                duration: 4000,
                tint: '0xff2400',
                source: 'enemy'
            })
            .setScale(4);
                    
            bullet.start();
            this.lastFired = this.scene.time.now;
         }
    }
}