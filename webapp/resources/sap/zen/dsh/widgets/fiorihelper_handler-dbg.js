/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/* eslint-disable no-undef */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(Log, jQuery, BaseHandler) {
    "use strict";
    var FioriHelperHandler = function() {
      BaseHandler.apply(this, arguments);
      var that = this;
      this.aAllowedSemanticSources = [];
      this.aValidJumpTargets = [];
      this.sCmdOnTileSettingsSubmitted = null;
      this.sCmdSetAppUrl = null;
      this.oBookmarkTileData = null;
      this.oBookmarkTileGroup = null;
      this.oAppState = null;
      this.sSelection = null;

      /**
       * Create the Control
       */
      this.create = function(oChainedControl, oControlProperties) {
        this.oAppState = null;
        this.sSelection = null;

        var lId = oControlProperties["id"];
        var loControl = this.createDefaultProxy(lId);

        this.init(loControl, oControlProperties);
        loControl.setVisible(false);

        return loControl;
      };

      /**
       * Update the Control
       */
      this.update = function(oControl, oControlProperties) {
        this.init(oControl, oControlProperties);
        return oControl;
      };

      /**
       * Initialize Control (Create, Update)
       */
      this.init = function(oControl, oControlProperties) {
        if (oControlProperties) {
          if (oControlProperties.appstate) {
            this.setApplicationState(oControlProperties.appstate, oControlProperties.hostui5control);
          }

          if (oControlProperties.context) {
            this.setSelection(oControlProperties.context, oControlProperties.hostui5control);
          }

          this.sCmdOnTileSettingsSubmitted = oControlProperties.ontilesettingssubmittedcommand;

          var lClientAction = oControlProperties.clientaction;
          if (lClientAction && lClientAction.length > 0) {
            if (lClientAction === "FETCH_JUMP_TARGETS") {
              this.fetchJumpTargets(oControlProperties);
            } else if (lClientAction === "JUMP_TO") {
              this.jumpToTarget(oControlProperties);
            } else if (lClientAction === "SAVE_TILE") {
              this.saveTile(oControlProperties);
            } else if (lClientAction === "OPEN_TILE_SETTINGS") {
              this.openSaveTileDialog(oControlProperties);
            } else if (lClientAction === "GET_APP_URL") {
              this.sCmdSetAppUrl = oControlProperties.getappurlcommand;
              this.sendAppUrl();
            } else if (lClientAction === "NAVIGATE_BACK") {
              this.navigateBack();
            }
          }

          if (oControlProperties.shellapptitle) {
            this.setTitle(oControlProperties.shellapptitle);
          }
        }
      };

      this.setTitle = function(sTitle) {
        if (sap.zen.dsh.sapbi_page && sap.zen.dsh.sapbi_page.appComponent) {
          sap.zen.dsh.sapbi_page.appComponent.getService("ShellUIService"). then(
            function (oShellUIService) {
              if (oShellUIService) {
                oShellUIService.setTitle(sTitle);
              }
            }.bind(this),
            function () {
              // silently do nothing in case the service is not present
            }
          );
        }
      };

      this.setApplicationState = function(sAppState, sHostUI5Control) {
        if (sAppState) {
          var loHostUI5Control = sHostUI5Control && sap.ui.getCore().byId(sHostUI5Control);
          if (loHostUI5Control && loHostUI5Control.fireStateChange) {
            return loHostUI5Control.fireStateChange({state: sAppState});
          }

          // only possible within Fiori Shell
          if (!sap.zen.dsh.sapbi_page.appComponent) {
            return;
          }

          if (sap.ushell && sap.ushell.Container) {
            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation"). then(
              function (oCrossApplicationService) {
                if (this.oAppState) {
                  var loExistingData = this.oAppState.getData();
                  //Avoid overwriting with identical appState
                  if (loExistingData && loExistingData.customData && loExistingData.customData.bookmarkedAppState === sAppState) {
                    return;
                  }
                }

                this.oAppState = oCrossApplicationService.createEmptyAppState(sap.zen.dsh.sapbi_page.appComponent);
                var loAppStateData = {"customData" : {"bookmarkedAppState" : sAppState}};
                this.oAppState.setData(loAppStateData);
                this.oAppState.save();

                sap.ushell.Container.getServiceAsync("ShellNavigation").then(
                  function (oShellService) {
                    /**
                     * - oShellService.hashChanger.replaceHash("sap-iapp-state=" + this.oAppState.getKey());
                     *		No History is written
                     *		Refresh is triggered!
                     *		Back Button: goes to the initial Caller
                     * - oShellService.hashChanger.setHash("sap-iapp-state=" + this.oAppState.getKey());
                     *		No History is written
                     *		Refresh is not triggered on initial load
                     *		Back Button: goes through each hash created <<< ERROR
                     * - oShellService.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);
                     * 		No History is written
                     * 		Refresh is triggered on initial load <<< ERROR
                     * 		Back Button: goes to the initial Caller
                     */
                    if (sap.zen.dsh.iaminjump ) {
                      delete sap.zen.dsh.iaminjump;
                    } else {
                      oShellService.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);
                      //On new state creation, the app hash would change so we need to capture this.
                      this.sendAppUrl();
                    }
                  }.bind(this)
                );
              }.bind(this)
            );
          }
        }
      };

      this.sendAppUrl = function() {
        if (this.sCmdSetAppUrl && this.sCmdSetAppUrl.length > 0) {
          var lBaseUrl;
          var lBaseHash = "";
          var loParams = {};
          if (typeof hasher !== "undefined") {
            var lHash = URI(hasher.getHash());
            lBaseHash = lHash.path();
            loParams = URI.parseQuery(lHash.query());
            lBaseUrl = URI(hasher.getURL()).fragment("").toString();
          } else {
            lBaseUrl = URI("");
          }

          var lCmdSetAppUrl = this.sCmdSetAppUrl;
          lCmdSetAppUrl = that.prepareCommand(lCmdSetAppUrl, "__BASE_URL__", lBaseUrl);
          lCmdSetAppUrl = that.prepareCommand(lCmdSetAppUrl, "__BASE_HASH__", lBaseHash);
          lCmdSetAppUrl = that.prepareCommand(lCmdSetAppUrl, "__PARAM_JSON__", encodeURI(JSON.stringify(loParams)));
          var loFuncAction = new Function(lCmdSetAppUrl);
          loFuncAction();
        }
      };

      this.setSelection = function(oContext, sHostUI5Control) {
        var loHostUI5Control = sHostUI5Control && sap.ui.getCore().byId(sHostUI5Control);
        if (loHostUI5Control && loHostUI5Control.fireSelectionChange) {
          var lNewSelection = JSON.stringify(oContext);
          if (this.sSelection !== lNewSelection) {
            this.sSelection = lNewSelection;
            loHostUI5Control.fireSelectionChange({selection: this.createSelectionVariantObject(oContext)});
          }
        }
      };

      /**
       * Launch "Save As Tile" Dialog
       */
      this.openSaveTileDialog = function(oControlProperties) {
        var that = this;

        var loSaveTileButton = new sap.ushell.ui.footerbar.AddBookmarkButton({
          beforePressHandler: function() {
            if (oControlProperties.shellapptitle) {
              loSaveTileButton.setTitle(oControlProperties.shellapptitle);
            }
            if (oControlProperties.tileSubtitle) {
              loSaveTileButton.setSubtitle(oControlProperties.tileSubtitle);
            }
            if (oControlProperties.tileInfo) {
              loSaveTileButton.setInfo(oControlProperties.tileInfo);
            }
            // loSaveTileButton.setServiceRefreshInterval("10");
          },
          afterPressHandler: function() {
          // no longer required
          /*var loBookmarkTileData = loSaveTileButton.bookmarkTileView.getBookmarkTileData();

          //Save settings here on client for later use on save, if necessary.
          that.oBookmarkTileGroup = loBookmarkTileData.group ? loBookmarkTileData.group.object : null;

          //remove the group object before sending the data to the service
          delete loBookmarkTileData.group;

          that.oBookmarkTileData = loBookmarkTileData;

          if (that.sCmdOnTileSettingsSubmitted && that.sCmdOnTileSettingsSubmitted.length > 0) {
          var loFuncAction = new Function(that.sCmdOnTileSettingsSubmitted);
          loFuncAction();
          }*/
          }
        });
        loSaveTileButton.firePress();
      };

      /**
       * Save Tile (Bookmark Service)
       * 	ATTENTION: when using the Fiori Button this is no longer required
       */
      this.saveTile = function(oControlProperties) {
        if (sap.ushell && sap.ushell.Container) {
          sap.ushell.Container.getServiceAsync("Bookmark").then(
            function (oBookmarkService) {
              var lUrlParameters = oControlProperties.urlparameters;
              if (oBookmarkService) {
                var ltHash = typeof hasher !== "undefined" ? hasher.getHashAsArray() : [""];
                if (oControlProperties.usefrontendtilesettings) {
                  if (lUrlParameters) {
                    //Only if we for some reason had overwrite params here, use the
                    //mixin logic.  Otherwise, take what the save tile did for us.
                    this.oBookmarkTileData.url = this.mixInURLParameters(ltHash, lUrlParameters);
                  }
                  oBookmarkService.addBookmark(this.oBookmarkTileData, this.oBookmarkTileGroup);
                } else {
                  var lUrl = this.mixInURLParameters(ltHash, lUrlParameters);

                  oBookmarkService.addBookmark({
                    title : oControlProperties.title || "",
                    url : lUrl,
                    info : oControlProperties.info || "",
                    subtitle : oControlProperties.subtitle || ""
                  });
                }
              }
            }.bind(this)
          );
        }
      };

      /**
       * Used by Save as Tile to Mix-In URL Parameters
       */
      this.mixInURLParameters = function(tHash, sUrlParameters) {
        var loNewUrlParameters = URI.parseQuery(sUrlParameters);

        var lHashFirstSegment = tHash[0];
        var lHashURI = URI.parse(lHashFirstSegment);
        var loUrlParameters = URI.parseQuery(lHashURI.query);

        for (var lParameter in loNewUrlParameters) {
          if (Object.prototype.hasOwnProperty.call(loNewUrlParameters, lParameter)) {
            loUrlParameters[lParameter] = loNewUrlParameters[lParameter];
          }
        }

        var lUrl = "#" + URI(lHashURI.path).addQuery(loUrlParameters);
        if (tHash.length > 1) {
          if (lHashFirstSegment.endsWith("&") && !lUrl.endsWith("&")) {
            lUrl = lUrl + "&";
          }

          for (var lHashIdx = 1; lHashIdx < tHash.length; ++lHashIdx) {
            lUrl = lUrl + "/" + tHash[lHashIdx];
          }
        }

        return lUrl;
      };

      this.navigateBack = function() {
        if (sap.ushell && sap.ushell.Container) {
          sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
            function (oCrossApplicationService) {
              if (oCrossApplicationService) {
                oCrossApplicationService.backToPreviousApp();
              }
            }.bind(this)
          );
        }
      };

      /**
       * Jump to Target
       */
      this.jumpToTarget = function(oControlProperties) {
        if (sap.ushell && sap.ushell.Container) {
          sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
            function (oCrossApplicationService) {
              var lHash = oControlProperties.hash;

              if (oCrossApplicationService && lHash && lHash.length > 0) {
                if (oControlProperties.navigateinplace) {
                  sap.zen.dsh.iaminjump = true;
                  oCrossApplicationService.toExternal({
                    target: { shellHash: lHash }
                  });
                }
                else {
                  window.open(lHash);
                }
              }
            }.bind(this)
          );
        }
      };

      /**
       * Fetch Jump Targets
       * 	based on allowed Targets  retrieve all valid Targets for Navigation
       * 	add Variable and Filter Information for Navigation
       * 	send all Navigations to frontend for display
       */
      this.fetchJumpTargets = function(oControlProperties) {
        // call this first to ensure we have the information before Context is modified
        this.determineAllowedSemanticSources(oControlProperties);

        var loContext = oControlProperties.context;
        var loSelectionVariant = this.createSelectionVariantObject(loContext);

        var loParams = {}; //These will be passed as URL parameters -- extra info only.
        // Now we can add the (redundant) selections to URL parameters.
        // first add selection information ...
        this.addNameSelectionPairFromArray(loContext.selections, loParams);
        // ... then add filter information ...
        this.addNameSelectionPairFromArray(loContext.filter, loParams);
        // ... and then add variables
        this.addNameSelectionPairFromArray(loContext.variables, loParams);

        if (sap.ushell && sap.ushell.Container) {
          sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
            function (oCrossApplicationService) {
              var lAppStateKey;
              if (loSelectionVariant !== undefined && sap.zen.dsh.sapbi_page && sap.zen.dsh.sapbi_page.appComponent) {
                var loAppState = oCrossApplicationService.createEmptyAppState(sap.zen.dsh.sapbi_page.appComponent);
                var loAppStateData = {"selectionVariant" : loSelectionVariant};
                loAppState.setData(loAppStateData);
                loAppState.save();
                lAppStateKey = loAppState.getKey();
              }
              this.determineValidJumpTargets(oCrossApplicationService, loParams, lAppStateKey, oControlProperties);
            }.bind(this)
          );
        }
      };

      /**
       * Retrieve allowed Targets
       */
      this.determineAllowedSemanticSources = function(oControlProperties) {
        this.aAllowedSemanticSources = [];

        if (oControlProperties.navigation && oControlProperties.navigation.allowed_semantic_sources) {
          var lLength = oControlProperties.navigation.allowed_semantic_sources.length;
          if (lLength && lLength > 0) {
            for (var i = 0; i < lLength; i++) {
              this.aAllowedSemanticSources.push(oControlProperties.navigation.allowed_semantic_sources[i].entry.semanticname);
            }
          }
        }

        return this.aAllowedSemanticSources;
      };


      /**
       * Determine valid Targets from UI5 Cross-Application-Navigation Service
       */
      this.determineValidJumpTargets = function(oCrossAppNav, oParams, sAppStateKey, oControlProperties) {
        this.aValidJumpTargets = [];

        var ltLinks = [];
        this.aAllowedSemanticSources.forEach(function(sSemanticObject) {
          ltLinks.push([{
            semanticObject: sSemanticObject,
            params: oParams,
            ignoreFormFactor: false,
            ui5Component: sap.zen.dsh.sapbi_page.appComponent,
            appStateKey: sAppStateKey,
            compactIntents: false}]);
        });

        var lSelfLink = oCrossAppNav.hrefForAppSpecificHash("");
        if (lSelfLink) {
          var lIndex = lSelfLink.indexOf("?");
          lSelfLink = lSelfLink.substring(0, lIndex > 0 ? lIndex : lSelfLink.length - 2);
        }

        var ltIntents = [];
        oCrossAppNav.getLinks(ltLinks).done(function(tObjectLinks) {
          //Will return an array of arrays of arrays of links.
          tObjectLinks.forEach(function(tLinks) {
            tLinks[0].forEach(function(oLink) {
              if (oLink.text && oLink.intent && oLink.intent !== lSelfLink && oLink.intent.indexOf(lSelfLink + "?") !== 0) {
                //Only take links which have a text and intent is not pointing to on the same app
                ltIntents.push(oLink);
              }
            });
          });

          //Sort the complete list by text
          ltIntents.sort(function (a, b) {
            return a.text.localeCompare(b.text);
          });

          if (ltIntents && ltIntents.length > 0) {
            for (var i = 0; i < ltIntents.length; ++i) {
              var loIntent = ltIntents[i];
              that.aValidJumpTargets.push({"text" : loIntent.text, "hash" : loIntent.intent});
            }
          }

          that.sendJumpTargetsToRuntime(oControlProperties.onjumptargetsfetchedcommand);
        });
      };

      /**
       * Create Selection Variant Object containing the State of the Query (Variables and Filters)
       * omit things which are already in the Parameters
       */
      this.createSelectionVariantObject = function(oContext) {
        if (!oContext) {
          return;
        }

        // Mind the priorities after having added the main context information above:
        // first add filter information ...
        var loSelectionVariantObject = {};
        var loSelectOptions = this.getSelectOptions(oContext);
        if (loSelectOptions !== undefined) {
          loSelectionVariantObject.SelectOptions = loSelectOptions;
          loSelectionVariantObject.SelectionVariantID = new Date().toISOString();
          loSelectionVariantObject.Text = "Temporary Variant " + loSelectionVariantObject.SelectionVariantID;
          return loSelectionVariantObject;
        }
      };

      /**
       * Used when creating Selection Variant to add Variables and Filters
       */
      this.getSelectOptions = function(oContext) {
        var loSelectOptions = {};
        var ltSelectOptions = [];

        this.addSelectOptionsFromArray(oContext.selections, loSelectOptions);
        this.addSelectOptionsFromArray(oContext.filter, loSelectOptions);
        this.addSelectOptionsFromArray(oContext.variables, loSelectOptions);

        for (var lSelectOptionProperty in loSelectOptions) {
          if (Object.prototype.hasOwnProperty.call(loSelectOptions, lSelectOptionProperty)) {
            ltSelectOptions.push({"PropertyName" : lSelectOptionProperty, "Ranges" : loSelectOptions[lSelectOptionProperty]});
          }
        }

        if (ltSelectOptions.length > 0) {
          return ltSelectOptions;
        }
      };

      /**
       * Used when creating Selection Options for the Selection Variant
       */
      this.addSelectOptionsFromArray = function(aSelectionArray, oSelectOptions) {
        if (aSelectionArray) {
          var iLength = aSelectionArray.length;
          if (iLength > 0) {
            for (var i = 0; i < iLength; i++) {
              var sName = aSelectionArray[i].dimension.name;

              if (sName && sName.length > 0 && !Object.prototype.hasOwnProperty.call(oSelectOptions, sName)) {
                if (aSelectionArray[i].dimension.selection) {
                  //Single string value, for single-value variable support.  Might be soon removable.
                  oSelectOptions[sName] = [{"Sign" : "I", "Option" : "EQ", "Low" : aSelectionArray[i].dimension.selection, "High" : null}];
                } else if ( aSelectionArray[i].dimension.selections && aSelectionArray[i].dimension.selections.length > 0) {
                  //In selectoption format:  An array of individual range objects.
                  oSelectOptions[sName] = aSelectionArray[i].dimension.selections.map(function (selection) {
                    if (selection.LowType !== "DATE") {
                      return selection;
                    }
                    //clone object and "extend" the date
                    var to = {};
                    for (var nextKey in selection) {
                      if (Object.prototype.hasOwnProperty.call(selection, nextKey)) {
                        to[nextKey] = (nextKey === "Low" || nextKey === "High") && selection[nextKey] ? selection[nextKey] + "T00:00:00.000Z" : selection[nextKey];
                      }
                    }
                    return to;
                  });
                }
              }
            }
          }
        }
      };

      /**
       * Extra Parameters Information in the URL (Variable and Filter)
       */
      this.addNameSelectionPairFromArray = function(aArray, oParams) {
        var sName, sSelection, aSelections;

        if (aArray && oParams) {
          var iLength = aArray.length;
          if (iLength > 0) {
            for (var i = 0; i < iLength; i++) {
              sName = aArray[i].dimension.name;
              if (sName && sName.length > 0 && !oParams[sName]) {
                //A single "selection" entry  means it's a variable value.
                sSelection = aArray[i].dimension.selection;
                if (sSelection && sSelection.length > 0) {
                  oParams[sName] = sSelection;
                } else {
                  //"selections" means it's in the format of an array of selection objects.
                  //Only single-value == comparisons will be taken here, as others are not possible to express in URL-parameters.
                  aSelections = aArray[i].dimension.selections;
                  if (aSelections && aSelections.length === 1 && aSelections[0].Sign && aSelections[0].Sign === "I" && aSelections[0].Option && aSelections[0].Option === "EQ") {
                    oParams[sName] = aSelections[0].Low === "#" ? "" : aSelections[0].Low;
                    if (aSelections[0].LowType === "DATE") {
                      oParams[sName] = oParams[sName] + "T00:00:00.000Z";
                    }
                  }
                }
              }
            }
          }
        }
      };

      /**
       * Send Valid Jump Targets to the Runtime for Display
       */
      this.sendJumpTargetsToRuntime = function(sOnjumptargetsfetchedcommand) {
        if (sOnjumptargetsfetchedcommand && sOnjumptargetsfetchedcommand.length > 0) {
          var lResultJSON = JSON.stringify(this.aValidJumpTargets);
          lResultJSON = encodeURI(lResultJSON);

          var lMethod = that.prepareCommand(sOnjumptargetsfetchedcommand, "__JUMPTARGETS__", lResultJSON);
          var loFuncAction = new Function(lMethod);
          loFuncAction();
        }
      };

      this.getDefaultProxyClass = function() {
        return ["sap.m.Button", "sap.ui.commons.Button"];
      };

      this.getType = function() {
        return "fiorihelper";
      };
    };

    var instance = new FioriHelperHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
