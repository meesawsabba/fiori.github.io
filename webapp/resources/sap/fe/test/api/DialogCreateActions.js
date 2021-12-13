/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./DialogActions","sap/fe/test/Utils","sap/ui/test/OpaBuilder"],function(D,U,O){"use strict";var a=function(d,v){return D.call(this,d,v,1);};a.prototype=Object.create(D.prototype);a.prototype.constructor=a;a.prototype.isAction=true;a.prototype.iExecuteCreate=function(){return this.prepareResult(this.getBuilder().doPressFooterButton(O.Matchers.resourceBundle("text","sap.fe.core","C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON")).description(U.formatMessage("Pressing create button on dialog '{0}'",this.getIdentifier())).execute());};return a;});
