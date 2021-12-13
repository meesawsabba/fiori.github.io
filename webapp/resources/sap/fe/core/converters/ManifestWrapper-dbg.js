/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/ManifestSettings"], function (ManifestSettings) {
  "use strict";

  var VariantManagementType = ManifestSettings.VariantManagementType;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   *
   */
  var ManifestWrapper = /*#__PURE__*/function () {
    /**
     * Creates a wrapper object to ensure the data returned from the manifest is consistent and everything is merged correctly.
     *
     * @param {BaseManifestSettings} oManifestSettings The manifest settings for the current page
     * @param {Function} mergeFn A function that will be used to perform the merge
     * @returns {ManifestWrapper} The manifest wrapper object
     */
    function ManifestWrapper(oManifestSettings, mergeFn) {
      _classCallCheck(this, ManifestWrapper);

      this.oManifestSettings = oManifestSettings;
      this.mergeFn = mergeFn;
    }
    /**
     * Returns the current template type.
     *
     * @returns The type of the current template
     */


    _createClass(ManifestWrapper, [{
      key: "getTemplateType",
      value: function getTemplateType() {
        return this.oManifestSettings.converterType;
      }
      /**
       * Checks whether the current environment is a desktop or not.
       *
       * @returns {boolean} `true` if we are on a desktop
       */

    }, {
      key: "isDesktop",
      value: function isDesktop() {
        return !!this.oManifestSettings.isDesktop;
      }
      /**
       * Retrieves the form containers (field groups/identification) defined in the manifest.
       *
       * @param {string} facetTarget The target annotation path for this form
       * @returns {FormManifestConfiguration} A set of manifest header facets indexed by an iterable key
       */

    }, {
      key: "getFormContainer",
      value: function getFormContainer(facetTarget) {
        var _this$oManifestSettin;

        return (_this$oManifestSettin = this.oManifestSettings.controlConfiguration) === null || _this$oManifestSettin === void 0 ? void 0 : _this$oManifestSettin[facetTarget];
      }
      /**
       * Retrieves the headerFacets defined in the manifest.
       *
       * @returns {ConfigurableRecord<ManifestHeaderFacet>} A set of manifest header facets indexed by an iterable key
       */

    }, {
      key: "getHeaderFacets",
      value: function getHeaderFacets() {
        var _this$oManifestSettin2, _this$oManifestSettin3, _content, _content$header;

        return this.mergeFn({}, (_this$oManifestSettin2 = this.oManifestSettings.controlConfiguration) === null || _this$oManifestSettin2 === void 0 ? void 0 : (_this$oManifestSettin3 = _this$oManifestSettin2["@com.sap.vocabularies.UI.v1.HeaderFacets"]) === null || _this$oManifestSettin3 === void 0 ? void 0 : _this$oManifestSettin3.facets, (_content = this.oManifestSettings.content) === null || _content === void 0 ? void 0 : (_content$header = _content.header) === null || _content$header === void 0 ? void 0 : _content$header.facets);
      }
      /**
       * Retrieves the header actions defined in the manifest.
       *
       * @returns {ConfigurableRecord<ManifestAction>} A set of manifest actions indexed by an iterable key
       */

    }, {
      key: "getHeaderActions",
      value: function getHeaderActions() {
        var _this$oManifestSettin4, _this$oManifestSettin5;

        return ((_this$oManifestSettin4 = this.oManifestSettings.content) === null || _this$oManifestSettin4 === void 0 ? void 0 : (_this$oManifestSettin5 = _this$oManifestSettin4.header) === null || _this$oManifestSettin5 === void 0 ? void 0 : _this$oManifestSettin5.actions) || {};
      }
      /**
       * Retrieves the footer actions defined in the manifest.
       *
       * @returns {ConfigurableRecord<ManifestAction>} A set of manifest actions indexed by an iterable key
       */

    }, {
      key: "getFooterActions",
      value: function getFooterActions() {
        var _this$oManifestSettin6, _this$oManifestSettin7;

        return ((_this$oManifestSettin6 = this.oManifestSettings.content) === null || _this$oManifestSettin6 === void 0 ? void 0 : (_this$oManifestSettin7 = _this$oManifestSettin6.footer) === null || _this$oManifestSettin7 === void 0 ? void 0 : _this$oManifestSettin7.actions) || {};
      }
      /**
       * Retrieves the variant management as defined in the manifest.
       *
       * @returns {VariantManagementType} A type of variant management
       */

    }, {
      key: "getVariantManagement",
      value: function getVariantManagement() {
        return this.oManifestSettings.variantManagement || VariantManagementType.None;
      }
      /**
       * Retrieves the annotation Path for the SPV in the manifest.
       *
       * @returns {string|undefined} The annotation path for the default SPV or undefined.
       */

    }, {
      key: "getDefaultTemplateAnnotationPath",
      value: function getDefaultTemplateAnnotationPath() {
        return this.oManifestSettings.defaultTemplateAnnotationPath;
      }
      /**
       * Retrieves the control configuration as defined in the manifest for a specific annotation path.
       *
       * @param {string} sAnnotationPath The relative annotation path
       * @private
       * @returns {object} The control configuration
       */

    }, {
      key: "getControlConfiguration",
      value: function getControlConfiguration(sAnnotationPath) {
        var _this$oManifestSettin8, _this$oManifestSettin9;

        return ((_this$oManifestSettin8 = this.oManifestSettings) === null || _this$oManifestSettin8 === void 0 ? void 0 : (_this$oManifestSettin9 = _this$oManifestSettin8.controlConfiguration) === null || _this$oManifestSettin9 === void 0 ? void 0 : _this$oManifestSettin9[sAnnotationPath]) || {};
      }
      /**
       * Retrieves the configured settings for a given navigation target.
       *
       * @param {string} navigationOrCollectionName The name of the navigation to check
       * @returns {NavigationSettingsConfiguration} The navigation settings configuration
       */

    }, {
      key: "getNavigationConfiguration",
      value: function getNavigationConfiguration(navigationOrCollectionName) {
        var _this$oManifestSettin10, _this$oManifestSettin11;

        return ((_this$oManifestSettin10 = this.oManifestSettings) === null || _this$oManifestSettin10 === void 0 ? void 0 : (_this$oManifestSettin11 = _this$oManifestSettin10.navigation) === null || _this$oManifestSettin11 === void 0 ? void 0 : _this$oManifestSettin11[navigationOrCollectionName]) || {};
      }
      /**
       * Retrieves the view level.
       *
       * @returns {number} The current view level
       */

    }, {
      key: "getViewLevel",
      value: function getViewLevel() {
        var _this$oManifestSettin12;

        return ((_this$oManifestSettin12 = this.oManifestSettings) === null || _this$oManifestSettin12 === void 0 ? void 0 : _this$oManifestSettin12.viewLevel) || -1;
      }
      /**
       * Retrieves the contentDensities setting of the application.
       *
       * @returns {ContentDensitiesType} The current content density
       */

    }, {
      key: "getContentDensities",
      value: function getContentDensities() {
        var _this$oManifestSettin13;

        return ((_this$oManifestSettin13 = this.oManifestSettings) === null || _this$oManifestSettin13 === void 0 ? void 0 : _this$oManifestSettin13.contentDensities) || {
          cozy: false,
          compact: false
        };
      }
      /**
       * Checks whether we are in FCL mode or not.
       *
       * @returns {boolean} `true` if we are in FCL
       */

    }, {
      key: "isFclEnabled",
      value: function isFclEnabled() {
        var _this$oManifestSettin14;

        return !!((_this$oManifestSettin14 = this.oManifestSettings) !== null && _this$oManifestSettin14 !== void 0 && _this$oManifestSettin14.fclEnabled);
      }
      /**
       * Checks whether the current settings (application / shell) allows us to use condensed layout.
       *
       * @returns {boolean} `true` if we can use the condensed layout, false otherwise
       */

    }, {
      key: "isCondensedLayoutCompliant",
      value: function isCondensedLayoutCompliant() {
        var _this$oManifestSettin15, _this$oManifestSettin16;

        var manifestContentDensity = ((_this$oManifestSettin15 = this.oManifestSettings) === null || _this$oManifestSettin15 === void 0 ? void 0 : _this$oManifestSettin15.contentDensities) || {
          cozy: false,
          compact: false
        };
        var shellContentDensity = ((_this$oManifestSettin16 = this.oManifestSettings) === null || _this$oManifestSettin16 === void 0 ? void 0 : _this$oManifestSettin16.shellContentDensity) || "compact";
        var isCondensedLayoutCompliant = true;

        if ((manifestContentDensity === null || manifestContentDensity === void 0 ? void 0 : manifestContentDensity.cozy) === true && (manifestContentDensity === null || manifestContentDensity === void 0 ? void 0 : manifestContentDensity.compact) !== true || shellContentDensity === "cozy") {
          isCondensedLayoutCompliant = false;
        }

        return isCondensedLayoutCompliant;
      } //region OP Specific

      /**
       * Retrieves the sections defined in the manifest.
       *
       * @returns {ConfigurableRecord<ManifestSection>} A set of manifest sections indexed by an iterable key
       */

    }, {
      key: "getSections",
      value: function getSections() {
        var _this$oManifestSettin17, _this$oManifestSettin18, _content2, _content2$body;

        return this.mergeFn({}, (_this$oManifestSettin17 = this.oManifestSettings.controlConfiguration) === null || _this$oManifestSettin17 === void 0 ? void 0 : (_this$oManifestSettin18 = _this$oManifestSettin17["@com.sap.vocabularies.UI.v1.Facets"]) === null || _this$oManifestSettin18 === void 0 ? void 0 : _this$oManifestSettin18.sections, (_content2 = this.oManifestSettings.content) === null || _content2 === void 0 ? void 0 : (_content2$body = _content2.body) === null || _content2$body === void 0 ? void 0 : _content2$body.sections);
      }
      /**
       * Returns true of the header of the application is editable and should appear in the facets.
       *
       * @returns {boolean} `true` if the header if editable
       */

    }, {
      key: "isHeaderEditable",
      value: function isHeaderEditable() {
        return this.getShowObjectPageHeader() && this.oManifestSettings.editableHeaderContent;
      }
      /**
       * Returns true if we should show the object page header.
       *
       * @returns {boolean} `true` if the header should be displayed
       */

    }, {
      key: "getShowAnchorBar",
      value: function getShowAnchorBar() {
        var _content3, _content3$header, _content4, _content4$header;

        return ((_content3 = this.oManifestSettings.content) === null || _content3 === void 0 ? void 0 : (_content3$header = _content3.header) === null || _content3$header === void 0 ? void 0 : _content3$header.anchorBarVisible) !== undefined ? !!((_content4 = this.oManifestSettings.content) !== null && _content4 !== void 0 && (_content4$header = _content4.header) !== null && _content4$header !== void 0 && _content4$header.anchorBarVisible) : true;
      }
      /**
       * Defines whether or not the section will be displayed in different tabs.
       *
       * @returns {boolean} `true` if the icon tab bar should be used instead of scrolling
       */

    }, {
      key: "useIconTabBar",
      value: function useIconTabBar() {
        return this.getShowAnchorBar() && this.oManifestSettings.sectionLayout === "Tabs";
      }
      /**
       * Returns true if the object page header is to be shown.
       *
       * @returns {boolean} `true` if the object page header is to be displayed
       */

    }, {
      key: "getShowObjectPageHeader",
      value: function getShowObjectPageHeader() {
        var _content5, _content5$header, _content6, _content6$header;

        return ((_content5 = this.oManifestSettings.content) === null || _content5 === void 0 ? void 0 : (_content5$header = _content5.header) === null || _content5$header === void 0 ? void 0 : _content5$header.visible) !== undefined ? !!((_content6 = this.oManifestSettings.content) !== null && _content6 !== void 0 && (_content6$header = _content6.header) !== null && _content6$header !== void 0 && _content6$header.visible) : true;
      } //endregion OP Specific
      //region LR Specific

      /**
       * Retrieves the multiple view configuration from the manifest.
       *
       * @returns {MultipleViewsConfiguration} The views that represent the manifest object
       */

    }, {
      key: "getViewConfiguration",
      value: function getViewConfiguration() {
        return this.oManifestSettings.views;
      }
      /**
       * Retrieves the KPI configuration from the manifest.
       *
       * @returns {object} Returns a map between KPI names and their respective configuration
       */

    }, {
      key: "getKPIConfiguration",
      value: function getKPIConfiguration() {
        return this.oManifestSettings.keyPerformanceIndicators || {};
      }
      /**
       * Retrieves the filter configuration from the manifest.
       *
       * @returns {FilterManifestConfiguration} The filter configuration from the manifest
       */

    }, {
      key: "getFilterConfiguration",
      value: function getFilterConfiguration() {
        return this.getControlConfiguration("@com.sap.vocabularies.UI.v1.SelectionFields");
      }
      /**
       * Returns true if there are multiple entity sets to be displayed.
       *
       * @returns {boolean} `true` if there are multiple entity sets
       */

    }, {
      key: "hasMultipleEntitySets",
      value: function hasMultipleEntitySets() {
        var _this = this;

        var viewConfig = this.getViewConfiguration() || {
          paths: []
        };
        var manifestEntitySet = this.oManifestSettings.entitySet;
        return viewConfig.paths.find(function (path) {
          var _path;

          if ((_path = path) !== null && _path !== void 0 && _path.template) {
            return undefined;
          } else if (_this.hasMultipleVisualizations(path)) {
            var _ref = path,
                primary = _ref.primary,
                secondary = _ref.secondary;
            return primary.some(function (path) {
              return path.entitySet && path.entitySet !== manifestEntitySet;
            }) || secondary.some(function (path) {
              return path.entitySet && path.entitySet !== manifestEntitySet;
            });
          } else {
            path = path;
            return path.entitySet && path.entitySet !== manifestEntitySet;
          }
        }) !== undefined;
      }
      /**
       * Returns the context path for the template if it is specified in the manifest.
       *
       * @returns {string} The context path for the template
       */

    }, {
      key: "getContextPath",
      value: function getContextPath() {
        var _this$oManifestSettin19;

        return (_this$oManifestSettin19 = this.oManifestSettings) === null || _this$oManifestSettin19 === void 0 ? void 0 : _this$oManifestSettin19.contextPath;
      }
      /**
       * Returns true if there are multiple visualizations.
       *
       * @param {ViewPathConfiguration} path The path from the view
       * @returns {boolean} `true` if there are multiple visualizations
       */

    }, {
      key: "hasMultipleVisualizations",
      value: function hasMultipleVisualizations(path) {
        var _primary2, _secondary2;

        if (!path) {
          var viewConfig = this.getViewConfiguration() || {
            paths: []
          };
          return viewConfig.paths.some(function (path) {
            var _primary, _secondary;

            return ((_primary = path.primary) === null || _primary === void 0 ? void 0 : _primary.length) > 0 && ((_secondary = path.secondary) === null || _secondary === void 0 ? void 0 : _secondary.length) > 0;
          });
        }

        return ((_primary2 = path.primary) === null || _primary2 === void 0 ? void 0 : _primary2.length) > 0 && ((_secondary2 = path.secondary) === null || _secondary2 === void 0 ? void 0 : _secondary2.length) > 0;
      } //end region LR Specific

    }]);

    return ManifestWrapper;
  }();

  return ManifestWrapper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hbmlmZXN0V3JhcHBlci50cyJdLCJuYW1lcyI6WyJNYW5pZmVzdFdyYXBwZXIiLCJvTWFuaWZlc3RTZXR0aW5ncyIsIm1lcmdlRm4iLCJjb252ZXJ0ZXJUeXBlIiwiaXNEZXNrdG9wIiwiZmFjZXRUYXJnZXQiLCJjb250cm9sQ29uZmlndXJhdGlvbiIsImZhY2V0cyIsImNvbnRlbnQiLCJoZWFkZXIiLCJhY3Rpb25zIiwiZm9vdGVyIiwidmFyaWFudE1hbmFnZW1lbnQiLCJWYXJpYW50TWFuYWdlbWVudFR5cGUiLCJOb25lIiwiZGVmYXVsdFRlbXBsYXRlQW5ub3RhdGlvblBhdGgiLCJzQW5ub3RhdGlvblBhdGgiLCJuYXZpZ2F0aW9uT3JDb2xsZWN0aW9uTmFtZSIsIm5hdmlnYXRpb24iLCJ2aWV3TGV2ZWwiLCJjb250ZW50RGVuc2l0aWVzIiwiY296eSIsImNvbXBhY3QiLCJmY2xFbmFibGVkIiwibWFuaWZlc3RDb250ZW50RGVuc2l0eSIsInNoZWxsQ29udGVudERlbnNpdHkiLCJpc0NvbmRlbnNlZExheW91dENvbXBsaWFudCIsInNlY3Rpb25zIiwiYm9keSIsImdldFNob3dPYmplY3RQYWdlSGVhZGVyIiwiZWRpdGFibGVIZWFkZXJDb250ZW50IiwiYW5jaG9yQmFyVmlzaWJsZSIsInVuZGVmaW5lZCIsImdldFNob3dBbmNob3JCYXIiLCJzZWN0aW9uTGF5b3V0IiwidmlzaWJsZSIsInZpZXdzIiwia2V5UGVyZm9ybWFuY2VJbmRpY2F0b3JzIiwiZ2V0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJ2aWV3Q29uZmlnIiwiZ2V0Vmlld0NvbmZpZ3VyYXRpb24iLCJwYXRocyIsIm1hbmlmZXN0RW50aXR5U2V0IiwiZW50aXR5U2V0IiwiZmluZCIsInBhdGgiLCJ0ZW1wbGF0ZSIsImhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMiLCJwcmltYXJ5Iiwic2Vjb25kYXJ5Iiwic29tZSIsImNvbnRleHRQYXRoIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiO0FBQUE7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QTtBQUNBOzs7O2FBQ0MsbUNBQTBCTixJQUExQixFQUFpRTtBQUFBOztBQUNoRSxZQUFJLENBQUNBLElBQUwsRUFBVztBQUNWLGNBQU1OLFVBQVUsR0FBRyxLQUFLQyxvQkFBTCxNQUErQjtBQUFFQyxZQUFBQSxLQUFLLEVBQUU7QUFBVCxXQUFsRDtBQUNBLGlCQUFPRixVQUFVLENBQUNFLEtBQVgsQ0FBaUJTLElBQWpCLENBQXNCLFVBQUFMLElBQUksRUFBSTtBQUFBOztBQUNwQyxtQkFDQyxhQUFDQSxJQUFELENBQXdDRyxPQUF4QyxzREFBaURJLE1BQWpELElBQTBELENBQTFELElBQ0EsZUFBQ1AsSUFBRCxDQUF3Q0ksU0FBeEMsMERBQW1ERyxNQUFuRCxJQUE0RCxDQUY3RDtBQUlBLFdBTE0sQ0FBUDtBQU1BOztBQUNELGVBQU8sY0FBQ1AsSUFBRCxDQUF3Q0csT0FBeEMsd0RBQWlESSxNQUFqRCxJQUEwRCxDQUExRCxJQUErRCxnQkFBQ1AsSUFBRCxDQUF3Q0ksU0FBeEMsNERBQW1ERyxNQUFuRCxJQUE0RCxDQUFsSTtBQUNBLE8sQ0FFRDs7Ozs7OztTQUdjcEQsZSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uZmlndXJhYmxlUmVjb3JkIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7XG5cdEJhc2VNYW5pZmVzdFNldHRpbmdzLFxuXHRDb21iaW5lZFZpZXdQYXRoQ29uZmlndXJhdGlvbixcblx0Q29udGVudERlbnNpdGllc1R5cGUsXG5cdEZpbHRlck1hbmlmZXN0Q29uZmlndXJhdGlvbixcblx0Rm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbixcblx0TGlzdFJlcG9ydE1hbmlmZXN0U2V0dGluZ3MsXG5cdE1hbmlmZXN0QWN0aW9uLFxuXHRNYW5pZmVzdEhlYWRlckZhY2V0LFxuXHRNYW5pZmVzdFNlY3Rpb24sXG5cdE11bHRpcGxlVmlld3NDb25maWd1cmF0aW9uLFxuXHROYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLFxuXHRPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5ncyxcblx0U2luZ2xlVmlld1BhdGhDb25maWd1cmF0aW9uLFxuXHRWaWV3UGF0aENvbmZpZ3VyYXRpb24sXG5cdFRlbXBsYXRlVHlwZSxcblx0VmFyaWFudE1hbmFnZW1lbnRUeXBlLFxuXHRDdXN0b21WaWV3VGVtcGxhdGVDb25maWd1cmF0aW9uLFxuXHRWaWV3Q29uZmlndXJhdGlvbixcblx0S1BJQ29uZmlndXJhdGlvblxufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgTWFuaWZlc3RXcmFwcGVyIHtcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSB3cmFwcGVyIG9iamVjdCB0byBlbnN1cmUgdGhlIGRhdGEgcmV0dXJuZWQgZnJvbSB0aGUgbWFuaWZlc3QgaXMgY29uc2lzdGVudCBhbmQgZXZlcnl0aGluZyBpcyBtZXJnZWQgY29ycmVjdGx5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jhc2VNYW5pZmVzdFNldHRpbmdzfSBvTWFuaWZlc3RTZXR0aW5ncyBUaGUgbWFuaWZlc3Qgc2V0dGluZ3MgZm9yIHRoZSBjdXJyZW50IHBhZ2Vcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGbiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHBlcmZvcm0gdGhlIG1lcmdlXG5cdCAqIEByZXR1cm5zIHtNYW5pZmVzdFdyYXBwZXJ9IFRoZSBtYW5pZmVzdCB3cmFwcGVyIG9iamVjdFxuXHQgKi9cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBvTWFuaWZlc3RTZXR0aW5nczogQmFzZU1hbmlmZXN0U2V0dGluZ3MsIHByaXZhdGUgbWVyZ2VGbjogRnVuY3Rpb24pIHt9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGVtcGxhdGUgdHlwZS5cblx0ICpcblx0ICogQHJldHVybnMgVGhlIHR5cGUgb2YgdGhlIGN1cnJlbnQgdGVtcGxhdGVcblx0ICovXG5cdGdldFRlbXBsYXRlVHlwZSgpOiBUZW1wbGF0ZVR5cGUge1xuXHRcdHJldHVybiB0aGlzLm9NYW5pZmVzdFNldHRpbmdzLmNvbnZlcnRlclR5cGU7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXMgYSBkZXNrdG9wIG9yIG5vdC5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB3ZSBhcmUgb24gYSBkZXNrdG9wXG5cdCAqL1xuXHRpc0Rlc2t0b3AoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICEhdGhpcy5vTWFuaWZlc3RTZXR0aW5ncy5pc0Rlc2t0b3A7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBmb3JtIGNvbnRhaW5lcnMgKGZpZWxkIGdyb3Vwcy9pZGVudGlmaWNhdGlvbikgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmYWNldFRhcmdldCBUaGUgdGFyZ2V0IGFubm90YXRpb24gcGF0aCBmb3IgdGhpcyBmb3JtXG5cdCAqIEByZXR1cm5zIHtGb3JtTWFuaWZlc3RDb25maWd1cmF0aW9ufSBBIHNldCBvZiBtYW5pZmVzdCBoZWFkZXIgZmFjZXRzIGluZGV4ZWQgYnkgYW4gaXRlcmFibGUga2V5XG5cdCAqL1xuXHRnZXRGb3JtQ29udGFpbmVyKGZhY2V0VGFyZ2V0OiBzdHJpbmcpOiBGb3JtTWFuaWZlc3RDb25maWd1cmF0aW9uIHtcblx0XHRyZXR1cm4gdGhpcy5vTWFuaWZlc3RTZXR0aW5ncy5jb250cm9sQ29uZmlndXJhdGlvbj8uW2ZhY2V0VGFyZ2V0XSBhcyBGb3JtTWFuaWZlc3RDb25maWd1cmF0aW9uO1xuXHR9XG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGhlYWRlckZhY2V0cyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdC5cblx0ICpcblx0ICogQHJldHVybnMge0NvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEhlYWRlckZhY2V0Pn0gQSBzZXQgb2YgbWFuaWZlc3QgaGVhZGVyIGZhY2V0cyBpbmRleGVkIGJ5IGFuIGl0ZXJhYmxlIGtleVxuXHQgKi9cblx0Z2V0SGVhZGVyRmFjZXRzKCk6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEhlYWRlckZhY2V0PiB7XG5cdFx0cmV0dXJuIHRoaXMubWVyZ2VGbihcblx0XHRcdHt9LFxuXHRcdFx0dGhpcy5vTWFuaWZlc3RTZXR0aW5ncy5jb250cm9sQ29uZmlndXJhdGlvbj8uW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckZhY2V0c1wiXT8uZmFjZXRzLFxuXHRcdFx0KHRoaXMub01hbmlmZXN0U2V0dGluZ3MgYXMgT2JqZWN0UGFnZU1hbmlmZXN0U2V0dGluZ3MpLmNvbnRlbnQ/LmhlYWRlcj8uZmFjZXRzXG5cdFx0KTtcblx0fVxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBoZWFkZXIgYWN0aW9ucyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdC5cblx0ICpcblx0ICogQHJldHVybnMge0NvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj59IEEgc2V0IG9mIG1hbmlmZXN0IGFjdGlvbnMgaW5kZXhlZCBieSBhbiBpdGVyYWJsZSBrZXlcblx0ICovXG5cdGdldEhlYWRlckFjdGlvbnMoKTogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0QWN0aW9uPiB7XG5cdFx0cmV0dXJuIHRoaXMub01hbmlmZXN0U2V0dGluZ3MuY29udGVudD8uaGVhZGVyPy5hY3Rpb25zIHx8IHt9O1xuXHR9XG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGZvb3RlciBhY3Rpb25zIGRlZmluZWQgaW4gdGhlIG1hbmlmZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Q29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0QWN0aW9uPn0gQSBzZXQgb2YgbWFuaWZlc3QgYWN0aW9ucyBpbmRleGVkIGJ5IGFuIGl0ZXJhYmxlIGtleVxuXHQgKi9cblx0Z2V0Rm9vdGVyQWN0aW9ucygpOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+IHtcblx0XHRyZXR1cm4gdGhpcy5vTWFuaWZlc3RTZXR0aW5ncy5jb250ZW50Py5mb290ZXI/LmFjdGlvbnMgfHwge307XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB2YXJpYW50IG1hbmFnZW1lbnQgYXMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtWYXJpYW50TWFuYWdlbWVudFR5cGV9IEEgdHlwZSBvZiB2YXJpYW50IG1hbmFnZW1lbnRcblx0ICovXG5cdGdldFZhcmlhbnRNYW5hZ2VtZW50KCk6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZSB7XG5cdFx0cmV0dXJuIHRoaXMub01hbmlmZXN0U2V0dGluZ3MudmFyaWFudE1hbmFnZW1lbnQgfHwgVmFyaWFudE1hbmFnZW1lbnRUeXBlLk5vbmU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBhbm5vdGF0aW9uIFBhdGggZm9yIHRoZSBTUFYgaW4gdGhlIG1hbmlmZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH0gVGhlIGFubm90YXRpb24gcGF0aCBmb3IgdGhlIGRlZmF1bHQgU1BWIG9yIHVuZGVmaW5lZC5cblx0ICovXG5cdGdldERlZmF1bHRUZW1wbGF0ZUFubm90YXRpb25QYXRoKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMub01hbmlmZXN0U2V0dGluZ3MuZGVmYXVsdFRlbXBsYXRlQW5ub3RhdGlvblBhdGg7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBjb250cm9sIGNvbmZpZ3VyYXRpb24gYXMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QgZm9yIGEgc3BlY2lmaWMgYW5ub3RhdGlvbiBwYXRoLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0Fubm90YXRpb25QYXRoIFRoZSByZWxhdGl2ZSBhbm5vdGF0aW9uIHBhdGhcblx0ICogQHByaXZhdGVcblx0ICogQHJldHVybnMge29iamVjdH0gVGhlIGNvbnRyb2wgY29uZmlndXJhdGlvblxuXHQgKi9cblx0Z2V0Q29udHJvbENvbmZpZ3VyYXRpb24oc0Fubm90YXRpb25QYXRoOiBzdHJpbmcpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLm9NYW5pZmVzdFNldHRpbmdzPy5jb250cm9sQ29uZmlndXJhdGlvbj8uW3NBbm5vdGF0aW9uUGF0aF0gfHwge307XG5cdH1cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgY29uZmlndXJlZCBzZXR0aW5ncyBmb3IgYSBnaXZlbiBuYXZpZ2F0aW9uIHRhcmdldC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBuYXZpZ2F0aW9uIHRvIGNoZWNrXG5cdCAqIEByZXR1cm5zIHtOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9ufSBUaGUgbmF2aWdhdGlvbiBzZXR0aW5ncyBjb25maWd1cmF0aW9uXG5cdCAqL1xuXHRnZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihuYXZpZ2F0aW9uT3JDb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbiB7XG5cdFx0cmV0dXJuIHRoaXMub01hbmlmZXN0U2V0dGluZ3M/Lm5hdmlnYXRpb24/LltuYXZpZ2F0aW9uT3JDb2xsZWN0aW9uTmFtZV0gfHwge307XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB2aWV3IGxldmVsLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgY3VycmVudCB2aWV3IGxldmVsXG5cdCAqL1xuXHRnZXRWaWV3TGV2ZWwoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5vTWFuaWZlc3RTZXR0aW5ncz8udmlld0xldmVsIHx8IC0xO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgY29udGVudERlbnNpdGllcyBzZXR0aW5nIG9mIHRoZSBhcHBsaWNhdGlvbi5cblx0ICpcblx0ICogQHJldHVybnMge0NvbnRlbnREZW5zaXRpZXNUeXBlfSBUaGUgY3VycmVudCBjb250ZW50IGRlbnNpdHlcblx0ICovXG5cdGdldENvbnRlbnREZW5zaXRpZXMoKTogQ29udGVudERlbnNpdGllc1R5cGUge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLm9NYW5pZmVzdFNldHRpbmdzPy5jb250ZW50RGVuc2l0aWVzIHx8IHtcblx0XHRcdFx0Y296eTogZmFsc2UsXG5cdFx0XHRcdGNvbXBhY3Q6IGZhbHNlXG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3Mgd2hldGhlciB3ZSBhcmUgaW4gRkNMIG1vZGUgb3Igbm90LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHdlIGFyZSBpbiBGQ0xcblx0ICovXG5cdGlzRmNsRW5hYmxlZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gISF0aGlzLm9NYW5pZmVzdFNldHRpbmdzPy5mY2xFbmFibGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNldHRpbmdzIChhcHBsaWNhdGlvbiAvIHNoZWxsKSBhbGxvd3MgdXMgdG8gdXNlIGNvbmRlbnNlZCBsYXlvdXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgd2UgY2FuIHVzZSB0aGUgY29uZGVuc2VkIGxheW91dCwgZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRpc0NvbmRlbnNlZExheW91dENvbXBsaWFudCgpOiBib29sZWFuIHtcblx0XHRjb25zdCBtYW5pZmVzdENvbnRlbnREZW5zaXR5ID0gdGhpcy5vTWFuaWZlc3RTZXR0aW5ncz8uY29udGVudERlbnNpdGllcyB8fCB7XG5cdFx0XHRjb3p5OiBmYWxzZSxcblx0XHRcdGNvbXBhY3Q6IGZhbHNlXG5cdFx0fTtcblx0XHRjb25zdCBzaGVsbENvbnRlbnREZW5zaXR5ID0gdGhpcy5vTWFuaWZlc3RTZXR0aW5ncz8uc2hlbGxDb250ZW50RGVuc2l0eSB8fCBcImNvbXBhY3RcIjtcblx0XHRsZXQgaXNDb25kZW5zZWRMYXlvdXRDb21wbGlhbnQgPSB0cnVlO1xuXHRcdGlmICgobWFuaWZlc3RDb250ZW50RGVuc2l0eT8uY296eSA9PT0gdHJ1ZSAmJiBtYW5pZmVzdENvbnRlbnREZW5zaXR5Py5jb21wYWN0ICE9PSB0cnVlKSB8fCBzaGVsbENvbnRlbnREZW5zaXR5ID09PSBcImNvenlcIikge1xuXHRcdFx0aXNDb25kZW5zZWRMYXlvdXRDb21wbGlhbnQgPSBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIGlzQ29uZGVuc2VkTGF5b3V0Q29tcGxpYW50O1xuXHR9XG5cblx0Ly9yZWdpb24gT1AgU3BlY2lmaWNcblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBzZWN0aW9ucyBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdC5cblx0ICpcblx0ICogQHJldHVybnMge0NvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdFNlY3Rpb24+fSBBIHNldCBvZiBtYW5pZmVzdCBzZWN0aW9ucyBpbmRleGVkIGJ5IGFuIGl0ZXJhYmxlIGtleVxuXHQgKi9cblx0Z2V0U2VjdGlvbnMoKTogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0U2VjdGlvbj4ge1xuXHRcdHJldHVybiB0aGlzLm1lcmdlRm4oXG5cdFx0XHR7fSxcblx0XHRcdHRoaXMub01hbmlmZXN0U2V0dGluZ3MuY29udHJvbENvbmZpZ3VyYXRpb24/LltcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GYWNldHNcIl0/LnNlY3Rpb25zLFxuXHRcdFx0KHRoaXMub01hbmlmZXN0U2V0dGluZ3MgYXMgT2JqZWN0UGFnZU1hbmlmZXN0U2V0dGluZ3MpLmNvbnRlbnQ/LmJvZHk/LnNlY3Rpb25zXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRydWUgb2YgdGhlIGhlYWRlciBvZiB0aGUgYXBwbGljYXRpb24gaXMgZWRpdGFibGUgYW5kIHNob3VsZCBhcHBlYXIgaW4gdGhlIGZhY2V0cy5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgaGVhZGVyIGlmIGVkaXRhYmxlXG5cdCAqL1xuXHRpc0hlYWRlckVkaXRhYmxlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmdldFNob3dPYmplY3RQYWdlSGVhZGVyKCkgJiYgKHRoaXMub01hbmlmZXN0U2V0dGluZ3MgYXMgT2JqZWN0UGFnZU1hbmlmZXN0U2V0dGluZ3MpLmVkaXRhYmxlSGVhZGVyQ29udGVudDtcblx0fVxuXHQvKipcblx0ICogUmV0dXJucyB0cnVlIGlmIHdlIHNob3VsZCBzaG93IHRoZSBvYmplY3QgcGFnZSBoZWFkZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIGhlYWRlciBzaG91bGQgYmUgZGlzcGxheWVkXG5cdCAqL1xuXHRnZXRTaG93QW5jaG9yQmFyKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAodGhpcy5vTWFuaWZlc3RTZXR0aW5ncyBhcyBPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5ncykuY29udGVudD8uaGVhZGVyPy5hbmNob3JCYXJWaXNpYmxlICE9PSB1bmRlZmluZWRcblx0XHRcdD8gISEodGhpcy5vTWFuaWZlc3RTZXR0aW5ncyBhcyBPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5ncykuY29udGVudD8uaGVhZGVyPy5hbmNob3JCYXJWaXNpYmxlXG5cdFx0XHQ6IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgc2VjdGlvbiB3aWxsIGJlIGRpc3BsYXllZCBpbiBkaWZmZXJlbnQgdGFicy5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgaWNvbiB0YWIgYmFyIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2Ygc2Nyb2xsaW5nXG5cdCAqL1xuXHR1c2VJY29uVGFiQmFyKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmdldFNob3dBbmNob3JCYXIoKSAmJiAodGhpcy5vTWFuaWZlc3RTZXR0aW5ncyBhcyBPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5ncykuc2VjdGlvbkxheW91dCA9PT0gXCJUYWJzXCI7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0cnVlIGlmIHRoZSBvYmplY3QgcGFnZSBoZWFkZXIgaXMgdG8gYmUgc2hvd24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIG9iamVjdCBwYWdlIGhlYWRlciBpcyB0byBiZSBkaXNwbGF5ZWRcblx0ICovXG5cdGdldFNob3dPYmplY3RQYWdlSGVhZGVyKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAodGhpcy5vTWFuaWZlc3RTZXR0aW5ncyBhcyBPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5ncykuY29udGVudD8uaGVhZGVyPy52aXNpYmxlICE9PSB1bmRlZmluZWRcblx0XHRcdD8gISEodGhpcy5vTWFuaWZlc3RTZXR0aW5ncyBhcyBPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5ncykuY29udGVudD8uaGVhZGVyPy52aXNpYmxlXG5cdFx0XHQ6IHRydWU7XG5cdH1cblxuXHQvL2VuZHJlZ2lvbiBPUCBTcGVjaWZpY1xuXG5cdC8vcmVnaW9uIExSIFNwZWNpZmljXG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbXVsdGlwbGUgdmlldyBjb25maWd1cmF0aW9uIGZyb20gdGhlIG1hbmlmZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7TXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb259IFRoZSB2aWV3cyB0aGF0IHJlcHJlc2VudCB0aGUgbWFuaWZlc3Qgb2JqZWN0XG5cdCAqL1xuXHRnZXRWaWV3Q29uZmlndXJhdGlvbigpOiBNdWx0aXBsZVZpZXdzQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuICh0aGlzLm9NYW5pZmVzdFNldHRpbmdzIGFzIExpc3RSZXBvcnRNYW5pZmVzdFNldHRpbmdzKS52aWV3cztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIEtQSSBjb25maWd1cmF0aW9uIGZyb20gdGhlIG1hbmlmZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBSZXR1cm5zIGEgbWFwIGJldHdlZW4gS1BJIG5hbWVzIGFuZCB0aGVpciByZXNwZWN0aXZlIGNvbmZpZ3VyYXRpb25cblx0ICovXG5cdGdldEtQSUNvbmZpZ3VyYXRpb24oKTogeyBba3BpTmFtZTogc3RyaW5nXTogS1BJQ29uZmlndXJhdGlvbiB9IHtcblx0XHRyZXR1cm4gKHRoaXMub01hbmlmZXN0U2V0dGluZ3MgYXMgTGlzdFJlcG9ydE1hbmlmZXN0U2V0dGluZ3MpLmtleVBlcmZvcm1hbmNlSW5kaWNhdG9ycyB8fCB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGZpbHRlciBjb25maWd1cmF0aW9uIGZyb20gdGhlIG1hbmlmZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7RmlsdGVyTWFuaWZlc3RDb25maWd1cmF0aW9ufSBUaGUgZmlsdGVyIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgbWFuaWZlc3Rcblx0ICovXG5cdGdldEZpbHRlckNvbmZpZ3VyYXRpb24oKTogRmlsdGVyTWFuaWZlc3RDb25maWd1cmF0aW9uIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRDb250cm9sQ29uZmlndXJhdGlvbihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIik7XG5cdH1cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZW50aXR5IHNldHMgdG8gYmUgZGlzcGxheWVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBlbnRpdHkgc2V0c1xuXHQgKi9cblx0aGFzTXVsdGlwbGVFbnRpdHlTZXRzKCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IHZpZXdDb25maWcgPSB0aGlzLmdldFZpZXdDb25maWd1cmF0aW9uKCkgfHwgeyBwYXRoczogW10gfTtcblx0XHRjb25zdCBtYW5pZmVzdEVudGl0eVNldCA9IHRoaXMub01hbmlmZXN0U2V0dGluZ3MuZW50aXR5U2V0O1xuXHRcdHJldHVybiAoXG5cdFx0XHR2aWV3Q29uZmlnLnBhdGhzLmZpbmQoKHBhdGg6IFZpZXdDb25maWd1cmF0aW9uKSA9PiB7XG5cdFx0XHRcdGlmICgocGF0aCBhcyBDdXN0b21WaWV3VGVtcGxhdGVDb25maWd1cmF0aW9uKT8udGVtcGxhdGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyhwYXRoIGFzIENvbWJpbmVkVmlld1BhdGhDb25maWd1cmF0aW9uKSkge1xuXHRcdFx0XHRcdGNvbnN0IHsgcHJpbWFyeSwgc2Vjb25kYXJ5IH0gPSBwYXRoIGFzIENvbWJpbmVkVmlld1BhdGhDb25maWd1cmF0aW9uO1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRwcmltYXJ5LnNvbWUocGF0aCA9PiBwYXRoLmVudGl0eVNldCAmJiBwYXRoLmVudGl0eVNldCAhPT0gbWFuaWZlc3RFbnRpdHlTZXQpIHx8XG5cdFx0XHRcdFx0XHRzZWNvbmRhcnkuc29tZShwYXRoID0+IHBhdGguZW50aXR5U2V0ICYmIHBhdGguZW50aXR5U2V0ICE9PSBtYW5pZmVzdEVudGl0eVNldClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhdGggPSBwYXRoIGFzIFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbjtcblx0XHRcdFx0XHRyZXR1cm4gcGF0aC5lbnRpdHlTZXQgJiYgcGF0aC5lbnRpdHlTZXQgIT09IG1hbmlmZXN0RW50aXR5U2V0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KSAhPT0gdW5kZWZpbmVkXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjb250ZXh0IHBhdGggZm9yIHRoZSB0ZW1wbGF0ZSBpZiBpdCBpcyBzcGVjaWZpZWQgaW4gdGhlIG1hbmlmZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29udGV4dCBwYXRoIGZvciB0aGUgdGVtcGxhdGVcblx0ICovXG5cdGdldENvbnRleHRQYXRoKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMub01hbmlmZXN0U2V0dGluZ3M/LmNvbnRleHRQYXRoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmlzdWFsaXphdGlvbnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Vmlld1BhdGhDb25maWd1cmF0aW9ufSBwYXRoIFRoZSBwYXRoIGZyb20gdGhlIHZpZXdcblx0ICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmlzdWFsaXphdGlvbnNcblx0ICovXG5cdGhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMocGF0aD86IFZpZXdQYXRoQ29uZmlndXJhdGlvbik6IGJvb2xlYW4ge1xuXHRcdGlmICghcGF0aCkge1xuXHRcdFx0Y29uc3Qgdmlld0NvbmZpZyA9IHRoaXMuZ2V0Vmlld0NvbmZpZ3VyYXRpb24oKSB8fCB7IHBhdGhzOiBbXSB9O1xuXHRcdFx0cmV0dXJuIHZpZXdDb25maWcucGF0aHMuc29tZShwYXRoID0+IHtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQocGF0aCBhcyBDb21iaW5lZFZpZXdQYXRoQ29uZmlndXJhdGlvbikucHJpbWFyeT8ubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdChwYXRoIGFzIENvbWJpbmVkVmlld1BhdGhDb25maWd1cmF0aW9uKS5zZWNvbmRhcnk/Lmxlbmd0aCA+IDBcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gKHBhdGggYXMgQ29tYmluZWRWaWV3UGF0aENvbmZpZ3VyYXRpb24pLnByaW1hcnk/Lmxlbmd0aCA+IDAgJiYgKHBhdGggYXMgQ29tYmluZWRWaWV3UGF0aENvbmZpZ3VyYXRpb24pLnNlY29uZGFyeT8ubGVuZ3RoID4gMDtcblx0fVxuXG5cdC8vZW5kIHJlZ2lvbiBMUiBTcGVjaWZpY1xufVxuXG5leHBvcnQgZGVmYXVsdCBNYW5pZmVzdFdyYXBwZXI7XG4iXX0=