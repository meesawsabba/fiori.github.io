/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
//sap.ui.define(["sap/ushell/renderers/fiori2/search/SearchHelper"], function (SearchHelper) {
sap.ui.define(["../i18n", "sap/esh/search/ui/SearchHelper"], function (i18n, SearchHelper) {
    "use strict";
    var UserCategoryManager = function () {
        this.init.apply(this, arguments);
    };
    var myFavDataStore = "my-fav-data";
    // static method
    UserCategoryManager.create = function (properties) {
        var instance = new UserCategoryManager(properties);
        return instance.initAsync().then(function () {
            return instance;
        });
    };
    UserCategoryManager.prototype = {
        init: function (properties) {
            this.active = false;
            this.categories = [];
            this.personalizationStorage = properties.personalizationStorage;
            this.sina = properties.sina;
        },
        initAsync: function () {
            var that = this;
            var userCategory;
            var sinaSubDataSources;
            var undefinedSubDataSourceIds = [];
            var myFavData = this.personalizationStorage.getItem(myFavDataStore);
            /* // example for storage
                        personalizationStorageInstance.setItem('my-fav-data', {
                            active: true,
                            userCatgories: [{
                                id: 'MyFavorites',
                                subDataSources: [{
                                    id: 'CD$ALL~ZESH_EPM_P_DEMO~'
                                }, {
                                    id: 'CD$ALL~ZESH_EPM_S_DEMO~'
                                }]
                            }]
                        });*/
            // No FavData exists
            if (!myFavData) {
                userCategory = this.sina._createDataSource({
                    id: "MyFavorites",
                    label: i18n.getText("label_userFavorites"),
                    labelPlural: i18n.getText("label_userFavorites"),
                    type: this.sina.DataSourceType.UserCategory,
                    subDataSources: [],
                    undefinedSubDataSourceIds: [],
                });
                this.categories.push(userCategory);
                return Promise.resolve();
            }
            this.setFavActive(myFavData.active);
            if (!this.isFavActive()) {
                // null or undefined
                this.setFavActive(false);
            }
            this.setLastFavActive(this.isFavActive());
            // convert subDataSources from personalizationStorage into sina datasources
            // if not possible -> add subDataSource to undefinedSubDataSourceIds
            for (var _i = 0, _a = myFavData.userCatgories; _i < _a.length; _i++) {
                var favUserCategory = _a[_i];
                var subDataSources = favUserCategory.subDataSources;
                if (subDataSources) {
                    sinaSubDataSources = subDataSources.map(function (dataSource) {
                        var sinaSubDataSource = that.sina.getDataSource(dataSource.id);
                        if (!sinaSubDataSource) {
                            undefinedSubDataSourceIds.push(dataSource.id);
                        }
                        return sinaSubDataSource;
                    });
                }
                else {
                    sinaSubDataSources = [];
                }
                // delete all undefined entries (datasources which do not exist currently)
                sinaSubDataSources = sinaSubDataSources.filter(function (x) { return x; });
                // DataSourceType.UserCategory: switch in sina.js createDataSource depending on DataSourceType
                userCategory = this.sina._createDataSource({
                    id: favUserCategory.id,
                    label: i18n.getText("label_userFavorites"),
                    labelPlural: i18n.getText("label_userFavorites"),
                    type: this.sina.DataSourceType.UserCategory,
                    subDataSources: sinaSubDataSources,
                    undefinedSubDataSourceIds: undefinedSubDataSourceIds,
                });
                this.categories.push(userCategory);
            }
            return Promise.resolve();
        },
        getCategory: function (id) {
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (category.id === id) {
                    return category;
                }
            }
            return null;
        },
        isFavActive: function () {
            return this.active;
        },
        setFavActive: function (active) {
            this.active = active;
        },
        isLastFavActive: function () {
            return this.lastActive;
        },
        setLastFavActive: function (value) {
            this.lastActive = value;
        },
        save: function () {
            var categoriesJson = [];
            // check change of subDataSources
            // convert sina -> Fav format
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                var subDataSourceList = [];
                // add subDataSources (active)
                for (var _b = 0, _c = category.subDataSources; _b < _c.length; _b++) {
                    var subDataSource = _c[_b];
                    subDataSourceList.push({
                        id: subDataSource.id,
                    });
                }
                // add undefinedSubDataSources (inactive)
                for (var _d = 0, _e = category.undefinedSubDataSourceIds; _d < _e.length; _d++) {
                    var undefinedSubDataSourceId = _e[_d];
                    subDataSourceList.push({
                        id: undefinedSubDataSourceId,
                    });
                }
                categoriesJson.push({
                    id: category.id,
                    subDataSources: subDataSourceList,
                });
            }
            this.personalizationStorage.setItem(myFavDataStore, {
                active: this.isFavActive(),
                userCatgories: categoriesJson,
            });
            // save must be finished before reload
            // timeout necessary for MessageToast display with success message for save
            this.personalizationStorage.saveNotDelayed().then(function () {
                //search used and flag for 'Use Personalized Search Scope' changed => reset to home URL required
                // refresh of search dropdown listbox
                if (SearchHelper.isSearchAppActive() && this.isLastFavActive() !== this.isFavActive()) {
                    var result = new RegExp(/^[^#]*#/).exec(window.location.href); //new RegExp('^[^#]*') without # /
                    var sUrl_1 = result[0];
                    setTimeout(function () {
                        window.location.assign(sUrl_1);
                        window.location.reload();
                    }, 2000);
                }
                //search not used and flag for 'Use Personalized Search Scope' changed
                // refresh of search dropdown listbox
                else if (!SearchHelper.isSearchAppActive() &&
                    this.isLastFavActive() !== this.isFavActive()) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
            }.bind(this));
        },
    };
    return UserCategoryManager;
});
