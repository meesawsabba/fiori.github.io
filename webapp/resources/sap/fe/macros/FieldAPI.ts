import { APIClass, EventHandler, Event, Property, Association } from "sap/fe/core/helpers/ClassSupport";
import MacroAPI from "./MacroAPI";
import { Input, CheckBox, TextArea } from "sap/m";
import { Field as mdcField } from "sap/ui/mdc";
import { FieldWrapper } from "sap/fe/core/controls";
import { Control } from "sap/ui/core";

/**
 * Additional format options for the field.
 *
 * @alias sap.fe.macros.FieldFormatOptions
 * @public
 */
export type FieldFormatOptions = {
	/**
	 *  Defines how the field value and associated text will be displayed together.<br/>
	 *
	 *  Allowed values are "Value", "Description", "ValueDescription" and "DescriptionValue"
	 *
	 *  @public
	 */
	displayMode: string;
	/**
	 * Defines if and how the field measure will be displayed.<br/>
	 *
	 * Allowed values are "Hidden" and "ReadOnly"
	 *
	 *  @public
	 */
	measureDisplayMode: string;
};
/**
 * Building block for creating a field based on the metadata provided by OData V4.
 * <br>
 * Usually, a DataField or DataPoint annotation is expected, but the field can also be used to display a property from the entity type.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macro:Field id="MyField" metaPath="MyProperty" /&gt;
 * </pre>
 *
 * @alias sap.fe.macros.Field
 * @public
 */
@APIClass("sap.fe.macros.FieldAPI")
class FieldAPI extends MacroAPI {
	/**
	 * An expression that allows you to control the editable state of the field.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine if the page is currently editable.
	 * Please note that you cannot set a field to editable if it has been defined in the annotation as not editable.
	 *
	 * @private
	 * @deprecated
	 */
	@Property({ type: "boolean" })
	editable!: boolean;

	/**
	 * An expression that allows you to control the read-only state of the field.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine the current state.
	 *
	 * @public
	 */
	@Property({ type: "boolean" })
	readOnly!: boolean;

	/**
	 * The identifier of the Field control.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	id!: string;

	/**
	 * An event containing details is triggered when the value of the field is changed.
	 *
	 * @public
	 */
	@Event
	change!: Function;

	@Association({ type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" })
	ariaLabelledBy!: Control;

	@Property({ type: "boolean" })
	required!: boolean;

	/**
	 * A set of options that can be configured.
	 *
	 * @public
	 */
	@Property({ type: "sap.fe.macros.FieldFormatOptions" })
	formatOptions!: FieldFormatOptions;

	/**
	 * Option to add semantic objects to a field.
	 * Valid options are either a single semantic object, a stringified array of semantic objects
	 * or a single binding expression returning either a single semantic object or an array of semantic objects
	 *
	 * @public
	 */
	@Property({ type: "string" })
	semanticObject!: string;

	@EventHandler
	handleChange(oEvent: UI5Event) {
		(this as any).fireChange({ value: this.getValue(), isValid: oEvent.getParameter("valid") });
	}

	onBeforeRendering() {
		const oContent = (this as any).getContent();
		if (oContent && oContent.addAriaLabelledBy) {
			const aAriaLabelledBy = (this as any).getAriaLabelledBy();

			for (let i = 0; i < aAriaLabelledBy.length; i++) {
				const sId = aAriaLabelledBy[i];
				const aAriaLabelledBys = oContent.getAriaLabelledBy() || [];
				if (aAriaLabelledBys.indexOf(sId) === -1) {
					oContent.addAriaLabelledBy(sId);
				}
			}
		}
	}

	enhanceAccessibilityState(_oElement: object, mAriaProps: object): object {
		const oParent = this.getParent();

		if (oParent && (oParent as any).enhanceAccessibilityState) {
			// use FieldWrapper as control, but aria properties of rendered inner control.
			(oParent as any).enhanceAccessibilityState(this, mAriaProps);
		}

		return mAriaProps;
	}
	getAccessibilityInfo(): Object {
		const oContent = this.content;
		return oContent && oContent.getAccessibilityInfo ? oContent.getAccessibilityInfo() : {};
	}
	/**
	 * Retrieves the current value of the Field.
	 *
	 * @public
	 * @returns The current value of the field
	 */
	getValue(): boolean | string {
		let oControl = this.content,
			aControls;

		if (oControl.isA("sap.fe.core.controls.FieldWrapper")) {
			aControls = (oControl as FieldWrapper).getContentEdit() || [(oControl as FieldWrapper).getContentDisplay()] || [];
			if (aControls.length === 1) {
				oControl = aControls[0];
			} else {
				throw "getting value not yet implemented for this field type";
			}
		}

		if (oControl.isA<CheckBox>("sap.m.CheckBox")) {
			return oControl.getSelected();
		} else if (oControl.isA<Input>("sap.m.Input")) {
			return oControl.getValue();
		} else if (oControl.isA<mdcField>("sap.ui.mdc.Field")) {
			return oControl.getValue();
		} else if (oControl.isA<TextArea>("sap.m.TextArea")) {
			return oControl.getValue();
		} else {
			throw "getting value not yet implemented for this field type";
		}
	}
}

export default FieldAPI;
