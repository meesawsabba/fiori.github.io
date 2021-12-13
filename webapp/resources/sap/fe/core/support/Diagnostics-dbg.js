/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Diagnostics = /*#__PURE__*/function () {
    function Diagnostics() {
      _classCallCheck(this, Diagnostics);

      this._issues = [];
    }

    _createClass(Diagnostics, [{
      key: "addIssue",
      value: function addIssue(issueCategory, issueSeverity, details, issueCategoryType, subCategory) {
        var checkIfIssueExists = this.checkIfIssueExists(issueCategory, issueSeverity, details, issueCategoryType, subCategory);

        if (!checkIfIssueExists) {
          this._issues.push({
            category: issueCategory,
            severity: issueSeverity,
            details: details,
            subCategory: subCategory
          });
        }
      }
    }, {
      key: "getIssues",
      value: function getIssues() {
        return this._issues;
      }
    }, {
      key: "getIssuesByCategory",
      value: function getIssuesByCategory(inCategory, subCategory) {
        if (subCategory) {
          return this._issues.filter(function (issue) {
            return issue.category === inCategory && issue.subCategory === subCategory;
          });
        } else {
          return this._issues.filter(function (issue) {
            return issue.category === inCategory;
          });
        }
      }
    }, {
      key: "checkIfIssueExists",
      value: function checkIfIssueExists(inCategory, severity, details, issueCategoryType, issueSubCategory) {
        if (issueCategoryType && issueCategoryType[inCategory] && issueSubCategory) {
          return this._issues.some(function (issue) {
            return issue.category === inCategory && issue.severity === severity && issue.details.replace(/\n/g, "") === details.replace(/\n/g, "") && issue.subCategory === issueSubCategory;
          });
        }

        return this._issues.some(function (issue) {
          return issue.category === inCategory && issue.severity === severity && issue.details.replace(/\n/g, "") === details.replace(/\n/g, "");
        });
      }
    }]);

    return Diagnostics;
  }();

  return Diagnostics;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRpYWdub3N0aWNzLnRzIl0sIm5hbWVzIjpbIkRpYWdub3N0aWNzIiwiX2lzc3VlcyIsImlzc3VlQ2F0ZWdvcnkiLCJpc3N1ZVNldmVyaXR5IiwiZGV0YWlscyIsImlzc3VlQ2F0ZWdvcnlUeXBlIiwic3ViQ2F0ZWdvcnkiLCJjaGVja0lmSXNzdWVFeGlzdHMiLCJwdXNoIiwiY2F0ZWdvcnkiLCJzZXZlcml0eSIsImluQ2F0ZWdvcnkiLCJmaWx0ZXIiLCJpc3N1ZSIsImlzc3VlU3ViQ2F0ZWdvcnkiLCJzb21lIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztNQU1NQSxXO0FBRUwsMkJBQWM7QUFBQTs7QUFDYixXQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBOzs7O2FBQ0Qsa0JBQ0NDLGFBREQsRUFFQ0MsYUFGRCxFQUdDQyxPQUhELEVBSUNDLGlCQUpELEVBS0NDLFdBTEQsRUFNUTtBQUNQLFlBQU1DLGtCQUFrQixHQUFHLEtBQUtBLGtCQUFMLENBQXdCTCxhQUF4QixFQUF1Q0MsYUFBdkMsRUFBc0RDLE9BQXRELEVBQStEQyxpQkFBL0QsRUFBa0ZDLFdBQWxGLENBQTNCOztBQUNBLFlBQUksQ0FBQ0Msa0JBQUwsRUFBeUI7QUFDeEIsZUFBS04sT0FBTCxDQUFhTyxJQUFiLENBQWtCO0FBQ2pCQyxZQUFBQSxRQUFRLEVBQUVQLGFBRE87QUFFakJRLFlBQUFBLFFBQVEsRUFBRVAsYUFGTztBQUdqQkMsWUFBQUEsT0FBTyxFQUFFQSxPQUhRO0FBSWpCRSxZQUFBQSxXQUFXLEVBQUVBO0FBSkksV0FBbEI7QUFNQTtBQUNEOzs7YUFDRCxxQkFBK0I7QUFDOUIsZUFBTyxLQUFLTCxPQUFaO0FBQ0E7OzthQUNELDZCQUFvQlUsVUFBcEIsRUFBK0NMLFdBQS9DLEVBQXdGO0FBQ3ZGLFlBQUlBLFdBQUosRUFBaUI7QUFDaEIsaUJBQU8sS0FBS0wsT0FBTCxDQUFhVyxNQUFiLENBQW9CLFVBQUFDLEtBQUs7QUFBQSxtQkFBSUEsS0FBSyxDQUFDSixRQUFOLEtBQW1CRSxVQUFuQixJQUFpQ0UsS0FBSyxDQUFDUCxXQUFOLEtBQXNCQSxXQUEzRDtBQUFBLFdBQXpCLENBQVA7QUFDQSxTQUZELE1BRU87QUFDTixpQkFBTyxLQUFLTCxPQUFMLENBQWFXLE1BQWIsQ0FBb0IsVUFBQUMsS0FBSztBQUFBLG1CQUFJQSxLQUFLLENBQUNKLFFBQU4sS0FBbUJFLFVBQXZCO0FBQUEsV0FBekIsQ0FBUDtBQUNBO0FBQ0Q7OzthQUNELDRCQUNDQSxVQURELEVBRUNELFFBRkQsRUFHQ04sT0FIRCxFQUlDQyxpQkFKRCxFQUtDUyxnQkFMRCxFQU1XO0FBQ1YsWUFBSVQsaUJBQWlCLElBQUlBLGlCQUFpQixDQUFDTSxVQUFELENBQXRDLElBQXNERyxnQkFBMUQsRUFBNEU7QUFDM0UsaUJBQU8sS0FBS2IsT0FBTCxDQUFhYyxJQUFiLENBQ04sVUFBQUYsS0FBSztBQUFBLG1CQUNKQSxLQUFLLENBQUNKLFFBQU4sS0FBbUJFLFVBQW5CLElBQ0FFLEtBQUssQ0FBQ0gsUUFBTixLQUFtQkEsUUFEbkIsSUFFQUcsS0FBSyxDQUFDVCxPQUFOLENBQWNZLE9BQWQsQ0FBc0IsS0FBdEIsRUFBNkIsRUFBN0IsTUFBcUNaLE9BQU8sQ0FBQ1ksT0FBUixDQUFnQixLQUFoQixFQUF1QixFQUF2QixDQUZyQyxJQUdBSCxLQUFLLENBQUNQLFdBQU4sS0FBc0JRLGdCQUpsQjtBQUFBLFdBREMsQ0FBUDtBQU9BOztBQUNELGVBQU8sS0FBS2IsT0FBTCxDQUFhYyxJQUFiLENBQ04sVUFBQUYsS0FBSztBQUFBLGlCQUNKQSxLQUFLLENBQUNKLFFBQU4sS0FBbUJFLFVBQW5CLElBQ0FFLEtBQUssQ0FBQ0gsUUFBTixLQUFtQkEsUUFEbkIsSUFFQUcsS0FBSyxDQUFDVCxPQUFOLENBQWNZLE9BQWQsQ0FBc0IsS0FBdEIsRUFBNkIsRUFBN0IsTUFBcUNaLE9BQU8sQ0FBQ1ksT0FBUixDQUFnQixLQUFoQixFQUF1QixFQUF2QixDQUhqQztBQUFBLFNBREMsQ0FBUDtBQU1BOzs7Ozs7U0FHYWhCLFciLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuXG5leHBvcnQgdHlwZSBJc3N1ZURlZmluaXRpb24gPSB7XG5cdGNhdGVnb3J5OiBJc3N1ZUNhdGVnb3J5O1xuXHRzZXZlcml0eTogSXNzdWVTZXZlcml0eTtcblx0ZGV0YWlsczogc3RyaW5nO1xuXHRzdWJDYXRlZ29yeT86IHN0cmluZyB8IHVuZGVmaW5lZDtcbn07XG5jbGFzcyBEaWFnbm9zdGljcyB7XG5cdF9pc3N1ZXM6IElzc3VlRGVmaW5pdGlvbltdO1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9pc3N1ZXMgPSBbXTtcblx0fVxuXHRhZGRJc3N1ZShcblx0XHRpc3N1ZUNhdGVnb3J5OiBJc3N1ZUNhdGVnb3J5LFxuXHRcdGlzc3VlU2V2ZXJpdHk6IElzc3VlU2V2ZXJpdHksXG5cdFx0ZGV0YWlsczogc3RyaW5nLFxuXHRcdGlzc3VlQ2F0ZWdvcnlUeXBlPzogYW55IHwgdW5kZWZpbmVkLFxuXHRcdHN1YkNhdGVnb3J5Pzogc3RyaW5nIHwgdW5kZWZpbmVkXG5cdCk6IHZvaWQge1xuXHRcdGNvbnN0IGNoZWNrSWZJc3N1ZUV4aXN0cyA9IHRoaXMuY2hlY2tJZklzc3VlRXhpc3RzKGlzc3VlQ2F0ZWdvcnksIGlzc3VlU2V2ZXJpdHksIGRldGFpbHMsIGlzc3VlQ2F0ZWdvcnlUeXBlLCBzdWJDYXRlZ29yeSk7XG5cdFx0aWYgKCFjaGVja0lmSXNzdWVFeGlzdHMpIHtcblx0XHRcdHRoaXMuX2lzc3Vlcy5wdXNoKHtcblx0XHRcdFx0Y2F0ZWdvcnk6IGlzc3VlQ2F0ZWdvcnksXG5cdFx0XHRcdHNldmVyaXR5OiBpc3N1ZVNldmVyaXR5LFxuXHRcdFx0XHRkZXRhaWxzOiBkZXRhaWxzLFxuXHRcdFx0XHRzdWJDYXRlZ29yeTogc3ViQ2F0ZWdvcnlcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRnZXRJc3N1ZXMoKTogSXNzdWVEZWZpbml0aW9uW10ge1xuXHRcdHJldHVybiB0aGlzLl9pc3N1ZXM7XG5cdH1cblx0Z2V0SXNzdWVzQnlDYXRlZ29yeShpbkNhdGVnb3J5OiBJc3N1ZUNhdGVnb3J5LCBzdWJDYXRlZ29yeT86IHN0cmluZyk6IElzc3VlRGVmaW5pdGlvbltdIHtcblx0XHRpZiAoc3ViQ2F0ZWdvcnkpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pc3N1ZXMuZmlsdGVyKGlzc3VlID0+IGlzc3VlLmNhdGVnb3J5ID09PSBpbkNhdGVnb3J5ICYmIGlzc3VlLnN1YkNhdGVnb3J5ID09PSBzdWJDYXRlZ29yeSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9pc3N1ZXMuZmlsdGVyKGlzc3VlID0+IGlzc3VlLmNhdGVnb3J5ID09PSBpbkNhdGVnb3J5KTtcblx0XHR9XG5cdH1cblx0Y2hlY2tJZklzc3VlRXhpc3RzKFxuXHRcdGluQ2F0ZWdvcnk6IElzc3VlQ2F0ZWdvcnksXG5cdFx0c2V2ZXJpdHk6IElzc3VlU2V2ZXJpdHksXG5cdFx0ZGV0YWlsczogc3RyaW5nLFxuXHRcdGlzc3VlQ2F0ZWdvcnlUeXBlPzogYW55LFxuXHRcdGlzc3VlU3ViQ2F0ZWdvcnk/OiBzdHJpbmdcblx0KTogYm9vbGVhbiB7XG5cdFx0aWYgKGlzc3VlQ2F0ZWdvcnlUeXBlICYmIGlzc3VlQ2F0ZWdvcnlUeXBlW2luQ2F0ZWdvcnldICYmIGlzc3VlU3ViQ2F0ZWdvcnkpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pc3N1ZXMuc29tZShcblx0XHRcdFx0aXNzdWUgPT5cblx0XHRcdFx0XHRpc3N1ZS5jYXRlZ29yeSA9PT0gaW5DYXRlZ29yeSAmJlxuXHRcdFx0XHRcdGlzc3VlLnNldmVyaXR5ID09PSBzZXZlcml0eSAmJlxuXHRcdFx0XHRcdGlzc3VlLmRldGFpbHMucmVwbGFjZSgvXFxuL2csIFwiXCIpID09PSBkZXRhaWxzLnJlcGxhY2UoL1xcbi9nLCBcIlwiKSAmJlxuXHRcdFx0XHRcdGlzc3VlLnN1YkNhdGVnb3J5ID09PSBpc3N1ZVN1YkNhdGVnb3J5XG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5faXNzdWVzLnNvbWUoXG5cdFx0XHRpc3N1ZSA9PlxuXHRcdFx0XHRpc3N1ZS5jYXRlZ29yeSA9PT0gaW5DYXRlZ29yeSAmJlxuXHRcdFx0XHRpc3N1ZS5zZXZlcml0eSA9PT0gc2V2ZXJpdHkgJiZcblx0XHRcdFx0aXNzdWUuZGV0YWlscy5yZXBsYWNlKC9cXG4vZywgXCJcIikgPT09IGRldGFpbHMucmVwbGFjZSgvXFxuL2csIFwiXCIpXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaWFnbm9zdGljcztcbiJdfQ==