import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    startButton = null;
    creditsButton = null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.input.setDefaultCursor('url(assets/Black1-Cat-Paw.cur), pointer');

        this.add.image(512, 384, 'background');

        this.add.text(512, 100, 'Bullet Cat', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#000000',
            stroke: '#ffffff', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.startButton = this.add.text(512, 360, 'Start Game', { 
                fill: '#000000',
                backgroundColor: '#0f0',
                align: 'center',
                fontFamily: 'Arial Black',
                stroke: '#ffffff', 
                strokeThickness: 4,
                fontSize: '40px'
            }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Game'))
            .on('pointerover', () => this.startButtonOver())
            .on('pointerout', () => this.startButtonOut());
        
        this.creditsButton = this.add.text(512, 560, 'Credits', { 
                fill: '#000000',
                backgroundColor: '#FBCEB1',
                align: 'center',
                fontFamily: 'Arial Black',
                stroke: '#ffffff', 
                strokeThickness: 4,
                fontSize: '40px'
            }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Credits'))
            .on('pointerover', () => this.creditsButtonOver())
            .on('pointerout', () => this.creditsButtonOut());
    }

    startButtonOver()
    {
        this.startButton.setStyle({ backgroundColor: 'rgb(9, 146, 9)'});
    }

    startButtonOut()
    {
        this.startButton.setStyle({ backgroundColor: '#0f0'});
    }

    creditsButtonOver()
    {
        this.creditsButton.setStyle({ backgroundColor: '#917562'});
    }

    creditsButtonOut()
    {
        this.creditsButton.setStyle({ backgroundColor: '#FBCEB1'});
    }
}
