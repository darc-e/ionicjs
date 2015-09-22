// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.quickQuote', {
    url: "/quickQuote",
    views: {
      'menuContent': {
        templateUrl: "templates/quickQuote.html",
        controller: 'QuickQuoteCtrl'
      }
    }
  })
  .state('app.tradeQuote', {
    url: "/tradeQuote",
    views: {
      'menuContent': {
        templateUrl: "templates/quickQuote.html",
        controller: 'TradeQuoteCtrl'
      }
    }
  })
  .state('app.holdings', {
    url: "/holdings",
    views: {
      'menuContent': {
        templateUrl: "templates/holdings.html",
        controller: 'HoldingsCtrl'
      }
    }
  })
  .state('app.holdingsList', {
    url: "/holdings/list",
    views: {
      'menuContent': {
        templateUrl: "templates/holdingsList.html",
        controller: 'HoldingsListCtrl'
      }
    }
  })

  .state('app.holdingsFilter', {
    url: "/holdings/list/filter/:filter",
    views: {
      'menuContent': {
        templateUrl: "templates/filterSelect.html",
        controller: 'HoldingsFilterCtrl'
      }
    }
  })

  .state('app.watchlist', {
    url: "/watchlist",
    views: {
      'menuContent': {
        templateUrl: "templates/watchlist.html",
        controller: 'WatchlistCtrl'
      }
    }
  })

  .state('app.watchlistDetails', {
    url: "/watchlist/:listIndex",
    views: {
      'menuContent': {
        templateUrl: "templates/watchlistDetails.html",
        controller: 'WatchlistDetailsCtrl'
      }
    }
  })

  .state('app.watchlistCreate', {
    url: "/watchlistCreate",
    views: {
      'menuContent': {
        templateUrl: "templates/watchlistCreate.html",
        controller: 'WatchlistCreateCtrl'
      }
    }
  })

  .state('app.watchlistAdd', {
    url: "/watchlistAdd/:listIndex",
    views: {
      'menuContent': {
        templateUrl: "templates/watchlistAdd.html",
        controller: 'WatchlistAddCtrl'
      }
    }
  })

  .state('app.watchlistStockDetails', {
    url: "/watchlist/:listIndex/:quoteSymbol",
    views: {
      'menuContent': {
        templateUrl: "templates/watchlistStockDetails.html",
        controller: 'watchlistStockDetailsCtrl'
      }
    }
  })

  .state('app.marketSelect', {
    url: "/marketSelect",
    views: {
      'menuContent': {
        templateUrl: "templates/marketSelect.html",
        controller: 'MarketSelectCtrl'
      }
    }
  })
  .state('app.tradeMarketSelect', {
    url: "/tradeMarketSelect",
    views: {
      'menuContent': {
        templateUrl: "templates/marketSelect.html",
        controller: 'TradeMarketSelectCtrl'
      }
    }
  })

  .state('app.quoteDetails', {
    url: "/quickQuote/:quoteSymbol",
    views: {
      'menuContent': {
        templateUrl: "templates/quoteDetails.html",
        controller: 'QuoteDetailsCtrl'
      }
    }
  })

  .state('app.watchlistsFilter', {
    url: "/quickQuote/:quoteSymbol/filter/:filter",
    views: {
      'menuContent': {
        templateUrl: "templates/filterWatchlist.html",
        controller: 'WatchlistsFilterCtrl'
      }
    }
  })

  .state('app.makeTrade', {
    url: "/makeTrade",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTrade.html",
        controller: 'MakeTradeCtrl'
      }
    }
  })
  .state('app.makeTradeSecurityAccount', {
    url: "/makeTrade/SecurityAccount",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTradeAccount.html",
        controller: 'MakeTradeSecurityAccountCtrl'
      }
    }
  })
  .state('app.makeTradeSettlementAccount', {
    url: "/makeTrade/SettlementAccount",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTradeAccount.html",
        controller: 'MakeTradeSettlementAccountCtrl'
      }
    }
  })
  .state('app.makeTradeOrderType', {
    url: "/makeTrade/OrderType",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTradeOrderType.html",
        controller: 'MakeTradeOrderTypeCtrl'
      }
    }
  })
  .state('app.makeTradeDatePicker', {
    url: "/makeTrade/DatePicker",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTradeDatePicker.html",
        controller: 'MakeTradeDatePickerCtrl'
      }
    }
  })
  .state('app.makeTradeConfirmVerify', {
    url: "/makeTrade/confirmVerify",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTradeConfirmVerify.html",
        controller: 'MakeTradeConfirmVerifyCtrl'
      }
    }
  })
  .state('app.makeTradeConfirm', {
    url: "/makeTrade/confirm",
    views: {
      'menuContent': {
        templateUrl: "templates/makeTradeConfirmVerify.html",
        controller: 'MakeTradeConfirmCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/quickQuote');
});
