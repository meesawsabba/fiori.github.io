import { ControllerExtension } from "sap/ui/core/mvc";
import { Binding, Context } from "sap/ui/model";
import { CheckBox } from "sap/m";
import { ControllerExtensionMetadata } from "sap/fe/core/controllerextensions";
import { UI5Class, Override, Public, Final, Private } from "../helpers/ClassSupport";
import { AppComponent, CommonUtils } from "sap/fe/core";
import { Control } from "sap/ui/core";
import {
	SideEffectsType,
	ControlSideEffectsType,
	ODataSideEffectsType,
	ControlSideEffectsEntityDictionary
} from "sap/fe/core/services/SideEffectsServiceFactory";
import { FieldRuntime } from "sap/fe/macros/field";
import { ConverterOutput, PropertyPath, EntityType } from "@sap-ux/vocabularies-types";
import { Log } from "sap/base";

type FieldControl = Control & {
	getFieldHelp(): string;
	getFieldGroupIds(): string[];
};

type FieldEventPropertyType = {
	promise: Promise<any>;
	field: FieldControl;
	sideEffectsMap: FieldSideEffectDictionary;
};

type FieldSideEffectPropertyType = {
	name: string;
	immediate?: boolean;
	context: Context<any>;
	sideEffects: SideEffectsType;
	previouslyFailed?: boolean;
};

type FieldSideEffectDictionary = Record<string, FieldSideEffectPropertyType>;

type FailedSideEffectDictionary = Record<string, SideEffectsType[]>;

type FieldGroupSideEffectType = {
	promises: Promise<any>[];
	sideEffectProperty: FieldSideEffectPropertyType;
	processStarted?: boolean;
};

type FieldGroupQueueMapType = {
	[sideEffectName: string]: {
		[contextPath: string]: FieldGroupSideEffectType;
	};
};

@UI5Class("sap.fe.core.controllerextensions.SideEffects", ControllerExtensionMetadata)
class SideEffectsControllerExtension extends ControllerExtension {
	private _oView: any;
	private _oAppComponent!: AppComponent;
	private _mFieldGroupQueue!: FieldGroupQueueMapType;
	private _aSourcePropertiesFailure!: Set<string>;
	private _oSideEffectsService!: any;
	private _mFailedSideEffects!: FailedSideEffectDictionary;

	@Override()
	public onInit() {
		this._oView = (this as any).base.getView();
		this._oAppComponent = CommonUtils.getAppComponent(this._oView);
		this._oSideEffectsService = (this._oAppComponent as any).getSideEffectsService();
		this._mFieldGroupQueue = {};
		this._aSourcePropertiesFailure = new Set();
		this._mFailedSideEffects = {};
	}

	/**
	 * Clear recorded validation status for all properties.
	 *
	 * @function
	 * @name clearPropertiesStatus
	 */
	@Public
	@Final
	public clearPropertiesStatus(): void {
		this._aSourcePropertiesFailure.clear();
	}

	/**
	 * Gets failed SideEffects.
	 *
	 * @function
	 * @name getRegisteredFailedRequests
	 * @returns {object} Registered SideEffects requests that have failed
	 */
	@Public
	@Final
	public getRegisteredFailedRequests(): FailedSideEffectDictionary {
		return this._mFailedSideEffects;
	}

	/**
	 * Manages the workflow for SideEffects with related changes to a field
	 * The following scenarios are managed:
	 *  - Execute: triggers immediate SideEffects requests if the promise for the field event is fulfilled
	 *  - Register: caches deferred SideEffects that will be executed when the FieldGroup is unfocused.
	 *
	 * @function
	 * @name handleFieldChange
	 * @param {object} oEvent SAPUI5 event that comes from a field change
	 * @param {object} oFieldGroupPreRequisite Promise to be fulfilled before executing deferred SideEffects
	 * @returns {object}  Promise on SideEffects request(s)
	 */
	@Public
	@Final
	public handleFieldChange(oEvent: UI5Event, oFieldGroupPreRequisite?: Promise<any>): Promise<any> {
		const mEventFieldProperties = this._getFieldProperties(oEvent),
			aImmediateSideEffectsProperties: FieldSideEffectPropertyType[] = this._initializeFieldSideEffects(
				mEventFieldProperties,
				oFieldGroupPreRequisite
			);

		let bIsImmediateTriggered = false;

		return this._generateImmediatePromise(mEventFieldProperties)
			.then(() => {
				bIsImmediateTriggered = true;
				return Promise.all(
					aImmediateSideEffectsProperties.map(mSideEffectsProperty => {
						return this.requestSideEffects(mSideEffectsProperty.sideEffects, mSideEffectsProperty.context);
					}) || []
				);
			})
			.catch(oError => {
				if (bIsImmediateTriggered) {
					Log.debug("Error while processing Field SideEffects", oError);
				} else {
					/**
					 * SideEffects have not been triggered since preRequisite validation fails so we need
					 * to keep previously failed request as Failed request (to be retrigger on next change)
					 */

					aImmediateSideEffectsProperties
						.filter(mImmediateSideEffects => mImmediateSideEffects.previouslyFailed === true)
						.forEach(mImmediateSideEffects =>
							this._addFailedSideEffects(mImmediateSideEffects.sideEffects, mImmediateSideEffects.context)
						);
				}
			});
	}

	/**
	 * Manages SideEffects with a related 'focus out' to a field group.
	 *
	 * @function
	 * @name handleFieldGroupChange
	 * @param {object} oEvent SAPUI5 Event
	 * @returns {object} Promise on SideEffects request(s)
	 */
	@Public
	@Final
	public handleFieldGroupChange(oEvent: UI5Event): Promise<any> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this,
			aDeferredSideEffects: FieldGroupSideEffectType[] = [],
			aFieldGroupIds: string[] = oEvent.getParameter("fieldGroupIds");

		const getFieldGroupRequestPromise = function(oDeferredSideEffect: FieldGroupSideEffectType) {
			let bIsRequestsTriggered = false;
			const oSideEffectProperty = oDeferredSideEffect.sideEffectProperty;
			const oContext = oSideEffectProperty.context;
			const sContextPath = oContext.getPath();
			const sEntityType = that._oSideEffectsService.getEntityTypeFromContext(oContext);
			const mEntityType = that._getEntityTypeFromFQN(sEntityType);

			return Promise.all(oDeferredSideEffect.promises)
				.then(function() {
					bIsRequestsTriggered = true;

					//Deferred SideEffects are executed only if all sourceProperties have no registered failure.
					if (
						mEntityType &&
						(oSideEffectProperty.sideEffects.SourceProperties as PropertyPath[]).every(sourceProperty => {
							if (sourceProperty.type === "PropertyPath") {
								const sId = that._generateStatusIndex(mEntityType, sourceProperty.value, oContext);
								if (sId) {
									return !that._aSourcePropertiesFailure.has(sId);
								}
							}
							return true;
						})
					) {
						return that.requestSideEffects(oSideEffectProperty.sideEffects, oSideEffectProperty.context);
					}
					return null;
				})
				.catch(oError => {
					if (bIsRequestsTriggered) {
						Log.debug("Error while processing FieldGroup SideEffects on context " + sContextPath, oError);
					}
				})
				.finally(() => {
					delete that._mFieldGroupQueue[oSideEffectProperty.name][sContextPath];
				});
		};

		aFieldGroupIds.forEach(sFieldGroupId => {
			/**
			 * string "$$ImmediateRequest" is added to the SideEffects name during templating to know
			 * if this SideEffects must be immediately executed requested (on field change) or must
			 * be deferred (on field group focus out)
			 *
			 */
			const sSideEffectName: string = sFieldGroupId.replace("$$ImmediateRequest", "");
			const mContextDeferredSideEffects = that._mFieldGroupQueue?.[sSideEffectName];
			if (mContextDeferredSideEffects) {
				Object.keys(mContextDeferredSideEffects).forEach(sContextPath => {
					const oDeferredSideEffect = mContextDeferredSideEffects[sContextPath];
					if (!oDeferredSideEffect.processStarted) {
						oDeferredSideEffect.processStarted = true;
						aDeferredSideEffects.push(oDeferredSideEffect);
					}
				});
			}
		});

		return Promise.all(
			aDeferredSideEffects.map(oDeferredSideEffect => {
				return getFieldGroupRequestPromise(oDeferredSideEffect);
			})
		);
	}

	/**
	 * Adds a SideEffects control.
	 *
	 * @function
	 * @name addControlSideEffects
	 * @param {string} sEntityType Name of the entity where the SideEffects control will be registered
	 * @param {object} oSideEffects SideEffects to register. Ensure the sourceControlId matches the associated SAPUI5 control ID.
	 *
	 */
	@Public
	@Final
	public addControlSideEffects(sEntityType: string, oSideEffects: Omit<ControlSideEffectsType, "fullyQualifiedName">): void {
		this._oSideEffectsService.addControlSideEffects(sEntityType, oSideEffects);
	}

	/**
	 * Removes the queue containing the failed SideEffects.
	 *
	 * @function
	 * @name removeFailedSideEffects
	 */
	@Public
	@Final
	public removeFailedSideEffects(): void {
		this._mFailedSideEffects = {};
	}

	/**
	 * Request SideEffects on a specific context.
	 *
	 * @function
	 * @name requestSideEffects
	 * @param {object} oSideEffects SideEffects to be executed
	 * @param {object} oContext Context where SideEffects need to be executed
	 * @returns {object} SideEffects request on SAPUI5 context
	 */
	@Public
	@Final
	public requestSideEffects(oSideEffects: SideEffectsType, oContext: Context<any>): Promise<any> {
		let fResolver: any, fRejector: any;
		const oPromise = new Promise(function(resolve, reject) {
			fResolver = resolve;
			fRejector = reject;
		});
		const aTargets: any[] = ((oSideEffects.TargetEntities as any[]) || []).concat((oSideEffects.TargetProperties as any[]) || []),
			sTriggerAction: String | undefined = (oSideEffects as ODataSideEffectsType).TriggerAction;

		if (sTriggerAction) {
			this._oSideEffectsService.executeAction(sTriggerAction, oContext);
		}

		this._oSideEffectsService
			.requestSideEffects(aTargets, oContext)
			.then(() => fResolver())
			.catch((oError: any) => {
				this._addFailedSideEffects(oSideEffects, oContext);
				fRejector(oError);
			});

		return oPromise;
	}

	/**
	 * Removes SideEffects created by a control.
	 *
	 * @function
	 * @name removeControlSideEffects
	 * @param {object} oControl SAPUI5 Control
	 */
	@Public
	@Final
	public removeControlSideEffects(oControl: Control): void {
		const sControlId = oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject") && oControl.getId();

		if (sControlId) {
			this._oSideEffectsService.removeControlSideEffects(sControlId);
		}
	}

	/**
	 * Adds SideEffects to the queue of the failed SideEffects
	 * The SideEffects will be retriggered on the next change on the same context.
	 *
	 * @function
	 * @name _addFailedSideEffects
	 * @param {object} oSideEffects SideEffects that need to be retriggered
	 * @param {object} oContext Context where SideEffects have failed
	 */
	@Private
	@Final
	private _addFailedSideEffects(oSideEffects: SideEffectsType, oContext: Context<any>): void {
		const sContextPath: string = oContext.getPath();
		this._mFailedSideEffects[sContextPath] = this._mFailedSideEffects[sContextPath] || [];
		const bIsNotAlreadyListed = this._mFailedSideEffects[sContextPath].every(
			mFailedSideEffects => oSideEffects.fullyQualifiedName !== mFailedSideEffects.fullyQualifiedName
		);
		if (bIsNotAlreadyListed) {
			this._mFailedSideEffects[sContextPath].push(oSideEffects);
		}
	}

	/**
	 * Generates the promise for the field group that is required before requesting SideEffects.
	 * If the promise is rejected and only the field requires the SideEffects on this context, the SideEffects are removed from the
	 * SideEffects queue.
	 *
	 * @function
	 * @name _generateFieldGroupPromise
	 * @param {object} mEventFieldProperties Field properties
	 * @returns {object} Promise to be used for the validation of the field
	 */
	private _generateFieldGroupPromise(mEventFieldProperties: FieldEventPropertyType): Promise<any> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;

		let bPromiseSuccess = true;
		return mEventFieldProperties.promise
			.then(function() {
				return bPromiseSuccess;
			})
			.catch(function() {
				bPromiseSuccess = false;
				return bPromiseSuccess;
			})
			.finally(() => {
				/**
				 * Need to store the status of properties related to this field for deferred SideEffects
				 * since all SourceProperties for this kind of SideEffects must be valid
				 */
				that._saveFieldPropertiesStatus(mEventFieldProperties.field, bPromiseSuccess);
			});
	}

	/**
	 * Generates the promise for the field that is required before requesting immediate SideEffects.
	 *
	 * @function
	 * @name _generateImmediatePromise
	 * @param {object} mEventFieldProperties Field properties
	 * @returns {object} Promise to be used for the validation of the field
	 */
	private _generateImmediatePromise(mEventFieldProperties: FieldEventPropertyType): Promise<any> {
		const oPromise = mEventFieldProperties.promise;
		return oPromise.then(function() {
			/**
			 * If the field gets a FieldHelper, we need to wait until all fields changed by this FieldHelper have been set.
			 * To achieve this, we ensure that all related bindings have been resolved.
			 *
			 * This resolution process is not managed by the Field Event Promise, so for fast user actions (like automation) it can lock the model
			 * and no request can be executed.
			 */
			const oField = mEventFieldProperties.field;
			const sFieldHelperId = oField.getFieldHelp && oField.getFieldHelp();
			if (sFieldHelperId) {
				const oFilterHelp: any = sap.ui.getCore().byId(sFieldHelperId);
				if (oFilterHelp) {
					return Promise.all(
						(oFilterHelp.getOutParameters() as any[]).map(oOutParameter => {
							const oBinding = oOutParameter.getBinding("value");
							return oBinding ? oBinding.requestValue() : Promise.resolve();
						})
					);
				}
			}
			return Promise.all([]);
		});
	}

	/**
	 * Generates a status index.
	 *
	 * @function
	 * @name _generateStatusIndex
	 * @param {object} mEntityType The entity type
	 * @param {string} sPropertyPath The property path
	 * @param {object} oContext SAPUI5 Context
	 * @returns {string | undefined} Index
	 */
	private _generateStatusIndex(mEntityType: EntityType, sPropertyPath: string, oContext: Context<any>): string | undefined {
		const sContextPath = oContext.getPath();
		const mProperty = mEntityType.resolvePath(sPropertyPath);
		if (mProperty) {
			if (mProperty && mProperty._type === "Property") {
				return [mProperty.fullyQualifiedName, sContextPath].join("__");
			}
		}
		return undefined;
	}

	/**
	 * Gets the appropriate context on which SideEffects can be requested.
	 * The correct one must have the binding parameter $$patchWithoutSideEffects.
	 *
	 * @function
	 * @name _getContextForSideEffects
	 * @param {object} oSourceField Field
	 * @param {string} sSideEffectEntityType Target entity type of the SideEffects annotation
	 * @returns {object} SAPUI5 Context
	 */
	@Private
	@Final
	private _getContextForSideEffects(oSourceField: FieldControl, sSideEffectEntityType: string): Context<any> | undefined {
		const oBindingContext = oSourceField.getBindingContext();
		let oContextForSideEffects = oBindingContext,
			sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oBindingContext);

		if (sSideEffectEntityType !== sEntityType) {
			oContextForSideEffects = (oBindingContext as any).getBinding().getContext();
			if (oContextForSideEffects) {
				sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oContextForSideEffects);
				if (sSideEffectEntityType !== sEntityType) {
					oContextForSideEffects = (oContextForSideEffects as any).getBinding().getContext();
					if (oContextForSideEffects) {
						sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oContextForSideEffects);
						if (sSideEffectEntityType !== sEntityType) {
							return undefined;
						}
					}
				}
			}
		}

		return oContextForSideEffects || undefined;
	}

	/**
	 * Retrieves the EntityType based on its fully-qualified name.
	 *
	 * @param {string} sFullyQualifiedName The fully-qualified name
	 * @returns {object} The entity type
	 */
	private _getEntityTypeFromFQN(sFullyQualifiedName: string): EntityType | undefined {
		const mEntityType = (this._oSideEffectsService.getConvertedMetaModel() as ConverterOutput).entityTypes.find(oEntityType => {
			return oEntityType.fullyQualifiedName === sFullyQualifiedName;
		});
		return mEntityType;
	}

	/**
	 * Gets the promise of the field validation that is required for the SideEffects process.
	 *
	 * @function
	 * @name _getFieldPromise
	 * @param {object} oEvent Field change event
	 * @returns {object} Field promise
	 */
	private _getFieldPromise(oEvent: UI5Event): Promise<any> {
		const promise = oEvent.getParameter("promise") || Promise.resolve();

		return promise.then(() => {
			const oPromise = new Promise(function(resolve, reject) {
				if (!FieldRuntime.getFieldStateOnChange(oEvent).state.validity) {
					reject();
				} else {
					resolve(true);
				}
			});
			return oPromise;
		});
	}

	/**
	 * Gets the properties of the field that are required for the SideEffects process.
	 *
	 * @function
	 * @name _getFieldProperties
	 * @param {object} oEvent Field change event
	 * @returns {object} Field properties (event change promise, field, SideEffects related to this field)
	 */
	private _getFieldProperties(oEvent: UI5Event): FieldEventPropertyType {
		const oField: FieldControl = oEvent.getSource();

		return {
			promise: this._getFieldPromise(oEvent),
			field: oField,
			sideEffectsMap: this._getFieldSideEffectsMap(oField)
		};
	}

	/**
	 * Gets the SideEffects map
	 * These SideEffects are
	 * - listed into FieldGroupIds (coming from an OData Service)
	 * - generated by a control or controls and that configure this field as SourceProperties.
	 *
	 * @function
	 * @name _getFieldSideEffectsMap
	 * @param {object} oField Field
	 * @returns {object} SideEffects map
	 */
	private _getFieldSideEffectsMap(oField: FieldControl): FieldSideEffectDictionary {
		const mSideEffectsMap: FieldSideEffectDictionary = {},
			aFieldGroupIds: string[] = oField.getFieldGroupIds(),
			sViewEntitySetSetName = this._oView.getViewData().entitySet,
			oViewEntitySet = (this._oSideEffectsService.getConvertedMetaModel() as ConverterOutput).entitySets.find(oEntitySet => {
				return oEntitySet.name === sViewEntitySetSetName;
			});

		// SideEffects coming from an OData Service
		aFieldGroupIds.forEach(sFieldGroupId => {
			const bIsImmediate: boolean = sFieldGroupId.indexOf("$$ImmediateRequest") !== -1,
				sName: string = sFieldGroupId.replace("$$ImmediateRequest", ""),
				aSideEffectParts: string[] = sName.split("#"),
				sSideEffectEntityType: string = aSideEffectParts[0],
				sSideEffectPath: string =
					sSideEffectEntityType +
					"@com.sap.vocabularies.Common.v1.SideEffects" +
					(aSideEffectParts.length === 2 ? "#" + aSideEffectParts[1] : ""),
				oSideEffect: SideEffectsType | undefined = this._oSideEffectsService.getODataEntitySideEffects(sSideEffectEntityType)?.[
					sSideEffectPath
				],
				oContext: Context<any> | undefined = this._getContextForSideEffects(oField, sSideEffectEntityType);
			if (oSideEffect && oContext) {
				mSideEffectsMap[sName] = {
					name: sName,
					immediate: bIsImmediate,
					sideEffects: oSideEffect,
					context: oContext
				};
			}
		});

		//SideEffects coming from control(s)
		if (sViewEntitySetSetName && oViewEntitySet) {
			const sViewEntityType = oViewEntitySet.entityType.fullyQualifiedName,
				mFieldPath: any = (oField.getAggregation("customData") as any[]).find(oCustomData => {
					return oCustomData.getKey() === "sourcePath";
				}),
				oContext: Context<any> | undefined = this._getContextForSideEffects(oField, sViewEntityType);

			if (mFieldPath && oContext) {
				const sFieldPath = mFieldPath.getValue().replace("/" + sViewEntitySetSetName + "/", ""),
					mControlEntityType = this._oSideEffectsService.getControlEntitySideEffects(
						sViewEntityType
					) as ControlSideEffectsEntityDictionary;
				Object.keys(mControlEntityType).forEach(sControlName => {
					const oControlSideEffects: SideEffectsType = mControlEntityType[sControlName];
					if ((oControlSideEffects.SourceProperties as string[]).includes(sFieldPath)) {
						const sName = sControlName + "::" + sViewEntityType;
						mSideEffectsMap[sName] = {
							name: sName,
							immediate: true,
							sideEffects: oControlSideEffects,
							context: oContext
						};
					}
				});
			}
		}
		return mSideEffectsMap;
	}

	/**
	 * Manages the SideEffects with related changes to a field
	 * List: gets immediate SideEffects requests
	 * Register: caches deferred SideEffects that will be executed when the FieldGroup is unfocused.
	 *
	 * @function
	 * @name _initializeFieldSideEffects
	 * @param {object} mEventFieldProperties Field event properties
	 * @param {object} oFieldGroupPreRequisite Promise to be fulfilled before executing deferred SideEffects
	 * @returns {Array}  Array of immediate SideEffects
	 */
	private _initializeFieldSideEffects(
		mEventFieldProperties: FieldEventPropertyType,
		oFieldGroupPreRequisite?: Promise<any>
	): FieldSideEffectPropertyType[] {
		const mFieldSideEffectsMap = mEventFieldProperties.sideEffectsMap,
			oFieldPromiseForFieldGroup = this._generateFieldGroupPromise(mEventFieldProperties), // Promise managing FieldGroup requests if Field promise fails
			mFailedSideEffectsName: any = {},
			aImmediateSideEffectsProperties: FieldSideEffectPropertyType[] = [];

		oFieldGroupPreRequisite = oFieldGroupPreRequisite || Promise.resolve();

		Object.keys(mFieldSideEffectsMap).forEach(sSideEffectName => {
			const oSideEffectProperty: FieldSideEffectPropertyType = mFieldSideEffectsMap[sSideEffectName],
				sSideEffectContextPath = oSideEffectProperty.context.getPath(),
				aFailedSideEffects = this._mFailedSideEffects[sSideEffectContextPath];

			// Check if there is any previously failed request for this context
			if (aFailedSideEffects) {
				delete this._mFailedSideEffects[sSideEffectContextPath];
				mFailedSideEffectsName[sSideEffectContextPath] = {};
				aFailedSideEffects.forEach(mFailedSideEffects => {
					mFailedSideEffectsName[sSideEffectContextPath][mFailedSideEffects.fullyQualifiedName] = true;
					aImmediateSideEffectsProperties.push({
						name: sSideEffectName,
						previouslyFailed: true,
						sideEffects: mFailedSideEffects,
						context: oSideEffectProperty.context
					});
				});
			}
			if (oSideEffectProperty.immediate) {
				// SideEffects will be executed immediately after event promise validation
				if (!mFailedSideEffectsName[sSideEffectContextPath]?.[oSideEffectProperty.sideEffects.fullyQualifiedName]) {
					aImmediateSideEffectsProperties.push({
						name: sSideEffectName,
						sideEffects: oSideEffectProperty.sideEffects,
						context: oSideEffectProperty.context
					});
				}
			} else {
				// Add deferred SideEffects to the related dictionary
				this._mFieldGroupQueue[sSideEffectName] = this._mFieldGroupQueue[sSideEffectName] || {};
				const mSideEffectContextPath = this._mFieldGroupQueue[sSideEffectName][sSideEffectContextPath] || {
					promises: [],
					sideEffectProperty: oSideEffectProperty,
					processStarted: false
				};
				mSideEffectContextPath.promises = mSideEffectContextPath.promises.concat([
					oFieldPromiseForFieldGroup,
					oFieldGroupPreRequisite as Promise<any>
				]);
				this._mFieldGroupQueue[sSideEffectName][sSideEffectContextPath] = mSideEffectContextPath;
			}
		});
		return aImmediateSideEffectsProperties;
	}

	/**
	 * Saves the validation status of properties related to a field control.
	 *
	 * @param {object} oField Field
	 * @param {boolean} bSuccess Status of the field validation
	 */
	private _saveFieldPropertiesStatus(oField: FieldControl, bSuccess: boolean): void {
		const oBindingContext = oField.getBindingContext();
		const sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oBindingContext);
		const mEntityType = this._getEntityTypeFromFQN(sEntityType);
		if (mEntityType) {
			// Retrieves all properties used by the field
			const oFieldBinding: any = this._getBindingForField(oField);
			const aFieldPaths = oFieldBinding.isA("sap.ui.model.CompositeBinding")
				? ((oFieldBinding as any).getBindings() || []).map((oBinding: any) => oBinding.sPath)
				: [oFieldBinding.getPath()];

			// Stores status for all properties
			aFieldPaths.forEach((sFieldPath: string) => {
				const sId = this._generateStatusIndex(mEntityType, sFieldPath, oBindingContext);
				if (sId) {
					this._aSourcePropertiesFailure[bSuccess ? "delete" : "add"](sId);
				}
			});
		}
	}

	/**
	 * Retrieves the property binding to the value of the field.
	 *
	 * @param oField Field
	 * @returns {Binding}  Binding to the value
	 */
	private _getBindingForField(oField: FieldControl): Binding {
		let oBinding: Binding;
		if (oField.isA<CheckBox>("sap.m.CheckBox")) {
			oBinding = oField.getBinding("selected");
		} else {
			oBinding = oField.getBinding("value");
		}
		return oBinding;
	}
}

export default SideEffectsControllerExtension;
