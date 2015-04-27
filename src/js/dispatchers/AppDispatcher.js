var AppConstants = require('../constants/GameConstants'),
    Dispatcher = require('flux').Dispatcher,
    assign = require('object-assign');

var PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = assign(new Dispatcher(), {
    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the view.
     */
    handleViewAction: function(action) {
        var payload = {
            source: PayloadSources.VIEW_ACTION,
            action: action
        };
        this.dispatch(payload);
    }
});

module.exports = AppDispatcher;