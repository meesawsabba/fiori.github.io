/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* eslint-disable complexity */
/* global $ */
sap.ui.define([
    "sap/base/Log",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/ui/layout/HorizontalLayout",
    "sap/ui/vbm/Container",
    "sap/ui/vk/MapContainer",
    "sap/ui/vk/ContainerContent",
    "sap/ui/vbm/GeoMap",
    "sap/ui/vbm/Containers",
    "sap/ui/vbm/Spot",
    "sap/ui/vbm/Spots",
], function (Log, Button, ButtonType, HorizontalLayout, Container, MapContainer, ContainerContent, GeoMap, Containers, Spot, Spots) {
    "use strict";
    return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchResultMap", {
        teststring: "",
        ContainerContent: null,
        MapContainer: null,
        minLat: 0,
        minLon: 0,
        maxLat: 0,
        maxLon: 0,
        centerLat: 0,
        centerLon: 0,
        iNrLocations: 0,
        myMap: null,
        myMapContainer: null,
        metadata: {
            aggregations: {
                _map: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "hidden",
                },
            },
        },
        init: function () {
            var that = this;
            // default map configuration
            var oMapConfig = {
                MapProvider: [
                    {
                        name: "OPENSTREETMAP",
                        type: "",
                        description: "",
                        tileX: "256",
                        tileY: "256",
                        maxLOD: "19",
                        copyright: "© openstreetmap",
                        Source: [
                            {
                                id: "s1",
                                url: "http://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png",
                            },
                            {
                                id: "s2",
                                url: "http://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png",
                            },
                            {
                                id: "s3",
                                url: "http://c.tile.openstreetmap.org/{LOD}/{X}/{Y}.png",
                            },
                        ],
                    },
                ],
                MapLayerStacks: [
                    {
                        name: "DEFAULT",
                        MapLayer: {
                            name: "Open Street Map Layer",
                            refMapProvider: "OPENSTREETMAP",
                            opacity: "1",
                            colBkgnd: "RGB(255,255,255)",
                        },
                    },
                ],
            };
            try {
                that.MapContainer = MapContainer;
                that.ContainerContent = ContainerContent;
            }
            catch (e) {
                //cannot find vk library
            }
            that.geoMap = new GeoMap(this.getId() + "-sapUshellSearchGeoMap", {
                legendVisible: false,
                scaleVisible: false,
                refMapLayerStack: "DEFAULT",
                mapConfiguration: {
                    parts: [{ path: "/config/mapProvider" }],
                    formatter: function (mapProviderConfig) {
                        // adapt user configured map provider
                        if (mapProviderConfig !== undefined &&
                            typeof mapProviderConfig === "object" &&
                            mapProviderConfig.name &&
                            mapProviderConfig.name.length > 0) {
                            oMapConfig.MapProvider.push(mapProviderConfig);
                            oMapConfig.MapLayerStacks[0].MapLayer.refMapProvider = mapProviderConfig.name;
                        }
                        return oMapConfig;
                    },
                },
            });
            if (that.MapContainer && that.ContainerContent) {
                var cc = new that.ContainerContent({
                    content: that.geoMap,
                });
                this.myMapContainer = new that.MapContainer({
                    content: [cc],
                    showRectangularZoom: true,
                    showHome: true,
                    showFullScreen: false,
                    showSettings: false,
                    showSelection: false,
                });
                that.myMap = that.myMapContainer.getContent()[0].getAggregation("content");
                that.setAggregation("_map", this.myMapContainer);
            }
            else {
                that.setAggregation("_map", that.geoMap);
                that.myMap = that.getAggregation("_map");
            }
        },
        renderer: function (oRm, oControl) {
            oControl.loadObjects(oControl);
            oRm.write("<div ");
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchResultMap");
            oRm.writeClasses();
            oRm.write(">");
            if (oControl.MapContainer) {
                // eslint-disable-line no-lonely-if
                oRm.renderControl(oControl.myMapContainer);
            }
            else {
                oRm.renderControl(oControl.myMap);
            }
            oRm.write("</div>");
        },
        deg2rad: function (deg) {
            return (Math.PI * deg) / 180;
        },
        getSpotList: function () {
            var that = this;
            var spotList = new Containers();
            var oResults = that.getModel().oData.boResults;
            var iNrLocations = 0;
            var oResultItem, oLoc4326, sTitle, aCoordinates, lon, lat, spot, minLon, maxLon, minLat, maxLat, i;
            for (i = 0; i < oResults.length; i++) {
                oResultItem = oResults[i];
                oLoc4326 = {};
                if (!oResultItem.geoJson) {
                    //on same level as navigationTargets
                    continue;
                }
                if (typeof oResultItem.geoJson.value === "string") {
                    oLoc4326 = JSON.parse(oResultItem.geoJson.value);
                }
                else {
                    //Karl demo
                    oLoc4326.coordinates = oResultItem.geoJson.value.coordinates;
                }
                sTitle = oResultItem.geoJson.label;
                if (sTitle === "LOC_4326" || sTitle === "LOCATION" || sTitle === undefined) {
                    sTitle = oResultItem.title;
                }
                if (sTitle === "LOC_4326" || sTitle === "LOCATION" || sTitle === undefined) {
                    for (var j = 0; j < oResultItem.itemattributes.length; j++) {
                        if (oResultItem.itemattributes[j].isTitle === true) {
                            sTitle = oResultItem.itemattributes[j].value;
                            break;
                        }
                    }
                }
                if (sTitle === undefined || typeof sTitle !== "string") {
                    sTitle = "unlabeled location";
                }
                else {
                    sTitle = sTitle.replace(/<[^>]*>/g, ""); //remove html
                }
                aCoordinates = oLoc4326.coordinates;
                if (!aCoordinates || aCoordinates.length === 0) {
                    continue;
                }
                lon = aCoordinates[0];
                lat = aCoordinates[1];
                if (isNaN(lat) || isNaN(lon)) {
                    continue;
                }
                iNrLocations++;
                if (iNrLocations === 1) {
                    minLon = lon;
                    maxLon = lon;
                    minLat = lat;
                    maxLat = lat;
                }
                else {
                    if (lon < minLon) {
                        minLon = lon;
                    }
                    if (lon > maxLon) {
                        maxLon = lon;
                    }
                    if (lat < minLat) {
                        minLat = lat;
                    }
                    if (lat > maxLat) {
                        maxLat = lat;
                    }
                }
                that.minLon = minLon;
                that.maxLon = maxLon;
                that.minLat = minLat;
                that.maxLat = maxLat;
                var oText = new Button({
                    text: sTitle, //,
                    //tooltip: sAddress
                });
                var oButton0 = new Button({
                    icon: "sap-icon://map",
                    type: ButtonType.Emphasized,
                });
                var oSpot = new HorizontalLayout({
                    content: [oButton0, oText],
                });
                spot = new Container({
                    position: lon + ";" + lat + ";0",
                    item: oSpot,
                    alignment: 6,
                });
                spotList.addItem(spot);
            }
            that.iNrLocations = iNrLocations;
            if (iNrLocations === 0) {
                spotList = that.getSpotList2();
            }
            return spotList;
        },
        getSpotList2: function () {
            //legacy variation
            var that = this;
            //var oResults = that.getModel().oData.results;
            var oResults = that.getModel().oData.origBoResults.elements;
            //oResults = JSON.parse(that.teststring);
            var oResultItem, oLoc4326, sTitle, aCoordinates, lon, lat, spot;
            //var sAddress, iAddress;
            var spotList = new Containers();
            var iNrLocations = 0;
            var minLon, maxLon, minLat, maxLat;
            //find index locations of data in listing tree
            var cnt = 0;
            for (var key in oResults) {
                if (!Object.prototype.hasOwnProperty.call(oResults, key)) {
                    // eslint-disable-line no-prototype-builtins
                    continue;
                }
                oResultItem = oResults[key];
                if (!oResultItem.LOC_4326) {
                    continue;
                }
                oLoc4326 = oResultItem.LOC_4326;
                for (var key2 in oResultItem) {
                    if (!Object.prototype.hasOwnProperty.call(oResultItem, key2)) {
                        // eslint-disable-line no-prototype-builtins
                        continue;
                    }
                    var oAttribute = oResultItem[key2];
                    sTitle = "";
                    var titleFound = false;
                    if (oAttribute.$$MetaData$$) {
                        var arPresentationusage = oAttribute.$$MetaData$$.presentationUsage;
                        if (arPresentationusage && typeof arPresentationusage.length !== "undefined") {
                            for (var j = 0; j < arPresentationusage.length; j++) {
                                if (arPresentationusage[j] == "Title") {
                                    sTitle = oAttribute.value;
                                    sTitle = sTitle.replace(/<[^>]*>/g, ""); //remove html
                                    titleFound = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (titleFound) {
                        break;
                    }
                }
                aCoordinates = null;
                try {
                    aCoordinates = JSON.parse(oLoc4326.value).coordinates;
                }
                catch (e) {
                    //do nothing
                }
                if (!aCoordinates || aCoordinates.length === 0) {
                    continue;
                }
                iNrLocations++;
                lon = aCoordinates[0];
                lat = aCoordinates[1];
                if (isNaN(lat) || isNaN(lon)) {
                    continue;
                }
                cnt++;
                if (cnt === 1) {
                    minLon = lon;
                    maxLon = lon;
                    minLat = lat;
                    maxLat = lat;
                }
                else {
                    if (lon < minLon) {
                        minLon = lon;
                    }
                    if (lon > maxLon) {
                        maxLon = lon;
                    }
                    if (lat < minLat) {
                        minLat = lat;
                    }
                    if (lat > maxLat) {
                        maxLat = lat;
                    }
                }
                that.minLon = minLon;
                that.maxLon = maxLon;
                that.minLat = minLat;
                that.maxLat = maxLat;
                var oText = new Button({
                    text: sTitle,
                });
                var oButton0 = new Button({
                    icon: "sap-icon://map",
                    type: ButtonType.Emphasized,
                });
                var oSpot = new HorizontalLayout({
                    content: [oButton0, oText],
                });
                spot = new Container({
                    position: lon + ";" + lat + ";0",
                    item: oSpot,
                    alignment: 6,
                });
                spotList.addItem(spot);
            }
            that.iNrLocations = iNrLocations;
            return spotList;
        },
        loadObjects: function () {
            var that = this;
            var spotList = that.getSpotList();
            Log.debug("++++++");
            Log.debug("number of locations: " + that.iNrLocations);
            that.myMap.removeAllVos();
            that.myMap.addVo(spotList);
            var parameters = that.getModel().config.parseUrlParameters();
            for (var parameter in parameters) {
                if (parameter === "box" && parameters[parameter] !== "false") {
                    that.showBoundariesAndCenter();
                }
            }
        },
        setVisualFrame: function () {
            var that = this;
            var oVisFrame = {};
            oVisFrame.minLon = that.minLon * 0.5;
            oVisFrame.maxLon = that.maxLon * 1.2;
            oVisFrame.minLat = that.minLat * 0.8;
            oVisFrame.maxLat = that.maxLat * 1.2;
            that.myMap.setVisualFrame(oVisFrame);
        },
        showBoundariesAndCenter: function () {
            var that = this;
            var center = new Spots({
                items: [
                    new Spot({
                        type: "Error",
                        text: "center",
                        position: that.centerLon + " ;  " + that.centerLat + ";0", //,
                        // click: onClick
                    }),
                    new Spot({
                        type: "Error",
                        text: "TLeft",
                        position: that.minLon + " ;  " + that.maxLat + ";0", //,
                        // click: onClick
                    }),
                    new Spot({
                        type: "Error",
                        text: "TRight",
                        position: that.maxLon + " ;  " + that.maxLat + ";0", //,
                        // click: onClick
                    }),
                    new Spot({
                        type: "Error",
                        text: "BLeft",
                        position: that.minLon + " ;  " + that.minLat + ";0", //,
                        // click: onClick
                    }),
                    new Spot({
                        type: "Error",
                        text: "BRight",
                        position: that.maxLon + " ;  " + that.minLat + ";0", //,
                        // click: onClick
                    }),
                ],
            });
            that.myMap.addVo(center);
        },
        resizeMap: function () {
            var h = $(".sapUshellSearchResultListsContainer").parent().parent().height();
            h = 0.85 * h;
            h = "" + h + "px";
            var searchGeoMapId = document.querySelectorAll('[id$="-sapUshellSearchGeoMap"]')[0].id; // TODO: ID  --> always matches first instance of search control
            sap.ui.getCore().byId(searchGeoMapId).setHeight(h);
            var w = $(".sapUshellSearchResultListsContainer").parent().parent().width();
            w = "" + w + "px";
            sap.ui.getCore().byId(searchGeoMapId).setWidth(w);
        },
        onAfterRendering: function () {
            var that = this;
            // ensure that the containing object has a senisble height (not 0!)
            that.resizeMap();
            window.onresize = that.resizeMap;
        },
    });
});
