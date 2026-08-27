import eventCenter from "../helpers/EventCenter";

interface CurrentSession 
{
    scoreTotal: number
}

class CurrentSession 
{
    scoreTotal = 0;

    setScore(score: number)
    {
        this.scoreTotal = score;
    }

    addScore(addedScore: number)
    {
        this.scoreTotal += addedScore;
        eventCenter.emit('update-score', this.scoreTotal);
    }
}

export default CurrentSession;