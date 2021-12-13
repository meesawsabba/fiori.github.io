/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/DisplayType",
  [
  ],
  function(){
    /**
     * Display Type of a Dimension Member
     *
     * @enum {string}
     * @alias sap.zen.dsh.DisplayType
     * @public
     */
    var DisplayType = {
      /**
       * Display the key of the member
       * @public
       **/
      Key: "Key",
      /**
       * Display the (possible language dependant) text of the member
       * @public
       **/
      Text: "Text",
      /**
       * Display the key and then the text of the member
       * @public
       **/
      KeyText: "KeyText",
      /**
       * Display the text and then the key of the member
       * @public
       **/
      TextKey: "TextKey",
      /**
       * Do not display the member
       * @public
       **/
      None: "None"
    };
    return DisplayType;
  }
);
