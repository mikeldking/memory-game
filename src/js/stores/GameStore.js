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
 * shuffles the cards
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

    //reset the cards
    _cards = [];

    //reset the current score
    _scores.currentScore = 0;

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

function _resetcardsBeingFlipped() {
    _cards[_gameState.cardsBeingFlipped[0]].flipped = false;
    _cards[_gameState.cardsBeingFlipped[1]].flipped = false;
    _gameState.cardsBeingFlipped = [];
};

function _subtractCurrentPoints() {
    _scores.currentScore = (_scores.currentScore === 0) ? 0 : _scores.currentScore - 1;
}

function _addCurrentPoints() {
    _scores.currentScore += 1;
}


//restart the game to start
_restart();

var GameStore = assign({}, EventEmitter.prototype, {
    /**
     * Get the high score
     * @return {object}
     */
    getScores: function () {
        return _scores;
    },

    getCards: function () {
        return _cards;
    },

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
            if (_gameState.cardsBeingFlipped.length < 2) {
                _cards[action.id].flipped = true;
                _gameState.cardsBeingFlipped.push(action.id);
                if (_gameState.cardsBeingFlipped.length === 2) {
                    if (_cards[_gameState.cardsBeingFlipped[0]].type ===
                        _cards[_gameState.cardsBeingFlipped[1]].type) {
                        //increase the
                        _gameState.numPairsMatched += 1;
                        //the cards are the same. Give the points
                        _addCurrentPoints();
                        //set the flipped cards to empty
                        _gameState.cardsBeingFlipped = [];
                        //check to see if the game is over
                        if (_gameState.numPairsMatched === _cardTypes.length) {
                            if (_scores.highScore < _scores.currentScore) {
                                //capture the high score
                                _scores.highScore = _scores.currentScore;
                            }
                        }
                    } else {
                        //set the cards back and subtract points
                        setTimeout(function resetcardsBeingFlipped() {
                            _resetcardsBeingFlipped();
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