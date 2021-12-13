/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable @typescript-eslint/ban-types */
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Formatter = void 0;
    /**
     * A Formatter allows as sina developer to format a resultset (searchresultset, suggestionresultset) or
     * to format datasource metadata through a special object which has a format()/formatAsync() method.
     * This allows to change visible result data before it is displayed in the search UI.
     */
    var Formatter = /** @class */ (function () {
        function Formatter() {
        }
        return Formatter;
    }());
    exports.Formatter = Formatter;
});
})();