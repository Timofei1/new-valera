/** Require CSS files **/
require('../css/main.css');

let app = function () {

    let init = function () {

        console.log('App initialized');
        app.scroller = require('./scroller');
        app.player = require('./player');
        app.gallery = require('./gallery');

    };

    return {
        init: init
    };

}();


module.exports = app;