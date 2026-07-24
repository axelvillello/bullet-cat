import { Scene } from "phaser";

export class Credits extends Scene 
{
    constructor () 
    {
        super('Credits');
    }

    create ()
    {
        this.add.text(512, 60, 'Credits', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 160, 'Cat Paw Cursor: JamKats https://ko-fi.com/jamkats', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}