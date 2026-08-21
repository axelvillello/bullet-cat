import { Physics } from 'phaser';
import { Game } from '../scenes/Game';
import { Player } from './Player';
import { Apathy } from './Apathy';
import { Subiugatum } from './Subiugatum';

interface BulletConfig {
    scene: Game;
    originX: number;
    originY: number;
    targetX: number;
    targetY: number;
    speed: number;
    duration: number;
    source: string;
    offset?: number;
    tint?: number;
}

export class Bullet extends Physics.Arcade.Sprite {
    declare scene: Game;
    declare body: Phaser.Physics.Arcade.Body;
    startX!: number;
    startY!: number;
    targetX!: number;
    targetY!: number;
    speed!: number;
    duration!: number;
    offset!: number;
    state = 'standby';

    constructor({scene, originX, originY, targetX, targetY, speed, duration, source, offset = 0, tint = 0xffffff} : BulletConfig)
    {
        super(scene, 0, 0, 'p_bullet1');
        this.startX = originX;
        this.startY = originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.duration = duration;
        this.offset = offset;
        this.setTint(tint);
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        this.body.setSize(10, 10);
        if (source == 'enemy') this.scene.physics.add.overlap(this, this.scene.player, (bulletObj, playerObj) => {
            (playerObj as Player).takeDamage(bulletObj as Bullet)
        }, undefined, this)
        else {
            this.scene.physics.add.overlap(this, this.scene.enemies.getChildren(), (bulletObj, enemyObj) => {
            (enemyObj as Apathy | Subiugatum).takeDamage(bulletObj as Bullet);
        }, undefined, this)
        };        
    }

    createAnimations() {
        if (!this.scene.anims.exists('fire')) {
            this.scene.anims.create({
                key: 'fire',
                frames: this.anims.generateFrameNumbers('p_bullet1', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
                frameRate: 15,
                repeat: -1
            });
        }
    }

    start ()
    {
        this.anims.play('fire', true);
        this.setPosition(this.startX, this.startY + this.offset);
        this.scene.physics.moveTo(this, this.targetX, this.targetY, this.speed, 0);
        this.scene.time.delayedCall(this.duration, () => { this.destroy() }, [], this);
    }
}