sap.ui.define([], function() {
	"use strict";

	/**
	 * Constructor for SmartVariantManagementWrapper
	 * @param {sap.ui.comp.smartvariants.SmartVariantManagement} oSmartVariantManagement - The SmartVariantManagement control this wrapper is for 
	 * @param {object} mParams 
	 * @param {sap.ui.comp.smartfilterbar.SmartFilterBar} mParams.oSFB - The SmartFilterBar the SmartVariantManagemetn is connected to
	 * @param {function} mParams.restoreSFBState - callback function to restore the state of the SmartFilterBar (or all controls the SmartVariantManagement should control)
	 * @returns
	 */
	function SmartVariantManagementWrapper(oSmartVariantManagement, mParams) {
		// Returns the state of the variant management itself
		// i.e. which variant is selected and whether it's dirty (not to be confused with the state
		// of the control(s) managed by the variant (like SFB, SmartTable)!)
		function getState() {
			return {
				variantId : oSmartVariantManagement.getCurrentVariantId(),
				modified : oSmartVariantManagement.currentVariantGetModified()
			};
		}

		function setState(oState) {
			if (!oState) {
				// if no state is provided (probably only if appStaeKey in the URL that cannot be read), set default variant, not modified
				// TODO: Clarify, whether this is needed (or we can rely on VM to do the same)
				oSmartVariantManagement.setCurrentVariantId(oSmartVariantManagement.getDefaultVariantId());
				oSmartVariantManagement.currentVariantSetModified(false);
				return;
			}
			// TODO: When restoring the variant is sufficient (i.e. it was not modified, and is also (still) known), we should not additionally restore the state of the SFB
			// Here, this question is answered, but we have no means to make use of it - think of how to transport it to the place needed.
			// ideas:
			// - extend stateWrapperFactory to pass (an array of) dependent controls (or wrappers). Their (here SFB) state could be put as part of state of surrounding (principal) wrapper
			// - more generic allow any additional parameters for wrapper constructor
			// old logic seems to be: first restore SFB state (regardless whether it's needed or not), then set variant (if not dirty)
			if (oState.modified) {
				// Special logic according to UX: If variant was modified anyway, there's no benefit for the user to see the name (but it could be confusing),
				// so standard variant should be set (which is achieved by empty string)
				oSmartVariantManagement.setCurrentVariantId("");
				oSmartVariantManagement.currentVariantSetModified(true);
//				mParams.restoreSFBState(); TODO: Can't work like this, as the state is not known when the wrapper is created. But this has to happen after setting the variantId!
			} else {
				oSmartVariantManagement.setCurrentVariantId(oState.variantId);
				// If variant is not known (could be private and URL was shared, or could be deleted after page was bookmarked), standard variant is set. In this case, it should be
				// marked as modified, and SFB data should be restored diretlfrom state - in case variant was successfully set, it should be marked as not modified
				if (oState.variantId === oSmartVariantManagement.getCurrentVariantId()){
					oSmartVariantManagement.currentVariantSetModified(false);
				} else {
					oSmartVariantManagement.currentVariantSetModified(true);
//					mParams.restoreSFBState();
				}
			}
		}

		function attachStateChanged(fnHandler) {
			// state of variant management itself can be changed directly (user selects a different variant or stores current state as (new) variant), or indirectly (user changes some
			// data of a control managed by VM, e.g. some filter values in SFB)
			// the latter case anyways also is a state change, so we can rely on the managed controls to provide the event
			// here, we only care for the former cases
			// unfortunately, the corresponding events (afterVariantLoad and afterVariantSave) is not provided by the SmartVariantManagement, but by the SFB instead!
			// TODO: Find cleaner solution to provide SFB (see also comment in setState)
//			var oController = oSmartVariantManagement.getParent().getParent().getParent().getController();
//			var oSFB = oController.byId("listReportFilter");
			mParams.oSFB.attachAfterVariantLoad(function(oEvent) {
				// event is fired whenever SFB needs to load a variant, which can happen in different situations. These can be differentiated by parameter context - here we are only interested
				// when user loads a different variant, in this case the context is undefined.
				// Note: This only takes care of triggering stateChange, not actually loading data or any followUp, in case the user has selected a variant that is marked as executeOnSelect
				// TODO: clarify, whether we need to take care of the same
				var sContext = oEvent.getParameter("context");
				if (!sContext) {
					fnHandler();
				}
			});
			// when user saves current state as a new variant, this is also a state change (as the variant id is part of the state)
			mParams.oSFB.attachAfterVariantSave(fnHandler);
		}

		return {
			getState : getState,
			setState : setState,
			attachStateChanged : attachStateChanged
		};
	}

	return SmartVariantManagementWrapper;
});