/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/PasteHelper", "sap/m/MessageBox", "sap/ui/Device", "sap/base/Log", "./MacroAPI", "sap/fe/macros/massedit/MassEditHandler", "sap/fe/macros/DelegateUtil"], function (ClassSupport, PasteHelper, MessageBox, Device, Log, MacroAPI, MassEditHandler, DelegateUtil) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16;

  var Event = ClassSupport.Event;
  var Property = ClassSupport.Property;
  var MacroContext = ClassSupport.MacroContext;
  var EventHandler = ClassSupport.EventHandler;
  var APIClass = ClassSupport.APIClass;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Building block used to create a table based on the metadata provided by OData V4.
   * <br>
   * Usually, a LineItem or PresentationVariant annotation is expected, but the Table building block can also be used to display an EntitySet.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Table id="MyTable" metaPath="@com.sap.vocabularies.UI.v1.LineItem" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.Table
   * @public
   */
  var TableAPI = (_dec = APIClass("sap.fe.macros.TableAPI"), _dec2 = MacroContext(), _dec3 = Property({
    type: "boolean"
  }), _dec4 = Property({
    type: "string"
  }), _dec5 = Property({
    type: "boolean",
    defaultValue: false
  }), _dec6 = Property({
    type: "string",
    defaultValue: "ResponsiveTable"
  }), _dec7 = Property({
    type: "boolean",
    defaultValue: true
  }), _dec8 = Property({
    type: "boolean",
    defaultValue: false
  }), _dec9 = Property({
    type: "boolean",
    defaultValue: false
  }), _dec10 = Property({
    type: "string"
  }), _dec11 = Property({
    type: "string"
  }), _dec12 = Property({
    type: "boolean",
    defaultValue: false
  }), _dec13 = Property({
    type: "boolean",
    defaultValue: true
  }), _dec14 = Property({
    type: "boolean|string",
    defaultValue: true
  }), _dec15 = Property({
    type: "string"
  }), _dec16 = Property({
    type: "boolean"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    _inherits(TableAPI, _MacroAPI);

    var _super = _createSuper(TableAPI);

    function TableAPI() {
      var _this;

      _classCallCheck(this, TableAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "tableDefinition", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "readOnly", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "id", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "busy", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "type", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "enableExport", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "enablePaste", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "enableFullScreen", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "selectionMode", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "header", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "enableAutoColumnWidth", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "headerVisible", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "rowPress", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "personalization", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "variantManagement", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "enableDataStateFilter", _descriptor16, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(TableAPI, [{
      key: "onTableRowPress",
      value: function onTableRowPress(oEvent, oController, oContext, mParameters) {
        // In the case of an analytical table, if we're trying to navigate to a context corresponding to a visual group or grand total
        // --> Cancel navigation
        if (oContext && oContext.isA("sap.ui.model.odata.v4.Context") && typeof oContext.getProperty("@$ui5.node.isExpanded") === "boolean") {
          return false;
        } else {
          oController._routing.navigateForwardToContext(oContext, mParameters);
        }
      }
    }, {
      key: "onInternalDataReceived",
      value: function onInternalDataReceived(oEvent) {
        if (oEvent.getParameter("error")) {
          this.getController().messageHandler.showMessageDialog();
        }
      }
    }, {
      key: "onPaste",
      value: function onPaste(oEvent, oController) {
        var _this2 = this;

        // If paste is disable or if we're not in edit mode, we can't paste anything
        if (!this.tableDefinition.control.enablePaste || !this.getModel("ui").getProperty("/isEditable")) {
          return;
        }

        var aRawPastedData = oEvent.getParameter("data"),
            oTable = oEvent.getSource(),
            bPasteEnabled = oTable.data()["enablePaste"];
        var oResourceModel;

        if (bPasteEnabled === true || bPasteEnabled === "true") {
          PasteHelper.parseDataForTablePaste(aRawPastedData, oTable).then(function (aParsedData) {
            if (aParsedData && aParsedData.length > 0) {
              return oController._editFlow.createMultipleDocuments(oTable.getRowBinding(), aParsedData, _this2.tableDefinition.control.createAtEnd, true);
            }
          }).catch(function (oError) {
            Log.error("Error while pasting data", oError);
          });
        } else {
          oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
          MessageBox.error(oResourceModel.getText("T_OP_CONTROLLER_SAPFE_PASTE_DISABLED_MESSAGE"), {
            title: oResourceModel.getText("C_COMMON_SAPFE_ERROR")
          });
        }
      }
    }, {
      key: "onPasteButtonPressed",
      value: function onPasteButtonPressed() {
        var _this3 = this;

        var oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
            sDeviceOs = Device.os.name,
            sDeviceSystem = Device.system; // We need a default in case we fall through the crack

        var sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP"); // On mobile, there is no native paste trigger:

        if (sDeviceSystem.phone || sDeviceSystem.tablet && !sDeviceSystem.combi) {
          sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_TOUCH_DEVICE");
        } else if (sDeviceSystem.desktop) {
          switch (sDeviceOs) {
            case "win":
              sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP");
              break;

            case "mac":
              sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_IOS_DESKTOP");
              break;
          }
        }

        MessageBox.information(sMessageOnPasteButton, {
          onClose: function () {
            if (_this3.content) {
              var _this3$content$getAgg;

              // Set the focus on the inner table to allow paste
              (_this3$content$getAgg = _this3.content.getAggregation("_content")) === null || _this3$content$getAgg === void 0 ? void 0 : _this3$content$getAgg.applyFocusInfo({
                preventScroll: true
              });
            }
          }
        });
      } // This event will allow us to intercept the export before is triggered to cover specific cases
      // that couldn't be addressed on the propertyInfos for each column.
      // e.g. Fixed Target Value for the datapoints

    }, {
      key: "onBeforeExport",
      value: function onBeforeExport(oEvent) {
        var _oEvent$getParameters;

        var isSplitMode = oEvent.getParameters().userExportSettings.splitCells,
            isRLTLanguage = sap.ui.getCore().getConfiguration().getRTL(),
            oTableController = oEvent.getSource(),
            oExportColumns = (_oEvent$getParameters = oEvent.getParameters().exportSettings.workbook) === null || _oEvent$getParameters === void 0 ? void 0 : _oEvent$getParameters.columns,
            oTableColumns = this.tableDefinition.columns;
        TableAPI.updateExportSettings(oExportColumns, oTableColumns, oTableController, isSplitMode, isRLTLanguage);
      }
      /**
       * Handles the MDC DataStateIndicator plugin to display messageStrip on a table.
       * @param oMessage
       * @param oTable
       * @name dataStateFilter
       * @returns {boolean} Whether to render visible the messageStrip
       */

    }, {
      key: "onDataStateChange",
      value:
      /**
       * This event handles the DataState of the DataStateIndicator plugin from MDC on a table.
       * It's fired when new error messages are sent from the backend to update row highlighting.
       *
       * @name onDataStateChange
       * @param {object} oEvent Event object
       */
      function onDataStateChange(oEvent) {
        var oDataStateIndicator = oEvent.getSource();
        var aFilteredMessages = oEvent.getParameter("filteredMessages");

        if (aFilteredMessages) {
          var oInternalModel = oDataStateIndicator.getModel("internal");
          oInternalModel.setProperty("filteredMessages", aFilteredMessages, oDataStateIndicator.getBindingContext("internal"));
        }
      }
    }, {
      key: "onMassEditButtonPressed",
      value: function onMassEditButtonPressed(oEvent, PageController) {
        var oTable = this.content;
        MassEditHandler.openMassEditDialog(oTable, PageController);
      }
    }], [{
      key: "shouldFilterDataStateMessage",
      value: function shouldFilterDataStateMessage(oMessage, oTable) {
        var oTableAPI = oTable.getParent();

        while (!oTableAPI.isA("sap.fe.macros.TableAPI")) {
          oTableAPI = oTableAPI.getParent();
        }

        return oTableAPI.tableDefinition.enableDataStateFilter;
      }
    }, {
      key: "updateExportSettings",
      value: function updateExportSettings(oExportColumns, oColumns, oTableController, isSplitMode, isRLTLanguage) {
        oExportColumns.forEach(function (oColumnExport) {
          var aExportLabels = [];
          oColumns === null || oColumns === void 0 ? void 0 : oColumns.forEach(function (column) {
            var oColumn = column;

            if (isSplitMode) {
              // aExportLabels will contain labels from a FieldGroup, a text annotation and a DataPoint
              // These labels will be used for child properties (simple properties) from complexProperty
              // Unit/currency properties will be dismiss as it could be used in several datafields.
              var isUnit = oColumns.some(function (column) {
                return column.unit === oColumnExport.property;
              }); // Create Exporting labels array

              var FieldGroupLabel = TableAPI._getFieldGroupExportLabel(oColumnExport, oColumn, oTableController);

              if (FieldGroupLabel) {
                aExportLabels.unshift(FieldGroupLabel);
              } // For a text annotation, export label template used is <value> - <description> and for a DataPoint <datapointValue> - <TargetValue>.
              // In both cases internationalization is needed


              var dataFieldDescriptionLabel = TableAPI._getDataFieldDescriptionLabel(oColumnExport, oColumn, oTableController, isUnit);

              if (dataFieldDescriptionLabel) {
                aExportLabels.unshift(dataFieldDescriptionLabel);
              } //Add TargetValue on dummy created property when  exporting on split mode


              if (oColumn.isDataPointFakeTargetProperty && oColumn.relativePath === oColumnExport.property) {
                oColumnExport.property = [oColumnExport.property];
              }
            } //Modify exported value when using Communication.Contact dataFieldForAnnotation
            //contact>fn property should be exported


            if (oColumn.exportContactProperty && column.propertyInfos) {
              var _column$propertyInfos, _column$propertyInfos2, _column$propertyInfos3, _oColumn$propertyInfo;

              if (((_column$propertyInfos = column.propertyInfos) === null || _column$propertyInfos === void 0 ? void 0 : _column$propertyInfos.length) === 1 && ((_column$propertyInfos2 = column.propertyInfos) === null || _column$propertyInfos2 === void 0 ? void 0 : _column$propertyInfos2.toString()) === oColumnExport.property.toString()) {
                oColumnExport.property = oColumn.exportContactProperty;
                oColumnExport.label = oColumn.label;
              } else if (((_column$propertyInfos3 = column.propertyInfos) === null || _column$propertyInfos3 === void 0 ? void 0 : _column$propertyInfos3.length) > 1 && (_oColumn$propertyInfo = oColumn.propertyInfos) !== null && _oColumn$propertyInfo !== void 0 && _oColumn$propertyInfo.some(function (prop) {
                return oColumnExport.property.includes(prop);
              }) && Array.isArray(oColumnExport.property)) {
                var _oColumnExport$proper;

                oColumnExport.property = (_oColumnExport$proper = oColumnExport.property) === null || _oColumnExport$proper === void 0 ? void 0 : _oColumnExport$proper.map(function (property) {
                  var _oColumn$propertyInfo2;

                  return (_oColumn$propertyInfo2 = oColumn.propertyInfos) !== null && _oColumn$propertyInfo2 !== void 0 && _oColumn$propertyInfo2.some(function (prop) {
                    return prop === property;
                  }) ? oColumn.exportContactProperty : property;
                });
              }
            }
          });
          aExportLabels.push(DelegateUtil.getLocalizedText(oColumnExport.label, oTableController));

          if (aExportLabels.length > 1) {
            // Remove duplicate labels (e.g. FieldGroup label is the same as the label of one of the properties)
            aExportLabels = aExportLabels.filter(function (label, index) {
              if (aExportLabels.indexOf(label) == index) {
                return label;
              }
            });
          } // Check if a RTL language if used and if so we need to reverse labels


          if (isRLTLanguage) {
            aExportLabels.reverse();
          }

          oColumnExport.label = aExportLabels.join(" - ");
        });
        return oExportColumns;
      }
    }, {
      key: "_getFieldGroupExportLabel",
      value: function _getFieldGroupExportLabel(oColumnExport, oColumn, oTableController) {
        var _oColumn$exportSettin, _oColumn$propertyInfo3, _oColumn$propertyInfo4;

        if ((oColumnExport.columnId.indexOf("::FieldGroup::") !== -1 || (_oColumn$exportSettin = oColumn.exportSettings) !== null && _oColumn$exportSettin !== void 0 && _oColumn$exportSettin.fieldLabel && oColumnExport.columnId.indexOf("__column") !== -1) && ((_oColumn$propertyInfo3 = oColumn.propertyInfos) !== null && _oColumn$propertyInfo3 !== void 0 && _oColumn$propertyInfo3.includes(oColumnExport.property) || (_oColumn$propertyInfo4 = oColumn.propertyInfos) !== null && _oColumn$propertyInfo4 !== void 0 && _oColumn$propertyInfo4.includes("Property::" + oColumnExport.property))) {
          var _oColumn$exportSettin2;

          var label = ((_oColumn$exportSettin2 = oColumn.exportSettings) === null || _oColumn$exportSettin2 === void 0 ? void 0 : _oColumn$exportSettin2.fieldLabel) || oColumn.label;
          return DelegateUtil.getLocalizedText(label, oTableController);
        }
      }
    }, {
      key: "_getDataFieldDescriptionLabel",
      value: function _getDataFieldDescriptionLabel(oColumnExport, oColumn, oTableController, isUnit) {
        var _oColumn$propertyInfo5, _oColumn$propertyInfo6, _oColumn$propertyInfo7, _oColumn$relativePath;

        if (oColumn.propertyInfos && ((_oColumn$propertyInfo5 = oColumn.propertyInfos) === null || _oColumn$propertyInfo5 === void 0 ? void 0 : _oColumn$propertyInfo5.length) > 1 && !isUnit && ((_oColumn$propertyInfo6 = oColumn.propertyInfos) !== null && _oColumn$propertyInfo6 !== void 0 && _oColumn$propertyInfo6.includes(oColumnExport.property) || (_oColumn$propertyInfo7 = oColumn.propertyInfos) !== null && _oColumn$propertyInfo7 !== void 0 && _oColumn$propertyInfo7.includes("Property::" + oColumnExport.property)) && ((_oColumn$relativePath = oColumn.relativePath) === null || _oColumn$relativePath === void 0 ? void 0 : _oColumn$relativePath.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup")) === -1) {
          return DelegateUtil.getLocalizedText(oColumn.label, oTableController);
        }
      }
    }]);

    return TableAPI;
  }(MacroAPI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tableDefinition", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "readOnly", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "busy", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "enableExport", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enablePaste", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enableFullScreen", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "selectionMode", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "header", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoColumnWidth", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "headerVisible", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "rowPress", [Event], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "personalization", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "variantManagement", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "enableDataStateFilter", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "onTableRowPress", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onTableRowPress"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onInternalDataReceived", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onInternalDataReceived"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPaste", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onPaste"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPasteButtonPressed", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onPasteButtonPressed"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onBeforeExport", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onBeforeExport"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onDataStateChange", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onDataStateChange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onMassEditButtonPressed", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onMassEditButtonPressed"), _class2.prototype)), _class2)) || _class);
  return TableAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlQVBJLnRzIl0sIm5hbWVzIjpbIlRhYmxlQVBJIiwiQVBJQ2xhc3MiLCJNYWNyb0NvbnRleHQiLCJQcm9wZXJ0eSIsInR5cGUiLCJkZWZhdWx0VmFsdWUiLCJvRXZlbnQiLCJvQ29udHJvbGxlciIsIm9Db250ZXh0IiwibVBhcmFtZXRlcnMiLCJpc0EiLCJnZXRQcm9wZXJ0eSIsIl9yb3V0aW5nIiwibmF2aWdhdGVGb3J3YXJkVG9Db250ZXh0IiwiZ2V0UGFyYW1ldGVyIiwiZ2V0Q29udHJvbGxlciIsIm1lc3NhZ2VIYW5kbGVyIiwic2hvd01lc3NhZ2VEaWFsb2ciLCJ0YWJsZURlZmluaXRpb24iLCJjb250cm9sIiwiZW5hYmxlUGFzdGUiLCJnZXRNb2RlbCIsImFSYXdQYXN0ZWREYXRhIiwib1RhYmxlIiwiZ2V0U291cmNlIiwiYlBhc3RlRW5hYmxlZCIsImRhdGEiLCJvUmVzb3VyY2VNb2RlbCIsIlBhc3RlSGVscGVyIiwicGFyc2VEYXRhRm9yVGFibGVQYXN0ZSIsInRoZW4iLCJhUGFyc2VkRGF0YSIsImxlbmd0aCIsIl9lZGl0RmxvdyIsImNyZWF0ZU11bHRpcGxlRG9jdW1lbnRzIiwiZ2V0Um93QmluZGluZyIsImNyZWF0ZUF0RW5kIiwiY2F0Y2giLCJvRXJyb3IiLCJMb2ciLCJlcnJvciIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsIk1lc3NhZ2VCb3giLCJnZXRUZXh0IiwidGl0bGUiLCJzRGV2aWNlT3MiLCJEZXZpY2UiLCJvcyIsIm5hbWUiLCJzRGV2aWNlU3lzdGVtIiwic3lzdGVtIiwic01lc3NhZ2VPblBhc3RlQnV0dG9uIiwicGhvbmUiLCJ0YWJsZXQiLCJjb21iaSIsImRlc2t0b3AiLCJpbmZvcm1hdGlvbiIsIm9uQ2xvc2UiLCJjb250ZW50IiwiZ2V0QWdncmVnYXRpb24iLCJhcHBseUZvY3VzSW5mbyIsInByZXZlbnRTY3JvbGwiLCJpc1NwbGl0TW9kZSIsImdldFBhcmFtZXRlcnMiLCJ1c2VyRXhwb3J0U2V0dGluZ3MiLCJzcGxpdENlbGxzIiwiaXNSTFRMYW5ndWFnZSIsImdldENvbmZpZ3VyYXRpb24iLCJnZXRSVEwiLCJvVGFibGVDb250cm9sbGVyIiwib0V4cG9ydENvbHVtbnMiLCJleHBvcnRTZXR0aW5ncyIsIndvcmtib29rIiwiY29sdW1ucyIsIm9UYWJsZUNvbHVtbnMiLCJ1cGRhdGVFeHBvcnRTZXR0aW5ncyIsIm9EYXRhU3RhdGVJbmRpY2F0b3IiLCJhRmlsdGVyZWRNZXNzYWdlcyIsIm9JbnRlcm5hbE1vZGVsIiwic2V0UHJvcGVydHkiLCJnZXRCaW5kaW5nQ29udGV4dCIsIlBhZ2VDb250cm9sbGVyIiwiTWFzc0VkaXRIYW5kbGVyIiwib3Blbk1hc3NFZGl0RGlhbG9nIiwib01lc3NhZ2UiLCJvVGFibGVBUEkiLCJnZXRQYXJlbnQiLCJlbmFibGVEYXRhU3RhdGVGaWx0ZXIiLCJvQ29sdW1ucyIsImZvckVhY2giLCJvQ29sdW1uRXhwb3J0IiwiYUV4cG9ydExhYmVscyIsImNvbHVtbiIsIm9Db2x1bW4iLCJpc1VuaXQiLCJzb21lIiwidW5pdCIsInByb3BlcnR5IiwiRmllbGRHcm91cExhYmVsIiwiX2dldEZpZWxkR3JvdXBFeHBvcnRMYWJlbCIsInVuc2hpZnQiLCJkYXRhRmllbGREZXNjcmlwdGlvbkxhYmVsIiwiX2dldERhdGFGaWVsZERlc2NyaXB0aW9uTGFiZWwiLCJpc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eSIsInJlbGF0aXZlUGF0aCIsImV4cG9ydENvbnRhY3RQcm9wZXJ0eSIsInByb3BlcnR5SW5mb3MiLCJ0b1N0cmluZyIsImxhYmVsIiwicHJvcCIsImluY2x1ZGVzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwicHVzaCIsIkRlbGVnYXRlVXRpbCIsImdldExvY2FsaXplZFRleHQiLCJmaWx0ZXIiLCJpbmRleCIsImluZGV4T2YiLCJyZXZlcnNlIiwiam9pbiIsImNvbHVtbklkIiwiZmllbGRMYWJlbCIsIk1hY3JvQVBJIiwiRXZlbnQiLCJF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QkFDQUosT0FBTyxDQUFDYSxhQURSLG1EQUNBLHVCQUF1QkksUUFBdkIsQ0FBZ0MsZUFBZXBCLGFBQWEsQ0FBQ08sUUFBN0QsQ0FKRCxLQUtBLDBCQUFBSixPQUFPLENBQUNXLFlBQVIsZ0ZBQXNCZSxPQUF0QixDQUE4Qix3Q0FBOUIsT0FBNEUsQ0FBQyxDQU45RSxFQU9FO0FBQ0QsaUJBQU9KLFlBQVksQ0FBQ0MsZ0JBQWIsQ0FBOEJ2QixPQUFPLENBQUNlLEtBQXRDLEVBQXVEdkMsZ0JBQXZELENBQVA7QUFDQTtBQUNEOzs7O0lBNVhxQnVELFE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnRkF5R3JCQyxLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1RUF1Q0FDLFksc0tBZUFBLFksOEpBTUFBLFksNEpBbUNBQSxZLG1LQWlDQUEsWSxnS0FvQ0FBLFkseUtBZ0hBQSxZO1NBT2FqSSxRIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElDbGFzcywgRXZlbnRIYW5kbGVyLCBNYWNyb0NvbnRleHQsIFByb3BlcnR5LCBFdmVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IHsgUGFzdGVIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVyc1wiO1xuaW1wb3J0IHsgTWVzc2FnZUJveCB9IGZyb20gXCJzYXAvbVwiO1xuaW1wb3J0IHsgRGV2aWNlIH0gZnJvbSBcInNhcC91aVwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeyBQYWdlQ29udHJvbGxlciB9IGZyb20gXCJzYXAvZmUvY29yZVwiO1xuaW1wb3J0IHsgQW5ub3RhdGlvblRhYmxlQ29sdW1uLCBUYWJsZUNvbHVtbiwgVGFibGVWaXN1YWxpemF0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5pbXBvcnQgTWFjcm9BUEkgZnJvbSBcIi4vTWFjcm9BUElcIjtcbmltcG9ydCB7IE1hc3NFZGl0SGFuZGxlciB9IGZyb20gXCJzYXAvZmUvbWFjcm9zL21hc3NlZGl0XCI7XG5pbXBvcnQgeyBEZWxlZ2F0ZVV0aWwgfSBmcm9tIFwic2FwL2ZlL21hY3Jvc1wiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjRcIjtcblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgY3VzdG9tIGFjdGlvbiB0byBiZSB1c2VkIGluc2lkZSB0aGUgdGFibGUgdG9vbGJhclxuICpcbiAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLnRhYmxlLkFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgdHlwZSBBY3Rpb24gPSB7XG5cdC8qKlxuXHQgKiBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgYWN0aW9uXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGtleTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBmb3IgdGhpcyBhY3Rpb25cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0dGV4dDogc3RyaW5nO1xuXHQvKipcblx0ICogUmVmZXJlbmNlIHRvIHRoZSBrZXkgb2YgYW5vdGhlciBhY3Rpb24gYWxyZWFkeSBkaXNwbGF5ZWQgaW4gdGhlIHRvb2xiYXIgdG8gcHJvcGVybHkgcGxhY2UgdGhpcyBvbmVcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0YW5jaG9yPzogc3RyaW5nO1xuXHQvKipcblx0ICogRGVmaW5lcyB3aGVyZSB0aGlzIGFjdGlvbiBzaG91bGQgYmUgcGxhY2VkIHJlbGF0aXZlIHRvIHRoZSBkZWZpbmVkIGFuY2hvclxuXHQgKlxuXHQgKiBBbGxvd2VkIHZhbHVlcyBhcmUgYEJlZm9yZWAgYW5kIGBBZnRlcmBcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0cGxhY2VtZW50Pzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBFdmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNob29zZXMgdGhlIGFjdGlvblxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRwcmVzczogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgY3VzdG9tIGNvbHVtbiB0byBiZSB1c2VkIGluc2lkZSB0aGUgdGFibGUuXG4gKlxuICogVGhlIHRlbXBsYXRlIGZvciB0aGUgY29sdW1uIGhhcyB0byBiZSBwcm92aWRlZCBhcyB0aGUgZGVmYXVsdCBhZ2dyZWdhdGlvblxuICpcbiAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLnRhYmxlLkNvbHVtblxuICogQHB1YmxpY1xuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgdHlwZSBDb2x1bW4gPSB7XG5cdC8qKlxuXHQgKiBVbmlxdWUgaWRlbnRpZmllciBvZiB0aGUgY29sdW1uXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGtleTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBmb3IgdGhpcyBjb2x1bW4gaGVhZGVyXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGhlYWRlcjogc3RyaW5nO1xuXHQvKipcblx0ICogUmVmZXJlbmNlIHRvIHRoZSBrZXkgb2YgYW5vdGhlciBjb2x1bW4gYWxyZWFkeSBkaXNwbGF5ZWQgaW4gdGhlIHRhYmxlIHRvIHByb3Blcmx5IHBsYWNlIHRoaXMgb25lXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGFuY2hvcj86IHN0cmluZztcblx0LyoqXG5cdCAqIERlZmluZXMgd2hlcmUgdGhpcyBjb2x1bW4gc2hvdWxkIGJlIHBsYWNlZCByZWxhdGl2ZSB0byB0aGUgZGVmaW5lZCBhbmNob3Jcblx0ICpcblx0ICogQWxsb3dlZCB2YWx1ZXMgYXJlIGBCZWZvcmVgIGFuZCBgQWZ0ZXJgXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHBsYWNlbWVudD86IHN0cmluZztcbn07XG5cbi8qKlxuICogQnVpbGRpbmcgYmxvY2sgdXNlZCB0byBjcmVhdGUgYSB0YWJsZSBiYXNlZCBvbiB0aGUgbWV0YWRhdGEgcHJvdmlkZWQgYnkgT0RhdGEgVjQuXG4gKiA8YnI+XG4gKiBVc3VhbGx5LCBhIExpbmVJdGVtIG9yIFByZXNlbnRhdGlvblZhcmlhbnQgYW5ub3RhdGlvbiBpcyBleHBlY3RlZCwgYnV0IHRoZSBUYWJsZSBidWlsZGluZyBibG9jayBjYW4gYWxzbyBiZSB1c2VkIHRvIGRpc3BsYXkgYW4gRW50aXR5U2V0LlxuICpcbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpUYWJsZSBpZD1cIk15VGFibGVcIiBtZXRhUGF0aD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiIC8mZ3Q7XG4gKiA8L3ByZT5cbiAqXG4gKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZVxuICogQHB1YmxpY1xuICovXG5AQVBJQ2xhc3MoXCJzYXAuZmUubWFjcm9zLlRhYmxlQVBJXCIpXG5jbGFzcyBUYWJsZUFQSSBleHRlbmRzIE1hY3JvQVBJIHtcblx0QE1hY3JvQ29udGV4dCgpXG5cdHRhYmxlRGVmaW5pdGlvbiE6IFRhYmxlVmlzdWFsaXphdGlvbjtcblxuXHQvKipcblx0ICogQW4gZXhwcmVzc2lvbiB0aGF0IGFsbG93cyB5b3UgdG8gY29udHJvbCB0aGUgJ3JlYWQtb25seScgc3RhdGUgb2YgdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBJZiB5b3UgZG8gbm90IHNldCBhbnkgZXhwcmVzc2lvbiwgU0FQIEZpb3JpIGVsZW1lbnRzIGhvb2tzIGludG8gdGhlIHN0YW5kYXJkIGxpZmVjeWNsZSB0byBkZXRlcm1pbmUgdGhlIGN1cnJlbnQgc3RhdGUuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiIH0pXG5cdHJlYWRPbmx5ITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGlkZW50aWZpZXIgb2YgdGhlIHRhYmxlIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0aWQhOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEFuIGV4cHJlc3Npb24gdGhhdCBhbGxvd3MgeW91IHRvIGNvbnRyb2wgdGhlICdidXN5JyBzdGF0ZSBvZiB0aGUgdGFibGUuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlIH0pXG5cdGJ1c3khOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSB0eXBlIG9mIHRhYmxlIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBtYWNybyB0byByZW5kZXIgdGhlIGRhdGEuXG5cdCAqXG5cdCAqIEFsbG93ZWQgdmFsdWVzIGFyZSBgR3JpZFRhYmxlYCBhbmQgYFJlc3BvbnNpdmVUYWJsZWBcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiwgZGVmYXVsdFZhbHVlOiBcIlJlc3BvbnNpdmVUYWJsZVwiIH0pXG5cdHR5cGUhOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIGlmIHRoZSBleHBvcnQgZnVuY3Rpb25hbGl0eSBvZiB0aGUgdGFibGUgaXMgZW5hYmxlZCBvciBub3QuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IHRydWUgfSlcblx0ZW5hYmxlRXhwb3J0ITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQ29udHJvbHMgaWYgdGhlIHBhc3RlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIHRhYmxlIGlzIGVuYWJsZWQgb3Igbm90LlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSB9KVxuXHRlbmFibGVQYXN0ZSE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIHdoZXRoZXIgdGhlIHRhYmxlIGNhbiBiZSBvcGVuZWQgaW4gZnVsbHNjcmVlbiBtb2RlIG9yIG5vdC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UgfSlcblx0ZW5hYmxlRnVsbFNjcmVlbiE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIERlZmluZXMgdGhlIHNlbGVjdGlvbiBtb2RlIHRvIGJlIHVzZWQgYnkgdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBBbGxvd2VkIHZhbHVlcyBhcmUgYE5vbmVgLCBgU2luZ2xlYCwgYE11bHRpYCBvciBgQXV0b2Bcblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRzZWxlY3Rpb25Nb2RlITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBTcGVjaWZpZXMgdGhlIGhlYWRlciB0ZXh0IHRoYXQgaXMgc2hvd24gaW4gdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXG5cdGhlYWRlciE6IHN0cmluZztcblxuXHQvKipcblx0ICogU3BlY2lmaWVzIHRoZSBoZWFkZXIgdGV4dCB0aGF0IGlzIHNob3duIGluIHRoZSB0YWJsZS5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UgfSlcblx0ZW5hYmxlQXV0b0NvbHVtbldpZHRoITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQ29udHJvbHMgaWYgdGhlIGhlYWRlciB0ZXh0IHNob3VsZCBiZSBzaG93biBvciBub3QuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0VmFsdWU6IHRydWUgfSlcblx0aGVhZGVyVmlzaWJsZSE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIGNob29zZXMgYSByb3c7IHRoZSBldmVudCBjb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB3aGljaCByb3cgd2FzIGNob3Nlbi5cblx0ICpcblx0ICogWW91IGNhbiBzZXQgdGhpcyBpbiBvcmRlciB0byBoYW5kbGUgdGhlIG5hdmlnYXRpb24gbWFudWFsbHkuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBFdmVudFxuXHRyb3dQcmVzcyE6IEZ1bmN0aW9uO1xuXG5cdC8qKlxuXHQgKiBDb250cm9scyB3aGljaCBvcHRpb25zIHNob3VsZCBiZSBlbmFibGVkIGZvciB0aGUgdGFibGUgcGVyc29uYWxpemF0aW9uIGRpYWxvZy5cblx0ICpcblx0ICogSWYgaXQgaXMgc2V0IHRvIGB0cnVlYCwgYWxsIHBvc3NpYmxlIG9wdGlvbnMgZm9yIHRoaXMga2luZCBvZiB0YWJsZSBhcmUgZW5hYmxlZC48YnIvPlxuXHQgKiBJZiBpdCBpcyBzZXQgdG8gYGZhbHNlYCwgcGVyc29uYWxpemF0aW9uIGlzIGRpc2FibGVkLjxici8+XG5cdCAqPGJyLz5cblx0ICogWW91IGNhbiBhbHNvIHByb3ZpZGUgYSBtb3JlIGdyYW51bGFyIGNvbnRyb2wgZm9yIHRoZSBwZXJzb25hbGl6YXRpb24gYnkgcHJvdmlkaW5nIGEgY29tbWEtc2VwYXJhdGVkIGxpc3Qgd2l0aCB0aGUgb3B0aW9ucyB5b3Ugd2FudCB0byBiZSBhdmFpbGFibGUuPGJyLz5cblx0ICogQXZhaWxhYmxlIG9wdGlvbnMgYXJlOjxici8+XG5cdCAqICAtIFNvcnQ8YnIvPlxuXHQgKiAgLSBDb2x1bW48YnIvPlxuXHQgKiAgLSBGaWx0ZXI8YnIvPlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW58c3RyaW5nXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSB9KVxuXHRwZXJzb25hbGl6YXRpb24hOiBib29sZWFuIHwgc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBDb250cm9scyB0aGUga2luZCBvZiB2YXJpYW50IG1hbmFnZW1lbnQgdGhhdCBzaG91bGQgYmUgZW5hYmxlZCBmb3IgdGhlIHRhYmxlLlxuXHQgKlxuXHQgKiBBbGxvd2VkIHZhbHVlcyBhcmUgYFBhZ2VgLCBgQ29udHJvbGAgYW5kIGBOb25lYC48YnIvPlxuXHQgKiBJZiB0aGUgdGFibGUgaXMgdXNlZCB3aXRoaW4gYSBTQVAgRmlvcmkgZWxlbWVudHMgdGVtcGxhdGUsIHRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdGFrZW4gZnJvbSB0aGUgY3VycmVudCBwYWdlIHZhcmlhbnQgbWFuYWdlbWVudC48YnIvPlxuXHQgKiBPdGhlcndpc2UgaXQncyBgTm9uZWAuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0dmFyaWFudE1hbmFnZW1lbnQhOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIENvbnRyb2xzIGlmIHRoZSBkYXRhU3RhdGVJbmRpY2F0b3IgZnVuY3Rpb25hbGl0eSBvZiB0aGUgdGFibGUgaXMgZW5hYmxlZCBvciBub3QuXG5cdCAqXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiB9KVxuXHRlbmFibGVEYXRhU3RhdGVGaWx0ZXIhOiBib29sZWFuO1xuXG5cdEBFdmVudEhhbmRsZXJcblx0b25UYWJsZVJvd1ByZXNzKG9FdmVudDogVUk1RXZlbnQsIG9Db250cm9sbGVyOiBQYWdlQ29udHJvbGxlciwgb0NvbnRleHQ6IENvbnRleHQsIG1QYXJhbWV0ZXJzOiBhbnkpIHtcblx0XHQvLyBJbiB0aGUgY2FzZSBvZiBhbiBhbmFseXRpY2FsIHRhYmxlLCBpZiB3ZSdyZSB0cnlpbmcgdG8gbmF2aWdhdGUgdG8gYSBjb250ZXh0IGNvcnJlc3BvbmRpbmcgdG8gYSB2aXN1YWwgZ3JvdXAgb3IgZ3JhbmQgdG90YWxcblx0XHQvLyAtLT4gQ2FuY2VsIG5hdmlnYXRpb25cblx0XHRpZiAoXG5cdFx0XHRvQ29udGV4dCAmJlxuXHRcdFx0b0NvbnRleHQuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0LkNvbnRleHRcIikgJiZcblx0XHRcdHR5cGVvZiBvQ29udGV4dC5nZXRQcm9wZXJ0eShcIkAkdWk1Lm5vZGUuaXNFeHBhbmRlZFwiKSA9PT0gXCJib29sZWFuXCJcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b0NvbnRyb2xsZXIuX3JvdXRpbmcubmF2aWdhdGVGb3J3YXJkVG9Db250ZXh0KG9Db250ZXh0LCBtUGFyYW1ldGVycyk7XG5cdFx0fVxuXHR9XG5cblx0QEV2ZW50SGFuZGxlclxuXHRvbkludGVybmFsRGF0YVJlY2VpdmVkKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHRpZiAob0V2ZW50LmdldFBhcmFtZXRlcihcImVycm9yXCIpKSB7XG5cdFx0XHR0aGlzLmdldENvbnRyb2xsZXIoKS5tZXNzYWdlSGFuZGxlci5zaG93TWVzc2FnZURpYWxvZygpO1xuXHRcdH1cblx0fVxuXHRARXZlbnRIYW5kbGVyXG5cdG9uUGFzdGUob0V2ZW50OiBVSTVFdmVudCwgb0NvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyKSB7XG5cdFx0Ly8gSWYgcGFzdGUgaXMgZGlzYWJsZSBvciBpZiB3ZSdyZSBub3QgaW4gZWRpdCBtb2RlLCB3ZSBjYW4ndCBwYXN0ZSBhbnl0aGluZ1xuXHRcdGlmICghdGhpcy50YWJsZURlZmluaXRpb24uY29udHJvbC5lbmFibGVQYXN0ZSB8fCAhdGhpcy5nZXRNb2RlbChcInVpXCIpLmdldFByb3BlcnR5KFwiL2lzRWRpdGFibGVcIikpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBhUmF3UGFzdGVkRGF0YSA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJkYXRhXCIpLFxuXHRcdFx0b1RhYmxlID0gb0V2ZW50LmdldFNvdXJjZSgpLFxuXHRcdFx0YlBhc3RlRW5hYmxlZCA9IG9UYWJsZS5kYXRhKClbXCJlbmFibGVQYXN0ZVwiXTtcblx0XHRsZXQgb1Jlc291cmNlTW9kZWw7XG5cblx0XHRpZiAoYlBhc3RlRW5hYmxlZCA9PT0gdHJ1ZSB8fCBiUGFzdGVFbmFibGVkID09PSBcInRydWVcIikge1xuXHRcdFx0UGFzdGVIZWxwZXIucGFyc2VEYXRhRm9yVGFibGVQYXN0ZShhUmF3UGFzdGVkRGF0YSwgb1RhYmxlKVxuXHRcdFx0XHQudGhlbihhUGFyc2VkRGF0YSA9PiB7XG5cdFx0XHRcdFx0aWYgKGFQYXJzZWREYXRhICYmIGFQYXJzZWREYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdHJldHVybiBvQ29udHJvbGxlci5fZWRpdEZsb3cuY3JlYXRlTXVsdGlwbGVEb2N1bWVudHMoXG5cdFx0XHRcdFx0XHRcdG9UYWJsZS5nZXRSb3dCaW5kaW5nKCksXG5cdFx0XHRcdFx0XHRcdGFQYXJzZWREYXRhLFxuXHRcdFx0XHRcdFx0XHR0aGlzLnRhYmxlRGVmaW5pdGlvbi5jb250cm9sLmNyZWF0ZUF0RW5kLFxuXHRcdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKG9FcnJvciA9PiB7XG5cdFx0XHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgcGFzdGluZyBkYXRhXCIsIG9FcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUmVzb3VyY2VNb2RlbCA9IHNhcC51aS5nZXRDb3JlKCkuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIik7XG5cdFx0XHRNZXNzYWdlQm94LmVycm9yKG9SZXNvdXJjZU1vZGVsLmdldFRleHQoXCJUX09QX0NPTlRST0xMRVJfU0FQRkVfUEFTVEVfRElTQUJMRURfTUVTU0FHRVwiKSwge1xuXHRcdFx0XHR0aXRsZTogb1Jlc291cmNlTW9kZWwuZ2V0VGV4dChcIkNfQ09NTU9OX1NBUEZFX0VSUk9SXCIpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRARXZlbnRIYW5kbGVyXG5cdG9uUGFzdGVCdXR0b25QcmVzc2VkKCkge1xuXHRcdGNvbnN0IG9SZXNvdXJjZU1vZGVsID0gc2FwLnVpLmdldENvcmUoKS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUudGVtcGxhdGVzXCIpLFxuXHRcdFx0c0RldmljZU9zID0gRGV2aWNlLm9zLm5hbWUsXG5cdFx0XHRzRGV2aWNlU3lzdGVtID0gRGV2aWNlLnN5c3RlbTtcblx0XHQvLyBXZSBuZWVkIGEgZGVmYXVsdCBpbiBjYXNlIHdlIGZhbGwgdGhyb3VnaCB0aGUgY3JhY2tcblx0XHRsZXQgc01lc3NhZ2VPblBhc3RlQnV0dG9uOiBzdHJpbmcgPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9XSU5ET1dTX0RFU0tUT1BcIik7XG5cdFx0Ly8gT24gbW9iaWxlLCB0aGVyZSBpcyBubyBuYXRpdmUgcGFzdGUgdHJpZ2dlcjpcblx0XHRpZiAoc0RldmljZVN5c3RlbS5waG9uZSB8fCAoc0RldmljZVN5c3RlbS50YWJsZXQgJiYgIXNEZXZpY2VTeXN0ZW0uY29tYmkpKSB7XG5cdFx0XHRzTWVzc2FnZU9uUGFzdGVCdXR0b24gPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9UT1VDSF9ERVZJQ0VcIik7XG5cdFx0fSBlbHNlIGlmIChzRGV2aWNlU3lzdGVtLmRlc2t0b3ApIHtcblx0XHRcdHN3aXRjaCAoc0RldmljZU9zKSB7XG5cdFx0XHRcdGNhc2UgXCJ3aW5cIjpcblx0XHRcdFx0XHRzTWVzc2FnZU9uUGFzdGVCdXR0b24gPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9XSU5ET1dTX0RFU0tUT1BcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJtYWNcIjpcblx0XHRcdFx0XHRzTWVzc2FnZU9uUGFzdGVCdXR0b24gPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9JT1NfREVTS1RPUFwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0TWVzc2FnZUJveC5pbmZvcm1hdGlvbihzTWVzc2FnZU9uUGFzdGVCdXR0b24sIHtcblx0XHRcdG9uQ2xvc2U6ICgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudCkge1xuXHRcdFx0XHRcdC8vIFNldCB0aGUgZm9jdXMgb24gdGhlIGlubmVyIHRhYmxlIHRvIGFsbG93IHBhc3RlXG5cdFx0XHRcdFx0KHRoaXMuY29udGVudC5nZXRBZ2dyZWdhdGlvbihcIl9jb250ZW50XCIpIGFzIGFueSk/LmFwcGx5Rm9jdXNJbmZvKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gVGhpcyBldmVudCB3aWxsIGFsbG93IHVzIHRvIGludGVyY2VwdCB0aGUgZXhwb3J0IGJlZm9yZSBpcyB0cmlnZ2VyZWQgdG8gY292ZXIgc3BlY2lmaWMgY2FzZXNcblx0Ly8gdGhhdCBjb3VsZG4ndCBiZSBhZGRyZXNzZWQgb24gdGhlIHByb3BlcnR5SW5mb3MgZm9yIGVhY2ggY29sdW1uLlxuXHQvLyBlLmcuIEZpeGVkIFRhcmdldCBWYWx1ZSBmb3IgdGhlIGRhdGFwb2ludHNcblx0QEV2ZW50SGFuZGxlclxuXHRvbkJlZm9yZUV4cG9ydChvRXZlbnQ6IFVJNUV2ZW50KSB7XG5cdFx0Y29uc3QgaXNTcGxpdE1vZGUgPSBvRXZlbnQuZ2V0UGFyYW1ldGVycygpLnVzZXJFeHBvcnRTZXR0aW5ncy5zcGxpdENlbGxzLFxuXHRcdFx0aXNSTFRMYW5ndWFnZSA9IHNhcC51aVxuXHRcdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHRcdC5nZXRDb25maWd1cmF0aW9uKClcblx0XHRcdFx0LmdldFJUTCgpLFxuXHRcdFx0b1RhYmxlQ29udHJvbGxlciA9IG9FdmVudC5nZXRTb3VyY2UoKSxcblx0XHRcdG9FeHBvcnRDb2x1bW5zID0gb0V2ZW50LmdldFBhcmFtZXRlcnMoKS5leHBvcnRTZXR0aW5ncy53b3JrYm9vaz8uY29sdW1ucyxcblx0XHRcdG9UYWJsZUNvbHVtbnMgPSB0aGlzLnRhYmxlRGVmaW5pdGlvbi5jb2x1bW5zO1xuXG5cdFx0VGFibGVBUEkudXBkYXRlRXhwb3J0U2V0dGluZ3Mob0V4cG9ydENvbHVtbnMsIG9UYWJsZUNvbHVtbnMsIG9UYWJsZUNvbnRyb2xsZXIsIGlzU3BsaXRNb2RlLCBpc1JMVExhbmd1YWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHRoZSBNREMgRGF0YVN0YXRlSW5kaWNhdG9yIHBsdWdpbiB0byBkaXNwbGF5IG1lc3NhZ2VTdHJpcCBvbiBhIHRhYmxlLlxuXHQgKiBAcGFyYW0gb01lc3NhZ2Vcblx0ICogQHBhcmFtIG9UYWJsZVxuXHQgKiBAbmFtZSBkYXRhU3RhdGVGaWx0ZXJcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdG8gcmVuZGVyIHZpc2libGUgdGhlIG1lc3NhZ2VTdHJpcFxuXHQgKi9cblx0c3RhdGljIHNob3VsZEZpbHRlckRhdGFTdGF0ZU1lc3NhZ2Uob01lc3NhZ2U6IGFueSwgb1RhYmxlOiBhbnkpOiBib29sZWFuIHtcblx0XHRsZXQgb1RhYmxlQVBJID0gb1RhYmxlLmdldFBhcmVudCgpO1xuXHRcdHdoaWxlICghb1RhYmxlQVBJLmlzQShcInNhcC5mZS5tYWNyb3MuVGFibGVBUElcIikpIHtcblx0XHRcdG9UYWJsZUFQSSA9IG9UYWJsZUFQSS5nZXRQYXJlbnQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9UYWJsZUFQSS50YWJsZURlZmluaXRpb24uZW5hYmxlRGF0YVN0YXRlRmlsdGVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgZXZlbnQgaGFuZGxlcyB0aGUgRGF0YVN0YXRlIG9mIHRoZSBEYXRhU3RhdGVJbmRpY2F0b3IgcGx1Z2luIGZyb20gTURDIG9uIGEgdGFibGUuXG5cdCAqIEl0J3MgZmlyZWQgd2hlbiBuZXcgZXJyb3IgbWVzc2FnZXMgYXJlIHNlbnQgZnJvbSB0aGUgYmFja2VuZCB0byB1cGRhdGUgcm93IGhpZ2hsaWdodGluZy5cblx0ICpcblx0ICogQG5hbWUgb25EYXRhU3RhdGVDaGFuZ2Vcblx0ICogQHBhcmFtIHtvYmplY3R9IG9FdmVudCBFdmVudCBvYmplY3Rcblx0ICovXG5cdEBFdmVudEhhbmRsZXJcblx0b25EYXRhU3RhdGVDaGFuZ2Uob0V2ZW50OiBVSTVFdmVudCkge1xuXHRcdGNvbnN0IG9EYXRhU3RhdGVJbmRpY2F0b3IgPSBvRXZlbnQuZ2V0U291cmNlKCk7XG5cdFx0Y29uc3QgYUZpbHRlcmVkTWVzc2FnZXMgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiZmlsdGVyZWRNZXNzYWdlc1wiKTtcblx0XHRpZiAoYUZpbHRlcmVkTWVzc2FnZXMpIHtcblx0XHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsID0gb0RhdGFTdGF0ZUluZGljYXRvci5nZXRNb2RlbChcImludGVybmFsXCIpO1xuXHRcdFx0b0ludGVybmFsTW9kZWwuc2V0UHJvcGVydHkoXCJmaWx0ZXJlZE1lc3NhZ2VzXCIsIGFGaWx0ZXJlZE1lc3NhZ2VzLCBvRGF0YVN0YXRlSW5kaWNhdG9yLmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyB1cGRhdGVFeHBvcnRTZXR0aW5ncyhcblx0XHRvRXhwb3J0Q29sdW1uczogYW55LFxuXHRcdG9Db2x1bW5zOiBUYWJsZUNvbHVtbltdLFxuXHRcdG9UYWJsZUNvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyLFxuXHRcdGlzU3BsaXRNb2RlOiBib29sZWFuLFxuXHRcdGlzUkxUTGFuZ3VhZ2U6IGJvb2xlYW5cblx0KTogYW55IHtcblx0XHRvRXhwb3J0Q29sdW1ucy5mb3JFYWNoKChvQ29sdW1uRXhwb3J0OiBhbnkpID0+IHtcblx0XHRcdGxldCBhRXhwb3J0TGFiZWxzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdFx0b0NvbHVtbnM/LmZvckVhY2goY29sdW1uID0+IHtcblx0XHRcdFx0Y29uc3Qgb0NvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRcdGlmIChpc1NwbGl0TW9kZSkge1xuXHRcdFx0XHRcdC8vIGFFeHBvcnRMYWJlbHMgd2lsbCBjb250YWluIGxhYmVscyBmcm9tIGEgRmllbGRHcm91cCwgYSB0ZXh0IGFubm90YXRpb24gYW5kIGEgRGF0YVBvaW50XG5cdFx0XHRcdFx0Ly8gVGhlc2UgbGFiZWxzIHdpbGwgYmUgdXNlZCBmb3IgY2hpbGQgcHJvcGVydGllcyAoc2ltcGxlIHByb3BlcnRpZXMpIGZyb20gY29tcGxleFByb3BlcnR5XG5cdFx0XHRcdFx0Ly8gVW5pdC9jdXJyZW5jeSBwcm9wZXJ0aWVzIHdpbGwgYmUgZGlzbWlzcyBhcyBpdCBjb3VsZCBiZSB1c2VkIGluIHNldmVyYWwgZGF0YWZpZWxkcy5cblx0XHRcdFx0XHRjb25zdCBpc1VuaXQgPSBvQ29sdW1ucy5zb21lKGNvbHVtbiA9PiAoY29sdW1uIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbikudW5pdCA9PT0gb0NvbHVtbkV4cG9ydC5wcm9wZXJ0eSk7XG5cdFx0XHRcdFx0Ly8gQ3JlYXRlIEV4cG9ydGluZyBsYWJlbHMgYXJyYXlcblx0XHRcdFx0XHRjb25zdCBGaWVsZEdyb3VwTGFiZWwgPSBUYWJsZUFQSS5fZ2V0RmllbGRHcm91cEV4cG9ydExhYmVsKG9Db2x1bW5FeHBvcnQsIG9Db2x1bW4sIG9UYWJsZUNvbnRyb2xsZXIpO1xuXHRcdFx0XHRcdGlmIChGaWVsZEdyb3VwTGFiZWwpIHtcblx0XHRcdFx0XHRcdGFFeHBvcnRMYWJlbHMudW5zaGlmdChGaWVsZEdyb3VwTGFiZWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBGb3IgYSB0ZXh0IGFubm90YXRpb24sIGV4cG9ydCBsYWJlbCB0ZW1wbGF0ZSB1c2VkIGlzIDx2YWx1ZT4gLSA8ZGVzY3JpcHRpb24+IGFuZCBmb3IgYSBEYXRhUG9pbnQgPGRhdGFwb2ludFZhbHVlPiAtIDxUYXJnZXRWYWx1ZT4uXG5cdFx0XHRcdFx0Ly8gSW4gYm90aCBjYXNlcyBpbnRlcm5hdGlvbmFsaXphdGlvbiBpcyBuZWVkZWRcblx0XHRcdFx0XHRjb25zdCBkYXRhRmllbGREZXNjcmlwdGlvbkxhYmVsID0gVGFibGVBUEkuX2dldERhdGFGaWVsZERlc2NyaXB0aW9uTGFiZWwoXG5cdFx0XHRcdFx0XHRvQ29sdW1uRXhwb3J0LFxuXHRcdFx0XHRcdFx0b0NvbHVtbixcblx0XHRcdFx0XHRcdG9UYWJsZUNvbnRyb2xsZXIsXG5cdFx0XHRcdFx0XHRpc1VuaXRcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmIChkYXRhRmllbGREZXNjcmlwdGlvbkxhYmVsKSB7XG5cdFx0XHRcdFx0XHRhRXhwb3J0TGFiZWxzLnVuc2hpZnQoZGF0YUZpZWxkRGVzY3JpcHRpb25MYWJlbCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly9BZGQgVGFyZ2V0VmFsdWUgb24gZHVtbXkgY3JlYXRlZCBwcm9wZXJ0eSB3aGVuICBleHBvcnRpbmcgb24gc3BsaXQgbW9kZVxuXHRcdFx0XHRcdGlmIChvQ29sdW1uLmlzRGF0YVBvaW50RmFrZVRhcmdldFByb3BlcnR5ICYmIG9Db2x1bW4ucmVsYXRpdmVQYXRoID09PSBvQ29sdW1uRXhwb3J0LnByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRvQ29sdW1uRXhwb3J0LnByb3BlcnR5ID0gW29Db2x1bW5FeHBvcnQucHJvcGVydHldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvL01vZGlmeSBleHBvcnRlZCB2YWx1ZSB3aGVuIHVzaW5nIENvbW11bmljYXRpb24uQ29udGFjdCBkYXRhRmllbGRGb3JBbm5vdGF0aW9uXG5cdFx0XHRcdC8vY29udGFjdD5mbiBwcm9wZXJ0eSBzaG91bGQgYmUgZXhwb3J0ZWRcblx0XHRcdFx0aWYgKG9Db2x1bW4uZXhwb3J0Q29udGFjdFByb3BlcnR5ICYmIGNvbHVtbi5wcm9wZXJ0eUluZm9zKSB7XG5cdFx0XHRcdFx0aWYgKGNvbHVtbi5wcm9wZXJ0eUluZm9zPy5sZW5ndGggPT09IDEgJiYgY29sdW1uLnByb3BlcnR5SW5mb3M/LnRvU3RyaW5nKCkgPT09IG9Db2x1bW5FeHBvcnQucHJvcGVydHkudG9TdHJpbmcoKSkge1xuXHRcdFx0XHRcdFx0b0NvbHVtbkV4cG9ydC5wcm9wZXJ0eSA9IG9Db2x1bW4uZXhwb3J0Q29udGFjdFByb3BlcnR5O1xuXHRcdFx0XHRcdFx0b0NvbHVtbkV4cG9ydC5sYWJlbCA9IG9Db2x1bW4ubGFiZWw7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0XHRcdGNvbHVtbi5wcm9wZXJ0eUluZm9zPy5sZW5ndGggPiAxICYmXG5cdFx0XHRcdFx0XHRvQ29sdW1uLnByb3BlcnR5SW5mb3M/LnNvbWUocHJvcCA9PiBvQ29sdW1uRXhwb3J0LnByb3BlcnR5LmluY2x1ZGVzKHByb3ApKSAmJlxuXHRcdFx0XHRcdFx0QXJyYXkuaXNBcnJheShvQ29sdW1uRXhwb3J0LnByb3BlcnR5KVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0b0NvbHVtbkV4cG9ydC5wcm9wZXJ0eSA9IG9Db2x1bW5FeHBvcnQucHJvcGVydHk/Lm1hcCgocHJvcGVydHk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0NvbHVtbi5wcm9wZXJ0eUluZm9zPy5zb21lKHByb3AgPT4gcHJvcCA9PT0gcHJvcGVydHkpID8gb0NvbHVtbi5leHBvcnRDb250YWN0UHJvcGVydHkgOiBwcm9wZXJ0eTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRhRXhwb3J0TGFiZWxzLnB1c2goRGVsZWdhdGVVdGlsLmdldExvY2FsaXplZFRleHQob0NvbHVtbkV4cG9ydC5sYWJlbCwgb1RhYmxlQ29udHJvbGxlcikpO1xuXHRcdFx0aWYgKGFFeHBvcnRMYWJlbHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlIGxhYmVscyAoZS5nLiBGaWVsZEdyb3VwIGxhYmVsIGlzIHRoZSBzYW1lIGFzIHRoZSBsYWJlbCBvZiBvbmUgb2YgdGhlIHByb3BlcnRpZXMpXG5cdFx0XHRcdGFFeHBvcnRMYWJlbHMgPSBhRXhwb3J0TGFiZWxzLmZpbHRlcihmdW5jdGlvbihsYWJlbCwgaW5kZXgpIHtcblx0XHRcdFx0XHRpZiAoYUV4cG9ydExhYmVscy5pbmRleE9mKGxhYmVsKSA9PSBpbmRleCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBDaGVjayBpZiBhIFJUTCBsYW5ndWFnZSBpZiB1c2VkIGFuZCBpZiBzbyB3ZSBuZWVkIHRvIHJldmVyc2UgbGFiZWxzXG5cdFx0XHRpZiAoaXNSTFRMYW5ndWFnZSkge1xuXHRcdFx0XHRhRXhwb3J0TGFiZWxzLnJldmVyc2UoKTtcblx0XHRcdH1cblx0XHRcdG9Db2x1bW5FeHBvcnQubGFiZWwgPSBhRXhwb3J0TGFiZWxzLmpvaW4oXCIgLSBcIik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9FeHBvcnRDb2x1bW5zO1xuXHR9XG5cblx0c3RhdGljIF9nZXRGaWVsZEdyb3VwRXhwb3J0TGFiZWwob0NvbHVtbkV4cG9ydDogYW55LCBvQ29sdW1uOiBBbm5vdGF0aW9uVGFibGVDb2x1bW4sIG9UYWJsZUNvbnRyb2xsZXI6IFBhZ2VDb250cm9sbGVyKSB7XG5cdFx0aWYgKFxuXHRcdFx0KG9Db2x1bW5FeHBvcnQuY29sdW1uSWQuaW5kZXhPZihcIjo6RmllbGRHcm91cDo6XCIpICE9PSAtMSB8fFxuXHRcdFx0XHQob0NvbHVtbi5leHBvcnRTZXR0aW5ncz8uZmllbGRMYWJlbCAmJiBvQ29sdW1uRXhwb3J0LmNvbHVtbklkLmluZGV4T2YoXCJfX2NvbHVtblwiKSAhPT0gLTEpKSAmJlxuXHRcdFx0KG9Db2x1bW4ucHJvcGVydHlJbmZvcz8uaW5jbHVkZXMob0NvbHVtbkV4cG9ydC5wcm9wZXJ0eSkgfHxcblx0XHRcdFx0b0NvbHVtbi5wcm9wZXJ0eUluZm9zPy5pbmNsdWRlcyhcIlByb3BlcnR5OjpcIiArIG9Db2x1bW5FeHBvcnQucHJvcGVydHkpKVxuXHRcdCkge1xuXHRcdFx0Y29uc3QgbGFiZWwgPSBvQ29sdW1uLmV4cG9ydFNldHRpbmdzPy5maWVsZExhYmVsIHx8IG9Db2x1bW4ubGFiZWw7XG5cdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLmdldExvY2FsaXplZFRleHQobGFiZWwgYXMgc3RyaW5nLCBvVGFibGVDb250cm9sbGVyKTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgX2dldERhdGFGaWVsZERlc2NyaXB0aW9uTGFiZWwoXG5cdFx0b0NvbHVtbkV4cG9ydDogYW55LFxuXHRcdG9Db2x1bW46IEFubm90YXRpb25UYWJsZUNvbHVtbixcblx0XHRvVGFibGVDb250cm9sbGVyOiBQYWdlQ29udHJvbGxlcixcblx0XHRpc1VuaXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0aWYgKFxuXHRcdFx0b0NvbHVtbi5wcm9wZXJ0eUluZm9zICYmXG5cdFx0XHRvQ29sdW1uLnByb3BlcnR5SW5mb3M/Lmxlbmd0aCA+IDEgJiZcblx0XHRcdCFpc1VuaXQgJiZcblx0XHRcdChvQ29sdW1uLnByb3BlcnR5SW5mb3M/LmluY2x1ZGVzKG9Db2x1bW5FeHBvcnQucHJvcGVydHkpIHx8XG5cdFx0XHRcdG9Db2x1bW4ucHJvcGVydHlJbmZvcz8uaW5jbHVkZXMoXCJQcm9wZXJ0eTo6XCIgKyBvQ29sdW1uRXhwb3J0LnByb3BlcnR5KSkgJiZcblx0XHRcdG9Db2x1bW4ucmVsYXRpdmVQYXRoPy5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIikgPT09IC0xXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLmdldExvY2FsaXplZFRleHQob0NvbHVtbi5sYWJlbCBhcyBzdHJpbmcsIG9UYWJsZUNvbnRyb2xsZXIpO1xuXHRcdH1cblx0fVxuXHRARXZlbnRIYW5kbGVyXG5cdG9uTWFzc0VkaXRCdXR0b25QcmVzc2VkKG9FdmVudDogVUk1RXZlbnQsIFBhZ2VDb250cm9sbGVyOiBQYWdlQ29udHJvbGxlcikge1xuXHRcdGNvbnN0IG9UYWJsZSA9IHRoaXMuY29udGVudDtcblx0XHRNYXNzRWRpdEhhbmRsZXIub3Blbk1hc3NFZGl0RGlhbG9nKG9UYWJsZSwgUGFnZUNvbnRyb2xsZXIpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlQVBJO1xuIl19