define(function(require) {
    'use strict';

    var ActionsView = require('views/ActionsView'),
        LogView     = require('views/LogView'),
        ItemsView   = require('views/ItemsView'),
        StatsView   = require('views/StatsView');

    var template = Handlebars.compile(require('text!templates/home.html'));

    var HomeState = Backbone.Model.extend({
        currentTab: ''
    });

    return Backbone.View.extend({
        events: {
            'click #tabs-nav a' : 'onTabClick'
        },

        initialize: function() {
            this.state = new HomeState();
            this.listenTo(this.state, 'change', this.changeTab);

            $(document).keyup(_.bind(function(e) {
                this.onKeyup(e.which);
            }, this));
        },

        onKeyup: function(key) {
            var $tab = this.$('#tabs-nav a.active');

            // up arrow
            if (key == 38) {
                var $newTab = $tab.prev();
                if (!$newTab.length) { $newTab = this.$('#tabs-nav a:last-child'); }
                this.state.set('currentTab', $newTab.data('target'));
            }
            // down arrow
            else if (key == 40) {
                var $newTab = $tab.next();
                if (!$newTab.length) { $newTab = this.$('#tabs-nav a:first-child'); }
                this.state.set('currentTab', $newTab.data('target'));
            }
        },

        onTabClick: function(e) {
            e.preventDefault();
            this.state.set('currentTab', $(e.target).data('target'));
        },

        changeTab: function() {
            var $link = this.$('#tabs-nav a[data-target=' + this.state.get('currentTab') + ']');

            this.$('.tab').hide()
            if ($link.hasClass('active')) {
                $link.removeClass('active');
                return;
            }

            this.$('#tabs-nav a').removeClass('active');
            $link.addClass('active');
            
            var $tab = this.$('#' + this.state.get('currentTab'));
            $tab.show();
        },
        
        render: function() {
            this.$el.html(template);

            // load subviews
            this.actionsView = new ActionsView().render();
            this.logView = new LogView().render();
            this.itemsView = new ItemsView().render();
            this.statsView = new StatsView().render();

            return this;
        }
    });
});
