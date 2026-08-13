import { Physics } from 'phaser';
import { Bullet } from './Bullet';
import { knockback } from '../behaviours/Generic';

export class Subiugatum extends Physics.Arcade.Sprite {
    state = 'standby';
    hp = 3;
    fireRate = 2000;
    lastFired = 0;

    constructor({scene}) {
        super(scene, 512, -200, 'subiugatum');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        this.body.setSize(60, 80);
        this.scene.physics.add.overlap(this, this.scene.player, this.scene.player.takeDamage, null, this.scene.player); 
    }

    createAnimations() {
        if (!this.scene.anims.exists('subiugatum_idle')) {
            this.scene.anims.create({
                key: 'subiugatum_idle',
                frames: this.anims.generateFrameNumbers('subiugatum', { frames: [ 0, 1 ] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    start() {
        this.state = 'can_move';
        this.anims.play('subiugatum_idle', true);
    }

    update() {
        if (this.state == 'can_move') this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 200, 0);

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
                offset: -50,
                tint: '0xff2400',
                source: 'enemy'
            })
            .setScale(4);
                    
            bullet.start();
            this.lastFired = this.scene.time.now;
         }
    }

    takeDamage(source) {
        --this.hp;
        knockback(this, source);
        this.scene.time.delayedCall(200, () => { this.state = 'can_move' }, [], this);
    }
}