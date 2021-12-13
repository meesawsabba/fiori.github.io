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
    "sap/m/IconTabBar"
  ],
  function(jQuery, _, BaseHandler, IconTabBar ) {
    "use strict";
    var TabStripHandler = function() {
      BaseHandler.apply(this, arguments);
      var that = this;
      this.update = function(oControl, oControlProperties) {
        if (oControlProperties) {
          init(oControl, oControlProperties);
        }
        return oControl;
      };
      var wrapFunctions = function(oControl){
        if(BaseHandler.dispatcher.isMainMode()){
          oControl.getSelectedIndex = function(){
            var aItems = this.getItems();
            for ( var i = 0; i < aItems.length; i++) {
              if(aItems[i].getId() === this.getSelectedKey()){
                return i;
              }
            }
            return 0;
          };

          oControl.setSelectedIndex = function(iTabindex){
            var aItems = this.getItems();
            this.setSelectedKey(aItems[iTabindex].getId());
          };
        }
      };

      this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, iIndex) {
        var id = oControlProperties["id"];

        var oControl = this.createDefaultProxy(id);
        wrapFunctions(oControl);
        if(BaseHandler.dispatcher.isMainMode()){
          oControl.setExpandable(false);
        }
        oControl.orgOnAfterRendering = oControl.onAfterRendering;
        oControl.onAfterRendering = setTabStyles;
        fAppendToParentFunclet(oControl, iIndex, oComponentProperties);
        init(oControl, oControlProperties);
        BaseHandler.dispatcher.updateComponentProperties(oControl, oComponentProperties, fAppendToParentFunclet);
        return oControl;
      };
      function setTabStyles() {
        var oTabStrip = this, divTag;
        if(this.orgOnAfterRendering){
          this.orgOnAfterRendering();
        }
        var jqTabStrip = oTabStrip.$();
        if (oTabStrip.tablocation === "TOP") {
          divTag = jQuery("div.sapUiTabBar:first", jqTabStrip);
          divTag.removeClass("sapUiTabBarHidden");
          divTag.removeClass("sapUiTabBarBottom");
          divTag.addClass("sapUiTabBar");

          divTag = jQuery("div.sapUiTabPanel:first", jqTabStrip);
          divTag.removeClass("sapUiTabPanelHidden");
          divTag.removeClass("sapUiTabPanelBottom");
          divTag.addClass("sapUiTabPanel");
        } else if (oTabStrip.tablocation === "BOTTOM") {
          divTag = jQuery("div.sapUiTabBar:first", jqTabStrip);
          divTag.removeClass("sapUiTabBar");
          divTag.removeClass("sapUiTabBarHidden");
          divTag.addClass("sapUiTabBarBottom");

          divTag = jQuery("div.sapUiTabPanel:first", jqTabStrip);
          divTag.removeClass("sapUiTabPanel");
          divTag.removeClass("sapUiTabPanelHidden");
          divTag.addClass("sapUiTabPanelBottom");
        } else if (oTabStrip.tablocation === "HIDDEN") {
          var oDivTag = jqTabStrip;
          oDivTag.css("border-style", "none");
          divTag = oDivTag.find("div.sapUiTabBar:first");
          divTag.removeClass("sapUiTabBar");
          divTag.removeClass("sapUiTabBarBottom");
          divTag.addClass("sapUiTabBarHidden");

          divTag = jQuery("div.sapUiTabPanel:first", jqTabStrip);
          divTag.removeClass("sapUiTabPanel");
          divTag.removeClass("sapUiTabPanelBottom");
          divTag.addClass("sapUiTabPanelHidden");
        }
      }

      function init(oTabStrip, oControlProperties) {
        if (oControlProperties) {
          var aChildren = oControlProperties.content;

          if (aChildren) {

            that.updateChildren(aChildren, oTabStrip, function(oTab, i) {
              oTabStrip.insertTab(oTab, i);
            }, function(oTabToDelete){
              oTabStrip.removeTab(oTabToDelete);
            });

          }

          if(oTabStrip.zenfs){
            oTabStrip.detachSelect(oTabStrip.zenfs);
          }

          var selectedtabindex = oControlProperties.selectedtabindex;
          if (selectedtabindex != null && oTabStrip.getSelectedIndex() !== selectedtabindex) {
            oTabStrip.setSelectedIndex(selectedtabindex);
          }

          if (oControlProperties.command) {
            var f = function() {
              var index =  this.getSelectedIndex();
              if (index !== selectedtabindex) {
                var command = that.prepareCommand(oControlProperties.command,"__KEY__", index);
                eval(command);
              }
            };
            oTabStrip.zenfs = f;
            oTabStrip.attachSelect(f);
          }
        }
        oTabStrip.tablocation = oControlProperties.tablocation;
      }

      this.applyForChildren = function(oTabStrip, fFunclet) {
        var tabs = oTabStrip.getTabs();
        for ( var i = 0; i < tabs.length; i++) {
          var oTab = tabs[i];
          fFunclet(oTab);
        }
      };

      this.getDefaultProxyClass = function(){
        return ["sap.zen.ZenIconTabBar", "sap.ui.commons.TabStrip"];
      };

      this.provideFunctionMapping = function(){
        return [["getItems","getTabs"],["insertItem","insertTab"], ["removeItem","removeTab"]];
      };

      this.getDecorator = function() {
        return "TabStripDecorator";
      };


      this.getType = function() {
        return "tabstrip";
      };

    };
    var instance = new TabStripHandler();
    BaseHandler.dispatcher.addHandlers(
      instance.getType(),
      instance
    );
    sap.zen.TabHandler = function() {
      BaseHandler.apply(this, arguments);
      var that = this;
      this.createAndAdd = function(oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, oArgForFunclet) {
        var oControl = this.createDefaultProxy();
        if (sap.zen.designmode) {
          oControl.setEnabled = function(bEnable) {
            // As on initial rendering the DOM element is not available, we attach the enable state to the phx control.
            // Later in designmode (TabDecorator), we pick the value and reapply it.
            oControl.designmodeEnabled = bEnable;
            if (bEnable) {
              this.$().removeClass("sapUiTabDsbl");
            } else {
              this.$().addClass("sapUiTabDsbl");
            }
          };

          oControl.getEnabled = function () {
            return true;
          };

        }
        if(BaseHandler.dispatcher.isMainMode()){
          oControl.setText(oControlProperties.caption);
        }else{
          var oTitle = new sap.ui.commons.Title();
          oTitle.setText(oControlProperties.caption);
          oControl.setTitle(oTitle);
        }
        oControl.setEnabled(oControlProperties.enabled);

        var oAbsLayout = this.createAbsoluteLayout();
        fAppendToParentFunclet(oControl, oArgForFunclet);
        oControl.addContent(oAbsLayout);

        init(oControl, oControlProperties);

        return oControl;
      };

      this.updateComponent = function(oControl, oControlProperties) {
        if (oControlProperties) {
          init(oControl, oControlProperties);
        }
        return oControl;
      };

      function init(oControl, oControlProperties) {
        if (oControlProperties) {
          var oldCaption;
          var oAbsLayout = oControl.getContent()[0];
          var caption= oControlProperties.caption;
          if(BaseHandler.dispatcher.isMainMode()){
            if(caption!=null){
              oldCaption= oControl.getText();
              if(oldCaption !== caption){
                oControl.setText(caption);
              }
            }
          }else{
            var oTitle = oControl.getTitle();
            if(caption!=null){
              oldCaption= oTitle.getText();
              if(oldCaption !== caption){
                oTitle.setText(caption);
              }
            }
          }

          var enabled= oControlProperties.enabled;
          if(enabled != null){
            var oldEnabled= oControl.getEnabled();
            if(sap.zen.designmode || oldEnabled !== enabled){
              oControl.setEnabled(enabled);
            }
          }

          var aChildren = oControlProperties.content;

          if (aChildren) {
            that.updateChildren(
              aChildren, oControl,
              function(oNewControl, iIndex, componentData) {
                // workaround: set width & height here
                //otherwise absolute layout container will be rendered twice
                if(componentData){
                  var args = BaseHandler.dispatcher.createAbsoluteLayoutInfo(componentData);
                  var width = BaseHandler.dispatcher.calcWidthUseOrderOfPriority(args.left, args.right, componentData.width);
                  var height = BaseHandler.dispatcher.calcHeightUseOrderOfPriority(args.top, args.bottom, componentData.height);
                  BaseHandler.dispatcher.setWidthHeight(oNewControl, width, height);
                }
                BaseHandler.dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
              },
              function(oControlToDelete){
                oAbsLayout.removeContent(oControlToDelete);
              }
            );
          }
        }
      }
      this.applyForChildren = function(oTab, fFunclet) {
        var absLayout = oTab.getContent()[0];
        var children = absLayout.getContent();
        for ( var i = 0; i < children.length; i++) {
          var oControl = children[i];
          if (oControl) {
            fFunclet(oControl);
          }
        }
      };
      this.getDefaultProxyClass = function(){
        return ["sap.m.IconTabFilter", "sap.ui.commons.Tab"];
      };
      this.getType = function(){
        return "tab";
      };
    };
    instance = new sap.zen.TabHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance, "TabDecorator");
    if(BaseHandler.dispatcher.isMainMode()){
      IconTabBar.extend(
        "sap.zen.ZenIconTabBar",
        {
          // the control API:
          metadata : {
            properties : {
              width : "sap.ui.core.CSSSize",
              height : "sap.ui.core.CSSSize"
            }
          },
          renderer : {},
          getStretchContentHeight : function(){
            return true;
          },
          // an event handler:
          onAfterRendering : function(evt) { // is called when the Control's area is
            // clicked - no event registration
            // required
            if (IconTabBar.prototype.onAfterRendering) {
              IconTabBar.prototype.onAfterRendering.apply(this, [ evt ]);
            }
            var height = this.getHeight();
            var jqThis = this.$();
            if (height !== "auto") {
              // set height
              jqThis.height(height);
            }
            var width = this.getWidth();
            if (width !== "auto") {
              // set height
              jqThis.width(width);
            }
            jqThis.css("position","relative");
          }
        }
      );
    }
  }
);
