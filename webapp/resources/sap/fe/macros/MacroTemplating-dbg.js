/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var getPath = function (oContext, oInterface) {
    if (oInterface && oInterface.context) {
      return oInterface.context.getPath();
    }

    return "";
  };

  getPath.requiresIContext = true;
  _exports.getPath = getPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hY3JvVGVtcGxhdGluZy50cyJdLCJuYW1lcyI6WyJnZXRQYXRoIiwib0NvbnRleHQiLCJvSW50ZXJmYWNlIiwiY29udGV4dCIsInJlcXVpcmVzSUNvbnRleHQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztBQUFPLE1BQU1BLE9BQU8sR0FBRyxVQUFTQyxRQUFULEVBQXFDQyxVQUFyQyxFQUFzRjtBQUM1RyxRQUFJQSxVQUFVLElBQUlBLFVBQVUsQ0FBQ0MsT0FBN0IsRUFBc0M7QUFDckMsYUFBT0QsVUFBVSxDQUFDQyxPQUFYLENBQW1CSCxPQUFuQixFQUFQO0FBQ0E7O0FBQ0QsV0FBTyxFQUFQO0FBQ0EsR0FMTTs7QUFNUEEsRUFBQUEsT0FBTyxDQUFDSSxnQkFBUixHQUEyQixJQUEzQiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcHV0ZWRBbm5vdGF0aW9uSW50ZXJmYWNlLCBNZXRhTW9kZWxDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRQYXRoID0gZnVuY3Rpb24ob0NvbnRleHQ6IE1ldGFNb2RlbENvbnRleHQsIG9JbnRlcmZhY2U6IENvbXB1dGVkQW5ub3RhdGlvbkludGVyZmFjZSk6IHN0cmluZyB7XG5cdGlmIChvSW50ZXJmYWNlICYmIG9JbnRlcmZhY2UuY29udGV4dCkge1xuXHRcdHJldHVybiBvSW50ZXJmYWNlLmNvbnRleHQuZ2V0UGF0aCgpO1xuXHR9XG5cdHJldHVybiBcIlwiO1xufTtcbmdldFBhdGgucmVxdWlyZXNJQ29udGV4dCA9IHRydWU7XG4iXX0=