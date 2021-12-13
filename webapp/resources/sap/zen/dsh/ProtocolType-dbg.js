
/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/ProtocolType",
  [
  ],
  function(){
    /**
     *  Protocol Type
     *
     * @enum {string}
     * @alias sap.zen.dsh.ProtocolType
     * @public
     */
    var ProtocolType = {
      /**
       * HTTP
       * @public
       **/
      HTTP: "HTTP",
      /**
       * HTTPS
       * @public
       **/
      HTTPS: "HTTPS",
      /**
       * WASABI
       * @public
       **/
      WASABI: "WASABI"
      
      
    };
    return ProtocolType;
  }
);