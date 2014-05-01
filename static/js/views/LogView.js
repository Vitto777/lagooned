define(function(require) {
    'use strict';

    var template = Handlebars.compile(require('text!templates/log.html'));

    var LOG_LENGTH = 10;
    return Backbone.View.extend({
        el: '#log',

        initialize: function() {
            this.listenTo(GAME.me, 'change', this.addToLog);
            this.lastLog = GAME.me.get('log');
        },

        addToLog: function() {
            var curLog = GAME.me.get('log');

            for (var i = 0; i < curLog.length; i++) {
                if (curLog[i][1] <= this.lastLog[0][1]) break;
                console.log(i);
                var $li = $('<li>' + curLog[i][0] + '</li>');
                this.$('ul').prepend($li);
                $li.hide().fadeIn(500);
                if (this.lastLog.length == LOG_LENGTH) {
                    this.$('ul li:last-child').remove();
                }
            }

            this.lastLog = curLog;
        },
        
        render: function() {
            this.$el.html(template({
                'log': GAME.me.get('log').map(function(L){ return L[0]; })
            }));

            return this;
        }
    });
});
