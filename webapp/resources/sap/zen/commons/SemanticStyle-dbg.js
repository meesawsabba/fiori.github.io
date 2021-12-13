/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/SemanticStyle",
  [
    "sap/zen/commons/thirdparty/lodash",
    "sap/ui/core/Element",
    "sap/zen/commons/library"
  ],
  function (
    _, Element
  ) {
    "use strict";
    /** Creates and initializes a new Semantic Style.
     * settings.
     * @public
     *
     * @class Semantic Style of a Grid.
     * @extends sap.ui.core.Element
     * @param {string} [sId] ID for the new element, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new element
     * @abstract
     * @author SAP SE
     * @experimental since 1.89
     * @version 1.96.0
     * @alias sap.zen.commons.SemanticStyle
     * @since 1.89
     */
    var oSemanticStyle = Element.extend(
      "sap.zen.commons.SemanticStyle", {
        metadata: {
          library: "sap.zen.commons",
          properties: {
            /**
             * The semantic class 
             */
            semanticClass: {
              type: "string"
            },
             /**
             * The associated css class 
             */
            cssClass: {
              type: "string"
            }
          }
        }
      }
    );
    return oSemanticStyle;
  }
);
