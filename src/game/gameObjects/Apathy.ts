import { Physics } from 'phaser';
import { knockback, death } from '../behaviours/Generic';
import { Game } from '../scenes/Game';
import { Player } from './Player';
import eventCenter from '../helpers/EventCenter';

export class Apathy extends Physics.Arcade.Sprite 
{
    declare scene: Game;
    declare body: Phaser.Physics.Arcade.Body;
    state = 'standby';
    hp = 3;
    scoreWorth = 10;
    fireRate = 2000;
    lastFired = 0;

    constructor({scene}: { scene: Game}) 
    {
        super(scene, 412, -200, 'apathy');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        this.body.setSize(60, 80);
        this.scene.physics.add.overlap(this, this.scene.player, (apathyObj, playerObj) => {
            (playerObj as Player).takeDamage(apathyObj as Apathy);
        }, undefined, this); 
    }

    createAnimations() 
    {
        if (!this.scene.anims.exists('apathy_idle')) {
            this.scene.anims.create({
                key: 'apathy_idle',
                frames: this.anims.generateFrameNumbers('apathy', { frames: [ 0, 1 ] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    start() 
    {
        this.state = 'can_move';
        this.anims.play('apathy_idle', true);
    }

    update() 
    {
        if ((this.state == 'can_move') && (!this.scene.player.isDestroyed)) this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 150, 0);
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