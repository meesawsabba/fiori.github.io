/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/m/MessagePopover", "sap/m/MessageItem", "sap/fe/core/CommonUtils"],
	function(MessagePopover, MessageItem, CommonUtils) {
		"use strict";

		var FeMessagePopover = MessagePopover.extend("sap.fe.common.MessagePopover", {
			metadata: {
				properties: {},
				events: {}
			},
			/**
			 *
			 * @param {object} sControlId
			 * @param {object} item
			 *
			 * @returns {boolean}
			 */
			_fnFilterUponId: function(sControlId, item) {
				return sControlId === item.getId();
			},

			init: function() {
				MessagePopover.prototype.init.call(this, arguments);
				this.setModel(
					sap.ui
						.getCore()
						.getMessageManager()
						.getMessageModel(),
					"message"
				);

				this.bindAggregation("items", {
					path: "message>/",
					template: new MessageItem({
						type: "{message>type}",
						title: "{message>message}",
						description: "{message>description}",
						longtextUrl: "{message>descriptionUrl}",
						subtitle: "{message>additionalText}",
						activeTitle: "{= ${message>controlIds}.length > 0 ? true : false}"
					})
				});
				this.setGroupItems(true);
			}
		});

		return FeMessagePopover;
	},
	/* bExport= */ true
);
