import { Physics } from 'phaser';
import { Bullet } from './Bullet';
import { knockback, death } from '../behaviours/Generic';
import { Game } from '../scenes/Game';
import { Player } from './Player';
import { Shadow } from '../FX/Shadow';
import eventCenter from '../helpers/EventCenter';

export class Subiugatum extends Physics.Arcade.Sprite 
{
    declare scene: Game;
    declare body: Phaser.Physics.Arcade.Body;
    declare shadow: Shadow;
    state = 'standby';
    hp = 3;
    scoreWorth = 20;
    fireRate = 2000;
    lastFired = 0;

    constructor({scene}: { scene: Game}) 
    {
        super(scene, 512, -200, 'subiugatum');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        this.body.setSize(60, 80);
        this.scene.physics.add.overlap(this, this.scene.player, (subiugatumObj, playerObj) => {
            (playerObj as Player).takeDamage(subiugatumObj as Subiugatum);
        }, undefined, this); 

        this.shadow = new Shadow(this, this.scene);
    }

    createAnimations() 
    {
        if (!this.scene.anims.exists('subiugatum_idle')) 
        {
            this.scene.anims.create({
                key: 'subiugatum_idle',
                frames: this.anims.generateFrameNumbers('subiugatum', { frames: [ 0, 1 ] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    start() 
    {
        this.state = 'can_move';
        this.anims.play('subiugatum_idle', true);
    }

    update() 
    {
        this.shadow.update();
        
        if ((this.state == 'can_move') && (!this.scene.player.isDestroyed))
        {
            this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 200, 0);
            if (this.scene.time.now - this.lastFired > this.fireRate) 
            {
                const bullet = new Bullet(
                { 
                    scene: this.scene, 
                    originX: this.x, 
                    originY: this.y,
                    targetX: this.scene.player.x,
                    targetY: this.scene.player.y,
                    speed: 300,
                    duration: 4000,
                    offset: -50,
                    tint: 0xff2400,
                    source: 'enemy'
                })
                .setScale(4);
                        
                bullet.start();
                this.lastFired = this.scene.time.now;
            }
        }
    }

    takeDamage(source: Phaser.GameObjects.GameObject) 
    {
        --this.hp;

        if (this.hp > 0)
        {
            knockback(this, source);
            this.scene.time.delayedCall(200, () => { this.state = 'can_move' }, [], this);
        }
        else if (this.hp >= 0)
        {
            this.state = 'dead';
            this.setVelocityX(0);
            this.setVelocityY(0);

            if (source.constructor.name == 'Bullet') source.destroy();

            eventCenter.emit('add-score', this.scoreWorth);
            death(this, this.scene);
        }
    }
}