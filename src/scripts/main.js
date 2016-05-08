/*
 * @Author: yingyuk
 * @Date:   2016-04-30 09:55:32
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-08 14:20:25
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
    })
});
