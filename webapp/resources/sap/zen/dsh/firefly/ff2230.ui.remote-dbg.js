/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff2220.ui.program"
],
function(oFF)
{
"use strict";

oFF.UiCompositeRemoteFactory = function() {};
oFF.UiCompositeRemoteFactory.prototype = new oFF.XObject();
oFF.UiCompositeRemoteFactory.prototype._ff_c = "UiCompositeRemoteFactory";

oFF.UiCompositeRemoteFactory.prototype.newInstance = function()
{
	return oFF.UiCompositeRemote.create();
};

oFF.UiServerEvent = function() {};
oFF.UiServerEvent.prototype = new oFF.XObject();
oFF.UiServerEvent.prototype._ff_c = "UiServerEvent";

oFF.UiServerEvent.s_evMap = null;
oFF.UiServerEvent.staticSetup = function()
{
	oFF.UiServerEvent.s_evMap = oFF.XSetOfNameObject.create();
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvInitialize());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvTerminate());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTransferStart());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTransferEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSitAndWait());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnChangedValue());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnReadOnlyPropertySync());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSelect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSelectionChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnCollapse());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnExpand());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDoubleClick());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnClick());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnContextMenu());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnOpen());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBeforeClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBeforeOpen());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnAfterClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnAfterOpen());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEnter());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnLiveChange());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDelete());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDetailPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEditingBegin());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnEditingEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnBack());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnRefresh());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnLoadFinished());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMove());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMoveStart());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnMoveEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnResize());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSuggestionSelect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnScroll());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnScrollLoad());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnHover());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnHoverEnd());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnPaste());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSelectionFinish());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnSearch());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnButtonPress());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnError());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnReadLineFinished());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnExecute());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTerminate());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnFileDrop());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnDrop());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnItemClose());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnItemSelect());
	oFF.UiServerEvent.s_evMap.add(new oFF.UiServerEvOnTableDragAndDrop());
};
oFF.UiServerEvent.lookup = function(name)
{
	return oFF.UiServerEvent.s_evMap.getByKey(name);
};
oFF.UiServerEvent.prototype.executeOperation = oFF.noSupport;
oFF.UiServerEvent.prototype.getEventType = oFF.noSupport;
oFF.UiServerEvent.prototype.getName = function()
{
	var tmpEvent = this.getEventType();
	if (oFF.notNull(tmpEvent))
	{
		return tmpEvent.getRemoteName();
	}
	throw oFF.XException.createRuntimeException("Missing event defintion for UiServerEvent. Check remote server events!");
};
oFF.UiServerEvent.prototype.isControlContext = function()
{
	return true;
};
oFF.UiServerEvent.prototype.createControlEventWithParams = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		var newParameters = this.getParametersFromEvent(operation);
		return oFF.UiControlEvent.create(uiContext, newParameters);
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createSelectionEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		var uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			var newParameters = this.getParametersFromEvent(operation);
			var selectedItems = oFF.XList.create();
			if (oFF.notNull(operation) && operation.size() > oFF.SphereServer.CUSTOM_PARAM_OFFSET)
			{
				var selectedItemIds = operation.getStringAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET);
				var selectedIds = oFF.XStringTokenizer.splitString(selectedItemIds, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
				if (oFF.notNull(selectedIds))
				{
					var idsIterator = selectedIds.getIterator();
					while (idsIterator.hasNext())
					{
						var tmpSelectedId = idsIterator.next();
						var tmpSelectedItem = uiManager.selectById(tmpSelectedId);
						selectedItems.add(tmpSelectedItem);
					}
				}
			}
			return oFF.UiSelectionEvent.createMultiSelection(uiContext, newParameters, selectedItems);
		}
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createResizeEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		var newParameters = this.getParametersFromEvent(operation);
		var offsetWidth = 0;
		var offsetHeight = 0;
		if (oFF.notNull(operation) && operation.size() > oFF.SphereServer.CUSTOM_PARAM_OFFSET)
		{
			offsetWidth = operation.getIntegerAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET);
			offsetHeight = operation.getIntegerAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET + 1);
		}
		return oFF.UiResizeEvent.createResize(uiContext, newParameters, offsetWidth, offsetHeight);
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createMoveEvent = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		var newParameters = this.getParametersFromEvent(operation);
		var offsetX = 0;
		var offsetY = 0;
		if (oFF.notNull(operation) && operation.size() > oFF.SphereServer.CUSTOM_PARAM_OFFSET)
		{
			offsetX = operation.getIntegerAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET);
			offsetY = operation.getIntegerAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET + 1);
		}
		return oFF.UiMoveEvent.createMove(uiContext, newParameters, offsetX, offsetY);
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createDropEventWithParams = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		var uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			var newParameters = this.getParametersFromEvent(operation);
			var draggedControl = null;
			var droppedControl = null;
			var relativeDropPosition = null;
			if (oFF.notNull(operation) && operation.size() > oFF.SphereServer.CUSTOM_PARAM_OFFSET)
			{
				var draggedControlId = operation.getStringAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET);
				draggedControl = uiManager.selectById(draggedControlId);
				var droppedControlId = operation.getStringAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET + 2);
				droppedControl = uiManager.selectById(droppedControlId);
				var relativeDropPosStr = operation.getStringAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET + 4);
				relativeDropPosition = oFF.UiRelativeDropPosition.lookup(relativeDropPosStr);
			}
			return oFF.UiDropEvent.createDrop(uiContext, newParameters, draggedControl, droppedControl, relativeDropPosition);
		}
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.createItemEventWithParams = function(uiContext, uiAppContainer, operation)
{
	if (oFF.notNull(uiAppContainer) && oFF.notNull(uiContext))
	{
		var uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			var newParameters = this.getParametersFromEvent(operation);
			var affectedItem = null;
			if (oFF.notNull(operation) && operation.size() > oFF.SphereServer.CUSTOM_PARAM_OFFSET)
			{
				var affectedItemId = operation.getStringAt(oFF.SphereServer.CUSTOM_PARAM_OFFSET);
				affectedItem = uiManager.selectById(affectedItemId);
			}
			return oFF.UiItemEvent.createItem(uiContext, newParameters, affectedItem);
		}
	}
	throw oFF.XException.createRuntimeException("Event handling failed! Missing uiContext or uiAppContainer. Check remote server events!");
};
oFF.UiServerEvent.prototype.getParametersFromEvent = function(operation)
{
	var newParameters = oFF.XProperties.create();
	if (oFF.notNull(operation) && operation.size() > oFF.SphereServer.PARAM_OFFSET)
	{
		var newParametersString = operation.getStringAt(oFF.SphereServer.PARAM_OFFSET);
		if (oFF.notNull(newParametersString))
		{
			newParameters.deserialize(newParametersString);
		}
	}
	return newParameters;
};

oFF.UiServerEvInitialize = function() {};
oFF.UiServerEvInitialize.prototype = new oFF.UiServerEvent();
oFF.UiServerEvInitialize.prototype._ff_c = "UiServerEvInitialize";

oFF.UiServerEvInitialize.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_INITIALIZE;
};
oFF.UiServerEvInitialize.prototype.isControlContext = function()
{
	return false;
};
oFF.UiServerEvInitialize.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var parameters = null;
	var remoteLocation = null;
	var fragment = null;
	var uiTypeDefs = null;
	if (oFF.notNull(operation))
	{
		var size = operation.size();
		if (size > 1 && operation.getElementTypeAt(1) === oFF.PrElementType.STRUCTURE)
		{
			parameters = operation.getStructureAt(1);
		}
		if (size > 2 && operation.getElementTypeAt(2) === oFF.PrElementType.STRING)
		{
			remoteLocation = operation.getStringAt(2);
		}
		if (size > 3 && operation.getElementTypeAt(3) === oFF.PrElementType.STRING)
		{
			fragment = operation.getStringAt(3);
		}
		if (size > 4 && operation.getElementTypeAt(4) === oFF.PrElementType.STRUCTURE)
		{
			uiTypeDefs = operation.getStructureAt(4);
		}
	}
	var newAppContainer = server.initializeProgram(instanceId, parameters, remoteLocation, fragment, uiTypeDefs);
	return newAppContainer;
};

oFF.UiServerEvOnAfterClose = function() {};
oFF.UiServerEvOnAfterClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnAfterClose.prototype._ff_c = "UiServerEvOnAfterClose";

oFF.UiServerEvOnAfterClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_AFTER_CLOSE;
};
oFF.UiServerEvOnAfterClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onAfterClose(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnAfterOpen = function() {};
oFF.UiServerEvOnAfterOpen.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnAfterOpen.prototype._ff_c = "UiServerEvOnAfterOpen";

oFF.UiServerEvOnAfterOpen.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_AFTER_OPEN;
};
oFF.UiServerEvOnAfterOpen.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onAfterOpen(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnBack = function() {};
oFF.UiServerEvOnBack.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBack.prototype._ff_c = "UiServerEvOnBack";

oFF.UiServerEvOnBack.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BACK;
};
oFF.UiServerEvOnBack.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onBack(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnBeforeClose = function() {};
oFF.UiServerEvOnBeforeClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBeforeClose.prototype._ff_c = "UiServerEvOnBeforeClose";

oFF.UiServerEvOnBeforeClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BEFORE_CLOSE;
};
oFF.UiServerEvOnBeforeClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onBeforeClose(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnBeforeOpen = function() {};
oFF.UiServerEvOnBeforeOpen.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnBeforeOpen.prototype._ff_c = "UiServerEvOnBeforeOpen";

oFF.UiServerEvOnBeforeOpen.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BEFORE_OPEN;
};
oFF.UiServerEvOnBeforeOpen.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onBeforeOpen(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnButtonPress = function() {};
oFF.UiServerEvOnButtonPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnButtonPress.prototype._ff_c = "UiServerEvOnButtonPress";

oFF.UiServerEvOnButtonPress.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_BUTTON_PRESS;
};
oFF.UiServerEvOnButtonPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onButtonPress(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnChange = function() {};
oFF.UiServerEvOnChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnChange.prototype._ff_c = "UiServerEvOnChange";

oFF.UiServerEvOnChange.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CHANGE;
};
oFF.UiServerEvOnChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onChange(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnChangedValue = function() {};
oFF.UiServerEvOnChangedValue.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnChangedValue.prototype._ff_c = "UiServerEvOnChangedValue";

oFF.UiServerEvOnChangedValue.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE;
};
oFF.UiServerEvOnChangedValue.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var offset = oFF.SphereServer.PARAM_OFFSET;
	var methodName = operation.getStringAt(offset);
	offset++;
	var op = oFF.UiAllOperations.lookupOp(methodName);
	op.executeOperation(uiAppContainer, uiContext, operation, offset);
	return uiAppContainer;
};

oFF.UiServerEvOnClick = function() {};
oFF.UiServerEvOnClick.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnClick.prototype._ff_c = "UiServerEvOnClick";

oFF.UiServerEvOnClick.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CLICK;
};
oFF.UiServerEvOnClick.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onClick(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnClose = function() {};
oFF.UiServerEvOnClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnClose.prototype._ff_c = "UiServerEvOnClose";

oFF.UiServerEvOnClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CLOSE;
};
oFF.UiServerEvOnClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onClose(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnCollapse = function() {};
oFF.UiServerEvOnCollapse.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnCollapse.prototype._ff_c = "UiServerEvOnCollapse";

oFF.UiServerEvOnCollapse.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_COLLAPSE;
};
oFF.UiServerEvOnCollapse.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onCollapse(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnContextMenu = function() {};
oFF.UiServerEvOnContextMenu.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnContextMenu.prototype._ff_c = "UiServerEvOnContextMenu";

oFF.UiServerEvOnContextMenu.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_CONTEXT_MENU;
};
oFF.UiServerEvOnContextMenu.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onContextMenu(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnDelete = function() {};
oFF.UiServerEvOnDelete.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDelete.prototype._ff_c = "UiServerEvOnDelete";

oFF.UiServerEvOnDelete.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DELETE;
};
oFF.UiServerEvOnDelete.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onDelete(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnDetailPress = function() {};
oFF.UiServerEvOnDetailPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDetailPress.prototype._ff_c = "UiServerEvOnDetailPress";

oFF.UiServerEvOnDetailPress.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DETAIL_PRESS;
};
oFF.UiServerEvOnDetailPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onDetailPress(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnDoubleClick = function() {};
oFF.UiServerEvOnDoubleClick.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDoubleClick.prototype._ff_c = "UiServerEvOnDoubleClick";

oFF.UiServerEvOnDoubleClick.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DOUBLE_CLICK;
};
oFF.UiServerEvOnDoubleClick.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onDoubleClick(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnDrop = function() {};
oFF.UiServerEvOnDrop.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnDrop.prototype._ff_c = "UiServerEvOnDrop";

oFF.UiServerEvOnDrop.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_DROP;
};
oFF.UiServerEvOnDrop.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createDropEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onDrop(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnEditingBegin = function() {};
oFF.UiServerEvOnEditingBegin.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEditingBegin.prototype._ff_c = "UiServerEvOnEditingBegin";

oFF.UiServerEvOnEditingBegin.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EDITING_BEGIN;
};
oFF.UiServerEvOnEditingBegin.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onEditingBegin(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnEditingEnd = function() {};
oFF.UiServerEvOnEditingEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEditingEnd.prototype._ff_c = "UiServerEvOnEditingEnd";

oFF.UiServerEvOnEditingEnd.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EDITING_END;
};
oFF.UiServerEvOnEditingEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onEditingEnd(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnEnter = function() {};
oFF.UiServerEvOnEnter.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnEnter.prototype._ff_c = "UiServerEvOnEnter";

oFF.UiServerEvOnEnter.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ENTER;
};
oFF.UiServerEvOnEnter.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onEnter(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnError = function() {};
oFF.UiServerEvOnError.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnError.prototype._ff_c = "UiServerEvOnError";

oFF.UiServerEvOnError.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ERROR;
};
oFF.UiServerEvOnError.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onError(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnExecute = function() {};
oFF.UiServerEvOnExecute.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnExecute.prototype._ff_c = "UiServerEvOnExecute";

oFF.UiServerEvOnExecute.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EXECUTE;
};
oFF.UiServerEvOnExecute.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onExecute(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnExpand = function() {};
oFF.UiServerEvOnExpand.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnExpand.prototype._ff_c = "UiServerEvOnExpand";

oFF.UiServerEvOnExpand.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_EXPAND;
};
oFF.UiServerEvOnExpand.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onExpand(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnFileDrop = function() {};
oFF.UiServerEvOnFileDrop.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnFileDrop.prototype._ff_c = "UiServerEvOnFileDrop";

oFF.UiServerEvOnFileDrop.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_FILE_DROP;
};
oFF.UiServerEvOnFileDrop.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onFileDrop(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnHover = function() {};
oFF.UiServerEvOnHover.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnHover.prototype._ff_c = "UiServerEvOnHover";

oFF.UiServerEvOnHover.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_HOVER;
};
oFF.UiServerEvOnHover.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onHover(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnHoverEnd = function() {};
oFF.UiServerEvOnHoverEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnHoverEnd.prototype._ff_c = "UiServerEvOnHoverEnd";

oFF.UiServerEvOnHoverEnd.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_HOVER_END;
};
oFF.UiServerEvOnHoverEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onHoverEnd(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnItemClose = function() {};
oFF.UiServerEvOnItemClose.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnItemClose.prototype._ff_c = "UiServerEvOnItemClose";

oFF.UiServerEvOnItemClose.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ITEM_CLOSE;
};
oFF.UiServerEvOnItemClose.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onItemClose(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnItemSelect = function() {};
oFF.UiServerEvOnItemSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnItemSelect.prototype._ff_c = "UiServerEvOnItemSelect";

oFF.UiServerEvOnItemSelect.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_ITEM_SELECT;
};
oFF.UiServerEvOnItemSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createItemEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onItemSelect(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnLiveChange = function() {};
oFF.UiServerEvOnLiveChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnLiveChange.prototype._ff_c = "UiServerEvOnLiveChange";

oFF.UiServerEvOnLiveChange.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_LIVE_CHANGE;
};
oFF.UiServerEvOnLiveChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onLiveChange(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnLoadFinished = function() {};
oFF.UiServerEvOnLoadFinished.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnLoadFinished.prototype._ff_c = "UiServerEvOnLoadFinished";

oFF.UiServerEvOnLoadFinished.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_LOAD_FINISHED;
};
oFF.UiServerEvOnLoadFinished.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onLoadFinished(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnMove = function() {};
oFF.UiServerEvOnMove.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMove.prototype._ff_c = "UiServerEvOnMove";

oFF.UiServerEvOnMove.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_MOVE;
};
oFF.UiServerEvOnMove.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createMoveEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onMove(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnMoveEnd = function() {};
oFF.UiServerEvOnMoveEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMoveEnd.prototype._ff_c = "UiServerEvOnMoveEnd";

oFF.UiServerEvOnMoveEnd.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_MOVE_END;
};
oFF.UiServerEvOnMoveEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createMoveEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onMoveEnd(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnMoveStart = function() {};
oFF.UiServerEvOnMoveStart.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnMoveStart.prototype._ff_c = "UiServerEvOnMoveStart";

oFF.UiServerEvOnMoveStart.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_MOVE_START;
};
oFF.UiServerEvOnMoveStart.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createMoveEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onMoveStart(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnOpen = function() {};
oFF.UiServerEvOnOpen.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnOpen.prototype._ff_c = "UiServerEvOnOpen";

oFF.UiServerEvOnOpen.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_OPEN;
};
oFF.UiServerEvOnOpen.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onOpen(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnPaste = function() {};
oFF.UiServerEvOnPaste.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnPaste.prototype._ff_c = "UiServerEvOnPaste";

oFF.UiServerEvOnPaste.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_PASTE;
};
oFF.UiServerEvOnPaste.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onPaste(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnPress = function() {};
oFF.UiServerEvOnPress.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnPress.prototype._ff_c = "UiServerEvOnPress";

oFF.UiServerEvOnPress.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_PRESS;
};
oFF.UiServerEvOnPress.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onPress(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnReadLineFinished = function() {};
oFF.UiServerEvOnReadLineFinished.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnReadLineFinished.prototype._ff_c = "UiServerEvOnReadLineFinished";

oFF.UiServerEvOnReadLineFinished.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_READ_LINE_FINISHED;
};
oFF.UiServerEvOnReadLineFinished.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onReadLineFinished(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnReadOnlyPropertySync = function() {};
oFF.UiServerEvOnReadOnlyPropertySync.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnReadOnlyPropertySync.prototype._ff_c = "UiServerEvOnReadOnlyPropertySync";

oFF.UiServerEvOnReadOnlyPropertySync.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_READ_ONLY_PROPERTY_SYNC;
};
oFF.UiServerEvOnReadOnlyPropertySync.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var propOffset = oFF.SphereServer.PARAM_OFFSET;
	var valueOffset = oFF.SphereServer.PARAM_OFFSET + 1;
	var propName = operation.getStringAt(propOffset);
	var prop = oFF.UiProperty.lookup(propName);
	if (oFF.notNull(uiContext) && oFF.notNull(prop))
	{
		var tmpVal = null;
		if (operation.get(valueOffset) !== null)
		{
			var valType = operation.getElementTypeAt(valueOffset);
			if (valType === oFF.PrElementType.INTEGER)
			{
				tmpVal = oFF.XIntegerValue.create(operation.getIntegerAt(valueOffset));
			}
			else if (valType === oFF.PrElementType.BOOLEAN)
			{
				tmpVal = oFF.XBooleanValue.create(operation.getBooleanAt(valueOffset));
			}
			else if (valType === oFF.PrElementType.DOUBLE)
			{
				tmpVal = oFF.XDoubleValue.create(operation.getDoubleAt(valueOffset));
			}
			else if (valType === oFF.PrElementType.LONG)
			{
				tmpVal = oFF.XLongValue.create(operation.getLongAt(valueOffset));
			}
			else if (valType === oFF.PrElementType.STRING)
			{
				tmpVal = oFF.XStringValue.create(operation.getStringAt(valueOffset));
			}
		}
		var uiContextBase = uiContext;
		uiContextBase.updatePropertyValue(prop, tmpVal);
	}
	return uiAppContainer;
};

oFF.UiServerEvOnRefresh = function() {};
oFF.UiServerEvOnRefresh.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnRefresh.prototype._ff_c = "UiServerEvOnRefresh";

oFF.UiServerEvOnRefresh.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_REFRESH;
};
oFF.UiServerEvOnRefresh.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onRefresh(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnResize = function() {};
oFF.UiServerEvOnResize.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnResize.prototype._ff_c = "UiServerEvOnResize";

oFF.UiServerEvOnResize.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_RESIZE;
};
oFF.UiServerEvOnResize.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createResizeEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onResize(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnScroll = function() {};
oFF.UiServerEvOnScroll.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnScroll.prototype._ff_c = "UiServerEvOnScroll";

oFF.UiServerEvOnScroll.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SCROLL;
};
oFF.UiServerEvOnScroll.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onScroll(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnScrollLoad = function() {};
oFF.UiServerEvOnScrollLoad.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnScrollLoad.prototype._ff_c = "UiServerEvOnScrollLoad";

oFF.UiServerEvOnScrollLoad.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SCROLL_LOAD;
};
oFF.UiServerEvOnScrollLoad.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onScrollLoad(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnSearch = function() {};
oFF.UiServerEvOnSearch.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSearch.prototype._ff_c = "UiServerEvOnSearch";

oFF.UiServerEvOnSearch.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SEARCH;
};
oFF.UiServerEvOnSearch.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onSearch(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnSelect = function() {};
oFF.UiServerEvOnSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSelect.prototype._ff_c = "UiServerEvOnSelect";

oFF.UiServerEvOnSelect.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SELECT;
};
oFF.UiServerEvOnSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onSelect(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnSelectionChange = function() {};
oFF.UiServerEvOnSelectionChange.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSelectionChange.prototype._ff_c = "UiServerEvOnSelectionChange";

oFF.UiServerEvOnSelectionChange.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SELECTION_CHANGE;
};
oFF.UiServerEvOnSelectionChange.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onSelectionChange(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnSelectionFinish = function() {};
oFF.UiServerEvOnSelectionFinish.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSelectionFinish.prototype._ff_c = "UiServerEvOnSelectionFinish";

oFF.UiServerEvOnSelectionFinish.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SELECTION_FINISH;
};
oFF.UiServerEvOnSelectionFinish.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onSelectionFinish(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnSitAndWait = function() {};
oFF.UiServerEvOnSitAndWait.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSitAndWait.prototype._ff_c = "UiServerEvOnSitAndWait";

oFF.UiServerEvOnSitAndWait.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_SIT_AND_WAIT;
};
oFF.UiServerEvOnSitAndWait.prototype.isControlContext = function()
{
	return false;
};
oFF.UiServerEvOnSitAndWait.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	return uiAppContainer;
};

oFF.UiServerEvOnSuggestionSelect = function() {};
oFF.UiServerEvOnSuggestionSelect.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnSuggestionSelect.prototype._ff_c = "UiServerEvOnSuggestionSelect";

oFF.UiServerEvOnSuggestionSelect.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_SUGGESTION_SELECT;
};
oFF.UiServerEvOnSuggestionSelect.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createSelectionEvent(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onSuggestionSelect(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnTableDragAndDrop = function() {};
oFF.UiServerEvOnTableDragAndDrop.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTableDragAndDrop.prototype._ff_c = "UiServerEvOnTableDragAndDrop";

oFF.UiServerEvOnTableDragAndDrop.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_TABLE_DRAG_AND_DROP;
};
oFF.UiServerEvOnTableDragAndDrop.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onTableDragAndDrop(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnTerminate = function() {};
oFF.UiServerEvOnTerminate.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTerminate.prototype._ff_c = "UiServerEvOnTerminate";

oFF.UiServerEvOnTerminate.prototype.getEventType = function()
{
	return oFF.UiEvent.ON_TERMINATE;
};
oFF.UiServerEvOnTerminate.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newEvent = this.createControlEventWithParams(uiContext, uiAppContainer, operation);
	var tsControl = uiContext;
	tsControl.onTerminate(newEvent);
	return uiAppContainer;
};

oFF.UiServerEvOnTransferEnd = function() {};
oFF.UiServerEvOnTransferEnd.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTransferEnd.prototype._ff_c = "UiServerEvOnTransferEnd";

oFF.UiServerEvOnTransferEnd.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_TRANSFER_END;
};
oFF.UiServerEvOnTransferEnd.prototype.isControlContext = function()
{
	return false;
};
oFF.UiServerEvOnTransferEnd.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	if (oFF.notNull(uiAppContainer))
	{
		var uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			uiManager.endValueTransfer();
		}
	}
	return uiAppContainer;
};

oFF.UiServerEvOnTransferStart = function() {};
oFF.UiServerEvOnTransferStart.prototype = new oFF.UiServerEvent();
oFF.UiServerEvOnTransferStart.prototype._ff_c = "UiServerEvOnTransferStart";

oFF.UiServerEvOnTransferStart.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_ON_TRANSFER_START;
};
oFF.UiServerEvOnTransferStart.prototype.isControlContext = function()
{
	return false;
};
oFF.UiServerEvOnTransferStart.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	if (oFF.notNull(uiAppContainer))
	{
		var uiManager = uiAppContainer.getUiManager();
		if (oFF.notNull(uiManager))
		{
			uiManager.startValueTransfer();
		}
	}
	return uiAppContainer;
};

oFF.UiServerEvTerminate = function() {};
oFF.UiServerEvTerminate.prototype = new oFF.UiServerEvent();
oFF.UiServerEvTerminate.prototype._ff_c = "UiServerEvTerminate";

oFF.UiServerEvTerminate.prototype.getName = function()
{
	return oFF.UiRemoteProtocol.EV_TERMINATE;
};
oFF.UiServerEvTerminate.prototype.isControlContext = function()
{
	return false;
};
oFF.UiServerEvTerminate.prototype.executeOperation = function(server, instanceId, uiAppContainer, uiContext, operation)
{
	var newAppContainer = server.terminateProgram(instanceId);
	return newAppContainer;
};

oFF.SphereServer = function() {};
oFF.SphereServer.prototype = new oFF.XObjectExt();
oFF.SphereServer.prototype._ff_c = "SphereServer";

oFF.SphereServer.PARAM_OFFSET = 3;
oFF.SphereServer.CUSTOM_PARAM_OFFSET = 4;
oFF.SphereServer.staticSetup = function() {};
oFF.SphereServer.createServer = function(process)
{
	var newObj = new oFF.SphereServer();
	newObj.setupServer(process);
	return newObj;
};
oFF.SphereServer.prototype.DEBUGGING = false;
oFF.SphereServer.prototype.TRACING = false;
oFF.SphereServer.prototype.m_application = null;
oFF.SphereServer.prototype.m_environment = null;
oFF.SphereServer.prototype.m_appContainerSet = null;
oFF.SphereServer.prototype.initServerContainer = function(environment)
{
	oFF.UiRemoteModule.getInstance();
	this.m_environment = environment;
	var kernel = oFF.Kernel.create(environment);
	var process = kernel.getKernelProcessBase();
	process.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
	this.setupServer(process);
};
oFF.SphereServer.prototype.setupServer = function(process)
{
	this.m_application = oFF.ApplicationFactory.createApplication(process);
	var theSession = this.m_application.getSession();
	theSession.setDefaultSyncType(oFF.SyncType.NON_BLOCKING);
	this.m_appContainerSet = oFF.XSetOfNameObject.create();
	this.DEBUGGING = theSession.getEnvironment().getBooleanByKeyExt(oFF.XEnvironmentConstants.FIREFLY_SPHERE_DEBUGGING, false);
	this.TRACING = theSession.getEnvironment().getBooleanByKeyExt(oFF.XEnvironmentConstants.FIREFLY_SPHERE_TRACE, false);
};
oFF.SphereServer.prototype.getLogSeverity = function()
{
	return oFF.XObjectExt.prototype.getLogSeverity.call( this );
};
oFF.SphereServer.prototype.releaseObject = function()
{
	this.m_appContainerSet = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_appContainerSet);
	this.m_application = oFF.XObjectExt.release(this.m_application);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.SphereServer.prototype.onHttpRequest = function(serverRequestResponse)
{
	var clientRequest = serverRequestResponse.getClientRequest();
	var instanceId = null;
	var isInitializeEventRequest = this.isInitializeEventRequest(clientRequest);
	try
	{
		var queryMap = clientRequest.getQueryMap();
		instanceId = queryMap.getByKey(oFF.UiRemoteProtocol.INSTANCE_ID);
		if (oFF.isNull(instanceId))
		{
			var errorResponse2 = oFF.HttpResponse.createResponse(clientRequest);
			errorResponse2.setStatusCode(oFF.HttpStatusCode.SC_NOT_ACCEPTABLE);
			errorResponse2.setStatusCodeDetails("NOT_ACCEPTABLE");
			serverRequestResponse.setResponse(errorResponse2);
		}
		else
		{
			var uiAppContainer = this.m_appContainerSet.getByKey(instanceId);
			var jsonContent = clientRequest.getJsonContent();
			var events = jsonContent.getListByKey(oFF.UiRemoteProtocol.EVENTS);
			if (oFF.notNull(uiAppContainer))
			{
				var integrityCheck = jsonContent.getStructureByKey(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
				var clientControlCount = integrityCheck.getIntegerByKey(oFF.UiRemoteProtocol.TOTAL_CONTROLS);
				var serverUiMgr = uiAppContainer.getTerminalServerUiMgr();
				if (oFF.notNull(serverUiMgr))
				{
					var fragment = jsonContent.getStringByKey(oFF.UiRemoteProtocol.FRAGMENT);
					serverUiMgr.setFragment(fragment);
					var serverControlCount = serverUiMgr.getSelectableElementCount();
					if (this.DEBUGGING && clientControlCount !== serverControlCount)
					{
						var isNotInSync = false;
						for (var i = 0; i < events.size(); i++)
						{
							var eventDesc = events.getListAt(i);
							var eventName = eventDesc.getStringAt(0);
							if (oFF.XString.isEqual(oFF.UiRemoteProtocol.EV_ON_SIT_AND_WAIT, eventName) || isInitializeEventRequest)
							{
								isNotInSync = true;
								break;
							}
						}
						if (isNotInSync === false)
						{
							var buffer = oFF.XStringBuffer.create();
							buffer.append("Server/Client control count different: ");
							buffer.appendInt(serverControlCount);
							buffer.append(" != ");
							buffer.appendInt(clientControlCount);
							this.log(buffer.toString());
						}
					}
				}
			}
			var isTerminateEvent = false;
			for (var k = 0; k < events.size(); k++)
			{
				var eventDesc2 = events.getListAt(k);
				var eventName2 = eventDesc2.getStringAt(0);
				var theEvent = oFF.UiServerEvent.lookup(eventName2);
				var context = null;
				if (theEvent.isControlContext() && oFF.notNull(uiAppContainer))
				{
					var contextId = eventDesc2.getStringAt(1);
					var uiManager = uiAppContainer.getUiManager();
					context = uiManager.selectById(contextId);
				}
				uiAppContainer = theEvent.executeOperation(this, instanceId, uiAppContainer, context, eventDesc2);
				if (oFF.XString.isEqual(oFF.UiRemoteProtocol.EV_TERMINATE, eventName2))
				{
					isTerminateEvent = true;
					break;
				}
			}
			var okResponse = oFF.HttpResponse.createResponse(clientRequest);
			if (oFF.notNull(uiAppContainer))
			{
				okResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
				okResponse.setStatusCodeDetails("OK");
				var uiManager2 = uiAppContainer.getTerminalServerUiMgr();
				var jsonResponse = uiManager2.fetchCommandSequence();
				var dispatcher = oFF.Dispatcher.getInstance();
				var stillRunningTasks = dispatcher.getProcessingTimeReceiverCount();
				if (stillRunningTasks > 0)
				{
					jsonResponse.putInteger(oFF.UiRemoteProtocol.TIMER, 1000);
				}
				var newFragment = uiManager2.getFragment();
				jsonResponse.putString(oFF.UiRemoteProtocol.FRAGMENT, newFragment);
				var integrityCheck2 = jsonResponse.putNewStructure(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
				integrityCheck2.putInteger(oFF.UiRemoteProtocol.TOTAL_CONTROLS, uiManager2.getSelectableElementCount());
				okResponse.setJsonObject(jsonResponse);
				uiAppContainer.trace(jsonContent, jsonResponse);
			}
			else if (isTerminateEvent)
			{
				okResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
				okResponse.setStatusCodeDetails("Program successfully terminated!");
			}
			else
			{
				okResponse.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
				okResponse.setStatusCodeDetails("Internal Server Error - missing program");
			}
			serverRequestResponse.setResponse(okResponse);
		}
	}
	catch (e)
	{
		if (isInitializeEventRequest)
		{
			this.terminateProgram(instanceId);
		}
		this.logExt(oFF.OriginLayer.SERVER, oFF.Severity.ERROR, 0, oFF.XException.getStackTrace(e, 0));
		var errorResponse3 = oFF.HttpResponse.createResponse(clientRequest);
		errorResponse3.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
		errorResponse3.setStatusCodeDetails("An error occured during remote program execution!");
		serverRequestResponse.setResponse(errorResponse3);
	}
};
oFF.SphereServer.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.SphereServer.prototype.getSession = function()
{
	return this.m_application.getSession();
};
oFF.SphereServer.prototype.getLogWriter = function()
{
	return this.getSession().getLogWriter();
};
oFF.SphereServer.prototype.initializeProgram = function(instanceId, parameters, remoteLocation, fragment, uiTypeDefs)
{
	var uiAppContainer = null;
	if (oFF.notNull(parameters))
	{
		var clientBase = null;
		if (oFF.notNull(remoteLocation))
		{
			clientBase = oFF.XUri.createFromUrl(remoteLocation);
			clientBase.setPath("/");
			clientBase.setQuery(null);
			clientBase.setFragment(null);
		}
		var sdk = oFF.XEnvironment.getInstance().getVariable(oFF.XEnvironmentConstants.FIREFLY_SDK);
		var sdkFile = oFF.XFile.createByNativePath(this.getSession(), sdk);
		var serverBase = sdkFile.getVfsUri();
		var process = this.getSession();
		var applicationName = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME);
		var initArgsStructure = parameters.getStructureByKey(oFF.UiRemoteProtocol.INIT_ARGS_STRUCTURE);
		var initArgsString = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_ARGS_STRING);
		var programDeviceName = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_PROGRAM_DEVICE);
		var remotePrgDevice = oFF.ProgramDevice.lookup(programDeviceName);
		uiAppContainer = oFF.UiServerPrgContainer.create(instanceId, this.TRACING);
		this.m_appContainerSet.add(uiAppContainer);
		uiAppContainer.setProgramCfg(applicationName, initArgsStructure, initArgsString, remotePrgDevice);
		var ok = uiAppContainer.initContainer(process, this.m_environment, serverBase, clientBase, parameters, fragment, uiTypeDefs);
		if (ok === false)
		{
			this.log2("Cannot find factory for application: ", applicationName);
		}
	}
	return uiAppContainer;
};
oFF.SphereServer.prototype.terminateProgram = function(instanceId)
{
	var uiPrgContainer = this.m_appContainerSet.getByKey(instanceId);
	if (oFF.notNull(uiPrgContainer))
	{
		this.m_appContainerSet.removeElement(uiPrgContainer);
		uiPrgContainer.releaseObject();
	}
	return null;
};
oFF.SphereServer.prototype.getProgramContainer = function(name)
{
	return this.m_appContainerSet.getByKey(name);
};
oFF.SphereServer.prototype.isInitializeEventRequest = function(request)
{
	var isInitializeEvent = false;
	if (oFF.notNull(request))
	{
		var jsonContent = request.getJsonContent();
		var events = jsonContent.getListByKey(oFF.UiRemoteProtocol.EVENTS);
		for (var i = 0; i < events.size(); i++)
		{
			var eventDesc = events.getListAt(i);
			var eventName = eventDesc.getStringAt(0);
			if (oFF.XString.isEqual(oFF.UiRemoteProtocol.EV_INITIALIZE, eventName))
			{
				isInitializeEvent = true;
				break;
			}
		}
	}
	return isInitializeEvent;
};

oFF.UiServerPrgContainer = function() {};
oFF.UiServerPrgContainer.prototype = new oFF.DfNameObject();
oFF.UiServerPrgContainer.prototype._ff_c = "UiServerPrgContainer";

oFF.UiServerPrgContainer.create = function(instanceId, isTracingEnabled)
{
	var newObject = new oFF.UiServerPrgContainer();
	newObject._setupInternal(instanceId);
	newObject.m_isTracingEnabled = isTracingEnabled;
	return newObject;
};
oFF.UiServerPrgContainer.prototype.m_kernel = null;
oFF.UiServerPrgContainer.prototype.m_uiProgram = null;
oFF.UiServerPrgContainer.prototype.m_application = null;
oFF.UiServerPrgContainer.prototype.m_remotePlatform = null;
oFF.UiServerPrgContainer.prototype.m_traceIndex = 0;
oFF.UiServerPrgContainer.prototype.m_traceName = null;
oFF.UiServerPrgContainer.prototype.m_isTracingEnabled = false;
oFF.UiServerPrgContainer.prototype.m_prgCfgApplicationName = null;
oFF.UiServerPrgContainer.prototype.m_prgCfgInitArgsStructure = null;
oFF.UiServerPrgContainer.prototype.m_prgCfgInitArgsString = null;
oFF.UiServerPrgContainer.prototype.m_prgCfgRemotePrgDevice = null;
oFF.UiServerPrgContainer.prototype.releaseObject = function()
{
	this.m_uiProgram = oFF.XObjectExt.release(this.m_uiProgram);
	this.m_application = oFF.XObjectExt.release(this.m_application);
	this.m_remotePlatform = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.UiServerPrgContainer.prototype.setProgramCfg = function(applicationName, initArgsStructure, initArgsString, remotePrgDevice)
{
	this.m_prgCfgApplicationName = applicationName;
	this.m_prgCfgInitArgsStructure = initArgsStructure;
	this.m_prgCfgInitArgsString = initArgsString;
	this.m_prgCfgRemotePrgDevice = remotePrgDevice;
};
oFF.UiServerPrgContainer.prototype.initContainer = function(masterProcess, environment, serverBase, clientBase, parameters, fragment, uiTypeDefs)
{
	this.m_kernel = oFF.Kernel.create(environment);
	var kernelProcess = this.m_kernel.getKernelProcessBase();
	kernelProcess.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
	kernelProcess.setDefaultSyncType(oFF.SyncType.NON_BLOCKING);
	this.m_uiProgram = this.newProgram(kernelProcess);
	if (oFF.notNull(this.m_uiProgram))
	{
		this.m_uiProgram.evalArguments();
		this.m_uiProgram.initializeProgram();
		this.m_application = this.m_uiProgram.getApplication();
		var traceName = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_TRACE_NAME);
		this.setTraceName(traceName);
		var platformName = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_PLATFORM);
		this.m_remotePlatform = oFF.XPlatform.lookupWithDefault(platformName, oFF.XPlatform.GENERIC);
		var uiServerManager = oFF.UiServerManager.create(this.m_uiProgram.getSession(), this.m_remotePlatform);
		uiServerManager.setResourceLocations(serverBase, clientBase);
		var process = this.m_uiProgram.getProcess();
		process.setEntity(oFF.ProcessEntity.GUI, uiServerManager);
		var kernel = process.getKernel();
		var subSystemContainer = kernel.getSubSystemContainer(oFF.SubSystemType.GUI);
		subSystemContainer.setSubSystem(uiServerManager);
		var selector = process.getSelector();
		selector.registerSelector(oFF.SigSelDomain.UI, uiServerManager.getSigSelProviderSelector());
		selector.registerSelector(oFF.SigSelDomain.DIALOG, uiServerManager.getSigSelProviderSelector());
		var devInfoStr = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_DEVICE_INFO);
		var devInfo = null;
		if (oFF.notNull(devInfoStr))
		{
			devInfo = oFF.UiDeviceInfo.createFromString(devInfoStr);
		}
		if (oFF.notNull(devInfo))
		{
			uiServerManager.setDeviceInfo(devInfo);
		}
		var style = parameters.getStringByKey(oFF.UiRemoteProtocol.INIT_STYLE);
		var styleClass = null;
		if (oFF.notNull(style))
		{
			styleClass = oFF.UiStyleClass.lookup(style);
		}
		if (oFF.notNull(styleClass))
		{
			uiServerManager.setDefaultStyleClass(styleClass);
		}
		uiServerManager.setFragment(fragment);
		if (oFF.notNull(uiTypeDefs))
		{
			var iterator = uiTypeDefs.getKeysAsReadOnlyListOfString().getIterator();
			while (iterator.hasNext())
			{
				var uiType = iterator.next();
				var currentUiTypeDef = uiTypeDefs.getStructureByKey(uiType);
				var flagList = currentUiTypeDef.getListByKey(oFF.UiRemoteProtocol.CAPABILITY_FLAGS);
				if (oFF.notNull(flagList))
				{
					for (var i = 0; i < flagList.size(); i++)
					{
						var flag = flagList.getStringAt(i);
						uiServerManager.setUiTypeCapabilityFlag(uiType, flag);
					}
				}
			}
		}
		this.m_application.setUiManager(uiServerManager);
		var genesis = oFF.UiGenesis.create(uiServerManager.getAnchor(), oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
		this.m_uiProgram.renderUi(genesis);
		return true;
	}
	else
	{
		return false;
	}
};
oFF.UiServerPrgContainer.prototype.newProgram = function(process)
{
	var program = null;
	var factory = oFF.ProgramRegistration.getProgramFactory(this.m_prgCfgApplicationName);
	if (oFF.notNull(factory))
	{
		program = factory.newProgram();
		var subSession = process.newSubSession();
		var theInitArgsStructure = this.m_prgCfgInitArgsStructure;
		if (oFF.isNull(theInitArgsStructure))
		{
			theInitArgsStructure = oFF.PrFactory.createStructure();
			var programMetadata = factory.getProgramMetadata();
			theInitArgsStructure = oFF.ProgramUtils.createArgStructureFromString(programMetadata, this.m_prgCfgInitArgsString);
		}
		var args = oFF.ProgramArgs.createWithStructure(theInitArgsStructure);
		var startCfg = oFF.ProgramStartCfg.create(process, this.m_prgCfgApplicationName, null, args);
		if (oFF.notNull(this.m_prgCfgRemotePrgDevice))
		{
			startCfg.setEnforcedOutputDevice(this.m_prgCfgRemotePrgDevice);
		}
		subSession.setStartConfiguration(startCfg);
		program.setProcess(subSession);
	}
	return program;
};
oFF.UiServerPrgContainer.prototype.getUiProgram = function()
{
	return this.m_uiProgram;
};
oFF.UiServerPrgContainer.prototype.getUiManager = function()
{
	return this.m_application.getUiManager();
};
oFF.UiServerPrgContainer.prototype.getGenesis = function()
{
	return this.getUiManager().getGenesis();
};
oFF.UiServerPrgContainer.prototype.getTerminalServerUiMgr = function()
{
	return this.getUiManager();
};
oFF.UiServerPrgContainer.prototype.setTraceName = function(traceName)
{
	this.m_traceName = traceName;
};
oFF.UiServerPrgContainer.prototype.trace = function(request, response)
{
	if (this.m_isTracingEnabled)
	{
		var appTracePath = "${ff_tmp}/spheretraces";
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_traceName))
		{
			appTracePath = oFF.XStringUtils.concatenate3(appTracePath, oFF.XFile.SLASH, this.m_traceName);
		}
		var session = this.m_application.getSession();
		var traceFolder = oFF.XFile.createExt(session, appTracePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		traceFolder.mkdirs();
		if (this.m_traceIndex === 0)
		{
			traceFolder.deleteChildren();
		}
		var requestPath = oFF.XStringUtils.concatenate4(appTracePath, oFF.XFile.SLASH, oFF.XInteger.convertToString(this.m_traceIndex), ".request.json");
		var responsePath = oFF.XStringUtils.concatenate4(appTracePath, oFF.XFile.SLASH, oFF.XInteger.convertToString(this.m_traceIndex), ".response.json");
		var uiTreePath = oFF.XStringUtils.concatenate4(appTracePath, oFF.XFile.SLASH, oFF.XInteger.convertToString(this.m_traceIndex), ".uitree.json");
		var requestFile = oFF.XFile.createExt(session, requestPath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		var responseFile = oFF.XFile.createExt(session, responsePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		var uiTreeFile = oFF.XFile.createExt(session, uiTreePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		var requestContent = oFF.XByteArray.convertFromString(request.toString());
		requestFile.saveByteArray(requestContent);
		var responseContent = oFF.XByteArray.convertFromString(response.toString());
		responseFile.saveByteArray(responseContent);
		var uiTree = this.getTerminalServerUiMgr().serializeUiTree();
		var uiTreeJsonString = uiTree.toString();
		var uiTreeContent = oFF.XByteArray.convertFromString(uiTreeJsonString);
		uiTreeFile.saveByteArray(uiTreeContent);
		this.m_traceIndex = this.m_traceIndex + 1;
	}
};
oFF.UiServerPrgContainer.prototype.onContextMenu = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onSelect = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onSelectionChange = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onChange = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onLiveChange = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onClick = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onDoubleClick = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onOpen = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onClose = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onBeforeOpen = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onBeforeClose = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onAfterOpen = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onAfterClose = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onCollapse = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onExpand = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onEnter = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onPress = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onEditingBegin = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onEditingEnd = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onBack = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onRefresh = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onLoadFinished = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onDelete = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onDetailPress = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onMove = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onMoveStart = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onMoveEnd = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onResize = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onSuggestionSelect = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onScroll = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onScrollLoad = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onHover = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onHoverEnd = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onPaste = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onSelectionFinish = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onSearch = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onButtonPress = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onError = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onReadLineFinished = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onExecute = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onTerminate = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onFileDrop = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onDrop = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onItemClose = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onItemSelect = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.onTableDragAndDrop = oFF.noSupport;
oFF.UiServerPrgContainer.prototype.getContext = function(identifier)
{
	var uiContext = this.getUiManager().selectById(identifier);
	if (oFF.isNull(uiContext))
	{
		this.log2("Cannot find context for ", identifier);
	}
	return uiContext;
};

oFF.SubSysGuiServerPrg = function() {};
oFF.SubSysGuiServerPrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysGuiServerPrg.prototype._ff_c = "SubSysGuiServerPrg";

oFF.SubSysGuiServerPrg.DEFAULT_PROGRAM_NAME = "@SubSys.Gui.Server";
oFF.SubSysGuiServerPrg.prototype.m_uiServerManager = null;
oFF.SubSysGuiServerPrg.prototype.newProgram = function()
{
	var newObj = new oFF.SubSysGuiServerPrg();
	newObj.setup();
	return newObj;
};
oFF.SubSysGuiServerPrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.GUI;
};
oFF.SubSysGuiServerPrg.prototype.runProcess = function()
{
	var process = this.getProcess();
	this.m_uiServerManager = oFF.UiServerManager.create(process, oFF.XPlatform.GENERIC);
	var procEnv = process.getEnvironment();
	var devInfoStr = procEnv.getStringByKeyExt(oFF.UiRemoteProtocol.INIT_DEVICE_INFO, null);
	if (oFF.notNull(devInfoStr))
	{
		var devInfo = oFF.UiDeviceInfo.createFromString(devInfoStr);
		if (oFF.notNull(devInfo))
		{
			this.m_uiServerManager.setDeviceInfo(devInfo);
		}
	}
	var styleClassStr = procEnv.getStringByKeyExt(oFF.UiRemoteProtocol.INIT_STYLE, null);
	if (oFF.notNull(styleClassStr))
	{
		var styleClass = oFF.UiStyleClass.lookup(styleClassStr);
		if (oFF.notNull(styleClass))
		{
			this.m_uiServerManager.setDefaultStyleClass(styleClass);
		}
	}
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return false;
};
oFF.SubSysGuiServerPrg.prototype.getMainApi = function()
{
	return this.m_uiServerManager;
};

oFF.SphereClient = function() {};
oFF.SphereClient.prototype = new oFF.DfUiProgram();
oFF.SphereClient.prototype._ff_c = "SphereClient";

oFF.SphereClient.DEFAULT_PROGRAM_NAME = "SphereClient";
oFF.SphereClient.PARAM_PROGRAM = "program";
oFF.SphereClient.PARAM_INIT_ARGS_STRING = "initArgsString";
oFF.SphereClient.PARAM_LOCATION = "location";
oFF.SphereClient.DEBUG_VERBOSE = false;
oFF.SphereClient.DEFAULT_LOCATION = "http://localhost:3030";
oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER = "sphereClient_remoteServer";
oFF.SphereClient.SPHERE_CLIENT_PROGRAM_NAME = "sphereClient_programName";
oFF.SphereClient.SPHERE_CLIENT_ARGUMENTS = "sphereClient_arguments";
oFF.SphereClient.SPHERE_CLIENT_TRACE_NAME = "sphereClient_traceName";
oFF.SphereClient.REMOTE_SYSTEM_NAME = "remote";
oFF.SphereClient.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.SphereClient.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.SphereClient.createNewSphereClient = function()
{
	var prg = new oFF.SphereClient();
	prg.setup();
	return prg;
};
oFF.SphereClient.prototype.m_programName = null;
oFF.SphereClient.prototype.m_prgInitArgsString = null;
oFF.SphereClient.prototype.m_remoteLocation = null;
oFF.SphereClient.prototype.m_remoteTraceName = null;
oFF.SphereClient.prototype.m_clientStarted = false;
oFF.SphereClient.prototype.m_remoteServerInput = null;
oFF.SphereClient.prototype.m_programComboBox = null;
oFF.SphereClient.prototype.m_prgInitArgsInput = null;
oFF.SphereClient.prototype.m_traceNameInput = null;
oFF.SphereClient.prototype.m_startBtn = null;
oFF.SphereClient.prototype.m_statusMessageLbl = null;
oFF.SphereClient.prototype.m_serverToClientMap = null;
oFF.SphereClient.prototype.m_clientToServerMap = null;
oFF.SphereClient.prototype.m_instanceId = null;
oFF.SphereClient.prototype.m_parameter = null;
oFF.SphereClient.prototype.m_passiveValues = null;
oFF.SphereClient.prototype.isTimerRunning = false;
oFF.SphereClient.prototype.m_locationUri = null;
oFF.SphereClient.prototype.newProgram = function()
{
	var prg = new oFF.SphereClient();
	prg.setup();
	return prg;
};
oFF.SphereClient.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.SphereClient.PARAM_PROGRAM, "Specify the program name which should be execute.", "Program name", oFF.XValueType.STRING);
	metadata.addOption(oFF.SphereClient.PARAM_INIT_ARGS_STRING, "Specify the arguments string for the remote program.", "Arguments string", oFF.XValueType.STRING);
	metadata.addOption(oFF.SphereClient.PARAM_LOCATION, "Specify the remote server on which the program should be executed", "Remote uri", oFF.XValueType.STRING);
};
oFF.SphereClient.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	this.m_programName = argStruct.getStringByKeyExt(oFF.SphereClient.PARAM_PROGRAM, null);
	this.m_prgInitArgsString = argStruct.getStringByKeyExt(oFF.SphereClient.PARAM_INIT_ARGS_STRING, "");
	this.m_remoteLocation = argStruct.getStringByKeyExt(oFF.SphereClient.PARAM_LOCATION, this.getDefaultRemoteServerUrl());
	this.m_remoteTraceName = argStruct.getStringByKeyExt(oFF.DfApplicationProgram.PARAM_TRACE_NAME, "");
};
oFF.SphereClient.prototype.initializeProgram = function()
{
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
	this.setupInternal();
};
oFF.SphereClient.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
	this.m_remoteServerInput = oFF.XObjectExt.release(this.m_remoteServerInput);
	this.m_programComboBox = oFF.XObjectExt.release(this.m_programComboBox);
	this.m_prgInitArgsInput = oFF.XObjectExt.release(this.m_prgInitArgsInput);
	this.m_traceNameInput = oFF.XObjectExt.release(this.m_traceNameInput);
	this.m_startBtn = oFF.XObjectExt.release(this.m_startBtn);
	this.m_statusMessageLbl = oFF.XObjectExt.release(this.m_statusMessageLbl);
	this.m_passiveValues = oFF.XObjectExt.release(this.m_passiveValues);
	this.m_serverToClientMap = oFF.XObjectExt.release(this.m_serverToClientMap);
	this.m_clientToServerMap = oFF.XObjectExt.release(this.m_clientToServerMap);
	this.m_parameter = oFF.XObjectExt.release(this.m_parameter);
	this.m_locationUri = oFF.XObjectExt.release(this.m_locationUri);
};
oFF.SphereClient.prototype.getLogSeverity = function()
{
	return oFF.Severity.PRINT;
};
oFF.SphereClient.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.SphereClient.prototype.getMenuBarDisplayName = function()
{
	return oFF.SphereClient.DEFAULT_PROGRAM_NAME;
};
oFF.SphereClient.prototype.setupInternal = function()
{
	this.m_clientStarted = false;
	this.registerOnProgramContainerClose(this);
};
oFF.SphereClient.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_programName) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_remoteLocation))
	{
		this.autoStart();
	}
	else
	{
		this.showInitialScreen();
	}
	this.setTitle("SphereClient");
};
oFF.SphereClient.prototype.runRemoteProgram = function()
{
	this.setupClient(this.m_programName, this.m_prgInitArgsString, this.m_remoteLocation, this.m_remoteTraceName);
	if (oFF.notNull(this.m_locationUri))
	{
		var activityIndicator = this.getGenesis().newRoot(oFF.UiType.ACTIVITY_INDICATOR);
		activityIndicator.useMaxSpace();
		activityIndicator.setIconSize(oFF.UiCssLength.create("1.5rem"));
		activityIndicator.setText(oFF.XStringUtils.concatenate4("Executing ", this.m_programName, " on ", this.m_remoteLocation));
		this.runClient();
	}
	else
	{
		this.getGenesis().showWarningToast("The specified remote server seems to be wrong!");
	}
};
oFF.SphereClient.prototype.autoStart = function()
{
	this.runRemoteProgram();
};
oFF.SphereClient.prototype.manualStart = function()
{
	this.m_remoteLocation = this.m_remoteServerInput.getText();
	this.m_programName = this.m_programComboBox.getSelectedItem() !== null ? this.m_programComboBox.getSelectedItem().getName() : null;
	this.m_prgInitArgsString = this.m_prgInitArgsInput.getText();
	this.m_remoteTraceName = this.m_traceNameInput.getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_remoteLocation) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_programName))
	{
		this.runRemoteProgram();
		this.getProcess().getUserManager().getUserSettings().putString(oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER, this.m_remoteLocation);
		this.getProcess().getUserManager().getUserSettings().putString(oFF.SphereClient.SPHERE_CLIENT_PROGRAM_NAME, this.m_programName);
		this.getProcess().getUserManager().getUserSettings().putString(oFF.SphereClient.SPHERE_CLIENT_ARGUMENTS, this.m_prgInitArgsString);
		this.getProcess().getUserManager().getUserSettings().putString(oFF.SphereClient.SPHERE_CLIENT_TRACE_NAME, this.m_remoteTraceName);
	}
	else
	{
		this.getGenesis().showWarningToast("Missing program name or remote server location! Cannot start!");
	}
};
oFF.SphereClient.prototype.updateTitle = function()
{
	this.setTitle(oFF.XStringUtils.concatenate5(this.m_programName, "@", this.m_locationUri.getHost(), ":", oFF.XInteger.convertToString(this.m_locationUri.getPort())));
};
oFF.SphereClient.prototype.showInitialScreen = function()
{
	if (this.getGenesis() !== null)
	{
		this.m_remoteLocation = this.getProcess().getUserManager().getUserSettings().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_REMOTE_SERVER, this.m_remoteLocation);
		this.m_programName = this.getProcess().getUserManager().getUserSettings().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_PROGRAM_NAME, "Athena");
		this.m_prgInitArgsString = this.getProcess().getUserManager().getUserSettings().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_ARGUMENTS, this.m_prgInitArgsString);
		this.m_remoteTraceName = this.getProcess().getUserManager().getUserSettings().getStringByKeyExt(oFF.SphereClient.SPHERE_CLIENT_TRACE_NAME, this.m_remoteTraceName);
		this.getGenesis().clearUi();
		var mainLayout = this.getGenesis().newControl(oFF.UiType.FLEX_LAYOUT);
		mainLayout.setName("ScContentWrapper");
		mainLayout.useMaxSpace();
		mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		mainLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		mainLayout.setPadding(oFF.UiCssBoxEdges.create("20px"));
		mainLayout.setBackgroundColor(oFF.UiColor.create("rgba(52,68,114, 0.08)"));
		var titleLbl = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		titleLbl.setText("Remote Ui connection");
		titleLbl.setFontSize(oFF.UiCssLength.create("20px"));
		titleLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		titleLbl.setTextAlign(oFF.UiTextAlign.CENTER);
		titleLbl.setPadding(oFF.UiCssBoxEdges.create("20px"));
		this.m_remoteServerInput = this.createFormInput(mainLayout, "Remote server:", "ScRemoteServerInput", this.m_remoteLocation, "Server url");
		this.m_programComboBox = this.createProgramComboBox(mainLayout);
		this.m_prgInitArgsInput = this.createFormInput(mainLayout, "Init args:", "ScPrgInitArgsInput", this.m_prgInitArgsString, "Arguments");
		this.m_traceNameInput = this.createFormInput(mainLayout, "Trace name:", "ScTraceNameInput", this.m_remoteTraceName, "Trace");
		this.m_startBtn = mainLayout.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_startBtn.setWidth(oFF.UiCssLength.create("120px"));
		this.m_startBtn.setText("Connect");
		this.m_startBtn.setIcon("connected");
		this.m_startBtn.setEnabled(true);
		this.m_startBtn.registerOnPress(this);
		var pusher = mainLayout.addNewItemOfType(oFF.UiType.SPACER);
		pusher.setMargin(oFF.UiCssBoxEdges.create("auto"));
		this.m_statusMessageLbl = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		this.m_statusMessageLbl.setText("");
		this.m_statusMessageLbl.setFontSize(oFF.UiCssLength.create("14px"));
		this.m_statusMessageLbl.setWidth(oFF.UiCssLength.create("90%"));
		this.m_statusMessageLbl.setBackgroundColor(oFF.UiColor.ERROR);
		this.m_statusMessageLbl.setFontColor(oFF.UiColor.WHITE);
		this.m_statusMessageLbl.setFontWeight(oFF.UiFontWeight.BOLD);
		this.m_statusMessageLbl.setTextAlign(oFF.UiTextAlign.CENTER);
		this.m_statusMessageLbl.setPadding(oFF.UiCssBoxEdges.create("10px"));
		this.m_statusMessageLbl.setCornerRadius(oFF.UiCssBoxEdges.create("5px"));
		this.m_statusMessageLbl.setVisible(false);
		this.getGenesis().setRoot(mainLayout);
	}
};
oFF.SphereClient.prototype.createFormLine = function(layout, text)
{
	var wrapperLayout = layout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	wrapperLayout.setWidth(oFF.UiCssLength.create("100%"));
	wrapperLayout.setDirection(oFF.UiFlexDirection.ROW);
	wrapperLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	var inputLabel = wrapperLayout.addNewItemOfType(oFF.UiType.LABEL);
	inputLabel.setWidth(oFF.UiCssLength.create("200px"));
	inputLabel.setText(text);
	return wrapperLayout;
};
oFF.SphereClient.prototype.createFormInput = function(layout, text, name, value, placeholder)
{
	var formLineLayout = this.createFormLine(layout, text);
	var tmpInput = formLineLayout.addNewItemOfType(oFF.UiType.INPUT);
	tmpInput.setName(name);
	tmpInput.setPlaceholder(placeholder);
	tmpInput.setText(value);
	tmpInput.registerOnEnter(this);
	return tmpInput;
};
oFF.SphereClient.prototype.createProgramComboBox = function(layout)
{
	var formLineLayout = this.createFormLine(layout, "Program: ");
	var tmpComboBox = formLineLayout.addNewItemOfType(oFF.UiType.COMBO_BOX);
	tmpComboBox.setName("ScProgramNameInput");
	tmpComboBox.setPlaceholder("Program");
	tmpComboBox.setWidth(oFF.UiCssLength.create("100%"));
	tmpComboBox.registerOnEnter(this);
	var allPrograms = oFF.ProgramRegistration.getOrderedAllEntries().getIterator();
	while (allPrograms.hasNext())
	{
		var tmpPrgManifest = allPrograms.next();
		if (tmpPrgManifest.getOutputDevice() !== oFF.ProgramDevice.CONSOLE && tmpPrgManifest.getOutputDevice() !== oFF.ProgramDevice.NONE && oFF.XString.isEqual(tmpPrgManifest.getProgramName(), oFF.SphereClient.DEFAULT_PROGRAM_NAME) === false)
		{
			var newItem = tmpComboBox.addNewItem();
			newItem.setName(tmpPrgManifest.getProgramName());
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tmpPrgManifest.getDescription()))
			{
				newItem.setText(oFF.XStringUtils.concatenate3(tmpPrgManifest.getProgramName(), " - ", tmpPrgManifest.getDescription()));
			}
			else
			{
				newItem.setText(tmpPrgManifest.getProgramName());
			}
		}
	}
	tmpComboBox.setSelectedName(this.m_programName);
	return tmpComboBox;
};
oFF.SphereClient.prototype.showError = function(message)
{
	if (oFF.notNull(this.m_statusMessageLbl))
	{
		this.m_statusMessageLbl.setVisible(true);
		this.m_statusMessageLbl.setText(message);
		this.m_statusMessageLbl.setBackgroundColor(oFF.UiColor.ERROR);
		this.m_startBtn.setEnabled(true);
	}
};
oFF.SphereClient.prototype.getDefaultRemoteServerUrl = function()
{
	var tmpRemoteUri = oFF.NetworkEnv.getLocation();
	if (oFF.notNull(tmpRemoteUri))
	{
		var adapted = oFF.XUri.createFromOther(tmpRemoteUri);
		if (oFF.notNull(adapted))
		{
			adapted.setPath(null);
			adapted.setQuery(null);
			adapted.setFragment(null);
			return adapted.getUrl();
		}
	}
	return oFF.SphereClient.DEFAULT_LOCATION;
};
oFF.SphereClient.prototype.isLocalClientEvent = function(event)
{
	if (!this.m_clientStarted)
	{
		return true;
	}
	if (event.getControl() === this.m_startBtn || this.isShowMenuBar() && this.getMenuBar().getItems().contains(event.getControl()))
	{
		return true;
	}
	if (this.getProgramDevice() !== oFF.ProgramDevice.EMBEDDED && oFF.XString.isEqual(oFF.DfUiProgram.DEFAULT_MENU_BAR_PROGRAM_NAME_MENU_EXIT_BTN_TAG, event.getControl().getTag()))
	{
		return true;
	}
	return false;
};
oFF.SphereClient.prototype.onProgramContainerClose = function(prgContainer)
{
	this.terminateRemoteProgram();
};
oFF.SphereClient.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.SphereClient.prototype.setupClient = function(programName, prgInitArgsString, locationUri, traceName)
{
	this.m_passiveValues = oFF.XProperties.create();
	this.m_serverToClientMap = oFF.XHashMapByString.create();
	this.m_clientToServerMap = oFF.XHashMapOfStringByString.create();
	this.m_instanceId = oFF.XGuid.getGuid();
	this.m_parameter = oFF.PrFactory.createStructure();
	this.m_locationUri = this.prepareRemoteUri(locationUri);
	if (oFF.notNull(this.m_locationUri))
	{
		this.getApplication().getConnectionPool().clearConnections();
		var application = this.getApplication();
		var sysLand = oFF.StandaloneSystemLandscape.create(this);
		var system = sysLand.setSystemByUri(oFF.SphereClient.REMOTE_SYSTEM_NAME, this.m_locationUri, oFF.SystemType.GENERIC);
		system.setIsCsrfTokenRequired(false);
		application.setSystemLandscape(sysLand);
		if (oFF.notNull(programName))
		{
			this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME, programName);
		}
		if (oFF.notNull(prgInitArgsString))
		{
			this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_ARGS_STRING, prgInitArgsString);
		}
		if (oFF.notNull(traceName))
		{
			this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_TRACE_NAME, traceName);
		}
		var prgDevice = this.getProgramDevice();
		if (oFF.notNull(prgDevice))
		{
			this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_PROGRAM_DEVICE, prgDevice.getName());
		}
		var variableNames = oFF.XEnvironment.getInstance().getVariableNames();
		var iterator = variableNames.getIterator();
		while (iterator.hasNext())
		{
			var key = iterator.next();
			var value = oFF.XEnvironment.getInstance().getVariable(key);
			if (oFF.XString.isEqual(oFF.XString.toLowerCase(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME), key))
			{
				this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_PROGRAM_NAME, value);
			}
			else if (oFF.XString.isEqual(oFF.XString.toLowerCase(oFF.UiRemoteProtocol.INIT_STYLE), oFF.XString.toLowerCase(key)))
			{
				this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_STYLE, value);
			}
			else
			{
				this.m_parameter.putString(key, value);
			}
		}
		var fragment = oFF.NetworkEnv.getFragment();
		this.m_parameter.putString(oFF.UiRemoteProtocol.FRAGMENT, fragment);
		this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_PLATFORM, this.getUiManager().getPlatform().getName());
		this.m_parameter.putString(oFF.UiRemoteProtocol.INIT_DEVICE_INFO, this.getUiManager().getDeviceInfo().getDeviceInfoString());
		var allUiTypes = oFF.UiType.getAllUiTypes();
		while (allUiTypes.hasNext())
		{
			var currentType = allUiTypes.next();
			if (currentType.isComposite())
			{
				currentType.setFactory(new oFF.UiCompositeRemoteFactory());
			}
		}
	}
};
oFF.SphereClient.prototype.runClient = function()
{
	var ocpFunction = this.prepareFunction();
	var initEventList = this.prepareInitEvent(ocpFunction);
	initEventList.addString(oFF.UiRemoteProtocol.EV_INITIALIZE);
	initEventList.add(this.m_parameter);
	var location = oFF.NetworkEnv.getLocation();
	if (oFF.notNull(location))
	{
		initEventList.addString(location.getUrl());
	}
	else
	{
		initEventList.addString(oFF.SphereClient.DEFAULT_LOCATION);
	}
	var fragment = oFF.NetworkEnv.getFragment();
	initEventList.addString(fragment);
	var uiTypeDefs = initEventList.addNewStructure();
	var allUiTypes = oFF.UiType.getAllUiTypes();
	while (allUiTypes.hasNext())
	{
		var uiType = allUiTypes.next();
		var simpleFlags = uiType.getCapabilityFlags();
		if (oFF.notNull(simpleFlags))
		{
			var name = uiType.getName();
			var typeInfos = uiTypeDefs.putNewStructure(name);
			var simpleFlagList = typeInfos.putNewList(oFF.UiRemoteProtocol.CAPABILITY_FLAGS);
			var flagIterator = simpleFlags.getIterator();
			while (flagIterator.hasNext())
			{
				simpleFlagList.addString(flagIterator.next());
			}
		}
	}
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.terminateRemoteProgram = function()
{
	if (this.m_clientStarted)
	{
		this.m_clientStarted = false;
		var ocpFunction = this.prepareFunction();
		ocpFunction.getRpcRequest().setIsFireAndForgetCall(true);
		var initEventList = this.prepareInitEvent(ocpFunction);
		initEventList.addString(oFF.UiRemoteProtocol.EV_TERMINATE);
		ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, null, null);
	}
};
oFF.SphereClient.prototype.prepareUiEvent = function(event, eventDef, ocpFunction)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Missing event! Please specify an event!");
	}
	var singleEvent = this.prepareSingleEvent(ocpFunction);
	var control = event.getControl();
	this.addOperation(singleEvent, eventDef.getRemoteName(), control);
	var parametersStr = null;
	if (event.getParameters() !== null)
	{
		parametersStr = event.getParameters().serialize();
	}
	singleEvent.addString(parametersStr);
	return singleEvent;
};
oFF.SphereClient.prototype.sendControlEvent = function(event, eventDef)
{
	var ocpFunction = this.prepareFunction();
	this.prepareUiEvent(event, eventDef, ocpFunction);
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.sendSelectionEvent = function(event, eventDef)
{
	var ocpFunction = this.prepareFunction();
	var singleEvent = this.prepareUiEvent(event, eventDef, ocpFunction);
	try
	{
		var selectedItems = event.getSelectedItems();
		var selectedItemIds = this.createControlIdsStringFromList(selectedItems);
		singleEvent.addString(selectedItemIds);
	}
	catch (e)
	{
		oFF.XLogger.println("[SphereClient] Warning - Expected a UiSelectionEvent! Sending limited event data!");
	}
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.sendResizeEvent = function(event, eventDef)
{
	var ocpFunction = this.prepareFunction();
	var singleEvent = this.prepareUiEvent(event, eventDef, ocpFunction);
	try
	{
		singleEvent.addInteger(event.getOffsetWidth());
		singleEvent.addInteger(event.getOffsetHeight());
	}
	catch (e)
	{
		oFF.XLogger.println("[SphereClient] Warning - Expected a UiResizeEvent! Sending limited event data!");
	}
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.sendMoveEvent = function(event, eventDef)
{
	var ocpFunction = this.prepareFunction();
	var singleEvent = this.prepareUiEvent(event, eventDef, ocpFunction);
	try
	{
		singleEvent.addInteger(event.getOffsetX());
		singleEvent.addInteger(event.getOffsetY());
	}
	catch (e)
	{
		oFF.XLogger.println("[SphereClient] Warning - Expected a UiMoveEvent! Sending limited event data!");
	}
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.sendDropEvent = function(event, eventDef)
{
	var ocpFunction = this.prepareFunction();
	var singleEvent = this.prepareUiEvent(event, eventDef, ocpFunction);
	try
	{
		this.addControlRef(singleEvent, event.getDraggedControl());
		this.addControlRef(singleEvent, event.getDroppedControl());
		if (event.getRelativeDropPosition() !== null)
		{
			singleEvent.addString(event.getRelativeDropPosition().getName());
		}
	}
	catch (e)
	{
		oFF.XLogger.println("[SphereClient] Warning - Expected a UIDropEvent! Sending limited event data!");
	}
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.sendItemEvent = function(event, eventDef)
{
	var ocpFunction = this.prepareFunction();
	var singleEvent = this.prepareUiEvent(event, eventDef, ocpFunction);
	try
	{
		this.addControlRef(singleEvent, event.getAffectedItem());
	}
	catch (e)
	{
		oFF.XLogger.println("[SphereClient] Warning - Expected a UIItemEvent! Sending limited event data!");
	}
	ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.SphereClient.prototype.prepareRequest = function(ocpFunction)
{
	var requestStructure = oFF.PrFactory.createStructure();
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	var eventList = requestStructure.putNewList(oFF.UiRemoteProtocol.EVENTS);
	requestStructure.putString(oFF.UiRemoteProtocol.INSTANCE_ID, this.m_instanceId);
	var integrityCheck = requestStructure.putNewStructure(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
	integrityCheck.putInteger(oFF.UiRemoteProtocol.TOTAL_CONTROLS, this.getUiManager().getSelectableElementCount());
	return eventList;
};
oFF.SphereClient.prototype.prepareInitEvent = function(ocpFunction)
{
	var eventList = this.prepareRequest(ocpFunction);
	var singleEvent = eventList.addNewList();
	return singleEvent;
};
oFF.SphereClient.prototype.prepareSingleEvent = function(ocpFunction)
{
	var eventList = this.prepareRequest(ocpFunction);
	this.passiveValueTransfer(eventList);
	var singleEvent = eventList.addNewList();
	return singleEvent;
};
oFF.SphereClient.prototype.prepareRemoteUri = function(locationUri)
{
	var tmpRemoteUri = null;
	if (oFF.notNull(locationUri))
	{
		tmpRemoteUri = oFF.XUri.createFromUrl(locationUri);
	}
	else
	{
		tmpRemoteUri = oFF.NetworkEnv.getLocation();
		if (oFF.isNull(tmpRemoteUri))
		{
			tmpRemoteUri = oFF.XUri.createFromUrl(oFF.SphereClient.DEFAULT_LOCATION);
		}
		else
		{
			var adapted = oFF.XUri.createFromOther(tmpRemoteUri);
			adapted.setPath(null);
			adapted.setQuery(null);
			adapted.setFragment(null);
			return adapted;
		}
	}
	if (oFF.notNull(tmpRemoteUri) && oFF.XStringUtils.isNotNullAndNotEmpty(tmpRemoteUri.getHost()))
	{
		return tmpRemoteUri;
	}
	return null;
};
oFF.SphereClient.prototype.prepareFunction = function()
{
	var connection = this.getApplication().getConnectionPool().getConnection(oFF.SphereClient.REMOTE_SYSTEM_NAME);
	var buffer = oFF.XStringBuffer.create();
	buffer.append("/remote/myapp?");
	buffer.append(oFF.UiRemoteProtocol.INSTANCE_ID);
	buffer.append("=");
	buffer.append(this.m_instanceId);
	var path = buffer.toString();
	var ocpFunction = connection.newRpcFunction(path);
	ocpFunction.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
	return ocpFunction;
};
oFF.SphereClient.prototype.passiveValueTransfer = function(eventList)
{
	var changedValueTransfer;
	changedValueTransfer = eventList.addNewList();
	changedValueTransfer.addString(oFF.UiRemoteProtocol.EV_ON_TRANSFER_START);
	var theId;
	var element;
	var item;
	var storageId;
	var capabilityName = oFF.UiType._SUPPORTS_TEXT_CHANGE;
	var select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newText;
		var oldText;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newText = element.getText();
			oldText = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newText, oldText) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.TEXT.getSetterMethodName());
				changedValueTransfer.addString(newText);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_CHECKED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newChecked;
		var oldChecked;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newChecked = element.isChecked();
			oldChecked = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newChecked !== oldChecked)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.CHECKED.getSetterMethodName());
				changedValueTransfer.addBoolean(element.isChecked());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_ON_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newOn;
		var oldOn;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newOn = element.isOn();
			oldOn = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newOn !== oldOn)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.ON.getSetterMethodName());
				changedValueTransfer.addBoolean(element.isOn());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newSelected;
		var oldSelected;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newSelected = element.isSelected();
			oldSelected = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newSelected !== oldSelected)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.SELECTED.getSetterMethodName());
				changedValueTransfer.addBoolean(element.isSelected());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_EXPANDED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newExpanded;
		var oldExpanded;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newExpanded = element.isExpanded();
			oldExpanded = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newExpanded !== oldExpanded)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.EXPANDED.getSetterMethodName());
				changedValueTransfer.addBoolean(element.isExpanded());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_VALUE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newValue;
		var oldValue;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newValue = element.getValue();
			oldValue = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newValue, oldValue) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.VALUE.getSetterMethodName());
				changedValueTransfer.addString(newValue);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SLIDER_VALUE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newSliderValue;
		var oldSliderValue;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newSliderValue = element.getSliderValue();
			oldSliderValue = this.m_passiveValues.getIntegerByKeyExt(storageId, -1);
			if (newSliderValue !== oldSliderValue)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.SLIDER_VALUE.getSetterMethodName());
				changedValueTransfer.addInteger(element.getSliderValue());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_RANGE_SLIDER_VALUE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newSliderUpperValue;
		var oldSliderUpperValue;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newSliderUpperValue = element.getSliderUpperValue();
			oldSliderUpperValue = this.m_passiveValues.getIntegerByKeyExt(storageId, -1);
			if (newSliderUpperValue !== oldSliderUpperValue)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.SLIDER_UPPER_VALUE.getSetterMethodName());
				changedValueTransfer.addInteger(element.getSliderUpperValue());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_COMMAND_HISTORY_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newCommandHistory;
		var oldCommandHistory;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newCommandHistory = this.createStringFromListOfStrings(element.getCommandHistory());
			oldCommandHistory = this.m_passiveValues.getStringByKeyExt(storageId, "");
			if (oFF.XString.isEqual(newCommandHistory, oldCommandHistory) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.COMMAND_HISTORY.getSetterMethodName());
				changedValueTransfer.addString(newCommandHistory);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_VISIBLE_ROW_COUNT_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newVisibleRowCount;
		var oldVisibleRowCount;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newVisibleRowCount = element.getVisibleRowCount();
			oldVisibleRowCount = this.m_passiveValues.getIntegerByKeyExt(storageId, -1);
			if (newVisibleRowCount !== oldVisibleRowCount)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.VISIBLE_ROW_COUNT.getSetterMethodName());
				changedValueTransfer.addInteger(newVisibleRowCount);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newFirstVisibleRowId;
		var oldFirstVisibleRowId;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			var firstVisibleRow = element.getFirstVisibleRow();
			if (oFF.notNull(firstVisibleRow))
			{
				newFirstVisibleRowId = firstVisibleRow.getId();
				oldFirstVisibleRowId = this.m_passiveValues.getStringByKey(storageId);
				if (oFF.XString.isEqual(newFirstVisibleRowId, oldFirstVisibleRowId) === false)
				{
					changedValueTransfer = eventList.addNewList();
					this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
					changedValueTransfer.addString(oFF.UiProperty.FIRST_VISIBLE_ROW.getSetterMethodName());
					theId = newFirstVisibleRowId;
					theId = this.lookupServerId(theId);
					changedValueTransfer.addString(theId);
				}
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_NAVIGATION_PAGES_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newNavigationPages;
		var oldNavigationPages;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newNavigationPages = this.createControlIdsStringFromList(element.getPages());
			oldNavigationPages = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newNavigationPages, oldNavigationPages) === false)
			{
				changedValueTransfer = eventList.addNewList();
				var newNavPagesList = oFF.XStringTokenizer.splitString(newNavigationPages, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
				var oldNavPagesList = oFF.XStringTokenizer.splitString(oldNavigationPages, oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
				if (oFF.isNull(newNavPagesList))
				{
					newNavPagesList = oFF.XListOfString.create();
				}
				if (oFF.isNull(oldNavPagesList))
				{
					oldNavPagesList = oFF.XListOfString.create();
				}
				if (newNavPagesList.size() < oldNavPagesList.size())
				{
					for (var b = 0; b < oldNavPagesList.size(); b++)
					{
						var tmpControlId = oldNavPagesList.get(b);
						if (newNavPagesList.contains(tmpControlId) === false)
						{
							this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
							changedValueTransfer.addString(oFF.UiAggregation.PAGES.getRemoveMethodName());
							changedValueTransfer.addString(tmpControlId);
						}
					}
				}
				this.m_passiveValues.putString(storageId, newNavigationPages);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_START_DATE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newStartDate;
		var oldStartDate;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newStartDate = element.getStartDate();
			oldStartDate = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newStartDate, oldStartDate) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.START_DATE.getSetterMethodName());
				changedValueTransfer.addString(newStartDate);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_END_DATE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newEndDate;
		var oldEndDate;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newEndDate = element.getEndDate();
			oldEndDate = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newEndDate, oldEndDate) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.END_DATE.getSetterMethodName());
				changedValueTransfer.addString(newEndDate);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_PRESSED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newPressed;
		var oldPressed;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newPressed = element.isPressed();
			oldPressed = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newPressed !== oldPressed)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiProperty.PRESSED.getSetterMethodName());
				changedValueTransfer.addBoolean(element.isPressed());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEM;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newSelectedId;
		var oldSelectedId;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			item = element.getSelectedItem();
			if (oFF.notNull(item))
			{
				newSelectedId = item.getId();
				oldSelectedId = this.m_passiveValues.getStringByKey(storageId);
				if (oFF.XString.isEqual(newSelectedId, oldSelectedId) === false)
				{
					changedValueTransfer = eventList.addNewList();
					this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
					changedValueTransfer.addString(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEM);
					theId = newSelectedId;
					theId = this.lookupServerId(theId);
					changedValueTransfer.addString(theId);
				}
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEMS;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			var selectedItems = element.getSelectedItems();
			var newSelectedIds = this.createControlIdsStringFromList(selectedItems);
			var oldSelectedIds = this.m_passiveValues.getStringByKey(storageId);
			if (oFF.XString.isEqual(newSelectedIds, oldSelectedIds) === false)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_CHANGED_VALUE, element);
				changedValueTransfer.addString(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEMS);
				changedValueTransfer.addString(newSelectedIds);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OPEN_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newIsOpen;
		var oldIsOpen;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newIsOpen = element.isOpen();
			oldIsOpen = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newIsOpen !== oldIsOpen)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_READ_ONLY_PROPERTY_SYNC, element);
				changedValueTransfer.addString(oFF.UiProperty.OPEN.getName());
				changedValueTransfer.addBoolean(newIsOpen);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_MAXIMIZED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newIsMaximized;
		var oldIsMaximized;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newIsMaximized = element.isMaximized();
			oldIsMaximized = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newIsMaximized !== oldIsMaximized)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_READ_ONLY_PROPERTY_SYNC, element);
				changedValueTransfer.addString(oFF.UiProperty.MAXIMIZED.getName());
				changedValueTransfer.addBoolean(newIsMaximized);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_HIDDEN_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newIsHidden;
		var oldIsHidden;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newIsHidden = element.isHidden();
			oldIsHidden = this.m_passiveValues.getBooleanByKeyExt(storageId, false);
			if (newIsHidden !== oldIsHidden)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_READ_ONLY_PROPERTY_SYNC, element);
				changedValueTransfer.addString(oFF.UiProperty.HIDDEN.getName());
				changedValueTransfer.addBoolean(newIsHidden);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OFFSET_HEIGHT_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newOffsetHeight;
		var oldOffsetHeight;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newOffsetHeight = element.getOffsetHeight();
			oldOffsetHeight = this.m_passiveValues.getIntegerByKeyExt(storageId, 0);
			if (newOffsetHeight !== oldOffsetHeight)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_READ_ONLY_PROPERTY_SYNC, element);
				changedValueTransfer.addString(oFF.UiProperty.OFFSET_HEIGHT.getName());
				changedValueTransfer.addInteger(newOffsetHeight);
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OFFSET_WIDTH_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var newOffsetWidth;
		var oldOffsetWidth;
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			newOffsetWidth = element.getOffsetWidth();
			oldOffsetWidth = this.m_passiveValues.getIntegerByKeyExt(storageId, 0);
			if (newOffsetWidth !== oldOffsetWidth)
			{
				changedValueTransfer = eventList.addNewList();
				this.addOperation(changedValueTransfer, oFF.UiRemoteProtocol.EV_ON_READ_ONLY_PROPERTY_SYNC, element);
				changedValueTransfer.addString(oFF.UiProperty.OFFSET_WIDTH.getName());
				changedValueTransfer.addInteger(newOffsetWidth);
			}
		}
	}
	changedValueTransfer = eventList.addNewList();
	changedValueTransfer.addString(oFF.UiRemoteProtocol.EV_ON_TRANSFER_END);
};
oFF.SphereClient.prototype.collectPassiveValues = function()
{
	var element;
	var storageId;
	this.m_passiveValues = oFF.XProperties.create();
	var capabilityName = oFF.UiType._SUPPORTS_TEXT_CHANGE;
	var select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, element.getText());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_CHECKED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isChecked());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_ON_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isOn());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isSelected());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_EXPANDED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isExpanded());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_VALUE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, element.getValue());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SLIDER_VALUE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putInteger(storageId, element.getSliderValue());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_RANGE_SLIDER_VALUE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putInteger(storageId, element.getSliderUpperValue());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_COMMAND_HISTORY_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			var commandsStr = this.createStringFromListOfStrings(element.getCommandHistory());
			this.m_passiveValues.putString(storageId, commandsStr);
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_VISIBLE_ROW_COUNT_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putInteger(storageId, element.getVisibleRowCount());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_FIRST_VISIBLE_ROW_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var firstVisibleRow;
		while (select.hasNext())
		{
			element = select.next();
			firstVisibleRow = element.getFirstVisibleRow();
			if (oFF.notNull(firstVisibleRow))
			{
				storageId = this.createStorageId(element.getId(), capabilityName);
				this.m_passiveValues.putString(storageId, firstVisibleRow.getId());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_NAVIGATION_PAGES_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			var navPagesIds = this.createControlIdsStringFromList(element.getPages());
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, navPagesIds);
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_START_DATE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, element.getStartDate());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_END_DATE_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, element.getEndDate());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_PRESSED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isPressed());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEM;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		var item;
		while (select.hasNext())
		{
			element = select.next();
			item = element.getSelectedItem();
			if (oFF.notNull(item))
			{
				storageId = this.createStorageId(element.getId(), capabilityName);
				this.m_passiveValues.putString(storageId, item.getId());
			}
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_SELECTED_ITEMS;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			var selectedItems = element.getSelectedItems();
			var selectedIds = this.createControlIdsStringFromList(selectedItems);
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putString(storageId, selectedIds);
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OPEN_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isOpen());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_MAXIMIZED_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isMaximized());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_HIDDEN_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putBoolean(storageId, element.isHidden());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OFFSET_HEIGHT_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putInteger(storageId, element.getOffsetHeight());
		}
	}
	capabilityName = oFF.UiType._SUPPORTS_OFFSET_WIDTH_CHANGE;
	select = this.selectByCapability(capabilityName);
	if (oFF.notNull(select) && select.hasNext())
	{
		while (select.hasNext())
		{
			element = select.next();
			storageId = this.createStorageId(element.getId(), capabilityName);
			this.m_passiveValues.putInteger(storageId, element.getOffsetWidth());
		}
	}
};
oFF.SphereClient.prototype.selectByCapability = function(capabilityFlag)
{
	var uiTypeList = oFF.UiType.lookupByCapabilityFlag(capabilityFlag);
	if (oFF.isNull(uiTypeList) || uiTypeList.isEmpty())
	{
		return null;
	}
	var selectStatement = oFF.XStringBuffer.create();
	for (var i = 0; i < uiTypeList.size(); i++)
	{
		if (i > 0)
		{
			selectStatement.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
		}
		selectStatement.append("?");
		selectStatement.append(uiTypeList.get(i).getName());
	}
	var selection = selectStatement.toString();
	var select = this.getUiManager().select(selection);
	return select;
};
oFF.SphereClient.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	if (extResult.isValid())
	{
		if (!this.m_clientStarted)
		{
			this.m_clientStarted = true;
			this.updateTitle();
		}
		var jsonContent = response.getRootElement();
		var integrityCheck = jsonContent.getStructureByKey(oFF.UiRemoteProtocol.INTEGRITY_CHECK);
		var serverControlCount = integrityCheck.getIntegerByKey(oFF.UiRemoteProtocol.TOTAL_CONTROLS);
		var fragment = jsonContent.getStringByKey(oFF.UiRemoteProtocol.FRAGMENT);
		if (oFF.notNull(fragment))
		{
			oFF.NetworkEnv.setFragment(fragment);
		}
		var timer = jsonContent.getIntegerByKeyExt(oFF.UiRemoteProtocol.TIMER, -1);
		var list = jsonContent.getListByKey(oFF.UiRemoteProtocol.OPERATIONS);
		var size = list.size();
		for (var i = 0; i < size; i++)
		{
			var operation = list.getListAt(i);
			var offset = 0;
			var methodName = operation.getStringAt(offset);
			offset = offset + 1;
			var op = oFF.UiAllOperations.lookupOp(methodName);
			if (oFF.notNull(op))
			{
				var uiContext = null;
				var contextName = operation.getStringAt(offset);
				offset = offset + 1;
				if (oFF.notNull(contextName))
				{
					uiContext = this.m_serverToClientMap.getByKey(contextName);
					if (oFF.isNull(uiContext))
					{
						this.logError2("Cannot find control context ", contextName);
					}
				}
				var retContextName = operation.getStringAt(offset);
				offset = offset + 1;
				var returnObj = op.executeOperation(this, uiContext, operation, offset);
				if (oFF.notNull(returnObj) && oFF.XStringUtils.isNotNullAndNotEmpty(retContextName) && returnObj.isReleased() === false)
				{
					var componentType = returnObj.getComponentType();
					if (componentType.isTypeOf(oFF.XComponentType._UI))
					{
						var uiReturnContext = returnObj;
						this.m_serverToClientMap.put(retContextName, uiReturnContext);
						var uiId = uiReturnContext.getId();
						if (oFF.XString.isEqual(uiId, retContextName) === false)
						{
							this.m_clientToServerMap.put(uiId, retContextName);
						}
					}
				}
				else if (oFF.notNull(returnObj) && oFF.XStringUtils.isNotNullAndNotEmpty(retContextName) && returnObj.isReleased())
				{
					this.cleanupControlMappingAfterRelease(retContextName);
				}
			}
			else
			{
				this.log2("Cannot find operation: ", methodName);
			}
		}
		var clientControlCount = this.getUiManager().getSelectableElementCount();
		if (serverControlCount !== clientControlCount && oFF.SphereClient.DEBUG_VERBOSE)
		{
			var buffer = oFF.XStringBuffer.create();
			buffer.append("Client/Server control count different: ");
			buffer.appendInt(clientControlCount);
			buffer.append(" != ");
			buffer.appendInt(serverControlCount);
			this.log(buffer.toString());
			buffer = oFF.XStringBuffer.create();
			var iterator = this.getUiManager().getSelectableElements();
			while (iterator.hasNext())
			{
				buffer.append(iterator.next().getId());
				buffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
			}
			this.log(buffer.toString());
		}
		this.collectPassiveValues();
		if (timer !== -1 && this.isTimerRunning === false)
		{
			this.isTimerRunning = true;
			this.getUiManager().setTimer(timer, this, null);
		}
	}
	else
	{
		this.log("Error in ocp call");
		this.log(extResult.getSummary());
		if (!this.m_clientStarted)
		{
			this.showInitialScreen();
			this.showError(extResult.getErrors().get(0).getStringRepresentation());
		}
	}
};
oFF.SphereClient.prototype.onTimer = function(uiManager, customIdentifier)
{
	if (this.m_clientStarted)
	{
		this.isTimerRunning = false;
		var ocpFunction = this.prepareFunction();
		var singleEvent = this.prepareSingleEvent(ocpFunction);
		singleEvent.addString(oFF.UiRemoteProtocol.EV_ON_SIT_AND_WAIT);
		ocpFunction.processFunctionExecution(oFF.SyncType.NON_BLOCKING, this, null);
	}
};
oFF.SphereClient.prototype.addOperation = function(paramList, opName, item)
{
	paramList.addString(opName);
	this.addControlRef(paramList, item);
};
oFF.SphereClient.prototype.addControlRef = function(paramList, item)
{
	var theId = null;
	var theName = null;
	if (oFF.notNull(item))
	{
		theId = item.getId();
		theId = this.lookupServerId(theId);
		theName = item.getName();
	}
	paramList.addString(theId);
	paramList.addString(theName);
};
oFF.SphereClient.prototype.createControlIdsStringFromList = function(controlList)
{
	if (oFF.isNull(controlList) || controlList.isEmpty())
	{
		return null;
	}
	var controlIdsBuffer = oFF.XStringBuffer.create();
	for (var a = 0; a < controlList.size(); a++)
	{
		var tmpControl = controlList.get(a);
		if (a > 0)
		{
			controlIdsBuffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
		}
		controlIdsBuffer.append(this.lookupServerId(tmpControl.getId()));
	}
	return controlIdsBuffer.toString();
};
oFF.SphereClient.prototype.createStringFromListOfStrings = function(listOfString)
{
	var stringBuffer = oFF.XStringBuffer.create();
	for (var a = 0; a < listOfString.size(); a++)
	{
		var tmpStr = listOfString.get(a);
		if (a > 0)
		{
			stringBuffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
		}
		stringBuffer.append(this.lookupServerId(tmpStr));
	}
	return stringBuffer.toString();
};
oFF.SphereClient.prototype.createStorageId = function(elementId, capabilityName)
{
	return oFF.XStringUtils.concatenate3(elementId, "_", capabilityName);
};
oFF.SphereClient.prototype.cleanupControlMappingAfterRelease = function(contextName)
{
	this.m_serverToClientMap.remove(contextName);
	var mappedClientId = null;
	var keysIterator = this.m_clientToServerMap.getKeysAsIteratorOfString();
	while (keysIterator.hasNext())
	{
		var tmpKey = keysIterator.next();
		var tmpValue = this.m_clientToServerMap.getByKey(tmpKey);
		if (oFF.XString.isEqual(contextName, tmpValue))
		{
			mappedClientId = tmpKey;
			break;
		}
	}
	this.m_clientToServerMap.remove(mappedClientId);
};
oFF.SphereClient.prototype.lookupServerId = function(clientId)
{
	var serverId = this.m_clientToServerMap.getByKey(clientId);
	if (oFF.notNull(serverId))
	{
		return serverId;
	}
	return clientId;
};
oFF.SphereClient.prototype.getContext = function(identifier)
{
	if (oFF.XStringUtils.isNullOrEmpty(identifier))
	{
		return null;
	}
	return this.m_serverToClientMap.getByKey(identifier);
};
oFF.SphereClient.prototype.onContextMenu = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_CONTEXT_MENU);
};
oFF.SphereClient.prototype.onSelect = function(event)
{
	this.sendSelectionEvent(event, oFF.UiEvent.ON_SELECT);
};
oFF.SphereClient.prototype.onSelectionChange = function(event)
{
	this.sendSelectionEvent(event, oFF.UiEvent.ON_SELECTION_CHANGE);
};
oFF.SphereClient.prototype.onChange = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_CHANGE);
};
oFF.SphereClient.prototype.onLiveChange = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_LIVE_CHANGE);
};
oFF.SphereClient.prototype.onClick = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_CLICK);
};
oFF.SphereClient.prototype.onDoubleClick = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_DOUBLE_CLICK);
};
oFF.SphereClient.prototype.onOpen = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_OPEN);
};
oFF.SphereClient.prototype.onClose = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_CLOSE);
};
oFF.SphereClient.prototype.onBeforeOpen = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_BEFORE_OPEN);
};
oFF.SphereClient.prototype.onBeforeClose = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_BEFORE_CLOSE);
};
oFF.SphereClient.prototype.onAfterOpen = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_AFTER_OPEN);
};
oFF.SphereClient.prototype.onAfterClose = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_AFTER_CLOSE);
};
oFF.SphereClient.prototype.onCollapse = function(event)
{
	this.sendItemEvent(event, oFF.UiEvent.ON_COLLAPSE);
};
oFF.SphereClient.prototype.onExpand = function(event)
{
	this.sendItemEvent(event, oFF.UiEvent.ON_EXPAND);
};
oFF.SphereClient.prototype.onEnter = function(event)
{
	if (this.m_clientStarted)
	{
		this.sendControlEvent(event, oFF.UiEvent.ON_ENTER);
	}
	else
	{
		this.manualStart();
	}
};
oFF.SphereClient.prototype.onPress = function(event)
{
	if (this.isLocalClientEvent(event))
	{
		oFF.DfUiProgram.prototype.onPress.call( this , event);
		if (event.getControl() === this.m_startBtn)
		{
			this.m_startBtn.setEnabled(false);
			this.manualStart();
		}
	}
	else
	{
		this.sendControlEvent(event, oFF.UiEvent.ON_PRESS);
	}
};
oFF.SphereClient.prototype.onEditingBegin = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_EDITING_BEGIN);
};
oFF.SphereClient.prototype.onEditingEnd = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_EDITING_END);
};
oFF.SphereClient.prototype.onBack = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_BACK);
};
oFF.SphereClient.prototype.onRefresh = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_REFRESH);
};
oFF.SphereClient.prototype.onLoadFinished = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_LOAD_FINISHED);
};
oFF.SphereClient.prototype.onDelete = function(event)
{
	this.sendItemEvent(event, oFF.UiEvent.ON_DELETE);
};
oFF.SphereClient.prototype.onDetailPress = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_DETAIL_PRESS);
};
oFF.SphereClient.prototype.onMove = function(event)
{
	this.sendMoveEvent(event, oFF.UiEvent.ON_MOVE);
};
oFF.SphereClient.prototype.onMoveStart = function(event)
{
	this.sendMoveEvent(event, oFF.UiEvent.ON_MOVE_START);
};
oFF.SphereClient.prototype.onMoveEnd = function(event)
{
	this.sendMoveEvent(event, oFF.UiEvent.ON_MOVE_END);
};
oFF.SphereClient.prototype.onResize = function(event)
{
	this.sendResizeEvent(event, oFF.UiEvent.ON_RESIZE);
};
oFF.SphereClient.prototype.onSuggestionSelect = function(event)
{
	this.sendSelectionEvent(event, oFF.UiEvent.ON_SUGGESTION_SELECT);
};
oFF.SphereClient.prototype.onScroll = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_SCROLL);
};
oFF.SphereClient.prototype.onScrollLoad = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_SCROLL_LOAD);
};
oFF.SphereClient.prototype.onHover = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_HOVER);
};
oFF.SphereClient.prototype.onHoverEnd = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_HOVER_END);
};
oFF.SphereClient.prototype.onPaste = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_PASTE);
};
oFF.SphereClient.prototype.onSelectionFinish = function(event)
{
	this.sendSelectionEvent(event, oFF.UiEvent.ON_SELECTION_FINISH);
};
oFF.SphereClient.prototype.onSearch = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_SEARCH);
};
oFF.SphereClient.prototype.onButtonPress = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_BUTTON_PRESS);
};
oFF.SphereClient.prototype.onError = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_ERROR);
};
oFF.SphereClient.prototype.onReadLineFinished = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_READ_LINE_FINISHED);
};
oFF.SphereClient.prototype.onExecute = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_EXECUTE);
};
oFF.SphereClient.prototype.onTerminate = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_TERMINATE);
};
oFF.SphereClient.prototype.onFileDrop = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_FILE_DROP);
};
oFF.SphereClient.prototype.onDrop = function(event)
{
	this.sendDropEvent(event, oFF.UiEvent.ON_DROP);
};
oFF.SphereClient.prototype.onItemClose = function(event)
{
	this.sendItemEvent(event, oFF.UiEvent.ON_ITEM_CLOSE);
};
oFF.SphereClient.prototype.onItemSelect = function(event)
{
	this.sendItemEvent(event, oFF.UiEvent.ON_ITEM_SELECT);
};
oFF.SphereClient.prototype.onTableDragAndDrop = function(event)
{
	this.sendControlEvent(event, oFF.UiEvent.ON_TABLE_DRAG_AND_DROP);
};

oFF.UiServerManager = function() {};
oFF.UiServerManager.prototype = new oFF.DfUiManager();
oFF.UiServerManager.prototype._ff_c = "UiServerManager";

oFF.UiServerManager.VIRTUAL_ROOT_NAME = "virtualRoot";
oFF.UiServerManager.create = function(session, remotePlatform)
{
	var newObj = new oFF.UiServerManager();
	newObj.setupServerUiManager(session, remotePlatform);
	return newObj;
};
oFF.UiServerManager.prototype.m_commandSequence = null;
oFF.UiServerManager.prototype.m_operations = null;
oFF.UiServerManager.prototype.m_idCounter = 0;
oFF.UiServerManager.prototype.m_serverBase = null;
oFF.UiServerManager.prototype.m_clientBase = null;
oFF.UiServerManager.prototype.m_uiTypeCapabilityFlags = null;
oFF.UiServerManager.prototype.m_remotePlatform = null;
oFF.UiServerManager.prototype.setupServerUiManager = function(session, remotePlatform)
{
	oFF.DfUiManager.prototype.setupSessionContext.call( this , session);
	this.m_remotePlatform = remotePlatform;
	this.setNativeAnchor(oFF.UiServerManager.VIRTUAL_ROOT_NAME, "$root$", null);
	this.m_uiTypeCapabilityFlags = oFF.XHashMapByString.create();
	this.m_commandSequence = oFF.PrFactory.createStructure();
	this.m_commandSequence.putString(oFF.UiRemoteProtocol.INSTANCE_ID, "12345");
	this.m_operations = this.m_commandSequence.putNewList(oFF.UiRemoteProtocol.OPERATIONS);
	var allUiTypes = oFF.UiType.getAllUiTypes();
	while (allUiTypes.hasNext())
	{
		var currentType = allUiTypes.next();
		if (currentType.isComposite() === false)
		{
			currentType.setFactory(oFF.UiServerControl.createUiFactory());
		}
	}
};
oFF.UiServerManager.prototype.releaseObject = function()
{
	oFF.DfUiManager.prototype.releaseObject.call( this );
};
oFF.UiServerManager.prototype.getAnchorWrapperId = function(originId)
{
	return originId;
};
oFF.UiServerManager.prototype.serializeUiTree = function()
{
	var anchor = oFF.DfUiManager.prototype.getAnchor.call( this );
	var anchorStructure = oFF.UiUtils.exportToStructure(anchor);
	return anchorStructure;
};
oFF.UiServerManager.prototype.exportHtml = function(template)
{
	var root = oFF.DfUiManager.prototype.getAnchor.call( this );
	var htmldoc = oFF.UiUtils.exportToHtml(root, template);
	return htmldoc;
};
oFF.UiServerManager.prototype.getAnchor = function()
{
	var root = this.getAnchorByName(oFF.UiServerManager.VIRTUAL_ROOT_NAME);
	this.addOperation(null, oFF.UiRemoteProtocol.OP_GET_ROOT, root);
	return root;
};
oFF.UiServerManager.prototype.addOperation1String = function(object, name, param0)
{
	var operation = this.addOperation(object, name, null);
	operation.addString(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Int = function(object, name, param0)
{
	var operation = this.addOperation(object, name, null);
	operation.addInteger(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Double = function(object, name, param0)
{
	var operation = this.addOperation(object, name, null);
	operation.addDouble(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Boolean = function(object, name, param0)
{
	var operation = this.addOperation(object, name, null);
	operation.addBoolean(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Element = function(object, name, param0)
{
	var operation = this.addOperation(object, name, null);
	operation.add(param0);
	return operation;
};
oFF.UiServerManager.prototype.addOperation1Context = function(object, name, param0)
{
	var operation = this.addOperation(object, name, null);
	if (oFF.notNull(param0))
	{
		operation.addString(param0.getId());
	}
	else
	{
		operation.addString(null);
	}
	return operation;
};
oFF.UiServerManager.prototype.addOperation = function(context, methodName, returnContext)
{
	var operation = null;
	if (this.m_callLevel === 0)
	{
		operation = this.m_operations.addNewList();
	}
	else
	{
		operation = oFF.PrFactory.createList();
	}
	operation.addString(methodName);
	if (oFF.notNull(context))
	{
		operation.addString(context.getId());
	}
	else
	{
		operation.addString(null);
	}
	if (oFF.notNull(returnContext))
	{
		operation.addString(returnContext.getId());
	}
	else
	{
		operation.addString(null);
	}
	return operation;
};
oFF.UiServerManager.prototype.fetchCommandSequence = function()
{
	var retObj = this.m_commandSequence;
	this.createNewSequence();
	return retObj;
};
oFF.UiServerManager.prototype.createNewSequence = function()
{
	this.m_commandSequence = oFF.PrFactory.createStructure();
	this.m_commandSequence.putString(oFF.UiRemoteProtocol.INSTANCE_ID, "12345");
	this.m_operations = this.m_commandSequence.putNewList(oFF.UiRemoteProtocol.OPERATIONS);
};
oFF.UiServerManager.prototype.getNextId = function()
{
	var retId = oFF.XInteger.convertToString(this.m_idCounter);
	this.m_idCounter++;
	return retId;
};
oFF.UiServerManager.prototype.setResourceLocations = function(serverBase, clientBase)
{
	this.m_serverBase = serverBase;
	this.m_clientBase = clientBase;
	var env = this.getSession().getEnvironment();
	var targetUri = oFF.XUri.createChild(clientBase, "production/resources/");
	var targetUrl = targetUri.getUrlStringExt(true, true, true, false, true, true, false, false);
	env.setVariable(oFF.XEnvironmentConstants.FIREFLY_MIMES, targetUrl);
};
oFF.UiServerManager.prototype.adaptResourceUri = function(uri)
{
	if (oFF.isNull(uri))
	{
		return null;
	}
	if (oFF.notNull(this.m_serverBase) && oFF.notNull(this.m_clientBase))
	{
		if (this.m_serverBase.getProtocolType() === uri.getProtocolType())
		{
			var serverBasePath = this.m_serverBase.getPath();
			var path = uri.getPath();
			if (oFF.XString.startsWith(path, serverBasePath))
			{
				var size = oFF.XString.size(serverBasePath);
				var relative = oFF.XString.substring(path, size + 1, -1);
				var clientUri = oFF.XUri.createFromUrlWithParent(relative, this.m_clientBase, false);
				return clientUri.getUrl();
			}
		}
	}
	return uri.getUrl();
};
oFF.UiServerManager.prototype.doMasterPostprocessing = function(uiElement)
{
	if (oFF.notNull(uiElement))
	{
		var uiType = uiElement.getUiType();
		if (uiType !== oFF.UiType.ROOT)
		{
			var prOperation = this.addOperation(null, oFF.UiRemoteProtocol.OP_NEW_UI_CONTROL, uiElement);
			var theId = uiElement.getId();
			var name = uiElement.getName();
			prOperation.addString(theId);
			prOperation.addString(name);
			prOperation.addString(uiType.getName());
			var uiStyleClass = uiElement.getUiStyleClass();
			if (oFF.notNull(uiStyleClass))
			{
				prOperation.addString(uiStyleClass.getName());
			}
			else
			{
				prOperation.addString(null);
			}
			if (uiElement.isCompositeControl())
			{
				this.addOperation1Context(uiElement, oFF.UiRemoteProtocol.OP_SET_BASE_CONTROL, uiElement.getBaseControl());
			}
		}
	}
};
oFF.UiServerManager.prototype.setUiTypeCapabilityFlag = function(uiType, flag)
{
	var set = this.m_uiTypeCapabilityFlags.getByKey(uiType);
	if (oFF.isNull(set))
	{
		set = oFF.XHashSetOfString.create();
		this.m_uiTypeCapabilityFlags.put(uiType, set);
	}
	set.add(flag);
};
oFF.UiServerManager.prototype.hasUiTypeCapabilityFlag = function(uiType, flag)
{
	var set = this.m_uiTypeCapabilityFlags.getByKey(uiType);
	if (oFF.isNull(set))
	{
		return false;
	}
	return set.contains(flag);
};
oFF.UiServerManager.prototype.getPlatform = function()
{
	return this.m_remotePlatform;
};
oFF.UiServerManager.prototype.setTheme = function(themeName, themeBaseUrl)
{
	oFF.DfUiManager.prototype.setTheme.call( this , themeName, themeBaseUrl);
	var params = this.addOperation(null, oFF.UiRemoteProtocol.OP_UI_MGR_SET_THEME, null);
	if (oFF.notNull(params))
	{
		params.addString(themeName);
		params.addString(themeBaseUrl);
	}
};

oFF.UiServerControl = function() {};
oFF.UiServerControl.prototype = new oFF.DfUiContext();
oFF.UiServerControl.prototype._ff_c = "UiServerControl";

oFF.UiServerControl.createUiFactory = function()
{
	return new oFF.UiServerControl();
};
oFF.UiServerControl.prototype.newInstance = function()
{
	var object = new oFF.UiServerControl();
	object.setup();
	return object;
};
oFF.UiServerControl.prototype.setup = function()
{
	oFF.DfUiContext.prototype.setup.call( this );
};
oFF.UiServerControl.prototype.releaseObject = function()
{
	this._addUIOperation(oFF.UiRemoteProtocol.OP_RELEASE_CONTROL);
	oFF.DfUiContext.prototype.releaseObject.call( this );
};
oFF.UiServerControl.prototype.getMasterNoCall = function()
{
	var master = null;
	if (oFF.notNull(this.m_uiManager))
	{
		master = this.m_uiManager.getMaster();
		if (oFF.notNull(master) && master.isExternalCall0() === false)
		{
			master = null;
		}
	}
	return master;
};
oFF.UiServerControl.prototype.setElementForTarget = function(element, methodName)
{
	var retContext = this;
	this._addUIOperationWithControlContext(methodName, element);
	return retContext;
};
oFF.UiServerControl.prototype.setContent = function(content)
{
	oFF.DfUiContext.prototype.setContent.call( this , content);
	return this.setElementForTarget(content, oFF.UiProperty.CONTENT.getSetterMethodName());
};
oFF.UiServerControl.prototype.clearContent = function()
{
	oFF.DfUiContext.prototype.clearContent.call( this );
	this._addUIOperation(oFF.UiProperty.CONTENT.getClearMethodName());
};
oFF.UiServerControl.prototype.setFooter = function(footer)
{
	oFF.DfUiContext.prototype.setFooter.call( this , footer);
	this._addUIOperationWithControlContext(oFF.UiProperty.FOOTER.getSetterMethodName(), footer);
	return this;
};
oFF.UiServerControl.prototype.clearFooter = function()
{
	oFF.DfUiContext.prototype.clearFooter.call( this );
	this._addUIOperation(oFF.UiProperty.FOOTER.getClearMethodName());
	return this;
};
oFF.UiServerControl.prototype.setSubHeader = function(subHeader)
{
	oFF.DfUiContext.prototype.setSubHeader.call( this , subHeader);
	this._addUIOperationWithControlContext(oFF.UiProperty.SUB_HEADER.getSetterMethodName(), subHeader);
	return this;
};
oFF.UiServerControl.prototype.clearSubHeader = function()
{
	oFF.DfUiContext.prototype.clearSubHeader.call( this );
	this._addUIOperation(oFF.UiProperty.SUB_HEADER.getClearMethodName());
	return this;
};
oFF.UiServerControl.prototype.setHeader = function(header)
{
	oFF.DfUiContext.prototype.setHeader.call( this , header);
	this._addUIOperationWithControlContext(oFF.UiProperty.HEADER.getSetterMethodName(), header);
	return this;
};
oFF.UiServerControl.prototype.clearHeader = function()
{
	oFF.DfUiContext.prototype.clearHeader.call( this );
	this._addUIOperation(oFF.UiProperty.HEADER.getClearMethodName());
	return this;
};
oFF.UiServerControl.prototype.setText = function(text)
{
	oFF.DfUiContext.prototype.setText.call( this , text);
	return this.addOperation1String(this, oFF.UiProperty.TEXT.getSetterMethodName(), text);
};
oFF.UiServerControl.prototype.setSrc = function(src)
{
	oFF.DfUiContext.prototype.setSrc.call( this , src);
	return this.addOperation1String(this, oFF.UiProperty.SRC.getSetterMethodName(), src);
};
oFF.UiServerControl.prototype.setTitle = function(title)
{
	oFF.DfUiContext.prototype.setTitle.call( this , title);
	return this.addOperation1String(this, oFF.UiProperty.TITLE.getSetterMethodName(), title);
};
oFF.UiServerControl.prototype.setSubtitle = function(subtitle)
{
	oFF.DfUiContext.prototype.setSubtitle.call( this , subtitle);
	return this.addOperation1String(this, oFF.UiProperty.SUBTITLE.getSetterMethodName(), subtitle);
};
oFF.UiServerControl.prototype.setTextDecoration = function(textDecoration)
{
	oFF.DfUiContext.prototype.setTextDecoration.call( this , textDecoration);
	this._addCssBasedObjectOperation(oFF.UiProperty.TEXT_DECORATION, textDecoration);
	return this;
};
oFF.UiServerControl.prototype.setSelected = function(selected)
{
	oFF.DfUiContext.prototype.setSelected.call( this , selected);
	this.addOperation1Boolean(this, oFF.UiProperty.SELECTED.getSetterMethodName(), selected);
	return this;
};
oFF.UiServerControl.prototype.setColumnSpan = function(span)
{
	oFF.DfUiContext.prototype.setColumnSpan.call( this , span);
	return this.addOperation1Int(this, oFF.UiProperty.COLUMN_SPAN.getSetterMethodName(), span);
};
oFF.UiServerControl.prototype.setRowSpan = function(span)
{
	oFF.DfUiContext.prototype.setRowSpan.call( this , span);
	return this.addOperation1Int(this, oFF.UiProperty.ROW_SPAN.getSetterMethodName(), span);
};
oFF.UiServerControl.prototype.setExpanded = function(isExpanded)
{
	oFF.DfUiContext.prototype.setExpanded.call( this , isExpanded);
	return this.addOperation1Boolean(this, oFF.UiProperty.EXPANDED.getSetterMethodName(), isExpanded);
};
oFF.UiServerControl.prototype.setChecked = function(checked)
{
	oFF.DfUiContext.prototype.setChecked.call( this , checked);
	return this.addOperation1Boolean(this, oFF.UiProperty.CHECKED.getSetterMethodName(), checked);
};
oFF.UiServerControl.prototype.setNode = function(isNode)
{
	oFF.DfUiContext.prototype.setNode.call( this , isNode);
	return this.addOperation1Boolean(this, oFF.UiProperty.NODE.getSetterMethodName(), isNode);
};
oFF.UiServerControl.prototype.setRowCount = function(rowCount)
{
	oFF.DfUiContext.prototype.setRowCount.call( this , rowCount);
	return this.addOperation1Int(this, oFF.UiProperty.ROW_COUNT.getSetterMethodName(), rowCount);
};
oFF.UiServerControl.prototype.setColumnCount = function(columnCount)
{
	oFF.DfUiContext.prototype.setColumnCount.call( this , columnCount);
	return this.addOperation1Int(this, oFF.UiProperty.COLUMN_COUNT.getSetterMethodName(), columnCount);
};
oFF.UiServerControl.prototype.setSplitterPosition = function(splitterPosition)
{
	oFF.DfUiContext.prototype.setSplitterPosition.call( this , splitterPosition);
	return this.addOperation1Int(this, oFF.UiProperty.SPLITTER_POSITION.getSetterMethodName(), splitterPosition);
};
oFF.UiServerControl.prototype.setEnabled = function(enabled)
{
	oFF.DfUiContext.prototype.setEnabled.call( this , enabled);
	return this.addOperation1Boolean(this, oFF.UiProperty.ENABLED.getSetterMethodName(), enabled);
};
oFF.UiServerControl.prototype.setEditable = function(editable)
{
	oFF.DfUiContext.prototype.setEditable.call( this , editable);
	return this.addOperation1Boolean(this, oFF.UiProperty.EDITABLE.getSetterMethodName(), editable);
};
oFF.UiServerControl.prototype.setVisible = function(visible)
{
	oFF.DfUiContext.prototype.setVisible.call( this , visible);
	return this.addOperation1Boolean(this, oFF.UiProperty.VISIBLE.getSetterMethodName(), visible);
};
oFF.UiServerControl.prototype.setCloseable = function(isCloseable)
{
	oFF.DfUiContext.prototype.setCloseable.call( this , isCloseable);
	return this.addOperation1Boolean(this, oFF.UiProperty.CLOSEABLE.getSetterMethodName(), isCloseable);
};
oFF.UiServerControl.prototype.setSectionStart = function(sectionStart)
{
	oFF.DfUiContext.prototype.setSectionStart.call( this , sectionStart);
	return this.addOperation1Boolean(this, oFF.UiProperty.SECTION_START.getSetterMethodName(), sectionStart);
};
oFF.UiServerControl.prototype.setModelJson = function(model)
{
	oFF.DfUiContext.prototype.setModelJson.call( this , model);
	this.addOperation1Element(this, oFF.UiProperty.MODEL_JSON.getSetterMethodName(), model);
	return this;
};
oFF.UiServerControl.prototype.setDataManifest = function(dataManifest)
{
	oFF.DfUiContext.prototype.setDataManifest.call( this , dataManifest);
	this.addOperation1Element(this, oFF.UiProperty.DATA_MANIFEST.getSetterMethodName(), dataManifest);
};
oFF.UiServerControl.prototype.setPadding = function(padding)
{
	oFF.DfUiContext.prototype.setPadding.call( this , padding);
	this._addCssBasedObjectOperation(oFF.UiProperty.PADDING, padding);
	return this;
};
oFF.UiServerControl.prototype.setMargin = function(margin)
{
	oFF.DfUiContext.prototype.setMargin.call( this , margin);
	this._addCssBasedObjectOperation(oFF.UiProperty.MARGIN, margin);
	return this;
};
oFF.UiServerControl.prototype.setFontSize = function(fontSize)
{
	oFF.DfUiContext.prototype.setFontSize.call( this , fontSize);
	this._addCssBasedObjectOperation(oFF.UiProperty.FONT_SIZE, fontSize);
	return this;
};
oFF.UiServerControl.prototype.setIconSize = function(iconSize)
{
	oFF.DfUiContext.prototype.setIconSize.call( this , iconSize);
	this._addCssBasedObjectOperation(oFF.UiProperty.ICON_SIZE, iconSize);
	return this;
};
oFF.UiServerControl.prototype.setCornerRadius = function(cornerRadius)
{
	oFF.DfUiContext.prototype.setCornerRadius.call( this , cornerRadius);
	this._addCssBasedObjectOperation(oFF.UiProperty.CORNER_RADIUS, cornerRadius);
	return this;
};
oFF.UiServerControl.prototype.setBorderWidth = function(borderWidth)
{
	oFF.DfUiContext.prototype.setBorderWidth.call( this , borderWidth);
	this._addCssBasedObjectOperation(oFF.UiProperty.BORDER_WIDTH, borderWidth);
	return this;
};
oFF.UiServerControl.prototype.setHeaderHeight = function(headerHeight)
{
	oFF.DfUiContext.prototype.setHeaderHeight.call( this , headerHeight);
	this._addCssBasedObjectOperation(oFF.UiProperty.HEADER_HEIGHT, headerHeight);
	return this;
};
oFF.UiServerControl.prototype.setFooterHeight = function(footerHeight)
{
	oFF.DfUiContext.prototype.setFooterHeight.call( this , footerHeight);
	this._addCssBasedObjectOperation(oFF.UiProperty.FOOTER_HEIGHT, footerHeight);
	return this;
};
oFF.UiServerControl.prototype.setSliderMinimum = function(minimum)
{
	oFF.DfUiContext.prototype.setSliderMinimum.call( this , minimum);
	return this.addOperation1Int(this, oFF.UiProperty.SLIDER_MINIMUM.getSetterMethodName(), minimum);
};
oFF.UiServerControl.prototype.setSliderMaximum = function(maximum)
{
	oFF.DfUiContext.prototype.setSliderMaximum.call( this , maximum);
	return this.addOperation1Int(this, oFF.UiProperty.SLIDER_MAXIMUM.getSetterMethodName(), maximum);
};
oFF.UiServerControl.prototype.setSliderStep = function(step)
{
	oFF.DfUiContext.prototype.setSliderStep.call( this , step);
	return this.addOperation1Int(this, oFF.UiProperty.SLIDER_STEP.getSetterMethodName(), step);
};
oFF.UiServerControl.prototype.setSliderValue = function(value)
{
	oFF.DfUiContext.prototype.setSliderValue.call( this , value);
	return this.addOperation1Int(this, oFF.UiProperty.SLIDER_VALUE.getSetterMethodName(), value);
};
oFF.UiServerControl.prototype.setSliderUpperValue = function(value)
{
	oFF.DfUiContext.prototype.setSliderUpperValue.call( this , value);
	return this.addOperation1Int(this, oFF.UiProperty.SLIDER_UPPER_VALUE.getSetterMethodName(), value);
};
oFF.UiServerControl.prototype.setPlaceholder = function(placeholder)
{
	oFF.DfUiContext.prototype.setPlaceholder.call( this , placeholder);
	return this.addOperation1String(this, oFF.UiProperty.PLACEHOLDER.getSetterMethodName(), placeholder);
};
oFF.UiServerControl.prototype.setName = function(name)
{
	oFF.DfUiContext.prototype.setName.call( this , name);
	return this.addOperation1String(this, oFF.UiProperty.NAME.getSetterMethodName(), name);
};
oFF.UiServerControl.prototype.setInputType = function(inputType)
{
	oFF.DfUiContext.prototype.setInputType.call( this , inputType);
	return this.addOperation1Constant(this, oFF.UiProperty.INPUT_TYPE.getSetterMethodName(), inputType);
};
oFF.UiServerControl.prototype.setValue = function(value)
{
	oFF.DfUiContext.prototype.setValue.call( this , value);
	return this.addOperation1String(this, oFF.UiProperty.VALUE.getSetterMethodName(), value);
};
oFF.UiServerControl.prototype.setDescription = function(description)
{
	oFF.DfUiContext.prototype.setDescription.call( this , description);
	return this.addOperation1String(this, oFF.UiProperty.DESCRIPTION.getSetterMethodName(), description);
};
oFF.UiServerControl.prototype.setTooltip = function(tooltip)
{
	oFF.DfUiContext.prototype.setTooltip.call( this , tooltip);
	return this.addOperation1String(this, oFF.UiProperty.TOOLTIP.getSetterMethodName(), tooltip);
};
oFF.UiServerControl.prototype.setIcon = function(icon)
{
	oFF.DfUiContext.prototype.setIcon.call( this , icon);
	return this.addOperation1String(this, oFF.UiProperty.ICON.getSetterMethodName(), icon);
};
oFF.UiServerControl.prototype.setListItemType = function(listItemType)
{
	oFF.DfUiContext.prototype.setListItemType.call( this , listItemType);
	return this.addOperation1Constant(this, oFF.UiProperty.LIST_ITEM_TYPE.getSetterMethodName(), listItemType);
};
oFF.UiServerControl.prototype.setButtonType = function(buttonType)
{
	oFF.DfUiContext.prototype.setButtonType.call( this , buttonType);
	return this.addOperation1Constant(this, oFF.UiProperty.BUTTON_TYPE.getSetterMethodName(), buttonType);
};
oFF.UiServerControl.prototype.setBackgroundImageSrc = function(src)
{
	oFF.DfUiContext.prototype.setBackgroundImageSrc.call( this , src);
	return this.addOperation1String(this, oFF.UiProperty.BACKGROUND_IMAGE_SRC.getSetterMethodName(), src);
};
oFF.UiServerControl.prototype.setRotation = function(rotation)
{
	oFF.DfUiContext.prototype.setRotation.call( this , rotation);
	return this.addOperation1Int(this, oFF.UiProperty.ROTATION.getSetterMethodName(), rotation);
};
oFF.UiServerControl.prototype.setBorderColor = function(borderColor)
{
	oFF.DfUiContext.prototype.setBorderColor.call( this , borderColor);
	this._addCssBasedObjectOperation(oFF.UiProperty.BORDER_COLOR, borderColor);
	return this;
};
oFF.UiServerControl.prototype.setBackgroundColor = function(backgroundColor)
{
	oFF.DfUiContext.prototype.setBackgroundColor.call( this , backgroundColor);
	this._addCssBasedObjectOperation(oFF.UiProperty.BACKGROUND_COLOR, backgroundColor);
	return this;
};
oFF.UiServerControl.prototype.setFontColor = function(fontColor)
{
	oFF.DfUiContext.prototype.setFontColor.call( this , fontColor);
	this._addCssBasedObjectOperation(oFF.UiProperty.FONT_COLOR, fontColor);
	return this;
};
oFF.UiServerControl.prototype.setSelectionMode = function(selectionMode)
{
	oFF.DfUiContext.prototype.setSelectionMode.call( this , selectionMode);
	return this.addOperation1Constant(this, oFF.UiProperty.SELECTION_MODE.getSetterMethodName(), selectionMode);
};
oFF.UiServerControl.prototype.setSelectionBehavior = function(selectionBehavior)
{
	oFF.DfUiContext.prototype.setSelectionBehavior.call( this , selectionBehavior);
	return this.addOperation1Constant(this, oFF.UiProperty.SELECTION_BEHAVIOR.getSetterMethodName(), selectionBehavior);
};
oFF.UiServerControl.prototype.setRequired = function(required)
{
	oFF.DfUiContext.prototype.setRequired.call( this , required);
	return this.addOperation1Boolean(this, oFF.UiProperty.REQUIRED.getSetterMethodName(), required);
};
oFF.UiServerControl.prototype.setResizable = function(resizable)
{
	oFF.DfUiContext.prototype.setResizable.call( this , resizable);
	return this.addOperation1Boolean(this, oFF.UiProperty.RESIZABLE.getSetterMethodName(), resizable);
};
oFF.UiServerControl.prototype.setBorderStyle = function(borderStyle)
{
	oFF.DfUiContext.prototype.setBorderStyle.call( this , borderStyle);
	return this.addOperation1Constant(this, oFF.UiProperty.BORDER_STYLE.getSetterMethodName(), borderStyle);
};
oFF.UiServerControl.prototype.setState = function(state)
{
	oFF.DfUiContext.prototype.setState.call( this , state);
	return this.addOperation1Constant(this, oFF.UiProperty.STATE.getSetterMethodName(), state);
};
oFF.UiServerControl.prototype.setAnimationDuration = function(animationDuration)
{
	oFF.DfUiContext.prototype.setAnimationDuration.call( this , animationDuration);
	return this.addOperation1Int(this, oFF.UiProperty.ANIMATION_DURATION.getSetterMethodName(), animationDuration);
};
oFF.UiServerControl.prototype.setMaxDate = function(maxDate)
{
	oFF.DfUiContext.prototype.setMaxDate.call( this , maxDate);
	return this.addOperation1String(this, oFF.UiProperty.MAX_DATE.getSetterMethodName(), maxDate);
};
oFF.UiServerControl.prototype.setMinDate = function(minDate)
{
	oFF.DfUiContext.prototype.setMinDate.call( this , minDate);
	return this.addOperation1String(this, oFF.UiProperty.MIN_DATE.getSetterMethodName(), minDate);
};
oFF.UiServerControl.prototype.setDisplayFormat = function(displayFormat)
{
	oFF.DfUiContext.prototype.setDisplayFormat.call( this , displayFormat);
	return this.addOperation1String(this, oFF.UiProperty.DISPLAY_FORMAT.getSetterMethodName(), displayFormat);
};
oFF.UiServerControl.prototype.setValueFormat = function(valueFormat)
{
	oFF.DfUiContext.prototype.setValueFormat.call( this , valueFormat);
	return this.addOperation1String(this, oFF.UiProperty.VALUE_FORMAT.getSetterMethodName(), valueFormat);
};
oFF.UiServerControl.prototype.setMinutesInterval = function(minInterval)
{
	oFF.DfUiContext.prototype.setMinutesInterval.call( this , minInterval);
	return this.addOperation1Int(this, oFF.UiProperty.MINUTES_INTERVAL.getSetterMethodName(), minInterval);
};
oFF.UiServerControl.prototype.setSecondsInterval = function(secInterval)
{
	oFF.DfUiContext.prototype.setSecondsInterval.call( this , secInterval);
	return this.addOperation1Int(this, oFF.UiProperty.SECONDS_INTERVAL.getSetterMethodName(), secInterval);
};
oFF.UiServerControl.prototype.setMaxLength = function(maxLength)
{
	oFF.DfUiContext.prototype.setMaxLength.call( this , maxLength);
	return this.addOperation1Int(this, oFF.UiProperty.MAX_LENGTH.getSetterMethodName(), maxLength);
};
oFF.UiServerControl.prototype.setTextAlign = function(textAlign)
{
	oFF.DfUiContext.prototype.setTextAlign.call( this , textAlign);
	return this.addOperation1Constant(this, oFF.UiProperty.TEXT_ALIGN.getSetterMethodName(), textAlign);
};
oFF.UiServerControl.prototype.setFontStyle = function(fontStyle)
{
	oFF.DfUiContext.prototype.setFontStyle.call( this , fontStyle);
	return this.addOperation1Constant(this, oFF.UiProperty.FONT_STYLE.getSetterMethodName(), fontStyle);
};
oFF.UiServerControl.prototype.setFontWeight = function(fontWeight)
{
	oFF.DfUiContext.prototype.setFontWeight.call( this , fontWeight);
	return this.addOperation1Constant(this, oFF.UiProperty.FONT_WEIGHT.getSetterMethodName(), fontWeight);
};
oFF.UiServerControl.prototype.setPath = function(path)
{
	oFF.DfUiContext.prototype.setPath.call( this , path);
	return this.addOperation1String(this, oFF.UiProperty.PATH.getSetterMethodName(), path);
};
oFF.UiServerControl.prototype.setBusy = function(busy)
{
	oFF.DfUiContext.prototype.setBusy.call( this , busy);
	return this.addOperation1Boolean(this, oFF.UiProperty.BUSY.getSetterMethodName(), busy);
};
oFF.UiServerControl.prototype.setCounter = function(counter)
{
	oFF.DfUiContext.prototype.setCounter.call( this , counter);
	return this.addOperation1Int(this, oFF.UiProperty.COUNTER.getSetterMethodName(), counter);
};
oFF.UiServerControl.prototype.setHighlight = function(messageType)
{
	oFF.DfUiContext.prototype.setHighlight.call( this , messageType);
	return this.addOperation1Constant(this, oFF.UiProperty.HIGHLIGHT.getSetterMethodName(), messageType);
};
oFF.UiServerControl.prototype.setMessageType = function(messageType)
{
	oFF.DfUiContext.prototype.setMessageType.call( this , messageType);
	return this.addOperation1Constant(this, oFF.UiProperty.MESSAGE_TYPE.getSetterMethodName(), messageType);
};
oFF.UiServerControl.prototype.setCommandHistory = function(commands)
{
	oFF.DfUiContext.prototype.setCommandHistory.call( this , commands);
	return this.addOperation1ListOfString(this, oFF.UiProperty.COMMAND_HISTORY.getSetterMethodName(), commands);
};
oFF.UiServerControl.prototype.setVisibleRowCount = function(visibleRowCount)
{
	oFF.DfUiContext.prototype.setVisibleRowCount.call( this , visibleRowCount);
	return this.addOperation1Int(this, oFF.UiProperty.VISIBLE_ROW_COUNT.getSetterMethodName(), visibleRowCount);
};
oFF.UiServerControl.prototype.setVisibleRowCountMode = function(visibleRowCountMode)
{
	oFF.DfUiContext.prototype.setVisibleRowCountMode.call( this , visibleRowCountMode);
	return this.addOperation1Constant(this, oFF.UiProperty.VISIBLE_ROW_COUNT_MODE.getSetterMethodName(), visibleRowCountMode);
};
oFF.UiServerControl.prototype.setMinRowCount = function(minRowCount)
{
	oFF.DfUiContext.prototype.setMinRowCount.call( this , minRowCount);
	return this.addOperation1Int(this, oFF.UiProperty.MIN_ROW_COUNT.getSetterMethodName(), minRowCount);
};
oFF.UiServerControl.prototype.setFirstVisibleRow = function(firstVisibleRow)
{
	oFF.DfUiContext.prototype.setFirstVisibleRow.call( this , firstVisibleRow);
	this._addUIOperationWithControlContext(oFF.UiProperty.FIRST_VISIBLE_ROW.getSetterMethodName(), firstVisibleRow);
	return this;
};
oFF.UiServerControl.prototype.setDebounceTime = function(debounceTime)
{
	oFF.DfUiContext.prototype.setDebounceTime.call( this , debounceTime);
	return this.addOperation1Int(this, oFF.UiProperty.DEBOUNCE_TIME.getSetterMethodName(), debounceTime);
};
oFF.UiServerControl.prototype.setDirection = function(direction)
{
	oFF.DfUiContext.prototype.setDirection.call( this , direction);
	return this.addOperation1Constant(this, oFF.UiProperty.DIRECTION.getSetterMethodName(), direction);
};
oFF.UiServerControl.prototype.setAlignItems = function(alignItems)
{
	oFF.DfUiContext.prototype.setAlignItems.call( this , alignItems);
	return this.addOperation1Constant(this, oFF.UiProperty.ALIGN_ITEMS.getSetterMethodName(), alignItems);
};
oFF.UiServerControl.prototype.setAlignContent = function(alignContent)
{
	oFF.DfUiContext.prototype.setAlignContent.call( this , alignContent);
	return this.addOperation1Constant(this, oFF.UiProperty.ALIGN_CONTENT.getSetterMethodName(), alignContent);
};
oFF.UiServerControl.prototype.setJustifyContent = function(justifyContent)
{
	oFF.DfUiContext.prototype.setJustifyContent.call( this , justifyContent);
	return this.addOperation1Constant(this, oFF.UiProperty.JUSTIFY_CONTENT.getSetterMethodName(), justifyContent);
};
oFF.UiServerControl.prototype.setWrap = function(wrap)
{
	oFF.DfUiContext.prototype.setWrap.call( this , wrap);
	return this.addOperation1Constant(this, oFF.UiProperty.WRAP.getSetterMethodName(), wrap);
};
oFF.UiServerControl.prototype.setFlex = function(flex)
{
	oFF.DfUiContext.prototype.setFlex.call( this , flex);
	return this.addOperation1String(this, oFF.UiProperty.FLEX.getSetterMethodName(), flex);
};
oFF.UiServerControl.prototype.setAlignSelf = function(alignSelf)
{
	oFF.DfUiContext.prototype.setAlignSelf.call( this , alignSelf);
	return this.addOperation1Constant(this, oFF.UiProperty.ALIGN_SELF.getSetterMethodName(), alignSelf);
};
oFF.UiServerControl.prototype.setOrder = function(order)
{
	oFF.DfUiContext.prototype.setOrder.call( this , order);
	return this.addOperation1Int(this, oFF.UiProperty.ORDER.getSetterMethodName(), order);
};
oFF.UiServerControl.prototype.setEnableSelectAll = function(enableSelectAll)
{
	oFF.DfUiContext.prototype.setEnableSelectAll.call( this , enableSelectAll);
	return this.addOperation1Boolean(this, oFF.UiProperty.ENABLE_SELECT_ALL.getSetterMethodName(), enableSelectAll);
};
oFF.UiServerControl.prototype.setWrapping = function(wrapping)
{
	oFF.DfUiContext.prototype.setWrapping.call( this , wrapping);
	return this.addOperation1Boolean(this, oFF.UiProperty.WRAPPING.getSetterMethodName(), wrapping);
};
oFF.UiServerControl.prototype.setValueState = function(valueState)
{
	oFF.DfUiContext.prototype.setValueState.call( this , valueState);
	return this.addOperation1Constant(this, oFF.UiProperty.VALUE_STATE.getSetterMethodName(), valueState);
};
oFF.UiServerControl.prototype.setValueStateText = function(valueStateText)
{
	oFF.DfUiContext.prototype.setValueStateText.call( this , valueStateText);
	return this.addOperation1String(this, oFF.UiProperty.VALUE_STATE_TEXT.getSetterMethodName(), valueStateText);
};
oFF.UiServerControl.prototype.setPlacement = function(placementType)
{
	oFF.DfUiContext.prototype.setPlacement.call( this , placementType);
	return this.addOperation1Constant(this, oFF.UiProperty.PLACEMENT.getSetterMethodName(), placementType);
};
oFF.UiServerControl.prototype.setShowNavButton = function(showNavButton)
{
	oFF.DfUiContext.prototype.setShowNavButton.call( this , showNavButton);
	return this.addOperation1Boolean(this, oFF.UiProperty.SHOW_NAV_BUTTON.getSetterMethodName(), showNavButton);
};
oFF.UiServerControl.prototype.setShowHeader = function(showHeader)
{
	oFF.DfUiContext.prototype.setShowHeader.call( this , showHeader);
	return this.addOperation1Boolean(this, oFF.UiProperty.SHOW_HEADER.getSetterMethodName(), showHeader);
};
oFF.UiServerControl.prototype.setOn = function(isOn)
{
	oFF.DfUiContext.prototype.setOn.call( this , isOn);
	return this.addOperation1Boolean(this, oFF.UiProperty.ON.getSetterMethodName(), isOn);
};
oFF.UiServerControl.prototype.setTag = function(tag)
{
	oFF.DfUiContext.prototype.setTag.call( this , tag);
	return this.addOperation1String(this, oFF.UiProperty.TAG.getSetterMethodName(), tag);
};
oFF.UiServerControl.prototype.setOnText = function(onText)
{
	oFF.DfUiContext.prototype.setOnText.call( this , onText);
	return this.addOperation1String(this, oFF.UiProperty.ON_TEXT.getSetterMethodName(), onText);
};
oFF.UiServerControl.prototype.setOffText = function(offText)
{
	oFF.DfUiContext.prototype.setOffText.call( this , offText);
	return this.addOperation1String(this, oFF.UiProperty.OFF_TEXT.getSetterMethodName(), offText);
};
oFF.UiServerControl.prototype.setCodeType = function(codeType)
{
	oFF.DfUiContext.prototype.setCodeType.call( this , codeType);
	return this.addOperation1String(this, oFF.UiProperty.CODE_TYPE.getSetterMethodName(), codeType);
};
oFF.UiServerControl.prototype.setCustomParameters = function(customParameters)
{
	oFF.DfUiContext.prototype.setCustomParameters.call( this , customParameters);
	this.addOperation1Element(this, oFF.UiProperty.CUSTOM_PARAMETERS.getSetterMethodName(), customParameters);
	return this;
};
oFF.UiServerControl.prototype.setExpandable = function(expandable)
{
	oFF.DfUiContext.prototype.setExpandable.call( this , expandable);
	return this.addOperation1Boolean(this, oFF.UiProperty.EXPANDABLE.getSetterMethodName(), expandable);
};
oFF.UiServerControl.prototype.setIntervalSelection = function(intervalSelection)
{
	oFF.DfUiContext.prototype.setIntervalSelection.call( this , intervalSelection);
	return this.addOperation1Boolean(this, oFF.UiProperty.INTERVAL_SELECTION.getSetterMethodName(), intervalSelection);
};
oFF.UiServerControl.prototype.setStartDate = function(startDate)
{
	oFF.DfUiContext.prototype.setStartDate.call( this , startDate);
	return this.addOperation1String(this, oFF.UiProperty.START_DATE.getSetterMethodName(), startDate);
};
oFF.UiServerControl.prototype.setEndDate = function(endDate)
{
	oFF.DfUiContext.prototype.setEndDate.call( this , endDate);
	return this.addOperation1String(this, oFF.UiProperty.END_DATE.getSetterMethodName(), endDate);
};
oFF.UiServerControl.prototype.setPressed = function(pressed)
{
	oFF.DfUiContext.prototype.setPressed.call( this , pressed);
	return this.addOperation1Boolean(this, oFF.UiProperty.PRESSED.getSetterMethodName(), pressed);
};
oFF.UiServerControl.prototype.setWidth = function(width)
{
	oFF.DfUiContext.prototype.setWidth.call( this , width);
	this._addCssBasedObjectOperation(oFF.UiProperty.WIDTH, width);
	return this;
};
oFF.UiServerControl.prototype.setHeight = function(height)
{
	oFF.DfUiContext.prototype.setHeight.call( this , height);
	this._addCssBasedObjectOperation(oFF.UiProperty.HEIGHT, height);
	return this;
};
oFF.UiServerControl.prototype.setX = function(x)
{
	oFF.DfUiContext.prototype.setX.call( this , x);
	this._addCssBasedObjectOperation(oFF.UiProperty.X_POS, x);
	return this;
};
oFF.UiServerControl.prototype.setY = function(y)
{
	oFF.DfUiContext.prototype.setY.call( this , y);
	this._addCssBasedObjectOperation(oFF.UiProperty.Y_POS, y);
	return this;
};
oFF.UiServerControl.prototype.setMinWidth = function(minWidth)
{
	oFF.DfUiContext.prototype.setMinWidth.call( this , minWidth);
	this._addCssBasedObjectOperation(oFF.UiProperty.MIN_WIDTH, minWidth);
	return this;
};
oFF.UiServerControl.prototype.setMaxWidth = function(maxWidth)
{
	oFF.DfUiContext.prototype.setMaxWidth.call( this , maxWidth);
	this._addCssBasedObjectOperation(oFF.UiProperty.MAX_WIDTH, maxWidth);
	return this;
};
oFF.UiServerControl.prototype.setMinHeight = function(minHeight)
{
	oFF.DfUiContext.prototype.setMinHeight.call( this , minHeight);
	this._addCssBasedObjectOperation(oFF.UiProperty.MIN_HEIGHT, minHeight);
	return this;
};
oFF.UiServerControl.prototype.setMaxHeight = function(maxHeight)
{
	oFF.DfUiContext.prototype.setMaxHeight.call( this , maxHeight);
	this._addCssBasedObjectOperation(oFF.UiProperty.MAX_HEIGHT, maxHeight);
	return this;
};
oFF.UiServerControl.prototype.setOpacity = function(opacity)
{
	oFF.DfUiContext.prototype.setOpacity.call( this , opacity);
	return this.addOperation1Double(this, oFF.UiProperty.OPACITY.getSetterMethodName(), opacity);
};
oFF.UiServerControl.prototype.setPrompt = function(prompt)
{
	oFF.DfUiContext.prototype.setPrompt.call( this , prompt);
	return this.addOperation1String(this, oFF.UiProperty.PROMPT.getSetterMethodName(), prompt);
};
oFF.UiServerControl.prototype.setShowSorting = function(showSorting)
{
	oFF.DfUiContext.prototype.setShowSorting.call( this , showSorting);
	return this.addOperation1Boolean(this, oFF.UiProperty.SHOW_SORTING.getSetterMethodName(), showSorting);
};
oFF.UiServerControl.prototype.setShowValue = function(showValue)
{
	oFF.DfUiContext.prototype.setShowValue.call( this , showValue);
	return this.addOperation1Boolean(this, oFF.UiProperty.SHOW_VALUE.getSetterMethodName(), showValue);
};
oFF.UiServerControl.prototype.setAnimated = function(animated)
{
	oFF.DfUiContext.prototype.setAnimated.call( this , animated);
	return this.addOperation1Boolean(this, oFF.UiProperty.ANIMATED.getSetterMethodName(), animated);
};
oFF.UiServerControl.prototype.setPercentValue = function(value)
{
	oFF.DfUiContext.prototype.setPercentValue.call( this , value);
	return this.addOperation1Double(this, oFF.UiProperty.PERCENT_VALUE.getSetterMethodName(), value);
};
oFF.UiServerControl.prototype.setColor = function(color)
{
	oFF.DfUiContext.prototype.setColor.call( this , color);
	this._addCssBasedObjectOperation(oFF.UiProperty.COLOR, color);
	return this;
};
oFF.UiServerControl.prototype.setOverflow = function(overflow)
{
	oFF.DfUiContext.prototype.setOverflow.call( this , overflow);
	return this.addOperation1Constant(this, oFF.UiProperty.OVERFLOW.getSetterMethodName(), overflow);
};
oFF.UiServerControl.prototype.setLoadState = function(loadState)
{
	oFF.DfUiContext.prototype.setLoadState.call( this , loadState);
	return this.addOperation1Constant(this, oFF.UiProperty.LOAD_STATE.getSetterMethodName(), loadState);
};
oFF.UiServerControl.prototype.setFrameType = function(frameType)
{
	oFF.DfUiContext.prototype.setFrameType.call( this , frameType);
	return this.addOperation1Constant(this, oFF.UiProperty.FRAME_TYPE.getSetterMethodName(), frameType);
};
oFF.UiServerControl.prototype.setTileMode = function(tileMode)
{
	oFF.DfUiContext.prototype.setTileMode.call( this , tileMode);
	return this.addOperation1Constant(this, oFF.UiProperty.TILE_MODE.getSetterMethodName(), tileMode);
};
oFF.UiServerControl.prototype.setDraggable = function(draggable)
{
	oFF.DfUiContext.prototype.setDraggable.call( this , draggable);
	return this.addOperation1Boolean(this, oFF.UiProperty.DRAGGABLE.getSetterMethodName(), draggable);
};
oFF.UiServerControl.prototype.setDropInfo = function(dropInfo)
{
	oFF.DfUiContext.prototype.setDropInfo.call( this , dropInfo);
	return this.addOperation1DropInfo(this, oFF.UiProperty.DROP_INFO.getSetterMethodName(), dropInfo);
};
oFF.UiServerControl.prototype.setCssClass = function(cssClass)
{
	oFF.DfUiContext.prototype.setCssClass.call( this , cssClass);
	return this.addOperation1String(this, oFF.UiProperty.CSS_CLASS.getSetterMethodName(), cssClass);
};
oFF.UiServerControl.prototype.setPartiallyChecked = function(partiallyChecked)
{
	oFF.DfUiContext.prototype.setPartiallyChecked.call( this , partiallyChecked);
	return this.addOperation1Boolean(this, oFF.UiProperty.PARTIALLY_CHECKED.getSetterMethodName(), partiallyChecked);
};
oFF.UiServerControl.prototype.setApplyContentPadding = function(applyContentPadding)
{
	oFF.DfUiContext.prototype.setApplyContentPadding.call( this , applyContentPadding);
	return this.addOperation1Boolean(this, oFF.UiProperty.APPLY_CONTENT_PADDING.getSetterMethodName(), applyContentPadding);
};
oFF.UiServerControl.prototype.setEnableReordering = function(enableReordering)
{
	oFF.DfUiContext.prototype.setEnableReordering.call( this , enableReordering);
	return this.addOperation1Boolean(this, oFF.UiProperty.ENABLE_REORDERING.getSetterMethodName(), enableReordering);
};
oFF.UiServerControl.prototype.setHeaderMode = function(headerMode)
{
	oFF.DfUiContext.prototype.setHeaderMode.call( this , headerMode);
	return this.addOperation1Constant(this, oFF.UiProperty.HEADER_MODE.getSetterMethodName(), headerMode);
};
oFF.UiServerControl.prototype.setCount = function(count)
{
	oFF.DfUiContext.prototype.setCount.call( this , count);
	return this.addOperation1String(this, oFF.UiProperty.COUNT.getSetterMethodName(), count);
};
oFF.UiServerControl.prototype.setShowAddNewButton = function(showAddNewButton)
{
	oFF.DfUiContext.prototype.setShowAddNewButton.call( this , showAddNewButton);
	return this.addOperation1Boolean(this, oFF.UiProperty.SHOW_ADD_NEW_BUTTON.getSetterMethodName(), showAddNewButton);
};
oFF.UiServerControl.prototype.setModified = function(modified)
{
	oFF.DfUiContext.prototype.setModified.call( this , modified);
	return this.addOperation1Boolean(this, oFF.UiProperty.MODIFIED.getSetterMethodName(), modified);
};
oFF.UiServerControl.prototype.addElementToAggregation = function(element, aggrDef)
{
	oFF.DfUiContext.prototype.addElementToAggregation.call( this , element, aggrDef);
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		this._addAggrAddOperation(aggrDef.getAddMethodName(), element);
	}
};
oFF.UiServerControl.prototype.insertElementIntoAggregation = function(element, index, aggrDef)
{
	oFF.DfUiContext.prototype.insertElementIntoAggregation.call( this , element, index, aggrDef);
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		this._addAggrInsertOperation(aggrDef.getInsertMethodName(), element, index);
	}
};
oFF.UiServerControl.prototype.removeElementFromAggregation = function(element, aggrDef)
{
	oFF.DfUiContext.prototype.removeElementFromAggregation.call( this , element, aggrDef);
	if (oFF.notNull(element) && oFF.notNull(aggrDef))
	{
		this._addAggrRemoveOperation(aggrDef.getRemoveMethodName(), element);
	}
};
oFF.UiServerControl.prototype.clearAggregation = function(aggrDef)
{
	oFF.DfUiContext.prototype.clearAggregation.call( this , aggrDef);
	if (oFF.notNull(aggrDef))
	{
		this._addAggregationClearOperation(aggrDef.getClearMethodName());
	}
};
oFF.UiServerControl.prototype.openAt = function(control)
{
	oFF.DfUiContext.prototype.openAt.call( this , control);
	this._addUIOperationWithControlContext(oFF.UiMethod.OPEN_AT.getMethodName(), control);
	return this;
};
oFF.UiServerControl.prototype.openAtPosition = function(posX, posY)
{
	oFF.DfUiContext.prototype.openAtPosition.call( this , posX, posY);
	var params = this._addUIOperationWithParams(oFF.UiMethod.OPEN_AT_POSITION.getMethodName());
	if (oFF.notNull(params))
	{
		params.addInteger(posX);
		params.addInteger(posY);
	}
	return this;
};
oFF.UiServerControl.prototype.open = function()
{
	oFF.DfUiContext.prototype.open.call( this );
	this._addUIOperation(oFF.UiMethod.OPEN.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.close = function()
{
	oFF.DfUiContext.prototype.close.call( this );
	this._addUIOperation(oFF.UiMethod.CLOSE.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.print = function(text)
{
	oFF.DfUiContext.prototype.print.call( this , text);
	this.addOperation1String(this, oFF.UiMethod.PRINT.getMethodName(), text);
};
oFF.UiServerControl.prototype.println = function(text)
{
	oFF.DfUiContext.prototype.println.call( this , text);
	this.addOperation1String(this, oFF.UiMethod.PRINTLN.getMethodName(), text);
};
oFF.UiServerControl.prototype.expandToLevel = function(level)
{
	oFF.DfUiContext.prototype.expandToLevel.call( this , level);
	this.addOperation1Int(this, oFF.UiMethod.EXPAND_TO_LEVEL.getMethodName(), level);
	return this;
};
oFF.UiServerControl.prototype.collapseAll = function()
{
	oFF.DfUiContext.prototype.collapseAll.call( this );
	this._addUIOperation(oFF.UiMethod.COLLAPSE_ALL.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.focus = function()
{
	oFF.DfUiContext.prototype.focus.call( this );
	this._addUIOperation(oFF.UiMethod.FOCUS.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.shake = function()
{
	oFF.DfUiContext.prototype.shake.call( this );
	this._addUIOperation(oFF.UiMethod.SHAKE.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.showSuggestions = function()
{
	oFF.DfUiContext.prototype.showSuggestions.call( this );
	this._addUIOperation(oFF.UiMethod.SHOW_SUGGESTIONS.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.closeSuggestions = function()
{
	oFF.DfUiContext.prototype.closeSuggestions.call( this );
	this._addUIOperation(oFF.UiMethod.CLOSE_SUGGESTIONS.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.back = function()
{
	oFF.DfUiContext.prototype.back.call( this );
	this._addUIOperation(oFF.UiMethod.BACK.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.scrollTo = function(x, y, duration)
{
	oFF.DfUiContext.prototype.scrollTo.call( this , x, y, duration);
	var params = this._addUIOperationWithParams(oFF.UiMethod.SCROLL_TO.getMethodName());
	if (oFF.notNull(params))
	{
		params.addInteger(x);
		params.addInteger(y);
		params.addInteger(duration);
	}
	return this;
};
oFF.UiServerControl.prototype.scrollToControl = function(control, duration)
{
	oFF.DfUiContext.prototype.scrollToControl.call( this , control, duration);
	var params = this._addUIOperationWithParams(oFF.UiMethod.SCROLL_TO_CONTROL.getMethodName());
	if (oFF.notNull(params))
	{
		this._addContextOrNull(params, control);
		params.addInteger(duration);
	}
	return this;
};
oFF.UiServerControl.prototype.popToPage = function(page)
{
	oFF.DfUiContext.prototype.popToPage.call( this , page);
	var params = this._addUIOperationWithParams(oFF.UiMethod.POP_TO_PAGE.getMethodName());
	if (oFF.notNull(params))
	{
		this._addContextOrNull(params, page);
	}
	return this;
};
oFF.UiServerControl.prototype.maximize = function(animated)
{
	oFF.DfUiContext.prototype.maximize.call( this , animated);
	this.addOperation1Boolean(this, oFF.UiMethod.MAXIMIZE.getMethodName(), animated);
	return this;
};
oFF.UiServerControl.prototype.restore = function(animated)
{
	oFF.DfUiContext.prototype.restore.call( this , animated);
	this.addOperation1Boolean(this, oFF.UiMethod.RESTORE.getMethodName(), animated);
	return this;
};
oFF.UiServerControl.prototype.hide = function(animated, refControl)
{
	oFF.DfUiContext.prototype.hide.call( this , animated, refControl);
	var params = this._addUIOperationWithParams(oFF.UiMethod.HIDE.getMethodName());
	if (oFF.notNull(params))
	{
		params.addBoolean(animated);
		this._addContextOrNull(params, refControl);
	}
	return this;
};
oFF.UiServerControl.prototype.show = function(animated, refControl)
{
	oFF.DfUiContext.prototype.show.call( this , animated, refControl);
	var params = this._addUIOperationWithParams(oFF.UiMethod.SHOW.getMethodName());
	if (oFF.notNull(params))
	{
		params.addBoolean(animated);
		this._addContextOrNull(params, refControl);
	}
	return this;
};
oFF.UiServerControl.prototype.selectText = function(startIndex, endIndex)
{
	oFF.DfUiContext.prototype.selectText.call( this , startIndex, endIndex);
	var params = this._addUIOperationWithParams(oFF.UiMethod.SELECT_TEXT.getMethodName());
	if (oFF.notNull(params))
	{
		params.addInteger(startIndex);
		params.addInteger(endIndex);
	}
	return this;
};
oFF.UiServerControl.prototype.fullscreen = function()
{
	oFF.DfUiContext.prototype.fullscreen.call( this );
	this._addUIOperation(oFF.UiMethod.FULLSCREEN.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.startReadLine = function(text, numOfChars)
{
	oFF.DfUiContext.prototype.startReadLine.call( this , text, numOfChars);
	var params = this._addUIOperationWithParams(oFF.UiMethod.START_READ_LINE.getMethodName());
	if (oFF.notNull(params))
	{
		params.addString(text);
		params.addInteger(numOfChars);
	}
	return this;
};
oFF.UiServerControl.prototype.bringToFront = function()
{
	oFF.DfUiContext.prototype.bringToFront.call( this );
	this._addUIOperation(oFF.UiMethod.BRING_TO_FRONT.getMethodName());
	return this;
};
oFF.UiServerControl.prototype.putEventListener = function(eventDef, listener)
{
	oFF.DfUiContext.prototype.putEventListener.call( this , eventDef, listener);
	this._addRegisterEventOperation(eventDef);
};
oFF.UiServerControl.prototype.onSelect = function(event)
{
	var listener = this.getListenerOnSelect();
	if (oFF.notNull(listener))
	{
		listener.onSelect(event);
	}
};
oFF.UiServerControl.prototype.onSelectionChange = function(event)
{
	var listener = this.getListenerOnSelectionChange();
	if (oFF.notNull(listener))
	{
		listener.onSelectionChange(event);
	}
};
oFF.UiServerControl.prototype.onDoubleClick = function(event)
{
	var listener = this.getListenerOnDoubleClick();
	if (oFF.notNull(listener))
	{
		listener.onDoubleClick(event);
	}
};
oFF.UiServerControl.prototype.onOpen = function(event)
{
	var listener = this.getListenerOnOpen();
	if (oFF.notNull(listener))
	{
		listener.onOpen(event);
	}
};
oFF.UiServerControl.prototype.onClose = function(event)
{
	var listener = this.getListenerOnClose();
	if (oFF.notNull(listener))
	{
		listener.onClose(event);
	}
};
oFF.UiServerControl.prototype.onBeforeOpen = function(event)
{
	var listener = this.getListenerOnBeforeOpen();
	if (oFF.notNull(listener))
	{
		listener.onBeforeOpen(event);
	}
};
oFF.UiServerControl.prototype.onBeforeClose = function(event)
{
	var listener = this.getListenerOnBeforeClose();
	if (oFF.notNull(listener))
	{
		listener.onBeforeClose(event);
	}
};
oFF.UiServerControl.prototype.onAfterOpen = function(event)
{
	var listener = this.getListenerOnAfterOpen();
	if (oFF.notNull(listener))
	{
		listener.onAfterOpen(event);
	}
};
oFF.UiServerControl.prototype.onAfterClose = function(event)
{
	var listener = this.getListenerOnAfterClose();
	if (oFF.notNull(listener))
	{
		listener.onAfterClose(event);
	}
};
oFF.UiServerControl.prototype.onChange = function(event)
{
	var listener = this.getListenerOnChange();
	if (oFF.notNull(listener))
	{
		listener.onChange(event);
	}
};
oFF.UiServerControl.prototype.onLiveChange = function(event)
{
	var listener = this.getListenerOnLiveChange();
	if (oFF.notNull(listener))
	{
		listener.onLiveChange(event);
	}
};
oFF.UiServerControl.prototype.onDelete = function(event)
{
	var listener = this.getListenerOnDelete();
	if (oFF.notNull(listener))
	{
		listener.onDelete(event);
	}
};
oFF.UiServerControl.prototype.onDetailPress = function(event)
{
	var listener = this.getListenerOnDetailPress();
	if (oFF.notNull(listener))
	{
		listener.onDetailPress(event);
	}
};
oFF.UiServerControl.prototype.onMove = function(event)
{
	var listener = this.getListenerOnMove();
	if (oFF.notNull(listener))
	{
		listener.onMove(event);
	}
};
oFF.UiServerControl.prototype.onMoveStart = function(event)
{
	var listener = this.getListenerOnMoveStart();
	if (oFF.notNull(listener))
	{
		listener.onMoveStart(event);
	}
};
oFF.UiServerControl.prototype.onMoveEnd = function(event)
{
	var listener = this.getListenerOnMoveEnd();
	if (oFF.notNull(listener))
	{
		listener.onMoveEnd(event);
	}
};
oFF.UiServerControl.prototype.onResize = function(event)
{
	var listener = this.getListenerOnResize();
	if (oFF.notNull(listener))
	{
		listener.onResize(event);
	}
};
oFF.UiServerControl.prototype.onSuggestionSelect = function(event)
{
	var listener = this.getListenerOnSuggestionSelect();
	if (oFF.notNull(listener))
	{
		listener.onSuggestionSelect(event);
	}
};
oFF.UiServerControl.prototype.onScroll = function(event)
{
	var listener = this.getListenerOnScroll();
	if (oFF.notNull(listener))
	{
		listener.onScroll(event);
	}
};
oFF.UiServerControl.prototype.onScrollLoad = function(event)
{
	var listener = this.getListenerOnScrollLoad();
	if (oFF.notNull(listener))
	{
		listener.onScrollLoad(event);
	}
};
oFF.UiServerControl.prototype.onPress = function(event)
{
	var listener = this.getListenerOnPress();
	if (oFF.notNull(listener))
	{
		listener.onPress(event);
	}
};
oFF.UiServerControl.prototype.onEnter = function(event)
{
	var listener = this.getListenerOnEnter();
	if (oFF.notNull(listener))
	{
		listener.onEnter(event);
	}
};
oFF.UiServerControl.prototype.onEditingBegin = function(event)
{
	var listener = this.getListenerOnEditingBegin();
	if (oFF.notNull(listener))
	{
		listener.onEditingBegin(event);
	}
};
oFF.UiServerControl.prototype.onEditingEnd = function(event)
{
	var listener = this.getListenerOnEditingEnd();
	if (oFF.notNull(listener))
	{
		listener.onEditingEnd(event);
	}
};
oFF.UiServerControl.prototype.onBack = function(event)
{
	var listener = this.getListenerOnBack();
	if (oFF.notNull(listener))
	{
		listener.onBack(event);
	}
};
oFF.UiServerControl.prototype.onRefresh = function(event)
{
	var listener = this.getListenerOnRefresh();
	if (oFF.notNull(listener))
	{
		listener.onRefresh(event);
	}
};
oFF.UiServerControl.prototype.onLoadFinished = function(event)
{
	var listener = this.getListenerOnLoadFinished();
	if (oFF.notNull(listener))
	{
		listener.onLoadFinished(event);
	}
};
oFF.UiServerControl.prototype.onClick = function(event)
{
	var listener = this.getListenerOnClick();
	if (oFF.notNull(listener))
	{
		listener.onClick(event);
	}
};
oFF.UiServerControl.prototype.onContextMenu = function(event)
{
	var listener = this.getListenerOnContextMenu();
	if (oFF.notNull(listener))
	{
		listener.onContextMenu(event);
	}
};
oFF.UiServerControl.prototype.onCollapse = function(event)
{
	var listener = this.getListenerOnCollapse();
	if (oFF.notNull(listener))
	{
		listener.onCollapse(event);
	}
};
oFF.UiServerControl.prototype.onExpand = function(event)
{
	var listener = this.getListenerOnExpand();
	if (oFF.notNull(listener))
	{
		listener.onExpand(event);
	}
};
oFF.UiServerControl.prototype.onHover = function(event)
{
	var listener = this.getListenerOnHover();
	if (oFF.notNull(listener))
	{
		listener.onHover(event);
	}
};
oFF.UiServerControl.prototype.onHoverEnd = function(event)
{
	var listener = this.getListenerOnHoverEnd();
	if (oFF.notNull(listener))
	{
		listener.onHoverEnd(event);
	}
};
oFF.UiServerControl.prototype.onPaste = function(event)
{
	var listener = this.getListenerOnPaste();
	if (oFF.notNull(listener))
	{
		listener.onPaste(event);
	}
};
oFF.UiServerControl.prototype.onSelectionFinish = function(event)
{
	var listener = this.getListenerOnSelectionFinish();
	if (oFF.notNull(listener))
	{
		listener.onSelectionFinish(event);
	}
};
oFF.UiServerControl.prototype.onSearch = function(event)
{
	var listener = this.getListenerOnSearch();
	if (oFF.notNull(listener))
	{
		listener.onSearch(event);
	}
};
oFF.UiServerControl.prototype.onButtonPress = function(event)
{
	var listener = this.getListenerOnButtonPress();
	if (oFF.notNull(listener))
	{
		listener.onButtonPress(event);
	}
};
oFF.UiServerControl.prototype.onError = function(event)
{
	var listener = this.getListenerOnError();
	if (oFF.notNull(listener))
	{
		listener.onError(event);
	}
};
oFF.UiServerControl.prototype.onReadLineFinished = function(event)
{
	var listener = this.getListenerOnReadLineFinished();
	if (oFF.notNull(listener))
	{
		listener.onReadLineFinished(event);
	}
};
oFF.UiServerControl.prototype.onExecute = function(event)
{
	var listener = this.getListenerOnExecute();
	if (oFF.notNull(listener))
	{
		listener.onExecute(event);
	}
};
oFF.UiServerControl.prototype.onTerminate = function(event)
{
	var listener = this.getListenerOnTerminate();
	if (oFF.notNull(listener))
	{
		listener.onTerminate(event);
	}
};
oFF.UiServerControl.prototype.onFileDrop = function(event)
{
	var listener = this.getListenerOnFileDrop();
	if (oFF.notNull(listener))
	{
		listener.onFileDrop(event);
	}
};
oFF.UiServerControl.prototype.onDrop = function(event)
{
	var listener = this.getListenerOnDrop();
	if (oFF.notNull(listener))
	{
		listener.onDrop(event);
	}
};
oFF.UiServerControl.prototype.onItemClose = function(event)
{
	var listener = this.getListenerOnItemClose();
	if (oFF.notNull(listener))
	{
		listener.onItemClose(event);
	}
};
oFF.UiServerControl.prototype.onItemSelect = function(event)
{
	var listener = this.getListenerOnItemSelect();
	if (oFF.notNull(listener))
	{
		listener.onItemSelect(event);
	}
};
oFF.UiServerControl.prototype.onTableDragAndDrop = function(event)
{
	var listener = this.getListenerOnTableDragAndDrop();
	if (oFF.notNull(listener))
	{
		listener.onTableDragAndDrop(event);
	}
};
oFF.UiServerControl.prototype.setSelectedItem = function(selectedItem)
{
	oFF.DfUiContext.prototype.setSelectedItem.call( this , selectedItem);
	this._addUIOperationWithControlContext(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEM, selectedItem);
	return this;
};
oFF.UiServerControl.prototype.setSelectedItems = function(selectedItems)
{
	oFF.DfUiContext.prototype.setSelectedItems.call( this , selectedItems);
	this._addUIOperationWithControlContextList(oFF.UiRemoteProtocol.OP_SET_SELECTED_ITEMS, selectedItems);
	return this;
};
oFF.UiServerControl.prototype.addSelectedItem = function(selectedItem)
{
	oFF.DfUiContext.prototype.addSelectedItem.call( this , selectedItem);
	this._addUIOperationWithControlContext(oFF.UiRemoteProtocol.OP_ADD_SELECTED_ITEM, selectedItem);
	return this;
};
oFF.UiServerControl.prototype.removeSelectedItem = function(selectedItem)
{
	oFF.DfUiContext.prototype.removeSelectedItem.call( this , selectedItem);
	this._addUIOperationWithControlContext(oFF.UiRemoteProtocol.OP_REMOVE_SELECTED_ITEM, selectedItem);
	return this;
};
oFF.UiServerControl.prototype.clearSelectedItems = function()
{
	oFF.DfUiContext.prototype.clearSelectedItems.call( this );
	this._addUIOperation(oFF.UiRemoteProtocol.OP_CLEAR_SELECTED_ITEMS);
	return this;
};
oFF.UiServerControl.prototype.addOperation1String = function(object, name, param0)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1String(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype.addOperation1Int = function(object, name, param0)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Int(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype.addOperation1Double = function(object, name, param0)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Double(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype.addOperation1Boolean = function(object, name, param0)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Boolean(object, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype.addOperation1ListOfString = function(object, name, param0)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		var addOperation = master.addOperation(object, name, this);
		this._addListOfStringsOrNull(addOperation, param0);
	}
	return this;
};
oFF.UiServerControl.prototype.addOperation1Element = function(object, name, param0)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Element(this, name, param0);
	}
	return this;
};
oFF.UiServerControl.prototype.addOperation1Constant = function(object, name, param0)
{
	var constantName = null;
	if (oFF.notNull(param0))
	{
		constantName = param0.getName();
	}
	return this.addOperation1String(object, name, constantName);
};
oFF.UiServerControl.prototype.addOperation1DropInfo = function(object, name, param0)
{
	var dropInfoStr = null;
	if (oFF.notNull(param0))
	{
		dropInfoStr = param0.getAsString();
	}
	return this.addOperation1String(object, name, dropInfoStr);
};
oFF.UiServerControl.prototype._addUIOperation = function(protocol)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation(this, protocol, this);
	}
};
oFF.UiServerControl.prototype._addUIOperationWithParams = function(protocol)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		return master.addOperation(this, protocol, null);
	}
	return null;
};
oFF.UiServerControl.prototype._addUIOperationWithControlContext = function(protocol, controlContext)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Context(this, protocol, controlContext);
	}
};
oFF.UiServerControl.prototype._addUIOperationWithControlContextList = function(protocol, controlList)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		var addOperation = master.addOperation(this, protocol, null);
		this._addIdsListOrNull(addOperation, controlList);
	}
};
oFF.UiServerControl.prototype._addCssBasedObjectOperation = function(prop, cssBase)
{
	if (oFF.notNull(prop))
	{
		if (oFF.notNull(cssBase))
		{
			this.addOperation1String(this, prop.getSetterMethodName(), cssBase.getCssValue());
		}
		else
		{
			this.addOperation1String(this, prop.getSetterMethodName(), null);
		}
	}
};
oFF.UiServerControl.prototype._addRegisterEventOperation = function(eventDef)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Cannot register event listener. Missing event definition!");
	}
	this._addUIOperation(eventDef.getRegisterMethodName());
};
oFF.UiServerControl.prototype._addAggrAddOperation = function(protocol, element)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Context(this, protocol, element);
	}
};
oFF.UiServerControl.prototype._addAggrInsertOperation = function(protocol, element, index)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		var operation = master.addOperation1Context(this, protocol, element);
		operation.addInteger(index);
	}
};
oFF.UiServerControl.prototype._addAggrRemoveOperation = function(protocol, element)
{
	var master = this.getMasterNoCall();
	if (oFF.notNull(master))
	{
		master.addOperation1Context(this, protocol, element);
	}
};
oFF.UiServerControl.prototype._addAggregationClearOperation = function(protocol)
{
	this._addUIOperation(protocol);
};
oFF.UiServerControl.prototype._addIdsListOrNull = function(list, itemList)
{
	if (oFF.isNull(itemList))
	{
		list.addString(null);
	}
	else
	{
		var itemIdsBuffer = oFF.XStringBuffer.create();
		for (var a = 0; a < itemList.size(); a++)
		{
			var tmpItem = itemList.get(a);
			if (a > 0)
			{
				itemIdsBuffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
			}
			itemIdsBuffer.append(tmpItem.getId());
		}
		list.addString(itemIdsBuffer.toString());
	}
};
oFF.UiServerControl.prototype._addListOfStringsOrNull = function(list, stringList)
{
	if (oFF.isNull(stringList))
	{
		list.addString(null);
	}
	else
	{
		var stringBuffer = oFF.XStringBuffer.create();
		for (var a = 0; a < stringList.size(); a++)
		{
			var tmpString = stringList.get(a);
			if (a > 0)
			{
				stringBuffer.append(oFF.UiRemoteProtocol.MULTI_ITEM_SEPARATOR);
			}
			stringBuffer.append(tmpString);
		}
		list.addString(stringBuffer.toString());
	}
};
oFF.UiServerControl.prototype._addContextOrNull = function(list, context)
{
	if (oFF.notNull(context))
	{
		list.addString(context.getId());
	}
	else
	{
		list.addString(null);
	}
};

oFF.UiCompositeRemote = function() {};
oFF.UiCompositeRemote.prototype = new oFF.UiComposite();
oFF.UiCompositeRemote.prototype._ff_c = "UiCompositeRemote";

oFF.UiCompositeRemote.create = function()
{
	var newObject = new oFF.UiCompositeRemote();
	newObject.setup();
	return newObject;
};
oFF.UiCompositeRemote.prototype.initializeComposite = function() {};

oFF.UiRemoteModule = function() {};
oFF.UiRemoteModule.prototype = new oFF.DfModule();
oFF.UiRemoteModule.prototype._ff_c = "UiRemoteModule";

oFF.UiRemoteModule.s_module = null;
oFF.UiRemoteModule.getInstance = function()
{
	if (oFF.isNull(oFF.UiRemoteModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiProgramModule.getInstance());
		oFF.UiRemoteModule.s_module = oFF.DfModule.startExt(new oFF.UiRemoteModule());
		oFF.UiServerEvent.staticSetup();
		oFF.SphereServer.staticSetup();
		oFF.ProgramRegistration.setProgramFactory(oFF.SubSysGuiServerPrg.DEFAULT_PROGRAM_NAME, new oFF.SubSysGuiServerPrg());
		oFF.ProgramRegistration.setProgramFactory(oFF.SphereClient.DEFAULT_PROGRAM_NAME, new oFF.SphereClient());
		oFF.DfModule.stopExt(oFF.UiRemoteModule.s_module);
	}
	return oFF.UiRemoteModule.s_module;
};
oFF.UiRemoteModule.prototype.getName = function()
{
	return "ff2230.ui.remote";
};

oFF.UiRemoteModule.getInstance();

return sap.firefly;
	} );