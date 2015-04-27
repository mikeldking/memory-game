var React = require('react'),
    Card = require('./Card'),
    GameStore = require('../stores/GameStore');

function getStateFromStores() {
    return {
        cards: GameStore.getCards()
    }
}

/**
 * The GameBoard that contains all the memory game cards
 */
var GameBoard = React.createClass({
    getInitialState: function () {
        return getStateFromStores();
    },
    componentDidMount: function () {
        GameStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        GameStore.removeChangeListener(this._onChange);
    },
    render: function () {
        var cards = this.state.cards;
        return (<div className='gameboard'>
            {cards.map(function (card) {
                return <Card key={card.id} id={card.id} type={card.type} flipped={card.flipped}></Card>;
            })}
        </div>);
    },
    /**
     * Event handler for 'change' events coming from the GameStore
     */
    _onChange: function () {
        this.setState(getStateFromStores());
    }
});

module.exports = GameBoard;