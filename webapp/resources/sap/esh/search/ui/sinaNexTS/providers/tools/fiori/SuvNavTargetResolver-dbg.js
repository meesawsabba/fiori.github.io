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
/* global $ */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
sap.ui.define(["require", "exports", "../../../sina/SinaObject"], function (require, exports, SinaObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuvNavTargetResolver = void 0;
    /*
    var curTheme = "";
    var getCurrentTheme = function () {
        if (!curTheme) {
            curTheme = getTheme();
        }
        return curTheme;
    };
    */
    var getTheme = function () {
        var themes = [];
        $.each(document.styleSheets, function (index, cssFile) {
            if (cssFile.href) {
                var fname = cssFile.href.toString();
                var regex = /themes\/(.+)\/library.css/;
                var matches = regex.exec(fname);
                if (matches !== null) {
                    themes.push(matches[1]);
                    return false; //jquery syntax for 'break'
                }
            }
            return true;
        });
        return themes[0];
    };
    var addThemeToURL = function (url) {
        var res = url;
        var theme = getTheme();
        if (!theme) {
            return res;
        }
        theme = "sap-theme=" + theme + "&";
        if (url.indexOf("sap-theme=") === -1) {
            if (url.indexOf("?") !== -1) {
                res = url.replace("?", "?" + theme);
            }
        }
        return res;
    };
    var SuvNavTargetResolver = /** @class */ (function (_super) {
        __extends(SuvNavTargetResolver, _super);
        function SuvNavTargetResolver(properties) {
            var _this = _super.call(this, properties) || this;
            _this.suvMimeType = "application/vnd.sap.universal-viewer+suv";
            _this.suvViewerBasePath =
                "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/fileviewer/viewer/web/viewer.html?file=";
            return _this;
        }
        SuvNavTargetResolver.prototype.addHighlightTermsToUrl = function (url, highlightTerms) {
            if (!highlightTerms) {
                return url;
            }
            url +=
                "&searchTerms=" +
                    encodeURIComponent(JSON.stringify({
                        terms: highlightTerms,
                    }));
            return url;
        };
        SuvNavTargetResolver.prototype.resolveSuvNavTargets = function (dataSource, suvAttributes, suvHighlightTerms) {
            for (var suvAttributeName in suvAttributes) {
                var openSuvInFileViewerUrl = void 0;
                var suvAttribute = suvAttributes[suvAttributeName];
                var thumbnailAttribute = suvAttribute.suvThumbnailAttribute;
                if (suvAttribute.suvTargetMimeTypeAttribute.value === this.suvMimeType) {
                    openSuvInFileViewerUrl =
                        this.suvViewerBasePath + encodeURIComponent(suvAttribute.suvTargetUrlAttribute.value);
                    openSuvInFileViewerUrl = this.addHighlightTermsToUrl(openSuvInFileViewerUrl, suvHighlightTerms);
                    openSuvInFileViewerUrl = addThemeToURL(openSuvInFileViewerUrl);
                    thumbnailAttribute.defaultNavigationTarget = this.sina._createNavigationTarget({
                        label: suvAttribute.suvTargetUrlAttribute.value,
                        targetUrl: openSuvInFileViewerUrl,
                        target: "_blank",
                    });
                }
                else {
                    openSuvInFileViewerUrl = suvAttribute.suvTargetUrlAttribute.value;
                    thumbnailAttribute.defaultNavigationTarget = this.sina._createNavigationTarget({
                        label: suvAttribute.suvTargetUrlAttribute.value,
                        targetUrl: openSuvInFileViewerUrl,
                        target: "_blank",
                    });
                }
            }
        };
        return SuvNavTargetResolver;
    }(SinaObject_1.SinaObject));
    exports.SuvNavTargetResolver = SuvNavTargetResolver;
});
})();