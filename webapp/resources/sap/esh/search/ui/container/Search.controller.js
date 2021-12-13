/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchModel"],function(){"use strict";return sap.ui.controller("sap.esh.search.ui.container.Search",{onExit:function(){var t=this;var m=t.getView().getModel();m.unsubscribe("ESHSearchStarted",t.getView().onAllSearchStarted,t.getView());m.unsubscribe("ESHSearchFinished",t.getView().onAllSearchFinished,t.getView());},});});
