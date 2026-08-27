function knockback(target: Phaser.GameObjects.GameObject, source: Phaser.GameObjects.GameObject) 
{
    
    if (target.constructor.name != 'Player')
    {
        target.body!.velocity.x = 400 * Math.sign(source.body!.velocity.x);
        target.body!.velocity.y = 400 * Math.sign(source.body!.velocity.y);
    }
    else if (target.body!.velocity.x == 0 && target.body!.velocity.y == 0)
    {
        target.body!.velocity.x = 1200 * Math.sign(source.body!.velocity.x);
        target.body!.velocity.y = 1200 * Math.sign(source.body!.velocity.y);
    }
    else 
    {
        target.body!.velocity.x *= -4;
        target.body!.velocity.y *= -4;
    }
    target.state = 'knocked_back';

    // TODO: Update Bullet to a generic projectile class 
    if (source.constructor.name == 'Bullet') source.destroy();
}

function death(target: Phaser.Physics.Arcade.Sprite, scene: Phaser.Scene) 
{
    target.setTint(0xff0000);
    scene.tweens.add(
    {
        targets: target,
        alpha: 0,
        duration: 600,
        ease: 'Cubic.easeOut',
        onComplete: () => target.destroy()
    });
}

export {knockback, death};