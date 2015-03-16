/*! angular-title - v0.0.1 - 2015-03-16 */
"use strict";
/**
 * Angular Title dyamically updates the document title when navigating views
 * defined in `ngRoute`'s `$routeProvider`. Simply define the title of the
 * page in your `$routeProvider` config using the `title` key.
 *
 * If you place the name of the site inside the `title` element the directive
 * will append this string to the end of the title on each page e.g.
 * `<title>My Site Name</title>` would become `pageone - My Site Name`. The
 * original string is also used as a fallback if the title attribute for a
 * route has not been defined. In that case the title for that route would be
 * `My Site Name`.
 *
 * @example
 *  $routeProvider
 *      .when("/pageone", {
 *          controller: "pageoneCtrl"
 *          title: "pageone",
 *          templateUrl: "partials/pageone.html"
 *      })
 *      .when("/pagetwo", {
 *          controller: "pagetwoCtrl"
 *          title: "pagetwo",
 *          templateUrl: "partials/pagetwo.html"
 *      })
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
                 * @property siteTitle
                 * @type     {String}
                 * @example
                 *  My Site Name
                 */
                var siteTitle = $element.html().length > 0 ? $element.html() : undefined ;

                /**
                 * Update the content of the title element to the value
                 * of the title key in the object of the current route
                 * @method onRouteChangeSuccess
                 * @param {event}  $event  '$routeChangeSuccess' event from ngRoute service
                 * @param {Object} current The requested route object
                 */
                var onRouteChangeSuccess = function onRouteChangeSuccess($event, current){

                    // route title & site title
                    if (current && current.$$route && current.$$route.title && siteTitle){
                        $element.html(current.$$route.title + " - " + siteTitle);

                    // route title only
                    } else if (current && current.$$route && current.$$route.title){
                        $element.html(current.$$route.title);

                    // site title only
                    } else if (siteTitle){
                        $element.html(siteTitle);
                    }
                };

                /**
                 * Update the content of the title element to the value
                 * of ROUTE_CHANGE_ERROR_TITLE constant when $routeChangeError
                 * event is triggered.
                 * @method onRouteChangeError
                 */
                var onRouteChangeError = function onRouteChangeError(){
                    if (siteTitle){
                        $element.html(ROUTE_CHANGE_ERROR_TITLE + " - " + siteTitle);
                    } else {
                        $element.html(ROUTE_CHANGE_ERROR_TITLE);
                    }
                };

                $rootScope.$on("$routeChangeSuccess", onRouteChangeSuccess);
                $rootScope.$on("$routeChangeError", onRouteChangeError);

            }
        };
    }
]);
