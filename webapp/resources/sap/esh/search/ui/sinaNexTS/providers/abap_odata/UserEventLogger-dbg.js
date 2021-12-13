/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports", "./ajaxTemplates", "../../core/util"], function (require, exports, ajaxTemplates, util) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserEventLogger = exports.UserEventType = void 0;
    var UserEventType;
    (function (UserEventType) {
        UserEventType["ITEM_NAVIGATE"] = "ITEM_NAVIGATE";
        UserEventType["SUGGESTION_SELECT"] = "SUGGESTION_SELECT";
        UserEventType["SEARCH_REQUEST"] = "SEARCH_REQUEST";
        UserEventType["RESULT_LIST_ITEM_NAVIGATE_CONTEXT"] = "RESULT_LIST_ITEM_NAVIGATE_CONTEXT";
        UserEventType["SUGGESTION_REQUEST"] = "SUGGESTION_REQUEST";
        UserEventType["TILE_NAVIGATE"] = "TILE_NAVIGATE";
        UserEventType["SHOW_MORE"] = "SHOW_MORE";
        UserEventType["BROWSER_CLOSE"] = "BROWSER_CLOSE";
        UserEventType["LEAVE_PAGE"] = "LEAVE_PAGE";
        UserEventType["SESSION_START"] = "SESSION_START";
        UserEventType["RESULT_LIST_ITEM_NAVIGATE"] = "RESULT_LIST_ITEM_NAVIGATE";
        UserEventType["OBJECT_SUGGESTION_NAVIGATE"] = "OBJECT_SUGGESTION_NAVIGATE";
        UserEventType["DROPDOWN_SELECT_DS"] = "DROPDOWN_SELECT_DS";
        UserEventType["DATASOURCE_CHANGE"] = "DATASOURCE_CHANGE";
        UserEventType["FACET_FILTER_ADD"] = "FACET_FILTER_ADD";
        UserEventType["FACET_FILTER_DEL"] = "FACET_FILTER_DEL";
        UserEventType["ITEM_SHOW_DETAILS"] = "ITEM_SHOW_DETAILS";
        UserEventType["ITEM_HIDE_DETAILS"] = "ITEM_HIDE_DETAILS";
        UserEventType["CLEAR_ALL_FILTERS"] = "CLEAR_ALL_FILTERS";
        UserEventType["FACET_SHOW_MORE"] = "FACET_SHOW_MORE";
        UserEventType["FACET_SHOW_MORE_CLOSE"] = "FACET_SHOW_MORE_CLOSE";
    })(UserEventType = exports.UserEventType || (exports.UserEventType = {}));
    var UserEventLogger = /** @class */ (function () {
        function UserEventLogger(provider) {
            this.provider = provider;
            this.sina = provider.sina;
            this.delayedConsumer = new util.DelayedConsumer({
                timeDelay: 2000,
                consumer: this.processEvents,
                consumerContext: this,
            });
        }
        UserEventLogger.prototype.logUserEvent = function (event) {
            event.timeStamp = new Date().getTime();
            if (event.type !== "ITEM_NAVIGATE") {
                this.delayedConsumer.add(event);
            }
            if (event.type === "ITEM_NAVIGATE" && event.sourceUrlArray.length !== 0) {
                this.incrementClickCounter(event.targetUrl, event.systemAndClient);
            }
        };
        UserEventLogger.prototype.processEvents = function (events) {
            var request = {
                ID: 1,
                SessionID: this.provider.sessionId,
                Events: [],
            };
            for (var i = 0; i < events.length; ++i) {
                var event_1 = events[i];
                //                var year = event.timeStamp.substring(0, 4);
                //                var month = event.timeStamp.substring(4, 6);
                //                month = ("0" + (parseInt(month) - 1).toString()).slice(-2);
                //                // month minus 1, convert to 2-digit string leading with 0
                //                var day = event.timeStamp.substring(6, 8);
                //                var hours = event.timeStamp.substring(8, 10);
                //                var minutes = event.timeStamp.substring(10, 12);
                //                var seconds = event.timeStamp.substring(12, 14);
                //                var milliseconds = event.timeStamp.substring(14, 17);
                //                var oDataTimeStemp = Math.round(+new Date(year, month, day, hours, minutes, seconds, milliseconds))+i;
                var timeStampString = "\\/Date(" + event_1.timeStamp + ")\\/";
                var odataEvent = {
                    ID: i + 1,
                    Type: event_1.type,
                    Timestamp: timeStampString,
                    //frank
                    ExecutionID: event_1.executionId,
                    Parameters: [],
                };
                for (var name_1 in event_1) {
                    if (name_1 === "type" || name_1 === "timeStamp") {
                        continue;
                    }
                    var value = event_1[name_1];
                    if (typeof value === "undefined") {
                        continue;
                    }
                    if (typeof value !== "object") {
                        value = value.toString();
                    }
                    else {
                        value = JSON.stringify(value);
                    }
                    odataEvent.Parameters.push({
                        Name: name_1,
                        Value: value,
                    });
                }
                request.Events.push(odataEvent);
            }
            var requestUrl = this.provider.buildQueryUrl(this.provider.requestPrefix, "/InteractionEventLists");
            return this.provider.ajaxClient.postJson(requestUrl, request);
        };
        UserEventLogger.prototype.incrementClickCounter = function (targetUrl, systemAndClient) {
            //targetUrl: #EPMPurchaseOrder-displayFactSheet?PurchaseOrderInternalId=3440B5B014B21EE798DDB43D63E56068
            if (!targetUrl) {
                return undefined;
            }
            if (targetUrl.indexOf("#") === -1) {
                return undefined;
            }
            var getSemanticObjectType = function (sHash) {
                return sHash.split("-")[0];
            };
            var getIntent = function (sHash) {
                return sHash.split("-")[1].split("&")[0];
            };
            var getParameterList = function (aParameter) {
                var parameterList = aParameter;
                var eventParameters = [];
                for (var i = 0, len = parameterList.length; i < len; i++) {
                    var param = parameterList[i];
                    if (param.indexOf("sap-system") !== -1) {
                        continue;
                    }
                    var name_2 = param.split("=")[0];
                    var value = param.split("=")[1];
                    eventParameters.push({
                        Name: name_2,
                        Value: value,
                    });
                }
                return eventParameters;
            };
            var hashAsArray = targetUrl.split("?");
            var targetSemanticObjectType = getSemanticObjectType(hashAsArray[0]).split("#")[1];
            var targetIntent = getIntent(hashAsArray[0]);
            var targetParameterList = hashAsArray[1] !== undefined ? getParameterList(hashAsArray[1].split("&")) : [];
            var requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.navigationEvent));
            requestTemplate.SemanticObjectType = targetSemanticObjectType;
            requestTemplate.Intent = targetIntent;
            //frank
            if (systemAndClient.systemId.length === 0 || systemAndClient.client.length === 0) {
                delete requestTemplate.System;
                delete requestTemplate.Client;
            }
            else {
                requestTemplate.System = systemAndClient.systemId;
                requestTemplate.Client = systemAndClient.client;
            }
            requestTemplate.Parameters = targetParameterList;
            var requestUrl = this.provider.buildQueryUrl(this.provider.requestPrefix, "/NavigationEvents");
            return this.provider.ajaxClient.postJson(requestUrl, requestTemplate);
        };
        return UserEventLogger;
    }());
    exports.UserEventLogger = UserEventLogger;
});
})();