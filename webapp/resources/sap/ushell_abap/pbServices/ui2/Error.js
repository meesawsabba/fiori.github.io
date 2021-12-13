// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log"],function(L){"use strict";var S=function(m,c,l){var e=new Error(m);l=l===undefined?true:l;e.name="Error";if(l===true){L.error(m,null,c);}return e;};return S;},true);
