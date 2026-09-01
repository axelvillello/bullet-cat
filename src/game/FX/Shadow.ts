// Due to the scaling and flipping of current player sprite, this class is currently only for enemies

import { Game } from "../scenes/Game";

export class Shadow
{   
    declare targetObj: Phaser.GameObjects.Sprite;
    declare shadow: Phaser.GameObjects.Ellipse;
    declare scene: Game;
    offset = 0;

    constructor(targetObj: Phaser.GameObjects.Sprite, scene: Game)
    {
        this.targetObj = targetObj;
        this.scene = scene;
        this.shadow = this.scene.add.ellipse(512, 384, this.targetObj.displayWidth/2, this.targetObj.displayHeight/5, 0x000000, 0.5);
        this.scene.physics.add.existing(this.shadow, false);
        this.shadow.setBelow(this.targetObj);
    }

    update()
    {
        if (!this.targetObj.isDestroyed)
        {
            this.shadow.body!.position.x = this.targetObj.body!.position.x + this.offset;
            this.shadow.body!.position.y = this.targetObj.body!.position.y + (this.targetObj.displayHeight)*0.7;
        }
        
        if (this.targetObj.state == "dead")
        {
            this.scene.tweens.add(
            {
                targets: this.shadow,
                alpha: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => this.shadow.destroy()
            });
        }
    }
}