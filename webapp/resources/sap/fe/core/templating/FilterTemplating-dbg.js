/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function getIsRequired(converterContext, sPropertyPath) {
    var _converterContext$get, _entitySetAnnotations, _entitySetAnnotations2;

    var entitySetAnnotations = (_converterContext$get = converterContext.getEntitySet()) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.annotations;
    var aRequiredProperties = entitySetAnnotations === null || entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations = entitySetAnnotations.Capabilities) === null || _entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations2 = _entitySetAnnotations.FilterRestrictions) === null || _entitySetAnnotations2 === void 0 ? void 0 : _entitySetAnnotations2.RequiredProperties;
    var bIsRequired = false;

    if (aRequiredProperties) {
      aRequiredProperties.forEach(function (oRequiredProperty) {
        if (sPropertyPath === (oRequiredProperty === null || oRequiredProperty === void 0 ? void 0 : oRequiredProperty.value)) {
          bIsRequired = true;
        }
      });
    }

    return bIsRequired;
  }

  _exports.getIsRequired = getIsRequired;

  function isPropertyFilterable(converterContext, valueListProperty) {
    var _converterContext$get2, _entitySetAnnotations3, _entitySetAnnotations4;

    var bNotFilterable, bHidden;
    var entityType = converterContext.getEntityType();
    var entitySetAnnotations = (_converterContext$get2 = converterContext.getEntitySet()) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.annotations;
    var nonFilterableProperties = entitySetAnnotations === null || entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations3 = entitySetAnnotations.Capabilities) === null || _entitySetAnnotations3 === void 0 ? void 0 : (_entitySetAnnotations4 = _entitySetAnnotations3.FilterRestrictions) === null || _entitySetAnnotations4 === void 0 ? void 0 : _entitySetAnnotations4.NonFilterableProperties;
    var properties = entityType.entityProperties;
    properties.forEach(function (property) {
      var PropertyPath = property.name;

      if (PropertyPath === valueListProperty) {
        var _property$annotations, _property$annotations2, _property$annotations3;

        bHidden = (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf();
      }
    });

    if (nonFilterableProperties && nonFilterableProperties.length > 0) {
      for (var i = 0; i < nonFilterableProperties.length; i++) {
        var _nonFilterablePropert;

        var sPropertyName = (_nonFilterablePropert = nonFilterableProperties[i]) === null || _nonFilterablePropert === void 0 ? void 0 : _nonFilterablePropert.value;

        if (sPropertyName === valueListProperty) {
          bNotFilterable = true;
        }
      }
    }

    return bNotFilterable || bHidden;
  }

  _exports.isPropertyFilterable = isPropertyFilterable;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbHRlclRlbXBsYXRpbmcudHMiXSwibmFtZXMiOlsiZ2V0SXNSZXF1aXJlZCIsImNvbnZlcnRlckNvbnRleHQiLCJzUHJvcGVydHlQYXRoIiwiZW50aXR5U2V0QW5ub3RhdGlvbnMiLCJnZXRFbnRpdHlTZXQiLCJhbm5vdGF0aW9ucyIsImFSZXF1aXJlZFByb3BlcnRpZXMiLCJDYXBhYmlsaXRpZXMiLCJGaWx0ZXJSZXN0cmljdGlvbnMiLCJSZXF1aXJlZFByb3BlcnRpZXMiLCJiSXNSZXF1aXJlZCIsImZvckVhY2giLCJvUmVxdWlyZWRQcm9wZXJ0eSIsInZhbHVlIiwiaXNQcm9wZXJ0eUZpbHRlcmFibGUiLCJ2YWx1ZUxpc3RQcm9wZXJ0eSIsImJOb3RGaWx0ZXJhYmxlIiwiYkhpZGRlbiIsImVudGl0eVR5cGUiLCJnZXRFbnRpdHlUeXBlIiwibm9uRmlsdGVyYWJsZVByb3BlcnRpZXMiLCJOb25GaWx0ZXJhYmxlUHJvcGVydGllcyIsInByb3BlcnRpZXMiLCJlbnRpdHlQcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJQcm9wZXJ0eVBhdGgiLCJuYW1lIiwiVUkiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwibGVuZ3RoIiwiaSIsInNQcm9wZXJ0eU5hbWUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztBQUNPLFdBQVNBLGFBQVQsQ0FBdUJDLGdCQUF2QixFQUEyREMsYUFBM0QsRUFBMkY7QUFBQTs7QUFDakcsUUFBTUMsb0JBQW9CLDRCQUFHRixnQkFBZ0IsQ0FBQ0csWUFBakIsRUFBSCwwREFBRyxzQkFBaUNDLFdBQTlEO0FBQ0EsUUFBTUMsbUJBQW1CLEdBQUdILG9CQUFILGFBQUdBLG9CQUFILGdEQUFHQSxvQkFBb0IsQ0FBRUksWUFBekIsb0ZBQUcsc0JBQW9DQyxrQkFBdkMsMkRBQUcsdUJBQXdEQyxrQkFBcEY7QUFDQSxRQUFJQyxXQUFXLEdBQUcsS0FBbEI7O0FBQ0EsUUFBSUosbUJBQUosRUFBeUI7QUFDeEJBLE1BQUFBLG1CQUFtQixDQUFDSyxPQUFwQixDQUE0QixVQUFTQyxpQkFBVCxFQUE0QjtBQUN2RCxZQUFJVixhQUFhLE1BQUtVLGlCQUFMLGFBQUtBLGlCQUFMLHVCQUFLQSxpQkFBaUIsQ0FBRUMsS0FBeEIsQ0FBakIsRUFBZ0Q7QUFDL0NILFVBQUFBLFdBQVcsR0FBRyxJQUFkO0FBQ0E7QUFDRCxPQUpEO0FBS0E7O0FBQ0QsV0FBT0EsV0FBUDtBQUNBOzs7O0FBRU0sV0FBU0ksb0JBQVQsQ0FBOEJiLGdCQUE5QixFQUFrRWMsaUJBQWxFLEVBQWtIO0FBQUE7O0FBQ3hILFFBQUlDLGNBQUosRUFBb0JDLE9BQXBCO0FBQ0EsUUFBTUMsVUFBVSxHQUFHakIsZ0JBQWdCLENBQUNrQixhQUFqQixFQUFuQjtBQUNBLFFBQU1oQixvQkFBb0IsNkJBQUdGLGdCQUFnQixDQUFDRyxZQUFqQixFQUFILDJEQUFHLHVCQUFpQ0MsV0FBOUQ7QUFDQSxRQUFNZSx1QkFBdUIsR0FBR2pCLG9CQUFILGFBQUdBLG9CQUFILGlEQUFHQSxvQkFBb0IsQ0FBRUksWUFBekIscUZBQUcsdUJBQW9DQyxrQkFBdkMsMkRBQUcsdUJBQXdEYSx1QkFBeEY7QUFDQSxRQUFNQyxVQUFVLEdBQUdKLFVBQVUsQ0FBQ0ssZ0JBQTlCO0FBQ0FELElBQUFBLFVBQVUsQ0FBQ1gsT0FBWCxDQUFtQixVQUFDYSxRQUFELEVBQXdCO0FBQzFDLFVBQU1DLFlBQVksR0FBR0QsUUFBUSxDQUFDRSxJQUE5Qjs7QUFDQSxVQUFJRCxZQUFZLEtBQUtWLGlCQUFyQixFQUF3QztBQUFBOztBQUN2Q0UsUUFBQUEsT0FBTyw0QkFBR08sUUFBUSxDQUFDbkIsV0FBWixvRkFBRyxzQkFBc0JzQixFQUF6QixxRkFBRyx1QkFBMEJDLE1BQTdCLDJEQUFHLHVCQUFrQ0MsT0FBbEMsRUFBVjtBQUNBO0FBQ0QsS0FMRDs7QUFNQSxRQUFJVCx1QkFBdUIsSUFBSUEsdUJBQXVCLENBQUNVLE1BQXhCLEdBQWlDLENBQWhFLEVBQW1FO0FBQ2xFLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1gsdUJBQXVCLENBQUNVLE1BQTVDLEVBQW9EQyxDQUFDLEVBQXJELEVBQXlEO0FBQUE7O0FBQ3hELFlBQU1DLGFBQWEsNEJBQUdaLHVCQUF1QixDQUFDVyxDQUFELENBQTFCLDBEQUFHLHNCQUE0QmxCLEtBQWxEOztBQUNBLFlBQUltQixhQUFhLEtBQUtqQixpQkFBdEIsRUFBeUM7QUFDeENDLFVBQUFBLGNBQWMsR0FBRyxJQUFqQjtBQUNBO0FBQ0Q7QUFDRDs7QUFDRCxXQUFPQSxjQUFjLElBQUlDLE9BQXpCO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldElzUmVxdWlyZWQoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCwgc1Byb3BlcnR5UGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG5cdGNvbnN0IGVudGl0eVNldEFubm90YXRpb25zID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8uYW5ub3RhdGlvbnM7XG5cdGNvbnN0IGFSZXF1aXJlZFByb3BlcnRpZXMgPSBlbnRpdHlTZXRBbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5GaWx0ZXJSZXN0cmljdGlvbnM/LlJlcXVpcmVkUHJvcGVydGllcyBhcyBhbnlbXTtcblx0bGV0IGJJc1JlcXVpcmVkID0gZmFsc2U7XG5cdGlmIChhUmVxdWlyZWRQcm9wZXJ0aWVzKSB7XG5cdFx0YVJlcXVpcmVkUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKG9SZXF1aXJlZFByb3BlcnR5KSB7XG5cdFx0XHRpZiAoc1Byb3BlcnR5UGF0aCA9PT0gb1JlcXVpcmVkUHJvcGVydHk/LnZhbHVlKSB7XG5cdFx0XHRcdGJJc1JlcXVpcmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYklzUmVxdWlyZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5RmlsdGVyYWJsZShjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCB2YWx1ZUxpc3RQcm9wZXJ0eTogc3RyaW5nKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG5cdGxldCBiTm90RmlsdGVyYWJsZSwgYkhpZGRlbjtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBlbnRpdHlTZXRBbm5vdGF0aW9ucyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zO1xuXHRjb25zdCBub25GaWx0ZXJhYmxlUHJvcGVydGllcyA9IGVudGl0eVNldEFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkZpbHRlclJlc3RyaWN0aW9ucz8uTm9uRmlsdGVyYWJsZVByb3BlcnRpZXMgYXMgYW55W107XG5cdGNvbnN0IHByb3BlcnRpZXMgPSBlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXM7XG5cdHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IFByb3BlcnR5KSA9PiB7XG5cdFx0Y29uc3QgUHJvcGVydHlQYXRoID0gcHJvcGVydHkubmFtZTtcblx0XHRpZiAoUHJvcGVydHlQYXRoID09PSB2YWx1ZUxpc3RQcm9wZXJ0eSkge1xuXHRcdFx0YkhpZGRlbiA9IHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCk7XG5cdFx0fVxuXHR9KTtcblx0aWYgKG5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzICYmIG5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5vbkZpbHRlcmFibGVQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBzUHJvcGVydHlOYW1lID0gbm9uRmlsdGVyYWJsZVByb3BlcnRpZXNbaV0/LnZhbHVlO1xuXHRcdFx0aWYgKHNQcm9wZXJ0eU5hbWUgPT09IHZhbHVlTGlzdFByb3BlcnR5KSB7XG5cdFx0XHRcdGJOb3RGaWx0ZXJhYmxlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGJOb3RGaWx0ZXJhYmxlIHx8IGJIaWRkZW47XG59XG4iXX0=