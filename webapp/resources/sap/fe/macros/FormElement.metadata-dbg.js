/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/MacroMetadata", "sap/fe/core/helpers/BindingExpression"], function (MacroMetadata, BindingExpression) {
  "use strict";

  var compileBinding = BindingExpression.compileBinding;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var equal = BindingExpression.equal;
  var ifElse = BindingExpression.ifElse;

  /**
   * @class Building block used to create a form element containing a label and a field.
   *
   * @hideconstructor
   * @name sap.fe.macros.FormElement
   * @public
   * @since 1.90.0
   */
  var FormElement = MacroMetadata.extend("sap.fe.macros.FormElement", {
    /**
     * Name
     */
    name: "FormElement",

    /**
     * Namespace
     */
    namespace: "sap.fe.macros",

    /**
     * Fragment source
     */
    fragment: "sap.fe.macros.FormElement",

    /**
     * Metadata
     */
    metadata: {
      /**
       * Define macro stereotype for documentation
       */
      stereotype: "xmlmacro",

      /**
       * Properties.
       */
      properties: {
        /**
         * Defines the relative path of the property in the metamodel, based on the current contextPath.
         * @public
         */
        metaPath: {
          type: "sap.ui.model.Context",
          required: true
        },

        /**
         * Defines the path of the context used in the current page or block. This setting is defined by the framework.
         * @public
         */
        contextPath: {
          type: "sap.ui.model.Context",
          required: true
        },

        /**
         * The identifier of the table control.
         * @public
         */
        id: {
          type: "string",
          required: true
        },

        /**
         * Label shown for the field. If not set, the label from the annotations will be shown.
         * @public
         */
        label: {
          type: "string",
          required: false
        },

        /**
         * 	If set to false, the FormElement is not rendered.
         * 	@public
         */
        visible: {
          type: "boolean",
          required: false
        }
      },
      aggregations: {
        /**
         * Optional aggregation of controls that should be displayed inside the FormElement.
         * If not set, a default Field Macro control will be rendered
         * @public
         */
        "fields": {
          type: "sap.ui.core.Control"
        }
      }
    },
    create: function (oProps, oControlConfig, oAppComponent, oAggregations) {
      if (oProps.label === undefined) {
        oProps.label = oProps.metaPath.getModel().getProperty(oProps.metaPath.sPath + "@com.sap.vocabularies.Common.v1.Label");
      }

      if (oProps.editable !== undefined) {
        oProps.editModeExpression = compileBinding(ifElse(equal(resolveBindingString(oProps.editable, "boolean"), true), "Editable", "Display"));
      } else {
        oProps.editModeExpression = undefined;
      }

      oProps.fieldsAvailable = oAggregations.fields !== undefined;
      return oProps;
    }
  });
  return FormElement;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1FbGVtZW50Lm1ldGFkYXRhLnRzIl0sIm5hbWVzIjpbIkZvcm1FbGVtZW50IiwiTWFjcm9NZXRhZGF0YSIsImV4dGVuZCIsIm5hbWUiLCJuYW1lc3BhY2UiLCJmcmFnbWVudCIsIm1ldGFkYXRhIiwic3RlcmVvdHlwZSIsInByb3BlcnRpZXMiLCJtZXRhUGF0aCIsInR5cGUiLCJyZXF1aXJlZCIsImNvbnRleHRQYXRoIiwiaWQiLCJsYWJlbCIsInZpc2libGUiLCJhZ2dyZWdhdGlvbnMiLCJjcmVhdGUiLCJvUHJvcHMiLCJvQ29udHJvbENvbmZpZyIsIm9BcHBDb21wb25lbnQiLCJvQWdncmVnYXRpb25zIiwidW5kZWZpbmVkIiwiZ2V0TW9kZWwiLCJnZXRQcm9wZXJ0eSIsInNQYXRoIiwiZWRpdGFibGUiLCJlZGl0TW9kZUV4cHJlc3Npb24iLCJjb21waWxlQmluZGluZyIsImlmRWxzZSIsImVxdWFsIiwicmVzb2x2ZUJpbmRpbmdTdHJpbmciLCJmaWVsZHNBdmFpbGFibGUiLCJmaWVsZHMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxXQUFXLEdBQUdDLGFBQWEsQ0FBQ0MsTUFBZCxDQUFxQiwyQkFBckIsRUFBa0Q7QUFDckU7QUFDRDtBQUNBO0FBQ0NDLElBQUFBLElBQUksRUFBRSxhQUorRDs7QUFLckU7QUFDRDtBQUNBO0FBQ0NDLElBQUFBLFNBQVMsRUFBRSxlQVIwRDs7QUFTckU7QUFDRDtBQUNBO0FBQ0NDLElBQUFBLFFBQVEsRUFBRSwyQkFaMkQ7O0FBY3JFO0FBQ0Q7QUFDQTtBQUNDQyxJQUFBQSxRQUFRLEVBQUU7QUFDVDtBQUNGO0FBQ0E7QUFDRUMsTUFBQUEsVUFBVSxFQUFFLFVBSkg7O0FBS1Q7QUFDRjtBQUNBO0FBQ0VDLE1BQUFBLFVBQVUsRUFBRTtBQUNYO0FBQ0g7QUFDQTtBQUNBO0FBQ0dDLFFBQUFBLFFBQVEsRUFBRTtBQUNUQyxVQUFBQSxJQUFJLEVBQUUsc0JBREc7QUFFVEMsVUFBQUEsUUFBUSxFQUFFO0FBRkQsU0FMQzs7QUFTWDtBQUNIO0FBQ0E7QUFDQTtBQUNHQyxRQUFBQSxXQUFXLEVBQUU7QUFDWkYsVUFBQUEsSUFBSSxFQUFFLHNCQURNO0FBRVpDLFVBQUFBLFFBQVEsRUFBRTtBQUZFLFNBYkY7O0FBaUJYO0FBQ0g7QUFDQTtBQUNBO0FBQ0dFLFFBQUFBLEVBQUUsRUFBRTtBQUNISCxVQUFBQSxJQUFJLEVBQUUsUUFESDtBQUVIQyxVQUFBQSxRQUFRLEVBQUU7QUFGUCxTQXJCTzs7QUF5Qlg7QUFDSDtBQUNBO0FBQ0E7QUFDR0csUUFBQUEsS0FBSyxFQUFFO0FBQ05KLFVBQUFBLElBQUksRUFBRSxRQURBO0FBRU5DLFVBQUFBLFFBQVEsRUFBRTtBQUZKLFNBN0JJOztBQWlDWDtBQUNIO0FBQ0E7QUFDQTtBQUNHSSxRQUFBQSxPQUFPLEVBQUU7QUFDUkwsVUFBQUEsSUFBSSxFQUFFLFNBREU7QUFFUkMsVUFBQUEsUUFBUSxFQUFFO0FBRkY7QUFyQ0UsT0FSSDtBQWtEVEssTUFBQUEsWUFBWSxFQUFFO0FBQ2I7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNHLGtCQUFVO0FBQ1ROLFVBQUFBLElBQUksRUFBRTtBQURHO0FBTkc7QUFsREwsS0FqQjJEO0FBOEVyRU8sSUFBQUEsTUFBTSxFQUFFLFVBQVNDLE1BQVQsRUFBc0JDLGNBQXRCLEVBQTJDQyxhQUEzQyxFQUErREMsYUFBL0QsRUFBbUY7QUFDMUYsVUFBSUgsTUFBTSxDQUFDSixLQUFQLEtBQWlCUSxTQUFyQixFQUFnQztBQUMvQkosUUFBQUEsTUFBTSxDQUFDSixLQUFQLEdBQWVJLE1BQU0sQ0FBQ1QsUUFBUCxDQUFnQmMsUUFBaEIsR0FBMkJDLFdBQTNCLENBQXVDTixNQUFNLENBQUNULFFBQVAsQ0FBZ0JnQixLQUFoQixHQUF3Qix1Q0FBL0QsQ0FBZjtBQUNBOztBQUNELFVBQUlQLE1BQU0sQ0FBQ1EsUUFBUCxLQUFvQkosU0FBeEIsRUFBbUM7QUFDbENKLFFBQUFBLE1BQU0sQ0FBQ1Msa0JBQVAsR0FBNEJDLGNBQWMsQ0FDekNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDQyxvQkFBb0IsQ0FBQ2IsTUFBTSxDQUFDUSxRQUFSLEVBQWtCLFNBQWxCLENBQXJCLEVBQW1ELElBQW5ELENBQU4sRUFBZ0UsVUFBaEUsRUFBNEUsU0FBNUUsQ0FEbUMsQ0FBMUM7QUFHQSxPQUpELE1BSU87QUFDTlIsUUFBQUEsTUFBTSxDQUFDUyxrQkFBUCxHQUE0QkwsU0FBNUI7QUFDQTs7QUFDREosTUFBQUEsTUFBTSxDQUFDYyxlQUFQLEdBQXlCWCxhQUFhLENBQUNZLE1BQWQsS0FBeUJYLFNBQWxEO0FBRUEsYUFBT0osTUFBUDtBQUNBO0FBNUZvRSxHQUFsRCxDQUFwQjtTQStGZWxCLFciLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogJHtjb3B5cmlnaHR9XG4gKi9cblxuaW1wb3J0IHsgTWFjcm9NZXRhZGF0YSB9IGZyb20gXCJzYXAvZmUvbWFjcm9zXCI7XG5pbXBvcnQgeyBpZkVsc2UsIGVxdWFsLCByZXNvbHZlQmluZGluZ1N0cmluZywgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuXG4vKipcbiAqIEBjbGFzcyBCdWlsZGluZyBibG9jayB1c2VkIHRvIGNyZWF0ZSBhIGZvcm0gZWxlbWVudCBjb250YWluaW5nIGEgbGFiZWwgYW5kIGEgZmllbGQuXG4gKlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQG5hbWUgc2FwLmZlLm1hY3Jvcy5Gb3JtRWxlbWVudFxuICogQHB1YmxpY1xuICogQHNpbmNlIDEuOTAuMFxuICovXG5jb25zdCBGb3JtRWxlbWVudCA9IE1hY3JvTWV0YWRhdGEuZXh0ZW5kKFwic2FwLmZlLm1hY3Jvcy5Gb3JtRWxlbWVudFwiLCB7XG5cdC8qKlxuXHQgKiBOYW1lXG5cdCAqL1xuXHRuYW1lOiBcIkZvcm1FbGVtZW50XCIsXG5cdC8qKlxuXHQgKiBOYW1lc3BhY2Vcblx0ICovXG5cdG5hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zXCIsXG5cdC8qKlxuXHQgKiBGcmFnbWVudCBzb3VyY2Vcblx0ICovXG5cdGZyYWdtZW50OiBcInNhcC5mZS5tYWNyb3MuRm9ybUVsZW1lbnRcIixcblxuXHQvKipcblx0ICogTWV0YWRhdGFcblx0ICovXG5cdG1ldGFkYXRhOiB7XG5cdFx0LyoqXG5cdFx0ICogRGVmaW5lIG1hY3JvIHN0ZXJlb3R5cGUgZm9yIGRvY3VtZW50YXRpb25cblx0XHQgKi9cblx0XHRzdGVyZW90eXBlOiBcInhtbG1hY3JvXCIsXG5cdFx0LyoqXG5cdFx0ICogUHJvcGVydGllcy5cblx0XHQgKi9cblx0XHRwcm9wZXJ0aWVzOiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIERlZmluZXMgdGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIHByb3BlcnR5IGluIHRoZSBtZXRhbW9kZWwsIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbnRleHRQYXRoLlxuXHRcdFx0ICogQHB1YmxpY1xuXHRcdFx0ICovXG5cdFx0XHRtZXRhUGF0aDoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBEZWZpbmVzIHRoZSBwYXRoIG9mIHRoZSBjb250ZXh0IHVzZWQgaW4gdGhlIGN1cnJlbnQgcGFnZSBvciBibG9jay4gVGhpcyBzZXR0aW5nIGlzIGRlZmluZWQgYnkgdGhlIGZyYW1ld29yay5cblx0XHRcdCAqIEBwdWJsaWNcblx0XHRcdCAqL1xuXHRcdFx0Y29udGV4dFBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIGlkZW50aWZpZXIgb2YgdGhlIHRhYmxlIGNvbnRyb2wuXG5cdFx0XHQgKiBAcHVibGljXG5cdFx0XHQgKi9cblx0XHRcdGlkOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBMYWJlbCBzaG93biBmb3IgdGhlIGZpZWxkLiBJZiBub3Qgc2V0LCB0aGUgbGFiZWwgZnJvbSB0aGUgYW5ub3RhdGlvbnMgd2lsbCBiZSBzaG93bi5cblx0XHRcdCAqIEBwdWJsaWNcblx0XHRcdCAqL1xuXHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBcdElmIHNldCB0byBmYWxzZSwgdGhlIEZvcm1FbGVtZW50IGlzIG5vdCByZW5kZXJlZC5cblx0XHRcdCAqIFx0QHB1YmxpY1xuXHRcdFx0ICovXG5cdFx0XHR2aXNpYmxlOiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFnZ3JlZ2F0aW9uczoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBPcHRpb25hbCBhZ2dyZWdhdGlvbiBvZiBjb250cm9scyB0aGF0IHNob3VsZCBiZSBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBGb3JtRWxlbWVudC5cblx0XHRcdCAqIElmIG5vdCBzZXQsIGEgZGVmYXVsdCBGaWVsZCBNYWNybyBjb250cm9sIHdpbGwgYmUgcmVuZGVyZWRcblx0XHRcdCAqIEBwdWJsaWNcblx0XHRcdCAqL1xuXHRcdFx0XCJmaWVsZHNcIjoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5jb3JlLkNvbnRyb2xcIlxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbihvUHJvcHM6IGFueSwgb0NvbnRyb2xDb25maWc6IGFueSwgb0FwcENvbXBvbmVudDogYW55LCBvQWdncmVnYXRpb25zOiBhbnkpIHtcblx0XHRpZiAob1Byb3BzLmxhYmVsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdG9Qcm9wcy5sYWJlbCA9IG9Qcm9wcy5tZXRhUGF0aC5nZXRNb2RlbCgpLmdldFByb3BlcnR5KG9Qcm9wcy5tZXRhUGF0aC5zUGF0aCArIFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5MYWJlbFwiKTtcblx0XHR9XG5cdFx0aWYgKG9Qcm9wcy5lZGl0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdGlmRWxzZShlcXVhbChyZXNvbHZlQmluZGluZ1N0cmluZyhvUHJvcHMuZWRpdGFibGUsIFwiYm9vbGVhblwiKSwgdHJ1ZSksIFwiRWRpdGFibGVcIiwgXCJEaXNwbGF5XCIpXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRvUHJvcHMuZmllbGRzQXZhaWxhYmxlID0gb0FnZ3JlZ2F0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZDtcblxuXHRcdHJldHVybiBvUHJvcHM7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBGb3JtRWxlbWVudDtcbiJdfQ==