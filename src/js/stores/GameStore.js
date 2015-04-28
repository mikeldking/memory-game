var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants/GameConstants');
var assign = require('object-assign');
var shuffle = require('knuth-shuffle').knuthShuffle;

var CHANGE_EVENT = 'change',
    _scores = {
        highScore: 0,
        currentScore: 0
    }, _cards, _gameState = {
        //cards being currently flipped
        cardsBeingFlipped: [],
        //the number of pairs that have been matched
        numPairsMatched: 0
    }, _cardTypes = [
        'plane',
        'heart',
        'camera',
        'pencil',
        'leaf',
        'car',
        'rocket',
        'umbrella',
        'trophy',
        'star'
    ];

/**
 * shuffles the cards using knuth shuffle
 * @private
 */
function _shuffleCards() {
    _cards = shuffle(_cards);
    //set the ids to the new order
    _cards.forEach(function (card, index) {
        card.id = index;
    });
}
/**
 * Restarts the game
 * @private
 */
function _restart() {
    //reset the game state
    _gameState.numPairsMatched = 0;
    _gameState.cardsBeingFlipped = [];

    //reset the current score
    _scores.currentScore = 0;

    //reset the cards
    _cards = [];
    //add two of each card type to the deck
    _cardTypes.forEach(function (cardType) {
        //calculate the two ids
        _cards.push({
            type: cardType,
            flipped: false
        });
        _cards.push({
            type: cardType,
            flipped: false
        });
    });
    //shuffle the cards
    _shuffleCards();
}

/**
 * Resets the cards being flipped.
 * @private
 */
function _resetCardsBeingFlipped() {
    _cards[_gameState.cardsBeingFlipped[0]].flipped = false;
    _cards[_gameState.cardsBeingFlipped[1]].flipped = false;
    _gameState.cardsBeingFlipped = [];
}

/**
 * Subtracts a point from the current points. Does not subtract a point if the score is at 0
 * @private
 */
function _subtractCurrentPoints() {
    _scores.currentScore = (_scores.currentScore === 0) ? 0 : _scores.currentScore - 1;
}

/**
 * Adds 1 point to the current score
 * @private
 */
function _addCurrentPoints() {
    _scores.currentScore += 1;
}


//restart the game to start
_restart();

var GameStore = assign({}, EventEmitter.prototype, {
    /**
     * Get the high score. Accessor method for the scors
     * @return {object} score object with the high score and current score
     */
    getScores: function () {
        return _scores;
    },

    /**
     * Get
     * @returns {array} cards an array of card objects
     */
    getCards: function () {
        return _cards;
    },

    /**
     * Emits the change event to let listeners know that the store changed
     */
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback to handle all updates
AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case GameConstants.RESTART:
            _restart();
            GameStore.emitChange();
            break;
        case GameConstants.FLIP_CARD:
            // do not handle the flip card action if more than 2 cards are flipped
            if (_gameState.cardsBeingFlipped.length < 2) {

                // set the card as flipped
                _cards[action.id].flipped = true;
                // store the card being flipped in the state
                _gameState.cardsBeingFlipped.push(action.id);

                //if 2 cards are flipped, check equality
                if (_gameState.cardsBeingFlipped.length === 2) {

                    // check to see if the card types are the same. If they are, add to the points of the current game
                    if (_cards[_gameState.cardsBeingFlipped[0]].type === _cards[_gameState.cardsBeingFlipped[1]].type) {

                        // keep track of how many pairs have been matched
                        _gameState.numPairsMatched += 1;
                        // the cards are the same. Give the points
                        _addCurrentPoints();
                        // set the flipped cards to empty
                        _gameState.cardsBeingFlipped = [];

                        // check to see if the game is over by compairing the number of matched pairs with the number of
                        // card types
                        if (_gameState.numPairsMatched === _cardTypes.length) {
                            if (_scores.highScore < _scores.currentScore) {
                                //capture the high score
                                _scores.highScore = _scores.currentScore;
                            }
                        }
                    } else {
                        // the cards do not match
                        // set the cards back and subtract points
                        setTimeout(function resetCardsBeingFlipped() {
                            _resetCardsBeingFlipped();
                            _subtractCurrentPoints();
                            GameStore.emitChange();
                        }, 1000);
                    }
                }
            }
            GameStore.emitChange();
            break;
        default:
        // no op
    }
});

module.exports = GameStore;