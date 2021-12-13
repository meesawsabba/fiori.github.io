/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/MacroMetadata", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/formatters/KPIFormatter"], function (MacroMetadata, BindingExpression, kpiFormatters) {
  "use strict";

  var formatResult = BindingExpression.formatResult;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;

  /**
   * @classdesc A building block used to display a KPI in the Analytical List Page
   *
   * @hideconstructor
   * @class sap.fe.macros.KPITag
   * @private
   * @experimental
   */
  var KPITag = MacroMetadata.extend("sap.fe.macros.KPITag", {
    /**
     * Name
     */
    name: "KPITag",

    /**
     * Namespace
     */
    namespace: "sap.fe.macros",

    /**
     * Fragment source
     */
    fragment: "sap.fe.macros.KPITag",

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
         * The ID of the KPI
         */
        id: {
          type: "string",
          required: true
        },

        /**
         * Shall be true if the KPI value has an associated currency or unit of measure
         */
        hasUnit: {
          type: "boolean",
          required: false
        },

        /**
         * Path to the DataPoint annotation of the KPI
         */
        metaPath: {
          type: "sap.ui.model.Context",
          required: true
        }
      },
      aggregations: {}
    },
    create: function (oProps) {
      // KPI tag label and tooltip
      var kpiTitle = oProps.metaPath.getProperty("Title");

      if (kpiTitle) {
        var bindingParts = kpiTitle.match(/{(.*)>(.*)}/); // Check if the title is a binding expr '{model>prop}'

        var titleExpression;

        if (bindingParts) {
          // KPI title is a binding expression (localized)
          titleExpression = bindingExpression(bindingParts[2], bindingParts[1]);
        } else {
          // KPI Title is a constant
          titleExpression = kpiTitle;
        }

        var labelExpression = formatResult([titleExpression], kpiFormatters.labelFormat);
        oProps.label = compileBinding(labelExpression);
        var tooltipExpression = formatResult([titleExpression, bindingExpression("/" + oProps.id + "/manifest/sap.card/data/json/mainValueUnscaled", "kpiModel"), bindingExpression("/" + oProps.id + "/manifest/sap.card/data/json/mainUnit", "kpiModel"), bindingExpression("/" + oProps.id + "/manifest/sap.card/data/json/mainCriticality", "kpiModel"), oProps.hasUnit], kpiFormatters.tooltipFormat);
        oProps.tooltip = compileBinding(tooltipExpression);
      }

      return oProps;
    }
  });
  return KPITag;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktQSVRhZy5tZXRhZGF0YS50cyJdLCJuYW1lcyI6WyJLUElUYWciLCJNYWNyb01ldGFkYXRhIiwiZXh0ZW5kIiwibmFtZSIsIm5hbWVzcGFjZSIsImZyYWdtZW50IiwibWV0YWRhdGEiLCJzdGVyZW90eXBlIiwicHJvcGVydGllcyIsImlkIiwidHlwZSIsInJlcXVpcmVkIiwiaGFzVW5pdCIsIm1ldGFQYXRoIiwiYWdncmVnYXRpb25zIiwiY3JlYXRlIiwib1Byb3BzIiwia3BpVGl0bGUiLCJnZXRQcm9wZXJ0eSIsImJpbmRpbmdQYXJ0cyIsIm1hdGNoIiwidGl0bGVFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb24iLCJsYWJlbEV4cHJlc3Npb24iLCJmb3JtYXRSZXN1bHQiLCJrcGlGb3JtYXR0ZXJzIiwibGFiZWxGb3JtYXQiLCJsYWJlbCIsImNvbXBpbGVCaW5kaW5nIiwidG9vbHRpcEV4cHJlc3Npb24iLCJ0b29sdGlwRm9ybWF0IiwidG9vbHRpcCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTUEsTUFBTSxHQUFHQyxhQUFhLENBQUNDLE1BQWQsQ0FBcUIsc0JBQXJCLEVBQTZDO0FBQzNEO0FBQ0Q7QUFDQTtBQUNDQyxJQUFBQSxJQUFJLEVBQUUsUUFKcUQ7O0FBSzNEO0FBQ0Q7QUFDQTtBQUNDQyxJQUFBQSxTQUFTLEVBQUUsZUFSZ0Q7O0FBUzNEO0FBQ0Q7QUFDQTtBQUNDQyxJQUFBQSxRQUFRLEVBQUUsc0JBWmlEOztBQWEzRDtBQUNEO0FBQ0E7QUFDQ0MsSUFBQUEsUUFBUSxFQUFFO0FBQ1Q7QUFDRjtBQUNBO0FBQ0VDLE1BQUFBLFVBQVUsRUFBRSxVQUpIOztBQUtUO0FBQ0Y7QUFDQTtBQUNFQyxNQUFBQSxVQUFVLEVBQUU7QUFDWDtBQUNIO0FBQ0E7QUFDR0MsUUFBQUEsRUFBRSxFQUFFO0FBQ0hDLFVBQUFBLElBQUksRUFBRSxRQURIO0FBRUhDLFVBQUFBLFFBQVEsRUFBRTtBQUZQLFNBSk87O0FBUVg7QUFDSDtBQUNBO0FBQ0dDLFFBQUFBLE9BQU8sRUFBRTtBQUNSRixVQUFBQSxJQUFJLEVBQUUsU0FERTtBQUVSQyxVQUFBQSxRQUFRLEVBQUU7QUFGRixTQVhFOztBQWVYO0FBQ0g7QUFDQTtBQUNHRSxRQUFBQSxRQUFRLEVBQUU7QUFDVEgsVUFBQUEsSUFBSSxFQUFFLHNCQURHO0FBRVRDLFVBQUFBLFFBQVEsRUFBRTtBQUZEO0FBbEJDLE9BUkg7QUErQlRHLE1BQUFBLFlBQVksRUFBRTtBQS9CTCxLQWhCaUQ7QUFpRDNEQyxJQUFBQSxNQUFNLEVBQUUsVUFBU0MsTUFBVCxFQUFzQjtBQUM3QjtBQUNBLFVBQU1DLFFBQVEsR0FBR0QsTUFBTSxDQUFDSCxRQUFQLENBQWdCSyxXQUFoQixDQUE0QixPQUE1QixDQUFqQjs7QUFDQSxVQUFJRCxRQUFKLEVBQWM7QUFDYixZQUFNRSxZQUFZLEdBQUdGLFFBQVEsQ0FBQ0csS0FBVCxDQUFlLGFBQWYsQ0FBckIsQ0FEYSxDQUN1Qzs7QUFDcEQsWUFBSUMsZUFBSjs7QUFDQSxZQUFJRixZQUFKLEVBQWtCO0FBQ2pCO0FBQ0FFLFVBQUFBLGVBQWUsR0FBR0MsaUJBQWlCLENBQUNILFlBQVksQ0FBQyxDQUFELENBQWIsRUFBa0JBLFlBQVksQ0FBQyxDQUFELENBQTlCLENBQW5DO0FBQ0EsU0FIRCxNQUdPO0FBQ047QUFDQUUsVUFBQUEsZUFBZSxHQUFHSixRQUFsQjtBQUNBOztBQUVELFlBQU1NLGVBQWUsR0FBR0MsWUFBWSxDQUFDLENBQUNILGVBQUQsQ0FBRCxFQUFvQkksYUFBYSxDQUFDQyxXQUFsQyxDQUFwQztBQUNBVixRQUFBQSxNQUFNLENBQUNXLEtBQVAsR0FBZUMsY0FBYyxDQUFDTCxlQUFELENBQTdCO0FBRUEsWUFBTU0saUJBQWlCLEdBQUdMLFlBQVksQ0FDckMsQ0FDQ0gsZUFERCxFQUVDQyxpQkFBaUIsQ0FBQyxNQUFNTixNQUFNLENBQUNQLEVBQWIsR0FBa0IsZ0RBQW5CLEVBQXFFLFVBQXJFLENBRmxCLEVBR0NhLGlCQUFpQixDQUFDLE1BQU1OLE1BQU0sQ0FBQ1AsRUFBYixHQUFrQix1Q0FBbkIsRUFBNEQsVUFBNUQsQ0FIbEIsRUFJQ2EsaUJBQWlCLENBQUMsTUFBTU4sTUFBTSxDQUFDUCxFQUFiLEdBQWtCLDhDQUFuQixFQUFtRSxVQUFuRSxDQUpsQixFQUtDTyxNQUFNLENBQUNKLE9BTFIsQ0FEcUMsRUFRckNhLGFBQWEsQ0FBQ0ssYUFSdUIsQ0FBdEM7QUFVQWQsUUFBQUEsTUFBTSxDQUFDZSxPQUFQLEdBQWlCSCxjQUFjLENBQUNDLGlCQUFELENBQS9CO0FBQ0E7O0FBRUQsYUFBT2IsTUFBUDtBQUNBO0FBaEYwRCxHQUE3QyxDQUFmO1NBa0ZlaEIsTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiAke2NvcHlyaWdodH1cbiAqL1xuaW1wb3J0IHsgTWFjcm9NZXRhZGF0YSB9IGZyb20gXCJzYXAvZmUvbWFjcm9zXCI7XG5pbXBvcnQge1xuXHRiaW5kaW5nRXhwcmVzc2lvbixcblx0QmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uLFxuXHRjb21waWxlQmluZGluZyxcblx0Zm9ybWF0UmVzdWx0LFxuXHRVbnJlc29sdmVhYmxlQmluZGluZ0V4cHJlc3Npb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCBrcGlGb3JtYXR0ZXJzIGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL0tQSUZvcm1hdHRlclwiO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2MgQSBidWlsZGluZyBibG9jayB1c2VkIHRvIGRpc3BsYXkgYSBLUEkgaW4gdGhlIEFuYWx5dGljYWwgTGlzdCBQYWdlXG4gKlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQGNsYXNzIHNhcC5mZS5tYWNyb3MuS1BJVGFnXG4gKiBAcHJpdmF0ZVxuICogQGV4cGVyaW1lbnRhbFxuICovXG5jb25zdCBLUElUYWcgPSBNYWNyb01ldGFkYXRhLmV4dGVuZChcInNhcC5mZS5tYWNyb3MuS1BJVGFnXCIsIHtcblx0LyoqXG5cdCAqIE5hbWVcblx0ICovXG5cdG5hbWU6IFwiS1BJVGFnXCIsXG5cdC8qKlxuXHQgKiBOYW1lc3BhY2Vcblx0ICovXG5cdG5hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zXCIsXG5cdC8qKlxuXHQgKiBGcmFnbWVudCBzb3VyY2Vcblx0ICovXG5cdGZyYWdtZW50OiBcInNhcC5mZS5tYWNyb3MuS1BJVGFnXCIsXG5cdC8qKlxuXHQgKiBNZXRhZGF0YVxuXHQgKi9cblx0bWV0YWRhdGE6IHtcblx0XHQvKipcblx0XHQgKiBEZWZpbmUgbWFjcm8gc3RlcmVvdHlwZSBmb3IgZG9jdW1lbnRhdGlvblxuXHRcdCAqL1xuXHRcdHN0ZXJlb3R5cGU6IFwieG1sbWFjcm9cIixcblx0XHQvKipcblx0XHQgKiBQcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIElEIG9mIHRoZSBLUElcblx0XHRcdCAqL1xuXHRcdFx0aWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFNoYWxsIGJlIHRydWUgaWYgdGhlIEtQSSB2YWx1ZSBoYXMgYW4gYXNzb2NpYXRlZCBjdXJyZW5jeSBvciB1bml0IG9mIG1lYXN1cmVcblx0XHRcdCAqL1xuXHRcdFx0aGFzVW5pdDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQYXRoIHRvIHRoZSBEYXRhUG9pbnQgYW5ub3RhdGlvbiBvZiB0aGUgS1BJXG5cdFx0XHQgKi9cblx0XHRcdG1ldGFQYXRoOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFnZ3JlZ2F0aW9uczoge31cblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbihvUHJvcHM6IGFueSkge1xuXHRcdC8vIEtQSSB0YWcgbGFiZWwgYW5kIHRvb2x0aXBcblx0XHRjb25zdCBrcGlUaXRsZSA9IG9Qcm9wcy5tZXRhUGF0aC5nZXRQcm9wZXJ0eShcIlRpdGxlXCIpO1xuXHRcdGlmIChrcGlUaXRsZSkge1xuXHRcdFx0Y29uc3QgYmluZGluZ1BhcnRzID0ga3BpVGl0bGUubWF0Y2goL3soLiopPiguKil9Lyk7IC8vIENoZWNrIGlmIHRoZSB0aXRsZSBpcyBhIGJpbmRpbmcgZXhwciAne21vZGVsPnByb3B9J1xuXHRcdFx0bGV0IHRpdGxlRXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPGFueT4gfCBVbnJlc29sdmVhYmxlQmluZGluZ0V4cHJlc3Npb247XG5cdFx0XHRpZiAoYmluZGluZ1BhcnRzKSB7XG5cdFx0XHRcdC8vIEtQSSB0aXRsZSBpcyBhIGJpbmRpbmcgZXhwcmVzc2lvbiAobG9jYWxpemVkKVxuXHRcdFx0XHR0aXRsZUV4cHJlc3Npb24gPSBiaW5kaW5nRXhwcmVzc2lvbihiaW5kaW5nUGFydHNbMl0sIGJpbmRpbmdQYXJ0c1sxXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBLUEkgVGl0bGUgaXMgYSBjb25zdGFudFxuXHRcdFx0XHR0aXRsZUV4cHJlc3Npb24gPSBrcGlUaXRsZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbGFiZWxFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFt0aXRsZUV4cHJlc3Npb25dLCBrcGlGb3JtYXR0ZXJzLmxhYmVsRm9ybWF0KTtcblx0XHRcdG9Qcm9wcy5sYWJlbCA9IGNvbXBpbGVCaW5kaW5nKGxhYmVsRXhwcmVzc2lvbik7XG5cblx0XHRcdGNvbnN0IHRvb2x0aXBFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0dGl0bGVFeHByZXNzaW9uLFxuXHRcdFx0XHRcdGJpbmRpbmdFeHByZXNzaW9uKFwiL1wiICsgb1Byb3BzLmlkICsgXCIvbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5WYWx1ZVVuc2NhbGVkXCIsIFwia3BpTW9kZWxcIiksXG5cdFx0XHRcdFx0YmluZGluZ0V4cHJlc3Npb24oXCIvXCIgKyBvUHJvcHMuaWQgKyBcIi9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblVuaXRcIiwgXCJrcGlNb2RlbFwiKSxcblx0XHRcdFx0XHRiaW5kaW5nRXhwcmVzc2lvbihcIi9cIiArIG9Qcm9wcy5pZCArIFwiL21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluQ3JpdGljYWxpdHlcIiwgXCJrcGlNb2RlbFwiKSxcblx0XHRcdFx0XHRvUHJvcHMuaGFzVW5pdFxuXHRcdFx0XHRdLFxuXHRcdFx0XHRrcGlGb3JtYXR0ZXJzLnRvb2x0aXBGb3JtYXRcblx0XHRcdCk7XG5cdFx0XHRvUHJvcHMudG9vbHRpcCA9IGNvbXBpbGVCaW5kaW5nKHRvb2x0aXBFeHByZXNzaW9uKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb1Byb3BzO1xuXHR9XG59KTtcbmV4cG9ydCBkZWZhdWx0IEtQSVRhZztcbiJdfQ==