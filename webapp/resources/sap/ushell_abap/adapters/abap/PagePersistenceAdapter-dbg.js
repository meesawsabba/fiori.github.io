// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview PagePersistenceAdapter for the ABAP platform.
 * @version 1.96.0
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/odata/ODataMetadata",
    "sap/ushell/resources",
    "sap/ushell/utils/chipsUtils"
], function (ObjectPath, ODataModel, ODataMetadata, resources, chipsUtils) {

    "use strict";

    /**
     * Gets the service url from window["sap-ushell-config"].services.PagePersistence.
     *
     * If the metadata updates because there is a change in the backend, then the metadataString and the metadata JSON string must be updated.
     *
     * @returns {string} the service url.
     */
    function getServiceUrl () {
        var oServiceConfig = (window["sap-ushell-config"].services && window["sap-ushell-config"].services.PagePersistence) || {};
        return (ObjectPath.get("config.serviceUrl", oServiceConfig.adapter) || "").replace(/\/?$/, "/");
    }

    var fnOrig = ODataMetadata.prototype._loadMetadata;
    ODataMetadata.prototype._loadMetadata = function (sUrl, bSuppressEvents) {
        if (this.sUrl && this.sUrl.indexOf(getServiceUrl()) >= 0) {
            var mParams = {
                // Metadata string was retrieved by calling /sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata
                // eslint-disable-next-line
                metadataString: '<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData" Version="1.0"> <edmx:DataServices m:DataServiceVersion="2.0"> <Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace=".UI2.FDM_PAGE_REPOSITORY_SRV" xml:lang="en" sap:schema-version="1"> <EntityType Name="Page" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Page ID" sap:updatable="false"/> <Property Name="title" Type="Edm.String" MaxLength="100" sap:unicode="false" sap:label="Page Description"/> <Property Name="description" Type="Edm.String" MaxLength="100" sap:unicode="false" sap:label="Page Description"/> <NavigationProperty Name="sections" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section" FromRole="FromRole_Page_Section" ToRole="ToRole_Page_Section"/> <NavigationProperty Name="vizReferences" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_VizReferences" FromRole="FromRole_Page_VizReferences" ToRole="ToRole_Page_VizReferences"/> <NavigationProperty Name="tileTypes" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_TileTypes" FromRole="FromRole_Page_TileTypes" ToRole="ToRole_Page_TileTypes"/> </EntityType> <EntityType Name="Section" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Page Section ID" sap:updatable="false"/> <Property Name="title" Type="Edm.String" MaxLength="100" sap:unicode="false" sap:label="Page Description" sap:filterable="false"/> <Property Name="sectionIndex" Type="Edm.Int16" Nullable="false" sap:unicode="false" sap:label="Page Section Index" sap:filterable="false"/> <NavigationProperty Name="viz" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz" FromRole="FromRole_Section_Viz" ToRole="ToRole_Section_Viz"/> </EntityType> <EntityType Name="Viz" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="displayFormatHint" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Display Hint" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="id" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Assignment Item ID" sap:updatable="false"/> <Property Name="itemIndex" Type="Edm.Int16" Nullable="false" sap:unicode="false" sap:label="Assignment Index"/> <Property Name="targetMappingId" Type="Edm.String" sap:unicode="false" sap:label="Target Mapping Compound String"/> <Property Name="catalogTileId" Type="Edm.String" sap:unicode="false" sap:label="Catalog Tile Compound String"/> <NavigationProperty Name="vizReference" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz_VizReference" FromRole="FromRole_Viz_VizReference" ToRole="ToRole_Viz_VizReference"/> </EntityType> <EntityType Name="VizReference" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="catalogDisplayId" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Catalog Display ID" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="title" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Tile Title" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="subTitle" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Tile Subtitle" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="iconUrl" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Tile Icon URL" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="targetMappingId" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Item ID" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="semanticObject" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Semantic Object" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="semanticAction" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Action" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="id" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Catalog Tile ID" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="deviceDesktop" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Device Type Desktop" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="deviceTablet" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Device Type Tablet" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="devicePhone" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Device Type Phone" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="tileType" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Tile Type" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="catalogTileId" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Catalog Tile ID" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="parameters" Type="Edm.String" sap:label="PARAMETERS"/> <Property Name="configuration" Type="Edm.String" sap:label="CONFIGURATION"/> <NavigationProperty Name="chipBags" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_ChipBag" FromRole="FromRole_VizReference_ChipBag" ToRole="ToRole_VizReference_ChipBag"/> <NavigationProperty Name="tileTypeRef" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_TileType" FromRole="FromRole_VizReference_TileType" ToRole="ToRole_VizReference_TileType"/> </EntityType> <EntityType Name="TileType" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" MaxLength="255" sap:unicode="false" sap:label="CHIP Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="url" Type="Edm.String" Nullable="false" sap:unicode="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <NavigationProperty Name="vizOptions" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.TileType_VizOption" FromRole="FromRole_TileType_VizOption" ToRole="ToRole_TileType_VizOption"/> </EntityType> <EntityType Name="VizOption" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" MaxLength="255" sap:unicode="false" sap:label="CHIP Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <NavigationProperty Name="displayFormats" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption_DisplayOption" FromRole="FromRole_VizOption_DisplayOption" ToRole="ToRole_VizOption_DisplayOption"/> </EntityType> <EntityType Name="DisplayOption" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="preferred" Type="Edm.String" Nullable="false" sap:unicode="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="id" Type="Edm.String" Nullable="false" MaxLength="255" sap:unicode="false" sap:label="CHIP Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <NavigationProperty Name="supported" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption_DisplayFormat" FromRole="FromRole_DisplayOption_DisplayFormat" ToRole="ToRole_DisplayOption_DisplayFormat"/> </EntityType> <EntityType Name="DisplayFormat" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" sap:unicode="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> </EntityType> <EntityType Name="ChipBag" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <NavigationProperty Name="properties" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag_ChipBagProperties" FromRole="FromRole_ChipBag_ChipBagProperties" ToRole="ToRole_ChipBag_ChipBagProperties"/> </EntityType> <EntityType Name="ChipBagProperty" sap:content-version="1"> <Key> <PropertyRef Name="id"/> </Key> <Property Name="id" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="value" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> <Property Name="translatable" Type="Edm.Boolean" Nullable="false" sap:label="Indicator" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/> </EntityType> <Association Name="VizOption_DisplayOption" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption" Multiplicity="1" Role="FromRole_VizOption_DisplayOption"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption" Multiplicity="1" Role="ToRole_VizOption_DisplayOption"/> </Association> <Association Name="Viz_VizReference" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz" Multiplicity="*" Role="FromRole_Viz_VizReference"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference" Multiplicity="1" Role="ToRole_Viz_VizReference"/> </Association> <Association Name="ChipBag_ChipBagProperties" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag" Multiplicity="1" Role="FromRole_ChipBag_ChipBagProperties"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBagProperty" Multiplicity="*" Role="ToRole_ChipBag_ChipBagProperties"/> </Association> <Association Name="Page_VizReferences" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Page" Multiplicity="1" Role="FromRole_Page_VizReferences"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference" Multiplicity="*" Role="ToRole_Page_VizReferences"/> </Association> <Association Name="Page_TileTypes" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Page" Multiplicity="1" Role="FromRole_Page_TileTypes"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.TileType" Multiplicity="*" Role="ToRole_Page_TileTypes"/> </Association> <Association Name="Page_Section" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Page" Multiplicity="1" Role="FromRole_Page_Section"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Section" Multiplicity="*" Role="ToRole_Page_Section"/> </Association> <Association Name="VizReference_ChipBag" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference" Multiplicity="1" Role="FromRole_VizReference_ChipBag"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag" Multiplicity="*" Role="ToRole_VizReference_ChipBag"/> </Association> <Association Name="VizReference_TileType" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference" Multiplicity="*" Role="FromRole_VizReference_TileType"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.TileType" Multiplicity="1" Role="ToRole_VizReference_TileType"/> </Association> <Association Name="Section_Viz" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Section" Multiplicity="1" Role="FromRole_Section_Viz"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz" Multiplicity="*" Role="ToRole_Section_Viz"/> </Association> <Association Name="TileType_VizOption" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.TileType" Multiplicity="1" Role="FromRole_TileType_VizOption"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption" Multiplicity="1" Role="ToRole_TileType_VizOption"/> <ReferentialConstraint> <Principal Role="FromRole_TileType_VizOption"> <PropertyRef Name="id"/> </Principal> <Dependent Role="ToRole_TileType_VizOption"> <PropertyRef Name="id"/> </Dependent> </ReferentialConstraint> </Association> <Association Name="DisplayOption_DisplayFormat" sap:content-version="1"> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption" Multiplicity="1" Role="FromRole_DisplayOption_DisplayFormat"/> <End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayFormat" Multiplicity="*" Role="ToRole_DisplayOption_DisplayFormat"/> </Association> <EntityContainer Name="_UI2_FDM_PAGE_REPOSITORY_SRV_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"> <EntitySet Name="chipBagSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:addressable="false" sap:content-version="1"/> <EntitySet Name="chipBagPropertySet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBagProperty" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:addressable="false" sap:content-version="1"/> <EntitySet Name="pageSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.Page" sap:searchable="true" sap:content-version="1"/> <EntitySet Name="sectionSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.Section" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/> <EntitySet Name="vizSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/> <EntitySet Name="vizReferenceSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/> <EntitySet Name="tileTypeSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.TileType" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/> <EntitySet Name="vizOptionSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:addressable="false" sap:content-version="1"/> <EntitySet Name="displayOptionSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:addressable="false" sap:content-version="1"/> <EntitySet Name="displayFormatSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayFormat" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:addressable="false" sap:content-version="1"/> <AssociationSet Name="TileType_VizOptionSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.TileType_VizOption" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="tileTypeSet" Role="FromRole_TileType_VizOption"/> <End EntitySet="vizOptionSet" Role="ToRole_TileType_VizOption"/> </AssociationSet> <AssociationSet Name="Page_SectionSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="pageSet" Role="FromRole_Page_Section"/> <End EntitySet="sectionSet" Role="ToRole_Page_Section"/> </AssociationSet> <AssociationSet Name="VizReference_TileTypeSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_TileType" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="vizReferenceSet" Role="FromRole_VizReference_TileType"/> <End EntitySet="tileTypeSet" Role="ToRole_VizReference_TileType"/> </AssociationSet> <AssociationSet Name="Page_TileTypesSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_TileTypes" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="pageSet" Role="FromRole_Page_TileTypes"/> <End EntitySet="tileTypeSet" Role="ToRole_Page_TileTypes"/> </AssociationSet> <AssociationSet Name="VizOption_DisplayOptionSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption_DisplayOption" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="vizOptionSet" Role="FromRole_VizOption_DisplayOption"/> <End EntitySet="displayOptionSet" Role="ToRole_VizOption_DisplayOption"/> </AssociationSet> <AssociationSet Name="Section_VizSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="sectionSet" Role="FromRole_Section_Viz"/> <End EntitySet="vizSet" Role="ToRole_Section_Viz"/> </AssociationSet> <AssociationSet Name="DisplayOption_DisplayFormatSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption_DisplayFormat" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="displayOptionSet" Role="FromRole_DisplayOption_DisplayFormat"/> <End EntitySet="displayFormatSet" Role="ToRole_DisplayOption_DisplayFormat"/> </AssociationSet> <AssociationSet Name="ChipBag_ChipBagPropertiesSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag_ChipBagProperties" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="chipBagSet" Role="FromRole_ChipBag_ChipBagProperties"/> <End EntitySet="chipBagPropertySet" Role="ToRole_ChipBag_ChipBagProperties"/> </AssociationSet> <AssociationSet Name="VizReference_ChipBagSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_ChipBag" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="vizReferenceSet" Role="FromRole_VizReference_ChipBag"/> <End EntitySet="chipBagSet" Role="ToRole_VizReference_ChipBag"/> </AssociationSet> <AssociationSet Name="Page_VizReferencesSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_VizReferences" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="pageSet" Role="FromRole_Page_VizReferences"/> <End EntitySet="vizReferenceSet" Role="ToRole_Page_VizReferences"/> </AssociationSet> <AssociationSet Name="Viz_VizReferenceSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz_VizReference" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"> <End EntitySet="vizSet" Role="FromRole_Viz_VizReference"/> <End EntitySet="vizReferenceSet" Role="ToRole_Viz_VizReference"/> </AssociationSet> </EntityContainer> <atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="self" href="/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata"/> <atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="latest-version" href="/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata"/> </Schema> </edmx:DataServices> </edmx:Edmx>',
                lastModified: "Sat, 31 Oct 2020 12:09:53 GMT"
            };
            // Metadata json was retrieved by creating the ODataModel manually in the console and calling .getMetaModel().oMetadata.oMetadata
            this._handleLoaded({
                version: "1.0",
                dataServices: {
                    dataServiceVersion: "2.0",
                    schema: [
                        {
                            namespace: ".UI2.FDM_PAGE_REPOSITORY_SRV",
                            entityType: [
                                {
                                    name: "Page",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            maxLength: "35",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Page ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "title",
                                            type: "Edm.String",
                                            maxLength: "100",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Page Description",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "description",
                                            type: "Edm.String",
                                            maxLength: "100",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Page Description",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "sections",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section",
                                            fromRole: "FromRole_Page_Section",
                                            toRole: "ToRole_Page_Section"
                                        },
                                        {
                                            name: "vizReferences",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page_VizReferences",
                                            fromRole: "FromRole_Page_VizReferences",
                                            toRole: "ToRole_Page_VizReferences"
                                        },
                                        {
                                            name: "tileTypes",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page_TileTypes",
                                            fromRole: "FromRole_Page_TileTypes",
                                            toRole: "ToRole_Page_TileTypes"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Section",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            maxLength: "35",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Page Section ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "title",
                                            type: "Edm.String",
                                            maxLength: "100",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Page Description",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "sectionIndex",
                                            type: "Edm.Int16",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Page Section Index",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "viz",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz",
                                            fromRole: "FromRole_Section_Viz",
                                            toRole: "ToRole_Section_Viz"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Viz",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "displayFormatHint",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Display Hint",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            maxLength: "35",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Assignment Item ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "itemIndex",
                                            type: "Edm.Int16",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Assignment Index",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "targetMappingId",
                                            type: "Edm.String",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Target Mapping Compound String",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "catalogTileId",
                                            type: "Edm.String",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Catalog Tile Compound String",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "vizReference",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.Viz_VizReference",
                                            fromRole: "FromRole_Viz_VizReference",
                                            toRole: "ToRole_Viz_VizReference"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "VizReference",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "catalogDisplayId",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Catalog Display ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "title",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Tile Title",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "subTitle",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Tile Subtitle",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "iconUrl",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Tile Icon URL",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "targetMappingId",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Item ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "semanticObject",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Semantic Object",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "semanticAction",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Action",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Catalog Tile ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "deviceDesktop",
                                            type: "Edm.Boolean",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Device Type Desktop",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "deviceTablet",
                                            type: "Edm.Boolean",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Device Type Tablet",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "devicePhone",
                                            type: "Edm.Boolean",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Device Type Phone",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "tileType",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Tile Type",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "catalogTileId",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "Catalog Tile ID",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "parameters",
                                            type: "Edm.String",
                                            extensions: [
                                                {
                                                    name: "label",
                                                    value: "PARAMETERS",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "configuration",
                                            type: "Edm.String",
                                            extensions: [
                                                {
                                                    name: "label",
                                                    value: "CONFIGURATION",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "chipBags",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_ChipBag",
                                            fromRole: "FromRole_VizReference_ChipBag",
                                            toRole: "ToRole_VizReference_ChipBag"
                                        },
                                        {
                                            name: "tileTypeRef",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_TileType",
                                            fromRole: "FromRole_VizReference_TileType",
                                            toRole: "ToRole_VizReference_TileType"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "TileType",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            maxLength: "255",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "CHIP Name",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "url",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "vizOptions",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.TileType_VizOption",
                                            fromRole: "FromRole_TileType_VizOption",
                                            toRole: "ToRole_TileType_VizOption"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "VizOption",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            maxLength: "255",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "CHIP Name",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "displayFormats",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption_DisplayOption",
                                            fromRole: "FromRole_VizOption_DisplayOption",
                                            toRole: "ToRole_VizOption_DisplayOption"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "DisplayOption",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "preferred",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            maxLength: "255",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "label",
                                                    value: "CHIP Name",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "supported",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption_DisplayFormat",
                                            fromRole: "FromRole_DisplayOption_DisplayFormat",
                                            toRole: "ToRole_DisplayOption_DisplayFormat"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "DisplayFormat",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "unicode",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "ChipBag",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    navigationProperty: [
                                        {
                                            name: "properties",
                                            relationship: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag_ChipBagProperties",
                                            fromRole: "FromRole_ChipBag_ChipBagProperties",
                                            toRole: "ToRole_ChipBag_ChipBagProperties"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "ChipBagProperty",
                                    key: {
                                        propertyRef: [
                                            {
                                                name: "id"
                                            }
                                        ]
                                    },
                                    property: [
                                        {
                                            name: "id",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "value",
                                            type: "Edm.String",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "translatable",
                                            type: "Edm.Boolean",
                                            nullable: "false",
                                            extensions: [
                                                {
                                                    name: "label",
                                                    value: "Indicator",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "sortable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "filterable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                }
                            ],
                            association: [
                                {
                                    name: "VizOption_DisplayOption",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption",
                                            multiplicity: "1",
                                            role: "FromRole_VizOption_DisplayOption"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption",
                                            multiplicity: "1",
                                            role: "ToRole_VizOption_DisplayOption"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Viz_VizReference",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Viz",
                                            multiplicity: "*",
                                            role: "FromRole_Viz_VizReference"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference",
                                            multiplicity: "1",
                                            role: "ToRole_Viz_VizReference"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "ChipBag_ChipBagProperties",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag",
                                            multiplicity: "1",
                                            role: "FromRole_ChipBag_ChipBagProperties"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBagProperty",
                                            multiplicity: "*",
                                            role: "ToRole_ChipBag_ChipBagProperties"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Page_VizReferences",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page",
                                            multiplicity: "1",
                                            role: "FromRole_Page_VizReferences"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference",
                                            multiplicity: "*",
                                            role: "ToRole_Page_VizReferences"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Page_TileTypes",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page",
                                            multiplicity: "1",
                                            role: "FromRole_Page_TileTypes"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.TileType",
                                            multiplicity: "*",
                                            role: "ToRole_Page_TileTypes"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Page_Section",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page",
                                            multiplicity: "1",
                                            role: "FromRole_Page_Section"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Section",
                                            multiplicity: "*",
                                            role: "ToRole_Page_Section"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "VizReference_ChipBag",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference",
                                            multiplicity: "1",
                                            role: "FromRole_VizReference_ChipBag"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag",
                                            multiplicity: "*",
                                            role: "ToRole_VizReference_ChipBag"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "VizReference_TileType",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference",
                                            multiplicity: "*",
                                            role: "FromRole_VizReference_TileType"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.TileType",
                                            multiplicity: "1",
                                            role: "ToRole_VizReference_TileType"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "Section_Viz",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Section",
                                            multiplicity: "1",
                                            role: "FromRole_Section_Viz"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.Viz",
                                            multiplicity: "*",
                                            role: "ToRole_Section_Viz"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "TileType_VizOption",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.TileType",
                                            multiplicity: "1",
                                            role: "FromRole_TileType_VizOption"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption",
                                            multiplicity: "1",
                                            role: "ToRole_TileType_VizOption"
                                        }
                                    ],
                                    referentialConstraint: {
                                        principal: {
                                            role: "FromRole_TileType_VizOption",
                                            propertyRef: [
                                                {
                                                    name: "id"
                                                }
                                            ]
                                        },
                                        dependent: {
                                            role: "ToRole_TileType_VizOption",
                                            propertyRef: [
                                                {
                                                    name: "id"
                                                }
                                            ]
                                        }
                                    },
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                },
                                {
                                    name: "DisplayOption_DisplayFormat",
                                    end: [
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption",
                                            multiplicity: "1",
                                            role: "FromRole_DisplayOption_DisplayFormat"
                                        },
                                        {
                                            type: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayFormat",
                                            multiplicity: "*",
                                            role: "ToRole_DisplayOption_DisplayFormat"
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "content-version",
                                            value: "1",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                }
                            ],
                            entityContainer: [
                                {
                                    name: "_UI2_FDM_PAGE_REPOSITORY_SRV_Entities",
                                    isDefaultEntityContainer: "true",
                                    entitySet: [
                                        {
                                            name: "chipBagSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "addressable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "chipBagPropertySet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBagProperty",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "addressable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "pageSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page",
                                            extensions: [
                                                {
                                                    name: "searchable",
                                                    value: "true",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "sectionSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.Section",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "vizSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.Viz",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "vizReferenceSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "tileTypeSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.TileType",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "vizOptionSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "addressable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "displayOptionSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "addressable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "displayFormatSet",
                                            entityType: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayFormat",
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "pageable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "addressable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    associationSet: [
                                        {
                                            name: "TileType_VizOptionSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.TileType_VizOption",
                                            end: [
                                                {
                                                    entitySet: "tileTypeSet",
                                                    role: "FromRole_TileType_VizOption"
                                                },
                                                {
                                                    entitySet: "vizOptionSet",
                                                    role: "ToRole_TileType_VizOption"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "Page_SectionSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section",
                                            end: [
                                                {
                                                    entitySet: "pageSet",
                                                    role: "FromRole_Page_Section"
                                                },
                                                {
                                                    entitySet: "sectionSet",
                                                    role: "ToRole_Page_Section"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "VizReference_TileTypeSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_TileType",
                                            end: [
                                                {
                                                    entitySet: "vizReferenceSet",
                                                    role: "FromRole_VizReference_TileType"
                                                },
                                                {
                                                    entitySet: "tileTypeSet",
                                                    role: "ToRole_VizReference_TileType"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "Page_TileTypesSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page_TileTypes",
                                            end: [
                                                {
                                                    entitySet: "pageSet",
                                                    role: "FromRole_Page_TileTypes"
                                                },
                                                {
                                                    entitySet: "tileTypeSet",
                                                    role: "ToRole_Page_TileTypes"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "VizOption_DisplayOptionSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizOption_DisplayOption",
                                            end: [
                                                {
                                                    entitySet: "vizOptionSet",
                                                    role: "FromRole_VizOption_DisplayOption"
                                                },
                                                {
                                                    entitySet: "displayOptionSet",
                                                    role: "ToRole_VizOption_DisplayOption"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "Section_VizSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz",
                                            end: [
                                                {
                                                    entitySet: "sectionSet",
                                                    role: "FromRole_Section_Viz"
                                                },
                                                {
                                                    entitySet: "vizSet",
                                                    role: "ToRole_Section_Viz"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "DisplayOption_DisplayFormatSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.DisplayOption_DisplayFormat",
                                            end: [
                                                {
                                                    entitySet: "displayOptionSet",
                                                    role: "FromRole_DisplayOption_DisplayFormat"
                                                },
                                                {
                                                    entitySet: "displayFormatSet",
                                                    role: "ToRole_DisplayOption_DisplayFormat"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "ChipBag_ChipBagPropertiesSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.ChipBag_ChipBagProperties",
                                            end: [
                                                {
                                                    entitySet: "chipBagSet",
                                                    role: "FromRole_ChipBag_ChipBagProperties"
                                                },
                                                {
                                                    entitySet: "chipBagPropertySet",
                                                    role: "ToRole_ChipBag_ChipBagProperties"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "VizReference_ChipBagSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.VizReference_ChipBag",
                                            end: [
                                                {
                                                    entitySet: "vizReferenceSet",
                                                    role: "FromRole_VizReference_ChipBag"
                                                },
                                                {
                                                    entitySet: "chipBagSet",
                                                    role: "ToRole_VizReference_ChipBag"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "Page_VizReferencesSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.Page_VizReferences",
                                            end: [
                                                {
                                                    entitySet: "pageSet",
                                                    role: "FromRole_Page_VizReferences"
                                                },
                                                {
                                                    entitySet: "vizReferenceSet",
                                                    role: "ToRole_Page_VizReferences"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        },
                                        {
                                            name: "Viz_VizReferenceSet",
                                            association: ".UI2.FDM_PAGE_REPOSITORY_SRV.Viz_VizReference",
                                            end: [
                                                {
                                                    entitySet: "vizSet",
                                                    role: "FromRole_Viz_VizReference"
                                                },
                                                {
                                                    entitySet: "vizReferenceSet",
                                                    role: "ToRole_Viz_VizReference"
                                                }
                                            ],
                                            extensions: [
                                                {
                                                    name: "creatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "updatable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "deletable",
                                                    value: "false",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                },
                                                {
                                                    name: "content-version",
                                                    value: "1",
                                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                                }
                                            ]
                                        }
                                    ],
                                    extensions: [
                                        {
                                            name: "supported-formats",
                                            value: "atom json xlsx",
                                            namespace: "http://www.sap.com/Protocols/SAPData"
                                        }
                                    ]
                                }
                            ],
                            extensions: [
                                {
                                    name: "lang",
                                    value: "en",
                                    namespace: "http://www.w3.org/XML/1998/namespace"
                                },
                                {
                                    name: "schema-version",
                                    value: "1",
                                    namespace: "http://www.sap.com/Protocols/SAPData"
                                },
                                {
                                    name: "link",
                                    value: null,
                                    attributes: [
                                        {
                                            name: "rel",
                                            value: "self",
                                            namespace: null
                                        },
                                        {
                                            name: "href",
                                            value: "/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata",
                                            namespace: null
                                        }
                                    ],
                                    children: [],
                                    namespace: "http://www.w3.org/2005/Atom"
                                },
                                {
                                    name: "link",
                                    value: null,
                                    attributes: [
                                        {
                                            name: "rel",
                                            value: "latest-version",
                                            namespace: null
                                        },
                                        {
                                            name: "href",
                                            value: "/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata",
                                            namespace: null
                                        }
                                    ],
                                    children: [],
                                    namespace: "http://www.w3.org/2005/Atom"
                                }
                            ]
                        }
                    ]
                }
            }, mParams);
            ODataMetadata.prototype._loadMetadata = fnOrig; // Set back the original to save some execution time
            return Promise.resolve(mParams);
        }
        return fnOrig.call(this, sUrl, bSuppressEvents);
    };

    var oODataModel = new ODataModel({
        serviceUrl: getServiceUrl(),
        headers: {
            "sap-language": sap.ushell.Container.getUser().getLanguage(),
            "sap-client": sap.ushell.Container.getLogonSystem().getClient()
        },
        defaultCountMode: "None",
        skipMetadataAnnotationParsing: true,
        useBatch: false
    });

    // If we have the metdata cache backe in action, we will need to revert to the previous implementation
    var oMetaDataPromise = new Promise(function (resolve, reject) {
        resolve();
    });

    /**
     * Constructs a new instance of the PagePersistenceAdapter for the ABAP platform
     *
     * @constructor
     * @experimental Since 1.67.0
     * @private
     */
    var PagePersistenceAdapter = function () {
        this.S_COMPONENT_NAME = "sap.ushell_abap.adapters.abap.PagePersistenceAdapter";
    };

    /**
     * Returns the instance of ODataModel
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The OData model
     */
    PagePersistenceAdapter.prototype.getODataModel = function () {
        return oODataModel;
    };

    /**
     * Returns the instance of ODataModel
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The OData model
     */
    PagePersistenceAdapter.prototype.getMetadataPromise = function () {
        return oMetaDataPromise;
    };

    /**
     * Returns a page
     *
     * @param {string} pageId The page ID
     * @returns {Promise<object>} Resolves to a page
     *
     * @experimental Since 1.67.0
     * @private
     */
    PagePersistenceAdapter.prototype.getPage = function (pageId) {
        return Promise.all([
            this._readPage(pageId),
            sap.ushell.Container.getServiceAsync("URLParsing")
        ])
            .then(function (aResults) {
                var oPageData = aResults[0];
                var URLParsing = aResults[1];

                return this._convertODataToReferenceData(oPageData, URLParsing);
            }.bind(this))
            .catch(this._rejectWithError.bind(this));
    };

    /**
     * Returns array of pages
     *
     * @param {string[]} aPageId The array of page ID
     * @returns {Promise<object[]>} Resolves to array of pages
     *
     * @experimental Since 1.75.0
     * @private
     */
    PagePersistenceAdapter.prototype.getPages = function (aPageId) {
        return Promise.all([
            this._readPages(aPageId),
            sap.ushell.Container.getServiceAsync("URLParsing")
        ])
            .then(function (aResults) {
                var aPagesResults = aResults[0].results;
                var URLParsing = aResults[1];

                return aPagesResults.map(function (oPageData) {
                    return this._convertODataToReferenceData(oPageData, URLParsing);
                }.bind(this));
            }.bind(this))
            .catch(this._rejectWithError.bind(this));
    };

    /**
     * Reads a page from the server
     *
     * @param {string} pageId The page ID
     * @returns {Promise<object>} Resolves to a page in the OData format
     *
     * @experimental Since 1.67.0
     * @private
     */
    PagePersistenceAdapter.prototype._readPage = function (pageId) {
        return this.getMetadataPromise().then(function () {
            return new Promise(function (resolve, reject) {
                this.getODataModel().read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                    urlParameters: {
                        $expand: "sections/viz,vizReferences/chipBags/properties,tileTypes/vizOptions/displayFormats/supported"
                    },
                    success: resolve,
                    error: reject
                });
            }.bind(this));
        }.bind(this));
    };

    /**
     * Reads pages from the server
     *
     * @param {string[]} aPageId The array of page ID
     * @returns {Promise<object[]>} Resolves to a array of page in the OData format
     *
     * @experimental Since 1.75.0
     * @private
     */
    PagePersistenceAdapter.prototype._readPages = function (aPageId) {
        return this.getMetadataPromise().then(function () {
            return new Promise(function (resolve, reject) {
                sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Filter, FilterOperator) {
                    var aPageFilters = [],
                        oPageFilter;
                    for (var i = 0; i < aPageId.length; i++) {
                        oPageFilter = new Filter({
                            path: "id",
                            operator: FilterOperator.EQ,
                            value1: aPageId[i],
                            and: false
                        });
                        aPageFilters.push(oPageFilter);
                    }
                    this.getODataModel().read("/pageSet", {
                        urlParameters: {
                            $expand: "sections/viz,vizReferences/chipBags/properties,tileTypes/vizOptions/displayFormats/supported"
                        },
                        filters: aPageFilters,
                        success: resolve,
                        error: reject
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    };

    /**
     * Converts a reference page from the OData format to the FLP internal format.
     *
     * @param {object} page The page in the OData format.
     * @param {object} URLParsing The URLParsing service.
     * @returns {object}
     *  An object containing the page, visualizations & vizTypes which where extracted from the pageSet OData response object.
     *
     * @since 1.90.0
     * @private
     */
    PagePersistenceAdapter.prototype._convertODataToReferenceData = function (page, URLParsing) {
        var oData = {
            page: {
                id: page.id,
                title: page.title,
                description: page.description,
                createdBy: page.createdBy,
                createdByFullname: page.createdByFullname || page.createdBy,
                modifiedBy: page.modifiedBy,
                modifiedByFullname: page.modifiedByFullname || page.modifiedBy,
                sections: page.sections.results.map(function (oSection) {
                    return {
                        id: oSection.id,
                        sectionIndex: oSection.sectionIndex,
                        title: oSection.title,
                        viz: oSection.viz.results.map(function (oViz) {
                            return {
                                catalogTileId: oViz.catalogTileId,
                                id: oViz.id,
                                itemIndex: oViz.itemIndex,
                                targetMappingId: oViz.targetMappingId,
                                // rename both when our frontend names match backend names
                                vizId: oViz.catalogTileId, // our "vizId" should be renamed to "catalogTileId"
                                inboundPermanentKey: oViz.targetMappingId, // our "inboundPermanentKey" should be renamed to "targetMappingId"
                                displayFormatHint: oViz.displayFormatHint
                            };
                        }).sort(function (firstViz, secondViz) {
                            return firstViz.itemIndex - secondViz.itemIndex;
                        })
                    };
                }).sort(function (firstSection, secondSection) {
                    return firstSection.sectionIndex - secondSection.sectionIndex;
                })
            },
            // mapping from vizReference to visualization
            visualizations: page.vizReferences.results.reduce(function (oVisualizations, oViz) {
                var oSimplifiedChip = this._getSimplifiedChip(oViz);
                oVisualizations[oViz.id] = {
                    vizType: oViz.tileType,
                    title: oViz.title,
                    subTitle: oViz.subTitle,
                    icon: oViz.iconUrl,
                    info: chipsUtils.getInfoFromSimplifiedChip(oSimplifiedChip),
                    keywords: chipsUtils.getKeywordsFromSimplifiedChip(oSimplifiedChip),
                    size: chipsUtils.getTileSizeFromSimplifiedChip(oSimplifiedChip),
                    indicatorDataSource: chipsUtils.getIndicatorDataSourceFromSimplifiedChip(oSimplifiedChip),
                    url: chipsUtils.getTargetUrlFromSimplifiedChip(oSimplifiedChip, URLParsing),
                    numberUnit: chipsUtils.getNumberUnitFromSimplifiedChip(oSimplifiedChip),
                    isCustomTile: chipsUtils.isCustomTileFromSimplifiedChip(oSimplifiedChip),
                    _instantiationData: {
                        platform: "ABAP",
                        simplifiedChipFormat: true,
                        chip: oSimplifiedChip
                    }
                };
                return oVisualizations;
            }.bind(this), {}),
            // mapping from tileTypes to vizTypes
            vizTypes: page.tileTypes.results.reduce(function (oVizTypes, oVizType) {
                var oDisplayFormats = oVizType.vizOptions.displayFormats;
                var sVizTypeId = oVizType.id;

                oVizTypes[sVizTypeId] = {
                    id: sVizTypeId,
                    url: oVizType.url,
                    vizOptions: {
                        displayFormats: {
                            supported: oDisplayFormats.supported.results.map(function (oDisplayFormat) {
                                return oDisplayFormat.id;
                            }),
                            default: oDisplayFormats.preferred
                        }
                    }
                };
                return oVizTypes;
            }, {})
        };

        return oData;
    };

    /**
     * Extracts the data from a visualization to create a simplified chip from it
     *
     * @param {object} oVisualization The visualization to create the chip from
     * @returns {object}
     *  A simplified version of the sap.ushell_abap.pbServices.ui2.ChipInstance.
     *  The object structure of the simplified chip model can be viewed in the "simplifiedChipModel.md" document in the FLP core-concepts GitHub repository.
     *
     * @since 1.90.0
     *
     * @private
     */
    PagePersistenceAdapter.prototype._getSimplifiedChip = function (oVisualization) {
        var oBags = {};
        var oConfiguration;
        try {
            oConfiguration = JSON.parse(oVisualization.configuration);
        } catch (err) {
            oConfiguration = {};
        }

        oVisualization.chipBags.results.forEach(function (oBag) {
            oBags[oBag.id] = {
                texts: {},
                properties: {}
            };

            oBag.properties.results.forEach(function (oProperty) {
                if (oProperty.translatable) {
                    oBags[oBag.id].texts[oProperty.id] = oProperty.value;
                } else {
                    oBags[oBag.id].properties[oProperty.id] = oProperty.value;
                }
            });
        });

        return {
            chipId: oVisualization.tileType,
            configuration: oConfiguration,
            bags: oBags
        };
    };

    /**
     * @param {object} error The error object
     * @returns {Promise<object>} A rejected promise containing the error
     *
     * @experimental Since 1.67.0
     * @private
     */
     PagePersistenceAdapter.prototype._rejectWithError = function (error) {
        var oError = {
            component: this.S_COMPONENT_NAME,
            description: resources.i18n.getText("PagePersistenceAdapter.CannotLoadPage"),
            detail: error
        };
        return Promise.reject(oError);
    };

    return PagePersistenceAdapter;

}, true /* bExport */);
