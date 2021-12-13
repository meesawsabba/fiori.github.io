/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/dsh/utils/ResourceBundle",
  [
    "sap/zen/dsh/utils/ResourceModel"
  ],
  function (ResourceModel) {
    "use strict";
    var resourceBundle = ResourceModel.getResourceBundle();
    resourceBundle.getTextWithPlaceholder = function (text, placeholder){
      return resourceBundle.getText(text, placeholder);
    };
    return resourceBundle;
  }
);
