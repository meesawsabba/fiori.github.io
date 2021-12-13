/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/firefly/ff0210.io.native"],function(f){"use strict";f.IoExtModule=function(){};f.IoExtModule.prototype=new f.DfModule();f.IoExtModule.prototype._ff_c="IoExtModule";f.IoExtModule.s_module=null;f.IoExtModule.getInstance=function(){if(f.isNull(f.IoExtModule.s_module)){f.DfModule.checkInitialized(f.IoNativeModule.getInstance());f.IoExtModule.s_module=f.DfModule.startExt(new f.IoExtModule());f.DfModule.stopExt(f.IoExtModule.s_module);}return f.IoExtModule.s_module;};f.IoExtModule.prototype.getName=function(){return"ff0230.io.ext";};f.IoExtModule.getInstance();return sap.firefly;});
