import { Physics } from 'phaser';

export class Bullet extends Physics.Arcade.Sprite {

    state = 'standby';

    constructor({scene, originX, originY, targetX, targetY, speed, duration, tint = '0xffffff'}) {

        super(scene, 0, 0, 'p_bullet1');
        this.scene = scene;
        this.startX = originX;
        this.startY = originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.duration = duration;
        this.setTint(tint);
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();
    }

    createAnimations() {
        if (!this.scene.anims.exists('fire')) {
            this.scene.anims.create({
                key: 'fire',
                frames: this.anims.generateFrameNumbers('p_bullet1', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    start ()
    {
        this.anims.play('fire', true);
        this.setPosition(this.startX, this.startY);
        this.scene.physics.moveTo(this, this.targetX, this.targetY, this.speed, 0);
        this.scene.time.delayedCall(this.duration, () => { this.destroy() }, [], this);
    }
}