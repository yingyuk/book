/*
 * @Author: yingyuk
 * @Date:   2016-04-30 09:55:32
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-05-12 19:37:34
 */

'use strict';
var routerApp = angular.module('routerApp', ['ui.router', 'loginModule','BookListModule', 'BookDetailModule','BookTypeModule']);
routerApp.run(function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  // 默认的标签列表
  $rootScope.bookTypes = ['web','互联网','编程','交互设计','算法','电影','文学','旅行','生活'];
  // 默认选中的标签
  $rootScope.bookType = 'web';
  // $rootScope.select= 'web';
});
routerApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'templates/loginForm.html'
    })
    .state('booklist', {
      url: '/tag',
      views: {
        '': {
          templateUrl: 'templates/bookList.html'
        },
        'booktype@booklist': {
          templateUrl: 'templates/bookType.html'
        },
        'bookgrid@booklist': {
          templateUrl: 'templates/bookGrid.html'
        }
      }
    })
    .state('booklist.tag', {
      url: '/{bookType:.+}',
      views: {
        'bookgrid@booklist': {
          templateUrl: 'templates/bookGrid.html'
        }
      }
    })
    .state('addbook', {
      url: '/addbook',
      templateUrl: 'templates/addBookForm.html'
    })
    .state('bookdetail', {
      url: '/bookdetail/:bookId',
      templateUrl: 'templates/bookDetail.html'
    });
});


/*
 * @Author: yingyuk
 * @Date:   2016-04-30 09:56:30
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-05-12 18:36:22
 */

'use strict';
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($rootScope, $scope, $http, $state, $stateParams) {
  $scope.pagingOptions = { currentPage: 1 };
  $scope.setPagingData = function(booksData) {
    $rootScope.books = $scope.books = booksData.books;
    $rootScope.bookType = $stateParams.bookType;
  };

  $scope.getPageData = function(page) {
    $http.jsonp('https://api.douban.com/v2/book/search?tag=' + $stateParams.bookType + '&fields=id,title,author,pubdate,price,image,summary&callback=doubanApiList')
      .success(function(response) {
        // 如果有一天APT改了;就通过正常途径运行;
        $scope.setPagingData(response);
      }).error(function(error) {
        $scope.setPagingData(bookData.tag);
      });
  };
  $scope.$watch('pagingOptions', function(newVal, oldVal) {
    if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
      $scope.getPageData($scope.pagingOptions.currentPage);
    }
  }, true);
  $scope.getPageData($scope.pagingOptions.currentPage);
  // $scope.gridOptions = {
  //   data: 'books',
  //   columnDefs: [
  //     // { field: 'id', displayName: '序号', width: 70 },
  //     { field: 'title', displayName: '名字', sortable: false },
  //     { field: 'author[0]', displayName: '作者', pinnable: false },
  //     { field: 'pubdate', displayName: '出版时间' },
  //     { field: 'price', displayName: '价格' }, //, cellFilter: 'currency:"￥"'
  //     { field: 'id', displayName: '操作', cellTemplate: '<div><a ui-sref="bookdetail({bookId:{{row.entity[col.field]}}})" id="{{row.getProperty(col.field)}}">{{row.getProperty(col.id)}}详情{{row.getProperty(col.field)}}</a></div>' }
  //   ]
  // };
});
var bookDetailModule = angular.module("BookDetailModule", []);

var bookData = {
  // 存储当前点选的书籍类型;
  tag: '',
  // 存储点击的书籍详情
  detail: ''
};

function doubanApiList(response) {
  bookData.tag = response;
}

function doubanApiDetail(response) {
  bookData.detail = response;
}
bookDetailModule.controller('BookDetailCtrl', function($rootScope, $scope, $http, $state, $stateParams) {
  // 将数据放到根作用域;
  $scope.setPagingData = function(bookData) {
    $rootScope.bookDetail = {
      title: bookData.title,
      author: bookData.author[0],
      tags: bookData.tags[0].name,
      pubdate: bookData.pubdate,
      price: bookData.price,
      image: bookData.images.large,
      url: bookData.alt,
      summary: bookData.summary,
      author_intro: bookData.author_intro
    };
  };

  // 豆瓣API 不支持callback里有标点符号
  // ?callback=angular.callback._0 
  // $http.jsonp("https://api.github.com/users/auser/events?callback=JSON_CALLBACK") //github成功

  // 所以只好调用外部的全局函数;然后监听,进行数据处理; 
  $http.jsonp('https://api.douban.com/v2/book/' + $stateParams.bookId + '?callback=doubanApiDetail')
    .success(function(response) {
      // 如果有一天APT改了;就通过正常途径运行;
      $scope.setPagingData(response);
    }).error(function(error) {
      $scope.setPagingData(bookData.detail);
    })
});
var bookTypeModule = angular.module("BookTypeModule", []);
bookTypeModule.controller('BookTypeCtrl', function($rootScope, $scope, $http, $state, $stateParams) {
  $scope.active = $stateParams.bookType;
  $scope.setActive = function(item) {
    $scope.active = item;
  };
  $scope.addTpyes = function() {
    if ($scope.types) {
      $rootScope.bookTypes.push($scope.types);
      $scope.types = '';
    }
  };
});
var loginModule = angular.module("loginModule", []);
loginModule.controller('loginController', function($rootScope, $scope, $http, $state, $stateParams) {
  // 切换 登录 注册
  $scope.signin = true;
  // 注册 登录 禁止点击;
  $scope.signinSuccess = false;
  $scope.signupSuccess = false;
  // 用户信息;
  $scope.userInfo = {
    user: '',
    pswd: '',
    userTips: '用户名需大于4位',
    pswdTips: '密码需大于6位',
    remember: true,
  };
  // 登录用户输入监控
  $scope.$watch('userInfo', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      if ($scope.userCheck() && $scope.pswdCheck()) {
        $scope.signinSuccess = true;
      } else {
        $scope.signinSuccess = false;
      }
    }
  }, true);


  $scope.registerInfo = {
    user: '',
    pswd: '',
    pswdAgain: '',
    userTips: '用户名需大于4位',
    pswdTips: '密码需大于6位',
    pswdAgainTips: '密码需要一致'
  };
  // 注册用户输入监控
  $scope.$watch('registerInfo', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      if ($scope.signupUserCheck() && $scope.signupPswdCheck() && $scope.pswdAgainCheck()) {
        $scope.signupSuccess = true;
      } else {
        $scope.signupSuccess = false;
      }
    }
  }, true);
  $scope.check = function(item) {};
  $scope.layout = $scope.signinLayout;
  $scope.$watch('signin', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      if (newVal) {
        $scope.layout = $scope.signinLayout;
      } else {
        $scope.layout = $scope.signupLayout;
      }
    }
  }, true);
  $scope.userCheck = function() {
    if ($scope.userInfo.user.length < 4) {
      $scope.userInfo.userTips = '请输入4位以上用户名';
      return false;
    } else {
      $scope.userInfo.userTips = 'OK';
      return true;
    }

  };
  $scope.pswdCheck = function() {
    if ($scope.userInfo.pswd.length < 6) {
      $scope.userInfo.pswdTips = '请输入6位以上密码';
      return false;
    } else {
      $scope.userInfo.pswdTips = 'OK';
      return true;
    }
  };
  $scope.signupUserCheck = function() {
    if ($scope.registerInfo.user.length < 4) {
      $scope.registerInfo.userTips = '请输入4位以上用户名';
      return false;
    } else {
      $scope.registerInfo.userTips = 'OK';
      return true;
    }

  };
  $scope.signupPswdCheck = function() {
    if ($scope.registerInfo.pswd.length < 6) {
      $scope.registerInfo.pswdTips = '请输入6位以上密码';
      return false;
    } else {
      $scope.registerInfo.pswdTips = 'OK';
      return true;
    }
  };
  $scope.pswdAgainCheck = function() {
    if ($scope.registerInfo.pswd == $scope.registerInfo.pswdAgain) {
      $scope.registerInfo.pswdAgainTips = 'OK';
      return true;
    }
    $scope.registerInfo.pswdAgainTips = '两次密码不一致';
    return false;
  };
  $scope.remember = function() {

  };
  $scope.signin = function() {
    var url = './data/signin.json';
    // 应该是post,
    $http.get(url)
      .success(function(response) {})
  };
  $scope.signup = function() {
    // $http.post(url);
  };
});
