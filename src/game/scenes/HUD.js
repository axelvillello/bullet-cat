import { Scene } from "phaser";

export class HUD extends Scene 
{
    constructor () 
    {
        super('HUD');
    }

    create ()
    {
        this.add.text(0,0, 'Score:', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0,0);

        this.add.text(0, this.scene.systems.scale.height, 'Life:', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0, 1);
    }
}