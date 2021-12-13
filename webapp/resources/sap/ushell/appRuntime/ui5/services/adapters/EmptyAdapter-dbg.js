// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    var EmptyAdapter = function () {
        this.getSite = function() {
            return new jQuery.Deferred().resolve({}).promise();
        };
    };

    return EmptyAdapter;
}, true);
