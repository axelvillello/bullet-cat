import { Physics } from "phaser";

export class Bullet extends Physics.Arcade.Sprite {

    state = 'standby';

    constructor({scene}) {

        super(scene, 0, 0, 'p_bullet1');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.createAnimations();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('p_bullet1', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
            frameRate: 8
        });
    }

    start ()
    {
        this.anims.play('fire', true);
        this.setPosition(this.scene.player.x, this.scene.player.y);
        this.scene.physics.moveTo(this, this.scene.pointer.worldX, this.scene.pointer.worldY, 1000, 0);
        this.scene.time.delayedCall(1000, () => { this.destroy() }, [], this);
    }
}