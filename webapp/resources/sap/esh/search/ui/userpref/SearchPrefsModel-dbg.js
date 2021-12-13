/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// no prefs request when adding entry
// only single sina get server info request in fail case
// mathias: dataType:'text'
sap.ui.define(["../i18n", "sap/ui/model/json/JSONModel"], function (i18n, JSONModel) {
    "use strict";
    // model class for search preferences view
    // =======================================================================
    var path = "sap.esh.search.ui.userpref.SearchPrefsModel";
    return JSONModel.extend(path, {
        //sap.ui.model.json.
        asyncInit: function () {
            // check cache
            var that = this;
            if (that.initializePromise) {
                return that.initializePromise;
            }
            // get search model and call init
            that.searchModel = sap.esh.search.ui.getModelSingleton({}, "flp");
            that.initializePromise = that.searchModel.initBusinessObjSearch().then(function () {
                if (!that.searchModel.config.searchBusinessObjects) {
                    that.setProperty("/isSearchPrefsActive", false);
                    that.setProperty("/isPersonalizedSearchEditable", false);
                    that.setProperty("/personalizedSearch", false);
                    that.setProperty("/resetButtonWasClicked", false);
                    return undefined;
                }
                that.setProperty("/isSearchPrefsActive", true);
                that.setProperty("/userDefinedDatasources", that.searchModel.config.userDefinedDatasources);
                var sinaNext = that.searchModel.sinaNext;
                // check featureflag
                if (that.searchModel.config.userDefinedDatasources) {
                    that.initSubDataSources();
                }
                return sinaNext
                    .getConfigurationAsync({
                    forceReload: true,
                })
                    .then(function (configuration) {
                    that.configuration = configuration;
                    that.setProperty("/isPersonalizedSearchEditable", configuration.isPersonalizedSearchEditable);
                    that.setProperty("/personalizedSearch", configuration.personalizedSearch);
                    that.setProperty("/resetButtonWasClicked", false);
                });
            });
            return that.initializePromise;
        },
        reload: function () {
            this.initializePromise = false;
            return this.asyncInit();
        },
        initSubDataSources: function () {
            var newDS = [];
            this.searchModel.getUserCategoryManager().then(function (userCategoryManager) {
                this.userCategoryManager = userCategoryManager;
                this.userCategory = userCategoryManager.getCategory("MyFavorites");
                // get datasources from sina
                var dataSources = this.searchModel.sinaNext.dataSources;
                for (var _i = 0, dataSources_1 = dataSources; _i < dataSources_1.length; _i++) {
                    var dataSource = dataSources_1[_i];
                    if (dataSource.type !== this.searchModel.sinaNext.DataSourceType.BusinessObject) {
                        continue;
                    }
                    newDS.push({
                        id: dataSource.id,
                        label: dataSource.labelPlural,
                        selected: this.userCategory.hasSubDataSource(dataSource.id),
                        undefined: false,
                    });
                }
                // add undefinedSubDataSources to the top of the list
                var undefinedSubDataSources = this.userCategory
                    .getUndefinedSubDataSourceIds()
                    .reverse();
                for (var _a = 0, undefinedSubDataSources_1 = undefinedSubDataSources; _a < undefinedSubDataSources_1.length; _a++) {
                    var undefinedSubDataSource = undefinedSubDataSources_1[_a];
                    newDS.unshift({
                        id: undefinedSubDataSource,
                        label: undefinedSubDataSource + " " + i18n.getText("sp.connectorNotExists"),
                        selected: true,
                        undefined: true,
                    });
                }
                this.setProperty("/favActive", this.userCategoryManager.isFavActive());
                this.setProperty("/subDataSources", newDS);
                this.setProperty("/dataSourceCount", this.getNumberSubDataSources());
                this.setProperty("/selectedDataSourceCount", this.getNumberSelectedSubDataSources());
            }.bind(this));
        },
        getNumberSubDataSources: function () {
            return this.getProperty("/subDataSources").length;
        },
        getNumberSelectedSubDataSources: function () {
            return this.getProperty("/subDataSources").filter(function (x) { return x.selected; }).length; //x.selected === true)
        },
        saveSubDataSources: function () {
            var subDataSources = this.getProperty("/subDataSources");
            this.userCategoryManager.setFavActive(this.getProperty("/favActive"));
            this.userCategory.clearSubDataSources();
            this.userCategory.clearUndefinedSubDataSourceIds();
            for (var _i = 0, subDataSources_1 = subDataSources; _i < subDataSources_1.length; _i++) {
                var subDataSource = subDataSources_1[_i];
                if (subDataSource.selected === true) {
                    var sinaSubDataSource = this.userCategoryManager.sina.getDataSource(subDataSource.id);
                    if (sinaSubDataSource) {
                        this.userCategory.addSubDataSource(sinaSubDataSource);
                    }
                    else {
                        this.userCategory.addUndefinedSubDataSourceId(subDataSource.id);
                    }
                }
            }
            this.userCategoryManager.save();
        },
        //not used in future -> delete
        shortStatus: function () {
            return this.asyncInit().then(function () {
                return this.getProperty("/personalizedSearch")
                    ? i18n.getText("sp.on")
                    : i18n.getText("sp.off");
            }.bind(this));
        },
        isPersonalizedSearchActive: function () {
            return this.asyncInit().then(function () {
                return this.getProperty("/personalizedSearch");
            }.bind(this));
        },
        isSearchPrefsActive: function () {
            return this.asyncInit().then(function () {
                return this.getProperty("/isSearchPrefsActive");
            }.bind(this));
        },
        isMultiProvider: function () {
            return this.asyncInit().then(function () {
                return this.searchModel.sinaNext.provider.id === "multi";
            }.bind(this));
        },
        savePreferences: function () {
            // check featureflag
            if (this.searchModel.config.userDefinedDatasources) {
                this.saveSubDataSources();
            }
            this.configuration.setPersonalizedSearch(this.getProperty("/personalizedSearch"));
            return this.configuration.saveAsync().then(function () {
                this.setProperty("/resetButtonWasClicked", false);
            }.bind(this));
        },
        cancelPreferences: function () {
            this.setProperty("/personalizedSearch", this.configuration.personalizedSearch);
            this.setProperty("/resetButtonWasClicked", false);
        },
        resetProfile: function () {
            return this.configuration.resetPersonalizedSearchDataAsync().then(function () {
                this.setProperty("/resetButtonWasClicked", true);
            }.bind(this));
        },
    });
});
