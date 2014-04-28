define(function(require) {
    'use strict';

    var ActionsView = require('views/ActionsView'),
        LogView     = require('views/LogView'),
        ItemsView   = require('views/ItemsView');

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
            this.listenTo(GAME.me, 'change', function() {
                var location = GAME.me.get('location');
                if (location == '') return;

                $('#background').attr('class', location);
            });

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
            // left arrow
            else if (key == 37) {
                this.state.clear('currentTab');
            }
            // right arrow
            else if (key == 39) {
                this.state.set('currentTab', this.$('#tabs-nav a:first-child').data('target'));
            }
        },

        onTabClick: function(e) {
            e.preventDefault();
            var $newTab = $(e.target).data('target');
            if ($newTab == this.state.get('currentTab')) {
                this.state.clear('currentTab');
            } else {
                this.state.set('currentTab', $newTab);
            }
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
            var has_fire = false, has_leanto = false;
            var buildings = GAME.me.get('buildings');
            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i] == 'BUILDING_LEANTO') has_leanto = true;
                if (buildings[i] == 'BUILDING_FIRE') has_fire = true;
            }

            this.$el.html(template({
                has_fire: has_fire,
                has_leanto: has_leanto
            }));

            // load subviews
            this.actionsView = new ActionsView().render();
            this.logView = new LogView().render();
            this.itemsView = new ItemsView().render();

            // set height of bg to viewport size
            this.$('#background').css('height', window.innerHeight);

            return this;
        }
    });
});
