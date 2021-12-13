// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview A wrapper for a property bag loaded from the page building service.
 */

sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Utils",
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/base/Log"
], function (
    Utils,
    SrvcError,
    Log
) {
    "use strict";

    // "public class" ************************************************************

    /**
     * Constructs a new representation (wrapper) of the bag with the given
     * bag description as loaded from the given factory's page building service.
     * A property bag can be associated with a page (see {@link sap.ushell_abap.pbServices.ui2.Page#getBag}), a
     * CHIP instance (see {@link sap.ushell_abap.pbServices.ui2.ChipInstance#getBag}) or a CHIP
     * (see {@link sap.ushell_abap.pbServices.ui2.Chip#getBag}). Such bags take arbitrary name/value pairs consisting
     * of strings.
     *
     * @param {sap.ushell_abap.pbServices.ui2.Factory} oFactory
     *   the factory
     * @param {object} oAlterEgo
     *   the bag data including its (optional) properties as loaded via the page building service
     * @param {object} [oParentBag]
     *   a bag which is asked for properties not found in this bag
     * @param {function(sap.ushell_abap.pbServices.ui2.Bag)} [fnChangeListener]
     *   (since 1.21) a listener to be called (with this bag as an argument) each time this bag
     *   changes due to save or reset; the listener is not called in case a backend request fails
     *   completely
     *
     * @class
     * @since 1.3.0
     */
    var Bag = function (oFactory, oAlterEgo, oParentBag, fnChangeListener) {
        var oPropertiesByName,
            bResetting = false,
            bSaving = false,
            that = this;

        // BEWARE: constructor code below!

        // "private" methods ---------------------------------------------------------

        /**
         * Throws an error if the bag is currently running a <code>reset</code>.
         *
         * @private
         */
        function errorIfResetRunning () {
            if (bResetting) {
                throw new SrvcError("The previous reset operation is not finished yet",
                    "Bag");
            }
        }

        /**
         * Throws an error if the bag is currently running a <code>save</code>.
         *
         * @private
         */
        function errorIfSaveRunning () {
            if (bSaving) {
                throw new SrvcError("The previous save operation is not finished yet",
                    "Bag");
            }
        }

        /**
         * Fills the <code>oPropertiesByName</code> map based on the properties in the given bag data,
         * updating only the given accepted names if applicable.
         *
         * @param {object} oBagData
         *   parsed JSON object as returned by the OData service representing this bag
         * @param {Utils.Map} [oAcceptedNames]
         *   map (used as a "hash set") of accepted names; if missing, all are accepted
         * @private
         */
        function fillPropertyMap (oBagData, oAcceptedNames) {
            var aProperties = (oBagData.Properties && oBagData.Properties.results)
                || (oBagData.ChipInstanceProperties && oBagData.ChipInstanceProperties.results)
                || (oBagData.ChipProperties && oBagData.ChipProperties.results)
                || [];

            oPropertiesByName = oPropertiesByName || new Utils.Map();
            aProperties.forEach(function (oPropertyData) {
                var sName = oPropertyData.name,
                    oOldProperty;

                if (!oAcceptedNames || oAcceptedNames.containsKey(sName)) {
                    oOldProperty = oPropertiesByName.put(sName, oPropertyData);
                    oPropertyData.$currentValue = oOldProperty
                        ? oOldProperty.$currentValue // keep current value
                        : oPropertyData.value;
                }
            });

            // remove relations
            delete oBagData.ChipInstanceProperties;
            delete oBagData.ChipProperties;
            delete oBagData.Properties;
        }

        /**
         * Returns the names of all translatable or non-translatable properties (as indicated) of
         * this bag, taking the given names from the parent bag into account. Avoids duplicates.
         *
         * @param {string[]} aNames
         *   names from parent bag or <code>[]</code>
         * @param {boolean} bTranslatable
         *   whether names of translatable text properties are requested
         * @returns {string[]}
         *  an array containing all names
         * @private
         */
        function getNames (aNames, bTranslatable) {
            var oNameSet;

            if (aNames.length === 0) { // no parent names --> no duplicates expected, run faster code
                oPropertiesByName.keys().forEach(function (sKey) {
                    if (bTranslatable === (oPropertiesByName.get(sKey).translatable === "X")) {
                        aNames.push(sKey);
                    }
                });
                return aNames;
            }

            // parent names present --> expect duplicates and avoid them with slower code
            oNameSet = new Utils.Map();
            aNames.forEach(function (sKey) {
                oNameSet.put(sKey);
            });
            oPropertiesByName.keys().forEach(function (sKey) {
                if (bTranslatable === (oPropertiesByName.get(sKey).translatable === "X")) {
                    oNameSet.put(sKey);
                }
            });
            return oNameSet.keys();
        }

        /**
         * Returns a mock of a parent page or CHIP instance which contains the exact IDs and nothing
         * else.
         * @returns {object} a mock of a parent page or CHIP instance
         *
         * @private
         */
        function getParentMock () {
            // Note: bags at Chip level are read-only and can be ignored here!
            if (oAlterEgo.instanceId) {
                return { pageId: oAlterEgo.pageId, instanceId: oAlterEgo.instanceId };
            }
            return { id: oAlterEgo.pageId };
        }

        /**
         * Sets the value for the given property name. If no such property exists yet, it will be
         * created. If <code>setProperty()</code> is called during a running {@link #save()}, the
         * property will <i>not</i> be saved immediately. It will only be saved with the next call to
         * {@link #save()}.
         *
         * @param {string} sPropertyName
         *   the property name (which has to be a string)
         * @param {string} sValue
         *   the value (which has to be a string)
         * @param {boolean} bTranslatable
         *   whether this property is a translatable text property
         * @returns {sap.ushell_abap.pbServices.ui2.Bag}
         *   this bag
         * @throws Error when called while {@link #reset()} is running.
         * @private
         */
        function setProperty (sPropertyName, sValue, bTranslatable) {
            var oProperty;

            if (!sPropertyName) {
                throw new SrvcError("Property name must not be empty", "sap.ushell_abap.pbServices.ui2.Bag");
            }
            if (typeof sPropertyName !== "string") {
                throw new SrvcError("Property name must be a string", "sap.ushell_abap.pbServices.ui2.Bag");
            }
            oProperty = oPropertiesByName.get(sPropertyName);
            if (oProperty && ((oProperty.translatable === "X") !== bTranslatable)) {
                throw new SrvcError(
                    "'" + sPropertyName + "' already exists as a "
                    + (bTranslatable ? "non-translatable" : "translatable text")
                    + " property",
                    "sap.ushell_abap.pbServices.ui2.Bag"
                );
            }
            if (typeof sValue !== "string") {
                throw new SrvcError("Property value must be a string", "sap.ushell_abap.pbServices.ui2.Bag");
            }
            errorIfResetRunning();

            if (!oProperty) {
                oProperty = { name: sPropertyName, translatable: (bTranslatable ? "X" : " ") };
                oPropertiesByName.put(sPropertyName, oProperty);
            }
            oProperty.$currentValue = sValue;
            return that;
        }

        // "public" methods ----------------------------------------------------------

        /**
         * Returns this bag's ID.
         *
         * @returns {string}
         *   this bag's ID
         * @since 1.3.0
         */
        this.getId = function () {
            return oAlterEgo.id;
        };

        /**
         * Returns an array containing the names of the (non-translatable) properties contained in this
         * bag. In contrast to {@link #getPropertyNames()} the properties of the parent bag are ignored.
         * As long as a {@link #reset()} is running,
         * the "old" property names are returned.
         *
         * If {@link #resetProperty()} has been called on a not persisted property its name is not
         * contained in the array; for a persisted property it is contained in the array until
         * {@link #save()} is called on this bag.
         *
         * @returns {string[]}
         *   array of (non-translatable) property names really stored in this bag (not the parent bag)
         *
         * @see #getOwnTextNames
         * @see #getPropertyNames
         * @private
         */
        this.getOwnPropertyNames = function () {
            return getNames([], false);
        };

        /**
         * Returns an array containing the names of the translatable text properties contained in this
         * bag. In contrast to {@link #getTextNames()} the text properties of the parent bag are
         * ignored. As long as a {@link #reset()} is running, the "old" property names are returned.
         * For an array of non-translatable property names see {@link #getPropertyNames}.
         *
         * @returns {string[]}
         *   array of translatable text property names really stored in this bag (not the parent bag)
         *
         * @see #getOwnPropertyNames
         * @see #getTextNames
         * @private
         */
        this.getOwnTextNames = function () {
            return getNames([], true);
        };

        /**
         * Returns the property value for the given property name. If no such property exists, the
         * given default value is returned.
         * As long as a {@link #reset()} is running, "old" values are returned.
         *
         * @param {string} sPropertyName
         *   the property name
         * @param {string} [sDefaultValue]
         *   default value used if there is no property with given name
         *
         * @returns {string}
         *   the property value
         * @throws Error if <code>sPropertyName</code> is a translatable text property name.
         * @since 1.3.0
         */
        this.getProperty = function (sPropertyName, sDefaultValue) {
            var oProperty = oPropertiesByName.get(sPropertyName);

            if (oProperty && (oProperty.translatable === "X")) {
                throw new SrvcError("'" + sPropertyName + "' is a translatable text property",
                    "sap.ushell_abap.pbServices.ui2.Bag");
            }

            if (oProperty) {
                return oProperty.$currentValue;
            }
            if (oParentBag) {
                return oParentBag.getProperty(sPropertyName, sDefaultValue);
            }
            return sDefaultValue;
        };

        /**
         * Returns an array containing the names of the (non-translatable) properties contained in this
         * bag. As long as a {@link #reset()} is running, the "old" property names are returned.
         * For an array of translatable text property names see {@link #getTextNames}.
         *
         * If {@link #resetProperty()} has been called on a not persisted property its name is not
         * contained in the array; for a persisted property it is contained in the array until
         * {@link #save()} is called on this bag.
         *
         * @returns {string[]}
         *   array of (non-translatable) property names
         * @since 1.3.0
         *
         * @see #getTextNames
         */
        this.getPropertyNames = function () {
            var aPropertyNames = oParentBag ? oParentBag.getPropertyNames() : [];

            return getNames(aPropertyNames, false);
        };

        /**
         * Returns the translatable text for the given text property name. If no such text property
         * exists, <code>sTextName</code> is returned again. As long as a {@link #reset()} is running,
         * "old" texts are returned.
         *
         * @param {string} sTextName
         *   the text property name
         * @returns {string}
         *   the translatable text
         * @throws Error if <code>sTextName</code> is an ordinary (non-translatable) property name.
         * @since 1.17.1
         */
        this.getText = function (sTextName) {
            var oProperty = oPropertiesByName.get(sTextName);

            if (oProperty && (oProperty.translatable !== "X")) {
                throw new SrvcError(
                    "'" + sTextName + "' is a non-translatable property",
                    "sap.ushell_abap.pbServices.ui2.Bag"
                );
            }

            if (oProperty) {
                return oProperty.$currentValue;
            }
            if (oParentBag) {
                return oParentBag.getText(sTextName);
            }
            return sTextName;
        };

        /**
         * Returns an array containing the names of the translatable text properties contained in this
         * bag. As long as a {@link #reset()} is running, the "old" property names are returned.
         * For an array of non-translatable property names see {@link #getPropertyNames}.
         *
         * @returns {string[]}
         *   array of translatable text property names
         * @since 1.17.1
         *
         * @see #getPropertyNames
         */
        this.getTextNames = function () {
            var aTextNames = oParentBag ? oParentBag.getTextNames() : [];

            return getNames(aTextNames, true);
        };

        /**
         * Discards all modified properties, deletes this bag with all its properties and reloads the
         * bag via the factory given in the constructor. If the factory's page building service offers
         * different layers (like <code>sap.ushell_abap.pbServices.ui2.PageBuildingService</code>, calling them
         * <i>scopes</i>), the values from a lower layer will become visible.
         * <p>
         * This is an asynchronous operation. If the bag is reset successfully, the success
         * handler is called. If there is an error while resetting the bag, all old values are kept
         * and the error handler is called.
         *
         * @param {function ()} fnSuccess
         *   no-args success handler
         * @param {function (string, object=)} [fnError]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If fnError is not given, the default error handler from the factory's
         *   page building service is called.
         * @throws Error when called while {@link #save()} or a previous <code>reset()</code> is
         *   running.
         * @since 1.3.0
         */
        this.reset = function (fnSuccess, fnError) {
            var oParent = getParentMock(),
                oPbs = oFactory.getPageBuildingService();

            function onReadSuccess (oBagData) {
                bResetting = false;

                oAlterEgo = oBagData;
                oPropertiesByName = undefined;
                fillPropertyMap(oAlterEgo);
                if (fnChangeListener) {
                    fnChangeListener(that);
                }
                fnSuccess();
            }

            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "sap.ushell_abap.pbServices.ui2.Bag");
            }

            errorIfSaveRunning();
            errorIfResetRunning();
            bResetting = true;
            fnError = fnError || oPbs.getDefaultErrorHandler();

            if (oAlterEgo.$tmp) {
                // if bag is not yet persisted do not call delete and read
                Utils.callHandler(onReadSuccess.bind(null, oAlterEgo), fnError, true);
                return;
            }

            oPbs.deleteBag(oParent, oAlterEgo.id, function () {
                oAlterEgo.$tmp = true;
                // if bag cannot be read because there is no bag in lower layer success handler has to be
                // called; oAlterEgo is passed because success handler expects oData parameter and
                // oAlterEgo contains required information for the bag (like page and name) and no
                // properties (have been deleted after property map has been filled) --> property map
                // is cleared in success handler and we get an empty bag
                oPbs.readBag(oParent, oAlterEgo.id, onReadSuccess, onReadSuccess.bind(null, oAlterEgo));
            }, function () {
                // deleteBag failed
                bResetting = false;

                // NOTE: call error handler with any arguments passed in this wrapper
                fnError.apply(null, arguments);
            });
        };

        /**
         * Deletes the property with the given name, no matter if it is translatable or not. If no such
         * property exists, nothing happens.
         * <p>
         * Otherwise, the property value is considered to be <code>undefined</code> until a
         * {@link #save} operation has succeeded. Note how this <code>undefined</code> value is treated
         * differently by {@link #getProperty} and {@link #getText}!
         * <p>
         * <b>BEWARE:</b> This transient <code>undefined</code> value can be wrong due to a number of
         * reasons, including different layers of storage (like
         * <code>sap.ushell_abap.pbServices.ui2.PageBuildingService</code>, calling them <i>scopes</i>) or parent bags
         * (in case of catalog pages), which cannot be taken properly into account until the next time
         * a {@link #save} operation succeeds!
         * <p>
         * After a successful {@link #save} operation, a deleted property may reappear from a lower
         * layer of storage or from a parent bag. If you need to overwrite such values, use
         * {@link #setProperty} instead!
         * <p>
         * If <code>resetProperty()</code> is called during a running {@link #save}, the
         * property will <i>not</i> be saved immediately. It will only be saved with the next call to
         * {@link #save}.
         *
         * @param {string} sPropertyName
         *   the property name (which has to be a string)
         * @returns {sap.ushell_abap.pbServices.ui2.Bag}
         *   this bag
         * @throws Error when called while {@link #reset} is running.
         *
         * @since 1.17.1
         */
        this.resetProperty = function (sPropertyName) {
            var oProperty;

            oProperty = oPropertiesByName.get(sPropertyName);
            if (oProperty) {
                oProperty.$currentValue = undefined; //undefined value is marker to delete property on save
                if (!Object.prototype.hasOwnProperty.call(oProperty, "value")) { // no persisted value
                    oPropertiesByName.remove(sPropertyName);
                }
            }
            return this;
        };

        /**
         * Saves this bag with all modified properties. This is an asynchronous operation.
         * If all modified properties have been saved, the success handler is called. If one or more
         * properties cannot be saved, the error handler is called. This error handler reports which
         * properties could not be saved and the corresponding error messages. The properties remain
         * valid and the bag tries to save them again with the next call to <code>save()</code>.
         *
         * <p>
         * If <code>save()</code> is called when there is no modified property, the function calls the
         * success handler asynchronously without any further activity.
         *
         * @param {function ()} fnSuccess
         *   no-args success handler. Errors thrown in this function will be reported to the page
         *   building service's default error handler (not to <code>fnError</code> since the signature
         *   does not fit)
         * @param {function (map<string, string>, map<string, object>)} fnError
         *   error handler taking two maps, each mapping individual property names
         *   to error message and complete error information respectively. Since
         *   version 1.28.6, the second parameter is always returned,
         *   but a property name in that object may map to
         *   undefined values in case an error object containing the complete error
         *   information is not available.<br />
         *   For more details about the structure of the error information object
         *   see {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         * @throws Error when called while {@link #reset()} or a previous <code>save()</code> is
         *   running.
         * @since 1.3.0
         */
        this.save = function (fnSuccess, fnError) {
            var iNumberOfRequests = 0,
                oResetPropertyNames = new Utils.Map(), // used as a "hash set"
                mMessagesByName = {},
                mErrorResponseByName = {},
                oParentMock = getParentMock(),
                oPbs = oFactory.getPageBuildingService();

            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "sap.ushell_abap.pbServices.ui2.Bag");
            }
            if (typeof fnError !== "function") {
                throw new SrvcError("Missing error handler", "sap.ushell_abap.pbServices.ui2.Bag");
            }
            errorIfSaveRunning();
            errorIfResetRunning();

            oPbs.openBatchQueue();

            oPropertiesByName.keys().forEach(function (sName) {
                var oUpdatedProperty,
                    oProperty = oPropertiesByName.get(sName);

                function onError (sMessage, oErrorInformation) {
                    mMessagesByName[sName] = sMessage;
                    mErrorResponseByName[sName] = oErrorInformation;
                }

                if (oProperty.$currentValue !== oProperty.value) {
                    iNumberOfRequests += 1;
                    if (Object.prototype.hasOwnProperty.call(oProperty, "value")) {
                        if (oProperty.$currentValue === undefined) {
                            // reset property: delete it and re-read bag below
                            oResetPropertyNames.put(sName);
                            oPbs.deleteProperty(oProperty,
                                function () {
                                    if (oProperty.$currentValue === undefined) { // not re-created via API
                                        oPropertiesByName.remove(sName);
                                    } else {
                                        delete oProperty.value; // not persisted anymore
                                    }
                                }, onError);
                        } else {
                            // changed property: update it
                            oUpdatedProperty = JSON.parse(JSON.stringify(oProperty));
                            oUpdatedProperty.value = oProperty.$currentValue; // 1st update clone
                            oPbs.updateProperty(oUpdatedProperty,
                                function () {
                                    oProperty.value = oUpdatedProperty.value; // on success, update original
                                }, onError);
                        }
                    } else {
                        // new property: create it
                        oPbs.createProperty(oParentMock, oAlterEgo.id, sName,
                            oProperty.$currentValue, oProperty.translatable,
                            function (oNewProperty) {
                                // save alter ego because of __metadata needed for later updates
                                oNewProperty.$currentValue = oProperty.$currentValue; // keep current value
                                oPropertiesByName.put(sName, oNewProperty);
                            }, onError);
                    }
                }
            });

            if (oResetPropertyNames.keys().length) {
                // some properties were reset: re-read bag
                oPbs.readBag(oParentMock, oAlterEgo.id, function (oBagData) {
                    fillPropertyMap(oBagData, oResetPropertyNames);
                }); // omit error handler, default one must be used here!
            }

            bSaving = true;
            oPbs.submitBatchQueue(function () {
                bSaving = false;
                if (fnChangeListener && iNumberOfRequests > Object.keys(mMessagesByName).length) {
                    // at least one request must succeed
                    fnChangeListener(that);
                }
                if (Object.keys(mMessagesByName).length > 0) {
                    fnError(mMessagesByName, mErrorResponseByName);
                } else {
                    oAlterEgo.$tmp = false;
                    fnSuccess(); // Note: try/catch done by submitBatchQueue()!
                }
            });
        };

        /**
         * Sets the value for the given property name. If no such property exists yet, it will be
         * created. If <code>setProperty()</code> is called during a running {@link #save()}, the
         * property will <i>not</i> be saved immediately. It will only be saved with the next call to
         * {@link #save()}.
         *
         * @param {string} sPropertyName
         *   the property name (which has to be a string)
         * @param {string} sValue
         *   the value (which has to be a string)
         * @returns {sap.ushell_abap.pbServices.ui2.Bag}
         *   this bag
         * @throws Error when called while {@link #reset()} is running.
         * @throws Error when called with a property name which is not of type string or the empty
         *   string
         * @since 1.3.0
         */
        this.setProperty = function (sPropertyName, sValue) {
            return setProperty(sPropertyName, sValue, false);
        };

        /**
         * Sets the translatable text for the given text property name. If no such text property exists
         * yet, it will be created as a translatable text property. Ordinary properties and
         * translatable text properties share a common namespace! Once a property has been created,
         * it is either translatable or not and this cannot be changed by the corresponding setters.
         * You can only call <code>reset()</code> and start all over.
         * <p>
         * Note: You can create or modify translatable text properties only if the session language is
         * the same as the page's original language (see
         * {@link sap.ushell_abap.pbServices.ui2.Page#getOriginalLanguage}).
         * Also note that handling of translatable texts depends on the layer used. In some layers the
         * original language is important; in others it does not matter. In the latter case the empty
         * string (<code>""</code>) is returned, which indicates that the user is allowed to edit the
         * translatable texts in any language.
         * <p>
         * If <code>setText()</code> is called during a running {@link #save()}, the text property will
         * <i>not</i> be saved immediately. It will only be saved with the next call to {@link #save()}.
         *
         * @param {string} sTextName
         *   the text property name (must not be empty)
         * @param {string} sText
         *   the translatable text (may be empty)
         * @returns {sap.ushell_abap.pbServices.ui2.Bag}
         *   this bag
         * @throws Error when called while {@link #reset()} is running or if an ordinary
         * (non-translatable) property with the same name already exists.
         * @since 1.17.1
         *
         * @see sap.ushell_abap.pbServices.ui2.Page#getOriginalLanguage
         * @see chip.bag.getOriginalLanguage
         */
        this.setText = function (sTextName, sText) {
            return setProperty(sTextName, sText, true);
        };

        /**
         * Returns this bag's string representation.
         *
         * @param {boolean} [bVerbose=false]
         *   whether to show all properties
         * @returns {string}
         *   this bag's string representation
         * @since 1.3.0
         */
        this.toString = function (bVerbose) {
            var aResult = ['Bag({id:"', oAlterEgo.id,
                '",pageId:"', oAlterEgo.pageId
            ];
            if (oAlterEgo.instanceId) {
                aResult.push('",instanceId:"', oAlterEgo.instanceId);
            }
            aResult.push('"');
            if (bVerbose) {
                aResult.push(",oAlterEgo:", JSON.stringify(oAlterEgo));
                aResult.push(",oPropertiesByName:", oPropertiesByName.toString());
                aResult.push(",bResetting:", bResetting);
                aResult.push(",bSaving:", bSaving);
            }
            aResult.push("})");
            return aResult.join("");
        };

        /**
         * Replace all properties in this bag with given raw bag data.
         *
         * @param {object} oBagData
         *  parsed JSON object as returned by the OData service representing this bag
         * @throws Error when called with bag data which does not fit to this bag.
         * @private
         */
        this.update = function (oBagData) {
            if (!oBagData || oAlterEgo.id !== oBagData.id) {
                throw new SrvcError("Bag data belongs to another bag",
                    "sap.ushell_abap.pbServices.ui2.Bag");
            }
            oPropertiesByName = undefined;
            fillPropertyMap(oBagData);
        };

        // constructor code -------------------------------------------------------

        fillPropertyMap(oAlterEgo);
        Log.debug("Created: " + this, null, "sap.ushell_abap.pbServices.ui2.Bag");
    };

    // TODO remove when FLPD is adapted (uses this function in global namespace)
    sap.ui2 = sap.ui2 || {};
    sap.ui2.srvc = sap.ui2.srvc || {};
    sap.ui2.srvc.bag = Bag;

    return Bag;
}, true);
