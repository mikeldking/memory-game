var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classnames = require('classnames'),
    GameActions = require('../actions/GameActions');

/**
 * The card component
 */
var Card = React.createClass({
    mixins: [PureRenderMixin],
    render: function(){
        //construct a class names object to pass to class names
        var cardClassNames = {
            flipped: this.props.flipped,
            card: true
        };
        //set the card back icon via props so that the css does not give away the card
        var cardBackIconClass ={fa: true};
        cardBackIconClass['fa-' + this.props.type] = this.props.flipped;
        return <div onClick={(this.props.flipped) ? null : this.handleClick} className={classnames(cardClassNames)}>
            <div className='front'></div>
            <div className='back'><span className={classnames(cardBackIconClass)}></span></div>
        </div>
    },
    handleClick: function(){
        GameActions.flipCard(this.props.id);
    }
});

module.exports = Card;