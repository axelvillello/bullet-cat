import { Physics } from 'phaser';
import { Bullet } from './Bullet';
import eventCenter from '../helpers/EventCenter';
import { knockback, death } from '../behaviours/Generic';
import { Game } from '../scenes/Game';

export class Player extends Physics.Arcade.Sprite 
{
    declare scene: Game;
    declare body: Phaser.Physics.Arcade.Body;
    declare shadow: Phaser.GameObjects.Ellipse;

    state = 'standby';
    hitstun = false;
    hp = 3;
    fireRate = 500;
    lastFired = 0;
    dodgeRate = 400;
    lastDodged = 0;

    constructor({scene}: { scene: Game}) 
    {
        super(scene, 512, 384, 'cat');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        this.body.setSize(10, 10);
        this.shadow = this.scene.add.ellipse(512, 384, 50, 20, 0x000000, 0.5);
        this.scene.physics.add.existing(this.shadow, false);
        this.shadow.setDepth(this.depth - 6);
        //this.setLighting(true);
        //this.setSelfShadow(true);
    }

    // TODO: Fix up and down animations not playing when colliding into a wall
    createAnimations() 
    {
        if (!this.scene.anims.exists('idle')) 
        {
            this.scene.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 0, 1, 2, 3, 24, 25, 26, 25, 24, 3, 2, 1 ] }),
                frameRate: 5
            });
        }

        if (!this.scene.anims.exists('side')) 
        {
            this.scene.anims.create(
            {
                key: 'side',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 64, 65, 66, 67, 88] }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('up')) 
        {
            this.scene.anims.create(
            {
                key: 'up',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 208, 209, 210, 211, 232] }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('down')) 
        {
            this.scene.anims.create(
            {
                key: 'down',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 16, 17, 18, 19, 40] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    start() 
    {
        this.state = 'can_move';
        this.anims.play('idle', true);
    }

    update() 
    {
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0)
        {
            this.anims.play('idle', true);
        }

        if (this.shadow.body)
        { 
            const xOffset = this.flipX ? -6 : -15; //Specific variables for the placeholder sprite
            this.shadow.body.position.x = this.body.position.x + xOffset;
            this.shadow.body.position.y = this.body.position.y + 30;
        }
    }

    move(direction: string) 
    {
        if (this.state === 'can_move') 
        {
            switch (direction) 
            {
                case ('up'):  
                    this.setVelocityY(-300);
                    if (this.body.velocity.x == 0) this.anims.play('up', true);
                    break;
                case ('down'):  
                    this.setVelocityY(300);
                    if (this.body.velocity.x == 0) this.anims.play('down', true);  
                    break;
                case ('left'):  
                    this.setVelocityX(-300);
                    this.anims.play('side', true);
                    this.setFlipX(false);      
                    break;
                case ('right'):  
                    this.setVelocityX(300);
                    this.anims.play('side', true);
                    this.setFlipX(true);
                    break;
                case ('noY'):  
                    this.setVelocityY(0);
                    break;
                case ('noX'):  
                    this.setVelocityX(0);
                    break;
                default:
                    break;
            }
        }
    }

    fire() 
    {
        if (this.scene.time.now - this.lastFired > this.fireRate) 
        {
            const bullet = new Bullet(
            { 
                scene: this.scene, 
                originX: this.x, 
                originY: this.y,
                targetX: this.scene.input.activePointer.worldX,
                targetY: this.scene.input.activePointer.worldY,
                speed: 1000,
                duration: 1000,
                tint: 0x7df9ff,
                source: 'player'
            })
            .setScale(4);
            
            bullet.start();
            this.lastFired = this.scene.time.now;
        }
    }

    dodge() 
    {
        if ((this.scene.time.now - this.lastDodged > this.dodgeRate) && !this.hitstun) 
        {
            this.state = 'dodging';
            this.createAfterImage();

            const dodgeVelX = this.body.velocity.x !== 0 ? 3000 * Math.sign(this.body.velocity.x) : 0;
            const dodgeVelY = this.body.velocity.y !== 0 ? 3000 * Math.sign(this.body.velocity.y) : 0;
            this.setVelocity(dodgeVelX, dodgeVelY);

            this.scene.time.delayedCall(100, () => { this.lastDodged = this.scene.time.now; this.state = 'can_move' }, [], this);
            
            // Dodging in cursor direction
            //this.scene.physics.moveTo(this, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY, 3000, 0);
        }
    }

    createAfterImage() 
    {
        const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key, this.frame.name);
        
        ghost.setDepth(this.depth - 1);
        ghost.setScale(this.scaleX, this.scaleY);
        ghost.setFlipX(this.flipX);

        this.scene.tweens.add(
        {
            targets: ghost,
            alpha: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => ghost.destroy()
        });
    }

    takeDamage(source: Phaser.GameObjects.GameObject) 
    {
        if (!this.hitstun && this.state != 'dodging')
        {    
            this.hitstun = true;
            --this.hp;
            eventCenter.emit('update-player-hp', this.hp);

            if (this.hp > 0)
            {
                knockback(this, source);
                this.scene.time.delayedCall(200, () => { this.hitstun = false; this.state = 'can_move' }, [], this);
            }
            else if (this.hp >= 0)
            {
                this.scene.tweens.add(
                {
                    targets: this.shadow,
                    alpha: 0,
                    duration: 600,
                    ease: 'Cubic.easeOut',
                    onComplete: () => this.shadow.destroy()
                });

                this.state = 'dead';
                this.setVelocityX(0);
                this.setVelocityY(0);

                if (source.constructor.name == 'Bullet') source.destroy();

                death(this, this.scene);
            }
            
        }    
    }
}