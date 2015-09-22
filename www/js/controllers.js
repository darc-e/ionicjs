angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $location, $rootScope, $ionicConfig) {
  $rootScope.allStocks = stockData;
  $ionicConfig.views.maxCache(0);
  // Transaction object defined globally to pass between views
  $rootScope.transaction = initialTransactionState;
  $rootScope.holdingsFilters = holdingsFilters;
  $rootScope.userStocks = userStocks;
  $rootScope.watchLists = watchLists;
    $scope.doBack = function (desiredPath) {
      if ($rootScope.customStock) {$rootScope.customStock.enteredCode = '';}
      if (typeof desiredPath === 'string') {
        $location.path(desiredPath);
      } else {
        window.history.back();      
      }
    };
})

.controller('QuickQuoteCtrl', function($scope, $rootScope, $location) {
  $scope.customStock = {};
  $rootScope.transaction = {securityAccount: "Default Security Account", stockCode: "", settlementAccount: "", orderType: "", transactionType: "buy", price: "", quantity: "", date: "2015-05-08"};
  $rootScope.customStock = $rootScope.customStock || {selectedMarket:'HK',enteredStock:''};
  $scope.customStock = $rootScope.customStock;
  $scope.isTransaction = false;
  $scope.buttonText = 'Quote';
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:true },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  $scope.recentStocks = [];
  $scope.recentStocks.push($rootScope.allStocks['HK'][202]);
  $scope.recentStocks.push($rootScope.allStocks['SG'][100]);
  $scope.recentStocks.push($rootScope.allStocks['SG'][50]);
  $scope.recentStocks.push($rootScope.allStocks['US'][4]);
  $scope.recentStocks.push($rootScope.allStocks['HK'][230]);
  $scope.toggleDropNav = function () {
    $scope.dropNavExpanded = !$scope.dropNavExpanded;
  };
  $scope.doNavigate = function (desiredPath) {
    if (desiredPath) {
      $scope.dropNavExpanded = false;
      $location.path('app/'+desiredPath);
      console.log('Nai');
    }
  };
  $scope.goToQuoteDetails = function (stockSymbol) {
    stockSymbol = stockSymbol || $scope.customStock.enteredStock;
    stockSymbol = stockSymbol.replace(/<[^>]+>/g, '').toUpperCase();
    $location.path('app/quickQuote/'+stockSymbol);
  };
  $scope.stockCodeChange = function () {
    var enteredCode = $scope.customStock.enteredStock.toLowerCase();
    var searchStocks = [];
    var exactMatch = false;

    for (var i = 0; i < $rootScope.allStocks[$scope.customStock.selectedMarket].length; i++) {
      if (enteredCode.length >= 3) {
        if (($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol.toLowerCase().indexOf(enteredCode) != -1 || $rootScope.allStocks[$scope.customStock.selectedMarket][i].Name.toLowerCase().indexOf(enteredCode) != -1) && searchStocks.length <= 31) {
          var currentStockData = JSON.parse(JSON.stringify($rootScope.allStocks[$scope.customStock.selectedMarket][i]));
          currentStockData.Name = currentStockData.Name.replace(new RegExp( enteredCode , 'gi' ), '<b>'+enteredCode+'</b>');
          currentStockData.Symbol = currentStockData.Symbol.replace(new RegExp( enteredCode , 'gi' ), '<b>'+enteredCode+'</b>');
          searchStocks.push(currentStockData);
        }
        if (searchStocks.length > 0) {
          $scope.searchLength = searchStocks.length;
          $scope.searchStocks = searchStocks;
        } else {
          $scope.searchStocks = undefined;
        }
      } else {
        $scope.searchStocks = undefined;
      }
      if ($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol.toLowerCase() === enteredCode) {
        exactMatch = true;
      }
    }
    document.getElementById('quoteBTN').disabled = !exactMatch;
  }
})
.controller('TradeQuoteCtrl', function($scope, $rootScope, $location) {
  $scope.customStock = {};
  $rootScope.customTradeStock = $rootScope.customTradeStock || {selectedMarket:'HK',enteredStock:''};
  $scope.customStock = $rootScope.customTradeStock;
  $scope.buttonText = 'Use Code';
  $scope.isTransaction = true;
  $scope.hasDropNav = false;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [];
  $scope.recentStocks = [];
  $scope.recentStocks.push($rootScope.allStocks['HK'][202]);
  $scope.recentStocks.push($rootScope.allStocks['SG'][100]);
  $scope.recentStocks.push($rootScope.allStocks['SG'][50]);
  $scope.recentStocks.push($rootScope.allStocks['US'][4]);
  $scope.recentStocks.push($rootScope.allStocks['HK'][230]);
  $scope.toggleDropNav = function () {
    $scope.dropNavExpanded = !$scope.dropNavExpanded;
  };
  $scope.doNavigate = function (desiredPath) {
    if (desiredPath) {
      $scope.dropNavExpanded = false;
      $location.path('app/'+desiredPath);
    }
  };
  $scope.goToQuoteDetails = function (stockSymbol) {
    stockSymbol = stockSymbol || $scope.customStock.enteredStock;
    stockSymbol = stockSymbol.replace(/<[^>]+>/g, '').toUpperCase();
    // Determine market the long way around... prototype!
    for (marketName in $rootScope.allStocks) {
      for (var l = 0; l < $rootScope.allStocks[marketName].length; l++) {
        if ($rootScope.allStocks[marketName][l].Symbol === stockSymbol) {
          var currentStock = JSON.parse(JSON.stringify($rootScope.allStocks[marketName][l]));
          $scope.customStock.selectedMarket = marketName;
        }
      };
    };
    currentStock.Name = currentStock.Name.replace(/<[^>]+>/g, '');
    currentStock.Symbol = currentStock.Symbol.replace(/<[^>]+>/g, '').toUpperCase();
    $rootScope.transaction.stockCode = [$scope.customStock.selectedMarket,stockSymbol,currentStock];
    $rootScope.transaction.settlementAccount = 'Default Security Account';
    $rootScope.transaction.orderType = 'Normal Order';
    window.history.back();
  };
  $scope.stockCodeChange = function () {
    var enteredCode = $scope.customStock.enteredStock.toLowerCase();
    var searchStocks = [];
    var exactMatch = false;

    for (var i = 0; i < $rootScope.allStocks[$scope.customStock.selectedMarket].length; i++) {
      if (enteredCode.length >= 3) {
        if ($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol.toLowerCase().indexOf(enteredCode) != -1 || $rootScope.allStocks[$scope.customStock.selectedMarket][i].Name.toLowerCase().indexOf(enteredCode) != -1) {
          var currentStockData = JSON.parse(JSON.stringify($rootScope.allStocks[$scope.customStock.selectedMarket][i]));
          currentStockData.Name = currentStockData.Name.replace(new RegExp( enteredCode , 'gi' ), '<b>'+enteredCode+'</b>');
          currentStockData.Symbol = currentStockData.Symbol.replace(new RegExp( enteredCode , 'gi' ), '<b>'+enteredCode+'</b>');
          searchStocks.push(currentStockData);
        }
        if (searchStocks.length > 0) {
          $scope.searchLength = searchStocks.length;
          $scope.searchStocks = searchStocks;
        } else {
          $scope.searchStocks = undefined;
        }
      } else {
        $scope.searchStocks = undefined;
      }
      if ($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol.toLowerCase() === enteredCode) {
        exactMatch = true;
      }
    }
    document.getElementById('quoteBTN').disabled = !exactMatch;
  }
})
.controller('MarketSelectCtrl', function($scope, $rootScope, $location) {
    $scope.doSelectMarket = function (market) {
      $rootScope.customStock.selectedMarket = market;
      $rootScope.customStock.enteredStock = '';
      window.history.back();
    };
})
.controller('TradeMarketSelectCtrl', function($scope, $rootScope, $location) {
    $scope.doSelectMarket = function (market) {
      $rootScope.customTradeStock.selectedMarket = market;
      $rootScope.customTradeStock.enteredStock = '';
      window.history.back();
    };
})
.controller('QuoteDetailsCtrl', function($scope, $rootScope, $location, $stateParams, $timeout) {
  $scope.changePositive = true;
  $scope.detailsExpanded = false;
  $scope.activeTab = $scope.activeTab || 'statistics';
  $scope.datePhrase = 'As of 10:23 pm on 1/1/2015';
  $scope.chart = {period:'day'};
  $scope.stockOwned = false;
  $scope.customStock = $rootScope.customStock = {enteredStock:$stateParams.quoteSymbol};
  $scope.watchlists = angular.copy($rootScope.watchLists);
  $scope.filterArray = {};
  $scope.filterText = {};
  $scope.hasDropNav = false;
  $scope.dropNavExpanded = false;
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:true },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  // Determine market the long way around... prototype!
  for (marketName in $rootScope.allStocks) {
    for (var l = 0; l < $rootScope.allStocks[marketName].length; l++) {
      if ($rootScope.allStocks[marketName][l].Symbol === $scope.customStock.enteredStock) {
        $rootScope.customStock.selectedMarket = $scope.customStock.selectedMarket = marketName;
      }
    };
  };
  // Determine which stock to display
  for (var i = 0; i < $rootScope.allStocks[$scope.customStock.selectedMarket].length; i++) {
    if ($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol === $stateParams.quoteSymbol) {
      $scope.currentStock = JSON.parse(JSON.stringify($rootScope.allStocks[$scope.customStock.selectedMarket][i]));
    }
  };
  if (String($scope.currentStock.Change).indexOf('-') !== -1 || String($scope.currentStock.ChangePercent).indexOf('-') !== -1) {
    $scope.currentStock.ChangeDirection = 'negative';
  } else if (Number($scope.currentStock.Change) == 0 && Number($scope.currentStock.ChangePercent) == 0) {
    $scope.currentStock.ChangeDirection = 'no-change';
  } else {
    $scope.currentStock.ChangeDirection = 'positive';
  }  

  $scope.currentStock.PrevClose = parseFloat($scope.currentStock.Close) + parseFloat($scope.currentStock.Change)
  // Determine if stock is owned
  angular.forEach($rootScope.userStocks, function (currentStock) {
    if (currentStock.Symbol === $scope.customStock.enteredStock) {
      $scope.ownedInfo = angular.copy(currentStock);
      $scope.stockOwned = true;
    }
  })

  angular.forEach($rootScope.watchLists, function (filterData, currentFilter) {
      var allChecked = true;
      $scope.filterArray = [];
      angular.forEach(filterData, function (currentOption) {
        if (currentOption.isActive) {
          $scope.filterArray.push(currentOption.id);
        } else {
          allChecked = false;  
        }
      });
      if (allChecked) {
        $scope.filterText[currentFilter] = 'All';
      } else {        
        $scope.filterText[currentFilter] = $scope.filterArray.join(', ')
      }
    });
  $scope.toggleDropNav = function () {
    $scope.dropNavExpanded = !$scope.dropNavExpanded;
  };
  $scope.chartPeriod = function (desiredPeriod) {
    $scope.chart.period = desiredPeriod || 'day';
  }
  $scope.doTabSwitch = function (desiredTab) {
    $scope.activeTab = desiredTab;
  };
  $scope.doDetailsExpand = function () {
    $scope.detailsExpanded = !$scope.detailsExpanded;
  };
  $scope.doNavigate = function (desiredPath,transactionType, linkHash) {
    if (desiredPath) {
      if (desiredPath === 'makeTrade') {
        $rootScope.transaction.stockCode = [$scope.customStock.selectedMarket,$scope.currentStock.Symbol,$scope.currentStock];
        $rootScope.transaction.transactionType = transactionType;
        $rootScope.transaction.settlementAccount = 'Default Security Account';
        $rootScope.transaction.orderType = 'Normal Order';
      }
      if (linkHash) {
        window.location.href = window.location.href.replace(/#.*/,'')+'#/app/'+desiredPath+'#'+linkHash;
      } else {      
        $location.path('app/'+desiredPath);
      }
    }
  };
  $scope.doRefresh = function () {
    $scope.$broadcast('scroll.refreshComplete');
    var today = new Date();
    var currentHour = parseInt(today.getHours());
    var currentMinute = String(today.getMinutes());
    var AmPm = 'am';
    var twelveHour = [12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
    currentHour = twelveHour[currentHour];
    if (today.getHours() > 12) {
      AmPm = 'pm';
    }
    if (currentMinute.length === 1) {
      currentMinute = '0'+currentMinute
    }
    $timeout(function(){
      $scope.datePhrase = 'As of '+currentHour+':'+currentMinute+' '+AmPm+' on '+(today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    }, 900);
  }
  $scope.doTabSwitch($scope.activeTab);
})

  .controller('MakeTradeCtrl', function($scope, $rootScope, $location, $ionicModal, $ionicScrollDelegate, $timeout) {
    $scope.dropNavExpanded = false;
    $scope.isValid = false;
    $scope.isTransaction = true;
    $rootScope.isTransaction = $scope.isTransaction;
    $scope.buyingPower = 105665.11;
    $scope.changePositive = true;
    $scope.detailsExpanded = false;
    $scope.activeTab = $scope.activeTab || 'statistics';
    $scope.datePhrase = 'As of 10:23 pm on 1/1/2015';
    $scope.chart = {period:'day'};
    $rootScope.customTradeStock = {selectedMarket:'HK',enteredStock:''};
    $rootScope.customStock = {selectedMarket:'HK',enteredStock:''};
    $scope.cost = $scope.transaction.price * $scope.transaction.quantity;
    $scope.transaction = $rootScope.transaction;
    $scope.menuItems = [
      { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
      { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:true },
      { title: 'View Trade Status', id: 3, link: '', isActive:false },
      { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
      { title: 'Corporate Actions', id: 5, link: '', isActive:false },
      { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
      { title: 'Market News', id: 7, link: '', isActive:false },
      { title: 'Account Information', id: 8, link: '', isActive:false }
    ];
    if ($scope.transaction.stockCode[2]) {
      if ($scope.transaction.stockCode[2].Change.toString().indexOf('-') != -1) {
        $scope.changePositive = false;
      }
    }
    $timeout(function () {
        $ionicScrollDelegate.$getByHandle('page-content').anchorScroll(false);
      },100);
    $timeout(function () {
        window.location.href = window.location.href.replace(/#[A-Z|a-z].+/,'');
      },300);
    $scope.doNavigate = function (desiredPath) {
      if (desiredPath) {
        $scope.dropNavExpanded = false;
        $location.path('app/'+desiredPath);
      }
    };
    $scope.hasCost = function() {
      var result = false;
      var cost = $scope.cost; 
      if (cost > 0) {
        result = true;
      }
      return result;
    }
    $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
    $scope.doUpdateBuySell = function(state) {
      $rootScope.transaction.transactionType = state;
      $scope.transaction = $rootScope.transaction;
    };
    $scope.updatePrice = function() {
      var value = document.getElementById('maketradeprice').value;
      $rootScope.transaction.price = value;
      $scope.cost = $scope.transaction.price * $scope.transaction.quantity;
      $scope.transaction = $rootScope.transaction;
      $scope.isAffordable();
      $scope.validate();
    };
    $scope.updateQuantity = function() {
      var quantityField = document.getElementById('maketradequantity');
      var value = quantityField.value;
      $rootScope.transaction.quantity = value;
      $scope.cost = $scope.transaction.price * $scope.transaction.quantity;
      $scope.transaction = $rootScope.transaction;
      if (value % 200 != 0) {
        quantityField.stepUp(1);
      }
      $scope.isAffordable();
      $scope.validate();
    };
    $scope.stepQuantity = function (direction) {
      var quantityField = document.getElementById('maketradequantity');
      if (direction === 'up') {
        quantityField.stepUp(1);
      }
      if (direction === 'down') {
        quantityField.stepDown(1);
      }
      $scope.updateQuantity();
    };
    $scope.isAffordable = function() {
      var result = false;
      if ($scope.cost < $scope.buyingPower) {
        result = true;
      }
      return result;
    };
    $scope.chartPeriod = function (desiredPeriod) {
      $scope.chart.period = desiredPeriod || 'day';
    }
    $scope.doTabSwitch = function (desiredTab) {
      $scope.activeTab = desiredTab;
    };
    $scope.doDetailsExpand = function () {
      $scope.detailsExpanded = !$scope.detailsExpanded;
      $timeout(function () {
        $ionicScrollDelegate.$getByHandle('page-content').resize();
      },300);
    };
    $scope.doRefresh = function () {
      var today = new Date();
      var currentHour = parseInt(today.getHours());
      var currentMinute = String(today.getMinutes());
      var AmPm = 'am';
      var twelveHour = [12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
      currentHour = twelveHour[currentHour];
      if (today.getHours() > 12) {
        AmPm = 'pm';
      }
      if (currentMinute.length === 1) {
        currentMinute = '0'+currentMinute
      }
      $scope.datePhrase = 'As of '+currentHour+':'+currentMinute+' '+AmPm+' on '+(today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    }
    $scope.doTabSwitch($scope.activeTab);
    // Modal Stuff
    $ionicModal.fromTemplateUrl('templates/cancelModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    $scope.validate = function() {
      var result = true;
      if ($scope.transaction.stockCode === '') {
        result = false;
      }
      if ($scope.transaction.settlementAccount === '') {
        result = false;
      }
      if ($scope.transaction.orderType === '') {
        result = false;
      }
      if ($scope.transaction.price === '') {
        result = false;
      }
      if ($scope.transaction.quantity === '') {
        result = false;
      }
      if (!$scope.isAffordable()) {
        result = false;
      } 
      $scope.isValid = result;
    };
    $scope.validate();
    $scope.doCancel = function() {
      $scope.transaction = { securityAccount: "Default Security Account", stockCode: "", settlementAccount: "", orderType: "", transactionType: "buy", price: "", quantity: "", date: "2015-05-08"};
      $rootScope.transaction = $scope.transaction;
      $ionicScrollDelegate.scrollTop();
      document.getElementById('maketradeprice').value = $rootScope.transaction.price;
      document.getElementById('maketradequantity').value = $rootScope.transaction.quantity;
      $scope.validate();
      $scope.closeModal();
    };
    $scope.doContinue = function() {
      $location.path('app/makeTrade/confirmVerify');
    }
  })
  .controller('MakeTradeSecurityAccountCtrl', function($scope, $rootScope) {
    $scope.title = "Select Security Account";
    $scope.options = [
      { title: 'Default Security Acount', id: 6932 },
      { title: 'Security Account A', id: 6932 },
      { title: 'Security Account B', id: 9004 },
      { title: 'Security Account C', id: 9004 },
    ];
    $scope.doUpdate = function(account){
      $rootScope.transaction.securityAccount = account;
      window.history.back();
    }
  })
  .controller('MakeTradeSettlementAccountCtrl', function($scope, $rootScope) {
    $scope.title = "Select Settlement Account";
    $scope.options = [
      { title: 'Default Settlement Acount', id: '0001' },
      { title: 'Settlement Account A', id: '0001' },
      { title: 'Settlement Account B', id: '0002' }
    ];
    $scope.doUpdate = function(account){
      $rootScope.transaction.settlementAccount = account;
      window.history.back();
    }
  })
  .controller('MakeTradeOrderTypeCtrl', function($scope, $rootScope) {
    $scope.title = "Select Order Type";
    $scope.options = [
      { title: 'Order', types: ['Normal Order', 'Market Order']},
      { title: 'Auction Order', types: ['At Auction Limit', 'At Auction'] },
      { title: 'Stop Loss Order', types: ['Stop Loss Limit', 'Stop Loss Market'] }
    ];
    $scope.doUpdate = function(type){
      $rootScope.transaction.orderType = type;
      window.history.back();
    }
  })
  .controller('MakeTradeDatePickerCtrl', function($scope, $rootScope) {
    $scope.currentVal = $rootScope.transaction.date;
    $scope.title = "Choose Date";
    $scope.doUpdate = function(){
      var day = document.getElementById('TheDate').value;
      $rootScope.transaction.date = day;
      window.history.back();
    }
  })
  .controller('MakeTradeConfirmVerifyCtrl', function($scope, $rootScope, $location) {
    $scope.title = "Confirm your order";
    $scope.menuItems = [
      { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
      { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:true },
      { title: 'View Trade Status', id: 3, link: '', isActive:false },
      { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
      { title: 'Corporate Actions', id: 5, link: '', isActive:false },
      { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
      { title: 'Market News', id: 7, link: '', isActive:false },
      { title: 'Account Information', id: 8, link: '', isActive:false }
    ];
    $scope.doNavigate = function (desiredPath) {
      if (desiredPath) {
        $scope.dropNavExpanded = false;
        $location.path('app/'+desiredPath);
      }
    };
    $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
    $scope.transaction.transactionCost = $scope.transaction.price * $scope.transaction.quantity;
    $scope.transaction.Fees = 55.00;
    $scope.transaction.transactionTotal = $scope.transaction.transactionCost + $scope.transaction.Fees;
    $scope.transaction = $rootScope.transaction;
    $scope.isConfirmed = false;
    $scope.pageTitle = "Review Trade";
    $scope.doCancel = function() {
      window.history.back();
    };
  })
  .controller('MakeTradeConfirmCtrl', function($scope, $rootScope, $location) {
    $scope.title = "Confirmed";
    $scope.menuItems = [
      { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
      { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:true },
      { title: 'View Trade Status', id: 3, link: '', isActive:false },
      { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
      { title: 'Corporate Actions', id: 5, link: '', isActive:false },
      { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
      { title: 'Market News', id: 7, link: '', isActive:false },
      { title: 'Account Information', id: 8, link: '', isActive:false }
    ];
    $scope.doNavigate = function (desiredPath) {
      if (desiredPath) {
        $scope.dropNavExpanded = false;
        $location.path('app/'+desiredPath);
      }
    };
    $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
    $scope.transaction = $rootScope.transaction;
    $scope.isConfirmed = true;
    $scope.pageTitle = "Trade Confirmation";
    $scope.doStartOver = function() {
      $scope.transaction = { securityAccount: "Default Security Account", stockCode: "", settlementAccount: "", orderType: "", transactionType: "buy", price: "", quantity: "", date: "2015-05-08"};
      $rootScope.transaction = $scope.transaction;
      $location.path('app/makeTrade');
    };
  })
  .controller('HoldingsFilterCtrl', function($scope, $rootScope, $stateParams, $location) {
    $scope.filter = $stateParams.filter || 'markets';
    $scope.holdingsFilters = angular.copy($rootScope.holdingsFilters);

    $scope.selectAll = true;
    $scope.isValid = true;
    $scope.titles = {
      Market: "MARKETS: Available Markets",
      Account: "ACCOUNTS: Available Accounts"
    };


    $scope.doUpdate = function(account){
      $rootScope.transaction.securityAccount = account;
      window.history.back();
    }
    angular.forEach($scope.holdingsFilters[$scope.filter], function (currentOption) {
      if (!currentOption.isActive) {
        $scope.selectAll = false;
      }
    });
    $scope.toggleAllOptions = function () {
      $scope.selectAll = !$scope.selectAll;
      angular.forEach($scope.holdingsFilters[$scope.filter], function (currentOption) {
        currentOption.isActive = $scope.selectAll;
      });
      $scope.isValid = $scope.selectAll;
    }
    $scope.checkOptions = function () {
      var optionSelected = false;
      angular.forEach($scope.holdingsFilters[$scope.filter], function (currentOption) {
        if (currentOption.isActive) {
          optionSelected = true;
        }
      });
      $scope.isValid = optionSelected;
    }
    $scope.doSave = function () {
      $rootScope.holdingsFilters = angular.copy($scope.holdingsFilters);
      window.history.back(); 
    }
  })
  .controller('HoldingsListCtrl', function($scope, $rootScope, $location) {
    $scope.hasDropNav = true;
    $scope.dropNavExpanded = false;
    $scope.filterArray = {};
    $scope.filterText = {};
    $scope.sortBy = $scope.sortBy || 'Market';
    $scope.stockListView = [];
    $scope.menuItems = [
      { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
      { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
      { title: 'View Trade Status', id: 3, link: '', isActive:false },
      { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:true },
      { title: 'Corporate Actions', id: 5, link: '', isActive:false },
      { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
      { title: 'Market News', id: 7, link: '', isActive:false },
      { title: 'Account Information', id: 8, link: '', isActive:false }
    ];
    // $scope.holdingsFilters = $rootScope.holdingsFilters;

    angular.forEach($rootScope.holdingsFilters, function (filterData, currentFilter) {
      var allChecked = true;
      $scope.filterArray[currentFilter] = [];
      angular.forEach(filterData, function (currentOption) {
        if (currentOption.isActive) {
          $scope.filterArray[currentFilter].push(currentOption.id);
        } else {
          allChecked = false;  
        }
      });
      if (allChecked) {
        $scope.filterText[currentFilter] = 'All';
      } else {        
        $scope.filterText[currentFilter] = $scope.filterArray[currentFilter].join(', ')
      }
    });
    angular.forEach($rootScope.userStocks, function (userStock) {
      angular.forEach($rootScope.allStocks[userStock.Market], function (currentStock) {
        if (currentStock.Symbol === userStock.Symbol) {
          angular.forEach(currentStock, function (stockValue, stockKey) {
            userStock[stockKey] = stockValue;
          });
          if (String(userStock.Change).indexOf('-') !== -1 || String(userStock.ChangePercent).indexOf('-') !== -1) {
            userStock.ChangeDirection = 'negative';
          } else if (Number(userStock.Change) == 0 && Number(userStock.ChangePercent) == 0) {
            userStock.ChangeDirection = 'no-change';
          } else {
            userStock.ChangeDirection = 'positive';
          }
          console.log(userStock.ChangeDirection);
        }
      });
    });
    $scope.changeSorting = function (sorting) {
      $scope.sortBy = sorting;
      $scope.stockListView = [];
      angular.forEach($rootScope.userStocks, function (stockData) {
        var sectionMatched = false;
        var filterOut = false;
        angular.forEach($scope.filterArray, function (filterContent,filterType) {
          if (filterContent.indexOf(stockData[filterType]) === -1) {
            filterOut = true;
          }
        });
        angular.forEach($scope.stockListView, function (sectionData) {
          if (sectionData.title === stockData[sorting]) {
            if (!filterOut) {
              sectionData.stocks.push(stockData);
              sectionMatched = true;
            }
          }
        });
        if (!sectionMatched && $scope.filterArray[sorting].indexOf(stockData[sorting]) !== -1 && !filterOut) {
          $scope.stockListView.push({title:stockData[sorting],stocks:[stockData]});
        }
      });
    }
    $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
    $scope.doNavigate = function (desiredPath) {
      if (desiredPath) {
        $scope.dropNavExpanded = false;
        $location.path('app/'+desiredPath);
      }
    };
    $scope.changeSorting($scope.sortBy);
  })
  .controller('HoldingsCtrl', function($scope, $rootScope, $location) {
    $scope.hasDropNav = true;
    $scope.dropNavExpanded = false;
    $scope.menuItems = [
      { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
      { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
      { title: 'View Trade Status', id: 3, link: '', isActive:false },
      { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:true },
      { title: 'Corporate Actions', id: 5, link: '', isActive:false },
      { title: 'Watchlist', id: 6, link: 'watchlist', isActive:false },
      { title: 'Market News', id: 7, link: '', isActive:false },
      { title: 'Account Information', id: 8, link: '', isActive:false }
    ];
    $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
    $scope.doNavigate = function (desiredPath) {
      if (desiredPath) {
        $scope.dropNavExpanded = false;
        $location.path('app/'+desiredPath);
      }
    };
  })
.controller('WatchlistCtrl', function($scope, $rootScope, $location) {
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:true },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  $scope.watchLists = angular.copy($rootScope.watchLists);

  var changeTotal = 0;
  var changePercent = 0;
  var changeAvg = 0;
  var percentAvg = 0;
  var numItems = 0;
  /*Get changePositive value and get itemCount*/
  for (var i = 0; i < $scope.watchLists.length; i++) { 
    changeTotal = 0;
    changePercent = 0;
    changeAvg = 0;
    percentAvg = 0;
    numItems = $scope.watchLists[i].items.length;
    $scope.watchLists[i].itemCount = numItems;
    if (numItems > 0) {
      angular.forEach($scope.watchLists[i].items, function (items) {
        changeTotal += parseFloat(items.item.Change);
        changePercent += parseFloat(items.item.ChangePercent);
      });
      changeAvg = changeTotal ;
      percentAvg = changePercent ;
    }
    
    $scope.watchLists[i].changeTotal = changeAvg;
    $scope.watchLists[i].changePercent = percentAvg;

    if (typeof $scope.watchLists[i].changeTotal === 'number') $scope.watchLists[i].changeTotal = $scope.watchLists[i].changeTotal.toFixed(2);
    if (typeof $scope.watchLists[i].changePercent === 'number') $scope.watchLists[i].changePercent = $scope.watchLists[i].changePercent.toFixed(2);

    if (String(changeAvg).indexOf('-') !== -1 || String(percentAvg).indexOf('-') !== -1) {
      $scope.watchLists[i].ChangeDirection = 'negative';
    } else if (Number(changeAvg) == 0 && Number(percentAvg) == 0) {
      $scope.watchLists[i].ChangeDirection = 'no-change';
    } else {
      $scope.watchLists[i].ChangeDirection = 'positive';
    }   
  };
  $scope.toggleDropNav = function () {
    $scope.dropNavExpanded = !$scope.dropNavExpanded;
  };
  $scope.doNavigate = function (desiredPath) {
    if (desiredPath) {
      $scope.dropNavExpanded = false;
      $location.path('app/'+desiredPath);
    }
  };
  $scope.goToWatchListDetails = function (listIndex) {
    listId = listIndex ;
    listId = listId.replace(/<[^>]+>/g, '');
    $rootScope.watchLists = angular.copy($scope.watchLists);
    $location.path('app/watchlist/'+listId);
  };

})

.controller('WatchlistDetailsCtrl', function($scope, $rootScope, $location, $stateParams, $timeout, $ionicModal) {
  $scope.changePositive = true;
  $scope.changeNone = false;
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.isDelete = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:true },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  $scope.watchLists = angular.copy($rootScope.watchLists);
  $scope.listId = $stateParams.listIndex;

  $scope.calcChange= function(currentList){
    //get average change
    var changeTotal = 0;
    var changePercent = 0;
    var changeAvg = 0;
    var percentAvg = 0;
    var numItems = $scope.currentList.items.length
    currentList.itemCount = numItems;
    if (numItems > 0) {
      angular.forEach(currentList.items, function (items) {
        changeTotal += parseFloat(items.item.Change);
        changePercent += parseFloat(items.item.ChangePercent);
      });
      changeAvg = changeTotal;
      percentAvg = changePercent ;
    }
      
    currentList.changeTotal = changeAvg;
    currentList.changePercent = percentAvg;
    
    if (typeof currentList.changeTotal === 'number') currentList.changeTotal = currentList.changeTotal.toFixed(2);
    if (typeof currentList.changePercent === 'number') currentList.changePercent = currentList.changePercent.toFixed(2);

    if (String(currentList.changeTotal).indexOf('-') !== -1 || String(currentList.changePercent).indexOf('-') !== -1) {
      currentList.ChangeDirection = 'negative';
    } else if (Number(currentList.changeTotal) == 0 && Number(currentList.changePercent) == 0) {
      currentList.ChangeDirection = 'no-change';
    } else {
      currentList.ChangeDirection = 'positive';
    }  
  };
  // display watchlist with selected index
  if ($scope.listId){
    $scope.currentList = angular.copy($scope.watchLists[$scope.listId]);
    //console.log($scope.currentList);
    $scope.calcChange($scope.currentList);
    $scope.watchLists[$scope.listId] = $scope.currentList;
  }
  
  angular.forEach($scope.currentList.items, function (currentListItems) {
    $scope.currentItem = currentListItems.item;
    if (typeof $scope.currentItem.Change === 'number') $scope.currentItem.Change = $scope.currentItem.Change.toFixed(2);
    if (typeof $scope.currentItem.ChangePercent === 'number') $scope.currentItem.ChangePercent = $scope.currentItem.ChangePercent.toFixed(2);
    if (String($scope.currentItem.Change).indexOf('-') !== -1 || String($scope.currentItem.ChangePercent).indexOf('-') !== -1) {
      $scope.currentItem.ChangeDirection = 'negative';
    } else if (Number($scope.currentItem.Change) == 0 && Number($scope.currentItem.ChangePercent) == 0) {
      $scope.currentItem.ChangeDirection = 'no-change';
    } else {
      $scope.currentItem.ChangeDirection = 'positive';
    }         
  });

  //watchlist delete modal
  $ionicModal.fromTemplateUrl('templates/deleteModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(listIndex) {
    $scope.listDeleteId = listIndex;
    $scope.modal.show(listIndex);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
  $scope.doNavigate = function (desiredPath, listId) {
    if (desiredPath) {
      $scope.dropNavExpanded = false;
      if (listId) {
        $location.path('app/'+desiredPath+'/'+listId);
      } else {
        $location.path('app/'+desiredPath);
      }
    }
  };
  $scope.showDeleteWatchList = function () {
    $scope.isDelete = true;
  };
  $scope.hideDeleteWatchList = function () {
    $scope.isDelete = false;
  };

  $scope.doDeleteWatchList = function () {
    //delete entire watchlist
    $scope.closeModal();
    $scope.watchLists.splice($scope.listDeleteId, 1); 
    $rootScope.watchLists = angular.copy($scope.watchLists);
    $location.path('app/watchlist');
  };

  $scope.doDeleteWatchListItem = function (itemIndex) {
    //delete it from current list
    $scope.currentList.items.splice(itemIndex, 1); 
    //recalculate change
    $scope.calcChange($scope.currentList);
    $scope.watchLists[$scope.listId] = $scope.currentList;
    $rootScope.watchLists = angular.copy($scope.watchLists);
  };
})

.controller('WatchlistCreateCtrl', function($scope, $rootScope, $location) {  
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:true },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  $scope.watchLists = angular.copy($rootScope.watchLists);
  $scope.isValid = false;
  $scope.watchlistName = '';
  $scope.addWatchlist = function (listName){
    if (listName.length > 0){
      $scope.isValid = true;
      $scope.watchlistName = listName;
    } else {
      $scope.isValid = false;
    }
  }
  $scope.toggleDropNav = function () {
      $scope.dropNavExpanded = !$scope.dropNavExpanded;
    };
  $scope.doNavigate = function (desiredPath) {
    if (desiredPath) {
      $scope.dropNavExpanded = false;
      $location.path('app/'+desiredPath);
    }
  };
  $scope.doCancel = function() {
      window.history.back();
  };
  $scope.doContinue = function(listname) {
    $scope.watchLists.push({name:$scope.watchlistName, itemCount: 0, items: [], changePositive: true, changeTotal: 0, changePercent: 0});
    var pushedIndex = $scope.watchLists.length - 1;
    $rootScope.watchLists = angular.copy($scope.watchLists);
    $location.path('app/watchlist/'+pushedIndex);
  }

})

.controller('WatchlistAddCtrl', function($scope, $rootScope, $location, $stateParams, $timeout) {
  $scope.customStock = {};
  $rootScope.transaction = {securityAccount: "Default Security Account", stockCode: "", settlementAccount: "", orderType: "", transactionType: "buy", price: "", quantity: "", date: "2015-05-08"};
  $rootScope.customStock = $rootScope.customStock || {selectedMarket:'HK',enteredStock:''};
  $scope.customStock = $rootScope.customStock;
  $scope.isTransaction = false;
  $scope.buttonText = 'Search';
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:true },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  $scope.recentStocks = [];
  $scope.recentStocks.push($rootScope.allStocks['HK'][202]);
  $scope.recentStocks.push($rootScope.allStocks['HK'][100]);
  $scope.recentStocks.push($rootScope.allStocks['HK'][50]);
  $scope.recentStocks.push($rootScope.allStocks['HK'][4]);
  $scope.recentStocks.push($rootScope.allStocks['HK'][230]);
  $scope.watchLists = angular.copy($rootScope.watchLists);
  //console.log($scope.recentStocks);
  $scope.listId = $stateParams.listIndex;

  $scope.toggleDropNav = function () {
    $scope.dropNavExpanded = !$scope.dropNavExpanded;
  };
  $scope.doNavigate = function (desiredPath) {
    if (desiredPath) {
      $scope.dropNavExpanded = false;
      $location.path('app/'+desiredPath);
      console.log('Nai');
    }
  };
  //for adding recently serached items to list
  $scope.setstockId = function(stockSymbol, itemMarket){
    var stockId = 0;
    //set currrent watchlist that stock belongs to
    if (itemMarket){
      for (var i = 0; i < $rootScope.allStocks[itemMarket].length; i++) {
        if ($rootScope.allStocks[itemMarket][i].Symbol === stockSymbol) {
          stockId = i;
        }
      }
      //add to watchlist
    }
    $scope.addToWatchlist(stockId, itemMarket);
  }
  $scope.goToQuoteDetails = function (stockSymbol) {
    stockSymbol = stockSymbol || $scope.customStock.enteredStock;
    stockSymbol = stockSymbol.replace(/<[^>]+>/g, '').toUpperCase();
    $location.path('app/watchlist/' + $scope.listId + "/" +stockSymbol);
  };
  $scope.addToWatchlist = function (itemIndex, itemMarket){
    //console.log (itemIndex + "," + itemMarket);
    if (itemMarket.length > 0) {
      var stockData = $rootScope.allStocks[itemMarket][itemIndex];
      $scope.watchLists[$scope.listId].items.push({item: stockData, Code:'00089', Account:6932});
    }
    $rootScope.watchLists = angular.copy($scope.watchLists);
    $location.path('app/watchlist/'+$scope.listId);
  }
  $scope.stockCodeChange = function () {
    var enteredCode = $scope.customStock.enteredStock.toLowerCase();
    var searchStocks = [];
    var exactMatch = false;

    for (var i = 0; i < $rootScope.allStocks[$scope.customStock.selectedMarket].length; i++) {
      if (enteredCode.length >= 3) {
        if (($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol.toLowerCase().indexOf(enteredCode) != -1 || $rootScope.allStocks[$scope.customStock.selectedMarket][i].Name.toLowerCase().indexOf(enteredCode) != -1) && searchStocks.length <= 31) {
          var currentStockData = JSON.parse(JSON.stringify($rootScope.allStocks[$scope.customStock.selectedMarket][i]));
          currentStockData.Name = currentStockData.Name.replace(new RegExp( enteredCode , 'gi' ), '<b>'+enteredCode+'</b>');
          currentStockData.Symbol = currentStockData.Symbol.replace(new RegExp( enteredCode , 'gi' ), '<b>'+enteredCode+'</b>');
          currentStockData.Id = i;
          //console.log(currentStockData);
          searchStocks.push(currentStockData);
        }
        if (searchStocks.length > 0) {
          $scope.searchLength = searchStocks.length;
          $scope.searchStocks = searchStocks;
        } else {
          $scope.searchStocks = undefined;
        }
      } else {
        $scope.searchStocks = undefined;
      }
      if ($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol.toLowerCase() === enteredCode) {
        exactMatch = true;
      }
    }
    document.getElementById('quoteBTN').disabled = !exactMatch;
  }
})

.controller('watchlistStockDetailsCtrl', function($scope, $rootScope, $location, $stateParams, $timeout, $ionicModal) {
  $scope.hasDropNav = true;
  $scope.dropNavExpanded = false;
  $scope.menuItems = [
    { title: 'Quick Quote', id: 1, link: 'quickQuote', isActive:false },
    { title: 'Trade Now', id: 2, link: 'makeTrade', isActive:false },
    { title: 'View Trade Status', id: 3, link: '', isActive:false },
    { title: 'My Portfolio Holdings', id: 4, link: 'holdings', isActive:false },
    { title: 'Corporate Actions', id: 5, link: '', isActive:false },
    { title: 'Watchlist', id: 6, link: 'watchlist', isActive:true },
    { title: 'Market News', id: 7, link: '', isActive:false },
    { title: 'Account Information', id: 8, link: '', isActive:false }
  ];
  $scope.changePositive = true;
  $scope.detailsExpanded = false;
  $scope.activeTab = $scope.activeTab || 'statistics';
  $scope.datePhrase = 'As of 10:23 pm on 1/1/2015';
  $scope.chart = {period:'day'};
  $scope.stockOwned = false;
  $scope.customStock = $rootScope.customStock = {enteredStock:$stateParams.quoteSymbol};
  $scope.watchLists = angular.copy($rootScope.watchLists);
  $scope.listId = $stateParams.listIndex;

  //set currrent watchlist that stock belongs to
  if ($scope.listId){
    $scope.currentList = $scope.watchLists[$scope.listId];
    //get index of current stock in currentList
    for (var i = 0; i < $scope.currentList.items.length; i++) {
      if ($scope.currentList.items[i].item.Symbol === $scope.customStock.enteredStock) {
        $scope.stockId = i;
        //console.log ($scope.stockId);
      }
    }
  }

  //calculate watchlist changes
  $scope.calcChange= function(currentList){
    //get average change
    var changeTotal = 0;
    var changePercent = 0;
    var changeAvg = 0;
    var percentAvg = 0;
    var numItems = $scope.currentList.items.length
    currentList.itemCount = numItems;
    if (numItems > 0) {
      angular.forEach(currentList.items, function (items) {
        changeTotal += parseFloat(items.item.Change);
        changePercent += parseFloat(items.item.ChangePercent);
      });
      changeAvg = changeTotal;
      percentAvg = changePercent ;
    }
      
    currentList.changeTotal = changeAvg;
    currentList.changePercent = percentAvg;
    
    if (typeof currentList.changeTotal === 'number') currentList.changeTotal = currentList.changeTotal.toFixed(2);
    if (typeof currentList.changePercent === 'number') currentList.changePercent = currentList.changePercent.toFixed(2);

    if (String(currentList.changeTotal).indexOf('-') !== -1 || String(currentList.changePercent).indexOf('-') !== -1) {
      currentList.ChangeDirection = 'negative';
    } else if (Number(currentList.changeTotal) == 0 && Number(currentList.changePercent) == 0) {
      currentList.ChangeDirection = 'no-change';
    } else {
      currentList.ChangeDirection = 'positive';
    }  
  };
  // Determine market the long way around... prototype!
  for (marketName in $rootScope.allStocks) {
    for (var l = 0; l < $rootScope.allStocks[marketName].length; l++) {
      if ($rootScope.allStocks[marketName][l].Symbol === $scope.customStock.enteredStock) {

        $rootScope.customStock.selectedMarket = $scope.customStock.selectedMarket = marketName;
      }
    };
  };
  // Determine which stock to display
  for (var i = 0; i < $rootScope.allStocks[$scope.customStock.selectedMarket].length; i++) {
    if ($rootScope.allStocks[$scope.customStock.selectedMarket][i].Symbol === $stateParams.quoteSymbol) {
      $scope.currentStock = JSON.parse(JSON.stringify($rootScope.allStocks[$scope.customStock.selectedMarket][i]));
    }
  };
  
  if (String($scope.currentStock.Change).indexOf('-') !== -1 || String($scope.currentStock.ChangePercent).indexOf('-') !== -1) {
    $scope.currentStock.ChangeDirection = 'negative';
  } else if (Number($scope.currentStock.Change) == 0 && Number($scope.currentStock.ChangePercent) == 0) {
    $scope.currentStock.ChangeDirection = 'no-change';
  } else {
    $scope.currentStock.ChangeDirection = 'positive';
  }  

  $scope.currentStock.PrevClose = parseFloat($scope.currentStock.Close) + parseFloat($scope.currentStock.Change)
  // Determine if stock is owned
  angular.forEach($rootScope.userStocks, function (currentStock) {
    if (currentStock.Symbol === $scope.customStock.enteredStock) {
      $scope.ownedInfo = angular.copy(currentStock);
      $scope.stockOwned = true;
    }
  })
  
  //watchlistitem delete modal
  $ionicModal.fromTemplateUrl('templates/deleteItemModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(itemIndex) {
    $scope.itemDeleteId = itemIndex;
    $scope.modal.show(itemIndex);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.chartPeriod = function (desiredPeriod) {
    $scope.chart.period = desiredPeriod || 'day';
  }
  $scope.doTabSwitch = function (desiredTab) {
    $scope.activeTab = desiredTab;
  };
  $scope.doDetailsExpand = function () {
    $scope.detailsExpanded = !$scope.detailsExpanded;
  };
  $scope.toggleDropNav = function () {
    $scope.dropNavExpanded = !$scope.dropNavExpanded;
  };
  $scope.doNavigate = function (desiredPath,transactionType, linkHash) {
    if (desiredPath) {
      if (desiredPath === 'makeTrade') {
        $rootScope.transaction.stockCode = [$scope.customStock.selectedMarket,$scope.currentStock.Symbol,$scope.currentStock];
        $rootScope.transaction.transactionType = transactionType;
        $rootScope.transaction.settlementAccount = 'Default Security Account';
        $rootScope.transaction.orderType = 'Normal Order';
      }
      if (linkHash) {
        window.location.href = window.location.href.replace(/#.*/,'')+'#/app/'+desiredPath+'#'+linkHash;
      } else {      
        $location.path('app/'+desiredPath);
      }
    }
  };
  $scope.doRefresh = function () {
    $scope.$broadcast('scroll.refreshComplete');
    var today = new Date();
    var currentHour = parseInt(today.getHours());
    var currentMinute = String(today.getMinutes());
    var AmPm = 'am';
    var twelveHour = [12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
    currentHour = twelveHour[currentHour];
    if (today.getHours() > 12) {
      AmPm = 'pm';
    }
    if (currentMinute.length === 1) {
      currentMinute = '0'+currentMinute
    }
    $timeout(function(){
      $scope.datePhrase = 'As of '+currentHour+':'+currentMinute+' '+AmPm+' on '+(today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    }, 900);
  };

  $scope.doDeleteWatchListItem = function () {
    //delete it from current list
    $scope.closeModal();
    $scope.currentList.items.splice($scope.itemDeleteId, 1); 
    $scope.calcChange($scope.currentList);
    $scope.watchLists[$scope.listId] = $scope.currentList;
    $rootScope.watchLists = angular.copy($scope.watchLists);
    $location.path('app/watchlist/' + $scope.listId);
  };

  $scope.doTabSwitch($scope.activeTab);
})

.controller('WatchlistsFilterCtrl', function($scope, $rootScope, $stateParams, $location) {
    $scope.filter = $stateParams.filter ;
    //console.log ($scope.symbol);
    $scope.stockSymbol = $stateParams.quoteSymbol;
    $scope.watchLists = angular.copy($rootScope.watchLists);
    $scope.selectAll = true;
    $scope.isValid = false;
    $scope.titles = {
      markets: "MARKETS: Available Markets",
      accounts: "ACCOUNTS: Available Accounts",
      watchlists: "WATCHLISTS: Available watchlists"
    };
    $scope.selectWatchlists = [];
    

    $scope.doUpdate = function(account){
      $rootScope.transaction.securityAccount = account;
      window.history.back();
    }
    angular.forEach($scope.watchLists, function (currentOption) {
      if (!currentOption.isActive) {
        $scope.selectAll = false;
      }
    });

    $scope.getStock = function(stockSymbol){
      var stockId = 0;
      var stockMarket = '';
      //get stock information
      for (var i = 0; i < $rootScope.allStocks["SG"].length; i++) {
        if ($rootScope.allStocks["SG"][i].Symbol === stockSymbol) {
          stockId = i;
          stockMarket = 'SG';
        }
      }
      for (var j = 0; j < $rootScope.allStocks["US"].length; j++) {
        if ($rootScope.allStocks["US"][j].Symbol === stockSymbol) {
          stockId = j;
          stockMarket = 'US';
        }
      }
      for (var t = 0; t < $rootScope.allStocks["HK"].length; t++) {
        if ($rootScope.allStocks["HK"][t].Symbol === stockSymbol) {
          stockId = t;
          stockMarket = 'HK';
        }
      }
      $scope.currentStock = $rootScope.allStocks[stockMarket][stockId];
      $scope.currentStock.isActive = true;
      //console.log ($scope.currentStock);
    }

    $scope.getStock ($scope.stockSymbol);
    $scope.stockName = $scope.currentStock.Name;

    $scope.toggleAllOptions = function () {
      $scope.selectAll = !$scope.selectAll;
      angular.forEach($scope.$scope.watchLists, function (currentOption) {
        currentOption.isActive = $scope.selectAll;
      });
      $scope.isValid = $scope.selectAll;
    }
    $scope.checkOptions = function () {
      var optionSelected = false;
      angular.forEach($scope.watchLists, function (currentOption) {
        if (currentOption.isActive >= 0) {
          optionSelected = true;
        }
      });
      $scope.isValid = optionSelected;
    }

    $scope.addToWatchlist = function (){
      console.log ('Adding.. ');
      var listId = false;
        angular.forEach($scope.watchLists, function (currentOption) {
          if (currentOption.isActive >= 0) {
            optionSelected = true;
            listId = currentOption.isActive;
            $scope.watchLists[listId].items.push({item: $scope.currentStock, Code:'00089', Account:6932});
          }
        });
      
      //console.log (itemIndex + "," + itemMarket);
      //if (itemMarket.length > 0) {
      //  var stockData = $rootScope.allStocks[itemMarket][itemIndex];
      //  $scope.watchLists[$scope.listId].items.push({item: stockData, Code:'00089', Account:6932});
      //}
      $rootScope.watchLists = angular.copy($scope.watchLists);
    }

    $scope.doSave = function () {
          console.log ('save');
          $scope.addToWatchlist();
          $rootScope.watchLists = angular.copy($scope.watchLists);
          window.history.back(); 
    }
  });
