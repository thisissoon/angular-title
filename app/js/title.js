"use strict";
/**
 * @main   sn.title
 * @module sn.title
 * @author SOON_
 */
angular.module("sn.title", [])

/**
 * Title text to display when $routeChangeError
 * event occurs.
 * @constant
 * @property ROUTE_CHANGE_ERROR_TITLE
 * @type     {String}
 */
.constant("ROUTE_CHANGE_ERROR_TITLE", "Page Error")

/**
 * Title element directive which updates it's content to
 * update the page title. Place the name of you site inside
 * the directive and it will be appended to the end of every
 * page title. eg. Page Title - My Site Name
 * @example
 *   <title>My Site Name</title>
 * @class  title
 * @module sn.title
 * @author SOON_
 */
.directive("title", [
    "$rootScope",
    "ROUTE_CHANGE_ERROR_TITLE",
    /**
     * @constructor
     * @param {Service} $rootScope
     * @param {String}  ROUTE_CHANGE_ERROR_TITLE
     */
    function ($rootScope, ROUTE_CHANGE_ERROR_TITLE) {
        return {
            restrict: "E",
            link: function ($scope, $element) {

                /**
                 * The name of the site to use to append
                 * to all page titles.
                 * @property title
                 * @type     {String}
                 * @example
                 *  My Site Name
                 */
                var title = $element.html();

                /**
                 * Update the content of the title element to the value
                 * of the title key in the object of the current route
                 * @method onRouteChangeSuccess
                 * @param {event}  $event  '$routeChangeSuccess' event from ngRoute service
                 * @param {Object} current The requested route object
                 */
                var onRouteChangeSuccess = function onRouteChangeSuccess($event, current){
                    if (current && current.$$route && current.$$route.title) {
                        $element.html(current.$$route.title + " - " + title);
                    } else {
                        $element.html(title);
                    }
                };

                /**
                 * Update the content of the title element to the value
                 * of ROUTE_CHANGE_ERROR_TITLE constant when $routeChangeError
                 * event is triggered.
                 * @method onRouteChangeError
                 */
                var onRouteChangeError = function onRouteChangeError(){
                    $element.html(ROUTE_CHANGE_ERROR_TITLE + " - " + title);
                };

                $rootScope.$on("$routeChangeSuccess", onRouteChangeSuccess);
                $rootScope.$on("$routeChangeError", onRouteChangeError);

            }
        };
    }
]);
