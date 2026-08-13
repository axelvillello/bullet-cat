function knockback(target, source) {
    if (target.constructor.name != 'Player')
    {
        target.body.velocity.x = 400 * Math.sign(source.body.velocity.x);
        target.body.velocity.y = 400 * Math.sign(source.body.velocity.y);
    }
    else if (target.body.velocity.x == 0 && target.body.velocity.y == 0)
    {
        target.body.velocity.x = 1200 * Math.sign(source.body.velocity.x);
        target.body.velocity.y = 1200 * Math.sign(source.body.velocity.y);
    }
    else 
    {
        target.body.velocity.x *= -4;
        target.body.velocity.y *= -4;
    }
    target.state = 'knocked_back';
}

export {knockback};