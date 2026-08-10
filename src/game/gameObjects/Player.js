import { Physics } from 'phaser';
import { Bullet } from './Bullet';

export class Player extends Physics.Arcade.Sprite {

    state = 'standby';
    fireRate = 500;
    lastFired = 0;
    dodgeRate = 400;
    lastDodged = 0;

    constructor({scene}) {

        super(scene, 512, 384, 'cat');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();

        //this.setLighting(true);
        //this.setSelfShadow(true);
    }

    createAnimations() {
        if (!this.scene.anims.exists('idle')) {
            this.scene.anims.create({
                key: 'idle',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 0, 1, 2, 3, 24, 25, 26, 25, 24, 3, 2, 1 ] }),
                frameRate: 5
            });
        }

        if (!this.scene.anims.exists('side')) {
            this.scene.anims.create({
                key: 'side',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 64, 65, 66, 67, 88] }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('up')) {
            this.scene.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 208, 209, 210, 211, 232] }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('down')) {
            this.scene.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('cat', { frames: [ 16, 17, 18, 19, 40] }),
                frameRate: 5,
                repeat: -1
            });
        }
    }

    start() {
        this.state = 'can_move';
        this.anims.play('idle', true);
    }

    update() {
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0)
        {
            this.anims.play('idle', true);
        }
    }

    move(direction) {
        if (this.state === 'can_move') {
            switch (direction) {
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

    fire() {
        if (this.scene.time.now - this.lastFired > this.fireRate) 
        {
            const bullet = new Bullet({ 
                scene: this.scene, 
                originX: this.x, 
                originY: this.y,
                targetX: this.scene.pointer.worldX,
                targetY: this.scene.pointer.worldY,
                speed: 1000,
                duration: 1000
            })
            .setScale(4);
            
            bullet.start();
            this.lastFired = this.scene.time.now;
        }
    }

    dodge() {
        if (this.scene.time.now - this.lastDodged > this.dodgeRate) 
        {
            this.state = 'dodging';
            this.createAfterImage();
            let dodgeVelX = 0;
            let dodgeVelY = 0;
            if (this.body.velocity != 0) dodgeVelX = 3000 * Math.sign(this.body.velocity.x);
            if (this.body.velocity != 0) dodgeVelY = 3000 * Math.sign(this.body.velocity.y);
            this.setVelocity(dodgeVelX, dodgeVelY);

            this.scene.time.delayedCall(100, () => { this.lastDodged = this.scene.time.now; this.state = 'can_move' }, [], this);
            // Dodging in cursor direction
            //this.scene.physics.moveTo(this, this.scene.pointer.worldX, this.scene.pointer.worldY, 3000, 0);
        }
    }

    createAfterImage() {
        const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key, this.frame.name);
        
        ghost.setDepth(this.depth - 1);
        ghost.setScale(this.scaleX, this.scaleY);
        ghost.setFlipX(this.flipX);

        this.scene.tweens.add({
            targets: ghost,
            alpha: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => ghost.destroy()
        });
    }
}