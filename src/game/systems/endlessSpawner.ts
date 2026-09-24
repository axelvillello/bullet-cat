import { Game } from "../scenes/Game";
import { Apathy } from '../gameObjects/Apathy';
import { Subiugatum } from '../gameObjects/Subiugatum';

function spawnMob(targetScene: Game)
{
    // TODO: Update mob spawning algo with dynamic spawn locations and exponential amounts of enemies 
    // TODO: Decrease overhead by making this a class object maybe?
    
    const apathy = new Apathy ({ scene: targetScene });
    const subiugatum = new Subiugatum({ scene: targetScene });
    const newEnemies = [apathy, subiugatum]

    targetScene.enemies.addMultiple([apathy, subiugatum]);
    targetScene.enemyList.push(apathy, subiugatum);

    for (let e of newEnemies) {
        e.start();
        e.setPosition(targetScene.centerX, targetScene.centerY - 700);
    }

    targetScene.spawnTimer += 5000;
}

export {spawnMob};