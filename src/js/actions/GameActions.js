var AppDispatcher = require('../dispatchers/AppDispatcher');
var GameConstants = require('../constants/GameConstants');

var GameActions = {

    /**
     * flipCard
     * @param  {number} id the card's id
     */
    flipCard: function(id) {
        AppDispatcher.dispatch({
            actionType: GameConstants.FLIP_CARD,
            id: id
        });
    },

    /**
     */
    restart: function() {
        AppDispatcher.dispatch({
            actionType: GameConstants.RESTART
        });
    }
};

module.exports = GameActions;