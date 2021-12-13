sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend", "sap/suite/ui/generic/template/genericUtilities/controlHelper", 
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SmartTableWrapper",
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SmartChartWrapper", 
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/DynamicPageWrapper",
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SmartVariantManagementWrapper",
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/ObjectPageLayoutWrapper", 
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SearchFieldWrapper"], 
		function(BaseObject, extend, controlHelper, SmartTableWrapper, SmartChartWrapper, DynamicPageWrapper, SmartVariantManagementWrapper, ObjectPageLayoutWrapper, SearchFieldWrapper) {
	"use strict";
	/**
	 * Dummy wrapper for not existing or not (yet) supported controls (either not carrying a state or to be added in future). Also used as interface description for wrapper classes.
	 */
	var oDummyWrapper = {
		/**
		 * Retrieve the current state of the control
		 * 
		 * @return {object} serializable json object describing the current state of the control. Will be provided to setState exactly the same when restoring the state. Note: Structure of this object
		 *         is up to the wrapper, no one outside will rely on it - with one exception: legacyStateHandler translates legacy states (without clear separation per control) to this format. Open:
		 *         Should legacyStateHandler be responsible for providing most current version, or only first control specific version (i.e. first version using wrapper), and wrapper should be
		 *         responsible for any further adoption is needed?
		 */
		getState : Function.prototype,
		/**
		 * Restore the control to the given state
		 * 
		 * @param {object} oState json object describing the state as provided by getState. Note: can also be undefined, if an old state is restored (from a release where the state of this control was
		 *           not stored), if a state is provided in the URL that cannot be read (anymore), or on OP in discovery mode, if the user navigates to a new object instance - in these cases, the
		 *           control has to be brought (back) into its initial state. Currently, expectation is the state to be restored synchronously. Planned:
		 * @return {Promise} A <code>promise</code> to indicate asynchronous completion of restoring state, must not be rejected or staying pending forever, if no promise is returned, synchronous
		 *         completion is assumed.
		 */
		setState : Function.prototype,
		/**
		 * wrapper must provide an event to indicate a state change. Must be called whenever a user interacts with the control to change its state, but not when state is changed programmatically (e.g.
		 * from setState, or when user interacts with a different control causing also this one to change (in that case, the event from the other control should be called) Function to register for that
		 * event
		 * 
		 * @param {function} fnHandler event handler function being attached
		 */
		attachStateChanged : Function.prototype,
		/**
		 * Function to deregister from event. Currently not used, but should be provided for symmetry reasons.
		 * 
		 * @param {function} fnHandler event handler function being attached. Should only be deregistered, if provided exactly like in registration
		 */
		detachStateChanged : Function.prototype,
		/**
		 * function added to all real wrappers for convenience by factory to get local id of corresponding control
		 */
		getLocalId: Function.prototype
	};

	function getMethods(oController) {

		// map of all wrappers (for the given controller) identified by (local) id
		var mWrappers = {};
		
		function getLocalId(oControl){
			return oController.getView().getLocalId(oControl.getId());
		}

		return {
			/**
			 * Factory funtion to generate control wrapper object based on control type
			 * 
			 * @param {sap.ui.core.control} oControl - control a wrapper should be provided for
			 * @param {object} [mParams] - map with any additional parameters passed to constructor of wrapper
			 * @return {object} wrapper object for the control
			 */
			getControlStateWrapper: function(oControl, mParams) {
				// checking for control here (instead of at all callers) allows simple use for optional controls
				// (i.e. controls only created depending on settings, but carrying a state if existent, e.g. SmartTable without tabkey on listReport, which is not created in multipleViews case)
				if (!oControl) {
					// no need to add the dummy to the map
					return oDummyWrapper;
				}
				var sId = getLocalId(oControl);
				if (!mWrappers[sId]) {
					var oWrapper;
					switch (true) {
					case controlHelper.isSmartTable(oControl):
						oWrapper = new SmartTableWrapper(oControl);
						break;
					case controlHelper.isSmartChart(oControl):
						oWrapper = new SmartChartWrapper(oControl);
						break;
					case controlHelper.isDynamicPage(oControl):
						oWrapper = new DynamicPageWrapper(oControl);
						break;
					case controlHelper.isSmartVariantManagement(oControl):
						oWrapper = new SmartVariantManagementWrapper(oControl, mParams);
						break;
					case controlHelper.isObjectObjectPageLayout(oControl):
						oWrapper = new ObjectPageLayoutWrapper(oControl);
						break;
					case controlHelper.isSearchField(oControl):
						oWrapper = new SearchFieldWrapper(oControl);
					break;
					default:
						// control not carrying a state or no wrapper build yet
						return oDummyWrapper;
					}
					oWrapper.getLocalId = getLocalId.bind(null, oControl);
					mWrappers[sId] = oWrapper;
				}
				return mWrappers[sId];
			}
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.genericUtilities.ControlStateWrapperFactory", {
		constructor : function(oController) {
			extend(this, getMethods(oController));
		}
	});

});
