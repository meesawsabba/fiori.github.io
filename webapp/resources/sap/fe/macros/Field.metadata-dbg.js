/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/MacroMetadata", "sap/base/Log", "sap/fe/core/helpers/BindingExpression"], function (MacroMetadata, Log, BindingExpression) {
  "use strict";

  var compileBinding = BindingExpression.compileBinding;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var equal = BindingExpression.equal;
  var ifElse = BindingExpression.ifElse;

  /**
   * @classdesc
   * Content of a field
   *
   * @class sap.fe.macros.Field
   * @hideconstructor
   * @private
   * @ui5-restricted
   * @experimental
   */
  var Field = MacroMetadata.extend("sap.fe.macros.Field", {
    /**
     * Name
     */
    name: "Field",

    /**
     * Namespace
     */
    namespace: "sap.fe.macros",

    /**
     * Fragment source
     */
    fragment: "sap.fe.macros.Field",

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
         * Meta Path to the field
         * Could be either an absolute path or relative to the context path
         */
        metaPath: {
          type: "sap.ui.model.Context",
          required: true
        },

        /**
         * Context path of the field
         */
        contextPath: {
          type: "sap.ui.model.Context",
          required: true
        },

        /**
         * Field ID
         */
        id: {
          type: "string",
          required: true
        },

        /**
         * Edit Mode
         */
        editable: {
          type: "boolean",
          deprecated: true,
          required: false
        },

        /**
         * Read Only
         */
        readOnly: {
          type: "boolean",
          required: false
        },

        /**
         * Option to add semantic objects to a field
         */
        semanticObject: {
          type: "string",
          required: false
        },
        formatOptions: {
          type: "object",
          properties: {
            displayMode: {
              type: "string",
              allowedValues: ["Value", "Description", "ValueDescription", "DescriptionValue"]
            },
            measureDisplayMode: {
              type: "string",
              allowedValues: ["Hidden", "ReadOnly"]
            }
          }
        }
      },
      events: {
        /**
         * Event handler for change event TODO: we need to wrap this, just PoC version
         */
        change: {
          type: "function"
        }
      }
    },
    create: function (oProps) {
      if (oProps.editable !== undefined) {
        // Deprecated message
        Log.error("`editable` property has been deprecated in favor of `readOnly`");
        oProps.editModeExpression = compileBinding(ifElse(equal(resolveBindingString(oProps.editable, "boolean"), true), "Editable", "Display"));
      } else {
        oProps.editModeExpression = undefined;
      }

      if (oProps.readOnly !== undefined) {
        oProps.editModeExpression = compileBinding(ifElse(equal(resolveBindingString(oProps.readOnly, "boolean"), true), "Display", "Editable"));
      } else {
        oProps.editModeExpression = undefined;
      }

      return oProps;
    }
  });
  return Field;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkLm1ldGFkYXRhLnRzIl0sIm5hbWVzIjpbIkZpZWxkIiwiTWFjcm9NZXRhZGF0YSIsImV4dGVuZCIsIm5hbWUiLCJuYW1lc3BhY2UiLCJmcmFnbWVudCIsIm1ldGFkYXRhIiwic3RlcmVvdHlwZSIsInByb3BlcnRpZXMiLCJtZXRhUGF0aCIsInR5cGUiLCJyZXF1aXJlZCIsImNvbnRleHRQYXRoIiwiaWQiLCJlZGl0YWJsZSIsImRlcHJlY2F0ZWQiLCJyZWFkT25seSIsInNlbWFudGljT2JqZWN0IiwiZm9ybWF0T3B0aW9ucyIsImRpc3BsYXlNb2RlIiwiYWxsb3dlZFZhbHVlcyIsIm1lYXN1cmVEaXNwbGF5TW9kZSIsImV2ZW50cyIsImNoYW5nZSIsImNyZWF0ZSIsIm9Qcm9wcyIsInVuZGVmaW5lZCIsIkxvZyIsImVycm9yIiwiZWRpdE1vZGVFeHByZXNzaW9uIiwiY29tcGlsZUJpbmRpbmciLCJpZkVsc2UiLCJlcXVhbCIsInJlc29sdmVCaW5kaW5nU3RyaW5nIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1BLEtBQUssR0FBR0MsYUFBYSxDQUFDQyxNQUFkLENBQXFCLHFCQUFyQixFQUE0QztBQUN6RDtBQUNEO0FBQ0E7QUFDQ0MsSUFBQUEsSUFBSSxFQUFFLE9BSm1EOztBQUt6RDtBQUNEO0FBQ0E7QUFDQ0MsSUFBQUEsU0FBUyxFQUFFLGVBUjhDOztBQVN6RDtBQUNEO0FBQ0E7QUFDQ0MsSUFBQUEsUUFBUSxFQUFFLHFCQVorQzs7QUFjekQ7QUFDRDtBQUNBO0FBQ0NDLElBQUFBLFFBQVEsRUFBRTtBQUNUO0FBQ0Y7QUFDQTtBQUNFQyxNQUFBQSxVQUFVLEVBQUUsVUFKSDs7QUFLVDtBQUNGO0FBQ0E7QUFDRUMsTUFBQUEsVUFBVSxFQUFFO0FBQ1g7QUFDSDtBQUNBO0FBQ0E7QUFDR0MsUUFBQUEsUUFBUSxFQUFFO0FBQ1RDLFVBQUFBLElBQUksRUFBRSxzQkFERztBQUVUQyxVQUFBQSxRQUFRLEVBQUU7QUFGRCxTQUxDOztBQVNYO0FBQ0g7QUFDQTtBQUNHQyxRQUFBQSxXQUFXLEVBQUU7QUFDWkYsVUFBQUEsSUFBSSxFQUFFLHNCQURNO0FBRVpDLFVBQUFBLFFBQVEsRUFBRTtBQUZFLFNBWkY7O0FBZ0JYO0FBQ0g7QUFDQTtBQUNHRSxRQUFBQSxFQUFFLEVBQUU7QUFDSEgsVUFBQUEsSUFBSSxFQUFFLFFBREg7QUFFSEMsVUFBQUEsUUFBUSxFQUFFO0FBRlAsU0FuQk87O0FBdUJYO0FBQ0g7QUFDQTtBQUNHRyxRQUFBQSxRQUFRLEVBQUU7QUFDVEosVUFBQUEsSUFBSSxFQUFFLFNBREc7QUFFVEssVUFBQUEsVUFBVSxFQUFFLElBRkg7QUFHVEosVUFBQUEsUUFBUSxFQUFFO0FBSEQsU0ExQkM7O0FBK0JYO0FBQ0g7QUFDQTtBQUNHSyxRQUFBQSxRQUFRLEVBQUU7QUFDVE4sVUFBQUEsSUFBSSxFQUFFLFNBREc7QUFFVEMsVUFBQUEsUUFBUSxFQUFFO0FBRkQsU0FsQ0M7O0FBc0NYO0FBQ0g7QUFDQTtBQUNHTSxRQUFBQSxjQUFjLEVBQUU7QUFDZlAsVUFBQUEsSUFBSSxFQUFFLFFBRFM7QUFFZkMsVUFBQUEsUUFBUSxFQUFFO0FBRkssU0F6Q0w7QUE2Q1hPLFFBQUFBLGFBQWEsRUFBRTtBQUNkUixVQUFBQSxJQUFJLEVBQUUsUUFEUTtBQUVkRixVQUFBQSxVQUFVLEVBQUU7QUFDWFcsWUFBQUEsV0FBVyxFQUFFO0FBQ1pULGNBQUFBLElBQUksRUFBRSxRQURNO0FBRVpVLGNBQUFBLGFBQWEsRUFBRSxDQUFDLE9BQUQsRUFBVSxhQUFWLEVBQXlCLGtCQUF6QixFQUE2QyxrQkFBN0M7QUFGSCxhQURGO0FBS1hDLFlBQUFBLGtCQUFrQixFQUFFO0FBQ25CWCxjQUFBQSxJQUFJLEVBQUUsUUFEYTtBQUVuQlUsY0FBQUEsYUFBYSxFQUFFLENBQUMsUUFBRCxFQUFXLFVBQVg7QUFGSTtBQUxUO0FBRkU7QUE3Q0osT0FSSDtBQW1FVEUsTUFBQUEsTUFBTSxFQUFFO0FBQ1A7QUFDSDtBQUNBO0FBQ0dDLFFBQUFBLE1BQU0sRUFBRTtBQUNQYixVQUFBQSxJQUFJLEVBQUU7QUFEQztBQUpEO0FBbkVDLEtBakIrQztBQTZGekRjLElBQUFBLE1BQU0sRUFBRSxVQUFTQyxNQUFULEVBQXNCO0FBQzdCLFVBQUlBLE1BQU0sQ0FBQ1gsUUFBUCxLQUFvQlksU0FBeEIsRUFBbUM7QUFDbEM7QUFDQUMsUUFBQUEsR0FBRyxDQUFDQyxLQUFKLENBQVUsZ0VBQVY7QUFDQUgsUUFBQUEsTUFBTSxDQUFDSSxrQkFBUCxHQUE0QkMsY0FBYyxDQUN6Q0MsTUFBTSxDQUFDQyxLQUFLLENBQUNDLG9CQUFvQixDQUFDUixNQUFNLENBQUNYLFFBQVIsRUFBa0IsU0FBbEIsQ0FBckIsRUFBbUQsSUFBbkQsQ0FBTixFQUFnRSxVQUFoRSxFQUE0RSxTQUE1RSxDQURtQyxDQUExQztBQUdBLE9BTkQsTUFNTztBQUNOVyxRQUFBQSxNQUFNLENBQUNJLGtCQUFQLEdBQTRCSCxTQUE1QjtBQUNBOztBQUNELFVBQUlELE1BQU0sQ0FBQ1QsUUFBUCxLQUFvQlUsU0FBeEIsRUFBbUM7QUFDbENELFFBQUFBLE1BQU0sQ0FBQ0ksa0JBQVAsR0FBNEJDLGNBQWMsQ0FDekNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDQyxvQkFBb0IsQ0FBQ1IsTUFBTSxDQUFDVCxRQUFSLEVBQWtCLFNBQWxCLENBQXJCLEVBQW1ELElBQW5ELENBQU4sRUFBZ0UsU0FBaEUsRUFBMkUsVUFBM0UsQ0FEbUMsQ0FBMUM7QUFHQSxPQUpELE1BSU87QUFDTlMsUUFBQUEsTUFBTSxDQUFDSSxrQkFBUCxHQUE0QkgsU0FBNUI7QUFDQTs7QUFFRCxhQUFPRCxNQUFQO0FBQ0E7QUFoSHdELEdBQTVDLENBQWQ7U0FtSGV6QixLIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqICR7Y29weXJpZ2h0fVxuICovXG5cbmltcG9ydCB7IE1hY3JvTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL21hY3Jvc1wiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeyBpZkVsc2UsIGVxdWFsLCByZXNvbHZlQmluZGluZ1N0cmluZywgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2NcbiAqIENvbnRlbnQgb2YgYSBmaWVsZFxuICpcbiAqIEBjbGFzcyBzYXAuZmUubWFjcm9zLkZpZWxkXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmNvbnN0IEZpZWxkID0gTWFjcm9NZXRhZGF0YS5leHRlbmQoXCJzYXAuZmUubWFjcm9zLkZpZWxkXCIsIHtcblx0LyoqXG5cdCAqIE5hbWVcblx0ICovXG5cdG5hbWU6IFwiRmllbGRcIixcblx0LyoqXG5cdCAqIE5hbWVzcGFjZVxuXHQgKi9cblx0bmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3NcIixcblx0LyoqXG5cdCAqIEZyYWdtZW50IHNvdXJjZVxuXHQgKi9cblx0ZnJhZ21lbnQ6IFwic2FwLmZlLm1hY3Jvcy5GaWVsZFwiLFxuXG5cdC8qKlxuXHQgKiBNZXRhZGF0YVxuXHQgKi9cblx0bWV0YWRhdGE6IHtcblx0XHQvKipcblx0XHQgKiBEZWZpbmUgbWFjcm8gc3RlcmVvdHlwZSBmb3IgZG9jdW1lbnRhdGlvblxuXHRcdCAqL1xuXHRcdHN0ZXJlb3R5cGU6IFwieG1sbWFjcm9cIixcblx0XHQvKipcblx0XHQgKiBQcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogTWV0YSBQYXRoIHRvIHRoZSBmaWVsZFxuXHRcdFx0ICogQ291bGQgYmUgZWl0aGVyIGFuIGFic29sdXRlIHBhdGggb3IgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHQgcGF0aFxuXHRcdFx0ICovXG5cdFx0XHRtZXRhUGF0aDoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDb250ZXh0IHBhdGggb2YgdGhlIGZpZWxkXG5cdFx0XHQgKi9cblx0XHRcdGNvbnRleHRQYXRoOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEZpZWxkIElEXG5cdFx0XHQgKi9cblx0XHRcdGlkOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBFZGl0IE1vZGVcblx0XHRcdCAqL1xuXHRcdFx0ZWRpdGFibGU6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdGRlcHJlY2F0ZWQ6IHRydWUsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogUmVhZCBPbmx5XG5cdFx0XHQgKi9cblx0XHRcdHJlYWRPbmx5OiB7XG5cdFx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIE9wdGlvbiB0byBhZGQgc2VtYW50aWMgb2JqZWN0cyB0byBhIGZpZWxkXG5cdFx0XHQgKi9cblx0XHRcdHNlbWFudGljT2JqZWN0OiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0dHlwZTogXCJvYmplY3RcIixcblx0XHRcdFx0cHJvcGVydGllczoge1xuXHRcdFx0XHRcdGRpc3BsYXlNb2RlOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0XHRcdFx0YWxsb3dlZFZhbHVlczogW1wiVmFsdWVcIiwgXCJEZXNjcmlwdGlvblwiLCBcIlZhbHVlRGVzY3JpcHRpb25cIiwgXCJEZXNjcmlwdGlvblZhbHVlXCJdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtZWFzdXJlRGlzcGxheU1vZGU6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbXCJIaWRkZW5cIiwgXCJSZWFkT25seVwiXVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIEV2ZW50IGhhbmRsZXIgZm9yIGNoYW5nZSBldmVudCBUT0RPOiB3ZSBuZWVkIHRvIHdyYXAgdGhpcywganVzdCBQb0MgdmVyc2lvblxuXHRcdFx0ICovXG5cdFx0XHRjaGFuZ2U6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uKG9Qcm9wczogYW55KSB7XG5cdFx0aWYgKG9Qcm9wcy5lZGl0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBEZXByZWNhdGVkIG1lc3NhZ2Vcblx0XHRcdExvZy5lcnJvcihcImBlZGl0YWJsZWAgcHJvcGVydHkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBgcmVhZE9ubHlgXCIpO1xuXHRcdFx0b1Byb3BzLmVkaXRNb2RlRXhwcmVzc2lvbiA9IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRpZkVsc2UoZXF1YWwocmVzb2x2ZUJpbmRpbmdTdHJpbmcob1Byb3BzLmVkaXRhYmxlLCBcImJvb2xlYW5cIiksIHRydWUpLCBcIkVkaXRhYmxlXCIsIFwiRGlzcGxheVwiKVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b1Byb3BzLmVkaXRNb2RlRXhwcmVzc2lvbiA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKG9Qcm9wcy5yZWFkT25seSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdGlmRWxzZShlcXVhbChyZXNvbHZlQmluZGluZ1N0cmluZyhvUHJvcHMucmVhZE9ubHksIFwiYm9vbGVhblwiKSwgdHJ1ZSksIFwiRGlzcGxheVwiLCBcIkVkaXRhYmxlXCIpXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBvUHJvcHM7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBGaWVsZDtcbiJdfQ==