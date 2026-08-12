import { Scene } from 'phaser';
import { createButton } from '../UI/Button';
import Settings from '../state/Settings';

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
        this.input.setDefaultCursor('url(assets/paw_cursor.cur), pointer');

        this.add.image(512, 384, 'background');

        this.add.text(512, 200, 'Bullet Cat', {
            fontFamily: Settings.font, fontSize: 72, color: '#000000',
            stroke: '#ffffff', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.startButton = createButton(this, 512, 360, 0x6c3baa, 'START GAME', Settings.font, () => this.scene.start('Game'));
        this.optionsButton = createButton(this, 512, 460, 0xa47dab, 'Options', Settings.font, () => alert('Options coming soon!'));
        this.creditsButton = createButton(this, 512, 560, 0xa47dab, 'Credits', Settings.font, () => this.scene.start('Credits'));
    }

}
