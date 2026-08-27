import { Scene } from "phaser";
import eventCenter from "../helpers/EventCenter";
import Settings from "../state/Settings";

export class HUD extends Scene 
{
    scoreLabel!: Phaser.GameObjects.Text;
    playerHPLabel!: Phaser.GameObjects.Text;

    constructor () 
    {
        super('HUD');
    }

    create ()
    {
        eventCenter.on('update-score', this.updateScore, this);
        eventCenter.on('update-player-hp', this.updatePlayerHP, this);

        this.scoreLabel = this.add.text(0,0, 'Score:', 
        {
            fontFamily: Settings.font, fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0,0);

        this.playerHPLabel = this.add.text(0, this.scene.systems.scale.height, 'Life: 0', 
        {
            fontFamily: Settings.font, fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0, 1);
    }

    updateScore(updatedScore: number) 
    {
        this.scoreLabel.text = `Score: ${updatedScore}`;
    }

    updatePlayerHP(updatedHP: number) 
    {
        this.playerHPLabel.text = `Life: ${updatedHP}`;
    }
}