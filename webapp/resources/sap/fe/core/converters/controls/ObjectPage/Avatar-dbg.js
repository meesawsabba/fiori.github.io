/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingExpression"], function (BindingExpression) {
  "use strict";

  var _exports = {};
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;

  var AvatarShape;

  (function (AvatarShape) {
    AvatarShape["Circle"] = "Circle";
    AvatarShape["Square"] = "Square";
  })(AvatarShape || (AvatarShape = {}));

  var isNaturalPerson = function (converterContext) {
    var _converterContext$get, _converterContext$get2;

    return ((_converterContext$get = converterContext.getEntityType().annotations.Common) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.IsNaturalPerson) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.valueOf()) === true;
  };

  var getFallBackIcon = function (converterContext) {
    var _converterContext$get3, _converterContext$get4;

    var headerInfo = (_converterContext$get3 = converterContext.getEntityType().annotations) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.UI) === null || _converterContext$get4 === void 0 ? void 0 : _converterContext$get4.HeaderInfo;

    if (!headerInfo || headerInfo && !headerInfo.ImageUrl && !headerInfo.TypeImageUrl) {
      return undefined;
    }

    if (headerInfo.ImageUrl && headerInfo.TypeImageUrl) {
      return compileBinding(annotationExpression(headerInfo.TypeImageUrl));
    }

    return compileBinding(isNaturalPerson(converterContext) ? "sap-icon://person-placeholder" : "sap-icon://product");
  };

  var getSource = function (converterContext) {
    var _converterContext$get5, _converterContext$get6;

    var headerInfo = (_converterContext$get5 = converterContext.getEntityType().annotations) === null || _converterContext$get5 === void 0 ? void 0 : (_converterContext$get6 = _converterContext$get5.UI) === null || _converterContext$get6 === void 0 ? void 0 : _converterContext$get6.HeaderInfo;

    if (!headerInfo || !(headerInfo.ImageUrl || headerInfo.TypeImageUrl)) {
      return undefined;
    }

    return compileBinding(annotationExpression(headerInfo.ImageUrl || headerInfo.TypeImageUrl));
  };

  var getAvatar = function (converterContext) {
    var _converterContext$get7, _converterContext$get8;

    var headerInfo = (_converterContext$get7 = converterContext.getEntityType().annotations) === null || _converterContext$get7 === void 0 ? void 0 : (_converterContext$get8 = _converterContext$get7.UI) === null || _converterContext$get8 === void 0 ? void 0 : _converterContext$get8.HeaderInfo;
    var oSource = headerInfo && (headerInfo.ImageUrl || headerInfo.TypeImageUrl || headerInfo.Initials);

    if (!oSource) {
      return undefined;
    }

    return {
      src: getSource(converterContext),
      initials: compileBinding(annotationExpression((headerInfo === null || headerInfo === void 0 ? void 0 : headerInfo.Initials) || "")),
      fallbackIcon: getFallBackIcon(converterContext),
      displayShape: compileBinding(isNaturalPerson(converterContext) ? AvatarShape.Circle : AvatarShape.Square)
    };
  };

  _exports.getAvatar = getAvatar;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF2YXRhci50cyJdLCJuYW1lcyI6WyJBdmF0YXJTaGFwZSIsImlzTmF0dXJhbFBlcnNvbiIsImNvbnZlcnRlckNvbnRleHQiLCJnZXRFbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJJc05hdHVyYWxQZXJzb24iLCJ2YWx1ZU9mIiwiZ2V0RmFsbEJhY2tJY29uIiwiaGVhZGVySW5mbyIsIlVJIiwiSGVhZGVySW5mbyIsIkltYWdlVXJsIiwiVHlwZUltYWdlVXJsIiwidW5kZWZpbmVkIiwiY29tcGlsZUJpbmRpbmciLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsImdldFNvdXJjZSIsImdldEF2YXRhciIsIm9Tb3VyY2UiLCJJbml0aWFscyIsInNyYyIsImluaXRpYWxzIiwiZmFsbGJhY2tJY29uIiwiZGlzcGxheVNoYXBlIiwiQ2lyY2xlIiwiU3F1YXJlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7OztNQUFLQSxXOzthQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztLQUFBQSxXLEtBQUFBLFc7O0FBWUwsTUFBTUMsZUFBZSxHQUFHLFVBQUNDLGdCQUFELEVBQWlEO0FBQUE7O0FBQ3hFLFdBQU8sMEJBQUFBLGdCQUFnQixDQUFDQyxhQUFqQixHQUFpQ0MsV0FBakMsQ0FBNkNDLE1BQTdDLDBHQUFxREMsZUFBckQsa0ZBQXNFQyxPQUF0RSxRQUFvRixJQUEzRjtBQUNBLEdBRkQ7O0FBSUEsTUFBTUMsZUFBZSxHQUFHLFVBQUNOLGdCQUFELEVBQStFO0FBQUE7O0FBQ3RHLFFBQU1PLFVBQVUsNkJBQUdQLGdCQUFnQixDQUFDQyxhQUFqQixHQUFpQ0MsV0FBcEMscUZBQUcsdUJBQThDTSxFQUFqRCwyREFBRyx1QkFBa0RDLFVBQXJFOztBQUNBLFFBQUksQ0FBQ0YsVUFBRCxJQUFnQkEsVUFBVSxJQUFJLENBQUNBLFVBQVUsQ0FBQ0csUUFBMUIsSUFBc0MsQ0FBQ0gsVUFBVSxDQUFDSSxZQUF0RSxFQUFxRjtBQUNwRixhQUFPQyxTQUFQO0FBQ0E7O0FBQ0QsUUFBSUwsVUFBVSxDQUFDRyxRQUFYLElBQXVCSCxVQUFVLENBQUNJLFlBQXRDLEVBQW9EO0FBQ25ELGFBQU9FLGNBQWMsQ0FBQ0Msb0JBQW9CLENBQUNQLFVBQVUsQ0FBQ0ksWUFBWixDQUFyQixDQUFyQjtBQUNBOztBQUNELFdBQU9FLGNBQWMsQ0FBQ2QsZUFBZSxDQUFDQyxnQkFBRCxDQUFmLEdBQW9DLCtCQUFwQyxHQUFzRSxvQkFBdkUsQ0FBckI7QUFDQSxHQVREOztBQVdBLE1BQU1lLFNBQVMsR0FBRyxVQUFDZixnQkFBRCxFQUErRTtBQUFBOztBQUNoRyxRQUFNTyxVQUFVLDZCQUFHUCxnQkFBZ0IsQ0FBQ0MsYUFBakIsR0FBaUNDLFdBQXBDLHFGQUFHLHVCQUE4Q00sRUFBakQsMkRBQUcsdUJBQWtEQyxVQUFyRTs7QUFDQSxRQUFJLENBQUNGLFVBQUQsSUFBZSxFQUFFQSxVQUFVLENBQUNHLFFBQVgsSUFBdUJILFVBQVUsQ0FBQ0ksWUFBcEMsQ0FBbkIsRUFBc0U7QUFDckUsYUFBT0MsU0FBUDtBQUNBOztBQUNELFdBQU9DLGNBQWMsQ0FBQ0Msb0JBQW9CLENBQUNQLFVBQVUsQ0FBQ0csUUFBWCxJQUF1QkgsVUFBVSxDQUFDSSxZQUFuQyxDQUFyQixDQUFyQjtBQUNBLEdBTkQ7O0FBUU8sTUFBTUssU0FBUyxHQUFHLFVBQUNoQixnQkFBRCxFQUE0RDtBQUFBOztBQUNwRixRQUFNTyxVQUFVLDZCQUFHUCxnQkFBZ0IsQ0FBQ0MsYUFBakIsR0FBaUNDLFdBQXBDLHFGQUFHLHVCQUE4Q00sRUFBakQsMkRBQUcsdUJBQWtEQyxVQUFyRTtBQUNBLFFBQU1RLE9BQVksR0FBR1YsVUFBVSxLQUFLQSxVQUFVLENBQUNHLFFBQVgsSUFBdUJILFVBQVUsQ0FBQ0ksWUFBbEMsSUFBa0RKLFVBQVUsQ0FBQ1csUUFBbEUsQ0FBL0I7O0FBQ0EsUUFBSSxDQUFDRCxPQUFMLEVBQWM7QUFDYixhQUFPTCxTQUFQO0FBQ0E7O0FBQ0QsV0FBTztBQUNOTyxNQUFBQSxHQUFHLEVBQUVKLFNBQVMsQ0FBQ2YsZ0JBQUQsQ0FEUjtBQUVOb0IsTUFBQUEsUUFBUSxFQUFFUCxjQUFjLENBQUNDLG9CQUFvQixDQUFDLENBQUFQLFVBQVUsU0FBVixJQUFBQSxVQUFVLFdBQVYsWUFBQUEsVUFBVSxDQUFFVyxRQUFaLEtBQXdCLEVBQXpCLENBQXJCLENBRmxCO0FBR05HLE1BQUFBLFlBQVksRUFBRWYsZUFBZSxDQUFDTixnQkFBRCxDQUh2QjtBQUlOc0IsTUFBQUEsWUFBWSxFQUFFVCxjQUFjLENBQUNkLGVBQWUsQ0FBQ0MsZ0JBQUQsQ0FBZixHQUFvQ0YsV0FBVyxDQUFDeUIsTUFBaEQsR0FBeUR6QixXQUFXLENBQUMwQixNQUF0RTtBQUp0QixLQUFQO0FBTUEsR0FaTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uLy4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IGFubm90YXRpb25FeHByZXNzaW9uLCBCaW5kaW5nRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuZW51bSBBdmF0YXJTaGFwZSB7XG5cdENpcmNsZSA9IFwiQ2lyY2xlXCIsXG5cdFNxdWFyZSA9IFwiU3F1YXJlXCJcbn1cblxuZXhwb3J0IHR5cGUgQXZhdGFyID0ge1xuXHRzcmM/OiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+O1xuXHRpbml0aWFsczogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPjtcblx0ZmFsbGJhY2tJY29uPzogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPjtcblx0ZGlzcGxheVNoYXBlOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+O1xufTtcblxuY29uc3QgaXNOYXR1cmFsUGVyc29uID0gKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBCb29sZWFuID0+IHtcblx0cmV0dXJuIGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLmFubm90YXRpb25zLkNvbW1vbj8uSXNOYXR1cmFsUGVyc29uPy52YWx1ZU9mKCkgPT09IHRydWU7XG59O1xuXG5jb25zdCBnZXRGYWxsQmFja0ljb24gPSAoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4gfCB1bmRlZmluZWQgPT4ge1xuXHRjb25zdCBoZWFkZXJJbmZvID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvO1xuXHRpZiAoIWhlYWRlckluZm8gfHwgKGhlYWRlckluZm8gJiYgIWhlYWRlckluZm8uSW1hZ2VVcmwgJiYgIWhlYWRlckluZm8uVHlwZUltYWdlVXJsKSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0aWYgKGhlYWRlckluZm8uSW1hZ2VVcmwgJiYgaGVhZGVySW5mby5UeXBlSW1hZ2VVcmwpIHtcblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oaGVhZGVySW5mby5UeXBlSW1hZ2VVcmwpKTtcblx0fVxuXHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoaXNOYXR1cmFsUGVyc29uKGNvbnZlcnRlckNvbnRleHQpID8gXCJzYXAtaWNvbjovL3BlcnNvbi1wbGFjZWhvbGRlclwiIDogXCJzYXAtaWNvbjovL3Byb2R1Y3RcIik7XG59O1xuXG5jb25zdCBnZXRTb3VyY2UgPSAoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4gfCB1bmRlZmluZWQgPT4ge1xuXHRjb25zdCBoZWFkZXJJbmZvID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvO1xuXHRpZiAoIWhlYWRlckluZm8gfHwgIShoZWFkZXJJbmZvLkltYWdlVXJsIHx8IGhlYWRlckluZm8uVHlwZUltYWdlVXJsKSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKGhlYWRlckluZm8uSW1hZ2VVcmwgfHwgaGVhZGVySW5mby5UeXBlSW1hZ2VVcmwpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBdmF0YXIgPSAoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEF2YXRhciB8IHVuZGVmaW5lZCA9PiB7XG5cdGNvbnN0IGhlYWRlckluZm8gPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKS5hbm5vdGF0aW9ucz8uVUk/LkhlYWRlckluZm87XG5cdGNvbnN0IG9Tb3VyY2U6IGFueSA9IGhlYWRlckluZm8gJiYgKGhlYWRlckluZm8uSW1hZ2VVcmwgfHwgaGVhZGVySW5mby5UeXBlSW1hZ2VVcmwgfHwgaGVhZGVySW5mby5Jbml0aWFscyk7XG5cdGlmICghb1NvdXJjZSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRzcmM6IGdldFNvdXJjZShjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRpbml0aWFsczogY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oaGVhZGVySW5mbz8uSW5pdGlhbHMgfHwgXCJcIikpLFxuXHRcdGZhbGxiYWNrSWNvbjogZ2V0RmFsbEJhY2tJY29uKGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGRpc3BsYXlTaGFwZTogY29tcGlsZUJpbmRpbmcoaXNOYXR1cmFsUGVyc29uKGNvbnZlcnRlckNvbnRleHQpID8gQXZhdGFyU2hhcGUuQ2lyY2xlIDogQXZhdGFyU2hhcGUuU3F1YXJlKVxuXHR9O1xufTtcbiJdfQ==