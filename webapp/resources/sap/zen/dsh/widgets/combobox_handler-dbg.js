/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/m/ComboBox",
    "sap/ui/core/Item"
  ],
  function(jQuery, _, BaseHandler, ComboBox, Item) {
    "use strict";
    var ComboBoxHandler = function() {
      BaseHandler.apply(this, arguments);
      var that = this;
      this.create = function (oChainedControl, oControlProperties) {
        var oComboBox = new ComboBox(
          oControlProperties.id,
          {
            selectionChange: function(evtObject){
              var key = null;
              var oItem = evtObject.getParameter("selectedItem");
              if(oItem){
                key = oItem.getKey();
                key += "|SeP|";
              }
              if (key !== null) {
                var command = that.prepareCommand(oControlProperties.command,"__KEYS__", key);
                eval(command);
              }
            },
            change: function(changeObj){
              var value = changeObj.mParameters.newValue;
              var command = that.prepareCommand(oControlProperties.enteredTextCommand,"__VALUE__", value);
              eval(command);
            }
          }
        );

        if(oControlProperties && oControlProperties.items) {
          var i;
          var itemArray = oControlProperties.items;
          var selectionArray = oControlProperties.selectedItems;
          for(i = 0; i < itemArray.length; i++) {
            var item = new Item(
              oControlProperties.id+"_item_"+i,
              {
                text:itemArray[i].item.val_0 === "" ? itemArray[i].item.key:itemArray[i].item.val_0,
                key:itemArray[i].item.key
              }
            );
            oComboBox.addItem(item);
          }
          for(i = 0; i < selectionArray.length; i++) {
            if(oComboBox.getItemByKey(selectionArray[i].key._v)) {
              oComboBox.setSelectedItem(oComboBox.getItemByKey(selectionArray[i].key._v));
            }
          }
        }
        return oComboBox;
      };
      this.update = function(oControl, oControlProperties) {
        if(oControlProperties &&oControlProperties.items) {
          oControl.destroyItems();
          oControl.removeAllItems();
          oControl.removeAllAggregation();
          var i;
          var itemArray = oControlProperties.items;
          var selectionArray = oControlProperties.selectedItems;
          for(i = 0; i < itemArray.length; i++) {
            var item = new Item(
              oControlProperties.id+"_item_"+i,
              {
                text:itemArray[i].item.val_0,
                key:itemArray[i].item.key
              }
            );
            oControl.addItem(item);
          }
          for(i = 0; i < selectionArray.length; i++) {
            if(oControl.getItemByKey(selectionArray[i].key._v)) {
              oControl.setSelectedItem(oControl.getItemByKey(selectionArray[i].key._v));
            }
          }
        }
      };
      this.getType = function() {
        return "combobox";
      };
    };
    var instance = new ComboBoxHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
