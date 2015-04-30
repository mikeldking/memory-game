var React = require('react'),
    GameBoard = require('./GameBoard'),
    GameStore = require('../stores/GameStore'),
    GameActions = require('../actions/GameActions');

/**
 * A utility function that grabs the necessary state from the store
 * @returns {*|Object} the scores object
 */
function getStateFromStores() {
    return GameStore.getScores();
}

var App = React.createClass({
    getInitialState: function(){
      return getStateFromStores();
    },
    restart: function(){
      GameActions.restart();
    },
    componentDidMount: function () {
        GameStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        GameStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return <container>
                <h1>The Memory Game</h1>
                <div className="btn-toolbar" role="toolbar">
                    <div className="btn-group pull-left" role="group">
                        <button type="button" className="btn btn-default disabled"><span className="glyphicon glyphicon-star" aria-hidden="true"></span> High Score <span className="badge">{this.state.highScore}</span></button>
                        <button type="button" className="btn btn-default disabled">Current Score <span className="badge">{this.state.currentScore}</span></button>
                    </div>
                    <button type='button' onClick={this.restart} className="btn btn-primary pull-right">Restart</button>
                </div>
                <GameBoard></GameBoard>
        </container>;
    },
    /**
     * Event handler for 'change' events coming from the GameStore
     */
    _onChange: function () {
        this.setState(getStateFromStores());
    }
});

module.exports = App;