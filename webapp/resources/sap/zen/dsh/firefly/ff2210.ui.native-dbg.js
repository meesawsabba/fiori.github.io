/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff2200.ui"
],
function(oFF)
{
"use strict";
// required for edge, because globalThis does not exist.
if (typeof globalThis === "undefined") {
  var globalThis = undefined;
  if (typeof self !== "undefined") {
    globalThis = self;
  } else if (typeof window !== "undefined") {
    globalThis = window;
  } else if (typeof global !== "undefined") {
    globalThis = global;
  }
}

var $Global = $Global || globalThis || this;

var sap = sap || $Global.sap || {};
if (!sap.firefly) {
  sap["firefly"] = {};
}

// get the url params
var urlParams = undefined;
var isDebugEnabled = false;
// ie11 does not support URLSearchParams so make sure that it is available
if ('URLSearchParams' in $Global) {
  urlParams = new URLSearchParams($Global.location.search);
  if (urlParams) {
    isDebugEnabled = (urlParams.get("ff-ui-debug") && urlParams.get("ff-ui-debug") === "true");
  }
}

//--- helpers ---

sap.firefly.getUi5ControlById = function(id) {
   var ui5Control = null;
  if (id && sap && sap.ui) {
    var ui5Control = sap.ui.getCore().byId(id);
  }
  return ui5Control;
};
sap.firefly.getFfUxControlById = function(id) {
   var ffUxControl = null;
  if (id && sap.firefly && sap.firefly.UxGeneric) {
    var ui5Control = sap.firefly.getUi5ControlById(id);
    if (ui5Control) {
      ffUxControl = sap.firefly.UxGeneric.getUxControl(ui5Control);
    }
  }
  return ffUxControl;
};

//--- logging ---

sap.firefly.logInfo = function(logMsg) {
   logMsg = "[FireflyUi]: " + logMsg;
  if (jQuery && jQuery.sap && jQuery.sap.log) {
    jQuery.sap.log.info(logMsg);
  } else {
    console.log(logMsg);
  }
};
sap.firefly.logWarning = function(logMsg) {
   logMsg = "[FireflyUi]: " + logMsg;
  if (jQuery && jQuery.sap && jQuery.sap.log) {
    jQuery.sap.log.warning(logMsg);
  } else {
    console.warn(logMsg);
  }
};
sap.firefly.logError = function(logMsg) {
   logMsg = "[FireflyUi]: " + logMsg;
  if (jQuery && jQuery.sap && jQuery.sap.log) {
    jQuery.sap.log.error(logMsg);
  } else {
    console.error(logMsg);
  }
};
sap.firefly.logCritical = function(logMsg) {
  console.error("%c[FireflyUi]:%c " + logMsg, "background: #cc0000; color: #fff", "background: unset; color: unset");
};
sap.firefly.logDebug = function(logMsg, color, bgColor) {
  if (isDebugEnabled) {
    color = color ? color : "unset";
    bgColor = bgColor ? bgColor : "unset";
    logMsg = "%c[FireflyUi]:%c " + logMsg;
    console.log(logMsg, "background: #3867d6; color: #fff", "background: " + bgColor + "; color: " + color);
  }
};
sap.firefly.setLogLevel = function(level) {
  if (jQuery && jQuery.sap && jQuery.sap.log) {
    jQuery.sap.log.setLevel(level);
  }
};


//--- theme ---

// https://flatuicolors.com/palette/de

sap.firefly.getRedColor = function() {
  return "#fc5c65";
};
sap.firefly.getGreenColor = function() {
  return "#26de81";
};
sap.firefly.getBlueColor = function() {
  return "#45aaf2";
};
sap.firefly.getOrangeColor = function() {
  return "#fd9644";
};
sap.firefly.getGreyColor = function() {
  return "#778ca3";
};
sap.firefly.getYellowColor = function() {
  return "#fed330";
};
sap.firefly.getBlackColor = function() {
  return "#262626";
};

//---=== Lib loaders below are located in sap.firefly.LibLoader.js. Empty methods to prevent crashes ===---

//--- sapui5 dynamic lib loader ---
sap.firefly.loadUi5LibIfNeeded = function(ui5Lib) {};

//--- external lib loader ---
sap.firefly.loadExternalLibrary = function(libUrl) {};
sap.firefly.loadExternalCssStyles = function(stylesUrl) {};
sap.firefly.loadSacTableIfNeeded = function(location) {};
sap.firefly.loadHighchartsIfNeeded = function() {};

sap.firefly.XtWindowManager = function() {
   this.m_windowContainer = null;
  this.m_curZIndex = 8;
  this.m_generatedUidCount = 0;
};

// ======================================
// == STATIC STUFF
// ======================================

sap.firefly.XtWindowManager.activeManagerInstance = null;

sap.firefly.XtWindowManager.staticSetup = function() {
   if (sap.firefly.XtWindowManager.activeManagerInstance == null || sap.firefly.XtWindowManager.activeManagerInstance == undefined) {
    sap.firefly.XtWindowManager.activeManagerInstance = new sap.firefly.XtWindowManager();
    sap.firefly.XtWindowManager.activeManagerInstance.setup();
  }
};

sap.firefly.XtWindowManager.manager = function() {
   if (sap.firefly.XtWindowManager.activeManagerInstance == null || sap.firefly.XtWindowManager.activeManagerInstance == undefined) {
    sap.firefly.XtWindowManager.staticSetup();
  }
  return sap.firefly.XtWindowManager.activeManagerInstance;
};


// ======================================
// == SETUP
// ======================================

sap.firefly.XtWindowManager.prototype.setup = function() {
  this.prepareWindowContainer();
  this.preapreFocusHandling();
};

sap.firefly.XtWindowManager.prototype.releaseManager = function() {
  this.m_windowContainer = null;
  this.m_curZIndex = 0;
  this.m_generatedUidCount = 0;
};

// ======================================
// == WINDOW MANAGEMENT METHODS
// ======================================

sap.firefly.XtWindowManager.prototype.createNewWindow = function(windowId) {
  // try to generate a window id
  if (!windowId || windowId.length === 0) {
    windowId = this.generateWindowUid();
  }

  // if still no window container found then show error
  if (this.m_windowContainer == null || this.m_windowContainer == undefined) {
    console.error("sap.firefly.XtWindowManager - No window manager found, cannot create a new window");
    return null;
  }

  // if a window with the id already exists then show error
  if ($("#" + windowId + ".ff-window-wrapper").length !== 0) {
    console.error("sap.firefly.XtWindowManager - A window with the specified ID already exists in the DOM");
    return null;
  }

  var tempWindow = sap.firefly.XtWindow.newWindowWithId(windowId, this.m_windowContainer);

  return tempWindow;
};

sap.firefly.XtWindowManager.prototype.createNewTerminal = function(windowId) {
  // try to generate a window id
  if (!windowId || windowId.length === 0) {
    windowId = this.generateWindowUid();
  }

  // if still no window container found then show error
  if (this.m_windowContainer == null || this.m_windowContainer == undefined) {
    console.error("sap.firefly.XtWindowManager - No window manager found, cannot create a new window");
    return null;
  }

  // if a window with the id already exists then show error
  if ($("#" + windowId + ".ff-window-wrapper").length !== 0) {
    console.error("sap.firefly.XtWindowManager - A window with the specified ID already exists in the DOM");
    return null;
  }

  var tempTerminal = sap.firefly.XtTerminal.newTerminalWithId(windowId, this.m_windowContainer);

  return tempTerminal;
};

sap.firefly.XtWindowManager.prototype.focusNextWindow = function() {
  // focus the window with the highest z-indexOf
  var windowContainerChildren = this.m_windowContainer.children();
  if (windowContainerChildren.length > 0) {
    var highestZIndexElem = windowContainerChildren.get(0);
    windowContainerChildren.each(function() {
      var newZIndex = parseInt(this.style.zIndex); // "this" is the current element in the loop
      var previousZIndex = parseInt(highestZIndexElem.style.zIndex);
      if (newZIndex > previousZIndex) {
        highestZIndexElem = this;
      }
    });

    // add focued class to the window with the highest z index
    $(highestZIndexElem).addClass("focused");
    // make sure that the keydown and keyup events are working
    $(highestZIndexElem).focus();
  }
};

sap.firefly.XtWindowManager.prototype.getFrontMostZIndex = function() {
  return this.m_curZIndex;
};

sap.firefly.XtWindowManager.prototype.getNextWindowZIndex = function() {
  this.m_curZIndex = this.m_curZIndex + 2;
  return this.m_curZIndex;
};

sap.firefly.XtWindowManager.prototype.generateWindowUid = function(windowType) {
  windowType = windowType ? windowType : "Window";
  this.m_generatedUidCount = this.m_generatedUidCount + 1;
  var generatedUid = "__" + windowType + this.m_generatedUidCount + "__";
  return generatedUid;
};

// ======================================
// == INITIAL SETUP METHODS
// ======================================

sap.firefly.XtWindowManager.prototype.prepareWindowContainer = function() {
  // append a window container to the body if it does not exist and apply styling
  if ($("#ff-window-container").length === 0) {
    $("<div id='ff-window-container' />").appendTo("body");
  }

  this.m_windowContainer = $("#ff-window-container");
};

sap.firefly.XtWindowManager.prototype.preapreFocusHandling = function() {
  $(document).on("mousedown", function(e) {
    // if i click on a sapui5 window element (like menu item or dropwdown item) do nothing
    // those controls are always in the sap-ui-static container
    // in that case we do not change the focus state of windows
    if ($(e.target).parents("#sap-ui-static").length > 0) {
      return;
    }

    // remove focused class from all window elements except the one i just clicked
    var clickedWindow = $(e.target).closest(".ff-window-wrapper");
    $("#ff-window-container .ff-window-wrapper.focused").not(clickedWindow).removeClass("focused");
  });

  $(window).on("blur", function(e) {
    // when the browser window is blurred(lose focus) remeber which element was focused and remove the focus
    $("#ff-window-container .ff-window-wrapper.focused").removeClass("focused").addClass("focusDisabled");
  });

  $(window).on("focus", function(e) {
    // when the browser window is focused then restore back the previously focused element
    $("#ff-window-container .ff-window-wrapper.focusDisabled").removeClass("focusDisabled").addClass("focused");
  });
};

var DEFAULT_ANIMATION_TIME = 150;

sap.firefly.XtBaseWindow = function() {
 
  // properties
  this.m_isOpen = null;
  this.m_title = null;
  this.m_isMaximized = null;
  this.m_isHidden = null;
  this.m_widthCss = null;
  this.m_heightCss = null;
  this.m_posXCss = null;
  this.m_posYCss = null;
  this.m_customStyleClasses = null;
  // events
  this.m_onOpen = null;
  this.m_onClose = null;
  this.m_onMove = null;
  this.m_onMoveStart = null;
  this.m_onMoveEnd = null;
  this.m_onResize = null;
  this.m_onClosePress = null;
  this.m_onMaximizePress = null;
  this.m_onHidePress = null;
  this.m_onFileDrop = null;
  // internal stuff
  this.m_ffWindowContainer = null; // global window container where ff windows are placed
  this.m_windowId = null; // id of the window
  this.m_windowWrapper = null; //jquery dom object
  this.m_resizeObserver = null; //for document resizing
};

// ======================================
// == SETUP
// ======================================

sap.firefly.XtBaseWindow.prototype.initWithWindowId = function(windowId, windowContainer) {
  this.m_windowId = windowId;
  this.m_ffWindowContainer = windowContainer;

  // try to generate a window id
  if (!this.m_windowId || this.m_windowId.length === 0) {
    this.m_windowId = sap.firefly.XtWindowManager.manager().generateWindowUid(this._getWindowType());
  }

  // if a window with the id already exists then do nothing
  if ($("#" + this.m_windowId + ".ff-window-wrapper").length !== 0) {
    console.error("sap.firefly.XtBaseWindow - A window with the specified id already exists. Cannot create!");
    return null;
  }

  // setup properties
  this._setupWindow();

  //all good
  return this;
};

sap.firefly.XtBaseWindow.prototype._setupWindow = function() {
  // properties
  this.m_isOpen = false;
  this.m_title = null;
  this.m_isMaximized = false;
  this.m_isHidden = false;
  this.m_widthCss = null;
  this.m_heightCss = null;
  this.m_posXCss = null;
  this.m_posYCss = null;
  this.m_customStyleClasses = "";
  // events
  this.m_onOpen = null;
  this.m_onClose = null;
  this.m_onMove = null;
  this.m_onMoveStart = null;
  this.m_onMoveEnd = null;
  this.m_onResize = null;
  this.m_onClosePress = null;
  this.m_onMaximizePress = null;
  this.m_onHidePress = null;
  this.m_onFileDrop = null;
  // internal stuff
  this.m_windowWrapper = null;

  //resize observer
  var myself = this;
  if (window.ResizeObserver && !this.m_resizeObserver) {
    this.m_resizeObserver = new ResizeObserver(function(entries) {
      //adjust the window to use the maximum available space
      myself._useAllAvailableSpace(false, false);
    });
  }

};

sap.firefly.XtBaseWindow.prototype._getWindowType = function() {
  return "BaseWindow";
};

// ======================================
// == CLEANUP
// ======================================

sap.firefly.XtBaseWindow.prototype.releaseWindow = function() {
  this.destroy();

  //stop observing document resize
  this._unobserveDocumentResize();
};

// ======================================
// == INTERNAL LIFECYCLE
// ======================================

sap.firefly.XtBaseWindow.prototype._createWindowWrapper = function() {
  if (!this.m_ffWindowContainer) {
    this.m_ffWindowContainer = $("#ff-window-container");
  }

  if (!this.m_ffWindowContainer || this.m_ffWindowContainer.length === 0) {
    console.error("sap.firefly.XtBaseWindow - Missing firefly window container. Cannot open window!");
    this.m_ffWindowContainer = null;
    return false;
  }

  if (!this.m_windowId || this.m_windowId.length === 0) {
    console.error("sap.firefly.XtBaseWindow - This window was already destroyed! Cannot open!");
    return false;
  }

  // create the window html and add it to the window container
  // "tabindex" attribute is required for the keydown and keyup events to work on the div! otherweise i would have to put them on the document and keep track of them!
  $("<div class='ff-window-wrapper' id='" + this.m_windowId + "' tabindex='0'>" +
    "<div class='title-bar'>" +
    "<div class='title-bar-buttons'>" +
    "<button class='close'>" +
    "<span class='btn-icon'></span>" +
    "</button>" +
    "<button class='hide'>" +
    "<span class='btn-icon'></span>" +
    "</button>" +
    "<button class='maximize'>" +
    "<span class='btn-icon'></span>" +
    "</button>" +
    "</div>" +
    "<span class='title'></span>" +
    "<div class='title-bar-menu'>" +
    "<span>&#9776;</span>" +
    "</div>" +
    "</div>" +
    "</div>").prependTo(this.m_ffWindowContainer);

  this.m_windowWrapper = $("#" + this.m_windowId + ".ff-window-wrapper");

  return true;
};


sap.firefly.XtBaseWindow.prototype._configureWindowWrapper = function() {
  // set the initial window position and size
  this._setInitialFrame();

  // add drag support and resize support to the window
  this._addDragAndResize();

  // add file drop inside window support
  this._addFileDropHandling();

  // bring the new window to front and focus it
  this._bringWindowToFront();

  // add focus logic to the window
  this._addFocusLogic();

  // preapre the title bar buttons actions
  this._addTitleBarButtonsLogic();

  // Apply window properties from ux window to the window object
  this._applyInitalWindowProperties();
};

sap.firefly.XtBaseWindow.prototype._beforeOpen = function() {
  // stuff todo before open
};

sap.firefly.XtBaseWindow.prototype._afterOpen = function() {
  // stuff to do after open
};

sap.firefly.XtBaseWindow.prototype._beforeClose = function() {
  this.m_windowWrapper.off("mousedown");
  this.m_windowWrapper.off("dragover");
  this.m_windowWrapper.off("dragenter");
  this.m_windowWrapper.off("dragleave");
  this.m_windowWrapper.off("drop");
};

sap.firefly.XtBaseWindow.prototype._afterClose = function() {
  // stuff to do after close
};

sap.firefly.XtBaseWindow.prototype._applyInitalWindowProperties = function() {
  // Set the window title
  if (this.m_title) {
    this.setTitle(this.m_title);
  }

  // apply window additional classes
  if (this.m_customStyleClasses && this.m_customStyleClasses.length > 0) {
    this.addStyleClass(this.m_customStyleClasses);
  }
};

// ======================================
// == PUBLIC METHODS
// ======================================

sap.firefly.XtBaseWindow.prototype.getWindowId = function() {
  return this.m_windowId;
};

sap.firefly.XtBaseWindow.prototype.open = function() {
  if (!this.isOpen()) {
    this._beforeOpen();
    var didCreate = this._createWindowWrapper();
    if (didCreate) {
      this._configureWindowWrapper(); // configure the window
      this.m_isOpen = true;
      this._callEventCallback(this.m_onOpen); // on open event
      this._afterOpen();
      return true;
    }
  }
  return false;
};

sap.firefly.XtBaseWindow.prototype.close = function() {
  if (this.isOpen()) {
    this._beforeClose();
    this.m_windowWrapper.remove();
    this.m_isOpen = false;
    this._callEventCallback(this.m_onClose); // on close event
    this._afterClose();
    this.m_windowWrapper = null;
    //set the focus on the next window
    sap.firefly.XtWindowManager.manager().focusNextWindow();
  }
};

sap.firefly.XtBaseWindow.prototype.isOpen = function() {
  return this.m_isOpen;
};

sap.firefly.XtBaseWindow.prototype.getTitle = function() {
  return this.m_title;
};

sap.firefly.XtBaseWindow.prototype.setTitle = function(newTitle) {
  this.m_title = newTitle;
  if (this.m_windowWrapper && this.m_windowWrapper.length > 0) {
    var titleEle = this.m_windowWrapper.find(".title");
    if (titleEle.length > 0) {
      titleEle.text(newTitle);
    }
  }
};

sap.firefly.XtBaseWindow.prototype.getWidth = function() {
  return this.m_widthCss;
};

sap.firefly.XtBaseWindow.prototype.setWidth = function(newWidth) {
  this.m_widthCss = newWidth;

  if (this.m_windowWrapper) {
    // remove the maximized class and attribute if window was maximized
    if (this.isMaximized()) {
      this._clearMaximized();
    }

    this.m_windowWrapper.css({
      "width": newWidth
    });

    // calculate absolute width
    //    this.m_windowWrapper.css("width", newWidth);
    //    var calculatedWidth = (parseFloat(this.m_windowWrapper.css("width")) || 0);
    //    this.m_windowWrapper.css("width", calculatedWidth + "px");

    // update the width and height attributes
    this._updateSizeAttributes();
  }
};

sap.firefly.XtBaseWindow.prototype.getHeight = function() {
  return this.m_heightCss;
};

sap.firefly.XtBaseWindow.prototype.setHeight = function(newHeight) {
  this.m_heightCss = newHeight;

  if (this.m_windowWrapper) {
    // remove the maximized class and attribute if window was maximized
    if (this.isMaximized()) {
      this._clearMaximized();
    }

    this.m_windowWrapper.css({
      "height": newHeight
    });

    // calculate absolute height
    //    this.m_windowWrapper.css("height", newHeight);
    //    var calculatedHeight = (parseFloat(this.m_windowWrapper.css("height")) || 0);
    //    this.m_windowWrapper.css("height", calculatedHeight + "px");

    // update the width and height attributes
    this._updateSizeAttributes();
  }
};

sap.firefly.XtBaseWindow.prototype.getX = function() {
  return this.m_posXCss;
};

sap.firefly.XtBaseWindow.prototype.setX = function(newPosX) {
  this.m_posXCss = newPosX;

  if (this.m_windowWrapper) {
    // remove the maximized class and attribute if window was maximized
    if (this.isMaximized()) {
      this._clearMaximized();
    }

    var calculatedX = this._calculateAbsolutePosX(newPosX);
    var currTrans = this.m_windowWrapper.css("transform").split(/[()]/)[1];
    var posy = parseInt(currTrans.split(",")[5]);
    this.m_windowWrapper.css({
      "transform": "translate(" + calculatedX + "px" + ", " + posy + "px" + ")",
    });

    // update the attribute
    this.m_windowWrapper.attr("data-x", calculatedX);
  }
};

sap.firefly.XtBaseWindow.prototype.getY = function() {
  return this.m_posYCss;
};

sap.firefly.XtBaseWindow.prototype.setY = function(newPosY) {
  this.m_posYCss = newPosY;

  if (this.m_windowWrapper) {
    // remove the maximized class and attribute if window was maximized
    if (this.isMaximized()) {
      this._clearMaximized();
    }

    var calculatedY = this._calculateAbsolutePosX(newPosY);
    var currTrans = this.m_windowWrapper.css("transform").split(/[()]/)[1];
    var posx = parseInt(currTrans.split(",")[4]);
    this.m_windowWrapper.css({
      "transform": "translate(" + posx + "px" + ", " + calculatedY + "px" + ")",
    });

    // update the attribute
    this.m_windowWrapper.attr("data-y", calculatedY);
  }
};

sap.firefly.XtBaseWindow.prototype.maximize = function(animated) {
  this.m_isMaximized = true;
  this._handleMaximizeWindow(animated);
};

sap.firefly.XtBaseWindow.prototype.restore = function(animated) {
  this.m_isMaximized = false;
  this._handleRestoreWindow(animated);
};

sap.firefly.XtBaseWindow.prototype.isMaximized = function() {
  if (this.m_windowWrapper) {
    return this.m_windowWrapper.hasClass("maximized");
  } else {
    return this.m_isMaximized;
  }
};

sap.firefly.XtBaseWindow.prototype.hide = function(animated, refControl) {
  this.m_isHidden = true;
  this._handleHideWindow(animated, refControl);
};

sap.firefly.XtBaseWindow.prototype.show = function(animated) {
  this.m_isHidden = false;
  this._handleShowWindow(animated);
};

sap.firefly.XtBaseWindow.prototype.isHidden = function() {
  if (this.m_windowWrapper) {
    return this.m_windowWrapper.hasClass("hidden");
  } else {
    return this.m_isHidden;
  }
};

sap.firefly.XtBaseWindow.prototype.bringToFront = function() {
  this._bringWindowToFront();
};

sap.firefly.XtBaseWindow.prototype.addStyleClass = function(className) {
  // ensure that className is a non-empty string
  if (!className || typeof className !== "string") {
    return;
  }

  if (!this.m_customStyleClasses) {
    this.m_customStyleClasses = "";
  }

  if (this.m_customStyleClasses.indexOf(className) === -1) {
    this.m_customStyleClasses = this.m_customStyleClasses + " " + className;
  }
  if (this.m_windowWrapper) {
    this.m_windowWrapper.addClass(className);
  }
};

sap.firefly.XtBaseWindow.prototype.removeStyleClass = function(className) {
  this.m_customStyleClasses.replace(" " + className, "");
  if (this.m_windowWrapper) {
    this.m_windowWrapper.removeClass(className);
  }
};

sap.firefly.XtBaseWindow.prototype.destroy = function() {
  this.m_windowWrapper.remove();
  this.m_windowId = null;
  this.m_ffWindowContainer = null;
  this._setupWindow(); // use this as a shortcut to reset every variable
};

// ======================================
// == EVENTS
// ======================================

sap.firefly.XtBaseWindow.prototype.attachOnOpen = function(callback) {
  this.m_onOpen = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnClose = function(callback) {
  this.m_onClose = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnMove = function(callback) {
  this.m_onMove = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnMoveStart = function(callback) {
  this.m_onMoveStart = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnMoveEnd = function(callback) {
  this.m_onMoveEnd = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnResize = function(callback) {
  this.m_onResize = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnClosePress = function(callback) {
  this.m_onClosePress = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnMaximizePress = function(callback) {
  this.m_onMaximizePress = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnHidePress = function(callback) {
  this.m_onHidePress = callback;
};

sap.firefly.XtBaseWindow.prototype.attachOnFileDrop = function(callback) {
  this.m_onFileDrop = callback;
  if (this.isOpen() === true) {
    this._addFileDropHandling();
  }
};

// ======================================
// == PRIVATE WINDOW SETUP METHODS
// ======================================

sap.firefly.XtBaseWindow.prototype._setInitialFrame = function() {
  // current width and height
  var widthCss = this.m_widthCss;
  var heightCss = this.m_heightCss;

  // current x and y
  var posxCss = this.m_posXCss;
  var posyCss = this.m_posYCss;

  // browser window size
  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;


  //SIZE
  var defaultWidth = Math.min(800, viewportWidth * 0.80); // take whichever is smaller, 800 or 80% of width
  var defaultHeight = Math.min(450, viewportHeight * 0.75); // take whichever is smaller, 450 or 75% of width
  var initialWidth = (widthCss != null && widthCss.length > 0) ? widthCss : defaultWidth + "px";
  var initialHeight = (heightCss != null && heightCss.length > 0) ? heightCss : defaultHeight + "px";

  // set the css styling the initial size
  this.m_windowWrapper.css({
    "width": initialWidth,
    "height": initialHeight,
  });

  // set the data-width, data-height attributes for interactive js drag
  this._updateSizeAttributes();


  // POSITION
  var calculatedWidth = (parseFloat(this.m_windowWrapper.attr("data-width")) || 0); // retrieve calculated width value (px)
  var calculatedHeight = (parseFloat(this.m_windowWrapper.attr("data-height")) || 0); // retrieve calculated height value (px)
  var centerPosX = viewportWidth / 2 - calculatedWidth / 2;
  var centerPosY = viewportHeight / 2 - calculatedHeight / 2;
  var initialPosX = (posxCss != null && posxCss.length > 0) ? this._calculateAbsolutePosX(posxCss) : centerPosX;
  var initialPosY = (posyCss != null && posyCss.length > 0) ? this._calculateAbsolutePosY(posyCss) : centerPosY;;

  // set the css styling for the initial position
  this.m_windowWrapper.css({
    "transform": "translate(" + initialPosX + "px" + ", " + initialPosY + "px" + ")",
  });

  // set the data-x, data-y attributes for interactive js drag
  this.m_windowWrapper.attr("data-x", initialPosX);
  this.m_windowWrapper.attr("data-y", initialPosY);

  //maximized
  if (this.m_isMaximized) {
    this._handleMaximizeWindow(false);
  }

  //hidden
  if (this.m_isHidden) {
    this._handleHideWindow(false, null);
  }
};

sap.firefly.XtBaseWindow.prototype._addDragAndResize = function() {
  var myself = this;

  if (!window.interact) {
    sap.firefly.logError("Could not find interactjs library. Interaction with windows will be not possible!");
    return;
  }

  // add dragging and resizing to the window
  interact(this.m_windowWrapper[0])
    .resizable({
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true
      },
      margin: 3,
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: "parent",
          endOnly: false,
        }),
        // minimum size
        interact.modifiers.restrictSize({
          min: {
            width: 100,
            height: 50
          },
        }),
      ],
      inertia: true // enable inertial throwing
    })
    .on("resizemove", function(event) {
      var target = event.target,
        x = (parseFloat(target.getAttribute("data-x")) || 0),
        y = (parseFloat(target.getAttribute("data-y")) || 0);

      // update the element's style
      target.style.width = event.rect.width + "px";
      target.style.height = event.rect.height + "px";

      target.setAttribute("data-width", event.rect.width);
      target.setAttribute("data-height", event.rect.height);

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px," + y + "px)";

      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    })
    .on("resizeend", function(event) {
      // update the width and height values
      myself.m_widthCss = event.rect.width + "px";
      myself.m_heightCss = event.rect.height + "px";
      // fire the onResize event
      myself._callEventCallback(myself.m_onResize, {
        newWidth: event.rect.width,
        newHeight: event.rect.height
      });
    })
    .draggable({
      allowFrom: ".title-bar",
      ignoreFrom: ".title-bar-buttons, .title-bar-menu",
      inertia: true, // enable inertial throwing
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrict({
          restriction: "parent",
          endOnly: false,
          elementRect: {
            top: 0,
            left: 0.75,
            bottom: 0.25,
            right: 0.25
          }
        }),
      ],
      // call this function on every dragmove event
      onmove: function(event) {
        var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
          y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        // if it is maximized then cleanup
        if (myself.isMaximized()) {
          var origWidth = (parseFloat(target.getAttribute("data-width")) || 0);
          var origHeight = (parseFloat(target.getAttribute("data-height")) || 0);
          var curLeft = (parseFloat(target.style.left) || 0);
          var curTop = (parseFloat(target.style.top) || 0);

          // calcualte the modified position in the window state (not maximized)
          x = x + curLeft;
          y = y + curTop;

          // prepare the start values
          myself.m_windowWrapper.css("left", 0);
          myself.m_windowWrapper.css("top", 0);

          // set and animate back to original values values
          myself.m_windowWrapper.animate({
            width: origWidth,
            height: origHeight,
            left: event.client.x - origWidth / 3
          }, DEFAULT_ANIMATION_TIME);

          // remove the maximized class and attribute
          myself._removeMaximizedInfo();

          //unobserver document resize
          myself._unobserveDocumentResize();

          // set the property
          this.m_isMaximized = false;
        }

        // translate the element
        target.style.webkitTransform =
          target.style.transform =
          "translate(" + x + "px, " + y + "px)";

        // update the posiion attributes
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);

        // fire the onMove event
        myself._callEventCallback(myself.m_onMove, {
          newPosX: myself._getWindowWrapper().position().left,
          newPosY: myself._getWindowWrapper().position().top
        });
      },
      onstart: function(event) {
        // fire the onMoveStart event
        myself._callEventCallback(myself.m_onMoveStart, {
          newPosX: myself._getWindowWrapper().position().left,
          newPosY: myself._getWindowWrapper().position().top
        });
      },
      onend: function(event) {
        var left = myself._getWindowWrapper().position().left;
        var top = myself._getWindowWrapper().position().top;
        // update the x and y values
        myself.m_posXCss = left + "px";
        myself.m_posYCss = top + "px";
        // fire the onMoveEnd event
        myself._callEventCallback(myself.m_onMoveEnd, {
          newPosX: left,
          newPosY: top
        });
      }
    });
};

sap.firefly.XtBaseWindow.prototype._addFileDropHandling = function() {
  var myself = this;
  var windowWraper = this._getWindowWrapper();
  if (windowWraper) {
    // first remove the old events if still there
    windowWraper.off("dragover");
    windowWraper.off("dragenter");
    windowWraper.off("dragleave");
    windowWraper.off("drop");
    // attach the new events
    windowWraper.on("dragover", function(event) {
      if (myself.m_onFileDrop) {
        event.preventDefault();
        event.stopPropagation();
        windowWraper.addClass("drop-zone");
      }
    });
    windowWraper.on("dragenter", function(event) {
      if (myself.m_onFileDrop) {
        event.preventDefault();
      }
    });
    windowWraper.on("dragleave", function(event) {
      if (myself.m_onFileDrop) {
        event.preventDefault();
        windowWraper.removeClass("drop-zone");
      }
    });
    windowWraper.on('drop', function(event) {
      if (myself.m_onFileDrop) {
        event.preventDefault();
        event.stopPropagation();
        windowWraper.removeClass("drop-zone");
        // handle the drop files
        var origEvent = event.originalEvent; // retrieve the original event from the jquery event
        var files = origEvent.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var reader = new FileReader();
          reader.onload = function(event) {
            // fire the onFileDrop event
            myself._callEventCallback(myself.m_onFileDrop, {
              fileName: file.name,
              fileType: file.type,
              fileContent: event.target.result,
              fileSize: file.size,
              fileLastModified: file.lastModified
            });
          };
          reader.readAsText(file);
        }
      }
    });
  }
};

sap.firefly.XtBaseWindow.prototype._bringWindowToFront = function() {
  //remove focus from all other windows if they still have it
  $(".focused").removeClass("focused");

  //focus the new window per default
  this.m_windowWrapper.addClass("focused");

  // enable (if any) the event listeners which are on the window
  this.m_windowWrapper.trigger("focus");

  // set the window next maximum z index
  var maxZIndex = sap.firefly.XtWindowManager.manager().getNextWindowZIndex();
  this.m_windowWrapper.css("z-index", maxZIndex);
};

sap.firefly.XtBaseWindow.prototype._addFocusLogic = function() {
  var myself = this;

  // make sure there is only one listener
  this.m_windowWrapper.off("mousedown");

  // when clicked inside the window then focus it
  this.m_windowWrapper.on("mousedown", function() {
    if (myself.m_windowWrapper.hasClass("focused") == false) {
      myself.m_windowWrapper.addClass("focused");
      var maxZIndex = sap.firefly.XtWindowManager.manager().getNextWindowZIndex();
      myself.m_windowWrapper.css("z-index", maxZIndex);
    }
  });
};

sap.firefly.XtBaseWindow.prototype._addTitleBarButtonsLogic = function() {
  var myself = this;

  // button close on click
  this.m_windowWrapper.find("button.close").on("click", function() {
    // call the method on the UxWindow to close for proper cleanup
    if (!myself._callEventCallback(myself.m_onClosePress)) {
      myself.close();
    }
  });

  // button hide on click
  this.m_windowWrapper.find("button.hide").on("click", function() {
    if (!myself._callEventCallback(myself.m_onHidePress)) {
      // do not hide the window without a listener since then the user cannot bring it back...
      //  myself._handleHideWindow(true, null);
    }
  });

  // button maximize/restore on click
  this.m_windowWrapper.find("button.maximize").on("click", function() {
    if (!myself._callEventCallback(myself.m_onMaximizePress)) {
      myself._toggleMaximizeRestore();
    }
  });

  // double click on status bar for maximize/restore
  this.m_windowWrapper.find(".title-bar").on("dblclick", function(event) {
    var targetEle = $(event.target);
    // only if title-bar-buttons and menu title-bar-menu was not double clicked
    if (targetEle.parents(".title-bar-buttons").length === 0 && targetEle.parents(".title-bar-menu").length === 0) {
      myself._toggleMaximizeRestore();
    }
  });
};

// ======================================
// == INTERNAL HELPER METHODS
// ======================================

sap.firefly.XtBaseWindow.prototype._getWindowWrapper = function() {
  if (this.m_windowWrapper) {
    return this.m_windowWrapper;
  }
  return $();
};

sap.firefly.XtBaseWindow.prototype._handleMaximizeWindow = function(animated) {
  if (this.isMaximized() === false && this.m_windowWrapper) {
    //adjust the window to use the maximum available space
    this._useAllAvailableSpace(animated, true);

    // add the maximized class and attribute
    this._addMaximizedInfo();

    //observer document resize
    this._observeDocumentResize();

    // set the property
    this.m_isMaximized = true;
  }
};

sap.firefly.XtBaseWindow.prototype._useAllAvailableSpace = function(animated, saveOrginalSize) {
  var parentContainer = this.m_ffWindowContainer || $("body");
  var maxWidth = parentContainer.width();
  var maxHeight = parentContainer.height();
  var x = (parseFloat(this.m_windowWrapper.attr("data-x")) || 0);
  var y = (parseFloat(this.m_windowWrapper.attr("data-y")) || 0);
  var animTime = animated ? DEFAULT_ANIMATION_TIME : 0;

  // write the current width and height as attributes
  if (saveOrginalSize) {
    this._updateSizeAttributes();
  }

  // set and animate the maximize values
  this.m_windowWrapper.animate({
    width: maxWidth,
    height: maxHeight,
    left: -x,
    top: -y
  }, animTime);
};

sap.firefly.XtBaseWindow.prototype._handleRestoreWindow = function(animated) {
  if (this.isMaximized() && this.m_windowWrapper) {
    var origWidth = (parseFloat(this.m_windowWrapper.attr("data-width")) || 0);
    var origHeight = (parseFloat(this.m_windowWrapper.attr("data-height")) || 0);
    var animTime = animated ? DEFAULT_ANIMATION_TIME : 0;

    // set and animate the maximize values
    this.m_windowWrapper.animate({
      width: origWidth,
      height: origHeight,
      left: 0,
      top: 0
    }, animTime);

    // remove the maximized class and attribute
    this._removeMaximizedInfo();

    //unobserver document resize
    this._unobserveDocumentResize();

    // set the property
    this.m_isMaximized = false;
  }
};

sap.firefly.XtBaseWindow.prototype._clearMaximized = function() {
  // instantly exit the maximized  mode without animation
  this._handleRestoreWindow(false);
};

sap.firefly.XtBaseWindow.prototype._addMaximizedInfo = function() {
  //set the maximized attribute
  this.m_windowWrapper.attr("data-maximized", true);
  //add the maximized class on the control
  this.m_windowWrapper.addClass("maximized");
};

sap.firefly.XtBaseWindow.prototype._removeMaximizedInfo = function() {
  //remove the maximized attribute
  this.m_windowWrapper.attr("data-maximized", null);
  //remove the maximized class from the control
  this.m_windowWrapper.removeClass("maximized");
};

sap.firefly.XtBaseWindow.prototype._observeDocumentResize = function() {
  if (this.m_resizeObserver) {
    this.m_resizeObserver.observe(document.body);
  }
};

sap.firefly.XtBaseWindow.prototype._unobserveDocumentResize = function() {
  if (this.m_resizeObserver) {
    this.m_resizeObserver.unobserve(document.body);
  }
};

sap.firefly.XtBaseWindow.prototype._toggleMaximizeRestore = function() {
  if (this.isMaximized() == false) {
    this._handleMaximizeWindow(true);
  } else {
    this._handleRestoreWindow(true);
  }
};

sap.firefly.XtBaseWindow.prototype._handleHideWindow = function(animated, refControl) {
  // opacity is controlled by css animations, see firefly css -> .hidden

  if (this.isHidden() === false && this.m_windowWrapper) {
    var animTime = animated ? DEFAULT_ANIMATION_TIME : 0;

    if (refControl) {
      //animate to ref control
      var refDomJQueryDomElem = $(refControl.getDomRef());
      var refWidth = refDomJQueryDomElem.innerWidth();
      var refHeight = refDomJQueryDomElem.innerHeight();
      var refLeft = refDomJQueryDomElem.offset().left;
      var refTop = refDomJQueryDomElem.offset().top;
      var x = (parseFloat(this.m_windowWrapper.attr("data-x")) || 0);
      var y = (parseFloat(this.m_windowWrapper.attr("data-y")) || 0);

      // remove the maximized info, just in case when we were hiding from maximized state
      // this is just a workaround, implement the return to maximized state on show when it was maximized?
      if (this.isMaximized()) {
        this._removeMaximizedInfo();
      }

      this.m_windowWrapper.stop().animate({
        width: refWidth,
        height: refHeight,
        left: refLeft - x,
        top: refTop - y
      }, animTime);

    }

    this._addHiddenInfo();

    // set the property
    this.m_isHidden = true;
  }
};

sap.firefly.XtBaseWindow.prototype._handleShowWindow = function(animated, refControl) {
  // opacity is controlled by css animations, see firefly css -> .hidden

  if (this.isHidden() && this.m_windowWrapper) {
    var animTime = animated ? DEFAULT_ANIMATION_TIME : 0;

    var origWidth = (parseFloat(this.m_windowWrapper.attr("data-width")) || 0);
    var origHeight = (parseFloat(this.m_windowWrapper.attr("data-height")) || 0);

    // bring the window back to front and focus it
    this._bringWindowToFront();

    if (origWidth != 0 && origHeight != 0) {
      this.m_windowWrapper.stop().animate({
        width: origWidth,
        height: origHeight,
        left: 0,
        top: 0
      }, animTime, function() {
        // remove the css properties when animation finishes
        $(this).css("opacity", "");
        $(this).css("left", "");
        $(this).css("top", "");
      });
    }

    this._removeHiddenInfo();

    // set the property
    this.m_isHidden = false;
  }
};

sap.firefly.XtBaseWindow.prototype._addHiddenInfo = function() {
  //set the hidden attribute
  this.m_windowWrapper.attr("data-hidden", true);
  //add the hidden class on the control
  this.m_windowWrapper.addClass("hidden");
};

sap.firefly.XtBaseWindow.prototype._removeHiddenInfo = function() {
  //remove the hidden attribute
  this.m_windowWrapper.attr("data-hidden", null);
  //remove the hidden class from the control
  this.m_windowWrapper.removeClass("hidden");
};

sap.firefly.XtBaseWindow.prototype._updateSizeAttributes = function() {
  // get the current width and height of the window and write it as attributes to the element
  var curWidth = (parseFloat(this.m_windowWrapper.css("width")) || 0);
  var curHeight = (parseFloat(this.m_windowWrapper.css("height")) || 0);
  this.m_windowWrapper.attr("data-width", curWidth);
  this.m_windowWrapper.attr("data-height", curHeight);
};

sap.firefly.XtBaseWindow.prototype._calculateAbsolutePosX = function(xCssString) {
  var posXInt = 0;

  if (xCssString != null) {
    // if css value is in pixel then jsut convert to integer
    if (xCssString.indexOf("px") != -1) {
      posXInt = parseInt((xCssString || 0)); // make sure it is an integer
    } else {
      // otherwise let css calculate the relative value to a absolute one (pixel)
      this.m_windowWrapper.css("left", xCssString);
      var calculatedPosX = (parseFloat(this.m_windowWrapper.css("left")) || 0);
      this.m_windowWrapper.css("left", "");
      posXInt = calculatedPosX;
    }
  }

  return posXInt;
};

sap.firefly.XtBaseWindow.prototype._calculateAbsolutePosY = function(yCssString) {
  var posYInt = 0;

  if (yCssString != null) {
    // if css value is in pixel then jsut convert to integer
    if (yCssString.indexOf("px") != -1) {
      posYInt = parseInt((yCssString || 0)); // make sure it is an integer
    } else {
      // otherwise let css calculate the relative value to a absolute one (pixel)
      this.m_windowWrapper.css("top", yCssString);
      var calculatedPosY = (parseFloat(this.m_windowWrapper.css("top")) || 0);
      this.m_windowWrapper.css("top", "");
      posYInt = calculatedPosY;
    }
  }

  return posYInt;
};

sap.firefly.XtBaseWindow.prototype._callEventCallback = function(callback, params) {
  if (callback && typeof callback === "function") {
    if (!params) {
      params = {};
    }
    params.control = this;
    callback(params);
    return true;
  }
  return false;
};

sap.firefly.XtBaseWindow.prototype._isFocused = function() {
  return this._getWindowWrapper().hasClass("focused");
};

sap.firefly.XtBaseWindow.prototype._isFrontMostWindow = function() {
  var winZIndex = parseInt(this.m_windowWrapper.css("z-index"));
  var frontMostZIndex = sap.firefly.XtWindowManager.manager().getFrontMostZIndex();
  if (winZIndex === frontMostZIndex) {
    return true;
  }

  return false;
};

sap.firefly.XtWindow = function() {
   sap.firefly.XtBaseWindow.call(this);

  // properties
  this.m_content = null; // expects a sapui5 element
  this.m_backgroundColorCss = null;
  // internal stuff
  this.m_contentContainer = null; // container for the content, (BorderLayout)
};

sap.firefly.XtWindow.prototype = new sap.firefly.XtBaseWindow();

// ======================================
// == STATIC STUFF
// ======================================

sap.firefly.XtWindow.newWindowWithId = function(windowId, windowContainer) {
   var newWindow = new sap.firefly.XtWindow();
  newWindow.initWithWindowId(windowId, windowContainer);
  return newWindow;
};

// ======================================
// == SETUP
// ======================================

sap.firefly.XtWindow.prototype.initWithWindowId = function(windowId, windowContainer) {
  return sap.firefly.XtBaseWindow.prototype.initWithWindowId.call(this, windowId, windowContainer);
};

sap.firefly.XtWindow.prototype._setupWindow = function() {
  sap.firefly.XtBaseWindow.prototype._setupWindow.call(this);
  // properties
  this.m_content = null;
  this.m_backgroundColorCss = null;
  // internal stuff
  this.m_contentContainer = null;
};

sap.firefly.XtWindow.prototype._getWindowType = function() {
  return "Window";
};

// ======================================
// == CLEANUP
// ======================================

sap.firefly.XtWindow.prototype.releaseWindow = function() {
  sap.firefly.XtBaseWindow.prototype.releaseWindow.call(this);
}

// ======================================
// == INTERNAL LIFECYCLE
// ======================================

sap.firefly.XtWindow.prototype._createWindowWrapper = function() {
  var didCreate = sap.firefly.XtBaseWindow.prototype._createWindowWrapper.call(this);

  if (didCreate) {
    // add window specific content container
    this._getWindowWrapper().append("<div class='window-content'></div>");
  }

  return didCreate;
};

sap.firefly.XtWindow.prototype._configureWindowWrapper = function() {
  sap.firefly.XtBaseWindow.prototype._configureWindowWrapper.call(this);

  // preapre the window content
  this._prepareWindowContent();
};

sap.firefly.XtWindow.prototype._beforeOpen = function() {
  sap.firefly.XtBaseWindow.prototype._beforeOpen.call(this);
};

sap.firefly.XtWindow.prototype._afterOpen = function() {
  sap.firefly.XtBaseWindow.prototype._afterOpen.call(this);
};

sap.firefly.XtWindow.prototype._beforeClose = function() {
  sap.firefly.XtBaseWindow.prototype._beforeClose.call(this);
};

sap.firefly.XtWindow.prototype._afterClose = function() {
  sap.firefly.XtBaseWindow.prototype._afterClose.call(this);
};

sap.firefly.XtWindow.prototype._applyInitalWindowProperties = function() {
  sap.firefly.XtBaseWindow.prototype._applyInitalWindowProperties.call(this);

  //apply background color
  if (this.m_backgroundColorCss) {
    this.setBackgroundColor(this.m_backgroundColorCss);
  }
};

// ======================================
// == PUBLIC METHODS
// ======================================

sap.firefly.XtWindow.prototype.setBackgroundColor = function(newColorCss) {
  this.m_backgroundColorCss = newColorCss;
  if (this._getWindowWrapper()) {
    this._getWindowWrapper().find(".window-content").css({
      "background-color": newColorCss ? newColorCss : "" // to remove we need to pass empty string
    });
  }
};

sap.firefly.XtWindow.prototype.setBackgroundColor = function() {
  return this.m_backgroundColorCss;
};

sap.firefly.XtWindow.prototype.setContent = function(content) {
  this.m_content = content;
  if (this.m_contentContainer) {
    if (content) {
      this.m_contentContainer.addContent(content);
    } else {
      this.m_contentContainer.removeAllContent(); // if content is null then remove the content
    }
  }
};

sap.firefly.XtWindow.prototype.getContent = function() {
  return his.m_content;
};

sap.firefly.XtWindow.prototype.clearContent = function() {
  this.m_content = null;
  if (this.m_contentContainer) {
    this.m_contentContainer.removeAllContent();
  }
};

sap.firefly.XtWindow.prototype.destroy = function() {
  if (this.m_contentContainer != null) {
    this.m_contentContainer.removeAllContent();
    this.m_contentContainer.destroy();
    this.m_contentContainer = null;
  }

  sap.firefly.XtBaseWindow.prototype.destroy.call(this);
};

// ======================================
// == EVENTS
// ======================================


// ======================================
// == PRIVATE WINDOW SETUP METHODS
// ======================================

sap.firefly.XtWindow.prototype._prepareWindowContent = function() {
  if (!this.m_contentContainer) {
    this.m_contentContainer = new sap.firefly.XtUi5ContentWrapper(this.getWindowId() + "_content", {
      width: "100%",
      height: "100%"
    });
  }

  var domEleWindowContent = this._getWindowWrapper().find(".window-content")[0];
  this.m_contentContainer.placeAt(domEleWindowContent);

  // if previously content was set the apply it to the window_wrapper
  if (this.m_content) {
    this.setContent(this.m_content);
  }
};

// ======================================
// == INTERNAL HELPER METHODS
// ======================================

sap.firefly.XtTerminal = function() {
   sap.firefly.XtBaseWindow.call(this);

  // properties
  this.m_path = null;
  this.m_prompt = null;
  this.m_commandHistory = null;
  this.m_textColorCss = null;
  this.m_isBusy = null;
  this.m_backgroundColorCss = null;
  // events
  this.m_onExecute = null;
  this.m_onTerminate = null;
  this.m_readLineCallback = null;
  // internal stuff
  this.m_historyIndex = null;
  this.m_localCommands = null;
  this.m_isReadLineMode = null;
  this.m_readLineCharNum = null;
};

sap.firefly.XtTerminal.prototype = new sap.firefly.XtBaseWindow();

// ======================================
// == STATIC STUFF
// ======================================

sap.firefly.XtTerminal.newTerminalWithId = function(windowId, windowContainer) {
   var newWindow = new sap.firefly.XtTerminal();
  newWindow.initWithWindowId(windowId, windowContainer);
  return newWindow;
};

// ======================================
// == SETUP
// ======================================

sap.firefly.XtTerminal.prototype.initWithWindowId = function(windowId, windowContainer) {
  return sap.firefly.XtBaseWindow.prototype.initWithWindowId.call(this, windowId, windowContainer);
};

sap.firefly.XtTerminal.prototype._setupWindow = function() {
  sap.firefly.XtBaseWindow.prototype._setupWindow.call(this);
  // properties
  this.m_path = "~";
  this.m_prompt = "➜";
  this.m_commandHistory = [];
  this.m_isBusy = false;
  this.m_textColorCss = null;
  this.m_backgroundColorCss = null;
  // events
  this.m_onExecute = null;
  this.m_onTerminate = null;
  this.m_readLineCallback = null;
  // internal stuff
  this.m_historyIndex = 0;
  this.m_localCommands = [];
  this.m_isReadLineMode = false;
  this.m_readLineCharNum = 0;
};

sap.firefly.XtTerminal.prototype._getWindowType = function() {
  return "Terminal";
};

// ======================================
// == CLEANUP
// ======================================

sap.firefly.XtTerminal.prototype.releaseWindow = function() {
  sap.firefly.XtBaseWindow.prototype.releaseWindow.call(this);
}

// ======================================
// == INTERNAL LIFECYCLE
// ======================================

sap.firefly.XtTerminal.prototype._createWindowWrapper = function() {
  var didCreate = sap.firefly.XtBaseWindow.prototype._createWindowWrapper.call(this);

  if (didCreate) {
    // add terminal specific terminal container
    this._getWindowWrapper().append("<div class='terminal'></div>");
  }

  return didCreate;
};

sap.firefly.XtTerminal.prototype._configureWindowWrapper = function() {
  sap.firefly.XtBaseWindow.prototype._configureWindowWrapper.call(this);

  // preapre the window terminal content
  this._prepareTerminalContent();

  // busy needs to be applied after the terminal content is prepared
  if (this.isBusy) {
    this.setBusy(this.m_isBusy);
  }
};

sap.firefly.XtTerminal.prototype._beforeOpen = function() {
  sap.firefly.XtBaseWindow.prototype._beforeOpen.call(this);
};

sap.firefly.XtTerminal.prototype._afterOpen = function() {
  sap.firefly.XtBaseWindow.prototype._afterOpen.call(this);
};

sap.firefly.XtTerminal.prototype._beforeClose = function() {
  sap.firefly.XtBaseWindow.prototype._beforeClose.call(this);

  // unregister the jquery events
  this._getWindowWrapper().off("keypress");
  this._getWindowWrapper().off("keydown");
  this._getWindowWrapper().off("paste");
};

sap.firefly.XtTerminal.prototype._afterClose = function() {
  sap.firefly.XtBaseWindow.prototype._afterClose.call(this);
};

sap.firefly.XtTerminal.prototype._applyInitalWindowProperties = function() {
  sap.firefly.XtBaseWindow.prototype._applyInitalWindowProperties.call(this);

  //apply background color
  if (this.m_backgroundColorCss) {
    this.setBackgroundColor(this.m_backgroundColorCss);
  }

  // if text color was specified then apply the text color
  if (this.m_textColorCss) {
    this.setTextColor(this.m_textColorCss);
  }

  // if a path was specified then use it
  if (this.m_path) {
    this.setPath(this.m_path);
  }

  // if a prompt was specified then use it
  if (this.m_prompt) {
    this.setPrompt(this.m_prompt);
  }
};

// ======================================
// == PUBLIC METHODS
// ======================================

sap.firefly.XtTerminal.prototype.print = function(text) {
  this._terminalPrint(text, false);
};

sap.firefly.XtTerminal.prototype.println = function(text) {
  this._terminalPrint(text, true);
};

sap.firefly.XtTerminal.prototype.getBackgroundColor = function() {
  return this.m_backgroundColorCss;
};

sap.firefly.XtTerminal.prototype.setBackgroundColor = function(newColorCss) {
  this.m_backgroundColorCss = newColorCss;
  this._getTerminalWrapper().css({
    "background-color": newColorCss ? newColorCss : "" // to remove we need to pass empty string
  });
};

sap.firefly.XtTerminal.prototype.getTextColor = function() {
  return this.m_textColorCss;
};

sap.firefly.XtTerminal.prototype.setTextColor = function(newColorCss) {
  this.m_textColorCss = newColorCss;
  this._setActiveCommandWrapperColor(newColorCss);
};

sap.firefly.XtTerminal.prototype.getPath = function() {
  return this.m_path;
};

sap.firefly.XtTerminal.prototype.setPath = function(newPath) {
  this.m_path = newPath;
  this._setActiveCommandWrapperPath(newPath);
};

sap.firefly.XtTerminal.prototype.getPrompt = function() {
  return this.m_prompt;
};

sap.firefly.XtTerminal.prototype.setPrompt = function(newPrompt) {
  this.m_prompt = newPrompt;
  this._setActiveCommandWrapperPrompt(newPrompt);
};

sap.firefly.XtTerminal.prototype.isBusy = function() {
  return this.m_isBusy;
};

sap.firefly.XtTerminal.prototype.setBusy = function(busy) {
  this.m_isBusy = busy;
  this._setActiveCommandWrapperBusy(busy);
};

sap.firefly.XtTerminal.prototype.addCommandHistoryEntry = function(command) {
  var oldCmdHistSize = this.m_commandHistory.length;
  if (oldCmdHistSize > 0) {
    // if last entry is the same as the command which we try to add then do nothing
    var lastEntry = this.m_commandHistory[oldCmdHistSize - 1];
    if (lastEntry === command) {
      return;
    }
  }
  this.m_commandHistory.push(command);
  this.m_historyIndex = this.m_commandHistory.length;
};

sap.firefly.XtTerminal.prototype.setCommandHistoryEntries = function(commandArray) {
  this.clearCommandHistory();
  if (commandArray !== null && commandArray !== undefined && commandArray.length > 0) {
    this.m_commandHistory = commandArray.slice();
  }
  this.m_historyIndex = this.m_commandHistory.length;
};

sap.firefly.XtTerminal.prototype.getCommandHistory = function() {
  return this.m_commandHistory;
};

sap.firefly.XtTerminal.prototype.clearCommandHistory = function() {
  this.m_commandHistory = [];
  this.m_historyIndex = 0;
};

sap.firefly.XtTerminal.prototype.readLine = function(text, numOfChars, callback) {
  // only start read line mode if window is open
  if (this.isOpen() === false) {
    return;
  }
  if (text && text.length > 0) {
    this.println(text);
  }
  this.m_readLineCharNum = parseInt(numOfChars);
  this.m_readLineCharNum = this.m_readLineCharNum ? this.m_readLineCharNum : 0;
  if (callback && typeof callback === 'function') {
    this.m_readLineCallback = callback;
  } else {
    this.m_readLineCallback = null;
  }
  this.m_isReadLineMode = true;
  this._setActiveCommandWrapperReadLineMode(true);
};

sap.firefly.XtTerminal.prototype.isReadLineMode = function() {
  return this.m_isReadLineMode;
};

sap.firefly.XtTerminal.prototype.exitReadLineMode = function() {
  this.m_isReadLineMode = false;
  this._setActiveCommandWrapperReadLineMode(false);
};

sap.firefly.XtTerminal.prototype.enableCaptureMode = function(callback) {
  var myself = this;
  var readLineModeCallback = function(lineStr) {
    if (callback) {
      callback(lineStr);
    }
    if (readLineModeCallback) {
      myself.readLine(null, 0, readLineModeCallback);
    }
  }

  this.readLine(null, 0, readLineModeCallback);
};

sap.firefly.XtTerminal.prototype.disableCaptureMode = function() {
  this.exitReadLineMode();
};

sap.firefly.XtTerminal.prototype.addNewLocalCommand = function(cmdName, fn) {
  if (cmdName && fn) {
    if (this.m_localCommands == null || this.m_localCommands == undefined) {
      this.m_localCommands = [];
    }
    var newCmd = {
      "name": cmdName,
      "function": fn
    }
    this.m_localCommands.push(newCmd);
  }
};

sap.firefly.XtTerminal.prototype.destroy = function() {
  this._getWindowWrapper().off("keypress");
  this._getWindowWrapper().off("keydown");
  this._getWindowWrapper().off("paste");

  sap.firefly.XtBaseWindow.prototype.destroy.call(this);
};

// ======================================
// == EVENTS
// ======================================

sap.firefly.XtTerminal.prototype.attachOnExecute = function(callback) {
  this.m_onExecute = callback;
}

sap.firefly.XtTerminal.prototype.attachOnTerminate = function(callback) {
  this.m_onTerminate = callback;
}

// ======================================
// == PRIVATE WINDOW SETUP METHODS
// ======================================

sap.firefly.XtTerminal.prototype._prepareTerminalContent = function() {
  // add some local commands
  this.addNewLocalCommand("localcmds", localcmds);
  this.addNewLocalCommand("clear", clear);
  this.addNewLocalCommand("echo", echo);
  this.addNewLocalCommand("date", date);
  this.addNewLocalCommand("background", setBackgroundColor);
  this.addNewLocalCommand("reverse", reverse);
  this.addNewLocalCommand("cowsay", cowsay);
  this.addNewLocalCommand("typewriter", typewriter);
  this.addNewLocalCommand("hitanykey", hitanykey);
  this.addNewLocalCommand("calcadd", calcadd);
  this.addNewLocalCommand("about", about);

  // do the setup
  var myself = this;
  var terminalEle = this._getTerminalWrapper();

  var command = "";

  // get last input command wrapper
  function getActiveCommandInput() {
    return terminalEle.find(".command-wrapper.active");
  }

  // frontend commands
  function localcmds() {
    if (myself.m_localCommands) {
      myself.println("This is a list of local commands:");
      for (var i = 0; i < myself.m_localCommands.length; i++) {
        var cmdName = myself.m_localCommands[i].name;
        myself.println("- " + cmdName);
      }
    } else {
      myself.println("Sorry... There are no local commands!");
    }
  }

  function clear() {
    terminalEle.text("");
    displayPrompt();
  }

  function date() {
    var date = new Date().toString();
    date = date.substr(0, date.indexOf("GMT") - 1);
    myself.println(date);
  }

  function echo(args) {
    var str = args.join(" ");
    myself.println(str);
  }

  function setBackgroundColor(args) {
    var newBgColor = args[0];
    myself.setBackgroundColor(newBgColor);
  }

  function reverse(args) {
    var str = args.join(" ");
    str = str.split("").reverse().join(""); // reverse the string;
    myself.println(str);
  }

  function cowsay(args) {
    var str = args.join(" ");

    if (!str || str.length === 0) {
      str = "Moo!";
    }

    myself.println(" ___" + Array(str.length).join("_"));
    myself.println("< " + str + " >");
    myself.println(" ---" + Array(str.length).join("-"));
    myself.println("        \\   ^__^                  ");
    myself.println("         \\  (oo)\\_______         ");
    myself.println("            (__)\\       )\\/\\    ");
    myself.println("                ||----w |          ");
    myself.println("                ||     ||          ");
    myself.println("                                   ");
  }

  function typewriter(args) {
    var time = 100;
    var str = args.join(" ");
    if (args.length > 1) {
      var first = args[0];
      if (parseInt(first)) {
        time = parseInt(first);
        str = args.slice(1).join(" ");
      }
    }
    typeWriterEffect(str, time);
  }

  function hitanykey() {
    myself.println("         _                                                   ");
    myself.println("        | |                                                  ");
    myself.println("        | |===( )   //////                                   ");
    myself.println("        |_|   |||  | o o|                                    ");
    myself.println("               ||| ( c  )                  ____              ");
    myself.println("                ||| \\= /                  ||   \\_          ");
    myself.println("                 ||||||                   ||     |           ");
    myself.println("                 ||||||                ...||__/|-\"          ");
    myself.println("                 ||||||             __|________|__           ");
    myself.println("                   |||             |______________|          ");
    myself.println("                   |||             || ||      || ||          ");
    myself.println("                   |||             || ||      || ||          ");
    myself.println("   ----------------|||-------------||-||------||-||-------   ");
    myself.println("                   |__>            || ||      || ||          ");
    myself.println("                                                             ");
    myself.println("Hit any key to continue                                      ");
    myself.println("                                                             ");

    var readLinetxt = "Well... You need to type 'hit' to continue";

    var readLineCallback = function(lineStr) {
      if (lineStr === "hit") {
        myself.println("          _ ._  _ , _ ._              ");
        myself.println("        (_ ' ( `  )_  .__)            ");
        myself.println("      ( (  (    )   `)  ) _)          ");
        myself.println("     (__ (_   (_ . _) _) ,__)         ");
        myself.println("         `~~`\\ ' . /`~~`             ");
        myself.println("              ;   ;                   ");
        myself.println("              /   \\                  ");
        myself.println("_____________/_ __ \\_____________    ");
        myself.println("                                      ");
        myself.println("You hit it! Exiting...");
      } else {
        myself.readLine(readLinetxt, 3, readLineCallback);
      }
    }
    myself.readLine(readLinetxt, 3, readLineCallback);
  }

  function calcadd() {
    var firstNum = null;
    var secondNum = null;
    var readLineCallback = function(lineStr) {
      if (firstNum === null) {
        if (parseFloat(lineStr)) {
          firstNum = parseFloat(lineStr);
          myself.readLine("Please enter second number:", 0, readLineCallback);
        } else {
          myself.readLine("Not a number. Please enter first number again:", 0, readLineCallback);
        }
      } else if (secondNum === null) {
        if (parseFloat(lineStr)) {
          secondNum = parseFloat(lineStr);
          myself.println("Result: " + (firstNum + secondNum));
        } else {
          myself.readLine("Not a number. Please enter second number again:", 0, readLineCallback);
        }
      }
    }

    myself.readLine("Please enter first number:", 0, readLineCallback);
  }

  function about() {
    myself.setTextColor("#D6ED17");
    myself.println("  _____ _           __ _          _                      _             _       ");
    myself.println(" |  ___(_)_ __ ___ / _| |_   _   | |_ ___ _ __ _ __ ___ (_)_ __   __ _| |      ");
    myself.println(" | |_  | | '__/ _ \\ |_| | | | |  | __/ _ \\ '__| '_ ` _ \\| | '_ \\ / _` | |  ");
    myself.println(" |  _| | | | |  __/  _| | |_| |  | ||  __/ |  | | | | | | | | | | (_| | |      ");
    myself.println(" |_|   |_|_|  \\___|_| |_|\\__, |   \\__\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_| ");
    myself.println("                         |___/                                                 ");
    myself.setTextColor(null);
    myself.println("version 0.7", true);
    //  myself.println("Proudly brought to you by Firefly");
    typeWriterEffect("Proudly brought to you by Firefly :)", 100);
  }

  function typeWriterEffect(textToType, speed, index) {
    myself.setBusy(true);
    if (index === undefined) {
      myself.print(textToType.charAt(0));
      typeWriterEffect(textToType, speed, 1);
    } else if (index < textToType.length) {
      setTimeout(function() {
        myself.print(textToType.charAt(index));
        typeWriterEffect(textToType, speed, index + 1);
      }, speed);
    } else {
      myself.setBusy(false);
    }
  }

  // command proccesing
  function processCommand() {
    var isValidLocalCmd = false;

    // if read line mode is enabled then handle it
    if (myself.isReadLineMode()) {
      processReadLine(command);
      return;
    }

    // dispay a new prompt
    displayPrompt();
    myself._scrollToTerminalBottom();

    // reset command history index
    myself.m_historyIndex = myself.m_commandHistory.length;

    if (!command || command.length === 0) {
      //nothing to do
      return;
    }

    // Create args list by splitting the command
    // by space characters and then shift off the
    // actual command.
    var args = command.split(" ");
    var cmd = args[0];
    args.shift();

    // Iterate through the available commands to find a match.
    // Then call that command and pass in any arguments.
    for (var i = 0; i < myself.m_localCommands.length; i++) {
      if (cmd === myself.m_localCommands[i].name) {
        myself.m_localCommands[i].function(args);
        isValidLocalCmd = true;
        break;
      }
    }

    // Add to command history and clean up.
    myself.addCommandHistoryEntry(command);

    // No match was found...
    if (!isValidLocalCmd && (myself.m_onExecute === null || typeof myself.m_onExecute !== "function")) {
      myself.println("ffsh: command not found: " + command);
    }

    // send the on enter event
    if (!isValidLocalCmd) {
      myself._callEventCallback(myself.m_onExecute, {
        command: command
      });
    }

    // reset the command
    command = "";
  }

  function processReadLine(lineStr) {
    // check if we actaully are in read line mode first
    if (myself.isReadLineMode()) {
      myself.m_isReadLineMode = false;
      command = "";
      displayPrompt();
      myself._scrollToTerminalBottom();
      if (myself.m_readLineCallback) {
        myself.m_readLineCallback(lineStr);
      }
    }
  }

  // the display the temrinal prompt
  function displayPrompt() {
    // first do some cleanup if necessary
    var prevCommandInput = getActiveCommandInput();
    if (prevCommandInput) {
      prevCommandInput.removeClass("active"); // remove active class
      prevCommandInput.find(".cursor").removeClass("cursor"); // remove the cursor class
      prevCommandInput.children().last().remove(); // remove last empty element
    }

    // then add a new one
    var activeCommandInput = $("<div class='command-wrapper active'></div>").appendTo(terminalEle);
    activeCommandInput.append("<span class='path'>" + myself.getPath() + "</span>");
    activeCommandInput.append("<span class='prompt'>" + myself.getPrompt() + "</span>");
    appendCursorIfNeeded();

    // apply text color
    myself._setActiveCommandWrapperColor(myself.getTextColor());
  }

  // append the cursor element at the end of the active command input
  function appendCursorIfNeeded() {
    var activeCommandInput = getActiveCommandInput();
    if (activeCommandInput.last().hasClass("cursor") === false) {
      activeCommandInput.append("<span class='cursor'>&nbsp;</span>");
    }
  }

  function getCursor() {
    var activeCommandInput = getActiveCommandInput();
    return activeCommandInput.find(".cursor");
  }

  function retriggerCursorAnimation() {
    var cursorEle = getCursor();
    // restart the css animation
    cursorEle.removeClass("cursor");
    void cursorEle.offset(); // trigger refolow
    cursorEle.addClass("cursor");
  }

  // Delete a characters before the cursor
  function eraseChar() {
    var cursorEle = getCursor();
    var cursorIndex = cursorEle.index();

    if (cursorIndex > 2) { // we do not want to remove the prompt and path spans ;)
      var prevElem = cursorEle.prev();
      prevElem.remove();
      retriggerCursorAnimation(); // restart the css animation
      var textIndex = cursorIndex - 2;
      command = command.substring(0, textIndex - 1) + command.substring(textIndex);
    }
  }

  // clear the current command
  function clearCommand() {
    // remove all elements after the prompt span and append the cursor element
    var activeCommandInput = getActiveCommandInput();
    var promptIndex = activeCommandInput.find(".prompt").index();
    if (promptIndex != -1) {
      activeCommandInput.children().slice(promptIndex + 1).remove(); // old one
      appendCursorIfNeeded();
      command = "";
    }
  }

  // append a single character at the cursor location
  function appendChar(str) {
    if (str && str.length > 1) {
      appendCommand(str);
      return;
    }

    var cursorEle = getCursor();
    var textIndex = cursorEle.index() - 2; // save index for the text, = index of the cursor - 2 because do not count the path and prompt elements
    cursorEle.before("<span>" + str + "</span>");
    retriggerCursorAnimation(); // restart the css animation

    command = command.substring(0, textIndex) + str + command.substring(textIndex);
    myself._scrollToTerminalBottom();
  }

  // append a command at the cursor location
  function appendCommand(str) {
    for (var i = 0; i < str.length; i++) {
      var char = str.charAt(i);
      appendChar(char);
    }
  }

  function handleUpDownKeyPress(keyCode) {
    // Move up or down the history
    if (keyCode === 38) {
      // UP
      myself.m_historyIndex--;
      if (myself.m_historyIndex < 0) {
        myself.m_historyIndex++;
      }
    } else if (keyCode === 40) {
      // DOWN
      myself.m_historyIndex++;
      if (myself.m_historyIndex > myself.m_commandHistory.length - 1) {
        myself.m_historyIndex--;
      }
    }

    // Get command
    var cmd = myself.m_commandHistory[myself.m_historyIndex];
    if (cmd !== undefined) {
      clearCommand();
      appendCommand(cmd);
    }
  }

  function handleLeftRightKeyPress(keyCode) {
    // Move the cursor left and right
    if (keyCode === 37) {
      // LEFT
      var cursorEle = getCursor();
      var prevEle = cursorEle.prev();
      if (prevEle.hasClass("prompt") === false) {
        cursorEle.removeClass("cursor");
        prevEle.addClass("cursor");
      }
    } else if (keyCode === 39) {
      // RIGHT
      var cursorEle = getCursor();
      var nextEle = cursorEle.next();
      if (nextEle.length > 0) {
        cursorEle.removeClass("cursor");
        nextEle.addClass("cursor");
      }
    }
  }

  function handlePasteEvent(event) {
    //DataTransfer.getData() - way
    var clipboardData = event.clipboardData || event.originalEvent.clipboardData;
    if (clipboardData) {
      var clipboardText = clipboardData.getData("text/plain");
      if (clipboardText && clipboardText.length > 0) {
        appendCommand(clipboardText);
        myself._scrollToTerminalBottom();
      }
    }

    // clipboard api way, but requires user permission and uses promises
    //let text = navigator.clipboard.readText().then((text) => {
    //  console.log(text);
    //});
  }

  function handleCtrlQKeyPress(event) {
    console.log("Ctrl + Q pressed! Now we need to terminate...");
  }


  /*
    //	Keypress doesn't catch special keys,
    //	so we catch the backspace here and
    //	prevent it from navigating to the previous
    //	page.
    //  We also handle arrow keys for command history, and cursor movement.
    */

  // on key down event
  this._getWindowWrapper().on("keydown", function(e) {
    // check if user input is allowed
    if (myself._isUserInputAllowed() === false) {
      e.preventDefault();
      return;
    }

    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // CTRL + Q
    if (e.ctrlKey && keyCode == 81) {
      handleCtrlQKeyPress();
    }

    // BACKSPACE
    if (keyCode === 8 && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      if (command !== "") {
        eraseChar();
      }
    }

    // UP or DOWN, no history in read line mode
    if ((keyCode === 38 || keyCode === 40) && myself.isReadLineMode() === false) {
      handleUpDownKeyPress(keyCode);
    }

    // LEFT or RIGHT
    if (keyCode === 37 || keyCode === 39) {
      handleLeftRightKeyPress(keyCode);
    }
  });

  // on key press event
  this._getWindowWrapper().on("keypress", function(e) {
    // check if user input is allowed
    if (myself._isUserInputAllowed() === false) {
      e.preventDefault();
      return;
    }

    // Make sure we get the right event
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // ignore any key presses when the ctrl key is pressed
    if (e.ctrlKey) {
      return;
    }

    // Which key was pressed?
    switch (keyCode) {
      // ENTER
      case 13: {
        processCommand();
        break;
      }
      default: {
        appendChar(String.fromCharCode(keyCode));
      }
    }

    // check if read line mode is enabled and if need to handle it already, do nothin when enter pressed, this is handled in the processCommand methos
    if (myself.isReadLineMode() && myself.m_readLineCharNum > 0 && keyCode !== 13) {
      if (command.length >= myself.m_readLineCharNum) {
        processReadLine(command);
      }
    }
  });

  // paste in the terminal window
  this._getWindowWrapper().on("paste", function(e) {
    // check if user input is allowed
    if (myself._isUserInputAllowed() === false) {
      e.preventDefault();
      return;
    }

    handlePasteEvent(e);
  });


  // Get the date for fake last login
  //  var date = new Date().toString();
  //  date = date.substr(0, date.indexOf("GMT") - 1);

  // Display current date and time
  //  terminal.append("Current date & time: " + date + "\n");


  // display the prompt
  displayPrompt();
}

// ======================================
// == INTERNAL HELPER METHODS
// ======================================

sap.firefly.XtTerminal.prototype._terminalPrint = function(text, isNewLine) {
  var terminal = this._getTerminalWrapper();
  if (terminal && terminal.length > 0) {

    // backup and remove the last prompt
    var activeCommandInput = terminal.find(".command-wrapper.active");
    activeCommandInput.remove();

    // for print use span tags since they stay in the same line (inline)
    var printWrapperStr = "<span class='print-wrapper'>" + text + "</span>";

    // if println called then use the div tag since they are always in a new line
    if (isNewLine === true) {
      printWrapperStr = "<div class='print-wrapper'>" + text + "</div>";
    }
    // append the text in the console
    terminal.append(printWrapperStr);

    // apply text color to the new print
    var textColorCss = this.getTextColor();
    terminal.children(".print-wrapper").last().css({
      "color": textColorCss ? textColorCss : "" // to remove we need to pass empty string
    });

    // display the backed up prompt
    terminal.append(activeCommandInput);

    // auto scroll down
    this._scrollToTerminalBottom();
  }
}

sap.firefly.XtTerminal.prototype._getTerminalWrapper = function() {
  var windowWrapper = this._getWindowWrapper();
  if (windowWrapper) {
    return windowWrapper.find(".terminal");
  }
  return $();
}

sap.firefly.XtTerminal.prototype._setActiveCommandWrapperColor = function(newColorCss) {
  var terminalWrapper = this._getTerminalWrapper();
  if (terminalWrapper && terminalWrapper.length > 0) {
    terminalWrapper.find(".command-wrapper.active").css({
      "color": newColorCss ? newColorCss : "" // to remove we need to pass empty string
    });
  }
}

sap.firefly.XtTerminal.prototype._setActiveCommandWrapperPath = function(newPath) {
  var terminalWrapper = this._getTerminalWrapper();
  if (terminalWrapper && terminalWrapper.length > 0) {
    var pathEle = terminalWrapper.find(".command-wrapper.active .path");
    if (pathEle.length > 0) {
      pathEle.text(newPath);
    }
  }
}

sap.firefly.XtTerminal.prototype._setActiveCommandWrapperPrompt = function(newPrompt) {
  var terminalWrapper = this._getTerminalWrapper();
  if (terminalWrapper && terminalWrapper.length > 0) {
    var promptEle = terminalWrapper.find(".command-wrapper.active .prompt");
    if (promptEle.length > 0) {
      promptEle.text(newPrompt);
    }
  }
}

sap.firefly.XtTerminal.prototype._setActiveCommandWrapperBusy = function(busy) {
  var terminalWrapper = this._getTerminalWrapper();
  if (terminalWrapper && terminalWrapper.length > 0) {
    var activeCommandWrapper = terminalWrapper.find(".command-wrapper.active");
    if (activeCommandWrapper) {
      if (busy) {
        activeCommandWrapper.addClass("busy");
      } else {
        activeCommandWrapper.removeClass("busy");
      }
    }
  }
}

sap.firefly.XtTerminal.prototype._setActiveCommandWrapperReadLineMode = function(enabled) {
  var terminalWrapper = this._getTerminalWrapper();
  if (terminalWrapper && terminalWrapper.length > 0) {
    var activeCommandWrapper = terminalWrapper.find(".command-wrapper.active");
    if (activeCommandWrapper) {
      if (enabled) {
        activeCommandWrapper.addClass("readLine");
      } else {
        activeCommandWrapper.removeClass("readLine");
      }
    }
  }
}

sap.firefly.XtTerminal.prototype._isUserInputAllowed = function() {
  // if not focused then do nothing
  if (this._isFocused() === false) {
    return false;
  }

  // if terminal is busy then also do nothing
  if (this.isBusy()) {
    return false;
  }

  return true;
}

sap.firefly.XtTerminal.prototype._scrollToTerminalBottom = function() {
  var terminalWrapper = this._getTerminalWrapper();
  // auto scroll down
  if (terminalWrapper && terminalWrapper.length > 0) {
    terminalWrapper.stop(); // stop the previous animations
    terminalWrapper.animate({
      scrollTop: terminalWrapper.get(0).scrollHeight
    }, 200);
  }
}

sap.firefly.XtLaunchpadHelper = function() {
   this.m_curZIndex = 1;
};

// ======================================
// == STATIC STUFF
// ======================================

sap.firefly.XtLaunchpadHelper.activeHelperInstance = null;

sap.firefly.XtLaunchpadHelper.staticSetup = function() {
   if (sap.firefly.XtLaunchpadHelper.activeHelperInstance == null || sap.firefly.XtLaunchpadHelper.activeHelperInstance == undefined) {
    sap.firefly.XtLaunchpadHelper.activeHelperInstance = new sap.firefly.XtLaunchpadHelper();
    sap.firefly.XtLaunchpadHelper.activeHelperInstance.setup();
  }
};

sap.firefly.XtLaunchpadHelper.helper = function() {
   if (sap.firefly.XtLaunchpadHelper.activeHelperInstance == null || sap.firefly.XtLaunchpadHelper.activeHelperInstance == undefined) {
    sap.firefly.XtLaunchpadHelper.staticSetup();
  }
  return sap.firefly.XtLaunchpadHelper.activeHelperInstance;
};


// ======================================
// == SETUP
// ======================================

sap.firefly.XtLaunchpadHelper.prototype.setup = function() {
  //nothing here yet
};

// ======================================
// == HELPER METHODS
// ======================================

sap.firefly.XtLaunchpadHelper.prototype.getNextIconZIndex = function() {
  this.m_curZIndex = this.m_curZIndex + 1;
  return this.m_curZIndex;
};

// ======================================
// == INITIAL SETUP METHODS
// ======================================

// put initial setup stuff here

sap.ui.core.Control.extend("sap.firefly.XtUi5CustomVizGrid", {
  m_isResizing: false,
  m_resizingStartX: 0,
  m_initialAreaSize: 0,

  m_initialSplitterXPos: 0,
  m_initialSplitterYPos: 0,
  m_initialSplitterWidth: 0,
  m_initialSplitterHeight: 0,

  m_movingDiv: null,

  metadata: {
    properties: {
      "width": "string",
      "height": "string",
      "padding": "string",
      "leftHAlign": "string",
      "leftVAlign": "string",
      "rightHAlign": "string",
      "rightVAlign": "string",
      "splitterPosition": "string",
      "jsonModel": "any"
    }
  },

  setModelJson: function(model) {
    this.setJsonModel(model);
  },

  renderer: function(oRm, oControl) {
    var model = oControl.getJsonModel();

    if (model !== null && model !== undefined && model.getType() === sap.firefly.PrElementType.STRUCTURE) {
      var hAlign;
      var vAlign;

      var rowCount = model.getIntegerByKey("RowCount");
      var colCount = model.getIntegerByKey("ColCount");
      var cells = model.getListByKey("Cells");

      oRm.write("<div");
      oRm.writeControlData(oControl);
      oRm.addStyle("overflow", "auto");

      var width = oControl.getWidth();

      if (width !== undefined && width !== null) {
        var widthWithNoDigits = width.replace(/[0-9]/g, "");
        if (widthWithNoDigits === "px") {
          oRm.addStyle("width", width);
        }
      }

      var height = oControl.getHeight();

      if (height !== undefined && height !== null) {
        var heightWithNoDigits = height.replace(/[0-9]/g, "");
        if (heightWithNoDigits === "px") {
          oRm.addStyle("height", height);
        }
      }

      var padding = oControl.getPadding();

      if (padding !== undefined && padding !== null)
        oRm.addStyle("padding", padding);

      oRm.writeStyles();
      oRm.write(">");

      oRm.write("<table");
      oRm.writeControlData(oControl);

      var width = oControl.getWidth();
      oRm.addStyle("border", "1px solid black");
      oRm.addStyle("border-collapse", "collapse");

      oRm.writeStyles();
      oRm.write(">");

      /*
       * oRm.write( "<style scoped>" ); oRm.write( "table, th, td
       * {border: 1px solid black;}" ); oRm.write( "</style>" );
       */

      var pos = 0;

      for (var y = 0; y < rowCount; y++) {
        oRm.write("<tr>");

        for (var x = 0; x < colCount; x++) {
          var cellDef = cells.getStructureAt(pos);
          pos++;

          var type = cellDef.getStringByKey("Type");
          var semantic = cellDef.getStringByKey("Semantic");
          var isTotals = cellDef.getBooleanByKeyExt("Totals", false);

          oRm.write("<td");
          oRm.addStyle("border", "1px solid black");

          var color = null;

          if (semantic != null) {
            if (semantic == "Header") {
              color = "Gainsboro";
            } else if (semantic == "Title") {
              color = "DarkTurquoise";
            }
          }

          if (isTotals === true) {
            color = "Gold";
          }

          var defColor = cellDef.getStringByKey("Color");

          if (defColor != null) {
            color = defColor;
          }

          if (color != null) {
            oRm.addStyle("background-color", color);
          }

          oRm.writeStyles();

          var halign = cellDef.getStringByKey("HAlign");
          if (halign != null) {
            if (halign == "Begin")
              oRm.write(" align=\"left\"");
            else if (halign == "Center")
              oRm.write(" align=\"center\"");
            else if (halign == "End")
              oRm.write(" align=\"right\"");
          }

          if (type == "Text") {
            oRm.write(">");

            var indent = cellDef.getIntegerByKeyExt("Indent", 0);

            if (indent > 0) {
              for (var t = 0; t < indent; t++) {
                oRm.write("&nbsp;");
              }
            }

            var value = cellDef.getStringByKey("Value");
            oRm.write(value);
            oRm.write("</td>");
          } else {
            oRm.write("/>");
          }
        }

        oRm.write("</tr>");
      }

      oRm.write("</table>");

      oRm.write("</div>");
    }
  }
});

sap.ui.core.Control.extend("sap.firefly.XtUi5Launchpad", {
  metadata: {
    properties: {
      "width": "string",
      "height": "string",
      "headerHeight": "string",
      "footerHeight": "string",
      "backgroundImgSrc": "string",
      "backgroundColor": "string"
    },
    aggregations: {
      icons: {
        type: "sap.firefly.XtUi5AppIcon",
        singularName: "icon"
      },
      header: {
        type: "sap.ui.core.Control",
        multiple: false
      },
      footer: {
        type: "sap.ui.core.Control",
        multiple: false
      }
    }
  },

  init: function() {
    //nothing yet
  },

  renderer: function(oRm, oControl) {

    var oHeader = oControl.getHeader();
    var headerHeight = oControl.getHeaderHeight() || 50;
    var oFooter = oControl.getFooter();
    var footerHeight = oControl.getFooterHeight() || 50;

    // calculate the icon container height based on wether header and/or footer is present
    var iconContainerHeight = 0;
    if (oHeader && headerHeight) {
      headerHeight = parseInt(headerHeight);
      iconContainerHeight = iconContainerHeight + headerHeight;
    }
    if (oFooter && footerHeight) {
      footerHeight = parseInt(footerHeight);
      iconContainerHeight = iconContainerHeight + footerHeight;
    }

    //------------ MAIN CONTAINER ------------
    oRm.write("<div"); // main container start

    //// write control data (id)
    oRm.writeControlData(oControl);

    // prepare and write classes
    oRm.addClass("ff-launchpad");
    if (oHeader && oFooter) { // if header and footer present then add header footer class
      oRm.addClass("ff-launchpad-with-header-footer");
    } else if (oHeader) { // if header present then add header class
      oRm.addClass("ff-launchpad-with-header");
    } else if (oFooter) { // if footer present then add footer class
      oRm.addClass("ff-launchpad-with-footer");
    }

    oRm.writeClasses();

    // width
    var width = oControl.getWidth();
    if (width !== undefined && width !== null) {
      oRm.addStyle("width", width);
    }

    // height
    var height = oControl.getHeight();
    if (height !== undefined && height !== null) {
      oRm.addStyle("height", height);
    }

    // background color
    var bgColor = oControl.getBackgroundColor();
    if (bgColor !== undefined && bgColor !== null) {
      oRm.addStyle("background-color", bgColor);
    }

    // background image
    var bgImgSrc = oControl.getBackgroundImgSrc();
    if (bgImgSrc !== undefined && bgImgSrc !== null) {
      oRm.addStyle("background-image", "url('" + bgImgSrc + "')");
      oRm.addStyle("background-repeat", "no-repeat");
      oRm.addStyle("background-size", "cover");
    }

    oRm.writeStyles();

    oRm.write(">"); // close main container tag


    //############ HEADER ############
    if (oHeader) {
      oRm.write("<div"); // header start

      // prepare and write classes
      oRm.addClass("ff-launchpad-header");
      oRm.writeClasses();

      // prepare and write styles
      if (headerHeight !== undefined && headerHeight !== 50) {
        oRm.addStyle("height", headerHeight + "px");
      }
      oRm.writeStyles();

      oRm.write(">"); // close header tag

      // render the control
      oRm.renderControl(oHeader);

      oRm.write("</div>"); // header end
    }
    //############ HEADER END ############

    //++++++++++++ ICON CONTAINER ++++++++++++

    oRm.write("<div"); // icon container start

    // prepare and write classes
    oRm.addClass("ff-launchpad-icons");
    oRm.writeClasses();

    // prepare and write styles
    // height with header and/or footer
    if ((oHeader || oFooter) && iconContainerHeight != 0) {
      oRm.addStyle("height", "calc(100% - " + iconContainerHeight + "px)");
    }

    oRm.writeStyles();

    oRm.write(">"); // close icon container tag

    // add children (launchpad icons)
    var icons = oControl.getIcons();
    for (var i = 0; i < icons.length; i++) { // loop over all child Controls,
      oRm.renderControl(icons[i]); // render the child Control
    }

    oRm.write("</div>"); // icon container end

    //++++++++++++ ICON CONTAINER END ++++++++++++

    //============ FOOTER ============
    if (oFooter) {
      oRm.write("<div"); // footer start

      // prepare and write classes
      oRm.addClass("ff-launchpad-footer");
      oRm.writeClasses();

      // prepare and write styles
      if (footerHeight !== undefined && footerHeight !== 50) {
        oRm.addStyle("height", footerHeight + "px");
      }
      oRm.writeStyles();

      oRm.write(">"); // close footer tag

      // render the control
      oRm.renderControl(oFooter);

      oRm.write("</div>"); // footer end
    }
    //############ FOOTER END ############

    oRm.write("</div>"); // main container end

    //------------ MAIN CONTAINER END ------------

  },

  onAfterRendering: function() {
    //add class to the body so that the window container knows in what context it runs
    //not optimal since it does not take footer or custom header size into account, but should be fine for now
    if (this.getHeader()) {
      $("body").addClass("ff-launchpad-with-header-body");
    }else{
      $("body").removeClass("ff-launchpad-with-header-body");
    }
  },


});

sap.ui.core.Control.extend("sap.firefly.XtUi5AppIcon", {
  metadata: {
    properties: {
      "text": "string",
      "backgroundColor": "string",
      "iconSrc": "string",
      "tooltip": "string",
      "width": "string",
      "height": "string",
      "x": "string",
      "y": "string"
    },
    events: {
      onMove: {
        parameters: {
          newPosX: {
            type: "int"
          },
          newPosY: {
            type: "int"
          }
        }
      },
      onMoveStart: {
        parameters: {
          newPosX: {
            type: "int"
          },
          newPosY: {
            type: "int"
          }
        }
      },
      onMoveEnd: {
        parameters: {
          newPosX: {
            type: "int"
          },
          newPosY: {
            type: "int"
          }
        }
      }
    }
  },

  m_enableDragInteraction: false,

  //ui control stuff
  // ======================================

  renderer: function(oRm, oControl) {
    oRm.write("<div"); // wrapper start

    //// write control data (id)
    oRm.writeControlData(oControl);

    //// write classes
    oRm.addClass("ff-app-icon");
    oRm.writeClasses();

    //// prepare and write attributes
    // tooltip
    var iconTooltip = oControl.getTooltip();
    if (iconTooltip !== undefined && iconTooltip !== null) {
      oRm.writeAttributeEscaped("title", iconTooltip);
    }

    //// prepare and write styles
    // icon size
    var width = oControl.getWidth();
    var height = oControl.getHeight();

    if (width) {
      oRm.addStyle("width", width);
    }

    if (height) {
      oRm.addStyle("height", height);
    }

    // icon position
    var posX = oControl.getX();
    var posY = oControl.getY();
    var posXPx = parseInt(posX);
    var posYPx = parseInt(posY);

    if (posX != undefined && posX != null) {
      oRm.writeAttribute("data-x", posXPx);
      posXPx = posXPx + "px";
    } else {
      posXPx = 0;
    }

    if (posY != undefined && posY != null) {
      oRm.writeAttribute("data-y", posYPx);
      posYPx = posYPx + "px";
    } else {
      posYPx = 0;
    }

    if (posX == null && posY == null) {
      oRm.addStyle("position", "initial");
    }

    if (posX || posY) {
      oRm.addStyle("position", "absolute");
      oRm.addStyle("transform", "translate(" + posXPx + ", " + posYPx + ")");
    }

    //// prepare and write styles

    oRm.writeStyles();
    oRm.write(">"); // close main container tag


    ////////// ICON CONTAINER
    oRm.write("<div"); // icon div start

    //// write classes
    oRm.addClass("ff-app-icon-icon");
    oRm.writeClasses();

    //// prepare and write styles
    // background color
    var bgColor = oControl.getBackgroundColor();
    if (bgColor !== undefined && bgColor !== null) {
      oRm.addStyle("background-color", bgColor);
    }

    // icon image
    var iconImgSrc = oControl.getIconSrc();
    if (iconImgSrc !== undefined && iconImgSrc !== null) {
      oRm.addStyle("background-image", "url('" + iconImgSrc + "')");
      oRm.addStyle("background-repeat", "no-repeat");
      oRm.addStyle("background-size", "cover");
    }

    oRm.writeStyles();
    oRm.write(">"); // close icon div tag

    oRm.write("</div>"); // icon div end
    ////////// ICON CONTAINER END

    ////////// ICON TEXT
    oRm.write("<p"); // text paragraph start

    //// write classes
    oRm.addClass("ff-app-icon-text");
    oRm.writeClasses();

    oRm.writeStyles();
    oRm.write(">"); // close text paragraph tag

    // write the text beetwen the tags
    var iconText = oControl.getText();
    if (iconText !== undefined && bgColor !== null) {
      oRm.writeEscaped(iconText);
    }

    oRm.write("</p>"); // text div end
    ////////// ICON TEXT END

    oRm.write("</div>"); // wrapper end


  },

  onAfterRendering: function() {
    if (this.m_enableDragInteraction) {
      this.addDragInteraction();
    }
  },


  //helpers
  // ======================================

  addDragInteraction: function() {
    var myself = this;

    if (!window.interact) {
      sap.firefly.logError("Could not find interactjs library. Interaction with app icons will be not possible!");
      return;
    }

    var launchpadIconWrapper = $("#" + this.getId() + ".ff-app-icon")[0];
    if (!launchpadIconWrapper) { // do nothing if element not found
      return;
    }

    // remove any previous set drag and drop interction
    interact(launchpadIconWrapper).unset();

    // if drag interaction disabled then stop
    if (!this.m_enableDragInteraction) {
      return;
    }

    // add new drag and drop interaction
    var tmp = interact(launchpadIconWrapper)
      .draggable({
        allowFrom: ".ff-app-icon-icon",
        inertia: true, // enable inertial throwing
        // keep the element within the area of it's parent
        modifiers: [
          interact.modifiers.restrict({
            restriction: launchpadIconWrapper.parentElement,
            endOnly: false,
            elementRect: {
              top: 0,
              left: 0,
              bottom: 1,
              right: 1
            }
          }),
        ],
        // call this function on every dragmove event
        onmove: function(event) {
          var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          // translate the element
          target.style.webkitTransform =
            target.style.transform =
            "translate(" + x + "px, " + y + "px)";

          // update the posiion attributes
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);

          // fire the onMove event
          myself.fireEvent("onMove", {
            newPosX: event.clientX,
            newPosY: event.clientY
          });
        },
        onstart: function(event) {
          //increase the z index of the dragged icon so that it always appears on top
          event.target.style.zIndex = sap.firefly.XtLaunchpadHelper.helper().getNextIconZIndex();
          //sap.firefly.logInfo(event.type, event.target)

          // fire the onMoveEnd event
          myself.fireEvent("onMoveStart", {
            newPosX: event.clientX,
            newPosY: event.clientY
          });
        },
        onend: function(event) {
          //sap.firefly.logInfo(event.type, event.target)

          // prevent the next onclick event, this stops the onclick event to be triggered after dragging has ended
          $(event.target).one("click", function(_event) {
            _event.stopImmediatePropagation();
          });

          // fire the onMoveEnd event, position relative to container, jquery method
          var newXPos = $(event.target).position().left;
          var newYPos = $(event.target).position().top;
          // update the element position
          myself.setX(newXPos);
          myself.setY(newYPos);
          // send the actual onMoveEnd event
          myself.fireEvent("onMoveEnd", {
            newPosX: newXPos,
            newPosY: newYPos
          });
        }
      });

  },

  setDragInteractionEnabled: function(enabled) {
    this.m_enableDragInteraction = enabled;
    this.addDragInteraction();
  }

});

sap.ui.core.Control.extend("sap.firefly.XtUi5FileIcon", {
  metadata: {
    properties: {
      "text": "string",
      "fileType": "string",
      "backgroundColor": "string",
      "fontColor": "string",
      "iconSrc": "string",
      "tooltip": "string",
      "width": "string",
      "height": "string",
      "x": "string",
      "y": "string"
    },
    events: {}
  },

  //ui control stuff
  // ======================================

  renderer: function(oRm, oControl) {
    oRm.write("<div"); // wrapper start

    //// write control data (id)
    oRm.writeControlData(oControl);

    //// write classes
    oRm.addClass("ff-file-icon");
    oRm.writeClasses();

    //// prepare and write attributes
    // tooltip
    var iconTooltip = oControl.getTooltip();
    if (iconTooltip !== undefined && iconTooltip !== null) {
      oRm.writeAttributeEscaped("title", iconTooltip);
    }

    //// prepare and write styles
    // background color
    var bgColor = oControl.getBackgroundColor();
    if (bgColor !== undefined && bgColor !== null) {
      oRm.addStyle("background-color", bgColor);
    }

    // icon size
    var width = oControl.getWidth();
    var height = oControl.getHeight();

    if (width) {
      oRm.addStyle("width", width);
    }

    if (height) {
      oRm.addStyle("height", height);
    }

    // icon position
    var posX = oControl.getX();
    var posY = oControl.getY();
    var posXPx = parseInt(posX);
    var posYPx = parseInt(posY);

    if (posX != undefined && posX != null) {
      oRm.writeAttribute("data-x", posXPx);
      posXPx = posXPx + "px";
    } else {
      posXPx = 0;
    }

    if (posY != undefined && posY != null) {
      oRm.writeAttribute("data-y", posYPx);
      posYPx = posYPx + "px";
    } else {
      posYPx = 0;
    }

    if (posX == null && posY == null) {
      oRm.addStyle("position", "relative");
    }

    if (posX || posY) {
      oRm.addStyle("position", "absolute");
      oRm.addStyle("transform", "translate(" + posXPx + ", " + posYPx + ")");
    }

    //// prepare and write styles

    oRm.writeStyles();
    oRm.write(">"); // close main container tag


    ////////// ICON CONTAINER
    oRm.write("<div"); // icon div start

    //// write classes
    oRm.addClass("ff-file-icon-icon");
    oRm.writeClasses();

    //// prepare and write styles
    // icon image
    var iconImgSrc = oControl.getIconSrc();
    if (iconImgSrc !== undefined && iconImgSrc !== null) {
      oRm.addStyle("background-image", "url('" + iconImgSrc + "')");
      oRm.addStyle("background-repeat", "no-repeat");
      oRm.addStyle("background-size", "cover");
    }

    oRm.writeStyles();
    oRm.write(">"); // close icon div tag

    oRm.write("</div>"); // icon div end
    ////////// ICON CONTAINER END


    ////////// ICON TEXT
    oRm.write("<p"); // text paragraph start

    //// write classes
    oRm.addClass("ff-file-icon-text");
    oRm.writeClasses();

    // background color
    var fontColor = oControl.getFontColor();
    if (fontColor !== undefined) {
      oRm.addStyle("color", fontColor);
    }

    oRm.writeStyles();
    oRm.write(">"); // close text paragraph tag

    // write the text beetwen the tags
    var iconText = oControl.getText();
    if (iconText !== undefined) {
      oRm.writeEscaped(iconText);
    }

    oRm.write("</p>"); // text div end
    ////////// ICON TEXT END

    ////////// ICON FILE TYPE

    // write the file type only if specified
    var iconFileType = oControl.getFileType();
    if (iconFileType !== undefined) {
      oRm.write("<p"); // text paragraph start

      //// write classes
      oRm.addClass("ff-file-icon-type");
      oRm.writeClasses();

      oRm.writeStyles();
      oRm.write(">"); // close text paragraph tag

      // write the file type beetwen the tags
      oRm.writeEscaped(iconFileType);

      oRm.write("</p>"); // text div end
    }
    ////////// ICON FILE TYPE END

    oRm.write("</div>"); // wrapper end


  },

  onAfterRendering: function() {
    //nothing yet...
  },


  //helpers
  // ======================================


});

sap.ui.core.Control.extend("sap.firefly.XtUi5TaskBar", {
  metadata: {
    properties: {
      "backgroundColor": "string",
      "tooltip": "string",
      "width": "string",
      "height": "string"
    },
    aggregations: {
      buttons: {
        type: "sap.firefly.XtUi5TaskBarButton",
        singularName: "button"
      }
    },
    events: {}
  },

  renderer: function(oRm, oControl) {
    oRm.write("<div"); // wrapper start

    //// write control data (id)
    oRm.writeControlData(oControl);

    //// write classes
    oRm.addClass("ff-task-bar");
    oRm.writeClasses();

    //// prepare and write attributes
    // tooltip
    var tooltip = oControl.getTooltip();
    if (tooltip !== undefined && tooltip !== null) {
      oRm.writeAttributeEscaped("title", tooltip);
    }

    // size
    var width = oControl.getWidth();
    var height = oControl.getHeight();

    if (width) {
      oRm.addStyle("width", width);
    }

    if (height) {
      oRm.addStyle("height", height);
    }

    //// prepare and write styles
    // background color
    var bgColor = oControl.getBackgroundColor();
    if (bgColor !== undefined && bgColor !== null) {
      oRm.addStyle("background-color", bgColor);
    }

    oRm.writeStyles();
    oRm.write(">"); // close main container tag

    // add children (tab bar buttons)
    var tabBarButtons = oControl.getButtons();
    for (var i = 0; i < tabBarButtons.length; i++) { // loop over all child Controls,
      oRm.renderControl(tabBarButtons[i]); // render the child Control
    }

    oRm.write("</div>"); // wrapper end

  },

  onAfterRendering: function() {
    var myself = this;
  }

});

sap.ui.core.Control.extend("sap.firefly.XtUi5TaskBarButton", {
  metadata: {
    properties: {
      "text": "string",
      "backgroundColor": "string",
      "iconSrc": "string",
      "tooltip": "string",
      "width": "String",
      "height": "String"
    },
    events: {
    }
  },

  renderer: function(oRm, oControl) {
    oRm.write("<div"); // wrapper start

    //// write control data (id)
    oRm.writeControlData(oControl);

    //// write classes
    oRm.addClass("ff-task-bar-button");
    oRm.writeClasses();

    //// prepare and write attributes
    // tooltip
    var tooltip = oControl.getTooltip();
    if (tooltip !== undefined && tooltip !== null) {
      oRm.writeAttributeEscaped("title", tooltip);
    }

    // size
    var width = oControl.getWidth();
    var height = oControl.getHeight();

    if (width) {
      oRm.addStyle("width", width);
    }

    if (height) {
      oRm.addStyle("height", height);
    }

    //// prepare and write styles

    oRm.writeStyles();
    oRm.write(">"); // close main container tag


    ////////// ICON CONTAINER
    oRm.write("<div"); // icon div start

    //// write classes
    oRm.addClass("ff-task-bar-button-icon");
    oRm.writeClasses();

    //// prepare and write styles
    // background color
    var bgColor = oControl.getBackgroundColor();
    if (bgColor !== undefined && bgColor !== null) {
      oRm.addStyle("background-color", bgColor);
    }

    // icon image
    var iconImgSrc = oControl.getIconSrc();
    if (iconImgSrc !== undefined && iconImgSrc !== null) {
      oRm.addStyle("background-image", "url('" + iconImgSrc + "')");
      oRm.addStyle("background-repeat", "no-repeat");
      oRm.addStyle("background-size", "cover");
    }

    oRm.writeStyles();
    oRm.write(">"); // close icon div tag

    oRm.write("</div>"); // icon div end
    ////////// ICON CONTAINER END

    ////////// TASK BAR BUTTON TEXT
    oRm.write("<p"); // text paragraph start

    //// write classes
    oRm.addClass("ff-task-bar-button-text");
    oRm.writeClasses();

    oRm.writeStyles();
    oRm.write(">"); // close text paragraph tag

    // write the text beetwen the tags
    var iconText = oControl.getText();
    if (iconText !== undefined && bgColor !== null) {
      oRm.writeEscaped(iconText);
    }

    oRm.write("</p>"); // text div end
    ////////// TASK BAR BUTTON TEXT END

    oRm.write("</div>"); // wrapper end


  },

  onAfterRendering: function() {
    var myself = this;

  }

});

// ==========================================================================
// == CUSTOM SAPUI5 CONTROL FOR CONTENT WRAPPING, ACTS AS PROXY INTO SAPUI5
// == very fast rendering
// ==========================================================================
sap.ui.core.Control.extend("sap.firefly.XtUi5ContentWrapper", {
  metadata: {
    properties: {
      "backgroundColor": "string",
      "tooltip": "string",
      "width": "string",
      "height": "string",
      "position": "string"
    },
    aggregations: {
      content: {
        type: "sap.ui.core.Control",
        multiple: true
      }
    },
    events: {
      afterRendering: {
        enablePreventDefault: true
      }
    }
  },

  renderer: function(oRm, oControl) {
    oRm.write("<div"); // wrapper start

    //// write control data (id)
    oRm.writeControlData(oControl);

    //// write classes
    oRm.addClass("ff-content-wrapper");
    oRm.writeClasses();

    //// prepare and write attributes
    // tooltip
    var tooltip = oControl.getTooltip();
    if (tooltip !== undefined && tooltip !== null) {
      oRm.writeAttributeEscaped("title", tooltip);
    }

    // position (default relative)
    var position = oControl.getPosition();
    if (position) {
      oRm.addStyle("position", position);
    }

    // size
    var width = oControl.getWidth();
    var height = oControl.getHeight();

    if (width) {
      oRm.addStyle("width", width);
    }

    if (height) {
      oRm.addStyle("height", height);
    }

    //// prepare and write styles
    // background color
    var bgColor = oControl.getBackgroundColor();
    if (bgColor !== undefined && bgColor !== null) {
      oRm.addStyle("background-color", bgColor);
    }

    oRm.writeStyles();
    oRm.write(">"); // close main container tag

    // add children (tab bar buttons)
    var oContent = oControl.getContent();
    for (var i = 0; i < oContent.length; i++) { // loop over all content,
      oRm.renderControl(oContent[i]); // render the child Control
    }

    oRm.write("</div>"); // wrapper end

  },

  onAfterRendering: function() {
    var myself = this;
    this.fireAfterRendering();
  }

});

sap.firefly.UxGeneric = function() {
   sap.firefly.DfUiContext.call(this);
  this._ff_c = "UxGeneric";

  // variables
  this.m_nativeControl = null;
  this.m_propertyFunctions = null;
  this.m_dragInfo = null; // a control can have both drag info and drop info and they are in the same aggregation so keep track of them
  this.m_dropInfo = null;
};
sap.firefly.UxGeneric.prototype = new sap.firefly.DfUiContext();

sap.firefly.UxGeneric.linkFfAndUi5Controls = function(nativeUi5Control, ffControl) {
   // link the ff control and the uicontrol usng the data "ffItem" property
  if (nativeUi5Control && ffControl) {
    nativeUi5Control.data("ffItem", ffControl);
  }
};

sap.firefly.UxGeneric.getUxControl = function(nativeControl) {
   // get the firefly ux control which is stored on the native control as a property
  if (nativeControl) {
    return nativeControl.data("ffItem");
  }
  return null;
};

sap.firefly.UxGeneric.getUi5IconUri = function(icon) {
  var iconUri = sap.ui.core.IconPool.getIconURI(icon);
  if (!iconUri) {
    iconUri = icon;
  }
  return iconUri;
};


// ********************************************
// *** protocol *******************************
// ********************************************

sap.firefly.UxGeneric.prototype.initializeNative = function() {
  sap.firefly.logDebug("[CREATE CONTROL] " + this.getId() + " | initializing control of type " + this.getUiType().getName(), sap.firefly.getBlueColor());
  sap.firefly.DfUiContext.prototype.initializeNative.call(this);
};

sap.firefly.UxGeneric.prototype.releaseObject = function() {
  sap.firefly.logDebug("[RELEASE CONTROL] " + this.getId() + " | destroying control!", sap.firefly.getRedColor());
  sap.firefly.DfUiContext.prototype.releaseObject.call(this);

  // destroy the native control and remove reference
  if (this.m_nativeControl && this.m_nativeControl.destroy !== null) {
    this.m_nativeControl.destroy();
  }
  this.m_nativeControl = null;
};

sap.firefly.UxGeneric.prototype.getNativeControl = function() {
  return this.m_nativeControl;
};

sap.firefly.UxGeneric.prototype.getJQueryObject = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    return $(this.getNativeControl().getDomRef());
  }
  return $();
};

sap.firefly.UxGeneric.prototype.getJQueryObject = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    return $(this.getNativeControl().getDomRef());
  }
  return $();
};


// ********************************************
// *** control helpers ************************
// ********************************************

sap.firefly.UxGeneric.prototype.setNativeControl = function(nativeControl) {
  this.m_nativeControl = nativeControl;
  if (nativeControl !== null) {
    // save the firefly ux item on the native ui5 control as reference
    sap.firefly.UxGeneric.linkFfAndUi5Controls(nativeControl, this);

    // adjust the busy indicator delay
    if (nativeControl.setBusyIndicatorDelay !== undefined) {
      nativeControl.setBusyIndicatorDelay(10); // default is 1000, set it to lower value
    }

    // apply the content density classes from ui5, for mobile or desktop, depending on the browser
    this.applyContentDensity(nativeControl);

    // reset the property functions list
    this.m_propertyFunctions = {};

    // register for the on after rendering event
    nativeControl.addDelegate({
      onAfterRendering: this.onAfterControlRendering.bind(this)
    });
  }
};

//apply content density based on the style class desktop/mobile
sap.firefly.UxGeneric.prototype.applyContentDensity = function(nativeControl) {
  if (nativeControl && nativeControl.addStyleClass !== undefined) {
    if (this.getUiStyleClass().isTypeOf(sap.firefly.UiStyleClass.DESKTOP)) {
      nativeControl.addStyleClass("sapUiSizeCompact");
      nativeControl.removeStyleClass("sapUiSizeCozy");
    } else {
      nativeControl.addStyleClass("sapUiSizeCozy");
      nativeControl.removeStyleClass("sapUiSizeCompact");
    }
  }
};

sap.firefly.UxGeneric.prototype.getProperty = function(property) {
  var getter = "get" + property.charAt(0).toUpperCase() + property.slice(1);
  var value = null;
  if (this.m_nativeControl && typeof this.m_nativeControl[getter] == "function") {
    value = this.m_nativeControl[getter]();
  } else {
    value = this["m_" + property];
  }

  if (value === undefined) {
    return null;
  } else {
    return value;
  }
};

sap.firefly.UxGeneric.prototype.setProperty = function(property, value) {
  var setter = "set" + property.charAt(0).toUpperCase() + property.slice(1);
  if (this.m_nativeControl && typeof this.m_nativeControl[setter] == "function") {
    this.m_nativeControl[setter](value);
  } else {
    this["m_" + property] = value;
  }
  return this;
};

sap.firefly.UxGeneric.prototype.rerenderNativeControl = function() {
  if (this.getNativeControl() && this.getNativeControl().invalidate) {
    this.getNativeControl().invalidate();
  }
};

// =======================================================

sap.firefly.UxGeneric.prototype.onAfterControlRendering = function() {
  var element = this.getNativeControl().getDomRef();
  this.applyCustomCssStyling(element);
  this.applyCustomAttributes(element);
  this.applyCustomCssProperties(element);
};

sap.firefly.UxGeneric.prototype.applyCustomCssStyling = function() {
  // implemented by child controls if styling modification is necessary
};

sap.firefly.UxGeneric.prototype.applyCustomAttributes = function() {
  // implemented by child controls if attribute modification is necessary
};

sap.firefly.UxGeneric.prototype.applyCustomCssProperties = function() {
  // should not be overriden by child controls, override property specific  methods instead
  // loop through all the set property functions and call them
  if (this.m_propertyFunctions) {
    var propFnNames = Object.keys(this.m_propertyFunctions);
    var propFnsLength = propFnNames.length;
    for (var i = 0; i < propFnsLength; i++) {
      var propName = propFnNames[i];
      var propFn = this.m_propertyFunctions[propName].propFn;
      var cssValue = this.m_propertyFunctions[propName].cssValue;
      this._runPropFunction(propFn, cssValue);
    }
  }
};

// =======================================================


// ********************************************
// *** Event overrides ************************
// ********************************************

sap.firefly.UxGeneric.prototype.registerOnFileDrop = function(listener) {
  sap.firefly.DfUiContext.prototype.registerOnFileDrop.call(this, listener);
  this._addFileDropHandling();
  return this;
};

sap.firefly.UxGeneric.prototype.registerOnDrop = function(listener) {
  sap.firefly.DfUiContext.prototype.registerOnDrop.call(this, listener);
  this._addControlDropHandling();
  return this;
};


// ********************************************
// *** Event helpers **************************
// ********************************************


// ********************************************
// *** Properties *****************************
// ********************************************

sap.firefly.UxGeneric.prototype.getTooltip = function() {
  return sap.firefly.DfUiContext.prototype.getTooltip.call(this);
};

sap.firefly.UxGeneric.prototype.setTooltip = function(value) {
  sap.firefly.DfUiContext.prototype.setTooltip.call(this, value);
  // since ui5 only accepts a string as tooltip or an configurable object inheriting from sap.ui.core.TooltipBase
  // make sure the value is either a string or null/undefined
  if (value !== null && value !== undefined) value = value.toString();
  this.setProperty("tooltip", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getText = function() {
  return sap.firefly.DfUiContext.prototype.getText.call(this);
};

sap.firefly.UxGeneric.prototype.setText = function(value) {
  sap.firefly.DfUiContext.prototype.setText.call(this, value);
  this.setProperty("text", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getDescription = function() {
  return sap.firefly.DfUiContext.prototype.getDescription.call(this);
};

sap.firefly.UxGeneric.prototype.setDescription = function(value) {
  sap.firefly.DfUiContext.prototype.setDescription.call(this, value);
  this.setProperty("description", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getTitle = function() {
  return sap.firefly.DfUiContext.prototype.getTitle.call(this);
};

sap.firefly.UxGeneric.prototype.setTitle = function(value) {
  sap.firefly.DfUiContext.prototype.setTitle.call(this, value);
  this.setProperty("title", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getIcon = function() {
  return sap.firefly.DfUiContext.prototype.getIcon.call(this);
};

sap.firefly.UxGeneric.prototype.setIcon = function(value) {
  sap.firefly.DfUiContext.prototype.setIcon.call(this, value);
  var iconUri = sap.firefly.UxGeneric.getUi5IconUri(value);
  this.setProperty("icon", iconUri);
  return this;
};

sap.firefly.UxGeneric.prototype.getLabel = function() {
  return sap.firefly.DfUiContext.prototype.getLabel.call(this);
};

sap.firefly.UxGeneric.prototype.setLabel = function(value) {
  sap.firefly.DfUiContext.prototype.setLabel.call(this, value);
  this.setProperty("label", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isRequired = function() {
  return sap.firefly.DfUiContext.prototype.isRequired.call(this);
};

sap.firefly.UxGeneric.prototype.setRequired = function(value) {
  sap.firefly.DfUiContext.prototype.setRequired.call(this, value);
  this.setProperty("required", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getValue = function() {
  return sap.firefly.DfUiContext.prototype.getValue.call(this);
};

sap.firefly.UxGeneric.prototype.setValue = function(value) {
  sap.firefly.DfUiContext.prototype.setValue.call(this, value);
  this.setProperty("value", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isSelected = function() {
  return sap.firefly.DfUiContext.prototype.isSelected.call(this);
};

sap.firefly.UxGeneric.prototype.setSelected = function(value) {
  sap.firefly.DfUiContext.prototype.setSelected.call(this, value);
  this.setProperty("selected", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isEnabled = function() {
  return sap.firefly.DfUiContext.prototype.isEnabled.call(this);
};

sap.firefly.UxGeneric.prototype.setEnabled = function(value) {
  sap.firefly.DfUiContext.prototype.setEnabled.call(this, value);
  this.setProperty("enabled", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isVisible = function() {
  return sap.firefly.DfUiContext.prototype.isVisible.call(this);
};

sap.firefly.UxGeneric.prototype.setVisible = function(value) {
  sap.firefly.DfUiContext.prototype.setVisible.call(this, value);
  this.setProperty("visible", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isBusy = function() {
  return sap.firefly.DfUiContext.prototype.isBusy.call(this);
};

sap.firefly.UxGeneric.prototype.setBusy = function(value) {
  sap.firefly.DfUiContext.prototype.setBusy.call(this, value);
  this.setProperty("busy", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isChecked = function() {
  return sap.firefly.DfUiContext.prototype.isChecked.call(this);
};

sap.firefly.UxGeneric.prototype.setChecked = function(value) {
  sap.firefly.DfUiContext.prototype.setChecked.call(this, value);
  this.setProperty("checked", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isSortable = function() {
  return sap.firefly.DfUiContext.prototype.isSortable.call(this);
};

sap.firefly.UxGeneric.prototype.setSortable = function(value) {
  sap.firefly.DfUiContext.prototype.setSortable.call(this, value);
  this.setProperty("sortable", value);
  return this;
};

sap.firefly.UxGeneric.prototype.isSortable = function() {
  return sap.firefly.DfUiContext.prototype.isSortable.call(this);
};

sap.firefly.UxGeneric.prototype.setSortable = function(value) {
  sap.firefly.DfUiContext.prototype.setSortable.call(this, value);
  this.setProperty("sortable", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getChartType = function() {
  return sap.firefly.DfUiContext.prototype.getChartType.call(this);
};

sap.firefly.UxGeneric.prototype.setChartType = function(value) {
  sap.firefly.DfUiContext.prototype.setChartType.call(this, value);
  this.setProperty("chartType", value);
  return this;
};

sap.firefly.UxGeneric.prototype.getName = function() {
  return sap.firefly.DfUiContext.prototype.getName.call(this);
};

sap.firefly.UxGeneric.prototype.setName = function(name) {
  sap.firefly.DfUiContext.prototype.setName.call(this, name);
  // add firefly name as attribute (data-ff-name) to the dom element
  // required for unique element selection (id cannot be used since it is generated randomly, name can be given by the user)
  if (this.getNativeControl() !== null && name && name.length > 0) {
    this.getNativeControl().data("ff-name", name, true);
  }
  return this;
};

sap.firefly.UxGeneric.prototype.getTag = function() {
  return sap.firefly.DfUiContext.prototype.getTag.call(this);
};

sap.firefly.UxGeneric.prototype.setTag = function(tag) {
  sap.firefly.DfUiContext.prototype.setTag.call(this, tag);
  return this;
};

sap.firefly.UxGeneric.prototype.isDraggable = function() {
  return sap.firefly.DfUiContext.prototype.isDraggable.call(this);
};

sap.firefly.UxGeneric.prototype.setDraggable = function(draggable) {
  sap.firefly.DfUiContext.prototype.setDraggable.call(this, draggable);
  if (draggable) {
    this._addDraggable();
  } else {
    this._removeDraggable();
  }
  return this;
};

sap.firefly.UxGeneric.prototype.getDropInfo = function() {
  return sap.firefly.DfUiContext.prototype.getDropInfo.call(this);
};

sap.firefly.UxGeneric.prototype.setDropInfo = function(dropInfo) {
  sap.firefly.DfUiContext.prototype.setDropInfo.call(this, dropInfo);
  if (this.m_dropInfo) {
    if (!dropInfo) {
      this.getNativeControl().removeDragDropConfig(this.m_dropInfo);
      this.m_dropInfo = null;
    } else {
      this.m_dropInfo.setDropPosition(this._getUi5DropPosition());
      this.m_dropInfo.setDropEffect(this._getUi5DropEffect());
      this.m_dropInfo.setDropLayout(this._getUi5DropLayout());
      this.m_dropInfo.setTargetAggregation(this._getUi5DropTargetAggregation());
    }
  }
  return this;
};

sap.firefly.UxGeneric.prototype.getCssClass = function() {
  return sap.firefly.DfUiContext.prototype.getCssClass.call(this);
};

sap.firefly.UxGeneric.prototype.setCssClass = function(cssClass) {
  var oldStyleClass = this.getCssClass();
  sap.firefly.DfUiContext.prototype.setCssClass.call(this, cssClass);
  // first remove old style class
  if (this.getNativeControl() !== null && this.getNativeControl().removeStyleClass !== undefined && oldStyleClass && oldStyleClass.length > 0) {
    this.getNativeControl().removeStyleClass(oldStyleClass);
  }
  // then add new one
  if (this.getNativeControl() !== null && this.getNativeControl().addStyleClass !== undefined && cssClass && cssClass.length > 0) {
    this.getNativeControl().addStyleClass(cssClass);
  }
  return this;
};

// ********************************************
// *** Property helpers ***********************
// ********************************************


// ********************************************
// ****************** Methods *****************
// ********************************************

sap.firefly.UxGeneric.prototype.focus = function() {
  sap.firefly.DfUiContext.prototype.focus.call(this);
  // UI5 takes some time to apply operations and in that time the focus won't work
  // setTimeout makes sure that the focus is set after operations.
  // e.g. setEnabled(true).focus() will not work without this.
  var myself = this;
  setTimeout(function() {
    var control = myself.getNativeControl();
    if (control && control.focus != null) {
      control.focus();
    }
  }, 0);
  return this;
};


// ********************************************
// *** Position, Size, Styling ****************
// ********************************************

sap.firefly.UxGeneric.prototype.setX = function(x) {
  sap.firefly.DfUiContext.prototype.setX.call(this, x);
  var xPosCss = this.calculatePosXCss();
  this._updateControlProperty(this.applyPosXCss, "setX", xPosCss, "x");
  return this;
};

sap.firefly.UxGeneric.prototype.setY = function(y) {
  sap.firefly.DfUiContext.prototype.setY.call(this, y);
  var yPosCss = this.calculatePosYCss();
  this._updateControlProperty(this.applyPosYCss, "setY", yPosCss, "y");
  return this;
};

sap.firefly.UxGeneric.prototype.setWidth = function(width) {
  sap.firefly.DfUiContext.prototype.setWidth.call(this, width);
  var widthCss = this.calculateWidthCss();
  this._updateControlProperty(this.applyWidthCss, "setWidth", widthCss, "width");
  return this;
};

sap.firefly.UxGeneric.prototype.setHeight = function(height) {
  sap.firefly.DfUiContext.prototype.setHeight.call(this, height);
  var heightCss = this.calculateHeightCss();
  this._updateControlProperty(this.applyHeightCss, "setHeight", heightCss, "height");
  return this;
};

sap.firefly.UxGeneric.prototype.setMinWidth = function(minWidth) {
  sap.firefly.DfUiContext.prototype.setMinWidth.call(this, minWidth);
  var minWidthCss = this.calculateMinWidthCss();
  this._updateControlProperty(this.applyMinWidthCss, "setMinWidth", minWidthCss, "minWidth");
  return this;
};

sap.firefly.UxGeneric.prototype.setMaxWidth = function(maxWidth) {
  sap.firefly.DfUiContext.prototype.setMaxWidth.call(this, maxWidth);
  var maxWidthCss = this.calculateMaxWidthCss();
  this._updateControlProperty(this.applyMaxWidthCss, "setMaxWidth", maxWidthCss, "maxWidth");
  return this;
};

sap.firefly.UxGeneric.prototype.setMinHeight = function(minHeight) {
  sap.firefly.DfUiContext.prototype.setMinHeight.call(this, minHeight);
  var minHeightCss = this.calculateMinHeightCss();
  this._updateControlProperty(this.applyMinHeightCss, "setMinHeight", minHeightCss, "minHeight");
  return this;
};

sap.firefly.UxGeneric.prototype.setMaxHeight = function(maxHeight) {
  sap.firefly.DfUiContext.prototype.setMaxHeight.call(this, maxHeight);
  var maxHeightCss = this.calculateMaxHeightCss();
  this._updateControlProperty(this.applyMaxHeightCss, "setMaxHeight", maxHeightCss, "maxHeight");
  return this;
};

sap.firefly.UxGeneric.prototype.setFlex = function(flex) {
  sap.firefly.DfUiContext.prototype.setFlex.call(this, flex);
  this._updateControlProperty(this.applyFlexCss, null, flex, "flex");
  return this;
};

sap.firefly.UxGeneric.prototype.setAlignSelf = function(alignSelf) {
  sap.firefly.DfUiContext.prototype.setAlignSelf.call(this, alignSelf);
  var alignSelfCss = this._calculateAlignSelfCss();
  this._updateControlProperty(this.applyAlignSelfCss, null, alignSelfCss, "alignSelf");
  return this;
};

sap.firefly.UxGeneric.prototype.setOrder = function(order) {
  sap.firefly.DfUiContext.prototype.setOrder.call(this, order);
  this._updateControlProperty(this.applyOrderCss, null, order, "order");
  return this;
};

sap.firefly.UxGeneric.prototype.setPadding = function(padding) {
  sap.firefly.DfUiContext.prototype.setPadding.call(this, padding);
  var paddingCss = this.calculatePaddingCss();
  this._updateControlProperty(this.applyPaddingCss, "setPadding", paddingCss, "padding");
  return this;
};

sap.firefly.UxGeneric.prototype.setMargin = function(margin) {
  sap.firefly.DfUiContext.prototype.setMargin.call(this, margin);
  var marginCss = this.calculateMarginCss();
  this._updateControlProperty(this.applyMarginCss, "setMargin", marginCss, "margin");
  return this;
};

sap.firefly.UxGeneric.prototype.setCornerRadius = function(cornerRadius) {
  sap.firefly.DfUiContext.prototype.setCornerRadius.call(this, cornerRadius);
  var cornerRadiusCss = this._calculateCornerRadiusCss();
  this._updateControlProperty(this.applyCornerRadiusCss, null, cornerRadiusCss, "cornerRadius");
  return this;
};

sap.firefly.UxGeneric.prototype.setColor = function(color) {
  sap.firefly.DfUiContext.prototype.setColor.call(this, color);
  var colorCss = this._calculateColorCss();
  this._updateControlProperty(this.applyColorCss, "setColor", colorCss, "color");
  return this;
};

sap.firefly.UxGeneric.prototype.setBackgroundColor = function(color) {
  sap.firefly.DfUiContext.prototype.setBackgroundColor.call(this, color);
  var bgColor = this._calculateBackgroundColorCss();
  this._updateControlProperty(this.applyBackgroundColorCss, "setBackgroundColor", bgColor, "backgroundColor");
  return this;
};

sap.firefly.UxGeneric.prototype.setBackgroundImageSrc = function(imageSrc) {
  sap.firefly.DfUiContext.prototype.setBackgroundImageSrc.call(this, imageSrc);
  this._updateControlProperty(this.applyBackgroundImageCss, "setBackgroundImgSrc", imageSrc, "backgroundImage");
  return this;
};

sap.firefly.UxGeneric.prototype.setBorderStyle = function(borderStyle) {
  sap.firefly.DfUiContext.prototype.setBorderStyle.call(this, borderStyle);
  var borderStyleCss = this._calculateBorderStyleCss();
  this._updateControlProperty(this.applyBorderStyleCss, null, borderStyleCss, "borderStyle");
  return this;
};

sap.firefly.UxGeneric.prototype.setBorderWidth = function(borderWidth) {
  sap.firefly.DfUiContext.prototype.setBorderWidth.call(this, borderWidth);
  var borderWidthCss = this._calculateBorderWidthCss();
  this._updateControlProperty(this.applyBorderWidthCss, null, borderWidthCss, "borderWidth");
  return this;
};

sap.firefly.UxGeneric.prototype.setBorderColor = function(color) {
  sap.firefly.DfUiContext.prototype.setBorderColor.call(this, color);
  var borderColorCss = this._calculateBorderColorCss();
  this._updateControlProperty(this.applyBorderColorCss, null, borderColorCss, "borderColor");
  return this;
};

sap.firefly.UxGeneric.prototype.setOpacity = function(opacity) {
  sap.firefly.DfUiContext.prototype.setOpacity.call(this, opacity);
  var opacityCss = this._calculateOpacityCss();
  this._updateControlProperty(this.applyOpacityCss, null, opacityCss, "opacity");
  return this;
};

sap.firefly.UxGeneric.prototype.setRotation = function(rotation) {
  sap.firefly.DfUiContext.prototype.setRotation.call(this, rotation);
  var rotationCss = this._calculateRotationCss();
  this._updateControlProperty(this.applyRotationCss, null, rotationCss, "rotation");
  return this;
};

sap.firefly.UxGeneric.prototype.setFontColor = function(fontColor) {
  sap.firefly.DfUiContext.prototype.setFontColor.call(this, fontColor);
  var fontColorCss = this._calculateFontColorCss();
  this._updateControlProperty(this.applyFontColorCss, "setColor", fontColorCss, "fontColor");
  return this;
};

sap.firefly.UxGeneric.prototype.setFontSize = function(fontSize) {
  sap.firefly.DfUiContext.prototype.setFontSize.call(this, fontSize);
  var fontSizeCss = this._calculateFontSizeCss();
  this._updateControlProperty(this.applyFontSizeCss, "setSize", fontSizeCss, "fontSize");
  return this;
};

sap.firefly.UxGeneric.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.DfUiContext.prototype.setFontStyle.call(this, fontStyle);
  var fontStyleCss = this._calculateFontStyleCss();
  this._updateControlProperty(this.applyFontStyleCss, null, fontStyleCss, "fontStyle");
  return this;
};

sap.firefly.UxGeneric.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.DfUiContext.prototype.setFontWeight.call(this, fontWeight);
  var fontWeightCss = this._calculateFontWeightCss();
  this._updateControlProperty(this.applyFontWeightCss, null, fontWeightCss, "fontWeight");
  return this;
};

sap.firefly.UxGeneric.prototype.setOverflow = function(overflow) {
  sap.firefly.DfUiContext.prototype.setOverflow.call(this, overflow);
  var overflowCss = this._calculateOverflowCss();
  this._updateControlProperty(this.applyOverflowCss, null, overflowCss, "overflow");
  return this;
};

sap.firefly.UxGeneric.prototype.setTextDecoration = function(textDecoration) {
  sap.firefly.DfUiContext.prototype.setTextDecoration.call(this, textDecoration);
  var textDecorationCss = this._calculateTextDecorationCss();
  this._updateControlProperty(this.applyTextDecorationCss, null, textDecorationCss, "textDecoration");
  return this;
};

sap.firefly.UxGeneric.prototype.setIconSize = function(iconSize) {
  sap.firefly.DfUiContext.prototype.setIconSize.call(this, iconSize);
  var iconSizeCss = this._calculateIconSizeCss();
  this._updateControlProperty(this.applyIconSizeCss, "setSize", iconSizeCss, "iconSize");
  return this;
};



// ************************************************
// *** css styling helpers ************************
// ************************************************

// helper
sap.firefly.UxGeneric.prototype.getCssString = function(cssBasedObj) {
  var cssStr = null;
  if (cssBasedObj) {
    cssStr = cssBasedObj.getCssValue();
  }
  return cssStr;
};

//width
sap.firefly.UxGeneric.prototype.calculateWidthCss = function() {
  return this.getCssString(this.getWidth());
};

sap.firefly.UxGeneric.prototype.applyWidthCss = function(element, widthCss) {
  element.style.width = widthCss;
};

//height
sap.firefly.UxGeneric.prototype.calculateHeightCss = function() {
  return this.getCssString(this.getHeight());
};

sap.firefly.UxGeneric.prototype.applyHeightCss = function(element, heightCss) {
  element.style.height = heightCss;
};

//min width
sap.firefly.UxGeneric.prototype.calculateMinWidthCss = function() {
  return this.getCssString(this.getMinWidth());
};

sap.firefly.UxGeneric.prototype.applyMinWidthCss = function(element, minWidthCss) {
  element.style.minWidth = minWidthCss;
};

//max width
sap.firefly.UxGeneric.prototype.calculateMaxWidthCss = function() {
  return this.getCssString(this.getMaxWidth());
};

sap.firefly.UxGeneric.prototype.applyMaxWidthCss = function(element, maxWidthCss) {
  element.style.maxWidth = maxWidthCss;
};

//min height
sap.firefly.UxGeneric.prototype.calculateMinHeightCss = function() {
  return this.getCssString(this.getMinHeight());
};

sap.firefly.UxGeneric.prototype.applyMinHeightCss = function(element, minHeightCss) {
  element.style.minHeight = minHeightCss;
};

//max height
sap.firefly.UxGeneric.prototype.calculateMaxHeightCss = function() {
  return this.getCssString(this.getMaxHeight());
};

sap.firefly.UxGeneric.prototype.applyMaxHeightCss = function(element, maxHeightCss) {
  element.style.maxHeight = maxHeightCss;
};

//pos x
sap.firefly.UxGeneric.prototype.calculatePosXCss = function() {
  return this.getCssString(this.getX());
};

sap.firefly.UxGeneric.prototype.applyPosXCss = function(element, xPosCss) {
  element.style.left = xPosCss;
  element.style.position = "absolute";
};

//pos y
sap.firefly.UxGeneric.prototype.calculatePosYCss = function() {
  return this.getCssString(this.getY());
};

sap.firefly.UxGeneric.prototype.applyPosYCss = function(element, yPosCss) {
  element.style.top = yPosCss;
  element.style.position = "absolute";
};

//padding
sap.firefly.UxGeneric.prototype.calculatePaddingCss = function() {
  return this.getCssString(this.getPadding());
};

sap.firefly.UxGeneric.prototype.applyPaddingCss = function(element, paddingCss) {
  element.style.padding = paddingCss;
};

//margin
sap.firefly.UxGeneric.prototype.calculateMarginCss = function() {
  return this.getCssString(this.getMargin());
};

sap.firefly.UxGeneric.prototype.applyMarginCss = function(element, marginCss) {
  element.style.margin = marginCss;
};

//border style
sap.firefly.UxGeneric.prototype.applyBorderStyleCss = function(element, borderStyleCss) {
  element.style.borderStyle = borderStyleCss;
};

//border width
sap.firefly.UxGeneric.prototype.applyBorderWidthCss = function(element, borderWidthCss) {
  element.style.borderWidth = borderWidthCss;
};

//border color
sap.firefly.UxGeneric.prototype.applyBorderColorCss = function(element, borderColorCss) {
  element.style.borderColor = borderColorCss;
};

//corner radius
sap.firefly.UxGeneric.prototype.applyCornerRadiusCss = function(element, cornerRadiusCss) {
  element.style.borderRadius = cornerRadiusCss;
};

//color
sap.firefly.UxGeneric.prototype.applyColorCss = function(element, color) {
  element.style.backgroundColor = color;
};

//background color
sap.firefly.UxGeneric.prototype.applyBackgroundColorCss = function(element, bgColor) {
  element.style.backgroundColor = bgColor;
};

// background image
sap.firefly.UxGeneric.prototype.applyBackgroundImageCss = function(element, bgImageSrc) {
  element.style.backgroundImage = "url(" + bgImageSrc + ")";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundSize = "cover";
};

// flex
sap.firefly.UxGeneric.prototype.applyFlexCss = function(element, flexCss) {
  element.style.flex = flexCss;
};

//align self
sap.firefly.UxGeneric.prototype.applyAlignSelfCss = function(element, alignSelfCss) {
  element.style.alignSelf = alignSelfCss;
};

//order
sap.firefly.UxGeneric.prototype.applyOrderCss = function(element, orderCss) {
  element.style.order = orderCss;
};

//opacity
sap.firefly.UxGeneric.prototype.applyOpacityCss = function(element, opacityCss) {
  element.style.opacity = opacityCss;
};

//rotation
sap.firefly.UxGeneric.prototype.applyRotationCss = function(element, rotationCss) {
  element.style.transform = "rotate(" + rotationCss + "deg)";
};

//font color
sap.firefly.UxGeneric.prototype.applyFontColorCss = function(element, fontColorCss) {
  element.style.color = fontColorCss;
};

//font size
sap.firefly.UxGeneric.prototype.applyFontSizeCss = function(element, fontSizeCss) {
  element.style.fontSize = fontSizeCss;
};

//font style
sap.firefly.UxGeneric.prototype.applyFontStyleCss = function(element, fontStyleCss) {
  element.style.fontStyle = fontStyleCss;
};

//font weight
sap.firefly.UxGeneric.prototype.applyFontWeightCss = function(element, fontWeightCss) {
  element.style.fontWeight = fontWeightCss;
};

//overflow
sap.firefly.UxGeneric.prototype.applyOverflowCss = function(element, overflowCss) {
  element.style.overflow = overflowCss;
};

//text decoration
sap.firefly.UxGeneric.prototype.applyTextDecorationCss = function(element, textDecorationCss) {
  element.style.textDecoration = textDecorationCss;
};

//icon size
sap.firefly.UxGeneric.prototype.applyIconSizeCss = function(element, iconSizeCss) {
  element.style.fontSize = iconSizeCss;
};


// *****************************************************
// *** dom css/prop helpers ****************************
// *****************************************************

sap.firefly.UxGeneric.prototype.applyCss = function(name, value) {
  if (this.getNativeControl()) {
    var element = this.getNativeControl().getDomRef();
    if (element !== null) {
      element.style[name] = value;
    }
  }
};



// ********************************************
// *** internal css property calculation ******
// ********************************************

sap.firefly.UxGeneric.prototype._calculateBorderWidthCss = function() {
  return this.getCssString(this.getBorderWidth());
};

sap.firefly.UxGeneric.prototype._calculateBorderColorCss = function() {
  return this.getCssString(this.getBorderColor());
};

sap.firefly.UxGeneric.prototype._calculateBorderStyleCss = function() {
  return this.getCssString(this.getBorderStyle());
};

sap.firefly.UxGeneric.prototype._calculateCornerRadiusCss = function() {
  return this.getCssString(this.getCornerRadius());
};

sap.firefly.UxGeneric.prototype._calculateColorCss = function() {
  return this.getCssString(this.getColor());
};

sap.firefly.UxGeneric.prototype._calculateBackgroundColorCss = function() {
  return this.getCssString(this.getBackgroundColor());
};

sap.firefly.UxGeneric.prototype._calculateAlignSelfCss = function() {
  return this.getCssString(this.getAlignSelf());
};

sap.firefly.UxGeneric.prototype._calculateOpacityCss = function() {
  var opacityCss = this.getOpacity();
  return opacityCss;
};

sap.firefly.UxGeneric.prototype._calculateRotationCss = function() {
  var rotationCss = this.getRotation();
  return rotationCss;
};

sap.firefly.UxGeneric.prototype._calculateFontColorCss = function() {
  return this.getCssString(this.getFontColor());
};

sap.firefly.UxGeneric.prototype._calculateFontSizeCss = function() {
  return this.getCssString(this.getFontSize());
};

sap.firefly.UxGeneric.prototype._calculateFontStyleCss = function() {
  return this.getCssString(this.getFontStyle());
};

sap.firefly.UxGeneric.prototype._calculateFontWeightCss = function() {
  return this.getCssString(this.getFontWeight());
};

sap.firefly.UxGeneric.prototype._calculateOverflowCss = function() {
  return this.getCssString(this.getOverflow());
};

sap.firefly.UxGeneric.prototype._calculateTextDecorationCss = function() {
  return this.getCssString(this.getTextDecoration());
};

sap.firefly.UxGeneric.prototype._calculateIconSizeCss = function() {
  return this.getCssString(this.getIconSize());
};


// *****************************************************
// *** internal css/prop helpers ***********************
// *****************************************************

sap.firefly.UxGeneric.prototype._updateControlProperty = function(fn, ui5FnName, cssValue, propName) {
  // only continue if native control exists
  if (this.getNativeControl()) {
    if (ui5FnName && this.getNativeControl()[ui5FnName]) {
      // first check if a native control setter method has been specified and use that
      this.getNativeControl()[ui5FnName](cssValue);
      sap.firefly.logDebug("[PROP UI5 SET] " + this.getId() + " | prop: " + (propName || ui5FnName) + " val: " + cssValue, sap.firefly.getGreenColor());
    } else if (fn) {
      // else, if a css modification function specified, use that
      // if css value specified then add the prop update, else remove it
      if (cssValue) {
        // add the prop function and the value
        var oldValue = this.m_propertyFunctions[propName] ? this.m_propertyFunctions[propName].cssValue : undefined;
        // only continue if new css value is not the same as the old one
        if (oldValue != cssValue) {
          var newPropUpdateObj = {};
          newPropUpdateObj.propFn = fn;
          newPropUpdateObj.cssValue = cssValue;
          this.m_propertyFunctions[propName] = newPropUpdateObj;
          this._runPropFunction(fn, cssValue); // run the prop function once when setting the property
          sap.firefly.logDebug("[PROP CSS SET] " + this.getId() + " | prop: " + (propName || ui5FnName) + " val: " + cssValue, sap.firefly.getGreenColor());
        }
      } else {
        // delete the prop function, only if it exists
        if (this.m_propertyFunctions[propName]) {
          delete this.m_propertyFunctions[propName];
          // manually rerender (invalidate) the ui5 control to retrigger an update
          this.rerenderNativeControl();
          sap.firefly.logDebug("[PROP CSS REMOVE] " + this.getId() + " | prop: " + (propName || ui5FnName), sap.firefly.getOrangeColor());
        }
      }
    }
  }
};

sap.firefly.UxGeneric.prototype._runPropFunction = function(fn, value) {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    if (fn) {
      var element = this.getNativeControl().getDomRef();
      fn.apply(this, [element, value]);
    }
  }
};


// ********************************************
// *** behaviour helpers **********************
// ********************************************

sap.firefly.UxGeneric.prototype.debounce = function(fn, time) {
  var timeout;
  var myself = this;

  var cancelDebounce = function() {
    clearTimeout(timeout);
  };

  var debounceFunc = function(oEvent) {
    var eventCopy = jQuery.extend({}, oEvent); // copy the event since ui5 releases the event object after the event fired, and we calling this with a delay.
    var functionCall = function() {
      fn.apply(myself, [eventCopy]);
      eventCopy = null; // release the event copy
    };
    var timeToWait = time;
    if (timeToWait instanceof Function) {
      timeToWait = timeToWait(); // time can be a function so we dynamically can pass the time value
    }
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, timeToWait);
  };

  debounceFunc.cancelDebounce = cancelDebounce;

  return debounceFunc;
};

sap.firefly.UxGeneric.prototype.throttle = function(fn, delay) {
  var timeoutHandler = null;

  return function() {
    if (timeoutHandler == null) {
      fn.apply(this);
      timeoutHandler = setTimeout(function() {
        clearInterval(timeoutHandler);
        timeoutHandler = null;
      }, delay);
    }
  }
};


// ********************************************
// *** drag and drop helpers ******************
// ********************************************

// file drop
sap.firefly.UxGeneric.prototype._addFileDropHandling = function() {
  // ui5 handling for file drop
  var myself = this;
  var nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.addDragDropConfig) {
    nativeControl.getMetadata().dnd.droppable = true;
    nativeControl.addDragDropConfig(new sap.ui.core.dnd.DropInfo({
      drop: function(oEvent) {
        oEvent.preventDefault();
        var oBrowserEvent = oEvent.getParameter("browserEvent");
        oBrowserEvent.stopPropagation();
        var files = oBrowserEvent.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var reader = new FileReader();
          reader.onload = function(event) {
            // onFileDrop event
            myself._fireOnFileDropEventIfPossible(file.name, file.type, event.target.result, file.size, file.lastModified);
          };
          //console.log(file);
          //console.log(file.type);
          reader.readAsText(file);
        }
      },
      dragOver: function(oEvent) {
        // just prevent default and stop propagation
        oEvent.preventDefault();
        var oBrowserEvent = oEvent.getParameter("browserEvent");
        oBrowserEvent.stopPropagation();
      },
      dragEnter: function(oEvent) {
        var oDragSession = oEvent.getParameter("dragSession");
        var oDraggedControl = oDragSession.getDragControl();
        if (oDraggedControl || oEvent.getParameters().browserEvent.dataTransfer.types.indexOf("tabledragging") > -1) {
          oEvent.preventDefault();
          var oBrowserEvent = oEvent.getParameter("browserEvent");
          oBrowserEvent.stopPropagation();
        }
      }
    }));
  }
};

sap.firefly.UxGeneric.prototype._fireOnFileDropEventIfPossible = function(fileName, fileType, fileContent, fileSize, fileLastModified) {
  if (this.getListenerOnFileDrop() !== null) {
    var newParameters = sap.firefly.XProperties.create();
    newParameters.putString(sap.firefly.UiControlEvent.PARAM_FILE_NAME, fileName);
    newParameters.putString(sap.firefly.UiControlEvent.PARAM_FILE_TYPE, fileType);
    newParameters.putString(sap.firefly.UiControlEvent.PARAM_FILE_CONTENT, fileContent);
    newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_FILE_SIZE, fileSize);
    newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_FILE_LAST_MODIFIED, fileLastModified);
    this.getListenerOnFileDrop().onFileDrop(sap.firefly.UiControlEvent.create(this, newParameters));
  }
};

// control drop
sap.firefly.UxGeneric.prototype._addControlDropHandling = function() {
  // ui5 handling for control drop
  var myself = this;
  var nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.addDragDropConfig) {
    nativeControl.getMetadata().dnd.droppable = true;
    if (!this.m_dropInfo) {
      this.m_dropInfo = new sap.ui.core.dnd.DropInfo({
        dropPosition: this._getUi5DropPosition(),
        dropEffect: this._getUi5DropEffect(),
        dropLayout: this._getUi5DropLayout(),
        targetAggregation: this._getUi5DropTargetAggregation(),
        drop: function(oEvent) {
          //console.log("dropped");
          var nativeDraggedControl = oEvent.getParameters().draggedControl;
          var nativeDroppedControl = oEvent.getParameters().droppedControl;
          var relativeDropPositionStr = oEvent.getParameters().dropPosition;
          // at least dragged control needs to be there!
          if (nativeDraggedControl) {
            myself._fireOnDropEventIfPossible(nativeDraggedControl, nativeDroppedControl, relativeDropPositionStr);
          }
        },
        dragOver: function(oEvent) {
          //  console.log("dragOver");
        },
        dragEnter: function(oEvent) {
          //    console.log("dragEnter");
          var oDragSession = oEvent.getParameter("dragSession");
          var oDraggedControl = oDragSession.getDragControl();
          // if no drag control present then it is probably not a ui5 drag event (maybe file drag event or sactable)
          if (!oDraggedControl) {
            oEvent.preventDefault();
            return;
          }
          // check if the dragged control is allowed to be dropped
          var ffDraggedControl = sap.firefly.UxGeneric.getUxControl(oDraggedControl);
          if (ffDraggedControl && myself._isDropAllowedForUiElement(ffDraggedControl) === false) {
            oEvent.preventDefault();
          }
        }
      });
      nativeControl.addDragDropConfig(this.m_dropInfo);
    }
  }
};

sap.firefly.UxGeneric.prototype._fireOnDropEventIfPossible = function(nativeDraggedControl, nativeDroppedControl, relativeDropPositionStr) {
  if (this.getListenerOnDrop() !== null) {
    var draggedControl = sap.firefly.UxGeneric.getUxControl(nativeDraggedControl);
    var droppedControl = sap.firefly.UxGeneric.getUxControl(nativeDroppedControl);
    var relativeDropPos = sap.firefly.UiRelativeDropPosition.lookup(relativeDropPositionStr);
    var newDropEvent = sap.firefly.UiDropEvent.createDrop(this, null, draggedControl, droppedControl, relativeDropPos);
    this.getListenerOnDrop().onDrop(newDropEvent);
  }
};

// drag helpers
sap.firefly.UxGeneric.prototype._addDraggable = function() {
  // ui5 handling for setting a control draggable
  var myself = this;
  var nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.addDragDropConfig) {
    nativeControl.getMetadata().dnd.draggable = true;
    // add only once
    if (!this.m_dragInfo) {
      this.m_dragInfo = new sap.ui.core.dnd.DragInfo({
        dragEnd: function(oEvent) {
          //  console.log("dragEnd");
        },
        dragStart: function(oEvent) {
          //  console.log("dragStart");
        }
      });
      nativeControl.addDragDropConfig(this.m_dragInfo);
    }
  }
};

sap.firefly.UxGeneric.prototype._removeDraggable = function() {
  // ui5 handling for removing a control draggable
  var myself = this;
  var nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.removeAllDragDropConfig) {
    nativeControl.getMetadata().dnd.draggable = false;
    if (this.m_dragInfo) {
      nativeControl.removeDragDropConfig(this.m_dragInfo);
      this.m_dragInfo = null;
    }
  }
};

// drop info helpers
sap.firefly.UxGeneric.prototype._getUi5DropPosition = function() {
  var ffDropInfo = this.getDropInfo();
  var ui5DropPos = sap.ui.core.dnd.DropPosition.On;
  if (ffDropInfo) {
    var ffDropPos = ffDropInfo.getDropPosition();
    if (ffDropPos) {
      if (ffDropPos == sap.firefly.UiDropPosition.ON) {
        ui5DropPos = sap.ui.core.dnd.DropPosition.On;
      } else if (ffDropPos == sap.firefly.UiDropPosition.BETWEEN) {
        ui5DropPos = sap.ui.core.dnd.DropPosition.Between;
      } else if (ffDropPos == sap.firefly.UiDropPosition.ON_OR_BETWEEN) {
        ui5DropPos = sap.ui.core.dnd.DropPosition.OnOrBetween;
      }
    }
  }
  return ui5DropPos;
};

sap.firefly.UxGeneric.prototype._getUi5DropEffect = function() {
  var ffDropInfo = this.getDropInfo();
  var ui5DropEffect = sap.ui.core.dnd.DropEffect.Move;
  if (ffDropInfo) {
    var ffDropEffect = ffDropInfo.getDropEffect();
    if (ffDropEffect) {
      if (ffDropEffect == sap.firefly.UiDropEffect.COPY) {
        ui5DropEffect = sap.ui.core.dnd.DropEffect.Copy;
      } else if (ffDropEffect == sap.firefly.UiDropEffect.LINK) {
        ui5DropEffect = sap.ui.core.dnd.DropEffect.Link;
      } else if (ffDropEffect == sap.firefly.UiDropEffect.MOVE) {
        ui5DropEffect = sap.ui.core.dnd.DropEffect.Move;
      } else if (ffDropEffect == sap.firefly.UiDropEffect.NONE) {
        ui5DropEffect = sap.ui.core.dnd.DropEffect.None;
      }
    }
  }
  return ui5DropEffect;
};

sap.firefly.UxGeneric.prototype._getUi5DropLayout = function() {
  var ffDropInfo = this.getDropInfo();
  var ui5DropLayout = sap.ui.core.dnd.DropLayout.Default;
  if (ffDropInfo) {
    var ffDropLayout = ffDropInfo.getDropLayout();
    if (ffDropLayout) {
      if (ffDropLayout == sap.firefly.UiDropLayout.DEFAULT) {
        ui5DropLayout = sap.ui.core.dnd.DropLayout.Default;
      } else if (ffDropLayout == sap.firefly.UiDropLayout.HORIZONTAL) {
        ui5DropLayout = sap.ui.core.dnd.DropLayout.Horizontal;
      } else if (ffDropLayout == sap.firefly.UiDropLayout.VERTICAL) {
        ui5DropLayout = sap.ui.core.dnd.DropLayout.Vertical;
      }
    }
  }
  return ui5DropLayout;
};

sap.firefly.UxGeneric.prototype._getUi5DropTargetAggregation = function() {
  var ffDropInfo = this.getDropInfo();
  var ui5TargetAggregation = null;
  if (ffDropInfo) {
    var ffTargetAggregation = ffDropInfo.getTargetAggregation();
    if (ffTargetAggregation === sap.firefly.UiAggregation.ITEMS) {
      ui5TargetAggregation = "items";
    }
  }
  return ui5TargetAggregation;
};

sap.firefly.UxGeneric.prototype._isDropAllowedForUiElement = function(uiElement) {
  var ffDropInfo = this.getDropInfo();
  if (ffDropInfo && uiElement) {
    var elementUiType = uiElement.getUiType();
    var elementTag = uiElement.getTag();
    var ffAllowedElementType = ffDropInfo.getAllowedElementType();
    var ffAllowedElementTag = ffDropInfo.getAllowedElementTag();

    if (!ffAllowedElementType) {
      // no allowed element type specified, allow all
    } else {
      if (elementUiType.isTypeOf(ffAllowedElementType)) {
        // is of type, allow type
      } else {
        return false; // is not of type, do not allow type
      }
    }

    if (!ffAllowedElementTag || ffAllowedElementTag.length === 0) {
      // no allowed element tag specified, allow all
    } else {
      if (ffAllowedElementTag === elementTag) {
        // tags are the same, allow element
      } else {
        return false; // tags do not match, do not allow element
      }
    }

  }
  return true; // no drop info specified, allow all
};

sap.firefly.UxListItemBase = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxListItemBase";
};
sap.firefly.UxListItemBase.prototype = new sap.firefly.UxGeneric();

//Base classes should have no newInstance method

sap.firefly.UxListItemBase.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
};

sap.firefly.UxListItemBase.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxListItemBase.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnClick() !== null) {
      myself.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onDblClick event
  nativeControl.ondblclick = function(oControlEvent) {
    if (myself.getListenerOnDoubleClick() !== null) {
      myself.getListenerOnDoubleClick().onDoubleClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    //on press only works when list item type is not inactive
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onDetailPress event
  nativeControl.attachDetailPress(function(oControlEvent) {
    if (myself.getListenerOnDetailPress() !== null) {
      myself.getListenerOnDetailPress().onDetailPress(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    if (myself.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      myself.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  };
};

// ======================================

sap.firefly.UxListItemBase.prototype.setEnabled = function(enabled) {
  sap.firefly.DfUiContext.prototype.setEnabled.call(this, enabled); // skip UxGeneric call since the property has a different name
  this.getNativeControl().setBlocked(!enabled);
  return this;
};

sap.firefly.UxListItemBase.prototype.isEnabled = function() {
  return sap.firefly.UxGeneric.prototype.isEnabled.call(this);
};

sap.firefly.UxListItemBase.prototype.setSelected = function(selected) {
  sap.firefly.UxGeneric.prototype.setSelected.call(this, selected);
  this.getNativeControl().setSelected(selected);
  return this;
};

sap.firefly.UxListItemBase.prototype.isSelected = function() {
  return this.getNativeControl().isSelected();
};

sap.firefly.UxListItemBase.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxListItemBase.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxListItemBase.prototype.setCounter = function(counter) {
  sap.firefly.UxGeneric.prototype.setCounter.call(this, counter);
  this.getNativeControl().setCounter(counter);
  return this;
};

sap.firefly.UxListItemBase.prototype.getCounter = function() {
  return sap.firefly.UxGeneric.prototype.getCounter.call(this);
};

sap.firefly.UxListItemBase.prototype.setHighlight = function(messageType) {
  sap.firefly.UxGeneric.prototype.setHighlight.call(this, messageType);
  var msgType = sap.ui.core.MessageType.None;
  if (messageType == sap.firefly.UiMessageType.NONE) {
    msgType = sap.ui.core.MessageType.None;
  } else if (messageType == sap.firefly.UiMessageType.ERROR) {
    msgType = sap.ui.core.MessageType.Error;
  } else if (messageType == sap.firefly.UiMessageType.INFORMATION) {
    msgType = sap.ui.core.MessageType.Information;
  } else if (messageType == sap.firefly.UiMessageType.SUCCESS) {
    msgType = sap.ui.core.MessageType.Success;
  } else if (messageType == sap.firefly.UiMessageType.WARNING) {
    msgType = sap.ui.core.MessageType.Warning;
  }
  this.getNativeControl().setHighlight(msgType);
  return this;
};

sap.firefly.UxListItemBase.prototype.getHighlight = function() {
  return sap.firefly.UxGeneric.prototype.getHighlight.call(this);
};

sap.firefly.UxListItemBase.prototype.setListItemType = function(listItemType) {
  sap.firefly.UxGeneric.prototype.setListItemType.call(this, listItemType);
  var nativeListType = sap.m.ListType.Inactive;
  if (listItemType == sap.firefly.UiListType.ACTIVE) {
    nativeListType = sap.m.ListType.Active;
  } else if (listItemType == sap.firefly.UiListType.DETAIL) {
    nativeListType = sap.m.ListType.Detail;
  } else if (listItemType == sap.firefly.UiListType.DETAIL_AND_ACTIVE) {
    nativeListType = sap.m.ListType.DetailAndActive;
  } else if (listItemType == sap.firefly.UiListType.INACTIVE) {
    nativeListType = sap.m.ListType.Inactive;
  } else if (listItemType == sap.firefly.UiListType.NAVIGATION) {
    nativeListType = sap.m.ListType.Navigation;
  }
  this.getNativeControl().setType(nativeListType);
  return this;
};

sap.firefly.UxListItemBase.prototype.getListItemType = function() {
  return sap.firefly.UxGeneric.prototype.getListItemType.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTreeItemBase = function() {
   sap.firefly.UxListItemBase.call(this);
  this._ff_c = "UxTreeItemBase";
};
sap.firefly.UxTreeItemBase.prototype = new sap.firefly.UxListItemBase();

//Base classes should have no newInstance method

sap.firefly.UxTreeItemBase.prototype.initializeNative = function() {
  sap.firefly.UxListItemBase.prototype.initializeNative.call(this);
};

sap.firefly.UxTreeItemBase.prototype.releaseObject = function() {
  sap.firefly.UxListItemBase.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTreeItemBase.prototype.addItem = function(item) {
  sap.firefly.UxListItemBase.prototype.addItem.call(this, item);
  this.createTreeModel();
  return this;
};

sap.firefly.UxTreeItemBase.prototype.insertItem = function(item, index) {
  sap.firefly.UxListItemBase.prototype.insertItem.call(this, item, index);
  this.createTreeModel();
  return this;
};

sap.firefly.UxTreeItemBase.prototype.removeItem = function(item) {
  sap.firefly.UxListItemBase.prototype.removeItem.call(this, item);
  this.createTreeModel();
  return this;
};

sap.firefly.UxTreeItemBase.prototype.clearItems = function() {
  sap.firefly.UxListItemBase.prototype.clearItems.call(this);
  this.createTreeModel();
  return this;
};

// ======================================

sap.firefly.UxTreeItemBase.prototype.setExpanded = function(expanded) {
  sap.firefly.UxListItemBase.prototype.setExpanded.call(this, expanded);
  if (expanded === true) {
    this.expandNativeItem(this);
  } else {
    this.collapseNativeItem(this);
  }
  return this;
};

sap.firefly.UxTreeItemBase.prototype.isExpanded = function() {
  if (this.getNativeControl()) {
    return this.getNativeControl().getExpanded();
  }
  return sap.firefly.UxListItemBase.prototype.isExpanded.call(this);
};

sap.firefly.UxTreeItemBase.prototype.setNode = function(node) {
  sap.firefly.UxListItemBase.prototype.setNode.call(this, node);
  if (this.getNativeControl()) {
    // this is a hack, and it does not work perfect
    // there is no way to do that in an offical way, this is the only way i currently found
    if (node) {
      this.getNativeControl().$().removeClass("sapMTreeItemBaseLeaf");
    } else {
      this.getNativeControl().$().addClass("sapMTreeItemBaseLeaf");
    }
  }
  return this;
};

sap.firefly.UxTreeItemBase.prototype.isNode = function() {
  if (this.getNativeControl()) {
    return !this.getNativeControl().isLeaf();
  }
  return sap.firefly.UxListItemBase.prototype.isNode.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTreeItemBase.prototype.createTreeModel = function() {
  if (this.getParent()) {
    this.getParent().createTreeModel();
  }
};

sap.firefly.UxTreeItemBase.prototype.expandNativeItem = function(item) {
  if (this.getParent()) {
    this.getParent().expandNativeItem(item);
  }
};

sap.firefly.UxTreeItemBase.prototype.collapseNativeItem = function(item) {
  if (this.getParent()) {
    this.getParent().collapseNativeItem(item);
  }
};

sap.firefly.UxTreeItemBase.prototype.rerenderNativeTreeItem = function() {
  if (this.getNativeControl()) {
    this.getNativeControl().destroy();
    //this.setNativeControl(null);
  }
  this.initializeNative();
  // i need to do this to make sure that newly created items have the same data
  // those controls are contantly rerendered!
  this.setEnabled(this.isEnabled());
  this.setHighlight(this.getHighlight());
  this.setSelected(this.isSelected());
  this.setVisible(this.isVisible());
  this.setBusy(this.isBusy());
  this.setListItemType(this.getListItemType());
  this.setCounter(this.getCounter());
};

sap.firefly.UxTreeItemBase.prototype.itemExpanded = function() {
  if (this.getListenerOnExpand() !== null) {
    var uiEventItem = sap.firefly.UiItemEvent.createItem(this, null, null);
    this.getListenerOnExpand().onExpand(uiEventItem);
  }
};

sap.firefly.UxTreeItemBase.prototype.itemCollapsed = function() {
  if (this.getListenerOnCollapse() !== null) {
    var uiEventItem = sap.firefly.UiItemEvent.createItem(this, null, null);
    this.getListenerOnCollapse().onCollapse(uiEventItem);
  }
};

sap.firefly.UxComboBoxBase = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxComboBoxBase";
};
sap.firefly.UxComboBoxBase.prototype = new sap.firefly.UxGeneric();

//Base classes should have no newInstance method

sap.firefly.UxComboBoxBase.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
};

sap.firefly.UxComboBoxBase.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxComboBoxBase.prototype.registerOnSelectionChange = function(listener) {
  sap.firefly.UxGeneric.prototype.registerOnSelectionChange.call(this, listener);
  this.getNativeControl().attachSelectionChange(this.handleSelectionChange.bind(this));
  return this;
};

sap.firefly.UxComboBoxBase.prototype.registerOnEnter = function(listener) {
  sap.firefly.UxGeneric.prototype.registerOnEnter.call(this, listener);
  var myself = this;
  this.getNativeControl().addEventDelegate({
    onsapenter: this.handleOnEnter.bind(this)
  });
  return this;
};

sap.firefly.UxComboBoxBase.prototype.registerOnEditingBegin = function(listener) {
  sap.firefly.UxGeneric.prototype.registerOnEditingBegin.call(this, listener);
  var myself = this;
  this.getNativeControl().addEventDelegate({
    onfocusin: this.handleOnEditingBegin.bind(this)
  });
  return this;
};

sap.firefly.UxComboBoxBase.prototype.registerOnEditingEnd = function(listener) {
  sap.firefly.UxGeneric.prototype.registerOnEditingEnd.call(this, listener);
  var myself = this;
  this.getNativeControl().addEventDelegate({
    onsapfocusleave: this.handleOnEditingEnd.bind(this)
  });
  return this;
};

// ======================================

sap.firefly.UxComboBoxBase.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxComboBoxBase.prototype.open = function() {
  sap.firefly.UxGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

sap.firefly.UxComboBoxBase.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

sap.firefly.UxComboBoxBase.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

// ======================================

sap.firefly.UxComboBoxBase.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation
  this.getNativeControl().setValue(text);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.getText = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxComboBoxBase.prototype.setPlaceholder = function(placeholder) {
  sap.firefly.UxGeneric.prototype.setPlaceholder.call(this, placeholder);
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

sap.firefly.UxComboBoxBase.prototype.setRequired = function(required) {
  sap.firefly.UxGeneric.prototype.setRequired.call(this, required);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.isRequired = function() {
  return sap.firefly.UxGeneric.prototype.isRequired.call(this);
};

sap.firefly.UxComboBoxBase.prototype.setValueState = function(valueState) {
  sap.firefly.UxGeneric.prototype.setValueState.call(this, valueState);
  var newValueState = sap.ui.core.ValueState.None;
  if (valueState === sap.firefly.UiValueState.NONE) {
    newValueState = sap.ui.core.ValueState.None;
  } else if (valueState === sap.firefly.UiValueState.ERROR) {
    newValueState = sap.ui.core.ValueState.Error;
  } else if (valueState === sap.firefly.UiValueState.INFORMATION) {
    newValueState = sap.ui.core.ValueState.Information;
  } else if (valueState === sap.firefly.UiValueState.SUCCESS) {
    newValueState = sap.ui.core.ValueState.Success;
  } else if (valueState === sap.firefly.UiValueState.WARNING) {
    newValueState = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setValueState(newValueState);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.getValueState = function() {
  return sap.firefly.UxGeneric.prototype.getValueState.call(this);
};

sap.firefly.UxComboBoxBase.prototype.setValueStateText = function(valueStateText) {
  sap.firefly.UxGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

sap.firefly.UxComboBoxBase.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

// Overrides
// ======================================

sap.firefly.UxComboBoxBase.prototype.setHeight = function(height) {
  // remove height from the object
  // don't change the Combobox height on JavaScript, it should only be done on iOS
  sap.firefly.UxGeneric.prototype.setHeight.call(this, null);
  return this;
};

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

sap.firefly.UxComboBoxBase.prototype.handleSelectionChange = function(oEvent) {
  // needs to be implemented by subclasses
};

sap.firefly.UxComboBoxBase.prototype.handleOnEnter = function(oEvent) {
  if (this.getListenerOnEnter() !== null) {
    this.getListenerOnEnter().onEnter(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxComboBoxBase.prototype.handleOnEditingBegin = function(oEvent) {
  if (this.getListenerOnEditingBegin() !== null) {
    this.getListenerOnEditingBegin().onEditingBegin(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxComboBoxBase.prototype.handleOnEditingEnd = function(oEvent) {
  if (this.getListenerOnEditingEnd() !== null) {
    this.getListenerOnEditingEnd().onEditingEnd(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxCard = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxCard";
};
sap.firefly.UxCard.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxCard.prototype.newInstance = function() {
  var object = new sap.firefly.UxCard();
  object.setup();
  return object;
};

sap.firefly.UxCard.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.ui.integration");
  var myself = this;
  var nativeControl = new sap.ui.integration.widgets.Card(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCard.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCard.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxCard.prototype.setModelJson = function(modelJson) {
  sap.firefly.UxGeneric.prototype.setModelJson.call(this, modelJson);
  var nativeModel = jsonModel.convertToNative();
  this.getNativeControl().setManifest(nativeModel);
  return this;
};

sap.firefly.UxCard.prototype.getModelJson = function() {
  return sap.firefly.UxGeneric.prototype.getModelJson.call(this);
};

sap.firefly.UxCard.prototype.setDataManifest = function(dataManifest) {
  sap.firefly.UxGeneric.prototype.setDataManifest.call(this, dataManifest);
  return this;
};

sap.firefly.UxCard.prototype.getDataManifest = function() {
  return sap.firefly.UxGeneric.prototype.getDataManifest.call(this);
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxButton = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxButton";
};
sap.firefly.UxButton.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxButton();
  object.setup();
  return object;
};

sap.firefly.UxButton.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Button(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxButton.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxButton.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onHover
  nativeControl.attachBrowserEvent("mouseenter", function(oEvent) {
    if (myself.getListenerOnHover() !== null) {
      myself.getListenerOnHover().onHover(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onHoverEnd
  nativeControl.attachBrowserEvent("mouseleave", function(oEvent) {
    if (myself.getListenerOnHoverEnd() !== null) {
      myself.getListenerOnHoverEnd().onHoverEnd(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxButton.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

// ======================================

sap.firefly.UxButton.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxButton.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxButton.prototype.setIcon = function(icon) {
  sap.firefly.UxGeneric.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxButton.prototype.getIcon = function() {
  return sap.firefly.UxGeneric.prototype.getIcon.call(this);
};

sap.firefly.UxButton.prototype.setButtonType = function(value) {
  sap.firefly.UxGeneric.prototype.setButtonType.call(this, value);
  if (value === sap.firefly.UiButtonType.DEFAULT) {
    this.getNativeControl().setType(sap.m.ButtonType.Default)
  } else if (value === sap.firefly.UiButtonType.PRIMARY) {
    this.getNativeControl().setType(sap.m.ButtonType.Emphasized)
  } else if (value === sap.firefly.UiButtonType.SUCCESS) {
    this.getNativeControl().setType(sap.m.ButtonType.Accept)
  } else if (value === sap.firefly.UiButtonType.TRANSPARENT) {
    this.getNativeControl().setType(sap.m.ButtonType.Transparent)
  } else if (value === sap.firefly.UiButtonType.DESTRUCTIVE) {
    this.getNativeControl().setType(sap.m.ButtonType.Reject)
  }
  return this;
};

sap.firefly.UxButton.prototype.getButtonType = function() {
  return sap.firefly.UxGeneric.prototype.getButtonType.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxButton.prototype.applyHeightCss = function(element, heightCss) {
  element.style.height = heightCss;
  // adjust icon and text to be in the center vertically
  $(element).find(".sapMBtnInner").css("height", "100%");
  $(element).find(".sapMBtnInner").css("display", "flex");
  $(element).find(".sapMBtnInner").css("justify-content", "center");
  $(element).find(".sapMBtnInner").css("align-items", "center");
};

sap.firefly.UxButton.prototype.applyBackgroundColorCss = function(element, bgColor) {
  $(element).find(".sapMBtnInner").css("background-color", bgColor);
};

// Helpers
// ======================================

sap.firefly.UxToggleButton = function() {
   sap.firefly.UxButton.call(this);
  this._ff_c = "UxToggleButton";
};
sap.firefly.UxToggleButton.prototype = new sap.firefly.UxButton();

sap.firefly.UxToggleButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxToggleButton();
  object.setup();
  return object;
};

sap.firefly.UxToggleButton.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this); //call UxGeneric directly, we want to skip the UxButton initialize method call here since we create a different control
  var myself = this;
  var nativeControl = new sap.m.ToggleButton(this.getId());

  // add unique style class to distinguish the toggle button from a normal button
  nativeControl.addStyleClass("ffToggleButton");

  this._addEvents(nativeControl);

  this.setNativeControl(nativeControl);
};

// ======================================

sap.firefly.UxToggleButton.prototype.setPressed = function(pressed) {
  sap.firefly.UxButton.prototype.setPressed.call(this, pressed);
  this.getNativeControl().setPressed(pressed);
  return this;
};

sap.firefly.UxToggleButton.prototype.isPressed = function() {
  return this.getNativeControl().getPressed();
};

// ToggleButton inherits from Button and it has the same base properties and events

sap.firefly.UxImage = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxImage";
};
sap.firefly.UxImage.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxImage.prototype.newInstance = function() {
  var object = new sap.firefly.UxImage();
  object.setup();
  return object;
};

sap.firefly.UxImage.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Image(this.getId());
  nativeControl.setDensityAware(false);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxImage.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxImage.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxImage.prototype.setSrc = function(src) {
  sap.firefly.UxGeneric.prototype.setSrc.call(this, src);
  if (src === null || src.length <= 0) {
    this.getNativeControl().setSrc(null);
  } else {
    this.getNativeControl().setSrc(src);
  }
  return this;
};

sap.firefly.UxImage.prototype.getSrc = function() {
  return sap.firefly.UxGeneric.prototype.getSrc.call(this);
};

sap.firefly.UxImage.prototype.setRotation = function(rotation) {
  sap.firefly.UxGeneric.prototype.setRotation.call(this, rotation);
  //not supported by the ui5 control?
  return this;
};

sap.firefly.UxImage.prototype.getRotation = function() {
  return sap.firefly.UxGeneric.prototype.getRotation.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxImage.prototype.applyCustomCssStyling = function(element) {
  // when the image control is rendered in the IMG tag mode then we need to add this additional css so that the image fits the container and has the correct aspec ratio
  // probably not needed in BACKGROUND IMG mode? Currently anyway the IMG tag is the only mode we support!
  element.style.objectFit = "cover";
};

// Helpers
// ======================================

sap.firefly.UxIcon = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxIcon";

  this.m_isEndIcon = false;
};
sap.firefly.UxIcon.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxIcon.prototype.newInstance = function() {
  var object = new sap.firefly.UxIcon();
  object.setup();
  return object;
};

sap.firefly.UxIcon.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.core.Icon(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxIcon.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxIcon.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null && myself.isEnabled() === true) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onHover
  nativeControl.attachBrowserEvent("mouseenter", function(oEvent) {
    if (myself.getListenerOnHover() !== null) {
      myself.getListenerOnHover().onHover(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onHoverEnd
  nativeControl.attachBrowserEvent("mouseleave", function(oEvent) {
    if (myself.getListenerOnHoverEnd() !== null) {
      myself.getListenerOnHoverEnd().onHoverEnd(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxIcon.prototype.setTooltip = function(tooltip) {
  sap.firefly.UxGeneric.prototype.setTooltip.call(this, tooltip);
  // when someone sets a tooltip then disable automatic tooltip
  // that way when a tooltip is not set then the automatic will be used
  // this is only required for the UxIcon control
  this.getNativeControl().setUseIconTooltip(false);
  return this;
};

sap.firefly.UxIcon.prototype.setColor = function(color) {
  sap.firefly.UxGeneric.prototype.setColor.call(this, color);
  return this;
};

sap.firefly.UxIcon.prototype.getColor = function() {
  return sap.firefly.UxGeneric.prototype.getColor.call(this);
};

sap.firefly.UxIcon.prototype.setIconSize = function(iconSize) {
  sap.firefly.UxGeneric.prototype.setIconSize.call(this, iconSize);
  return this;
};

sap.firefly.UxIcon.prototype.getIconSize = function() {
  return sap.firefly.UxGeneric.prototype.getIconSize.call(this);
};

sap.firefly.UxIcon.prototype.setHeight = function(height) {
  sap.firefly.UxGeneric.prototype.setHeight.call(this, height);
  // use the height as the icon size to simplify the api
  var heightCss = this.calculateHeightCss();
  if (heightCss !== null) {
    this.getNativeControl().setSize(heightCss);
  }
  return this;
};

sap.firefly.UxIcon.prototype.setEnabled = function(enabled) {
  sap.firefly.DfUiContext.prototype.setEnabled.call(this, enabled); // must skip UxGeneric superclass class since the property does not exist on the icon control

  // trigger a manual rerender (invalidate) to update styling
  this.rerenderNativeControl();

  // additional end icon styling
  this._applyIconStyles();

  return this;
};

sap.firefly.UxIcon.prototype.isEnabled = function() {
  return sap.firefly.DfUiContext.prototype.isEnabled.call(this); // must skip UxGeneric superclass class since the property does not exist on the icon control
};


// Overrides
// ======================================

sap.firefly.UxIcon.prototype.setIcon = function(icon) {
  sap.firefly.DfUiContext.prototype.setIcon.call(this, icon);
  var iconUri = sap.firefly.UxGeneric.getUi5IconUri(icon);
  this.getNativeControl().setSrc(iconUri); //different prop name
  return this;
};

// Control specific style and attribute handling
// ======================================

sap.firefly.UxIcon.prototype.applyCustomCssStyling = function(element) {
  if (this.isEnabled() === true) {
    element.style.cursor = null;
  } else {
    element.style.cursor = "default";
  }
};

sap.firefly.UxIcon.prototype.applyCustomAttributes = function(element) {
  if (this.isEnabled() === true) {
    $(element).attr("tabIndex", 0);
    element.style.outline = null;
  } else {
    $(element).attr("tabIndex", -1); // prevent disabled icon to be focused, tab tabIndex="-1" makes an element non focusable
    element.style.outline = "none";
  }
};

// Helpers
// ======================================

// called by the endIcons aggregation owner (currently only input) to add special endicon styling
sap.firefly.UxIcon.prototype.setIsEndIcon = function(endIcon) {
  this.m_isEndIcon = endIcon;
  this._applyIconStyles();
};

sap.firefly.UxIcon.prototype.isEndIcon = function() {
  return this.m_isEndIcon;
};

sap.firefly.UxIcon.prototype._applyIconStyles = function() {
  if ((this.isEnabled() === true && this.isEndIcon() === true) || (this.isEnabled() === false && this.isEndIcon() === false)) {
    this.getNativeControl().setHoverBackgroundColor(null);
    this.getNativeControl().setActiveColor(null);
  } else {
    this.getNativeControl().setHoverBackgroundColor("transparent");
    this.getNativeControl().setActiveColor("#666666");
  }
};

sap.firefly.UxText = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxText";
};
sap.firefly.UxText.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxText.prototype.newInstance = function() {
  var object = new sap.firefly.UxText();
  object.setup();
  return object;
};

sap.firefly.UxText.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.TextArea(this.getId());
  nativeControl.setEditable(false);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxText.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxText.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxText.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation
  this.getNativeControl().setValue(text);
  return this;
};

sap.firefly.UxText.prototype.getText = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxText.prototype.setEnabled = function(enabled) {
  sap.firefly.DfUiContext.prototype.setEnabled.call(this, enabled); // skip superclass implementation
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxText.prototype.isEnabled = function() {
  return this.getNativeControl().getEditable();
};

sap.firefly.UxText.prototype.setFontSize = function(fontSize) {
  sap.firefly.UxGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

sap.firefly.UxText.prototype.getFontSize = function() {
  return sap.firefly.UxGeneric.prototype.getFontSize.call(this);
};

sap.firefly.UxText.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

sap.firefly.UxText.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxText.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.UxGeneric.prototype.setFontWeight.call(this, fontWeight);
  return this;
};

sap.firefly.UxText.prototype.getFontWeight = function() {
  return sap.firefly.UxGeneric.prototype.getFontWeight.call(this);
};

sap.firefly.UxText.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.UxGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

sap.firefly.UxText.prototype.getFontStyle = function() {
  return sap.firefly.UxGeneric.prototype.getFontStyle.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxText.prototype.applyBackgroundColorCss = function(element, bgColor) {
  $(element).find(".sapMInputBaseInner").css("background-color", bgColor);
};

// special font color handling
sap.firefly.UxText.prototype.applyFontColorCss = function(element, fontColorCss) {
  $(element).find("textarea").css("color", fontColorCss);
};

// special font size handling
sap.firefly.UxText.prototype.applyFontSizeCss = function(element, fontSizeCss) {
  $(element).find("textarea").css("font-size", fontSizeCss);
};

// special font style handling
sap.firefly.UxText.prototype.applyFontStyleCss = function(element, fontStyleCss) {
  $(element).find("textarea").css("font-style", fontStyleCss);
};

// special font weight handling
sap.firefly.UxText.prototype.applyFontWeightCss = function(element, fontWeightCss) {
  $(element).find("textarea").css("font-weight", fontWeightCss);
};

// Helpers
// ======================================

sap.firefly.UxTextArea = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTextArea";
};
sap.firefly.UxTextArea.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTextArea.prototype.newInstance = function() {
  var object = new sap.firefly.UxTextArea();
  object.setup();
  return object;
};

sap.firefly.UxTextArea.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.TextArea(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTextArea.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTextArea.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onLiveChange event
  nativeControl.attachLiveChange(
    this.debounce(function(oEvent) {
      if (myself.getListenerOnLiveChange() !== null) {
        var newValue = oEvent.getParameters().newValue;
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
        myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
      }
    }, function() { // debounce time is a function, so dynamic time can be passed
      return myself.getDebounceTime();
    })
  );

  //onPaste event
  nativeControl.onpaste = function(event) {
    if (myself.getListenerOnPaste() !== null) {
      var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("text/plain");
      // i need to make a timeout so that firs the data is pasted and it could be replaced afterwards
      setTimeout(function() {
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_PASTED_DATA, pastedData);
        myself.getListenerOnPaste().onPaste(sap.firefly.UiControlEvent.create(myself, newParameters));
      }, 0);
    }
  };

  // onEnter, onFocusIn, onFocusOut events
  nativeControl.addEventDelegate({
    onsapenter: function() {
      if (myself.getListenerOnEnter() !== null) {
        myself.getListenerOnEnter().onEnter(sap.firefly.UiControlEvent.create(myself));
      }
    },
    onfocusin: function() {
      if (myself.getListenerOnEditingBegin() !== null) {
        myself.getListenerOnEditingBegin().onEditingBegin(sap.firefly.UiControlEvent.create(myself));
      }
    },
    onsapfocusleave: function() {
      if (myself.getListenerOnEditingEnd() !== null) {
        myself.getListenerOnEditingEnd().onEditingEnd(sap.firefly.UiControlEvent.create(myself));
      }
    }
  });
};

// ======================================

sap.firefly.UxTextArea.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

// ======================================

sap.firefly.UxTextArea.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation
  this.getNativeControl().setValue(text);
  return this;
};

sap.firefly.UxTextArea.prototype.getText = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxTextArea.prototype.setPlaceholder = function(placeholder) {
  sap.firefly.UxGeneric.prototype.setPlaceholder.call(this, placeholder)
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

sap.firefly.UxTextArea.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

sap.firefly.UxTextArea.prototype.setMaxLength = function(maxLength) {
  sap.firefly.UxGeneric.prototype.setMaxLength.call(this, maxLength)
  this.getNativeControl().setMaxLength(maxLength);
  return this;
};

sap.firefly.UxTextArea.prototype.getMaxLength = function() {
  return sap.firefly.UxGeneric.prototype.getMaxLength.call(this)
};

sap.firefly.UxTextArea.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxTextArea.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this)
};

sap.firefly.UxTextArea.prototype.setFontSize = function(fontSize) {
  sap.firefly.UxGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

sap.firefly.UxTextArea.prototype.getFontSize = function() {
  return sap.firefly.UxGeneric.prototype.getFontSize.call(this);
};

sap.firefly.UxTextArea.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

sap.firefly.UxTextArea.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxTextArea.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.UxGeneric.prototype.setFontWeight.call(this, fontWeight);
  return this;
};

sap.firefly.UxTextArea.prototype.getFontWeight = function() {
  return sap.firefly.UxGeneric.prototype.getFontWeight.call(this);
};

sap.firefly.UxTextArea.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.UxGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

sap.firefly.UxTextArea.prototype.getFontStyle = function() {
  return sap.firefly.UxGeneric.prototype.getFontStyle.call(this);
};

sap.firefly.UxTextArea.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxTextArea.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

sap.firefly.UxTextArea.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxTextArea.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxTextArea.prototype.applyBackgroundColorCss = function(element, bgColor) {
  $(element).find(".sapMInputBaseInner").css("background-color", bgColor);
};

// special font color handling
sap.firefly.UxTextArea.prototype.applyFontColorCss = function(element, fontColorCss) {
  $(element).find("textarea").css("color", fontColorCss);
};

// special font size handling
sap.firefly.UxTextArea.prototype.applyFontSizeCss = function(element, fontSizeCss) {
  $(element).find("textarea").css("font-size", fontSizeCss);
};

// special font style handling
sap.firefly.UxTextArea.prototype.applyFontStyleCss = function(element, fontStyleCss) {
  $(element).find("textarea").css("font-style", fontStyleCss);
};

// special font weight handling
sap.firefly.UxTextArea.prototype.applyFontWeightCss = function(element, fontWeightCss) {
  $(element).find("textarea").css("font-weight", fontWeightCss);
};

// Helpers
// ======================================

sap.firefly.UxCodeEditor = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxCodeEditor";
};
sap.firefly.UxCodeEditor.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxCodeEditor.prototype.newInstance = function() {
  var object = new sap.firefly.UxCodeEditor();
  object.setup();
  return object;
};

sap.firefly.UxCodeEditor.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.ui.codeeditor");
  var myself = this;
  var nativeControl = new sap.ui.codeeditor.CodeEditor(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCodeEditor.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCodeEditor.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onLiveChange event
  nativeControl.attachLiveChange(
    this.debounce(function(oEvent) {
      if (myself.getListenerOnLiveChange() !== null) {
        var newValue = oEvent.getParameters().value;
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
        myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
      }
    }, function() { // debounce time is a function, so dynamic time can be passed
      return myself.getDebounceTime();
    })
  );

  //onPaste event
  nativeControl.onpaste = function(event) {
    if (myself.getListenerOnPaste() !== null) {
      var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("text/plain");
      // i need to make a timeout so that first the data is pasted and it could be replaced afterwards
      setTimeout(function() {
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_PASTED_DATA, pastedData);
        myself.getListenerOnPaste().onPaste(sap.firefly.UiControlEvent.create(myself, newParameters));
      }, 0);
    }
  };

  // onEnter, onFocusIn, onFocusOut events
  nativeControl.addEventDelegate({
    onsapenter: function() {
      if (myself.getListenerOnEnter() !== null) {
        myself.getListenerOnEnter().onEnter(sap.firefly.UiControlEvent.create(myself));
      }
    },
    onfocusin: function() {
      if (myself.getListenerOnEditingBegin() !== null) {
        myself.getListenerOnEditingBegin().onEditingBegin(sap.firefly.UiControlEvent.create(myself));
      }
    },
    onsapfocusleave: function() {
      if (myself.getListenerOnEditingEnd() !== null) {
        myself.getListenerOnEditingEnd().onEditingEnd(sap.firefly.UiControlEvent.create(myself));
      }
    }
  });
};

// ======================================

sap.firefly.UxCodeEditor.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

// ======================================

sap.firefly.UxCodeEditor.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation
  this.getNativeControl().setValue(text);
  return this;
};

sap.firefly.UxCodeEditor.prototype.getText = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxCodeEditor.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxCodeEditor.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this);
};

sap.firefly.UxCodeEditor.prototype.setEnabled = function(enabled) {
  // there is no enabbled property on the code editor so i just forward this to the editable property
  this.setEditable(enabled);
  return this;
};

sap.firefly.UxCodeEditor.prototype.isEnabled = function() {
  return this.isEditable();
};

sap.firefly.UxCodeEditor.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxCodeEditor.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

sap.firefly.UxCodeEditor.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxCodeEditor.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

sap.firefly.UxCodeEditor.prototype.setCodeType = function(codeType) {
  sap.firefly.UxGeneric.prototype.setCodeType.call(this, codeType);
  this.getNativeControl().setType(codeType);
  return this;
};

sap.firefly.UxCodeEditor.prototype.getCodeType = function() {
  return this.getNativeControl().getType();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxInput = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxInput";

  this.m_liveChangeDebounce = null;
};
sap.firefly.UxInput.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxInput.prototype.newInstance = function() {
  var object = new sap.firefly.UxInput();
  object.setup();
  return object;
};

sap.firefly.UxInput.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Input(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxInput.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxInput.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onLiveChange event
  // prepare the debounce function
  this.m_liveChangeDebounce = this.debounce(function(oEvent) {
    if (myself.getListenerOnLiveChange() !== null) {
      var newValue = oEvent.getParameters().newValue;
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
      myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  }, function() { // debounce time is a function, so dynamic time can be passed
    return myself.getDebounceTime();
  });

  // attach the live change event
  nativeControl.attachLiveChange(this.m_liveChangeDebounce);

  // onSuggestionItemSelect event
  nativeControl.attachSuggestionItemSelected(function(oEvent) {
    if (myself.getListenerOnSuggestionSelect() !== null) {
      var selectedNativeItem = oEvent.getParameters().selectedItem;
      var selectedItem = sap.firefly.UxGeneric.getUxControl(selectedNativeItem);
      var theEvent = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedItem);
      myself.getListenerOnSuggestionSelect().onSuggestionSelect(theEvent);
    }
  });

  //onPaste event
  nativeControl.onpaste = function(event) {
    if (myself.getListenerOnPaste() !== null) {
      var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("text/plain");
      // i need to make a timeout so that first the data is pasted and it could be replaced afterwards
      setTimeout(function() {
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_PASTED_DATA, pastedData);
        myself.getListenerOnPaste().onPaste(sap.firefly.UiControlEvent.create(myself, newParameters));
      }, 0);
    }
  };

  // onEnter, onFocusIn, onFocusOut events
  nativeControl.addEventDelegate({
    onsapenter: function(oEvent) {
      if (myself.getListenerOnEnter() !== null) {
        var isIcon = $(oEvent.target).hasClass("sapUiIcon");
        // do not fire onEnter event when enter on an EndIcon is pressed
        if (isIcon == false) {
          myself.m_liveChangeDebounce.cancelDebounce(); // cancel the debounce if it was fired (prevent debounce fire after enter was pressed)
          myself.getListenerOnEnter().onEnter(sap.firefly.UiControlEvent.create(myself));
        }
      }
    },
    onfocusin: function() {
      if (myself.getListenerOnEditingBegin() !== null) {
        myself.getListenerOnEditingBegin().onEditingBegin(sap.firefly.UiControlEvent.create(myself));
      }
    },
    onsapfocusleave: function() {
      if (myself.getListenerOnEditingEnd() !== null) {
        myself.getListenerOnEditingEnd().onEditingEnd(sap.firefly.UiControlEvent.create(myself));
      }
    }
  });
};

// ======================================

sap.firefly.UxInput.prototype.addSuggestion = function(suggestionItem) {
  sap.firefly.UxGeneric.prototype.addSuggestion.call(this, suggestionItem);
  this.getNativeControl().setShowSuggestion(true);
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().addSuggestionItem(nativeChild);
  return this;
};

sap.firefly.UxInput.prototype.insertSuggestion = function(suggestionItem, index) {
  sap.firefly.UxGeneric.prototype.insertSuggestion.call(this, suggestionItem, index);
  this.getNativeControl().setShowSuggestion(true);
  var nativeChild = suggestionItem.getNativeControl();
  //this.getNativeControl().insertSuggestionItem(nativeChild, index); // Ui5 bug? they swap index and object so this does not work i need to swap them like below
  this.getNativeControl().insertSuggestionItem(index, nativeChild);
  return this;
};

sap.firefly.UxInput.prototype.removeSuggestion = function(suggestionItem) {
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().removeSuggestionItem(nativeChild);
  sap.firefly.UxGeneric.prototype.removeSuggestion.call(this, suggestionItem);
  return this;
};

sap.firefly.UxInput.prototype.clearSuggestions = function() {
  sap.firefly.UxGeneric.prototype.clearSuggestions.call(this);
  this.getNativeControl().removeAllSuggestionItems();
  return this;
};

// ======================================

sap.firefly.UxInput.prototype.addEndIcon = function(endIcon) {
  sap.firefly.UxGeneric.prototype.addEndIcon.call(this, endIcon);
  endIcon.setIsEndIcon(true); // helper method from UxIcon
  var nativeChild = endIcon.getNativeControl();
  this._prepareEndIcons();
  if (nativeChild) {
    nativeChild.addStyleClass(sap.m.InputBase.ICON_CSS_CLASS);
    this.getNativeControl().addAggregation("_endIcon", nativeChild);
  }
  return this;
};

sap.firefly.UxInput.prototype.insertEndIcon = function(endIcon, index) {
  sap.firefly.UxGeneric.prototype.insertEndIcon.call(this, endIcon, index);
  endIcon.setIsEndIcon(true); // helper method from UxIcon
  var nativeChild = endIcon.getNativeControl();
  this._prepareEndIcons();
  if (nativeChild) {
    nativeChild.addStyleClass(sap.m.InputBase.ICON_CSS_CLASS);
    this.getNativeControl().insertAggregation("_endIcon", nativeChild, index);
  }
  return this;
};

sap.firefly.UxInput.prototype.removeEndIcon = function(endIcon) {
  endIcon.setIsEndIcon(false); // helper method from UxIcon
  var nativeChild = endIcon.getNativeControl();
  if (nativeChild) {
    this.getNativeControl().removeAggregation("_endIcon", nativeChild);
  }
  sap.firefly.UxGeneric.prototype.removeEndIcon.call(this, endIcon);
  return this;
};

sap.firefly.UxInput.prototype.clearEndIcons = function() {
  for (var i = index + 1; i < this.getEndIcons().size(); i++) {
    var tmpEndIcon = this.getEndIcons().get(i);
    tmpEndIcon.setIsEndIcon(false); // helper method from UxIcon
  }

  sap.firefly.UxGeneric.prototype.clearEndIcons.call(this);
  this.getNativeControl().removeAllAggregation("_endIcon");
  return this;
};

// ======================================

sap.firefly.UxInput.prototype.showSuggestions = function() {
  sap.firefly.UxGeneric.prototype.showSuggestions.call(this);
  this.getNativeControl().showItems();
  return this;
};

sap.firefly.UxInput.prototype.closeSuggestions = function() {
  sap.firefly.UxGeneric.prototype.closeSuggestions.call(this);
  this.getNativeControl().closeSuggestions();
  return this;
};

sap.firefly.UxInput.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

sap.firefly.UxInput.prototype.selectText = function(startIndex, endIndex) {
  sap.firefly.UxGeneric.prototype.selectText.call(this, startIndex, endIndex);
  this.getNativeControl().selectText(startIndex, endIndex);
  return this;
};

// ======================================

sap.firefly.UxInput.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setValue(text);
  return this;
};

sap.firefly.UxInput.prototype.getText = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxInput.prototype.setPlaceholder = function(placeholder) {
  sap.firefly.UxGeneric.prototype.setPlaceholder.call(this, placeholder);
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

sap.firefly.UxInput.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

sap.firefly.UxInput.prototype.setMaxLength = function(maxLength) {
  sap.firefly.UxGeneric.prototype.setMaxLength.call(this, maxLength);
  this.getNativeControl().setMaxLength(maxLength);
  return this;
};

sap.firefly.UxInput.prototype.getMaxLength = function() {
  return sap.firefly.UxGeneric.prototype.getMaxLength.call(this);
};

sap.firefly.UxInput.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxInput.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this);
};

sap.firefly.UxInput.prototype.setInputType = function(inputType) {
  sap.firefly.UxGeneric.prototype.setInputType.call(this, inputType);
  var newInputTypeValue = sap.m.InputType.Text;
  if (inputType === sap.firefly.UiInputType.TEXT) {
    newInputTypeValue = sap.m.InputType.Text;
  } else if (inputType === sap.firefly.UiInputType.NUMBER) {
    newInputTypeValue = sap.m.InputType.Number;
  } else if (inputType === sap.firefly.UiInputType.TIME) {
    newInputTypeValue = sap.m.InputType.Time;
  } else if (inputType === sap.firefly.UiInputType.DATE) {
    newInputTypeValue = sap.m.InputType.Date;
  } else if (inputType === sap.firefly.UiInputType.PASSWORD) {
    newInputTypeValue = sap.m.InputType.Password;
  } else if (inputType === sap.firefly.UiInputType.EMAIL) {
    newInputTypeValue = sap.m.InputType.Email;
  } else if (inputType === sap.firefly.UiInputType.URL) {
    newInputTypeValue = sap.m.InputType.Url;
  }
  this.getNativeControl().setType(newInputTypeValue);
  return this;
};

sap.firefly.UxInput.prototype.getInputType = function() {
  return sap.firefly.UxGeneric.prototype.getInputType.call(this);
};

sap.firefly.UxInput.prototype.setRequired = function(required) {
  sap.firefly.UxGeneric.prototype.setRequired.call(this, required);
  return this;
};

sap.firefly.UxInput.prototype.isRequired = function() {
  return sap.firefly.UxGeneric.prototype.isRequired.call(this);
};

sap.firefly.UxInput.prototype.setFontSize = function(fontSize) {
  sap.firefly.UxGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

sap.firefly.UxInput.prototype.getFontSize = function() {
  return sap.firefly.UxGeneric.prototype.getFontSize.call(this);
};

sap.firefly.UxInput.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

sap.firefly.UxInput.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxInput.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.UxGeneric.prototype.setFontWeight.call(this, fontWeight);
  return this;
};

sap.firefly.UxInput.prototype.getFontWeight = function() {
  return sap.firefly.UxGeneric.prototype.getFontWeight.call(this);
};

sap.firefly.UxInput.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.UxGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

sap.firefly.UxInput.prototype.getFontStyle = function() {
  return sap.firefly.UxGeneric.prototype.getFontStyle.call(this);
};

sap.firefly.UxInput.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxInput.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

sap.firefly.UxInput.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxInput.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

sap.firefly.UxInput.prototype.setValueState = function(valueState) {
  sap.firefly.UxGeneric.prototype.setValueState.call(this, valueState);
  var newValueState = sap.ui.core.ValueState.None;
  if (valueState === sap.firefly.UiValueState.NONE) {
    newValueState = sap.ui.core.ValueState.None;
  } else if (valueState === sap.firefly.UiValueState.ERROR) {
    newValueState = sap.ui.core.ValueState.Error;
  } else if (valueState === sap.firefly.UiValueState.INFORMATION) {
    newValueState = sap.ui.core.ValueState.Information;
  } else if (valueState === sap.firefly.UiValueState.SUCCESS) {
    newValueState = sap.ui.core.ValueState.Success;
  } else if (valueState === sap.firefly.UiValueState.WARNING) {
    newValueState = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setValueState(newValueState);
  return this;
};

sap.firefly.UxInput.prototype.getValueState = function() {
  return sap.firefly.UxGeneric.prototype.getValueState.call(this);
};

sap.firefly.UxInput.prototype.setValueStateText = function(valueStateText) {
  sap.firefly.UxGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

sap.firefly.UxInput.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxInput.prototype.applyCustomCssStyling = function(element) {
  // input has some weird issue in desktop mode, it is not positioned in the midlle so i do it manually
  if (this.getUiStyleClass() === sap.firefly.UiStyleClass.DESKTOP) {
    element.style.display = "flex";
    element.style.alignItems = "center";
  }

  // endicons styling adjustments
  if (this.getEndIconCount() > 0) {
    // set the icon container height to always be 100%
    // for some reason when the input field is read only they set the height of the end icon to 0 which breaks the end icons when editable is false
    $(element).find(".sapMInputBaseIconContainer").css("height", "100%");

    // also we need to extend the size for the icons, each icon has a size of 32px, only if there are more then 1 icon
    if (this.getEndIconCount() > 1) {
      // make sure the private method _calculateIconsSpace is available, if yes, then use it to get the space, else caluclate the sapce manually
      var iconSpaceFromUi5 = this.getNativeControl()._calculateIconsSpace ? this.getNativeControl()._calculateIconsSpace() : 0;
      if (iconSpaceFromUi5 === 0) {
        iconSpaceFromUi5 = 32 * this.getEndIconCount();
      }
      var iconSpace = iconSpaceFromUi5 + "px";
      $(element).find(".sapMInputBaseInner").css("width", "calc(100% - " + iconSpace + ")");
    }
  }
};

sap.firefly.UxInput.prototype.applyCustomAttributes = function(element) {
  //add the autocomplete="off" attribute to the input to disable browser autocompletition
  $(element).find("input").attr("autocomplete", "off");
};

// special background color styling handling
sap.firefly.UxInput.prototype.applyBackgroundColorCss = function(element, bgColor) {
  $(element).find(".sapMInputBaseContentWrapper").css("background-color", bgColor);
};

//special border style handling
sap.firefly.UxInput.prototype.applyBorderStyleCss = function(element, borderStyleCss) {
  $(element).find(".sapMInputBaseContentWrapper").css("border-style", borderStyleCss);
};

//special border width handling
sap.firefly.UxInput.prototype.applyBorderWidthCss = function(element, borderWidthCss) {
  $(element).find(".sapMInputBaseContentWrapper").css("border-width", borderWidthCss);
};

//special border color handling
sap.firefly.UxInput.prototype.applyBorderColorCss = function(element, borderColorCss) {
  $(element).find(".sapMInputBaseContentWrapper").css("border-color", borderColorCss);
};

// special font color handling
sap.firefly.UxInput.prototype.applyFontColorCss = function(element, fontColorCss) {
  $(element).find("input").css("color", fontColorCss);
};

// special font size handling
sap.firefly.UxInput.prototype.applyFontSizeCss = function(element, fontSizeCss) {
  $(element).find("input").css("font-size", fontSizeCss);
};

// special font style handling
sap.firefly.UxInput.prototype.applyFontStyleCss = function(element, fontStyleCss) {
  $(element).find("input").css("font-style", fontStyleCss);
};

// special font weight handling
sap.firefly.UxInput.prototype.applyFontWeightCss = function(element, fontWeightCss) {
  $(element).find("input").css("font-weight", fontWeightCss);
};

// Helpers
// ======================================

sap.firefly.UxInput.prototype._prepareEndIcons = function() {
  //  if this is the first end icon which we are adding then do this as required step, without this the end icon does not appear
  // https://github.com/SAP/openui5/blob/367acb922f9ae2707cda0e88afffd1fc028e8928/src/sap.m/src/sap/m/DatePicker.js#L398-L402
  if (this.getEndIconCount() === 1) {
    var oValueHelpIcon = this.getNativeControl()._getValueHelpIcon();
    if (oValueHelpIcon) {
      oValueHelpIcon.setProperty("visible", this.getNativeControl().getEditable(), true);
    }

    // manually trigger a rerender for the css styling to apply
    this.rerenderNativeControl();
  }
};

sap.firefly.UxSuggestionItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSuggestionItem";
};
sap.firefly.UxSuggestionItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSuggestionItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxSuggestionItem();
  object.setup();
  return object;
};

sap.firefly.UxSuggestionItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  // Extends: sap.ui.core.Item, needs to be sap.m.SuggestionItem in order to be used in input and searchfield
  var nativeControl = new sap.m.SuggestionItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSuggestionItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSuggestionItem.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxSuggestionItem.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxSuggestionItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxSearchField = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSearchField";

  this.m_liveChangeDebounce = null;
};
sap.firefly.UxSearchField.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSearchField.prototype.newInstance = function() {
  var object = new sap.firefly.UxSearchField();
  object.setup();
  return object;
};

sap.firefly.UxSearchField.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.SearchField(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSearchField.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSearchField.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // required for the suggestion popup to open
  nativeControl.attachSuggest(function(oEvent) {
    var searchValue = oEvent.getParameter("suggestValue");
    // i need to do my own suggestion filter to update the suggestion list only with the items that fit the search Value
    // this is a different behaviour to sap.m.Input where this filtering is happening automatically
    myself._filterSuggestions(searchValue);
    nativeControl.suggest();
  });

  // onLiveChange event
  // prepare the debounce function
  this.m_liveChangeDebounce = this.debounce(function(oEvent) {
    if (myself.getListenerOnLiveChange() !== null) {
      var newValue = oEvent.getParameters().newValue;
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
      myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  }, function() { // debounce time is a function, so dynamic time can be passed
    return myself.getDebounceTime();
  });

  // attach the live change event
  nativeControl.attachLiveChange(this.m_liveChangeDebounce);

  //onSearch and onSuggestionItemSelect events
  nativeControl.attachSearch(function(oEvent) {
    var selectedSuggestionItem = oEvent.getParameters().suggestionItem;
    var clearButtonPressed = oEvent.getParameters().clearButtonPressed;
    var searchText = oEvent.getParameters().query || "";

    if (clearButtonPressed) {
      // if clear button pressed then i need to remove the suggestion filter
      myself._filterSuggestions("");
      nativeControl.suggest();
    }

    // onSearch event
    if (myself.getListenerOnSearch() !== null) {
      myself.m_liveChangeDebounce.cancelDebounce(); // cancel the debounce if it was fired (prevent debounce fire after enter was pressed)
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_SEARCH_TEXT, searchText);
      newParameters.putBoolean(sap.firefly.UiControlEvent.PARAM_CLEAR_BUTTON_PRESSED, clearButtonPressed);
      myself.getListenerOnSearch().onSearch(sap.firefly.UiControlEvent.create(myself, newParameters));
    }

    // onSuggestionItemSelect event
    if (selectedSuggestionItem != null) {
      if (myself.getListenerOnSuggestionSelect() !== null) {
        var selectedSuggestionItem = sap.firefly.UxGeneric.getUxControl(selectedSuggestionItem);
        var theEvent = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedSuggestionItem);
        myself.getListenerOnSuggestionSelect().onSuggestionSelect(theEvent);
      }
    }
  });

  //onPaste event
  nativeControl.onpaste = function(event) {
    if (myself.getListenerOnPaste() !== null) {
      var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("text/plain");
      // i need to make a timeout so that firs the data is pasted and it could be replaced afterwards
      setTimeout(function() {
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_PASTED_DATA, pastedData);
        myself.getListenerOnPaste().onPaste(sap.firefly.UiControlEvent.create(myself, newParameters));
      }, 0);
    }
  };

  // onFocusIn, onFocusOut events
  nativeControl.addEventDelegate({
    onfocusin: function() {
      if (myself.getListenerOnEditingBegin() !== null) {
        myself.getListenerOnEditingBegin().onEditingBegin(sap.firefly.UiControlEvent.create(myself));
      }
    },
    onsapfocusleave: function() {
      if (myself.getListenerOnEditingEnd() !== null) {
        myself.getListenerOnEditingEnd().onEditingEnd(sap.firefly.UiControlEvent.create(myself));
      }
    }
  });
};

// ======================================

sap.firefly.UxSearchField.prototype.addSuggestion = function(suggestionItem) {
  sap.firefly.UxGeneric.prototype.addSuggestion.call(this, suggestionItem);
  this.getNativeControl().setEnableSuggestions(true);
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().addSuggestionItem(nativeChild);
  return this;
};

sap.firefly.UxSearchField.prototype.insertSuggestion = function(suggestionItem, index) {
  sap.firefly.UxGeneric.prototype.insertSuggestion.call(this, suggestionItem, index);
  this.getNativeControl().setEnableSuggestions(true);
  var nativeChild = suggestionItem.getNativeControl();
  //this.getNativeControl().insertSuggestionItem(nativeChild, index); // Ui5 bug? they swap index and object so this does not work i need to swap them like below
  this.getNativeControl().insertSuggestionItem(index, nativeChild);
  return this;
};

sap.firefly.UxSearchField.prototype.removeSuggestion = function(suggestionItem) {
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().removeSuggestionItem(nativeChild);
  sap.firefly.UxGeneric.prototype.removeSuggestion.call(this, suggestionItem);
  return this;
};

sap.firefly.UxSearchField.prototype.clearSuggestions = function() {
  sap.firefly.UxGeneric.prototype.clearSuggestions.call(this);
  this.getNativeControl().removeAllSuggestionItems();
  return this;
};

// ======================================

sap.firefly.UxSearchField.prototype.showSuggestions = function() {
  sap.firefly.UxGeneric.prototype.showSuggestions.call(this);
  this.getNativeControl().suggest();
  return this;
};

sap.firefly.UxSearchField.prototype.closeSuggestions = function() {
  sap.firefly.UxGeneric.prototype.closeSuggestions.call(this);
  this.getNativeControl().exit();
  return this;
};

sap.firefly.UxSearchField.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

// ======================================

sap.firefly.UxSearchField.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setValue(text);
  return this;
};

sap.firefly.UxSearchField.prototype.getText = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxSearchField.prototype.setPlaceholder = function(placeholder) {
  sap.firefly.UxGeneric.prototype.setPlaceholder.call(this, placeholder);
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

sap.firefly.UxSearchField.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

sap.firefly.UxSearchField.prototype.setMaxLength = function(maxLength) {
  sap.firefly.UxGeneric.prototype.setMaxLength.call(this, maxLength);
  this.getNativeControl().setMaxLength(maxLength);
  return this;
};

sap.firefly.UxSearchField.prototype.getMaxLength = function() {
  return sap.firefly.UxGeneric.prototype.getMaxLength.call(this);
};

sap.firefly.UxSearchField.prototype.setRequired = function(required) {
  sap.firefly.UxGeneric.prototype.setRequired.call(this, required);
  return this;
};

sap.firefly.UxSearchField.prototype.isRequired = function() {
  return sap.firefly.UxGeneric.prototype.isRequired.call(this);
};

sap.firefly.UxSearchField.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxSearchField.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

sap.firefly.UxSearchField.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxSearchField.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxSearchField.prototype._filterSuggestions = function(searchValue) {
  if (this.hasSuggestions()) {
    var origNativeSuggestions = [];
    for (var i = 0; i < this.getSuggestions().size(); i++) {
      origNativeSuggestions.push(this.getSuggestion(i).getNativeControl());
    }

    var filterdNativeSuggestions = origNativeSuggestions.filter(function(suggestionItem) {
      return suggestionItem.getText().indexOf(searchValue) !== -1;
    });

    this.getNativeControl().removeAllSuggestionItems();

    for (var i = 0; i < filterdNativeSuggestions.length; i++) {
      this.getNativeControl().addSuggestionItem(filterdNativeSuggestions[i]);
    }
  }
};

sap.firefly.UxCheckbox = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxCheckbox";
};
sap.firefly.UxCheckbox.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxCheckbox.prototype.newInstance = function() {
  var object = new sap.firefly.UxCheckbox();
  object.setup();
  return object;
};

sap.firefly.UxCheckbox.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.CheckBox(this.getId());
  nativeControl.setUseEntireWidth(true); // apply width to the whole control, not just label

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCheckbox.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCheckbox.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxCheckbox.prototype.setChecked = function(checked) {
  sap.firefly.UxGeneric.prototype.setChecked.call(this, checked);
  this.getNativeControl().setSelected(checked);
  return this;
};

sap.firefly.UxCheckbox.prototype.isChecked = function() {
  return this.getNativeControl().getSelected();
};

sap.firefly.UxCheckbox.prototype.setPartiallyChecked = function(partiallyChecked) {
  sap.firefly.UxGeneric.prototype.setPartiallyChecked.call(this, partiallyChecked);
  this.getNativeControl().setPartiallySelected(partiallyChecked);
  return this;
};

sap.firefly.UxCheckbox.prototype.isPartiallyChecked = function() {
  return this.getNativeControl().getPartiallySelected();
};

sap.firefly.UxCheckbox.prototype.setWrapping = function(wrapping) {
  sap.firefly.UxGeneric.prototype.setWrapping.call(this, wrapping);
  this.getNativeControl().setWrapping(wrapping);
  return this;
};

sap.firefly.UxCheckbox.prototype.isWrapping = function() {
  return sap.firefly.UxGeneric.prototype.isWrapping.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxSwitch = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSwitch";
};
sap.firefly.UxSwitch.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSwitch.prototype.newInstance = function() {
  var object = new sap.firefly.UxSwitch();
  object.setup();
  return object;
};

sap.firefly.UxSwitch.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Switch(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSwitch.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSwitch.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxSwitch.prototype.setOn = function(isOn) {
  sap.firefly.UxGeneric.prototype.setOn.call(this, isOn);
  this.getNativeControl().setState(isOn);
  return this;
};

sap.firefly.UxSwitch.prototype.isOn = function() {
  return this.getNativeControl().getState();
};

sap.firefly.UxSwitch.prototype.setOnText = function(onText) {
  sap.firefly.UxGeneric.prototype.setOnText.call(this, onText);
  this.getNativeControl().setCustomTextOn(onText);
  return this;
};

sap.firefly.UxSwitch.prototype.getOnText = function() {
  return sap.firefly.UxGeneric.prototype.getOnText.call(this);
};

sap.firefly.UxSwitch.prototype.setOffText = function(offText) {
  sap.firefly.UxGeneric.prototype.setOffText.call(this, offText);
  this.getNativeControl().setCustomTextOff(offText);
  return this;
};

sap.firefly.UxSwitch.prototype.getOffText = function() {
  return sap.firefly.UxGeneric.prototype.getOffText.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxLabel = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxLabel";
};
sap.firefly.UxLabel.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxLabel.prototype.newInstance = function() {
  var object = new sap.firefly.UxLabel();
  object.setup();
  return object;
};

sap.firefly.UxLabel.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Label(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxLabel.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxLabel.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxLabel.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxLabel.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxLabel.prototype.setRequired = function(required) {
  sap.firefly.UxGeneric.prototype.setRequired.call(this, required);
  return this;
};

sap.firefly.UxLabel.prototype.isRequired = function() {
  return sap.firefly.UxGeneric.prototype.isRequired.call(this);
};

sap.firefly.UxLabel.prototype.setFontSize = function(fontSize) {
  sap.firefly.UxGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

sap.firefly.UxLabel.prototype.getFontSize = function() {
  return sap.firefly.UxGeneric.prototype.getFontSize.call(this);
};

sap.firefly.UxLabel.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

sap.firefly.UxLabel.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxLabel.prototype.setTextAlign = function(textAlign) {
  sap.firefly.UxGeneric.prototype.setTextAlign.call(this, textAlign);
  var newTextAlign = null;
  if (textAlign === sap.firefly.UiTextAlign.LEFT) {
    newTextAlign = sap.ui.core.TextAlign.Left;
  } else if (textAlign === sap.firefly.UiTextAlign.RIGHT) {
    newTextAlign = sap.ui.core.TextAlign.Right;
  } else if (textAlign === sap.firefly.UiTextAlign.CENTER) {
    newTextAlign = sap.ui.core.TextAlign.Center;
  }
  this.getNativeControl().setTextAlign(newTextAlign);
  return this;
};

sap.firefly.UxLabel.prototype.getTextAlign = function() {
  return sap.firefly.UxGeneric.prototype.getTextAlign.call(this);
};

sap.firefly.UxLabel.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.UxGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

sap.firefly.UxLabel.prototype.getFontStyle = function() {
  return sap.firefly.UxGeneric.prototype.getFontStyle.call(this);
};

sap.firefly.UxLabel.prototype.setWrapping = function(wrapping) {
  sap.firefly.UxGeneric.prototype.setWrapping.call(this, wrapping);
  this.getNativeControl().setWrapping(wrapping);
  return this;
};

sap.firefly.UxLabel.prototype.isWrapping = function() {
  return sap.firefly.UxGeneric.prototype.isWrapping.call(this);
};

// Overrides
// ======================================

sap.firefly.UxLabel.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.DfUiContext.prototype.setFontWeight.call(this, fontWeight); // no need for css
  var newDesign = sap.m.LabelDesign.Standard;
  if (fontWeight === sap.firefly.UiFontWeight.NORMAL) {
    newDesign = sap.m.LabelDesign.Standard;
  } else if (fontWeight === sap.firefly.UiFontWeight.BOLD) {
    newDesign = sap.m.LabelDesign.Bold;
  }
  this.getNativeControl().setDesign(newDesign);
  return this;
};

// Control specific style and attribute handling
// ======================================

sap.firefly.UxLabel.prototype.applyTextDecorationCss = function(element, textDecorationCss) {
  $(element).find(".sapMLabelTextWrapper").css("text-decoration", textDecorationCss);
};

// Helpers
// ======================================

sap.firefly.UxRadioButton = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxRadioButton";
};
sap.firefly.UxRadioButton.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxRadioButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxRadioButton();
  object.setup();
  return object;
};

sap.firefly.UxRadioButton.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.RadioButton(this.getId());
  nativeControl.setGroupName("ffGlobalRadioButtonGroup");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxRadioButton.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxRadioButton.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelect event
  nativeControl.attachSelect(function(oControlEvent) {
    if (myself.getListenerOnChange() !== null) {
      // timeout is needed to fix an call order issue (possible sapui5 bug), first wait that the correct values are set and then sent out the event.
      setTimeout(function() {
        myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
      }, 1);
    }
  });
};

// ======================================

sap.firefly.UxRadioButton.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxRadioButton.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxRadioButton.prototype.setSelected = function(selected) {
  sap.firefly.UxGeneric.prototype.setSelected.call(this, selected);
  this.getNativeControl().setSelected(selected);
  return this;
};

sap.firefly.UxRadioButton.prototype.isSelected = function() {
  return this.getNativeControl().getSelected();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxRadioButtonGroup = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxRadioButtonGroup";
};
sap.firefly.UxRadioButtonGroup.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxRadioButtonGroup.prototype.newInstance = function() {
  var object = new sap.firefly.UxRadioButtonGroup();
  object.setup();
  return object;
};

sap.firefly.UxRadioButtonGroup.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.RadioButtonGroup(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxRadioButtonGroup.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxRadioButtonGroup.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelect event
  nativeControl.attachSelect(function(oControlEvent) {
    // onSelect event
    if (myself.getListenerOnSelect() !== null) {
      var selectedItemIndex = oControlEvent.getParameters().selectedIndex;
      var selectedItem = myself.getRadioButton(selectedItemIndex);
      var theEvent = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedItem);
      myself.getListenerOnSelect().onSelect(theEvent);
    }
  });
};

// ======================================

sap.firefly.UxRadioButtonGroup.prototype.addRadioButton = function(radioButton) {
  sap.firefly.UxGeneric.prototype.addRadioButton.call(this, radioButton);
  var nativeChild = radioButton.getNativeControl();
  this.getNativeControl().addButton(nativeChild);
  return this;
};

sap.firefly.UxRadioButtonGroup.prototype.insertRadioButton = function(radioButton, index) {
  sap.firefly.UxGeneric.prototype.insertRadioButton.call(this, radioButton, index);
  var nativeChild = radioButton.getNativeControl();
  this.getNativeControl().insertButton(nativeChild, index);
  return this;
};

sap.firefly.UxRadioButtonGroup.prototype.removeRadioButton = function(radioButton) {
  var nativeChild = radioButton.getNativeControl();
  this.getNativeControl().removeButton(nativeChild);
  sap.firefly.UxGeneric.prototype.removeRadioButton.call(this, radioButton);
  return this;
};

sap.firefly.UxRadioButtonGroup.prototype.clearRadioButtons = function() {
  sap.firefly.UxGeneric.prototype.clearRadioButtons.call(this);
  this.getNativeControl().removeAllButtons();
  return this;
};

// ======================================

sap.firefly.UxRadioButtonGroup.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item == null) {
    this.getNativeControl().setSelectedButton(null);
  } else {
    this.getNativeControl().setSelectedButton(item.getNativeControl());
  }
  return this;
};

sap.firefly.UxRadioButtonGroup.prototype.getSelectedItem = function() {
  var selectedItem = this.getNativeControl().getSelectedButton();
  if (selectedItem != null) {
    return sap.firefly.UxGeneric.getUxControl(selectedItem);
  }
  return null;
};

// ======================================

sap.firefly.UxRadioButtonGroup.prototype.setColumnCount = function(columnCount) {
  sap.firefly.UxGeneric.prototype.setColumnCount.call(this, columnCount);
  if (columnCount > 0) {
    this.getNativeControl().setColumns(columnCount);
  }
  return this;
};

sap.firefly.UxRadioButtonGroup.prototype.getColumnCount = function() {
  if (this.getNativeControl() != null) {
    return this.getNativeControl().getColumns();
  }
  return sap.firefly.UxGeneric.prototype.getColumnCount.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxLink = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxLink";
};
sap.firefly.UxLink.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxLink.prototype.newInstance = function() {
  var object = new sap.firefly.UxLink();
  object.setup();
  return object;
};

sap.firefly.UxLink.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Link(this.getId());
  nativeControl.setTarget("_blank");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxLink.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxLink.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxLink.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxLink.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxLink.prototype.setFontSize = function(fontSize) {
  sap.firefly.UxGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

sap.firefly.UxLink.prototype.getFontSize = function() {
  return sap.firefly.UxGeneric.prototype.getFontSize.call(this);
};

sap.firefly.UxLink.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

sap.firefly.UxLink.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxLink.prototype.setTextAlign = function(textAlign) {
  sap.firefly.UxGeneric.prototype.setTextAlign.call(this, textAlign);
  if (textAlign === sap.firefly.UiTextAlign.LEFT) {
    this.getNativeControl().setTextAlign(sap.ui.core.TextAlign.Left);
  } else if (textAlign === sap.firefly.UiTextAlign.RIGHT) {
    this.getNativeControl().setTextAlign(sap.ui.core.TextAlign.Right);
  } else if (textAlign === sap.firefly.UiTextAlign.CENTER) {
    this.getNativeControl().setTextAlign(sap.ui.core.TextAlign.Center);
  }
  return this;
};

sap.firefly.UxLink.prototype.getTextAlign = function() {
  return sap.firefly.UxGeneric.prototype.getTextAlign.call(this);
};

sap.firefly.UxLink.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.UxGeneric.prototype.setFontWeight.call(this, fontWeight);
  return this;
};

sap.firefly.UxLink.prototype.getFontWeight = function() {
  return sap.firefly.UxGeneric.prototype.getFontWeight.call(this);
};

sap.firefly.UxLink.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.UxGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

sap.firefly.UxLink.prototype.getFontStyle = function() {
  return sap.firefly.UxGeneric.prototype.getFontStyle.call(this);
};

sap.firefly.UxLink.prototype.setWrapping = function(wrapping) {
  sap.firefly.UxGeneric.prototype.setWrapping.call(this, wrapping);
  this.getNativeControl().setWrapping(wrapping);
  return this;
};

sap.firefly.UxLink.prototype.isWrapping = function() {
  return sap.firefly.UxGeneric.prototype.isWrapping.call(this);
};

sap.firefly.UxLink.prototype.setSrc = function(src) {
  sap.firefly.UxGeneric.prototype.setSrc.call(this, src);
  this.getNativeControl().setHref(src);
  return this;
};

sap.firefly.UxLink.prototype.getSrc = function() {
  return sap.firefly.UxGeneric.prototype.getSrc.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxDatePicker = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxDatePicker";

  this.m_liveChangeDebounce = null;
};
sap.firefly.UxDatePicker.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxDatePicker.prototype.newInstance = function() {
  var object = new sap.firefly.UxDatePicker();
  object.setup();
  return object;
};

sap.firefly.UxDatePicker.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.DatePicker(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxDatePicker.prototype.releaseObject = function() {
  this.m_liveChangeDebounce.cancelDebounce(); // cancel any active debounce functions
  this.getJQueryObject().off("keyup"); // deregister from keyup events
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxDatePicker.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    myself.m_liveChangeDebounce.cancelDebounce(); // cancel any active debounce functions

    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onLiveChange event
  // prepare the debounce function
  this.m_liveChangeDebounce = this.debounce(function(oEvent) { // attach the new keyup event
    // when enter press then do not fire onlivechange event since this already triggers the onChange event
    if (oEvent.code === "Enter") {
      return;
    }
    if (myself.getListenerOnLiveChange() !== null) {
      if (myself.getNativeControl() && myself.getNativeControl()._parseValue && myself.getNativeControl()._formatValue) {
        // update the internal date picker model, but do not trigger the control rerendering
        var inputVal = myself.getNativeControl()._$input.val();
        var dateValue = myself.getNativeControl()._parseValue(inputVal, true);
        if (dateValue) {
          var formattedValue = myself.getNativeControl()._formatValue(dateValue, true);
          myself.getNativeControl().setProperty('value', formattedValue, true); // no rendering
          myself.getNativeControl().setProperty('dateValue', dateValue, true); // no rendering
        } else {
          myself.getNativeControl().setProperty('value', inputVal, true); // no rendering
          myself.getNativeControl().setProperty('dateValue', null, true); // no rendering
        }
        // create and send the onlivechange event
        var newValue = myself.getNativeControl().getValue();
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
        myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
      } else {
        sap.firefly.logCritical("UxDatePicker - sap.m.DatePicker is missing the private _parseValue or _formatValue method required for the custom onLiveChange event! Cannot fire live change event!")
      }
    }
  }, function() { // debounce time is a function, so dynamic time can be passed
    return myself.getDebounceTime();
  })

  // == CUSTOM == use jquery to attach the keyup event for onlivechange simulation
  nativeControl.addEventDelegate({
    onAfterRendering: function() {
      myself.getJQueryObject().off("keyup"); // deregister any previous keyup events
      myself.getJQueryObject().on("keyup", myself.m_liveChangeDebounce);
    }
  });
};

// ======================================

sap.firefly.UxDatePicker.prototype.setValue = function(value) {
  sap.firefly.DfUiContext.prototype.setValue.call(this, value); // skip superclass implementation
  this.getNativeControl().setValue(value);
  return this;
};

sap.firefly.UxDatePicker.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxDatePicker.prototype.setValueFormat = function(valueFormat) {
  sap.firefly.UxGeneric.prototype.setValueFormat.call(this, valueFormat);
  this.getNativeControl().setValueFormat(valueFormat);
  return this;
};

sap.firefly.UxDatePicker.prototype.getValueFormat = function() {
  return sap.firefly.UxGeneric.prototype.getValueFormat.call(this);
};

sap.firefly.UxDatePicker.prototype.setDisplayFormat = function(displayFormat) {
  sap.firefly.UxGeneric.prototype.setDisplayFormat.call(this, displayFormat);
  this.getNativeControl().setDisplayFormat(displayFormat);
  return this;
};

sap.firefly.UxDatePicker.prototype.getDisplayFormat = function() {
  return sap.firefly.UxGeneric.prototype.getDisplayFormat.call(this);
};

sap.firefly.UxDatePicker.prototype.setMinDate = function(minDate) {
  sap.firefly.UxGeneric.prototype.setMinDate.call(this, minDate);
  var dateObject = new Date(minDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

sap.firefly.UxDatePicker.prototype.getMinDate = function() {
  return sap.firefly.UxGeneric.prototype.getMinDate.call(this);
};

sap.firefly.UxDatePicker.prototype.setMaxDate = function(maxDate) {
  sap.firefly.UxGeneric.prototype.setMaxDate.call(this, maxDate);
  var dateObject = new Date(maxDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

sap.firefly.UxDatePicker.prototype.getMaxDate = function() {
  return sap.firefly.UxGeneric.prototype.getMaxDate.call(this);
};

sap.firefly.UxDatePicker.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxDatePicker.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this);
};

sap.firefly.UxDatePicker.prototype.setValueState = function(valueState) {
  sap.firefly.UxGeneric.prototype.setValueState.call(this, valueState);
  var newValueState = sap.ui.core.ValueState.None;
  if (valueState === sap.firefly.UiValueState.NONE) {
    newValueState = sap.ui.core.ValueState.None;
  } else if (valueState === sap.firefly.UiValueState.ERROR) {
    newValueState = sap.ui.core.ValueState.Error;
  } else if (valueState === sap.firefly.UiValueState.INFORMATION) {
    newValueState = sap.ui.core.ValueState.Information;
  } else if (valueState === sap.firefly.UiValueState.SUCCESS) {
    newValueState = sap.ui.core.ValueState.Success;
  } else if (valueState === sap.firefly.UiValueState.WARNING) {
    newValueState = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setValueState(newValueState);
  return this;
};

sap.firefly.UxDatePicker.prototype.getValueState = function() {
  return sap.firefly.UxGeneric.prototype.getValueState.call(this);
};

sap.firefly.UxDatePicker.prototype.setValueStateText = function(valueStateText) {
  sap.firefly.UxGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

sap.firefly.UxDatePicker.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

sap.firefly.UxDatePicker.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxDatePicker.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTimePicker = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTimePicker";

  this.m_liveChangeDebounce = null;
};
sap.firefly.UxTimePicker.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTimePicker.prototype.newInstance = function() {
  var object = new sap.firefly.UxTimePicker();
  object.setup();
  return object;
};

sap.firefly.UxTimePicker.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.TimePicker(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTimePicker.prototype.releaseObject = function() {
  this.m_liveChangeDebounce.cancelDebounce(); // cancel any active debounce functions
  this.getJQueryObject().off("keyup"); // deregister from keyup events
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTimePicker.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange Event
  nativeControl.attachChange(function(oEvent) {
    myself.m_liveChangeDebounce.cancelDebounce(); // cancel any active debounce functions

    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onLiveChange event
  // prepare the debounce function
  this.m_liveChangeDebounce = this.debounce(function(oEvent) { // attach the new keyup event
    // when enter press then do not fire onlivechange event since this already triggers the onChange event
    if (oEvent.code === "Enter") {
      return;
    }
    if (myself.getListenerOnLiveChange() !== null) {
      if (myself.getNativeControl() && myself.getNativeControl()._parseValue && myself.getNativeControl()._formatValue) {
        // update the internal date picker model, but do not trigger the control rerendering
        var inputVal = myself.getNativeControl()._$input.val();
        var dateValue = myself.getNativeControl()._parseValue(inputVal, true);
        if (dateValue) {
          var formattedValue = myself.getNativeControl()._formatValue(dateValue, true);
          myself.getNativeControl().setProperty('value', formattedValue, true); // no rendering
          myself.getNativeControl().setProperty('dateValue', dateValue, true); // no rendering
        } else {
          myself.getNativeControl().setProperty('value', inputVal, true); // no rendering
          myself.getNativeControl().setProperty('dateValue', null, true); // no rendering
        }
        // create and send the onlivechange event
        var newValue = myself.getNativeControl().getValue();
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
        myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
      } else {
        sap.firefly.logCritical("UxTimePicker - sap.m.TimePicker is missing the private _parseValue or _formatValue method required for the custom onLiveChange event! Cannot fire live change event!")
      }
    }
  }, function() { // debounce time is a function, so dynamic time can be passed
    return myself.getDebounceTime();
  })

  // == CUSTOM == use jquery to attach the keyup event for onlivechange simulation
  nativeControl.addEventDelegate({
    onAfterRendering: function() {
      myself.getJQueryObject().off("keyup"); // deregister any previous keyup events
      myself.getJQueryObject().on("keyup", myself.m_liveChangeDebounce);
    }
  });
};

// ======================================

sap.firefly.UxTimePicker.prototype.setValue = function(value) {
  sap.firefly.DfUiContext.prototype.setValue.call(this, value); // skip superclass implementation
  this.getNativeControl().setValue(value);
  return this;
};

sap.firefly.UxTimePicker.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxTimePicker.prototype.setValueFormat = function(valueFormat) {
  sap.firefly.UxGeneric.prototype.setValueFormat.call(this, valueFormat);
  this.getNativeControl().setValueFormat(valueFormat);
  return this;
};

sap.firefly.UxTimePicker.prototype.getValueFormat = function() {
  return sap.firefly.UxGeneric.prototype.getValueFormat.call(this);
};

sap.firefly.UxTimePicker.prototype.setDisplayFormat = function(displayFormat) {
  sap.firefly.UxGeneric.prototype.setDisplayFormat.call(this, displayFormat);
  this.getNativeControl().setDisplayFormat(displayFormat);
  return this;
};

sap.firefly.UxTimePicker.prototype.getDisplayFormat = function() {
  return sap.firefly.UxGeneric.prototype.getDisplayFormat.call(this);
};

sap.firefly.UxTimePicker.prototype.setMinutesInterval = function(minInterval) {
  sap.firefly.UxGeneric.prototype.setMinutesInterval.call(this, minInterval);
  this.getNativeControl().setMinutesStep(minInterval);
  return this;
};

sap.firefly.UxTimePicker.prototype.getMinutesInterval = function() {
  return sap.firefly.UxGeneric.prototype.getMinutesInterval.call(this);
};

sap.firefly.UxTimePicker.prototype.setSecondsInterval = function(secInterval) {
  sap.firefly.UxGeneric.prototype.setSecondsInterval.call(this, secInterval);
  this.getNativeControl().setSecondsStep(secInterval);
  return this;
};

sap.firefly.UxTimePicker.prototype.getSecondsInterval = function() {
  return sap.firefly.UxGeneric.prototype.getSecondsInterval.call(this);
};

sap.firefly.UxTimePicker.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxTimePicker.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this);
};

sap.firefly.UxTimePicker.prototype.setValueState = function(valueState) {
  sap.firefly.UxGeneric.prototype.setValueState.call(this, valueState);
  var newValueState = sap.ui.core.ValueState.None;
  if (valueState === sap.firefly.UiValueState.NONE) {
    newValueState = sap.ui.core.ValueState.None;
  } else if (valueState === sap.firefly.UiValueState.ERROR) {
    newValueState = sap.ui.core.ValueState.Error;
  } else if (valueState === sap.firefly.UiValueState.INFORMATION) {
    newValueState = sap.ui.core.ValueState.Information;
  } else if (valueState === sap.firefly.UiValueState.SUCCESS) {
    newValueState = sap.ui.core.ValueState.Success;
  } else if (valueState === sap.firefly.UiValueState.WARNING) {
    newValueState = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setValueState(newValueState);
  return this;
};

sap.firefly.UxTimePicker.prototype.getValueState = function() {
  return sap.firefly.UxGeneric.prototype.getValueState.call(this);
};

sap.firefly.UxTimePicker.prototype.setValueStateText = function(valueStateText) {
  sap.firefly.UxGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

sap.firefly.UxTimePicker.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

sap.firefly.UxTimePicker.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxTimePicker.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxDateTimePicker = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxDateTimePicker";

  this.m_liveChangeDebounce = null;
};
sap.firefly.UxDateTimePicker.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxDateTimePicker.prototype.newInstance = function() {
  var object = new sap.firefly.UxDateTimePicker();
  object.setup();
  return object;
};

sap.firefly.UxDateTimePicker.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.DateTimePicker(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxDateTimePicker.prototype.releaseObject = function() {
  this.m_liveChangeDebounce.cancelDebounce(); // cancel any active debounce functions
  this.getJQueryObject().off("keyup"); // deregister from keyup events
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxDateTimePicker.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    myself.m_liveChangeDebounce.cancelDebounce(); // cancel any active debounce functions

    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onLiveChange event
  // prepare the debounce function
  this.m_liveChangeDebounce = this.debounce(function(oEvent) { // attach the new keyup event
    // when enter press then do not fire onlivechange event since this already triggers the onChange event
    if (oEvent.code === "Enter") {
      return;
    }
    if (myself.getListenerOnLiveChange() !== null) {
      if (myself.getNativeControl() && myself.getNativeControl()._parseValue && myself.getNativeControl()._formatValue) {
        // update the internal date picker model, but do not trigger the control rerendering
        var inputVal = myself.getNativeControl()._$input.val();
        var dateValue = myself.getNativeControl()._parseValue(inputVal, true);
        if (dateValue) {
          var formattedValue = myself.getNativeControl()._formatValue(dateValue, true);
          myself.getNativeControl().setProperty('value', formattedValue, true); // no rendering
          myself.getNativeControl().setProperty('dateValue', dateValue, true); // no rendering
        } else {
          myself.getNativeControl().setProperty('value', inputVal, true); // no rendering
          myself.getNativeControl().setProperty('dateValue', null, true); // no rendering
        }
        // create and send the onlivechange event
        var newValue = myself.getNativeControl().getValue();
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_VALUE, newValue);
        myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself, newParameters));
      } else {
        sap.firefly.logCritical("UxDateTimePicker - sap.m.DateTimePicker is missing the private _parseValue or _formatValue method required for the custom onLiveChange event! Cannot fire live change event!")
      }
    }
  }, function() { // debounce time is a function, so dynamic time can be passed
    return myself.getDebounceTime();
  })

  // == CUSTOM == use jquery to attach the keyup event for onlivechange simulation
  nativeControl.addEventDelegate({
    onAfterRendering: function() {
      myself.getJQueryObject().off("keyup"); // deregister any previous keyup events
      myself.getJQueryObject().on("keyup", myself.m_liveChangeDebounce);
    }
  });
};

// ======================================

sap.firefly.UxDateTimePicker.prototype.setValue = function(value) {
  sap.firefly.DfUiContext.prototype.setValue.call(this, value); // skip superclass implementation
  this.getNativeControl().setValue(value);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxDateTimePicker.prototype.setValueFormat = function(valueFormat) {
  sap.firefly.UxGeneric.prototype.setValueFormat.call(this, valueFormat);
  this.getNativeControl().setValueFormat(valueFormat);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getValueFormat = function() {
  return sap.firefly.UxGeneric.prototype.getValueFormat.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setDisplayFormat = function(displayFormat) {
  sap.firefly.UxGeneric.prototype.setDisplayFormat.call(this, displayFormat);
  this.getNativeControl().setDisplayFormat(displayFormat);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getDisplayFormat = function() {
  return sap.firefly.UxGeneric.prototype.getDisplayFormat.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setMinDate = function(minDate) {
  sap.firefly.UxGeneric.prototype.setMinDate.call(this, minDate);
  var dateObject = new Date(minDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getMinDate = function() {
  return sap.firefly.UxGeneric.prototype.getMinDate.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setMaxDate = function(maxDate) {
  sap.firefly.UxGeneric.prototype.setMaxDate.call(this, maxDate);
  var dateObject = new Date(maxDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getMaxDate = function() {
  return sap.firefly.UxGeneric.prototype.getMaxDate.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setMinutesInterval = function(minInterval) {
  sap.firefly.UxGeneric.prototype.setMinutesInterval.call(this, minInterval);
  this.getNativeControl().setMinutesStep(minInterval);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getMinutesInterval = function() {
  return sap.firefly.UxGeneric.prototype.getMinutesInterval.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setSecondsInterval = function(secInterval) {
  sap.firefly.UxGeneric.prototype.setSecondsInterval.call(this, secInterval);
  this.getNativeControl().setSecondsStep(secInterval);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getSecondsInterval = function() {
  return sap.firefly.UxGeneric.prototype.getSecondsInterval.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setValueState = function(valueState) {
  sap.firefly.UxGeneric.prototype.setValueState.call(this, valueState);
  var newValueState = sap.ui.core.ValueState.None;
  if (valueState === sap.firefly.UiValueState.NONE) {
    newValueState = sap.ui.core.ValueState.None;
  } else if (valueState === sap.firefly.UiValueState.ERROR) {
    newValueState = sap.ui.core.ValueState.Error;
  } else if (valueState === sap.firefly.UiValueState.INFORMATION) {
    newValueState = sap.ui.core.ValueState.Information;
  } else if (valueState === sap.firefly.UiValueState.SUCCESS) {
    newValueState = sap.ui.core.ValueState.Success;
  } else if (valueState === sap.firefly.UiValueState.WARNING) {
    newValueState = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setValueState(newValueState);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getValueState = function() {
  return sap.firefly.UxGeneric.prototype.getValueState.call(this);
};

sap.firefly.UxDateTimePicker.prototype.setValueStateText = function(valueStateText) {
  sap.firefly.UxGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

sap.firefly.UxDateTimePicker.prototype.setDebounceTime = function(debounceTime) {
  sap.firefly.UxGeneric.prototype.setDebounceTime.call(this, debounceTime);
  return this;
};

sap.firefly.UxDateTimePicker.prototype.getDebounceTime = function() {
  return sap.firefly.UxGeneric.prototype.getDebounceTime.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxCalendar = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxCalendar";
};
sap.firefly.UxCalendar.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxCalendar.prototype.newInstance = function() {
  var object = new sap.firefly.UxCalendar();
  object.setup();
  return object;
};

sap.firefly.UxCalendar.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.unified.Calendar(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCalendar.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCalendar.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelect event
  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxCalendar.prototype.setStartDate = function(startDate) {
  sap.firefly.UxGeneric.prototype.setStartDate.call(this, startDate);
  this.getNativeControl().removeAllSelectedDates();
  var dateRangeObj = this._generateCurrentDateRangeObject();
  this.getNativeControl().addSelectedDate(dateRangeObj);
  this.getNativeControl().focusDate(dateRangeObj.getStartDate());
  return this;
};

sap.firefly.UxCalendar.prototype.getStartDate = function() {
  var selectedDates = this.getNativeControl().getSelectedDates();
  if (selectedDates.length > 0) {
    var selectedDate = selectedDates[0];
    var startDate = selectedDate.getStartDate();
    var valFormat = this.getValueFormat() || "yyyy-MM-dd";
    var dateFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
      pattern: valFormat
    });
    var formattedString = dateFormatter.format(startDate);
    return formattedString;
  }
  return sap.firefly.UxGeneric.prototype.getStartDate.call(this);
};

sap.firefly.UxCalendar.prototype.setEndDate = function(endDate) {
  sap.firefly.UxGeneric.prototype.setEndDate.call(this, endDate);
  this.getNativeControl().removeAllSelectedDates();
  var dateRangeObj = this._generateCurrentDateRangeObject();
  this.getNativeControl().addSelectedDate(dateRangeObj);
  this.getNativeControl().focusDate(dateRangeObj.getEndDate());
  return this;
};

sap.firefly.UxCalendar.prototype.getEndDate = function() {
  var selectedDates = this.getNativeControl().getSelectedDates();
  if (selectedDates.length > 0) {
    var selectedDate = selectedDates[0];
    var endDate = selectedDate.getEndDate();
    if (endDate) {
      var valFormat = this.getValueFormat() || "yyyy-MM-dd";
      var dateFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
        pattern: valFormat
      });
      var formattedString = dateFormatter.format(endDate);
      return formattedString;
    } else {
      return null; // if no end date present then return null
    }
  }
  return sap.firefly.UxGeneric.prototype.getEndDate.call(this);
};

sap.firefly.UxCalendar.prototype.setValueFormat = function(valueFormat) {
  sap.firefly.UxGeneric.prototype.setValueFormat.call(this, valueFormat);
  // the ui5 control does not support valueformat so i need to do it manually in the setValue and getValue functions
  return this;
};

sap.firefly.UxCalendar.prototype.getValueFormat = function() {
  return sap.firefly.UxGeneric.prototype.getValueFormat.call(this);
};

sap.firefly.UxCalendar.prototype.setMinDate = function(minDate) {
  sap.firefly.UxGeneric.prototype.setMinDate.call(this, minDate);
  var dateObject = new Date(minDate);
  this.getNativeControl().setMinDate(dateObject);
  return this;
};

sap.firefly.UxCalendar.prototype.getMinDate = function() {
  return sap.firefly.UxGeneric.prototype.getMinDate.call(this);
};

sap.firefly.UxCalendar.prototype.setMaxDate = function(maxDate) {
  sap.firefly.UxGeneric.prototype.setMaxDate.call(this, maxDate);
  var dateObject = new Date(maxDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

sap.firefly.UxCalendar.prototype.getMaxDate = function() {
  return sap.firefly.UxGeneric.prototype.getMaxDate.call(this);
};

sap.firefly.UxCalendar.prototype.setIntervalSelection = function(value) {
  sap.firefly.UxGeneric.prototype.setIntervalSelection.call(this, value);
  this.getNativeControl().setIntervalSelection(value);
  return this;
};

sap.firefly.UxCalendar.prototype.isIntervalSelection = function() {
  return this.getNativeControl().getIntervalSelection();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxCalendar.prototype._generateCurrentDateRangeObject = function() {
  var startDate = sap.firefly.UxGeneric.prototype.getStartDate.call(this);;
  var endDate = sap.firefly.UxGeneric.prototype.getEndDate.call(this);

  var dateRange = new sap.ui.unified.DateRange();
  var valFormat = this.getValueFormat() || "yyyy-MM-dd";
  var dateFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
    pattern: valFormat
  });
  var startDateObject = dateFormatter.parse(startDate);
  var endDateObject = dateFormatter.parse(endDate);
  dateRange.setStartDate(startDateObject);
  dateRange.setEndDate(endDateObject);

  return dateRange;
};

sap.firefly.UxClock = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxClock";

  this.m_updateTimeTimeout = null;
};
sap.firefly.UxClock.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxClock.prototype.newInstance = function() {
  var object = new sap.firefly.UxClock();
  object.setup();
  return object;
};

sap.firefly.UxClock.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Label(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);

  this._updateTime();
};

sap.firefly.UxClock.prototype.releaseObject = function() {
  if (this.m_updateTimeTimeout) {
    clearTimeout(this.m_updateTimeTimeout);
  }
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxClock.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onHover, onHoverEnd
  nativeControl.addEventDelegate({
    onmouseover: function() {
      if (myself.getListenerOnPress() !== null) {
        // on hover if listener on press exists change the cursor to pointer for click ui
        myself.applyCss("cursor", "pointer");
      }
    },
    onmouseout: function() {
      // after leaving hover change the cursor back to the default one
      myself.applyCss("cursor", "default");
    }
  });
};

// ======================================

sap.firefly.UxClock.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

sap.firefly.UxClock.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxClock.prototype.setFontSize = function(fontSize) {
  sap.firefly.UxGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

sap.firefly.UxClock.prototype.getFontSize = function() {
  return sap.firefly.UxGeneric.prototype.getFontSize.call(this);
};

sap.firefly.UxClock.prototype.setFontWeight = function(fontWeight) {
  sap.firefly.UxGeneric.prototype.setFontWeight.call(this, fontWeight);
  if (fontWeight === sap.firefly.UiFontWeight.NORMAL) {
    this.getNativeControl().setDesign(sap.m.LabelDesign.Standard);
  } else if (fontWeight === sap.firefly.UiFontWeight.BOLD) {
    this.getNativeControl().setDesign(sap.m.LabelDesign.Bold);
  }
  return this;
};

sap.firefly.UxClock.prototype.getFontWeight = function() {
  return sap.firefly.UxGeneric.prototype.getFontWeight.call(this);
};

sap.firefly.UxClock.prototype.setFontStyle = function(fontStyle) {
  sap.firefly.UxGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

sap.firefly.UxClock.prototype.getFontStyle = function() {
  return sap.firefly.UxGeneric.prototype.getFontStyle.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxClock.prototype.applyCustomCssStyling = function(element) {
  element.style.userSelect = "none";
  element.style.cursor = "default";
};

// Helpers
// ======================================

sap.firefly.UxClock.prototype._updateTime = function() {
  if (this.getNativeControl()) {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    //var time = h + ":" + m + ":" + s; // with seconds
    var time = h + ":" + m; // only minutes
    this.getNativeControl().setText(time);
  }

  this.m_updateTimeTimeout = setTimeout(this._updateTime.bind(this), 1000);
};

sap.firefly.UxPanel = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxPanel";
};
sap.firefly.UxPanel.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxPanel.prototype.newInstance = function() {
  var object = new sap.firefly.UxPanel();
  object.setup();
  return object;
};

sap.firefly.UxPanel.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Panel(this.getId());
  nativeControl.setHeaderText("Panel");
  //nativeControl.setExpandable(false); //default value is false

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxPanel.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxPanel.prototype._addEvents = function(nativeControl) {
  var myself = this;

  nativeControl.attachExpand(function(oControlEvent) {
    var isExpand = oControlEvent.getParameters().expand;
    if (isExpand === true) {
      if (myself.getListenerOnExpand() !== null) {
        myself.getListenerOnExpand().onExpand(sap.firefly.UiItemEvent.createItem(myself, null, null));
      }
    } else {
      if (myself.getListenerOnCollapse() !== null) {
        myself.getListenerOnCollapse().onCollapse(sap.firefly.UiItemEvent.createItem(myself, null, null));
      }
    }
  });
};

// ======================================

sap.firefly.UxPanel.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var childControl = content.getNativeControl();
    this.getNativeControl().addContent(childControl);
  }
  return this;
};

sap.firefly.UxPanel.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this );
};

sap.firefly.UxPanel.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxPanel.prototype.setHeader = function(header) {
  sap.firefly.UxGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    var nativeHeaderControl = header.getNativeControl();
    this.getNativeControl().destroyHeaderToolbar(); // remove the old header toolbar
    var tmpToolbar = new sap.m.Toolbar(this.getId() + "_headerToolbar");
    tmpToolbar.addContent(nativeHeaderControl);
    this.getNativeControl().setHeaderToolbar(tmpToolbar);
  }
  return this;
};

sap.firefly.UxPanel.prototype.getHeader = function() {
  return sap.firefly.UxGeneric.prototype.getHeader.call(this);
};

sap.firefly.UxPanel.prototype.clearHeader = function() {
  sap.firefly.UxGeneric.prototype.clearHeader.call(this);
  this.getNativeControl().destroyHeaderToolbar();
  return this;
};

// ======================================

sap.firefly.UxPanel.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation since the property name is different
  this.getNativeControl().setHeaderText(text);
  return this;
};

sap.firefly.UxPanel.prototype.getText = function() {
  return this.getNativeControl().getHeaderText();
};

sap.firefly.UxPanel.prototype.setExpanded = function(expanded) {
  sap.firefly.UxGeneric.prototype.setExpanded.call(this, expanded);
  this.getNativeControl().setExpanded(expanded);
  return this;
};

sap.firefly.UxPanel.prototype.isExpanded = function() {
  return this.getNativeControl().getExpanded();
};

sap.firefly.UxPanel.prototype.setExpandable = function(expandable) {
  sap.firefly.UxGeneric.prototype.setExpandable.call(this, expandable);
  this.getNativeControl().setExpandable(expandable);
  return this;
};

sap.firefly.UxPanel.prototype.isExpandable = function() {
  return this.getNativeControl().getExpandable();
};

sap.firefly.UxPanel.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxPanel.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTile = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTile";
};
sap.firefly.UxTile.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTile.prototype.newInstance = function() {
  var object = new sap.firefly.UxTile();
  object.setup();
  return object;
};

sap.firefly.UxTile.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.GenericTile(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTile.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTile.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxTile.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllTileContent();
  if (content !== null) {
    var childControl = content.getNativeControl();
    var tileContent = new sap.m.TileContent(this.getId() + "tileContent");
    tileContent.setContent(childControl);
    this.getNativeControl().addTileContent(tileContent);
  }
  return this;
};

sap.firefly.UxTile.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxTile.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllTileContent();
  return this;
};

// ======================================

sap.firefly.UxTile.prototype.setTitle = function(title) {
  sap.firefly.DfUiContext.prototype.setTitle.call(this, title); // skip superclass implementation since the property name is different
  this.getNativeControl().setHeader(title);
  return this;
};

sap.firefly.UxTile.prototype.getTitle = function() {
  return this.getNativeControl().getHeader();
};

sap.firefly.UxTile.prototype.setSubtitle = function(subtitle) {
  sap.firefly.DfUiContext.prototype.setSubtitle.call(this, subtitle); // skip superclass implementation since the property name is different
  this.getNativeControl().setSubheader(subtitle);
  return this;
};

sap.firefly.UxTile.prototype.getSubtitle = function() {
  return this.getNativeControl().getSubheader();
};

sap.firefly.UxTile.prototype.setLoadState = function(loadState) {
  sap.firefly.UxGeneric.prototype.setLoadState.call(this, loadState);
  var nativeLoadState = sap.m.LoadState.Loaded;
  if (loadState === sap.firefly.UiLoadState.DISABLED) {
    nativeLoadState = sap.m.LoadState.Disabled;
  } else if (loadState === sap.firefly.UiLoadState.FAILED) {
    nativeLoadState = sap.m.LoadState.Failed;
  } else if (loadState === sap.firefly.UiLoadState.LOADED) {
    nativeLoadState = sap.m.LoadState.Loaded;
  } else if (loadState === sap.firefly.UiLoadState.LOADING) {
    nativeLoadState = sap.m.LoadState.Loading;
  }
  this.getNativeControl().setState(nativeLoadState);
  return this;
};

sap.firefly.UxTile.prototype.getLoadState = function() {
  return sap.firefly.UxGeneric.prototype.getLoadState.call(this);
};

sap.firefly.UxTile.prototype.setTileMode = function(tileMode) {
  sap.firefly.UxGeneric.prototype.setTileMode.call(this, tileMode);
  var nativeTileMode = sap.m.GenericTileMode.ContentMode;
  if (tileMode === sap.firefly.UiTileMode.CONTENT_MODE) {
    nativeTileMode = sap.m.GenericTileMode.ContentMode;
  } else if (tileMode === sap.firefly.UiTileMode.HEADER_MODE) {
    nativeTileMode = sap.m.GenericTileMode.HeaderMode;
  } else if (tileMode === sap.firefly.UiTileMode.LINE_MODE) {
    nativeTileMode = sap.m.GenericTileMode.LineMode;
  }
  this.getNativeControl().setMode(nativeTileMode);
  return this;
};

sap.firefly.UxTile.prototype.getTileMode = function() {
  return sap.firefly.UxGeneric.prototype.getTileMode.call(this);
};

sap.firefly.UxTile.prototype.setFrameType = function(frameType) {
  sap.firefly.UxGeneric.prototype.setFrameType.call(this, frameType);
  var nativeFrameType = sap.m.FrameType.OneByOne;
  if (frameType === sap.firefly.UiFrameType.AUTO) {
    nativeFrameType = sap.m.FrameType.Auto;
  } else if (frameType === sap.firefly.UiFrameType.ONE_BY_HALF) {
    nativeFrameType = sap.m.FrameType.OneByHalf;
  } else if (frameType === sap.firefly.UiFrameType.ONE_BY_ONE) {
    nativeFrameType = sap.m.FrameType.OneByOne;
  } else if (frameType === sap.firefly.UiFrameType.TWO_BY_HALF) {
    nativeFrameType = sap.m.FrameType.TwoByHalf;
  } else if (frameType === sap.firefly.UiFrameType.TWO_BY_ONE) {
    nativeFrameType = sap.m.FrameType.TwoByOne;
  }
  this.getNativeControl().setFrameType(nativeFrameType);
  return this;
};

sap.firefly.UxTile.prototype.getFrameType = function() {
  return sap.firefly.UxGeneric.prototype.getFrameType.call(this);
};

sap.firefly.UxTile.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxTile.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxTile.prototype.applyCustomCssStyling = function(element) {
  //make sure that when no title is set that the title wrapper is removed
  if (this.getTitle() && this.getTitle().length > 0) {
    $(element).find(".sapMGTHdrContent").css("display", null);
    $(element).find(".sapMGTContent").css("height", null);
    $(element).find(".sapMTileCntContent").css("height", null);
  }else{
    $(element).find(".sapMGTHdrContent").css("display", "none");
    $(element).find(".sapMGTContent").css("height", "100%");
    $(element).find(".sapMTileCntContent").css("height", "calc(100% - 8px)"); // top bottom margins are 4px hence 8px
  }
};

// Helpers
// ======================================

sap.firefly.UxMenu = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxMenu";
};
sap.firefly.UxMenu.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxMenu.prototype.newInstance = function() {
  var object = new sap.firefly.UxMenu();
  object.setup();
  return object;
};

sap.firefly.UxMenu.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Menu(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxMenu.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMenu.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // close event
  nativeControl.attachClosed(function(oEvent) {
    if (myself.getListenerOnClose() !== null) {
      myself.getListenerOnClose().onClose(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxMenu.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxMenu.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxMenu.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxMenu.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxMenu.prototype.openAt = function(control) {
  sap.firefly.UxGeneric.prototype.openAt.call(this, control);
  if (control != null) {
    var nativeLocationControl = control.getNativeControl();
    this.getNativeControl().openBy(nativeLocationControl);
  }
  return this;
};

sap.firefly.UxMenu.prototype.openAtPosition = function(posX, posY) {
  sap.firefly.UxGeneric.prototype.openAtPosition.call(this, posX, posY);

  var position = {};
  position.offsetX = posX;
  position.offsetY = posY;
  //  position.left = 150;
  //  position.top = 150;

  this.getNativeControl().openAsContextMenu(position);
  return this;
};

sap.firefly.UxMenu.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

sap.firefly.UxMenu.prototype.isOpen = function() {
  return sap.firefly.UxGeneric.prototype.isOpen.call(this);
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxMenuItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxMenuItem";
};
sap.firefly.UxMenuItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxMenuItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxMenuItem();
  object.setup();
  return object;
};

sap.firefly.UxMenuItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.MenuItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxMenuItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMenuItem.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnClick() !== null) {
      myself.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxMenuItem.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxMenuItem.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxMenuItem.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxMenuItem.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxMenuItem.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxMenuItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxMenuItem.prototype.setIcon = function(icon) {
  sap.firefly.UxGeneric.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxMenuItem.prototype.getIcon = function() {
  return sap.firefly.UxGeneric.prototype.getIcon.call(this);
};

sap.firefly.UxMenuItem.prototype.setSectionStart = function(sectionStart) {
  sap.firefly.UxGeneric.prototype.setSectionStart.call(this, sectionStart);
  this.getNativeControl().setStartsSection(sectionStart);
  return this;
};

sap.firefly.UxMenuItem.prototype.isSectionStart = function() {
  return this.getNativeControl().getStartsSection();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxToolbar = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxToolbar";
};
sap.firefly.UxToolbar.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxToolbar.prototype.newInstance = function() {
  var object = new sap.firefly.UxToolbar();
  object.setup();
  return object;
};

sap.firefly.UxToolbar.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.OverflowToolbar(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxToolbar.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxToolbar.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxToolbar.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addContent(nativeItem);
  return this;
};

sap.firefly.UxToolbar.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertContent(nativeItem, index);
  return this;
};

sap.firefly.UxToolbar.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeContent(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxToolbar.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxSegmentedButton = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSegmentedButton";
};
sap.firefly.UxSegmentedButton.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSegmentedButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxSegmentedButton();
  object.setup();
  return object;
};

sap.firefly.UxSegmentedButton.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.SegmentedButton(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSegmentedButton.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSegmentedButton.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachSelectionChange(function(oControlEvent) {
    var nativeItem = oControlEvent.getParameters().item;
    var selectedItem = null;
    if (nativeItem !== null) {
      var selectedItem = sap.firefly.UxGeneric.getUxControl(nativeItem);
    }

    if (myself.getListenerOnSelectionChange() !== null) {
      myself.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedItem));
    }
  });
};

// ======================================

sap.firefly.UxSegmentedButton.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxSegmentedButton.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxSegmentedButton.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxSegmentedButton.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxSegmentedButton.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item !== null && item !== undefined) {
    var nativeItem = item.getNativeControl();
    this.getNativeControl().setSelectedItem(nativeItem);
  } else {
    this.getNativeControl().setSelectedItem(null); // remove selected item
  }
  return this;
};

sap.firefly.UxSegmentedButton.prototype.getSelectedItem = function() {
  var selectedItemId = this.getNativeControl().getSelectedItem();
  var selectedItem = this.getItemById(selectedItemId);
  if (selectedItem != null) {
    return selectedItem;
  }
  return null;
};

// ======================================

sap.firefly.UxSegmentedButton.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxSegmentedButtonItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSegmentedButtonItem";
};
sap.firefly.UxSegmentedButtonItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSegmentedButtonItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxSegmentedButtonItem();
  object.setup();
  return object;
};

sap.firefly.UxSegmentedButtonItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.SegmentedButtonItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSegmentedButtonItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSegmentedButtonItem.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxSegmentedButtonItem.prototype.focus = function() {
  sap.firefly.UxGeneric.prototype.focus.call(this);
  return this;
};

// ======================================

sap.firefly.UxSegmentedButtonItem.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxSegmentedButtonItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxSegmentedButtonItem.prototype.setIcon = function(icon) {
  sap.firefly.UxGeneric.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxSegmentedButtonItem.prototype.getIcon = function() {
  return sap.firefly.UxGeneric.prototype.getIcon.call(this);
};

sap.firefly.UxSegmentedButtonItem.prototype.setSelected = function(selected) {
  sap.firefly.UxGeneric.prototype.setSelected.call(this, selected);
  var parent = this.getParent();
  if (parent !== null && parent !== undefined) {
    var parentNative = parent.getNativeControl();
    parentNative.setSelectedItem(this.getNativeControl());
  }
  return this;
};

sap.firefly.UxSegmentedButtonItem.prototype.isSelected = function() {
  var parent = this.getParent();
  if (parent !== null && parent !== undefined) {
    var parentNative = parent.getNativeControl();
    var selectedItemId = parentNative.getSelectedItem();
    return selectedItemId == this.getId();
  }
  return sap.firefly.UxGeneric.prototype.isSelected.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxPage = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxPage";
};
sap.firefly.UxPage.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxPage.prototype.newInstance = function() {
  var object = new sap.firefly.UxPage();
  object.setup();
  return object;
};

sap.firefly.UxPage.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Page(this.getId());
  nativeControl.setTitle("Page");
  nativeControl.setEnableScrolling(true);
  nativeControl.setShowNavButton(true); // always show nav button, but not on inital page

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxPage.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxPage.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onBack event
  nativeControl.attachNavButtonPress(function(oEvent) {
    if (myself.getParent() != null && myself.getParent().getUiType() === sap.firefly.UiType.NAVIGATION_CONTAINER) {
      myself.getParent().backNavBtnPressed();
    }
  });
};

// ======================================

sap.firefly.UxPage.prototype.addPageButton = function(pageButton) {
  sap.firefly.UxGeneric.prototype.addPageButton.call(this, pageButton);
  var nativePageButton = pageButton.getNativeControl();
  this.getNativeControl().addHeaderContent(nativePageButton);
  return this;
};

sap.firefly.UxPage.prototype.insertPageButton = function(pageButton, index) {
  sap.firefly.UxGeneric.prototype.insertPageButton.call(this, pageButton, index);
  var nativePageButton = pageButton.getNativeControl();
  this.getNativeControl().insertHeaderContent(nativePageButton, index);
  return this;
};

sap.firefly.UxPage.prototype.removePageButton = function(pageButton) {
  var nativePageButton = pageButton.getNativeControl();
  this.getNativeControl().removeHeaderContent(nativePageButton);
  sap.firefly.UxGeneric.prototype.removePageButton.call(this, pageButton);
  return this;
};

sap.firefly.UxPage.prototype.clearPageButtons = function() {
  sap.firefly.UxGeneric.prototype.clearPageButtons.call(this );
  this.getNativeControl().removeAllHeaderContent();
  return this;
};

// ======================================

sap.firefly.UxPage.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  var nativeContentControl = content.getNativeControl();
  this.getNativeControl().addContent(nativeContentControl);
  return this;
};

sap.firefly.UxPage.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxPage.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxPage.prototype.setHeader = function(header) {
  sap.firefly.UxGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    var nativeHeaderControl = this._wrapInToolbarIfNecessary(header, "Header");
    this.getNativeControl().setCustomHeader(nativeHeaderControl);
  } else {
    this.getNativeControl().setCustomHeader(null);
  }
  return this;
};

sap.firefly.UxPage.prototype.getHeader = function() {
  return sap.firefly.UxGeneric.prototype.getHeader.call(this);
};

sap.firefly.UxPage.prototype.clearHeader = function() {
  sap.firefly.UxGeneric.prototype.clearHeader.call(this);
  this.getNativeControl().setCustomHeader(null);
  return this;
};

// ======================================

sap.firefly.UxPage.prototype.setSubHeader = function(subHeader) {
  sap.firefly.UxGeneric.prototype.setSubHeader.call(this, subHeader);
  if (subHeader != null) {
    var nativeSubHeader = this._wrapInToolbarIfNecessary(subHeader, "SubHeader");
    this.getNativeControl().setSubHeader(nativeSubHeader);
  } else {
    this.getNativeControl().setSubHeader(null);
  }
  return this;
};

sap.firefly.UxPage.prototype.getSubHeader = function() {
  return sap.firefly.UxGeneric.prototype.getSubHeader.call(this);
};

sap.firefly.UxPage.prototype.clearSubHeader = function() {
  sap.firefly.UxGeneric.prototype.clearSubHeader.call(this);
  this.getNativeControl().setSubHeader(null);
  return this;
};

// ======================================

sap.firefly.UxPage.prototype.setFooter = function(footer) {
  sap.firefly.UxGeneric.prototype.setFooter.call(this, footer);
  if (footer != null) {
    var nativeFooter = this._wrapInToolbarIfNecessary(footer, "Footer");
    this.getNativeControl().setFooter(nativeFooter);
  } else {
    this.getNativeControl().setFooter(null);
  }
  return this;
};

sap.firefly.UxPage.prototype.getFooter = function() {
  return sap.firefly.UxGeneric.prototype.getFooter.call(this);
};

sap.firefly.UxPage.prototype.clearFooter = function() {
  sap.firefly.UxGeneric.prototype.clearFooter.call(this);
  this.getNativeControl().setFooter(null);
  return this;
};

// ======================================

sap.firefly.UxPage.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation since the property name is different
  this.getNativeControl().setTitle(text);
  return this;
};

sap.firefly.UxPage.prototype.getText = function() {
  return this.getNativeControl().getTitle();
};

sap.firefly.UxPage.prototype.setShowNavButton = function(showNavButton) {
  sap.firefly.UxGeneric.prototype.setShowNavButton.call(this, showNavButton);
  this.getNativeControl().setShowNavButton(showNavButton);
  return this;
};

sap.firefly.UxPage.prototype.isShowNavButton = function() {
  return this.getNativeControl().getShowNavButton();
};

sap.firefly.UxPage.prototype.setShowHeader = function(showHeader) {
  sap.firefly.UxGeneric.prototype.setShowHeader.call(this, showHeader);
  this.getNativeControl().setShowHeader(showHeader);
  return this;
};

sap.firefly.UxPage.prototype.isShowHeader = function() {
  return this.getNativeControl().getShowHeader();
};

sap.firefly.UxPage.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxPage.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxPage.prototype.hideNavigationButton = function() {
  if (this.getNativeControl()) {
    this.getNativeControl().setShowNavButton(false);
  }
};

sap.firefly.UxPage.prototype._wrapInToolbarIfNecessary = function(control) {
  // header, footer or subheader require a control of the sapui5 IBar interface
  // currently we do not have any check for that in the ui so we do that check here and wrap the control if it is not a toolbar
  if (control != null) {
    var nativeControl = control.getNativeControl();
    if (control.getUiType() === sap.firefly.UiType.TOOLBAR) {
      return nativeControl;
    }
    var tmpToolbar = new sap.m.Toolbar(this.getId() + "_" + name + "Toolbar");
    tmpToolbar.addContent(nativeControl);
    return tmpToolbar;
  }
};

sap.firefly.UxPageButton = function() {
   sap.firefly.UxButton.call(this);
  this._ff_c = "UxPageButton";
};
sap.firefly.UxPageButton.prototype = new sap.firefly.UxButton();

sap.firefly.UxPageButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxPageButton();
  object.setup();
  return object;
};

// PageButton inherits from Button and it has the same properties

sap.firefly.UxNavigationContainer = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxNavigationContainer";
};
sap.firefly.UxNavigationContainer.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxNavigationContainer.prototype.newInstance = function() {
  var object = new sap.firefly.UxNavigationContainer();
  object.setup();
  return object;
};

sap.firefly.UxNavigationContainer.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.NavContainer(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxNavigationContainer.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxNavigationContainer.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxNavigationContainer.prototype.pushPage = function(page) {
  sap.firefly.UxGeneric.prototype.pushPage.call(this, page);
  var nativePage = page.getNativeControl();
  this.getNativeControl().addPage(nativePage);
  // set the initial page
  if (this.getNativeControl().getInitialPage() == null) {
    this.getNativeControl().setInitialPage(nativePage);
    page.hideNavigationButton(); // initial page should never have a back button
  }
  this.getNativeControl().to(nativePage);
  return this;
};

sap.firefly.UxNavigationContainer.prototype.popPage = function() {
  var removedPage = sap.firefly.UxGeneric.prototype.popPage.call(this);
  this.getNativeControl().back();
  if (removedPage) {
    var nativeChild = removedPage.getNativeControl();
    this.getNativeControl().removePage(nativeChild);
  }
  // set the nitial page to null when poping last page
  if (this.getNativeControl().getPages().length <= 0) {
    this.getNativeControl().setInitialPage(null);
  }
  // send on back event
  if (this.getListenerOnBack() !== null) {
    this.getListenerOnBack().onBack(sap.firefly.UiControlEvent.create(this));
  }
  return removedPage;
};

sap.firefly.UxNavigationContainer.prototype.clearPages = function() {
  sap.firefly.UxGeneric.prototype.clearPages.call(this);
  this.getNativeControl().setInitialPage(null);
  this.getNativeControl().removeAllPages();
  return this;
};

// ======================================

sap.firefly.UxNavigationContainer.prototype.popToPage = function(page) {
  sap.firefly.UxGeneric.prototype.popToPage.call(this, page);
  if (page) {
    var nativePage = page.getNativeControl();
    // pop only if the desired page is not the current page, and when the desired page is on the stack
    if (nativePage != this.getNativeControl().getCurrentPage() && this.getNativeControl().indexOfPage(nativePage) != -1) {
      this.getNativeControl().backToPage(nativePage.getId());

      // remove all the pages from the native page storage which are not on the stack anymore
      this._removeAllPagesTillNativePage(nativePage);

      // send on back event
      if (this.getListenerOnBack() !== null) {
        this.getListenerOnBack().onBack(sap.firefly.UiControlEvent.create(this));
      }
    }
  }
  return this;
};

// ======================================

sap.firefly.UxNavigationContainer.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxNavigationContainer.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxNavigationContainer.prototype.applyCustomCssStyling = function(element) {
  // the control needs to have a min height or it will not be visible in dialogs
  element.style.minHeight = "200px";
};

// Helpers
// ======================================

sap.firefly.UxNavigationContainer.prototype.backNavBtnPressed = function() {
  this.popPage();
};

sap.firefly.UxNavigationContainer.prototype._removeAllPagesTillNativePage = function(nativePage) {
  if (nativePage) {
    var pageIndex = this.getNativeControl().getPages().indexOf(nativePage);
    if (pageIndex != -1) {
      var pagesToRemove = this.getNativeControl().getPages().slice(pageIndex + 1, this.getNativeControl().getPages().length);
      if (pagesToRemove != null) {
        for (var a = 0; a < pagesToRemove.length; a++) {
          var tmpPage = pagesToRemove[a];
          this.getNativeControl().removePage(tmpPage);
        }
      }
    }
  }
};

sap.firefly.UxTree = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTree";
};
sap.firefly.UxTree.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTree.prototype.newInstance = function() {
  var object = new sap.firefly.UxTree();
  object.setup();
  return object;
};

sap.firefly.UxTree.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Tree(this.getId());
  nativeControl.setIncludeItemInSelection(true);
  nativeControl.setSticky([sap.m.Sticky.HeaderToolbar]);
  //nativeControl.setBusyIndicatorDelay(10); // default is 1000, this is already done in the generic

  var oModel = new sap.ui.model.json.JSONModel();
  nativeControl.setModel(oModel);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTree.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTree.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onToggleOpen state
  nativeControl.attachToggleOpenState(function(oControlEvent) {
    var isExpanded = oControlEvent.getParameters().expanded;
    var nativeItemIndex = oControlEvent.getParameters().itemIndex;
    var nativeItem = myself.getNativeControl().getItems()[nativeItemIndex];

    if (nativeItem == null) {
      sap.firefly.logError("Something went wrong - could not find native item");
      return;
    }

    var mobileTreeItem = sap.firefly.UxGeneric.getUxControl(nativeItem);

    if (mobileTreeItem == null) {
      sap.firefly.logError("Something went wrong - could not find mobile tree item");
      return;
    }

    if (isExpanded) {
      // item event
      mobileTreeItem.itemExpanded();
      // tree control event
      if (myself.getListenerOnExpand() !== null) {
        var uiEventItem = sap.firefly.UiItemEvent.createItem(myself, null, mobileTreeItem);
        myself.getListenerOnExpand().onExpand(uiEventItem);
      }
    } else {
      // items event
      mobileTreeItem.itemCollapsed();
      // tree control event
      if (myself.getListenerOnCollapse() !== null) {
        var uiEventItem = sap.firefly.UiItemEvent.createItem(myself, null, mobileTreeItem);
        myself.getListenerOnCollapse().onCollapse(uiEventItem);
      }
    }
  });

  // onSelectionChange event
  nativeControl.attachSelectionChange(function(oControlEvent) {
    var isSelect = oControlEvent.getParameters().selected;
    if (isSelect === true) {
      if (myself.getListenerOnSelect() !== null) {
        var listItem = oControlEvent.getParameters().listItem;
        var selectedItem = sap.firefly.UxGeneric.getUxControl(listItem);
        myself.getListenerOnSelect().onSelect(sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedItem));
      }
    }

    if (myself.getListenerOnSelectionChange() !== null) {
      var isSelect = oControlEvent.getParameters().selected;
      var isSelectAll = oControlEvent.getParameters().selectAll && isSelect;
      var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().listItems.length > 1); // deselctAll is when listItems length is graeter then 1

      // prepare the properties
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT, isSelect);
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT_ALL, isSelectAll);
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_DESELECT_ALL, isDeselectAll);
      myself.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createEmptySelection(myself, newParameters));
    }
  });

  // onDelete event
  nativeControl.attachDelete(function(oControlEvent) {
    if (myself.getListenerOnDelete() !== null) {
      var nativeTreeItem = oControlEvent.getParameters().listItem;
      var deletedItem = sap.firefly.UxGeneric.getUxControl(nativeTreeItem);
      myself.getListenerOnDelete().onDelete(sap.firefly.UiItemEvent.createItem(myself, null, deletedItem));
    }
  });
};

// ======================================

sap.firefly.UxTree.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  this.createTreeModel();
  return this;
};

sap.firefly.UxTree.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  this.createTreeModel();
  return this;
};

sap.firefly.UxTree.prototype.removeItem = function(item) {
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  this.createTreeModel();
  return this;
};

sap.firefly.UxTree.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.createTreeModel();
  return this;
};

// ======================================

sap.firefly.UxTree.prototype.getSelectedItem = function() {
  var nativeSelectedItem = this.getNativeControl().getSelectedItem();
  if (nativeSelectedItem) {
    return sap.firefly.UxGeneric.getUxControl(nativeSelectedItem);
  }
  return null;
};

sap.firefly.UxTree.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().removeSelections();
      this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
    }
  } else {
    this.getNativeControl().removeSelections();
  }
};

sap.firefly.UxTree.prototype.getSelectedItems = function() {
  var selectedItems = sap.firefly.XList.create();
  var nativeSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < nativeSelectedItems.length; i++) {
    var tmpNativeTreeItem = nativeSelectedItems[i];
    var ffControl = sap.firefly.UxGeneric.getUxControl(tmpNativeTreeItem);
    selectedItems.add(ffControl);
  }
  return selectedItems;
};

sap.firefly.UxTree.prototype.setSelectedItems = function(items) {
  sap.firefly.UxGeneric.prototype.setSelectedItems.call(this, items);
  if (items !== null) {
    this.getNativeControl().removeSelections();
    var size = items.size();
    for (var i = 0; i < size; i++) {
      this.getNativeControl().setSelectedItem(items.get(i).getNativeControl(), true);
    }
  }
  return this;
};

sap.firefly.UxTree.prototype.addSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.addSelectedItem.call(this, item);
  var nativeItemToSelect = item.getNativeControl();
  if (nativeItemToSelect) {
    this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
  }
  return this;
};

sap.firefly.UxTree.prototype.removeSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.removeSelectedItem.call(this, item);
  var nativeItemToDeselect = item.getNativeControl();
  if (nativeItemToDeselect) {
    this.getNativeControl().setSelectedItem(nativeItemToDeselect, false);
  }
  return this;
};

sap.firefly.UxTree.prototype.clearSelectedItems = function() {
  sap.firefly.UxGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().removeSelections();
  return this;
};

// ======================================

sap.firefly.UxTree.prototype.getHeader = function() {
  return sap.firefly.UxGeneric.prototype.getHeader.call(this);;
};

sap.firefly.UxTree.prototype.setHeader = function(header) {
  sap.firefly.UxGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    var nativeHeaderControl = header.getNativeControl();
    this.getNativeControl().destroyHeaderToolbar(); // remove the old header toolbar
    var tmpToolbar = new sap.m.Toolbar(this.getId() + "_headerToolbar");
    tmpToolbar.addContent(nativeHeaderControl);
    this.getNativeControl().setHeaderToolbar(tmpToolbar);
  }
  return this;
};

sap.firefly.UxTree.prototype.clearHeader = function() {
  sap.firefly.UxGeneric.prototype.clearHeader.call(this);
  this.getNativeControl().destroyHeaderToolbar();
  return this;
};

// ======================================

sap.firefly.UxTree.prototype.expandToLevel = function(level) {
  sap.firefly.UxGeneric.prototype.expandToLevel.call(this, level);
  if (this.hasItems()) {
    this.getNativeControl().expandToLevel(level);
  }
  return this;
};

sap.firefly.UxTree.prototype.collapseAll = function() {
  sap.firefly.UxGeneric.prototype.collapseAll.call(this);
  if (this.hasItems()) {
    this.getNativeControl().collapseAll();
  }
  return this;
};

// ======================================

sap.firefly.UxTree.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setHeaderText(title);
  return this;
};

sap.firefly.UxTree.prototype.getTitle = function() {
  return sap.firefly.UxGeneric.prototype.getTitle.call(this);
};

sap.firefly.UxTree.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxTree.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxTree.prototype.setSelectionMode = function(selectionMode) {
  sap.firefly.UxGeneric.prototype.setSelectionMode.call(this, selectionMode);
  var mode = sap.m.ListMode.SingleSelectMaster;
  if (selectionMode == sap.firefly.UiSelectionMode.NONE) {
    mode = sap.m.ListMode.None;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT) {
    mode = sap.m.ListMode.SingleSelect;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT_LEFT) {
    mode = sap.m.ListMode.SingleSelectLeft;
  } else if (selectionMode == sap.firefly.UiSelectionMode.MULTI_SELECT) {
    mode = sap.m.ListMode.MultiSelect;
  } else if (selectionMode == sap.firefly.UiSelectionMode.DELETE) {
    mode = sap.m.ListMode.Delete;
  }
  this.getNativeControl().setMode(mode);
  return this;
};

sap.firefly.UxTree.prototype.getSelectionMode = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionMode.call(this);
};

sap.firefly.UxTree.prototype.setExpanded = function(expanded) {
  sap.firefly.UxGeneric.prototype.setExpanded.call(this, expanded);
  if (this.hasItems()) {
    if (expanded === true) {
      this.getNativeControl().expandToLevel(999);
    } else {
      this.getNativeControl().collapseAll();
    }
  }
  return this;
};

sap.firefly.UxTree.prototype.isExpanded = function() {
  return sap.firefly.UxGeneric.prototype.isExpanded.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxTree.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or tree items will break out of bounds if the tree items size is bigger then the control
  element.style.overflow = "auto";
};

// Helpers
// ======================================

sap.firefly.UxTree.prototype.createTreeModel = function() {
  var myself = this;
  var children = this.getItems();
  var modelData = [];

  if (children && children.size() > 0) {
    modelData = this._generateTreeModelRecursive(children);
  }

  if (this.getNativeControl().getModel().getJSON() == null || this.getNativeControl().getModel().getJSON().length <= 2) {
    this.getNativeControl().getModel().setData(modelData);
    this.getNativeControl().bindItems("/", function(sId, oContext) {
      var itemId = oContext.getProperty("ffTreeItemId");
      var mobileTreeItem = myself._getMobileTreeItemById(itemId);
      if (mobileTreeItem) {
        mobileTreeItem.rerenderNativeTreeItem(); // on every binding refresh old control are destroyed so i need to render new ones...
        return mobileTreeItem.getNativeControl();
      }
      return null;
    });
  } else {
    this.getNativeControl().getModel().setData(modelData);
    this.getNativeControl().updateItems();
  }

  // ------------ EXPANDED WHOLE TREE
  // if exapnded property on tree control is set then expand the whole tree
  if (this.isExpanded()) {
    this.expand();
  }
  // ------------

};

sap.firefly.UxTree.prototype._generateTreeModelRecursive = function(children) {
  var tmpModel = [];
  if (children && children.size() > 0) {
    for (var i = 0; i < children.size(); i++) {
      var child = children.get(i);
      var newModelItem = new Object();
      newModelItem.ffTreeItemId = child.getId();
      if (child.getItemCount() > 0) {
        var tmpNodes = this._generateTreeModelRecursive(child.getItems());
        newModelItem.nodes = tmpNodes
      }
      tmpModel.push(newModelItem);
    }
    return tmpModel;
  }
  return [];
};

sap.firefly.UxTree.prototype._getMobileTreeItemById = function(itemId) {
  var children = this._getAllMobileTreeItems();
  for (var i = 0; i < children.length; i++) {
    var tmpChild = children[i];
    if (tmpChild.getId() == itemId) {
      return tmpChild;
    }
  }
  return null;
};

sap.firefly.UxTree.prototype._getAllMobileTreeItems = function() {
  var firstLevelChildren = this.getItems();
  var allMobileTreeListItems = this._getMobileTreeItemsRecursive(firstLevelChildren);
  if (allMobileTreeListItems && allMobileTreeListItems.length > 0) {
    return allMobileTreeListItems;
  }
  return [];
};

sap.firefly.UxTree.prototype._getMobileTreeItemsRecursive = function(children) {
  var tmpTreeItemsArray = [];
  if (children && children.size() > 0) {
    for (var i = 0; i < children.size(); i++) {
      var tmpChild = children.get(i);
      tmpTreeItemsArray.push(tmpChild);
      var tmpLowerChildArray = this._getMobileTreeItemsRecursive(tmpChild.getItems());
      if (tmpLowerChildArray && tmpLowerChildArray.length > 0) {
        tmpTreeItemsArray = tmpTreeItemsArray.concat(tmpLowerChildArray);
      }
    }
    return tmpTreeItemsArray;
  }
  return [];
};

sap.firefly.UxTree.prototype.expandNativeItem = function(treeItem) {
  var nativeItem = treeItem.getNativeControl();
  var indexOfNativeItem = this.getNativeControl().indexOfItem(nativeItem);
  if (indexOfNativeItem != -1) {
    this.getNativeControl().expand(indexOfNativeItem);
  } else {
    this._tryToExpandPath(treeItem);
  }
};

sap.firefly.UxTree.prototype.collapseNativeItem = function(treeItem) {
  var nativeItem = treeItem.getNativeControl();
  var indexOfNativeItem = this.getNativeControl().indexOfItem(nativeItem);
  if (indexOfNativeItem != -1 && nativeItem.isLeaf() == false) {
    this.getNativeControl().collapse(indexOfNativeItem);
  }
};

sap.firefly.UxTree.prototype._tryToExpandPath = function(treeItem) {
  if (treeItem) {
    var tmpItemParent = treeItem.getParent();
    var itemsArray = [treeItem];
    while (tmpItemParent && tmpItemParent.isExpanded() === false && tmpItemParent != this) {
      itemsArray = [tmpItemParent].concat(itemsArray);
      tmpItemParent = tmpItemParent.getParent();
    }
    if (itemsArray) {
      for (var a = 0; a < itemsArray.length; a++) {
        var tmpItem = itemsArray[a];
        if (tmpItem) {
          var nativeItem = tmpItem.getNativeControl();
          var indexOfNativeItem = this.getNativeControl().indexOfItem(nativeItem);
          if (indexOfNativeItem != -1) {
            this.getNativeControl().expand(indexOfNativeItem);
          }
        }
      }
    }
  }
};

sap.firefly.UxTreeItem = function() {
   sap.firefly.UxTreeItemBase.call(this);
  this._ff_c = "UxTreeItem";
};
sap.firefly.UxTreeItem.prototype = new sap.firefly.UxTreeItemBase();

sap.firefly.UxTreeItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxTreeItem();
  object.setup();
  return object;
};

sap.firefly.UxTreeItem.prototype.initializeNative = function() {
  sap.firefly.UxTreeItemBase.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.StandardTreeItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTreeItem.prototype.releaseObject = function() {
  sap.firefly.UxTreeItemBase.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTreeItem.prototype.setText = function(text) {
  sap.firefly.UxTreeItemBase.prototype.setText.call(this, text);
  if (this.getNativeControl()) {
    this.getNativeControl().setTitle(text);
  }
  return this;
};

sap.firefly.UxTreeItem.prototype.getText = function() {
  return sap.firefly.UxTreeItemBase.prototype.getText.call(this);
};

sap.firefly.UxTreeItem.prototype.setIcon = function(icon) {
  sap.firefly.UxTreeItemBase.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxTreeItem.prototype.getIcon = function() {
  return sap.firefly.UxTreeItemBase.prototype.getIcon.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTreeItem.prototype.rerenderNativeTreeItem = function() {
  sap.firefly.UxTreeItemBase.prototype.rerenderNativeTreeItem.call(this);
  this.setText(this.getText());
  this.setIcon(this.getIcon());
};

sap.firefly.UxCustomTreeItem = function() {
   sap.firefly.UxTreeItemBase.call(this);
  this._ff_c = "UxCustomTreeItem";
};
sap.firefly.UxCustomTreeItem.prototype = new sap.firefly.UxTreeItemBase();

sap.firefly.UxCustomTreeItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxCustomTreeItem();
  object.setup();
  return object;
};

sap.firefly.UxCustomTreeItem.prototype.initializeNative = function() {
  sap.firefly.UxTreeItemBase.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.CustomTreeItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCustomTreeItem.prototype.releaseObject = function() {
  sap.firefly.UxTreeItemBase.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCustomTreeItem.prototype.setContent = function(content) {
  sap.firefly.UxTreeItemBase.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var childControl = content.getNativeControl();
    this.getNativeControl().addContent(childControl);
    //clonsing makes it work but then actaul ff control references the original control
    // so that te clone doe snot react to property changes or events which makes it not good...
    //this.getNativeControl().addContent(childControl.clone());
  }
  return this;
};

sap.firefly.UxCustomTreeItem.prototype.getContent = function() {
  return sap.firefly.UxTreeItemBase.prototype.getContent.call(this);
};

sap.firefly.UxCustomTreeItem.prototype.clearContent = function() {
  sap.firefly.UxTreeItemBase.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxCustomTreeItem.prototype.rerenderNativeTreeItem = function() {
  if (this.getNativeControl()) {
    this.getNativeControl().removeAllContent(); // remove the content reference before destroying so that we do not destroy the contenet yet since we still need it
  }
  sap.firefly.UxTreeItemBase.prototype.rerenderNativeTreeItem.call(this);
  this.setContent(this.getContent());
};

sap.firefly.UxTable = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTable";

  this.m_rowModel = {};
};
sap.firefly.UxTable.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTable.prototype.newInstance = function() {
  var object = new sap.firefly.UxTable();
  object.setup();
  return object;
};

sap.firefly.UxTable.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.ui.table");
  var myself = this;
  var nativeControl = new sap.ui.table.Table(this.getId());

  var oModel = new sap.ui.model.json.JSONModel();
  nativeControl.setModel(oModel);
  nativeControl.setVisibleRowCount(10); // 10 is default, when visible row count mode is set to auto then this property has no effect

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTable.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTable.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachRowSelectionChange(function(oControlEvent) {
    // only fire the event if happen with user interaction, e.g. user selects something, do not fire when selectIndex method is called
    var userInteraction = oControlEvent.getParameters().userInteraction;
    var isSelectAll = oControlEvent.getParameters().selectAll;
    if (userInteraction) {
      if (isSelectAll === false || isSelectAll === undefined) {
        if (myself.getListenerOnSelect() !== null) {
          var rowIndex = oControlEvent.getParameters().rowIndex;
          if (myself.getNativeControl().isIndexSelected(rowIndex)) {
            var tableRow = myself.getRow(rowIndex);
            myself.getListenerOnSelect().onSelect(sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, tableRow));
          }
        }
      }
      if (myself.getListenerOnSelectionChange() !== null) {
        var isSelectAll = oControlEvent.getParameters().selectAll || false;
        var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().rowIndex === -1); // deselctAll is when rowIndex is -1
        var isSelect = isSelectAll;
        if (isSelectAll === false && isDeselectAll === false) {
          // if not select all and not deselct all then check if the specified rowIndex is selected
          isSelect = myself.getNativeControl().isIndexSelected(rowIndex);
        }
        // prepare the properties
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT_ALL, isSelectAll);
        newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_DESELECT_ALL, isDeselectAll);
        newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT, isSelect);
        myself.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createEmptySelection(myself, newParameters));
      }
    }
  });

  // onClick event
  nativeControl.attachCellClick(function(oControlEvent) {
    var rowIndex = oControlEvent.getParameters().rowIndex;
    var columnIndex = oControlEvent.getParameters().columnIndex;
    // row clicked
    var tableRow = myself.getRow(rowIndex);
    if (tableRow) {
      tableRow.rowClicked();
      // cell clicked
      var tableRowCell = tableRow.getCell(columnIndex);
      if (tableRowCell) {
        tableRowCell.cellClicked();
      }
    }
  });

  // onScroll event
  nativeControl.attachFirstVisibleRowChanged(function(oControlEvent) {
    if (myself.getListenerOnScroll() !== null) {
      var firstVisibleRowIndex = oControlEvent.getParameters().firstVisibleRow;
      var firstVisibleTableRow = myself.getRow(firstVisibleRowIndex);
      // prepare the properties
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_FIRST_VISIBLE_ROW_NAME, firstVisibleTableRow.getName());
      myself.getListenerOnScroll().onScroll(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });
};

// ======================================

sap.firefly.UxTable.prototype.addColumn = function(column) {
  sap.firefly.UxGeneric.prototype.addColumn.call(this, column);
  var columnIndex = this.numberOfColumns() - 1;
  column.setColumnIndex(columnIndex);
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().addColumn(nativeColumn);
  return this;
};

sap.firefly.UxTable.prototype.insertColumn = function(column, index) {
  sap.firefly.UxGeneric.prototype.insertColumn.call(this, column, index);
  var columnIndex = index;
  column.setColumnIndex(columnIndex);
  // adjust the indices of other columns
  for (var i = index + 1; i < this.getColumns().size(); i++) {
    var tmpTableColumn = this.getColumns().get(i);
    tmpTableColumn.setColumnIndex(i);
  }
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().insertColumn(nativeColumn, index);
  return this;
};

sap.firefly.UxTable.prototype.removeColumn = function(column) {
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().removeColumn(nativeColumn);
  sap.firefly.UxGeneric.prototype.removeColumn.call(this, column);
  return this;
};

sap.firefly.UxTable.prototype.clearColumns = function() {
  sap.firefly.UxGeneric.prototype.clearColumns.call(this);
  this.getNativeControl().removeAllColumns();
  return this;
};

// ======================================

sap.firefly.UxTable.prototype.addRow = function(row) {
  sap.firefly.UxGeneric.prototype.addRow.call(this, row);
  var data = row.getData();
  this.m_rowModel[row.getId()] = data;
  this.refreshData();
  return this;
};

sap.firefly.UxTable.prototype.insertRow = function(row, index) {
  sap.firefly.UxGeneric.prototype.insertRow.call(this, row, index);
  //at insert i need to regenerate the row model
  this.m_rowModel = {};
  for (var i = 0; i < this.getRows().size(); i++) {
    var tmpTableRow = this.getRows().get(i);
    var tmpData = tmpTableRow.getData();
    this.m_rowModel[tmpTableRow.getId()] = tmpData;
  }
  this.refreshData();
  return this;
};

sap.firefly.UxTable.prototype.removeRow = function(row) {
  if (row != null) {
    delete this.m_rowModel[row.getId()];
    this.refreshData();
  }
  sap.firefly.UxGeneric.prototype.removeRow.call(this, row);
  return this;
};

sap.firefly.UxTable.prototype.clearRows = function() {
  sap.firefly.UxGeneric.prototype.clearRows.call(this);
  this.m_rowModel = {};
  this.refreshData();
  return this;
};

// ======================================

sap.firefly.UxTable.prototype.getFooter = function() {
  return sap.firefly.UxGeneric.prototype.getFooter.call(this);
};

sap.firefly.UxTable.prototype.setFooter = function(footer) {
  sap.firefly.UxGeneric.prototype.setFooter.call(this, footer);
  var nativeFooterControl = footer.getNativeControl();
  this.getNativeControl().setFooter(nativeFooterControl);
  return this;
};

sap.firefly.UxTable.prototype.clearFooter = function() {
  sap.firefly.UxGeneric.prototype.clearFooter.call(this);
  this.getNativeControl().destroyFooter();
  return this;
};

// ======================================

sap.firefly.UxTable.prototype.getSelectedItem = function() {
  var nativeSelectedIndices = this.getNativeControl().getSelectedIndices();
  if (nativeSelectedIndices && nativeSelectedIndices.length > 0) {
    return this.getRow(nativeSelectedIndices[0]);
  }
  return null;
};

sap.firefly.UxTable.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeRowIndexToSelect = this.getIndexOfRow(item);
    if (nativeRowIndexToSelect != -1) {
      this.getNativeControl().setSelectedIndex(nativeRowIndexToSelect);
    }
  } else {
    this.getNativeControl().clearSelection();
  }
  return this;
};

sap.firefly.UxTable.prototype.getSelectedItems = function() {
  var selectedItems = sap.firefly.XList.create();
  var nativeSelectedRowIndices = this.getNativeControl().getSelectedIndices();
  for (var i = 0; i < nativeSelectedRowIndices.length; i++) {
    var tmpTableTreeItem = this.getRow(nativeSelectedRowIndices[i]);
    selectedItems.add(tmpTableTreeItem);
  }
  return selectedItems;
};

sap.firefly.UxTable.prototype.setSelectedItems = function(items) {
  sap.firefly.UxGeneric.prototype.setSelectedItems.call(this, items);
  if (items !== null) {
    this.getNativeControl().clearSelection();
    var size = items.size();
    for (var i = 0; i < size; i++) {
      var rowIndexToSelect = this.getIndexOfRow(items.get(i));
      if (rowIndexToSelect != -1) {
        this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      }
    }
  }
  return this;
};

sap.firefly.UxTable.prototype.addSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToSelect = this.getIndexOfRow(item);
    if (rowIndexToSelect != -1) {
      this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
    }
  }
  return this;
};

sap.firefly.UxTable.prototype.removeSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToDeselect = this.getIndexOfRow(item);
    if (rowIndexToDeselect != -1) {
      this.getNativeControl().removeSelectionInterval(rowIndexToDeselect, rowIndexToDeselect);
    }
  }
  return this;
};

sap.firefly.UxTable.prototype.clearSelectedItems = function() {
  sap.firefly.UxGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().clearSelection();
  return this;
};

// ======================================

sap.firefly.UxTable.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  return this;
};

sap.firefly.UxTable.prototype.getTitle = function() {
  if (this.getNativeControl() && this.getNativeControl().getTitle()) {
    return this.getNativeControl().getTitle().getText();
  }
  return sap.firefly.UxGeneric.prototype.getTitle.call(this);
};

sap.firefly.UxTable.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxTable.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxTable.prototype.setSelectionMode = function(selectionMode) {
  sap.firefly.UxGeneric.prototype.setSelectionMode.call(this, selectionMode);
  var mode = sap.ui.table.SelectionMode.Single;
  if (selectionMode == sap.firefly.UiSelectionMode.NONE) {
    mode = sap.ui.table.SelectionMode.None;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT) {
    mode = sap.ui.table.SelectionMode.Single;
  } else if (selectionMode == sap.firefly.UiSelectionMode.MULTI_SELECT) {
    mode = sap.ui.table.SelectionMode.MultiToggle;
  }
  this.getNativeControl().setSelectionMode(mode);
  return this;
};

sap.firefly.UxTable.prototype.getSelectionMode = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionMode.call(this);
};

sap.firefly.UxTable.prototype.setSelectionBehavior = function(selectionBehavior) {
  sap.firefly.UxGeneric.prototype.setSelectionBehavior.call(this, selectionBehavior);
  var behavior = sap.ui.table.SelectionBehavior.RowSelector;
  if (selectionBehavior == sap.firefly.UiSelectionBehavior.ROW) {
    behavior = sap.ui.table.SelectionBehavior.Row;
  } else if (selectionBehavior == sap.firefly.UiSelectionBehavior.ROW_ONLY) {
    behavior = sap.ui.table.SelectionBehavior.RowOnly;
  } else if (selectionBehavior == sap.firefly.UiSelectionBehavior.ROW_SELECTOR) {
    behavior = sap.ui.table.SelectionBehavior.RowSelector;
  }
  this.getNativeControl().setSelectionBehavior(behavior);
  return this;
};

sap.firefly.UxTable.prototype.getSelectionBehavior = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionBehavior.call(this);
};

sap.firefly.UxTable.prototype.setVisibleRowCount = function(visibleRowCount) {
  sap.firefly.UxGeneric.prototype.setVisibleRowCount.call(this, visibleRowCount);
  this.getNativeControl().setVisibleRowCount(visibleRowCount);
  return this;
};

sap.firefly.UxTable.prototype.getVisibleRowCount = function() {
  return this.getNativeControl().getVisibleRowCount();
};

sap.firefly.UxTable.prototype.setVisibleRowCountMode = function(visibleRowCountMode) {
  sap.firefly.UxGeneric.prototype.setVisibleRowCountMode.call(this, visibleRowCountMode);
  var mode = sap.ui.table.VisibleRowCountMode.Fixed;
  if (visibleRowCountMode == sap.firefly.UiVisibleRowCountMode.AUTO) {
    mode = sap.ui.table.VisibleRowCountMode.Auto;
  } else if (visibleRowCountMode == sap.firefly.UiVisibleRowCountMode.FIXED) {
    mode = sap.ui.table.VisibleRowCountMode.Fixed;
  } else if (visibleRowCountMode == sap.firefly.UiVisibleRowCountMode.INTERACTIVE) {
    mode = sap.ui.table.VisibleRowCountMode.Interactive;
  }
  this.getNativeControl().setVisibleRowCountMode(mode);
  return this;
};

sap.firefly.UxTable.prototype.getVisibleRowCountMode = function() {
  return sap.firefly.UxGeneric.prototype.getVisibleRowCountMode.call(this);
};

sap.firefly.UxTable.prototype.setMinRowCount = function(minRowCount) {
  sap.firefly.UxGeneric.prototype.setMinRowCount.call(this, minRowCount);
  this.getNativeControl().setMinAutoRowCount(minRowCount);
  return this;
};

sap.firefly.UxTable.prototype.getMinRowCount = function() {
  return this.getNativeControl().getMinAutoRowCount();
};

sap.firefly.UxTable.prototype.setEnableSelectAll = function(enableSelectAll) {
  sap.firefly.UxGeneric.prototype.setEnableSelectAll.call(this, enableSelectAll);
  this.getNativeControl().setEnableSelectAll(enableSelectAll);
  return this;
};

sap.firefly.UxTable.prototype.isEnableSelectAll = function() {
  return this.getNativeControl().getEnableSelectAll();
};

sap.firefly.UxTable.prototype.setFirstVisibleRow = function(firstVisibleRow) {
  sap.firefly.UxGeneric.prototype.setFirstVisibleRow.call(this, firstVisibleRow);
  if (firstVisibleRow) {
    var rowIndex = this.getIndexOfRow(firstVisibleRow);
    this.getNativeControl().setFirstVisibleRow(rowIndex);
  }
  return this;
};

sap.firefly.UxTable.prototype.getFirstVisibleRow = function() {
  var firstVisibleRowIndex = this.getNativeControl().getFirstVisibleRow();
  var firstVisibleTableRow = this.getRow(firstVisibleRowIndex);
  return firstVisibleTableRow;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxTable.prototype.applyHeightCss = function(element, heightCss) {
  sap.firefly.UxGeneric.prototype.applyHeightCss.call(this, element, heightCss);
  // special css needed when setting a height in pixel on the table
  if (heightCss && heightCss.includes("px")) {
    // have to differentiate between when title is set and not since ths size changes then (48px more with title)
    $(element).find(".sapUiTableCnt").css("overflow-y", "auto");
    if (this.getTitle() != null && this.getTitle().length > 0) {
      $(element).find(".sapUiTableCnt").css("height", "calc(100% - 48px)");
    } else {
      $(element).find(".sapUiTableCnt").css("height", "100%");
    }
  }
};

// Helpers
// ======================================

sap.firefly.UxTable.prototype.getTable = function() {
  return this;
};

sap.firefly.UxTable.prototype.getTableCellById = function(itemId) {
  // method not used currently
  var rows = this.getRows();
  for (var i = 0; i < rows.size(); i++) {
    var tmpRow = rows.get(i);
    var tmpCells = tmpRow.getCells();
    for (var a = 0; a < tmpCells.size(); a++) {
      var tmpCell = tmpCells.get(a);
      if (tmpCell.getId() == itemId) {
        return tmpCell;
      }
    }
  }
  return null;
};

sap.firefly.UxTable.prototype.refreshData = function() {
  //this.getNativeControl().bindRows("/modelData");
  if (this.getNativeControl().getModel().getJSON() == null || this.getNativeControl().getModel().getJSON().length <= 2) {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().bindRows("/modelData");
  } else {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().updateRows(sap.ui.model.ChangeReason.Refresh, ""); // second param can be empty? At least cannot be null! No public API for that!
  }
};

sap.firefly.UxTableColumn = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTableColumn";

  this.m_columnIndex = -1;
};
sap.firefly.UxTableColumn.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTableColumn.prototype.newInstance = function() {
  var object = new sap.firefly.UxTableColumn();
  object.setup();
  return object;
};

sap.firefly.UxTableColumn.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.ui.table");
  var myself = this;
  var nativeControl = new sap.ui.table.Column(this.getId());
  var template = new sap.m.Label();
  nativeControl.setTemplate(template);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTableColumn.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTableColumn.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxTableColumn.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  var label = new sap.ui.commons.Label({
    text: title
  });
  this.getNativeControl().setLabel(label);
  return this;
};

sap.firefly.UxTableColumn.prototype.getTitle = function() {
  if (this.getNativeControl() && this.getNativeControl().getLabel()) {
    return this.getNativeControl().getLabel().getText()
  }
  return sap.firefly.UxGeneric.prototype.getTitle.call(this);
};

sap.firefly.UxTableColumn.prototype.setShowSorting = function(showSorting) {
  sap.firefly.UxGeneric.prototype.setShowSorting.call(this, showSorting);
  var nativeControl = this.getNativeControl();
  if (nativeControl) {
    if (showSorting) {
      nativeControl.setSortProperty("column" + this.m_columnIndex + "_text");
    } else {
      nativeControl.setSortProperty("");
    }
  }
};

sap.firefly.UxTableColumn.prototype.isShowSorting = function() {
  return sap.firefly.UxGeneric.prototype.isShowSorting.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTableColumn.prototype.setColumnIndex = function(columnIndex) {
  this.m_columnIndex = columnIndex;
  this.getNativeControl().getTemplate().bindProperty("text", "column" + columnIndex + "_text");
  this.getNativeControl().getTemplate().bindProperty("tooltip", "column" + columnIndex + "_tooltip");
  return this;
};

sap.firefly.UxTableColumn.prototype.getColumnIndex = function() {
  return this.m_columnIndex;
};

sap.firefly.UxTableRow = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTableRow";

  this.m_rowData = {};
};
sap.firefly.UxTableRow.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTableRow.prototype.newInstance = function() {
  var object = new sap.firefly.UxTableRow();
  object.setup();
  return object;
};

sap.firefly.UxTableRow.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTableRow.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTableRow.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxTableRow.prototype.addCell = function(cell) {
  sap.firefly.UxGeneric.prototype.addCell.call(this, cell);
  var cellIndex = this.numberOfCells() - 1;
  cell.setCellIndex(cellIndex);
  // initially prepare the cell, add the text, tooltip etc after adding the cell
  var data = this.getData();
  this._prepareCell(data, cellIndex, cell);
  // update the table
  this.refreshData();
  return this;
};

sap.firefly.UxTableRow.prototype.insertCell = function(cell, index) {
  sap.firefly.UxGeneric.prototype.insertCell.call(this, cell, index);
  var cellIndex = index;
  cell.setCellIndex(cellIndex);
  // initially prepare the cell, add the text, tooltip etc after adding the cell
  var data = this.getData();
  this._prepareCell(data, cellIndex, cell);
  // change the other cells indices since everything moved 1 up
  for (var i = index + 1; i < this.getCells().size(); i++) {
    var tmpTableCell = this.getCells().get(i);
    tmpTableCell.setCellIndex(i);
    // update cell properties after changing the cell index
    this._prepareCell(data, i, tmpTableCell);
  }
  // update the table
  this.refreshData();
  return this;
};

sap.firefly.UxTableRow.prototype.removeCell = function(cell) {
  if (cell) {
    var cellIndex = cell.getCellIndex();
    if (cellIndex != -1) {
      var data = this.getData();
      this._deleteCell(data, cellIndex);
      cell.setCellIndex(-1);
      this.refreshData();
    }
  }
  sap.firefly.UxGeneric.prototype.removeCell.call(this, cell);
  return this;
};

sap.firefly.UxTableRow.prototype.clearCells = function() {
  var data = this.getData();
  for (var a = 0; a < this.getCells().size(); a++) {
    this._deleteCell(data, a);
    this.getCells().get(a).setCellIndex(-1);
    this.refreshData();
  }
  sap.firefly.UxGeneric.prototype.clearCells.call(this);
  return this;
};

// ======================================

sap.firefly.UxTableRow.prototype.setSelected = function(selected) {
  sap.firefly.UxGeneric.prototype.setSelected.call(this, selected);
  var table = this.getTable();
  if (table) {
    var rowIndexToSelect = this.getRowIndex();
    if (rowIndexToSelect != -1) {
      if (selected === true) {
        table.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      } else {
        table.getNativeControl().removeSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      }
    }
  }
  return this;
};

sap.firefly.UxTableRow.prototype.isSelected = function() {
  var table = this.getTable();
  if (table) {
    var rowIndexToCheck = this.getRowIndex();
    if (rowIndexToCheck != -1) {
      return table.getNativeControl().isIndexSelected(rowIndexToCheck);
    }
  }
  return sap.firefly.UxGeneric.prototype.isSelected.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTableRow.prototype.getData = function() {
  return this.m_rowData;
};

sap.firefly.UxTableRow.prototype.getRowIndex = function() {
  var table = this.getTable();
  if (table) {
    return table.getIndexOfRow(this);
  }
  return -1;
};

sap.firefly.UxTableRow.prototype.rowClicked = function() {
  if (this.getListenerOnClick() !== null) {
    this.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxTableRow.prototype.getTable = function() {
  if (this.getParent()) {
    return this.getParent().getTable();
  }
  return null;
};

sap.firefly.UxTableRow.prototype.refreshData = function() {
  if (this.getParent()) {
    this.getParent().refreshData();
  }
};

sap.firefly.UxTableRow.prototype._prepareCell = function(rowData, cellIndex, cell) {
  if (cell.getText() != null) {
    rowData["column" + cellIndex + "_text"] = cell.getText();
  }

  if (cell.getTooltip() != null) {
    rowData["column" + cellIndex + "_tooltip"] = cell.getTooltip();
  }
};

sap.firefly.UxTableRow.prototype._deleteCell = function(rowData, cellIndex) {
  delete rowData["column" + cellIndex + "_text"];
  delete rowData["column" + cellIndex + "_tooltip"];
};

sap.firefly.UxTableCell = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTableCell";

  this.m_cellIndex = -1;
};
sap.firefly.UxTableCell.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTableCell.prototype.newInstance = function() {
  var object = new sap.firefly.UxTableCell();
  object.setup();
  return object;
};

sap.firefly.UxTableCell.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTableCell.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTableCell.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxTableCell.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  if (this.getParent() != null) {
    var data = this.getParent().getData();
    data["column" + this.m_cellIndex + "_text"] = text;
    this._refreshData();
  }
  return this;
};

sap.firefly.UxTableCell.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxTableCell.prototype.setTooltip = function(tooltip) {
  sap.firefly.UxGeneric.prototype.setTooltip.call(this, tooltip);
  if (this.getParent() != null) {
    var data = this.getParent().getData();
    data["column" + this.m_cellIndex + "_tooltip"] = tooltip;
    this._refreshData();
  }
  return this;
};

sap.firefly.UxTableCell.prototype.getTooltip = function() {
  return sap.firefly.UxGeneric.prototype.getTooltip.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTableCell.prototype.setCellIndex = function(columnIndex) {
  this.m_cellIndex = columnIndex;
  return this;
};

sap.firefly.UxTableCell.prototype.getCellIndex = function() {
  return this.m_cellIndex;
};

sap.firefly.UxTableCell.prototype.cellClicked = function() {
  if (this.getListenerOnClick() !== null) {
    this.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxTableCell.prototype.getTable = function() {
  if (this.getParent()) {
    return this.getParent().getTable();
  }
  return null;
};

sap.firefly.UxTableCell.prototype._refreshData = function() {
  if (this.getParent()) {
    this.getParent().refreshData();
  }
};

sap.firefly.UxResponsiveTable = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxResponsiveTable";
};
sap.firefly.UxResponsiveTable.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxResponsiveTable.prototype.newInstance = function() {
  var object = new sap.firefly.UxResponsiveTable();
  object.setup();
  return object;
};

sap.firefly.UxResponsiveTable.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Table(this.getId());
  //nativeControl.setFixedLayout(false); // automatically adjust column width to fit text
  nativeControl.setSticky([sap.m.Sticky.ColumnHeaders, sap.m.Sticky.HeaderToolbar, sap.m.Sticky.InfoToolbar]);
  nativeControl.setContextualWidth("Auto");
  nativeControl.setPopinLayout(sap.m.PopinLayout.GridSmall);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxResponsiveTable.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxResponsiveTable.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachSelectionChange(function(oControlEvent) {
    var isSelect = oControlEvent.getParameters().selected;
    if (isSelect === true) {
      if (myself.getListenerOnSelect() !== null) {
        var row = oControlEvent.getParameters().listItem;
        var selectedRow = sap.firefly.UxGeneric.getUxControl(row);
        var theEvent = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedRow);
        myself.getListenerOnSelect().onSelect(theEvent);
      }
    }

    if (myself.getListenerOnSelectionChange() !== null) {
      var isSelect = oControlEvent.getParameters().selected;
      var isSelectAll = oControlEvent.getParameters().selectAll && isSelect;
      var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().listItems.length > 1); // deselctAll is when listItems length is graeter then 1

      // prepare the properties
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT, isSelect);
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT_ALL, isSelectAll);
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_DESELECT_ALL, isDeselectAll);
      myself.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createEmptySelection(myself, newParameters));
    }
  });

  //onDelete event
  nativeControl.attachDelete(function(oControlEvent) {
    if (myself.getListenerOnDelete() !== null) {
      var nativeItem = oControlEvent.getParameters().listItem;
      var deletedItem = sap.firefly.UxGeneric.getUxControl(nativeItem);
      myself.getListenerOnDelete().onDelete(sap.firefly.UiItemEvent.createItem(myself, null, deletedItem));
    }
  });

  // onScrollLoad event -- using onAfterRender event for that, this is a private method so it might break in the future
  //only work when is inside a scrollable scroll container (e.g sap.m.Page).
  nativeControl.addDelegate({
    onAfterRendering: $.proxy(function() {
      var scroller = sap.m.getScrollDelegate(nativeControl);
      if (scroller) {
        scroller.setGrowingList(myself.throttle(function() {
          if (myself.getListenerOnScrollLoad() !== null) {
            myself.getListenerOnScrollLoad().onScrollLoad(sap.firefly.UiControlEvent.create(myself));
          }
        }, 1000), sap.m.ListGrowingDirection.Downwards)
      }
    }, this.getNativeControl())
  });
};

// ======================================

sap.firefly.UxResponsiveTable.prototype.addResponsiveTableColumn = function(column) {
  sap.firefly.UxGeneric.prototype.addResponsiveTableColumn.call(this, column);
  var nativeColumn = column.getNativeControl();
  if (nativeColumn) {
    this._calculateColumResponsiveness();
    this.getNativeControl().addColumn(nativeColumn);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.insertResponsiveTableColumn = function(column, index) {
  sap.firefly.UxGeneric.prototype.insertResponsiveTableColumn.call(this, column, index);
  var nativeColumn = column.getNativeControl();
  if (nativeColumn) {
    this._calculateColumResponsiveness();
    this.getNativeControl().insertColumn(nativeColumn, index);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.removeResponsiveTableColumn = function(column) {
  var nativeColumn = column.getNativeControl();
  if (nativeColumn) {
    this.getNativeControl().removeColumn(nativeColumn);
  }
  sap.firefly.UxGeneric.prototype.removeResponsiveTableColumn.call(this, column);
  return this;
};

sap.firefly.UxResponsiveTable.prototype.clearResponsiveTableColumns = function() {
  sap.firefly.UxGeneric.prototype.clearResponsiveTableColumns.call(this);
  this.getNativeControl().removeAllColumns();
  return this;
};

// ======================================

sap.firefly.UxResponsiveTable.prototype.addResponsiveTableRow = function(row) {
  sap.firefly.UxGeneric.prototype.addResponsiveTableRow.call(this, row);
  var nativeColumnListItem = row.getNativeControl();
  if (nativeColumnListItem) {
    this.getNativeControl().addItem(nativeColumnListItem);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.insertResponsiveTableRow = function(row, index) {
  sap.firefly.UxGeneric.prototype.insertResponsiveTableRow.call(this, row, index);
  var nativeColumnListItem = row.getNativeControl();
  if (nativeColumnListItem) {
    this.getNativeControl().insertItem(nativeColumnListItem, index);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.removeResponsiveTableRow = function(row) {
  var nativeColumnListItem = row.getNativeControl();
  if (nativeColumnListItem) {
    this.getNativeControl().removeItem(nativeColumnListItem);
  }
  sap.firefly.UxGeneric.prototype.removeResponsiveTableRow.call(this, row);
  return this;
};

sap.firefly.UxResponsiveTable.prototype.clearResponsiveTableRows = function() {
  sap.firefly.UxGeneric.prototype.clearResponsiveTableRows.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxResponsiveTable.prototype.getSelectedItem = function() {
  var selectedItem = this.getNativeControl().getSelectedItem();
  if (selectedItem != null) {
    return sap.firefly.UxGeneric.getUxControl(selectedItem);
  }
  return null;
};

sap.firefly.UxResponsiveTable.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
    }
  } else {
    this.clearSelectedItems();
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.getSelectedItems = function() {
  var oList = sap.firefly.XList.create();
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < aSelectedItems.length; i++) {
    var ffControl = sap.firefly.UxGeneric.getUxControl(aSelectedItems[i]);
    oList.add(ffControl);
  }
  return oList;
};

sap.firefly.UxResponsiveTable.prototype.setSelectedItems = function(items) {
  sap.firefly.UxGeneric.prototype.setSelectedItems.call(this, items);
  this.getNativeControl().removeSelections();
  if (items !== null) {
    var size = items.size();
    for (var i = 0; i < size; i++) {
      this.getNativeControl().setSelectedItem(items.get(i).getNativeControl(), true);
    }
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.addSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), true);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.removeSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), false);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.clearSelectedItems = function() {
  sap.firefly.UxGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().removeSelections();
  return this;
};

// ======================================

sap.firefly.UxResponsiveTable.prototype.getHeader = function() {
  return sap.firefly.UxGeneric.prototype.getHeader.call(this);;
};

sap.firefly.UxResponsiveTable.prototype.setHeader = function(header) {
  sap.firefly.UxGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    var nativeHeaderControl = header.getNativeControl();
    this.getNativeControl().destroyHeaderToolbar(); // remove the old header toolbar
    var tmpToolbar = new sap.m.Toolbar(this.getId() + "_headerToolbar");
    tmpToolbar.addContent(nativeHeaderControl);
    this.getNativeControl().setHeaderToolbar(tmpToolbar);
  }
  return this;
};

sap.firefly.UxResponsiveTable.prototype.clearHeader = function() {
  sap.firefly.UxGeneric.prototype.clearHeader.call(this);
  this.getNativeControl().destroyHeaderToolbar();
  return this;
};

// ======================================

sap.firefly.UxResponsiveTable.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxResponsiveTable.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxResponsiveTable.prototype.setSelectionMode = function(selectionMode) {
  sap.firefly.UxGeneric.prototype.setSelectionMode.call(this, selectionMode);
  var mode = sap.m.ListMode.SingleSelectMaster;
  if (selectionMode == sap.firefly.UiSelectionMode.NONE) {
    mode = sap.m.ListMode.None;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT) {
    mode = sap.m.ListMode.SingleSelect;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT_LEFT) {
    mode = sap.m.ListMode.SingleSelectLeft;
  } else if (selectionMode == sap.firefly.UiSelectionMode.MULTI_SELECT) {
    mode = sap.m.ListMode.MultiSelect;
  } else if (selectionMode == sap.firefly.UiSelectionMode.DELETE) {
    mode = sap.m.ListMode.Delete;
  }
  this.getNativeControl().setMode(mode);
  return this;
};

sap.firefly.UxResponsiveTable.prototype.getSelectionMode = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionMode.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxResponsiveTable.prototype._calculateColumResponsiveness = function() {
  var columnCount = this.numberOfResponsiveTableColumns();
  for (var a = 0; a < columnCount; a++) {
    var tmpColumn = this.getResponsiveTableColumn(a);
    tmpColumn.determineResponsiveness(a);
  }
};

sap.firefly.UxResponsiveTableColumn = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxResponsiveTableColumn";
};
sap.firefly.UxResponsiveTableColumn.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxResponsiveTableColumn.prototype.newInstance = function() {
  var object = new sap.firefly.UxResponsiveTableColumn();
  object.setup();
  return object;
};

sap.firefly.UxResponsiveTableColumn.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Column(this.getId());
  //  nativeControl.setMinScreenWidth(sap.m.ScreenSize.Phone);
  //  nativeControl.setDemandPopin(true);

  var header = new sap.m.Label();
  header.setText(this.getId());
  nativeControl.setHeader(header);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxResponsiveTableColumn.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxResponsiveTableColumn.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxResponsiveTableColumn.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  var label = this.getNativeControl().getHeader();
  if (label) {
    label.setText(title);
  }
  return this;
};

sap.firefly.UxResponsiveTableColumn.prototype.getTitle = function() {
  var label = this.getNativeControl().getHeader();
  if (label) {
    return label.getText()
  }
  return sap.firefly.UxGeneric.prototype.getTitle.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxResponsiveTableColumn.prototype.determineResponsiveness = function(colIndex) {
  // show 1 column on smartphone
  if (colIndex >= 1 && colIndex < 5) {
    this.getNativeControl().setMinScreenWidth(sap.m.ScreenSize.Tablet);
    this.getNativeControl().setDemandPopin(true);
  }
  // show 5 columns on a tablet
  if (colIndex >= 5) {
    this.getNativeControl().setMinScreenWidth(sap.m.ScreenSize.Desktop);
    this.getNativeControl().setDemandPopin(true);
  }
};

sap.firefly.UxResponsiveTableRow = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxResponsiveTableRow";
};
sap.firefly.UxResponsiveTableRow.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxResponsiveTableRow.prototype.newInstance = function() {
  var object = new sap.firefly.UxResponsiveTableRow();
  object.setup();
  return object;
};

sap.firefly.UxResponsiveTableRow.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.ColumnListItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxResponsiveTableRow.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxResponsiveTableRow.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnClick() !== null) {
      myself.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onDblClick event
  nativeControl.ondblclick = function(oControlEvent) {
    if (myself.getListenerOnDoubleClick() !== null) {
      myself.getListenerOnDoubleClick().onDoubleClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    //on press only works when list item type is not inactive
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onDetailPress event
  nativeControl.attachDetailPress(function(oControlEvent) {
    if (myself.getListenerOnDetailPress() !== null) {
      myself.getListenerOnDetailPress().onDetailPress(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxResponsiveTableRow.prototype.addResponsiveTableCell = function(cell) {
  sap.firefly.UxGeneric.prototype.addResponsiveTableCell.call(this, cell);
  var nativeCell = cell.getNativeControl();
  if (nativeCell) {
    this.getNativeControl().addCell(nativeCell);
  }
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.insertResponsiveTableCell = function(cell, index) {
  sap.firefly.UxGeneric.prototype.insertResponsiveTableCell.call(this, cell, index);
  var nativeCell = cell.getNativeControl();
  if (nativeCell) {
    this.getNativeControl().insertCell(nativeCell, index);
  }
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.removeResponsiveTableCell = function(cell) {
  var nativeCell = cell.getNativeControl();
  if (nativeCell) {
    this.getNativeControl().removeCell(nativeCell);
  }
  sap.firefly.UxGeneric.prototype.removeResponsiveTableCell.call(this, cell);
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.clearResponsiveTableCells = function() {
  sap.firefly.UxGeneric.prototype.clearResponsiveTableCells.call(this);
  this.getNativeControl().removeAllCells();
  return this;
};

// ======================================

sap.firefly.UxResponsiveTableRow.prototype.setEnabled = function(enabled) {
  sap.firefly.DfUiContext.prototype.setEnabled.call(this, enabled); // skip UxGeneric call since the property has a different name
  this.getNativeControl().setBlocked(!enabled);
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.isEnabled = function() {
  return !this.getNativeControl().getBlocked();
};

sap.firefly.UxResponsiveTableRow.prototype.setSelected = function(selected) {
  sap.firefly.UxGeneric.prototype.setSelected.call(this, selected);
  this.getNativeControl().setSelected(selected);
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.isSelected = function() {
  return this.getNativeControl().isSelected();
};

sap.firefly.UxResponsiveTableRow.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxResponsiveTableRow.prototype.setHighlight = function(messageType) {
  sap.firefly.UxGeneric.prototype.setHighlight.call(this, messageType);
  var msgType = sap.ui.core.MessageType.None;
  if (messageType == sap.firefly.UiMessageType.NONE) {
    msgType = sap.ui.core.MessageType.None;
  } else if (messageType == sap.firefly.UiMessageType.ERROR) {
    msgType = sap.ui.core.MessageType.Error;
  } else if (messageType == sap.firefly.UiMessageType.INFORMATION) {
    msgType = sap.ui.core.MessageType.Information;
  } else if (messageType == sap.firefly.UiMessageType.SUCCESS) {
    msgType = sap.ui.core.MessageType.Success;
  } else if (messageType == sap.firefly.UiMessageType.WARNING) {
    msgType = sap.ui.core.MessageType.Warning;
  }
  this.getNativeControl().setHighlight(msgType);
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.getHighlight = function() {
  return sap.firefly.UxGeneric.prototype.getHighlight.call(this);
};

sap.firefly.UxResponsiveTableRow.prototype.setListItemType = function(listItemType) {
  sap.firefly.UxGeneric.prototype.setListItemType.call(this, listItemType);
  var nativeListType = sap.m.ListType.Inactive;
  if (listItemType == sap.firefly.UiListType.ACTIVE) {
    nativeListType = sap.m.ListType.Active;
  } else if (listItemType == sap.firefly.UiListType.DETAIL) {
    nativeListType = sap.m.ListType.Detail;
  } else if (listItemType == sap.firefly.UiListType.DETAIL_AND_ACTIVE) {
    nativeListType = sap.m.ListType.DetailAndActive;
  } else if (listItemType == sap.firefly.UiListType.INACTIVE) {
    nativeListType = sap.m.ListType.Inactive;
  } else if (listItemType == sap.firefly.UiListType.NAVIGATION) {
    nativeListType = sap.m.ListType.Navigation;
  }
  this.getNativeControl().setType(nativeListType);
  return this;
};

sap.firefly.UxResponsiveTableRow.prototype.getListItemType = function() {
  return sap.firefly.UxGeneric.prototype.getListItemType.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxResponsiveTableCell = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxResponsiveTableCell";
};
sap.firefly.UxResponsiveTableCell.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxResponsiveTableCell.prototype.newInstance = function() {
  var object = new sap.firefly.UxResponsiveTableCell();
  object.setup();
  return object;
};

sap.firefly.UxResponsiveTableCell.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Label(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxResponsiveTableCell.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxResponsiveTableCell.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnClick() !== null) {
      myself.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(myself));
    }
  };
};

// ======================================

sap.firefly.UxResponsiveTableCell.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setText(text);
  return this;
};

sap.firefly.UxResponsiveTableCell.prototype.getText = function() {
  return this.getNativeControl().getText();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTreeTable = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTreeTable";

  this.m_rowModel = {};
};
sap.firefly.UxTreeTable.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTreeTable.prototype.newInstance = function() {
  var object = new sap.firefly.UxTreeTable();
  object.setup();
  return object;
};

sap.firefly.UxTreeTable.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.ui.table");
  var myself = this;
  var nativeControl = new sap.ui.table.TreeTable(this.getId());
  nativeControl.setCollapseRecursive(false); // this is required to presist the selection when collapsing and expanding a node, setting this to true will cause the selection to get lost (true is default value)

  var oModel = new sap.ui.model.json.JSONModel();
  nativeControl.setModel(oModel);
  nativeControl.setVisibleRowCount(10); // 10 is default, when visible row count mode is set to auto then this property has no effect

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTreeTable.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTreeTable.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onToggleOpen event
  nativeControl.attachToggleOpenState(function(oControlEvent) {
    var isExpanded = oControlEvent.getParameters().expanded;
    var rowIndex = oControlEvent.getParameters().rowIndex;
    var treeTableRow = myself._getTreeTableRowByRowIndex(rowIndex);

    if (treeTableRow == null) {
      sap.firefly.logError("Something went wrong - could not find table tree item");
      return;
    }

    if (isExpanded) {
      // item event
      treeTableRow.rowExpanded();
      // tree control event
      if (myself.getListenerOnExpand() !== null) {
        var uiEventItem = sap.firefly.UiItemEvent.createItem(myself, null, treeTableRow);
        myself.getListenerOnExpand().onExpand(uiEventItem);
      }
    } else {
      // items event
      treeTableRow.rowCollapsed();
      // tree control event
      if (myself.getListenerOnCollapse() !== null) {
        var uiEventItem = sap.firefly.UiItemEvent.createItem(myself, null, treeTableRow);
        myself.getListenerOnCollapse().onCollapse(uiEventItem);
      }
    }
  });

  // onSelectionChange event
  nativeControl.attachRowSelectionChange(function(oControlEvent) {
    // only fire the event if happen with user interaction, e.g. user selects something, do not fire when selectIndex method is called
    var userInteraction = oControlEvent.getParameters().userInteraction;
    var isSelectAll = oControlEvent.getParameters().selectAll;
    if (userInteraction) {
      if (isSelectAll === false || isSelectAll === undefined) {
        if (myself.getListenerOnSelect() !== null) {
          var rowIndex = oControlEvent.getParameters().rowIndex;
          if (myself.getNativeControl().isIndexSelected(rowIndex)) {
            var treeTableRow = myself._getTreeTableRowByRowIndex(rowIndex);
            myself.getListenerOnSelect().onSelect(sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, treeTableRow));
          }
        }
      }
      if (myself.getListenerOnSelectionChange() !== null) {
        var isSelectAll = oControlEvent.getParameters().selectAll || false;
        var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().rowIndex === -1); // deselctAll is when rowIndex is -1
        var isSelect = isSelectAll;
        if (isSelectAll === false && isDeselectAll === false) {
          // if not select all and not deselct all then check if the specified rowIndex is selected
          isSelect = myself.getNativeControl().isIndexSelected(rowIndex);
        }
        // prepare the properties
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT_ALL, isSelectAll);
        newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_DESELECT_ALL, isDeselectAll);
        newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT, isSelect);
        myself.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createEmptySelection(myself, newParameters));
      }
    }
  });

  // onClick event
  nativeControl.attachCellClick(function(oControlEvent) {
    var rowIndex = oControlEvent.getParameters().rowIndex;
    var columnIndex = oControlEvent.getParameters().columnIndex;
    // row clicked
    var treeTableRow = myself._getTreeTableRowByRowIndex(rowIndex);
    if (treeTableRow) {
      treeTableRow.rowClicked();
      // cell clicked
      var tableRowCell = treeTableRow.getCell(columnIndex);
      if (tableRowCell) {
        tableRowCell.cellClicked();
      }
    }
  });

  // onScroll event
  nativeControl.attachFirstVisibleRowChanged(function(oControlEvent) {
    if (myself.getListenerOnScroll() !== null) {
      var firstVisibleRowIndex = oControlEvent.getParameters().firstVisibleRow;
      var firstVisbibleTreeTableRow = myself._getTreeTableRowByRowIndex(firstVisibleRowIndex);
      // prepare the properties
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_FIRST_VISIBLE_ROW_NAME, firstVisbibleTreeTableRow.getName());
      myself.getListenerOnScroll().onScroll(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });
};

// ======================================

sap.firefly.UxTreeTable.prototype.addColumn = function(column) {
  sap.firefly.UxGeneric.prototype.addColumn.call(this, column);
  var columnIndex = this.numberOfColumns() - 1;
  column.setColumnIndex(columnIndex);
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().addColumn(nativeColumn);
  return this;
};

sap.firefly.UxTreeTable.prototype.insertColumn = function(column, index) {
  sap.firefly.UxGeneric.prototype.insertColumn.call(this, column, index);
  var columnIndex = index;
  column.setColumnIndex(columnIndex);
  // adjust the indices of other columns
  for (var i = index + 1; i < this.getColumns().size(); i++) {
    var tmpTableColumn = this.getColumns().get(i);
    tmpTableColumn.setColumnIndex(i);
  }
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().insertColumn(nativeColumn, index);
  return this;
};

sap.firefly.UxTreeTable.prototype.removeColumn = function(column) {
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().removeColumn(nativeColumn);
  sap.firefly.UxGeneric.prototype.removeColumn.call(this, column);
  return this;
};

sap.firefly.UxTreeTable.prototype.clearColumns = function() {
  sap.firefly.UxGeneric.prototype.clearColumns.call(this);
  this.getNativeControl().removeAllColumns();
  return this;
};

// ======================================

sap.firefly.UxTreeTable.prototype.addTreeTableRow = function(treeTableRow) {
  sap.firefly.UxGeneric.prototype.addTreeTableRow.call(this, treeTableRow);
  var rowIndex = this.numberOfTreeTableRows() - 1;
  treeTableRow.setRowIndex(rowIndex);
  var data = treeTableRow.getData();
  this.m_rowModel[treeTableRow.getId()] = data;
  this.refreshData();
  return this;
};

sap.firefly.UxTreeTable.prototype.insertTreeTableRow = function(treeTableRow, index) {
  sap.firefly.UxGeneric.prototype.insertTreeTableRow.call(this, treeTableRow, index);
  //at insert i need to regenerate the row model
  this.m_rowModel = {};
  for (var i = 0; i < this.getTreeTableRows().size(); i++) {
    var tmpTableRow = this.getTreeTableRows().get(i);
    tmpTableRow.setRowIndex(i);
    var tmpData = tmpTableRow.getData();
    this.m_rowModel[tmpTableRow.getId()] = tmpData;
  }
  this.refreshData();
  return this;
};

sap.firefly.UxTreeTable.prototype.removeTreeTableRow = function(treeTableRow) {
  if (treeTableRow != null) {
    delete this.m_rowModel[treeTableRow.getId()];
    treeTableRow.setRowIndex(-1);
    this.refreshData();
  }
  sap.firefly.UxGeneric.prototype.removeTreeTableRow.call(this, treeTableRow);
  return this;
};

sap.firefly.UxTreeTable.prototype.clearTreeTableRows = function() {
  sap.firefly.UxGeneric.prototype.clearTreeTableRows.call(this);
  this.m_rowModel = {};
  this.refreshData();
  return this;
};

// ======================================

sap.firefly.UxTreeTable.prototype.getFooter = function() {
  return sap.firefly.UxGeneric.prototype.getFooter.call(this);
};

sap.firefly.UxTreeTable.prototype.setFooter = function(footer) {
  sap.firefly.UxGeneric.prototype.setFooter.call(this, footer);
  var nativeFooterControl = footer.getNativeControl();
  this.getNativeControl().setFooter(nativeFooterControl);
  return this;
};

sap.firefly.UxTreeTable.prototype.clearFooter = function() {
  sap.firefly.UxGeneric.prototype.clearFooter.call(this);
  this.getNativeControl().destroyFooter();
  return this;
};

// ======================================

sap.firefly.UxTreeTable.prototype.getSelectedItem = function() {
  var nativeSelectedIndices = this.getNativeControl().getSelectedIndices();
  if (nativeSelectedIndices && nativeSelectedIndices.length > 0) {
    return this._getTreeTableRowByRowIndex(nativeSelectedIndices[0]);
  }
  return null;
};

sap.firefly.UxTreeTable.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeRowIndexToSelect = this.getRowIndexByTreeTableRow(item);
    if (nativeRowIndexToSelect != -1) {
      this.getNativeControl().setSelectedIndex(nativeRowIndexToSelect);
    }
  } else {
    this.getNativeControl().clearSelection();
  }
};

sap.firefly.UxTreeTable.prototype.getSelectedItems = function() {
  var selectedItems = sap.firefly.XList.create();
  var nativeSelectedRowIndices = this.getNativeControl().getSelectedIndices();
  for (var i = 0; i < nativeSelectedRowIndices.length; i++) {
    var tmpTableTreeItem = this._getTreeTableRowByRowIndex(nativeSelectedRowIndices[i]);
    selectedItems.add(tmpTableTreeItem);
  }
  return selectedItems;
};

sap.firefly.UxTreeTable.prototype.setSelectedItems = function(items) {
  sap.firefly.UxGeneric.prototype.setSelectedItems.call(this, items);
  if (items !== null) {
    this.getNativeControl().clearSelection();
    var size = items.size();
    for (var i = 0; i < size; i++) {
      var rowIndexToSelect = this.getRowIndexByTreeTableRow(items.get(i));
      if (rowIndexToSelect != -1) {
        this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      }
    }
  }
  return this;
};

sap.firefly.UxTreeTable.prototype.addSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToSelect = this.getRowIndexByTreeTableRow(item);
    if (rowIndexToSelect != -1) {
      this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
    }
  }
  return this;
};

sap.firefly.UxTreeTable.prototype.removeSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToDeselect = this.getRowIndexByTreeTableRow(item);
    if (rowIndexToDeselect != -1) {
      this.getNativeControl().removeSelectionInterval(rowIndexToDeselect, rowIndexToDeselect);
    }
  }
  return this;
};

sap.firefly.UxTreeTable.prototype.clearSelectedItems = function() {
  sap.firefly.UxGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().clearSelection();
  return this;
};

// ======================================

sap.firefly.UxTreeTable.prototype.expandToLevel = function(level) {
  sap.firefly.UxGeneric.prototype.expandToLevel.call(this, level);
  if (this.hasTreeTableRows()) {
    this.getNativeControl().expandToLevel(level);
  }
  return this;
};

sap.firefly.UxTreeTable.prototype.collapseAll = function() {
  sap.firefly.UxGeneric.prototype.collapseAll.call(this);
  if (this.hasTreeTableRows()) {
    this.getNativeControl().collapseAll();
  }
  return this;
};

// ======================================

sap.firefly.UxTreeTable.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  return this;
};

sap.firefly.UxTreeTable.prototype.getTitle = function() {
  if (this.getNativeControl() && this.getNativeControl().getTitle()) {
    return this.getNativeControl().getTitle().getText();
  }
  return sap.firefly.UxGeneric.prototype.getTitle.call(this);
};

sap.firefly.UxTreeTable.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxTreeTable.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxTreeTable.prototype.setSelectionMode = function(selectionMode) {
  sap.firefly.UxGeneric.prototype.setSelectionMode.call(this, selectionMode);
  var mode = sap.ui.table.SelectionMode.Single;
  if (selectionMode == sap.firefly.UiSelectionMode.NONE) {
    mode = sap.ui.table.SelectionMode.None;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT) {
    mode = sap.ui.table.SelectionMode.Single;
  } else if (selectionMode == sap.firefly.UiSelectionMode.MULTI_SELECT) {
    mode = sap.ui.table.SelectionMode.MultiToggle;
  }
  this.getNativeControl().setSelectionMode(mode);
  return this;
};

sap.firefly.UxTreeTable.prototype.getSelectionMode = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionMode.call(this);
};

sap.firefly.UxTreeTable.prototype.setSelectionBehavior = function(selectionBehaviour) {
  sap.firefly.UxGeneric.prototype.setSelectionBehavior.call(this, selectionBehaviour);
  var behavior = sap.ui.table.SelectionBehavior.RowSelector;
  if (selectionBehaviour == sap.firefly.UiSelectionBehavior.ROW) {
    behavior = sap.ui.table.SelectionBehavior.Row;
  } else if (selectionBehaviour == sap.firefly.UiSelectionBehavior.ROW_ONLY) {
    behavior = sap.ui.table.SelectionBehavior.RowOnly;
  } else if (selectionBehaviour == sap.firefly.UiSelectionBehavior.ROW_SELECTOR) {
    behavior = sap.ui.table.SelectionBehavior.RowSelector;
  }
  this.getNativeControl().setSelectionBehavior(behavior);
  return this;
};

sap.firefly.UxTreeTable.prototype.getSelectionBehavior = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionBehavior.call(this);
};

sap.firefly.UxTreeTable.prototype.setExpanded = function(expanded) {
  sap.firefly.UxGeneric.prototype.setExpanded.call(this, expanded);
  if (this.hasTreeTableRows()) {
    if (expanded === true) {
      this.getNativeControl().expandToLevel(999);
    } else {
      this.getNativeControl().collapseAll();
    }
  }
  return this;
};

sap.firefly.UxTreeTable.prototype.isExpanded = function() {
  return sap.firefly.UxGeneric.prototype.isExpanded.call(this);
};

sap.firefly.UxTreeTable.prototype.setVisibleRowCount = function(visibleRowCount) {
  sap.firefly.UxGeneric.prototype.setVisibleRowCount.call(this, visibleRowCount);
  this.getNativeControl().setVisibleRowCount(visibleRowCount);
  return this;
};

sap.firefly.UxTreeTable.prototype.getVisibleRowCount = function() {
  return this.getNativeControl().getVisibleRowCount();
};

sap.firefly.UxTreeTable.prototype.setVisibleRowCountMode = function(visibleRowCountMode) {
  sap.firefly.UxGeneric.prototype.setVisibleRowCountMode.call(this, visibleRowCountMode);
  var mode = sap.ui.table.VisibleRowCountMode.Fixed;
  if (visibleRowCountMode == sap.firefly.UiVisibleRowCountMode.AUTO) {
    mode = sap.ui.table.VisibleRowCountMode.Auto;
  } else if (visibleRowCountMode == sap.firefly.UiVisibleRowCountMode.FIXED) {
    mode = sap.ui.table.VisibleRowCountMode.Fixed;
  } else if (visibleRowCountMode == sap.firefly.UiVisibleRowCountMode.INTERACTIVE) {
    mode = sap.ui.table.VisibleRowCountMode.Interactive;
  }
  this.getNativeControl().setVisibleRowCountMode(mode);
  return this;
};

sap.firefly.UxTreeTable.prototype.getVisibleRowCountMode = function() {
  return sap.firefly.UxGeneric.prototype.getVisibleRowCountMode.call(this);
};

sap.firefly.UxTreeTable.prototype.setMinRowCount = function(minRowCount) {
  sap.firefly.UxGeneric.prototype.setMinRowCount.call(this, minRowCount);
  this.getNativeControl().setMinAutoRowCount(minRowCount);
  return this;
};

sap.firefly.UxTreeTable.prototype.getMinRowCount = function() {
  return this.getNativeControl().getMinAutoRowCount();
};

sap.firefly.UxTreeTable.prototype.setEnableSelectAll = function(enableSelectAll) {
  sap.firefly.UxGeneric.prototype.setEnableSelectAll.call(this, enableSelectAll);
  this.getNativeControl().setEnableSelectAll(enableSelectAll);
  return this;
};

sap.firefly.UxTreeTable.prototype.isEnableSelectAll = function() {
  return this.getNativeControl().getEnableSelectAll();
};

sap.firefly.UxTreeTable.prototype.setFirstVisibleRow = function(firstVisibleRow) {
  sap.firefly.UxGeneric.prototype.setFirstVisibleRow.call(this, firstVisibleRow);
  if (firstVisibleRow) {
    var rowIndex = this.getRowIndexByTreeTableRow(firstVisibleRow);
    this.getNativeControl().setFirstVisibleRow(rowIndex);
  }
  return this;
};

sap.firefly.UxTreeTable.prototype.getFirstVisibleRow = function() {
  var firstVisibleRowIndex = this.getNativeControl().getFirstVisibleRow();
  var firstVisibleTreeTableRow = this._getTreeTableRowByRowIndex(firstVisibleRowIndex);
  return firstVisibleTreeTableRow;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxTreeTable.prototype.applyHeightCss = function(element, heightCss) {
  sap.firefly.UxGeneric.prototype.applyHeightCss.call(this, element, heightCss);
  // special css needed when setting a height in pixel on the tree table
  if (heightCss && heightCss.includes("px")) {
    // have to differentiate between when title is set and not since ths size changes then (48px more with title)
    $(element).find(".sapUiTableCnt").css("overflow-y", "auto");
    if (this.getTitle() != null && this.getTitle().length > 0) {
      $(element).find(".sapUiTableCnt").css("height", "calc(100% - 48px)");
    } else {
      $(element).find(".sapUiTableCnt").css("height", "100%");
    }
  }
};

// Helpers
// ======================================

sap.firefly.UxTreeTable.prototype.getTable = function() {
  return this;
};

sap.firefly.UxTreeTable.prototype._getTreeTableRowById = function(itemId) {
  var children = this.getTreeTableRows();
  if (children != null) {
    for (var i = 0; i < children.size(); i++) {
      var tmpChild = children.get(i);
      if (tmpChild.getId() == itemId) {
        return tmpChild;
      }
    }
  }
  return null;
};

sap.firefly.UxTreeTable.prototype._getTreeTableRowByRowIndex = function(rowIndex) {
  var rowContext = this.getNativeControl().getContextByIndex(rowIndex);
  if (rowContext) {
    var bindingPath = rowContext.getPath();
    var itemId = bindingPath.substring(bindingPath.lastIndexOf("/") + 1);
    var treeTableRow = this._getTreeTableRowById(itemId);
    return treeTableRow;
  }
  return null;
};

sap.firefly.UxTreeTable.prototype.getRowIndexByTreeTableRow = function(treeTableRow) {
  var index = 0;
  var rowContext = null;
  do {
    rowContext = this.getNativeControl().getContextByIndex(index);
    if (rowContext) {
      var bindingPath = rowContext.getPath();
      var itemId = bindingPath.substring(bindingPath.lastIndexOf("/") + 1);
      if (itemId === treeTableRow.getId()) {
        return index;
      }
    }
    index++;
  } while (rowContext != null);
  return -1;
};

sap.firefly.UxTreeTable.prototype.expandNativeRow = function(treeTableRow) {
  var rowIndexToExpand = this.getRowIndexByTreeTableRow(treeTableRow);
  if (rowIndexToExpand != -1) {
    this.getNativeControl().expand(rowIndexToExpand);
  } else {
    this._tryToExpandPath(treeTableRow);
  }
};

sap.firefly.UxTreeTable.prototype.collapseNativeRow = function(treeTableRow) {
  var rowIndexToCollapse = this.getRowIndexByTreeTableRow(treeTableRow);
  if (rowIndexToCollapse != -1) {
    this.getNativeControl().collapse(rowIndexToCollapse);
  }
};

sap.firefly.UxTreeTable.prototype._tryToExpandPath = function(treeTableRow) {
  if (treeTableRow) {
    var tmpRowParent = treeTableRow.getParent();
    var rowsArray = [treeTableRow];
    while (tmpRowParent && tmpRowParent.isExpanded() === false && tmpRowParent != this) {
      rowsArray = tmpRowParent.concat(rowsArray);
      tmpRowParent = tmpRowParent.getParent();
    }
    if (rowsArray) {
      for (var a = 0; a < rowsArray.length; a++) {
        var tmpItem = rowsArray[a];
        if (tmpItem) {
          var rowIndexToExpand = this.getRowIndexByTreeTableRow(tmpItem);
          if (rowIndexToExpand != -1) {
            this.getNativeControl().expand(rowIndexToExpand);
          }
        }
      }
    }
  }
};

sap.firefly.UxTreeTable.prototype.refreshData = function() {
  if (this.getNativeControl().getModel().getJSON() == null || this.getNativeControl().getModel().getJSON().length <= 2) {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().bindRows("/modelData");
  } else {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().updateRows(sap.ui.model.ChangeReason.Refresh, ""); // second param can be empty? At least cannot be null! No public API for that!
  }
};

sap.firefly.UxTreeTableRow = function() {
   sap.firefly.UxTableRow.call(this);
  this._ff_c = "UxTreeTableRow";
};
sap.firefly.UxTreeTableRow.prototype = new sap.firefly.UxTableRow();

sap.firefly.UxTreeTableRow.prototype.newInstance = function() {
  var object = new sap.firefly.UxTreeTableRow();
  object.setup();
  return object;
};

sap.firefly.UxTreeTableRow.prototype.initializeNative = function() {
  sap.firefly.UxTableRow.prototype.initializeNative.call(this); // use TableRow
};

sap.firefly.UxTreeTableRow.prototype.releaseObject = function() {
  sap.firefly.UxTableRow.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTreeTableRow.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxTreeTableRow.prototype.addTreeTableRow = function(treeTableRow) {
  sap.firefly.UxTableRow.prototype.addTreeTableRow.call(this, treeTableRow);
  var rowIndex = this.numberOfTreeTableRows() - 1;
  treeTableRow.setRowIndex(rowIndex);
  var data = treeTableRow.getData();
  var mydData = this.getData();
  mydData[treeTableRow.getId()] = data;
  this.refreshData();
  return this;
};

sap.firefly.UxTreeTableRow.prototype.insertTreeTableRow = function(treeTableRow, index) {
  sap.firefly.UxTableRow.prototype.insertTreeTableRow.call(this, treeTableRow, index);
  this._clearTreeTableData();
  var mydData = this.getData();
  for (var i = 0; i < this.getTreeTableRows().size(); i++) {
    var tmpTableRow = this.getTreeTableRows().get(i);
    tmpTableRow.setRowIndex(i);
    var tmpData = tmpTableRow.getData();
    mydData[tmpTableRow.getId()] = tmpData;
  }
  this.refreshData();
  return this;
};

sap.firefly.UxTreeTableRow.prototype.removeTreeTableRow = function(treeTableRow) {
  if (treeTableRow != null) {
    var mydData = this.getData();
    delete mydData[treeTableRow.getId()];
    treeTableRow.setRowIndex(-1);
    this.refreshData();
  }
  sap.firefly.UxTableRow.prototype.removeTreeTableRow.call(this, treeTableRow);
  return this;
};

sap.firefly.UxTreeTableRow.prototype.clearTreeTableRows = function() {
  sap.firefly.UxTableRow.prototype.clearTreeTableRows.call(this);
  this._clearTreeTableData();
  this.refreshData();
  return this;
};

// ======================================

sap.firefly.UxTreeTableRow.prototype.addCell = function(cell) {
  sap.firefly.UxTableRow.prototype.addCell.call(this, cell); // use TableRow
  return this;
};

sap.firefly.UxTreeTableRow.prototype.insertCell = function(cell, index) {
  sap.firefly.UxTableRow.prototype.insertCell.call(this, cell, index); // use TableRow
  return this;
};

sap.firefly.UxTreeTableRow.prototype.removeCell = function(cell) {
  sap.firefly.UxTableRow.prototype.removeCell.call(this, cell); // use TableRow
  return this;
};

sap.firefly.UxTreeTableRow.prototype.clearCells = function() {
  sap.firefly.UxTableRow.prototype.clearCells.call(this); // use TableRow
  return this;
};

// ====================================

sap.firefly.UxTreeTableRow.prototype.setExpanded = function(expanded) {
  sap.firefly.UxTableRow.prototype.setExpanded.call(this, expanded);
  if (expanded === true) {
    this.expandNativeRow(this);
  } else {
    this.collapseNativeRow(this);
  }
  return this;
};

sap.firefly.UxTreeTableRow.prototype.isExpanded = function() {
  var treeTable = this.getTable();
  if (treeTable && treeTable.getNativeControl()) {
    var rowIndexToCheck = treeTable.getRowIndexByTreeTableRow(this);
    if (rowIndexToCheck != -1) {
      return treeTable.getNativeControl().isExpanded(rowIndexToCheck);
    } else {
      return false;
    }
  }
  return sap.firefly.UxTableRow.prototype.isExpanded.call(this);
};

sap.firefly.UxTreeTableRow.prototype.setSelected = function(selected) {
  sap.firefly.UxTableRow.prototype.setSelected.call(this, selected); // use TableRow
  return this;
};

sap.firefly.UxTreeTableRow.prototype.isSelected = function() {
  return sap.firefly.UxTableRow.prototype.isSelected.call(this); // use TableRow
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTreeTableRow.prototype.getRowIndex = function() {
  var treeTable = this.getTable();
  if (treeTable && treeTable.getNativeControl()) {
    var index = 0;
    var rowContext = null;
    do {
      rowContext = treeTable.getNativeControl().getContextByIndex(index);
      if (rowContext) {
        var bindingPath = rowContext.getPath();
        var itemId = bindingPath.substring(bindingPath.lastIndexOf("/") + 1);
        if (itemId === this.getId()) {
          return index;
        }
      }
      index++;
    } while (rowContext != null);
  }
  return -1;
};


sap.firefly.UxTreeTableRow.prototype._clearTreeTableData = function() {
  for (var propKey in this.getData()) {
    // column properties are cells so do not delete them, we only want to remove the children (tree table rows)
    //the string column is defined in the TableCell class
    if (this.getData().hasOwnProperty(propKey) && propKey.indexOf("column") === -1) {
      delete this.getData()[propKey];
    }
  }
};

sap.firefly.UxTreeTableRow.prototype.expandNativeRow = function(treeTableRow) {
  if (this.getParent()) {
    this.getParent().expandNativeRow(treeTableRow);
  }
};

sap.firefly.UxTreeTableRow.prototype.collapseNativeRow = function(treeTableRow) {
  if (this.getParent()) {
    this.getParent().collapseNativeRow(treeTableRow);
  }
};

sap.firefly.UxTreeTableRow.prototype.rowClicked = function() {
  if (this.getListenerOnClick() !== null) {
    this.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxTreeTableRow.prototype.rowExpanded = function() {
  if (this.getListenerOnExpand() !== null) {
    var newEvent = sap.firefly.UiItemEvent.createItem(this, null, this);
    this.getListenerOnExpand().onExpand(newEvent);
  }
};

sap.firefly.UxTreeTableRow.prototype.rowCollapsed = function() {
  if (this.getListenerOnCollapse() !== null) {
    var newEvent = sap.firefly.UiItemEvent.createItem(this, null, this);
    this.getListenerOnCollapse().onCollapse(newEvent);
  }
};

sap.firefly.UxDropDown = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxDropDown";
};
sap.firefly.UxDropDown.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxDropDown.prototype.newInstance = function() {
  var object = new sap.firefly.UxDropDown();
  object.setup();
  return object;
};

sap.firefly.UxDropDown.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.ActionSelect(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxDropDown.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxDropDown.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange
  nativeControl.attachChange(function(oEvent) {
    var nativeNode = oEvent.getParameters().selectedItem;
    var selectedItem = null;

    if (nativeNode !== null) {
      selectedItem = sap.firefly.UxGeneric.getUxControl(nativeNode);
      sap.firefly.UxGeneric.prototype.setSelectedItem.call(myself, selectedItem);
    }

    if (myself.getListenerOnSelect() !== null) {
      var ffEvent = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedItem);
      myself.getListenerOnSelect().onSelect(ffEvent);
    }
  });
};

// ======================================

sap.firefly.UxDropDown.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxDropDown.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxDropDown.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxDropDown.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ActionSelect specific
// ======================================

sap.firefly.UxDropDown.prototype.addButton = function(button) {
  sap.firefly.UxGeneric.prototype.addButton.call(this, button);
  var nativeButton = button.getNativeControl();
  this.getNativeControl().addButton(nativeButton);
  return this;
};

sap.firefly.UxDropDown.prototype.insertButton = function(button, index) {
  sap.firefly.UxGeneric.prototype.insertButton.call(this, button, index);
  var nativeButton = button.getNativeControl();
  // No insertButton method available on native control so just use addButton instead
  this.getNativeControl().addButton(button);
  return this;
};

sap.firefly.UxDropDown.prototype.removeButton = function(button) {
  var nativeButton = button.getNativeControl();
  this.getNativeControl().removeButton(nativeButton);
  sap.firefly.UxGeneric.prototype.removeButton.call(this, button);
  return this;
};

sap.firefly.UxDropDown.prototype.clearButtons = function() {
  sap.firefly.UxGeneric.prototype.clearButtons.call(this);
  this.getNativeControl().removeAllButtons();
  return this;
};

// ======================================

sap.firefly.UxDropDown.prototype.setSelectedItem = function(selectedItem) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, selectedItem);
  if (selectedItem !== null && selectedItem !== undefined) {
    var value = selectedItem.getId();
    this.getNativeControl().setSelectedItemId(value);
  } else {
    this.getNativeControl().setSelectedItem(null); // remove selection from dropdown
  }
  return this;
};

sap.firefly.UxDropDown.prototype.getSelectedItem = function() {
  var selectedItemId = this.getNativeControl().getSelectedItemId();
  var selectedItem = this.getItemById(selectedItemId);
  if (selectedItem != null) {
    return selectedItem;
  }
  return null;
};

// ======================================

sap.firefly.UxDropDown.prototype.open = function() {
  sap.firefly.UxGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

sap.firefly.UxDropDown.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

sap.firefly.UxDropDown.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

// ======================================

sap.firefly.UxDropDown.prototype.setRequired = function(required) {
  sap.firefly.UxGeneric.prototype.setRequired.call(this, required);
  return this;
};

sap.firefly.UxDropDown.prototype.isRequired = function() {
  return sap.firefly.UxGeneric.prototype.isRequired.call(this);
};

sap.firefly.UxDropDown.prototype.setValueState = function(valueState) {
  sap.firefly.UxGeneric.prototype.setValueState.call(this, valueState);
  var newValueState = sap.ui.core.ValueState.None;
  if (valueState === sap.firefly.UiValueState.NONE) {
    newValueState = sap.ui.core.ValueState.None;
  } else if (valueState === sap.firefly.UiValueState.ERROR) {
    newValueState = sap.ui.core.ValueState.Error;
  } else if (valueState === sap.firefly.UiValueState.INFORMATION) {
    newValueState = sap.ui.core.ValueState.Information;
  } else if (valueState === sap.firefly.UiValueState.SUCCESS) {
    newValueState = sap.ui.core.ValueState.Success;
  } else if (valueState === sap.firefly.UiValueState.WARNING) {
    newValueState = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setValueState(newValueState);
  return this;
};

sap.firefly.UxDropDown.prototype.getValueState = function() {
  return sap.firefly.UxGeneric.prototype.getValueState.call(this);
};

sap.firefly.UxDropDown.prototype.setValueStateText = function(valueStateText) {
  sap.firefly.UxGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

sap.firefly.UxDropDown.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

sap.firefly.UxDropDown.prototype.setEditable = function(editable) {
  sap.firefly.UxGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

sap.firefly.UxDropDown.prototype.isEditable = function() {
  return sap.firefly.UxGeneric.prototype.isEditable.call(this);
};


// Overrides
// ======================================

sap.firefly.UxDropDown.prototype.setHeight = function(height) {
  // remove height from the object
  // don't change the Dropdown height on JavaScript, it should only be done on iOS
  sap.firefly.UxGeneric.prototype.setHeight.call(this, null);
  return this;
};

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxDropDownItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxDropDownItem";
};
sap.firefly.UxDropDownItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxDropDownItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxDropDownItem();
  object.setup();
  return object;
};

sap.firefly.UxDropDownItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.core.ListItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxDropDownItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxDropDownItem.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxDropDownItem.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxDropDownItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxComboBox = function() {
   sap.firefly.UxComboBoxBase.call(this);
  this._ff_c = "UxComboBox";
};
sap.firefly.UxComboBox.prototype = new sap.firefly.UxComboBoxBase();

sap.firefly.UxComboBox.prototype.newInstance = function() {
  var object = new sap.firefly.UxComboBox();
  object.setup();
  return object;
};

sap.firefly.UxComboBox.prototype.initializeNative = function() {
  sap.firefly.UxComboBoxBase.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.ComboBox(this.getId());

  this.setNativeControl(nativeControl);
};

sap.firefly.UxComboBox.prototype.releaseObject = function() {
  sap.firefly.UxComboBoxBase.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxComboBox.prototype.registerOnChange = function(listener) {
  sap.firefly.UxComboBoxBase.prototype.registerOnChange.call(this, listener);
  this.getNativeControl().attachChange(this.handleChange.bind(this));
  return this;
};

// ======================================

sap.firefly.UxComboBox.prototype.setSelectedItem = function(selectedItem) {
  sap.firefly.UxComboBoxBase.prototype.setSelectedItem.call(this, selectedItem);
  if (selectedItem !== null && selectedItem !== undefined) {
    var value = selectedItem.getId();
    this.getNativeControl().setSelectedItemId(value);
  }
  return this;
};

sap.firefly.UxComboBox.prototype.getSelectedItem = function() {
  var selectedItemId = this.getNativeControl().getSelectedItemId();
  var selectedItem = this.getItemById(selectedItemId);
  if (selectedItem != null) {
    return selectedItem;
  }
  return null;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

sap.firefly.UxComboBox.prototype.handleSelectionChange = function(oEvent) {
  if (this.getListenerOnSelectionChange() !== null) {
    var nativeNode = oEvent.getParameters().selectedItem;
    var selectedItem = sap.firefly.UxGeneric.getUxControl(nativeNode);
    this.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createSingleSelection(this, null, selectedItem));
  }
};

sap.firefly.UxComboBox.prototype.handleChange = function(oEvent) {
  if (this.getListenerOnChange() !== null) {
    this.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(this));
  }
};

sap.firefly.UxMultiComboBox = function() {
   sap.firefly.UxComboBoxBase.call(this);
  this._ff_c = "UxMultiComboBox";
};
sap.firefly.UxMultiComboBox.prototype = new sap.firefly.UxComboBoxBase();

sap.firefly.UxMultiComboBox.prototype.newInstance = function() {
  var object = new sap.firefly.UxMultiComboBox();
  object.setup();
  return object;
};

sap.firefly.UxMultiComboBox.prototype.initializeNative = function() {
  sap.firefly.UxComboBoxBase.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.MultiComboBox(this.getId());

  this.setNativeControl(nativeControl);
};

sap.firefly.UxMultiComboBox.prototype.releaseObject = function() {
  sap.firefly.UxComboBoxBase.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMultiComboBox.prototype.registerOnSelectionFinish = function(listener) {
  sap.firefly.UxComboBoxBase.prototype.registerOnSelectionFinish.call(this, listener);
  this.getNativeControl().attachSelectionFinish(this.handleSelectionFinish.bind(this));
  return this;
};

// ======================================

sap.firefly.UxMultiComboBox.prototype.setSelectedItem = function(item) {
  sap.firefly.UxComboBoxBase.prototype.setSelectedItem.call(this, item);
  if (item !== null && item !== undefined) {
    this.getNativeControl().setSelectedItems([item.getNativeControl()]);
  }
  return this;
};

sap.firefly.UxMultiComboBox.prototype.getSelectedItem = function() {
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  if (aSelectedItems != null && aSelectedItems.length > 0) {
    return aSelectedItems[0];
  }
  return null;
};

sap.firefly.UxMultiComboBox.prototype.setSelectedItems = function(items) {
  sap.firefly.UxComboBoxBase.prototype.setSelectedItems.call(this, items);
  this.getNativeControl().clearSelection();
  if (items !== null) {
    var size = items.size();
    var itemList = [];
    for (var i = 0; i < size; i++) {
      itemList.push(items.get(i).getNativeControl());
    }
    this.getNativeControl().setSelectedItems(itemList);
  } else {
    this.getNativeControl().setSelectedItems(null);
  }
  return this;
};

sap.firefly.UxMultiComboBox.prototype.getSelectedItems = function() {
  var oList = sap.firefly.XList.create();
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < aSelectedItems.length; i++) {
    var ffControl = sap.firefly.UxGeneric.getUxControl(aSelectedItems[i]);
    oList.add(ffControl);
  }
  return oList;
};

sap.firefly.UxMultiComboBox.prototype.addSelectedItem = function(item) {
  sap.firefly.UxComboBoxBase.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().addSelectedItem(item.getNativeControl());
  }
  return this;
};

sap.firefly.UxMultiComboBox.prototype.removeSelectedItem = function(item) {
  sap.firefly.UxComboBoxBase.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().removeSelectedItem(item.getNativeControl());
  }
  return this;
};

sap.firefly.UxMultiComboBox.prototype.clearSelectedItems = function() {
  sap.firefly.UxComboBoxBase.prototype.clearSelectedItems.call(this);
  this.getNativeControl().clearSelection();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

sap.firefly.UxMultiComboBox.prototype.handleSelectionChange = function(oEvent) {
  if (this.getListenerOnSelectionChange() !== null) {
    var nativeNode = oEvent.getParameters().changedItem;
    var selectedItem = sap.firefly.UxGeneric.getUxControl(nativeNode);
    this.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createSingleSelection(this, null, selectedItem));
  }
};

sap.firefly.UxMultiComboBox.prototype.handleSelectionFinish = function(oEvent) {
  if (this.getListenerOnSelectionFinish() !== null) {
    // get the selected items
    var nativeSelectedItems = oEvent.getParameters().selectedItems || [];
    // create new firefly list
    var oSelectedItemsList = sap.firefly.XList.create();
    for (var i = 0; i < nativeSelectedItems.length; i++) {
      var ffControl = sap.firefly.UxGeneric.getUxControl(nativeSelectedItems[i]);
      oSelectedItemsList.add(ffControl);
    }
    this.getListenerOnSelectionFinish().onSelectionFinish(sap.firefly.UiSelectionEvent.createMultiSelection(this, null, oSelectedItemsList));
  }
};

sap.firefly.UxList = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxList";
};
sap.firefly.UxList.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxList.prototype.newInstance = function() {
  var object = new sap.firefly.UxList();
  object.setup();
  return object;
};

sap.firefly.UxList.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.List(this.getId());
  nativeControl.addStyleClass("sapUiLbx sapUiLbxFixed");
  nativeControl.setMode(sap.m.ListMode.SingleSelect);
  nativeControl.setIncludeItemInSelection(true);
  nativeControl.setSticky([sap.m.Sticky.HeaderToolbar]);
  // list type is not yet implemented, but is it really necessary?

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxList.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxList.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachSelectionChange(function(oControlEvent) {
    var isSelect = oControlEvent.getParameters().selected;
    if (isSelect === true) {
      if (myself.getListenerOnSelect() !== null) {
        var listItem = oControlEvent.getParameters().listItem;
        var selectedItem = sap.firefly.UxGeneric.getUxControl(listItem);
        var theEvent = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, selectedItem);
        myself.getListenerOnSelect().onSelect(theEvent);
      }
    }

    if (myself.getListenerOnSelectionChange() !== null) {
      var isSelect = oControlEvent.getParameters().selected;
      var isSelectAll = oControlEvent.getParameters().selectAll && isSelect;
      var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().listItems.length > 1); // deselctAll is when listItems length is graeter then 1

      // prepare the properties
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT, isSelect);
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_SELECT_ALL, isSelectAll);
      newParameters.putBoolean(sap.firefly.UiSelectionEvent.PARAM_DESELECT_ALL, isDeselectAll);
      myself.getListenerOnSelectionChange().onSelectionChange(sap.firefly.UiSelectionEvent.createEmptySelection(myself, newParameters));
    }
  });

  //onDelete event
  nativeControl.attachDelete(function(oControlEvent) {
    if (myself.getListenerOnDelete() !== null) {
      var nativeItem = oControlEvent.getParameters().listItem;
      var deletedItem = sap.firefly.UxGeneric.getUxControl(nativeItem);
      myself.getListenerOnDelete().onDelete(sap.firefly.UiItemEvent.createItem(myself, null, deletedItem));
    }
  });

  // onScrollLoad event -- using onAfterRender event for that, this is a private method so it might break in the future
  //only work when is inside a scrollable scroll container (e.g sap.m.Page).
  nativeControl.addDelegate({
    onAfterRendering: $.proxy(function() {
      var scroller = sap.m.getScrollDelegate(nativeControl);
      if (scroller) {
        scroller.setGrowingList(myself.throttle(function() {
          if (myself.getListenerOnScrollLoad() !== null) {
            myself.getListenerOnScrollLoad().onScrollLoad(sap.firefly.UiControlEvent.create(myself));
          }
        }, 1000), sap.m.ListGrowingDirection.Downwards)
      }
    }, this.getNativeControl())
  });
};

// ======================================

sap.firefly.UxList.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxList.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxList.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxList.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxList.prototype.getSelectedItem = function() {
  var selectedItem = this.getNativeControl().getSelectedItem();
  if (selectedItem != null) {
    return sap.firefly.UxGeneric.getUxControl(selectedItem);
  }
  return null;
};

sap.firefly.UxList.prototype.setSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
    }
  } else {
    this.clearSelectedItems();
  }
  return this;
};

sap.firefly.UxList.prototype.getSelectedItems = function() {
  var oList = sap.firefly.XList.create();
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < aSelectedItems.length; i++) {
    var ffControl = sap.firefly.UxGeneric.getUxControl(aSelectedItems[i]);
    oList.add(ffControl);
  }
  return oList;
};

sap.firefly.UxList.prototype.setSelectedItems = function(items) {
  sap.firefly.UxGeneric.prototype.setSelectedItems.call(this, items);
  this.getNativeControl().removeSelections();
  if (items !== null) {
    var size = items.size();
    for (var i = 0; i < size; i++) {
      this.getNativeControl().setSelectedItem(items.get(i).getNativeControl(), true);
    }
  }
  return this;
};

sap.firefly.UxList.prototype.addSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), true);
  }
  return this;
};

sap.firefly.UxList.prototype.removeSelectedItem = function(item) {
  sap.firefly.UxGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), false);
  }
  return this;
};

sap.firefly.UxList.prototype.clearSelectedItems = function() {
  sap.firefly.UxGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().removeSelections();
  return this;
};

// ======================================

sap.firefly.UxList.prototype.getHeader = function() {
  return sap.firefly.UxGeneric.prototype.getHeader.call(this);;
};

sap.firefly.UxList.prototype.setHeader = function(header) {
  sap.firefly.UxGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    var nativeHeaderControl = header.getNativeControl();
    this.getNativeControl().destroyHeaderToolbar(); // remove the old header toolbar
    var tmpToolbar = new sap.m.Toolbar(this.getId() + "_headerToolbar");
    tmpToolbar.addContent(nativeHeaderControl);
    this.getNativeControl().setHeaderToolbar(tmpToolbar);
  }
  return this;
};

sap.firefly.UxList.prototype.clearHeader = function() {
  sap.firefly.UxGeneric.prototype.clearHeader.call(this);
  this.getNativeControl().destroyHeaderToolbar();
  return this;
};

// ======================================

sap.firefly.UxList.prototype.setSelectionMode = function(selectionMode) {
  sap.firefly.UxGeneric.prototype.setSelectionMode.call(this, selectionMode);
  var mode = sap.m.ListMode.SingleSelectMaster;
  if (selectionMode == sap.firefly.UiSelectionMode.NONE) {
    mode = sap.m.ListMode.None;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT) {
    mode = sap.m.ListMode.SingleSelect;
  } else if (selectionMode == sap.firefly.UiSelectionMode.SINGLE_SELECT_LEFT) {
    mode = sap.m.ListMode.SingleSelectLeft;
  } else if (selectionMode == sap.firefly.UiSelectionMode.MULTI_SELECT) {
    mode = sap.m.ListMode.MultiSelect;
  } else if (selectionMode == sap.firefly.UiSelectionMode.DELETE) {
    mode = sap.m.ListMode.Delete;
  }
  this.getNativeControl().setMode(mode);
  return this;
};

sap.firefly.UxList.prototype.getSelectionMode = function() {
  return sap.firefly.UxGeneric.prototype.getSelectionMode.call(this);
};

sap.firefly.UxList.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxList.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxList.prototype.applyCustomCssStyling = function(element) {
  // the class .sapUiLbx adds display inline-block style which for some reason shows additional scrollbar when height is 100%,
  // to fix that use display block for better 100% height handing
  element.style.display = "block";
};

// Helpers
// ======================================

sap.firefly.UxListItem = function() {
   sap.firefly.UxListItemBase.call(this);
  this._ff_c = "UxListItem";
};
sap.firefly.UxListItem.prototype = new sap.firefly.UxListItemBase();

sap.firefly.UxListItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxListItem();
  object.setup();
  return object;
};

sap.firefly.UxListItem.prototype.initializeNative = function() {
  sap.firefly.UxListItemBase.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.StandardListItem(this.getId());
  nativeControl.setIconDensityAware(false); // do not try to fetch @2 icons

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxListItem.prototype.releaseObject = function() {
  sap.firefly.UxListItemBase.prototype.releaseObject.call(this);
};

// ======================================

// ======================================

sap.firefly.UxListItem.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip UxGeneric call since the property has a different name
  this.getNativeControl().setTitle(text);
  return this;
};

sap.firefly.UxListItem.prototype.getText = function() {
  return this.getNativeControl().getTitle();
};

sap.firefly.UxListItem.prototype.setDescription = function(description) {
  sap.firefly.UxListItemBase.prototype.setDescription.call(this, description);
  return this;
};

sap.firefly.UxListItem.prototype.getDescription = function() {
  return this.getNativeControl().getDescription();
};

sap.firefly.UxListItem.prototype.setIcon = function(icon) {
  sap.firefly.UxListItemBase.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxListItem.prototype.getIcon = function() {
  return sap.firefly.UxListItemBase.prototype.getIcon.call(this);
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxCustomListItem = function() {
   sap.firefly.UxListItemBase.call(this);
  this._ff_c = "UxCustomListItem";
};
sap.firefly.UxCustomListItem.prototype = new sap.firefly.UxListItemBase();

sap.firefly.UxCustomListItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxCustomListItem();
  object.setup();
  return object;
};

sap.firefly.UxCustomListItem.prototype.initializeNative = function() {
  sap.firefly.UxListItemBase.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.CustomListItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCustomListItem.prototype.releaseObject = function() {
  sap.firefly.UxListItemBase.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCustomListItem.prototype.setContent = function(content) {
  sap.firefly.UxListItemBase.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var childControl = content.getNativeControl();
    this.getNativeControl().addContent(childControl);
  }
  return this;
};

sap.firefly.UxCustomListItem.prototype.getContent = function() {
  return sap.firefly.UxListItemBase.prototype.getContent.call(this );
};

sap.firefly.UxCustomListItem.prototype.clearContent = function() {
  sap.firefly.UxListItemBase.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxSlider = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSlider";
};
sap.firefly.UxSlider.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSlider.prototype.newInstance = function() {
  var object = new sap.firefly.UxSlider();
  object.setup();
  return object;
};

sap.firefly.UxSlider.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Slider(this.getId());
  nativeControl.setValue(0);
  nativeControl.setMin(0);
  nativeControl.setMax(100);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSlider.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSlider.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onLiveChange event
  nativeControl.attachLiveChange(function(oEvent) {
    if (myself.getListenerOnLiveChange() !== null) {
      myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxSlider.prototype.setSliderMinimum = function(min) {
  sap.firefly.UxGeneric.prototype.setSliderMinimum.call(this, min);
  this.getNativeControl().setMin(min);
  return this;
};

sap.firefly.UxSlider.prototype.getSliderMinimum = function() {
  return sap.firefly.UxGeneric.prototype.getSliderMinimum.call(this);
};

sap.firefly.UxSlider.prototype.setSliderMaximum = function(max) {
  sap.firefly.UxGeneric.prototype.setSliderMaximum.call(this, max);
  this.getNativeControl().setMax(max);
  return this;
};

sap.firefly.UxSlider.prototype.getSliderMaximum = function() {
  return sap.firefly.UxGeneric.prototype.getSliderMaximum.call(this);
};

sap.firefly.UxSlider.prototype.setSliderStep = function(step) {
  sap.firefly.UxGeneric.prototype.setSliderStep.call(this, step);
  this.getNativeControl().setStep(step);
  return this;
};

sap.firefly.UxSlider.prototype.getSliderStep = function() {
  return sap.firefly.UxGeneric.prototype.getSliderStep.call(this);
};

sap.firefly.UxSlider.prototype.setSliderValue = function(value) {
  sap.firefly.UxGeneric.prototype.setSliderValue.call(this, value);
  this.getNativeControl().setValue(value);
  return this;
};

sap.firefly.UxSlider.prototype.getSliderValue = function() {
  return this.getNativeControl().getValue();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxRangeSlider = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxRangeSlider";
};
sap.firefly.UxRangeSlider.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxRangeSlider.prototype.newInstance = function() {
  var object = new sap.firefly.UxRangeSlider();
  object.setup();
  return object;
};

sap.firefly.UxRangeSlider.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.RangeSlider(this.getId());
  nativeControl.setMin(0);
  nativeControl.setMax(100);
  nativeControl.setValue(0);
  nativeControl.setValue2(100);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxRangeSlider.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxRangeSlider.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onLiveChange event
  nativeControl.attachLiveChange(function(oEvent) {
    if (myself.getListenerOnLiveChange() !== null) {
      myself.getListenerOnLiveChange().onLiveChange(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxRangeSlider.prototype.setSliderMinimum = function(min) {
  sap.firefly.UxGeneric.prototype.setSliderMinimum.call(this, min);
  this.getNativeControl().setMin(min);
  return this;
};

sap.firefly.UxRangeSlider.prototype.getSliderMinimum = function() {
  return sap.firefly.UxGeneric.prototype.getSliderMinimum.call(this);
};

sap.firefly.UxRangeSlider.prototype.setSliderMaximum = function(max) {
  sap.firefly.UxGeneric.prototype.setSliderMaximum.call(this, max);
  this.getNativeControl().setMax(max);
  return this;
};

sap.firefly.UxRangeSlider.prototype.getSliderMaximum = function() {
  return sap.firefly.UxGeneric.prototype.getSliderMaximum.call(this);
};

sap.firefly.UxRangeSlider.prototype.setSliderStep = function(step) {
  sap.firefly.UxGeneric.prototype.setSliderStep.call(this, step);
  this.getNativeControl().setStep(step);
  return this;
};

sap.firefly.UxRangeSlider.prototype.getSliderStep = function() {
  return sap.firefly.UxGeneric.prototype.getSliderStep.call(this);
};

sap.firefly.UxRangeSlider.prototype.setSliderValue = function(value) {
  sap.firefly.UxGeneric.prototype.setSliderValue.call(this, value);
  this.getNativeControl().setValue(value);
  return this;
};

sap.firefly.UxRangeSlider.prototype.getSliderValue = function() {
  return this.getNativeControl().getValue();
};

sap.firefly.UxRangeSlider.prototype.setSliderUpperValue = function(value) {
  sap.firefly.UxGeneric.prototype.setSliderUpperValue.call(this, value);
  this.getNativeControl().setValue2(value);
  return this;
};

sap.firefly.UxRangeSlider.prototype.getSliderUpperValue = function() {
  return this.getNativeControl().getValue2();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxActivityIndicator = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxActivityIndicator";
};
sap.firefly.UxActivityIndicator.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxActivityIndicator.prototype.newInstance = function() {
  var object = new sap.firefly.UxActivityIndicator();
  object.setup();
  return object;
};

sap.firefly.UxActivityIndicator.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.BusyIndicator(this.getId());
  nativeControl.setCustomIconDensityAware(false); // do not try to fetch @2 icons

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxActivityIndicator.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxActivityIndicator.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxActivityIndicator.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setText(text);
  this.getNativeControl().invalidate(); // requires for text update on a existing activity indicator!
  return this;
};

sap.firefly.UxActivityIndicator.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxActivityIndicator.prototype.setSrc = function(src) {
  sap.firefly.UxGeneric.prototype.setSrc.call(this, src);
  this.getNativeControl().setCustomIcon(src);
  return this;
};

sap.firefly.UxActivityIndicator.prototype.getSrc = function() {
  return sap.firefly.UxGeneric.prototype.getSrc.call(this);
};

sap.firefly.UxActivityIndicator.prototype.setAnimationDuration = function(animationDuration) {
  sap.firefly.UxGeneric.prototype.setAnimationDuration.call(this, animationDuration);
  this.getNativeControl().setCustomIconRotationSpeed(animationDuration);
  return this;
};

sap.firefly.UxActivityIndicator.prototype.getAnimationDuration = function() {
  return sap.firefly.UxGeneric.prototype.getAnimationDuration.call(this);
};


// Overrides
// ======================================

sap.firefly.UxActivityIndicator.prototype.setIconSize = function(iconSize) {
  sap.firefly.DfUiContext.prototype.setIconSize.call(this, iconSize); // skip generic implementation
  var iconSizeCss = this._calculateIconSizeCss();
  this.getNativeControl().setSize(iconSizeCss);
  this.getNativeControl().setCustomIconWidth(iconSizeCss); // additionally set values for custom icon
  this.getNativeControl().setCustomIconHeight(iconSizeCss); // additionally set values for custom icon
  return this;
};

// Control specific style and attribute handling
// ======================================

sap.firefly.UxActivityIndicator.prototype.applyCustomCssStyling = function(element) {
  // center the activity indicator and the text horizontally and vertically
  element.style.display = "flex";
  element.style.flexDirection = "column";
  element.style.justifyContent = "center";
  element.style.alignItems = "center";
};

// Helpers
// ======================================

sap.firefly.UxProgressIndicator = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxProgressIndicator";
};
sap.firefly.UxProgressIndicator.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxProgressIndicator.prototype.newInstance = function() {
  var object = new sap.firefly.UxProgressIndicator();
  object.setup();
  return object;
};

sap.firefly.UxProgressIndicator.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.ProgressIndicator(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxActivityIndicator.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxProgressIndicator.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxProgressIndicator.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setDisplayValue(text);
  return this;
};

sap.firefly.UxProgressIndicator.prototype.getText = function() {
  return this.getNativeControl().getDisplayValue();
};

sap.firefly.UxProgressIndicator.prototype.setAnimated = function(animated) {
  sap.firefly.UxGeneric.prototype.setAnimated.call(this, animated);
  this.getNativeControl().setDisplayAnimation(animated);
  return this;
};

sap.firefly.UxProgressIndicator.prototype.isAnimated = function() {
  return this.getNativeControl().getDisplayAnimation();
};

sap.firefly.UxProgressIndicator.prototype.setPercentValue = function(value) {
  sap.firefly.UxGeneric.prototype.setPercentValue.call(this, value);
  this.getNativeControl().setPercentValue(value);
  return this;
};

sap.firefly.UxProgressIndicator.prototype.getPercentValue = function() {
  return this.getNativeControl().getPercentValue();
};

sap.firefly.UxProgressIndicator.prototype.setShowValue = function(showValue) {
  sap.firefly.UxGeneric.prototype.setShowValue.call(this, showValue);
  this.getNativeControl().setShowValue(showValue);
  return this;
};

sap.firefly.UxProgressIndicator.prototype.isShowValue = function() {
  return this.getNativeControl().getShowValue();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxProgressIndicator.prototype.applyColorCss = function(element, color) {
  $(element).find(".sapMPIBar").css("background-color", color);
};

sap.firefly.UxProgressIndicator.prototype.applyBackgrounColorCss = function(element, bgColor) {
  $(element).find(".sapMPIBarRemaining").css("background-color", bgColor);
};

sap.firefly.UxProgressIndicator.prototype.applyFontColorCss = function(element, fontColorCss) {
  $(element).find(".sapMPIText").css("color", fontColorCss);
};

// Helpers
// ======================================

sap.firefly.UxHtml = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxHtml";
};
sap.firefly.UxHtml.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxHtml.prototype.newInstance = function() {
  var object = new sap.firefly.UxHtml();
  object.setup();
  return object;
};

sap.firefly.UxHtml.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.core.HTML(this.getId());
  nativeControl.setPreferDOM(false); // prevent moving the content to sap-ui-preserve when not needed

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxHtml.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxHtml.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onAfterRender event
  nativeControl.attachAfterRendering(function(oControlEvent) {
    if (myself.getListenerOnLoadFinished() !== null) {
      myself.getListenerOnLoadFinished().onLoadFinished(sap.firefly.UiControlEvent.create(myself, null));
    }
  });
};

// ======================================

sap.firefly.UxHtml.prototype.setValue = function(value) {
  sap.firefly.UxGeneric.prototype.setValue.call(this, value);
  if (value && value.length > 0) {
    if (this._isURL(value)) {
      this.getNativeControl().setContent("<div><iframe class ='ff-html-iframe' src='" + value + "'></iframe></div>");
    } else {
      this.getNativeControl().setContent("<div>" + value + "</div>");
    }
  }
  return this;
};

sap.firefly.UxHtml.prototype.getValue = function() {
  return sap.firefly.UxGeneric.prototype.getValue.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxHtml.prototype._isURL = function(str) {
  var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    // and extension
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?" + // port
    "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
    "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
  return pattern.test(str);
};

sap.firefly.UxWebAssembly = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxWebAssembly";
};
sap.firefly.UxWebAssembly.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxWebAssembly.prototype.newInstance = function() {
  var object = new sap.firefly.UxWebAssembly();
  object.setup();
  return object;
};

sap.firefly.UxWebAssembly.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.firefly.XtUi5ContentWrapper(this.getId(), {
    width: "100%",
    height: "100%",
    position: "absolute"
  });

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxWebAssembly.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
  this._killProgram();
};

// ======================================

sap.firefly.UxWebAssembly.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onAfterRendering event
  nativeControl.attachAfterRendering(function(oEvent) {
    myself.didRender = true;
    myself._prepareContainerAndRun();

    if (myself.getListenerOnLoadFinished() !== null) {
      myself.getListenerOnLoadFinished().onLoadFinished(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxWebAssembly.prototype.fullscreen = function() {
  sap.firefly.UxGeneric.prototype.fullscreen.call(this);
  if (window.Module && window.Module.requestFullScreen) {
    window.Module.requestFullScreen(true, false)
  }
  return this;
};

// ======================================

sap.firefly.UxWebAssembly.prototype.setSrc = function(src) {
  sap.firefly.UxGeneric.prototype.setSrc.call(this, src);
  if (this.didRender) {
    this._prepareContainerAndRun();
  }
  return this;
};

sap.firefly.UxWebAssembly.prototype.getSrc = function() {
  return sap.firefly.UxGeneric.prototype.getSrc.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxWebAssembly.prototype._adjustSrcIfNeeded = function() {
  var src = this.getSrc();
  if (src) {
    if (!src.endsWith(".html")) {
      if (!src.endsWith("/")) {
        src = src + "/";
      }
      src = src + "index.html"
    }
  }
  return src;
};

sap.firefly.UxWebAssembly.prototype._prepareContainerAndRun = function() {
  if (this.prgRunning) {
    console.warn("Program already running! Cannot start it again!");
    return;
  }

  if (this.getSrc() && this.getSrc().length > 0) {
    var src = this._adjustSrcIfNeeded();
    this._loadHtml(src);
  }
};

sap.firefly.UxWebAssembly.prototype._loadHtml = function(url) {
  var myself = this;
  $('#' + this.getId()).load(url, function(response, status, xhr) {
    if (status == "error") {
      myself._fireOnErrorEventWithMsg("Failed to load the WebAssembly start script! Does the specified program directory exist?");
      console.error(myself.getSrc());
    } else {
      console.log("Loaded the WebAssembly start script!");
      console.log("Starting program...");
    }
  });
};

sap.firefly.UxWebAssembly.prototype._killProgram = function() {
  if (window.Module && window.Module.killProgram) {
    window.Module.killProgram();
  }
};

sap.firefly.UxWebAssembly.prototype._fireOnErrorEventWithMsg = function(msg) {
  console.error(msg);
  if (this.getListenerOnError() !== null) {
    var newParameters = sap.firefly.XProperties.create();
    newParameters.putString(sap.firefly.UiControlEvent.PARAM_MSG, msg);
    this.getListenerOnError().onError(sap.firefly.UiControlEvent.create(this, newParameters));
  }
};

sap.firefly.UxCanvasLayout = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxCanvasLayout";
};
sap.firefly.UxCanvasLayout.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxCanvasLayout.prototype.newInstance = function() {
  var object = new sap.firefly.UxCanvasLayout();
  object.setup();
  return object;
};

sap.firefly.UxCanvasLayout.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.ScrollContainer(this.getId());
  nativeControl.setHorizontal(true); // enable horizontal scrolling
  nativeControl.setVertical(true); // enable vertical scrolling

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxCanvasLayout.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxCanvasLayout.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxCanvasLayout.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addContent(nativeItem);
  return this;
};

sap.firefly.UxCanvasLayout.prototype.insertItem = function(item) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertContent(nativeItem, index);
  return this;
};

sap.firefly.UxCanvasLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeContent(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this);
  return this;
};

sap.firefly.UxCanvasLayout.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call();
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxVerticalSplitter = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxVerticalSplitter";
};
sap.firefly.UxVerticalSplitter.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxVerticalSplitter.prototype.newInstance = function() {
  var object = new sap.firefly.UxVerticalSplitter();
  object.setup();
  return object;
};

sap.firefly.UxVerticalSplitter.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.layout.Splitter(this.getId());
  nativeControl.setOrientation(sap.ui.core.Orientation.Vertical);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxVerticalSplitter.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxVerticalSplitter.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxVerticalSplitter.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addContentArea(nativeItem);
  return this;
};

sap.firefly.UxVerticalSplitter.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertContentArea(nativeItem, index);
  return this;
};

sap.firefly.UxVerticalSplitter.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeContentArea(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxVerticalSplitter.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllContentAreas();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxHorizontalSplitter = function() {
   sap.firefly.UxVerticalSplitter.call(this);
  this._ff_c = "UxHorizontalSplitter";
};
sap.firefly.UxHorizontalSplitter.prototype = new sap.firefly.UxVerticalSplitter();

sap.firefly.UxHorizontalSplitter.prototype.newInstance = function() {
  var object = new sap.firefly.UxHorizontalSplitter();
  object.setup();
  return object;
};

sap.firefly.UxHorizontalSplitter.prototype.initializeNative = function() {
  sap.firefly.UxVerticalSplitter.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = this.getNativeControl();
  nativeControl.setOrientation(sap.ui.core.Orientation.Horizontal);
};

// UxHorizontalSplitter inherits from UxVerticalSplitter and it has the same properties

sap.firefly.UxHorizontalLayout = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxHorizontalLayout";
};
sap.firefly.UxHorizontalLayout.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxHorizontalLayout.prototype.newInstance = function() {
  var object = new sap.firefly.UxHorizontalLayout();
  object.setup();
  return object;
};

sap.firefly.UxHorizontalLayout.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.HBox(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxHorizontalLayout.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxHorizontalLayout.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxHorizontalLayout.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxHorizontalLayout.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxHorizontalLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxHorizontalLayout.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxHorizontalLayout.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or content will break out of bounds if the content is bigger then the layout
  element.style.overflowX = "auto";
};

// Helpers
// ======================================

sap.firefly.UxVerticalLayout = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxVerticalLayout";
};
sap.firefly.UxVerticalLayout.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxVerticalLayout.prototype.newInstance = function() {
  var object = new sap.firefly.UxVerticalLayout();
  object.setup();
  return object;
};

sap.firefly.UxVerticalLayout.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.VBox(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxVerticalLayout.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxVerticalLayout.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxVerticalLayout.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxVerticalLayout.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxVerticalLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxVerticalLayout.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxVerticalLayout.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or content will break out of bounds if the content is bigger then the layout
  element.style.overflowY = "auto";
};

// Helpers
// ======================================

sap.firefly.UxFlexLayout = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxFlexLayout";
};
sap.firefly.UxFlexLayout.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxFlexLayout.prototype.newInstance = function() {
  var object = new sap.firefly.UxFlexLayout();
  object.setup();
  return object;
};

sap.firefly.UxFlexLayout.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.FlexBox(this.getId());
  nativeControl.setRenderType(sap.m.FlexRendertype.Bare); // remove the divs which wrap the items
  nativeControl.setFitContainer(true);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxFlexLayout.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxFlexLayout.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxFlexLayout.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxFlexLayout.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxFlexLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxFlexLayout.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxFlexLayout.prototype.setDirection = function(direction) {
  sap.firefly.UxGeneric.prototype.setDirection.call(this, direction);
  if (direction === sap.firefly.UiFlexDirection.ROW) {
    this.getNativeControl().setDirection(sap.m.FlexDirection.Row);
  } else if (direction === sap.firefly.UiFlexDirection.ROW_REVERSE) {
    this.getNativeControl().setDirection(sap.m.FlexDirection.RowReverse);
  } else if (direction === sap.firefly.UiFlexDirection.COLUMN) {
    this.getNativeControl().setDirection(sap.m.FlexDirection.Column);
  } else if (direction === sap.firefly.UiFlexDirection.COLUMN_REVERSE) {
    this.getNativeControl().setDirection(sap.m.FlexDirection.ColumnReverse);
  } else if (direction === sap.firefly.UiFlexDirection.INHERIT) {
    this.getNativeControl().setDirection(sap.m.FlexDirection.Inherit);
  }
  return this;
};

sap.firefly.UxFlexLayout.prototype.getDirection = function() {
  return sap.firefly.UxGeneric.prototype.getDirection.call(this);
};

sap.firefly.UxFlexLayout.prototype.setAlignItems = function(alignItems) {
  sap.firefly.UxGeneric.prototype.setAlignItems.call(this, alignItems);
  if (alignItems === sap.firefly.UiFlexAlignItems.BASELINE) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignItems.Baseline);
  } else if (alignItems === sap.firefly.UiFlexAlignItems.CENTER) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignItems.Center);
  } else if (alignItems === sap.firefly.UiFlexAlignItems.END) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignItems.End);
  } else if (alignItems === sap.firefly.UiFlexAlignItems.START) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignItems.Start);
  } else if (alignItems === sap.firefly.UiFlexAlignItems.STRETCH) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignItems.Stretch);
  } else if (alignItems === sap.firefly.UiFlexAlignItems.INHERIT) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignItems.Inherit);
  }
  return this;
};

sap.firefly.UxFlexLayout.prototype.getAlignItems = function() {
  return sap.firefly.UxGeneric.prototype.getAlignItems.call(this);
};

sap.firefly.UxFlexLayout.prototype.setAlignContent = function(alignContent) {
  sap.firefly.UxGeneric.prototype.setAlignContent.call(this, alignContent);
  if (alignContent === sap.firefly.UiFlexAlignContent.CENTER) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.Center);
  } else if (alignContent === sap.firefly.UiFlexAlignItems.END) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.End);
  } else if (alignContent === sap.firefly.UiFlexAlignItems.SPACE_AROUND) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.SpaceAround);
  } else if (alignContent === sap.firefly.UiFlexAlignItems.SPACE_BETWEEN) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.SpaceBetween);
  } else if (alignContent === sap.firefly.UiFlexAlignItems.START) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.Start);
  } else if (alignContent === sap.firefly.UiFlexAlignItems.STRETCH) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.Stretch);
  } else if (alignContent === sap.firefly.UiFlexAlignItems.INHERIT) {
    this.getNativeControl().setAlignItems(sap.m.FlexAlignContent.Inherit);
  }
  return this;
};

sap.firefly.UxFlexLayout.prototype.getAlignContent = function() {
  return sap.firefly.UxGeneric.prototype.getAlignContent.call(this);
};

sap.firefly.UxFlexLayout.prototype.setJustifyContent = function(justifyContent) {
  sap.firefly.UxGeneric.prototype.setJustifyContent.call(this, justifyContent);
  if (justifyContent === sap.firefly.UiFlexJustifyContent.CENTER) {
    this.getNativeControl().setJustifyContent(sap.m.FlexJustifyContent.Center);
  } else if (justifyContent === sap.firefly.UiFlexJustifyContent.END) {
    this.getNativeControl().setJustifyContent(sap.m.FlexJustifyContent.End);
  } else if (justifyContent === sap.firefly.UiFlexJustifyContent.SPACE_AROUND) {
    this.getNativeControl().setJustifyContent(sap.m.FlexJustifyContent.SpaceAround);
  } else if (justifyContent === sap.firefly.UiFlexJustifyContent.SPACE_BETWEEN) {
    this.getNativeControl().setJustifyContent(sap.m.FlexJustifyContent.SpaceBetween);
  } else if (justifyContent === sap.firefly.UiFlexJustifyContent.START) {
    this.getNativeControl().setJustifyContent(sap.m.FlexJustifyContent.Start);
  } else if (justifyContent === sap.firefly.UiFlexJustifyContent.INHERIT) {
    this.getNativeControl().setJustifyContent(sap.m.FlexJustifyContent.Inherit);
  }
  return this;
};

sap.firefly.UxFlexLayout.prototype.getJustifyContent = function() {
  return sap.firefly.UxGeneric.prototype.getJustifyContent.call(this);
};

sap.firefly.UxFlexLayout.prototype.setWrap = function(wrap) {
  sap.firefly.UxGeneric.prototype.setWrap.call(this, wrap);
  if (wrap === sap.firefly.UiFlexWrap.NO_WRAP) {
    this.getNativeControl().setWrap(sap.m.FlexWrap.NoWrap);
  } else if (wrap === sap.firefly.UiFlexWrap.WRAP) {
    this.getNativeControl().setWrap(sap.m.FlexWrap.Wrap);
  } else if (wrap === sap.firefly.UiFlexWrap.WRAP_REVERSE) {
    this.getNativeControl().setWrap(sap.m.FlexWrap.WrapReverse);
  }
  return this;
};

sap.firefly.UxFlexLayout.prototype.getWrap = function() {
  return sap.firefly.UxGeneric.prototype.getWrap.call(this);
};

sap.firefly.UxFlexLayout.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxFlexLayout.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxFlexLayout.prototype.applyCustomCssStyling = function(element) {
  // add overflow so that scrollbar appears when the content is bigger
  element.style.overflow = "auto";
};

// Helpers
// ======================================

sap.firefly.UxFlowLayout = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxFlowLayout";
};
sap.firefly.UxFlowLayout.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxFlowLayout.prototype.newInstance = function() {
  var object = new sap.firefly.UxFlowLayout();
  object.setup();
  return object;
};

sap.firefly.UxFlowLayout.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.FlexBox(this.getId());
  nativeControl.setRenderType(sap.m.FlexRendertype.Bare); // remove the divs which wrap the items
  nativeControl.setWrap(sap.m.FlexWrap.Wrap);
  nativeControl.setJustifyContent(sap.m.FlexJustifyContent.SpaceAround);
  nativeControl.setFitContainer(true);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxFlowLayout.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxFlowLayout.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxFlowLayout.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxFlowLayout.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxFlowLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxFlowLayout.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxFlowLayout.prototype.applyCustomCssStyling = function(element) {
  // add overflow so that scrollbar appears when the content is bigger
  element.style.overflow = "auto";
};

// Helpers
// ======================================

sap.firefly.UxTabBar = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTabBar";
};
sap.firefly.UxTabBar.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTabBar.prototype.newInstance = function() {
  var object = new sap.firefly.UxTabBar();
  object.setup();
  return object;
};

sap.firefly.UxTabBar.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.TabContainer(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTabBar.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTabBar.prototype._addEvents = function(nativeControl) {
  var myself = this;

  nativeControl.attachItemSelect(function(oEvent) {
    if (myself.getListenerOnItemSelect() !== null) {
      var nativeItem = oEvent.getParameters().item;
      if (nativeItem) {
        var key = nativeItem.getKey();
        var theItem = myself.getItemById(key); // i write the id of the tabstrip item as key
        var uiItemEvent = sap.firefly.UiItemEvent.createItem(myself, null, theItem);
        myself.getListenerOnItemSelect().onItemSelect(uiItemEvent);
      }

    }
  });

  nativeControl.attachItemClose(function(oEvent) {
    oEvent.preventDefault(); // do not automatically close the tab!
    if (myself.getListenerOnItemClose() !== null) {
      var nativeItem = oEvent.getParameters().item;
      if (nativeItem) {
        var key = nativeItem.getKey();
        var theItem = myself.getItemById(key); // i write the id of the tabstrip item as key
        var uiItemEvent = sap.firefly.UiItemEvent.createItem(myself, null, theItem);
        myself.getListenerOnItemClose().onItemClose(uiItemEvent);
      }
    }
  });

  nativeControl.attachAddNewButtonPress(function(oEvent) {
    if (myself.getListenerOnButtonPress() !== null) {
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE, sap.firefly.UiPressedButtonType.ADD.getName());
      myself.getListenerOnButtonPress().onButtonPress(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });

};

// ======================================

sap.firefly.UxTabBar.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxTabBar.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxTabBar.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxTabBar.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxTabBar.prototype.setSelectedItem = function(selectedItem) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, selectedItem);
  if (selectedItem !== null) {
    var nativeItem = selectedItem.getNativeControl(); // can be the id or the item itself
    this.getNativeControl().setSelectedItem(nativeItem);
  }
  return this;
};

sap.firefly.UxTabBar.prototype.getSelectedItem = function() {
  var selectedKey = this.getNativeControl().getSelectedItem(); // this method runs the id as string!!!
  var selectedItem = this.getItemById(selectedKey); // i write the id of the tabstrip item as key
  return selectedItem;
};

// ======================================

sap.firefly.UxTabBar.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxTabBar.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxTabBar.prototype.setShowAddNewButton = function(showAddNewButton) {
  sap.firefly.UxGeneric.prototype.setShowAddNewButton.call(this, showAddNewButton);
  this.getNativeControl().setShowAddNewButton(showAddNewButton);
  return this;
};

sap.firefly.UxTabBar.prototype.isShowAddNewButton = function() {
  return sap.firefly.UxGeneric.prototype.isShowAddNewButton.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTabBarItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTabBarItem";
};
sap.firefly.UxTabBarItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTabBarItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxTabBarItem();
  object.setup();
  return object;
};

sap.firefly.UxTabBarItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.TabContainerItem(this.getId());
  nativeControl.setKey(this.getId()); // used for selection
  nativeControl.setName("Tab");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTabBarItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTabBarItem.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxTabBarItem.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var nativeContent = content.getNativeControl();
    this.getNativeControl().addContent(nativeContent);
  }
  return this;
};

sap.firefly.UxTabBarItem.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxTabBarItem.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxTabBarItem.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text);
  this.getNativeControl().setName(text);
  return this;
};

sap.firefly.UxTabBarItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxTabBarItem.prototype.setDescription = function(description) {
  sap.firefly.DfUiContext.prototype.setDescription.call(this, description);
  this.getNativeControl().setAdditionalText(description);
  return this;
};

sap.firefly.UxTabBarItem.prototype.getDescription = function() {
  return sap.firefly.UxGeneric.prototype.getDescription.call(this);
};

sap.firefly.UxTabBarItem.prototype.setIcon = function(icon) {
  sap.firefly.UxGeneric.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxTabBarItem.prototype.getIcon = function() {
  return sap.firefly.UxGeneric.prototype.getIcon.call(this);
};

sap.firefly.UxTabBarItem.prototype.setModified = function(modified) {
  sap.firefly.UxGeneric.prototype.setModified.call(this, modified);
  // set only if a different value was passed, somehow when passing the same value (true) then the marking next to the text toggles on/off!
  if(this.getNativeControl().getModified() !== modified){
    this.getNativeControl().setModified(modified);
  }
  return this;
};

sap.firefly.UxTabBarItem.prototype.isModified = function() {
  return sap.firefly.UxGeneric.prototype.isModified.call(this);
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxIconTabBar = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxIconTabBar";
};
sap.firefly.UxIconTabBar.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxIconTabBar.prototype.newInstance = function() {
  var object = new sap.firefly.UxIconTabBar();
  object.setup();
  return object;
};

sap.firefly.UxIconTabBar.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.IconTabBar(this.getId());
  nativeControl.setStretchContentHeight(true);
  nativeControl.setExpandable(false);
  nativeControl.setTabDensityMode(sap.m.IconTabDensityMode.Inherit);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxIconTabBar.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxIconTabBar.prototype._addEvents = function(nativeControl) {
  var myself = this;

  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnSelect() !== null) {
      var key = oEvent.getParameters().selectedItem.getKey();
      var theItem = myself.getItemById(key); // i write the id of the tabstrip item as key
      var uiEventSelection = sap.firefly.UiSelectionEvent.createSingleSelection(myself, null, theItem);
      myself.getListenerOnSelect().onSelect(uiEventSelection);
    }
  });
};

// ======================================

sap.firefly.UxIconTabBar.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

sap.firefly.UxIconTabBar.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

sap.firefly.UxIconTabBar.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxIconTabBar.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

sap.firefly.UxIconTabBar.prototype.setSelectedItem = function(selectedItem) {
  sap.firefly.UxGeneric.prototype.setSelectedItem.call(this, selectedItem);
  if (selectedItem !== null) {
    var key = selectedItem.getId(); // i write the id of the tabstrip item as key
    this.getNativeControl().setSelectedKey(key);
  }
  return this;
};


sap.firefly.UxIconTabBar.prototype.getSelectedItem = function() {
  var selectedKey = this.getNativeControl().getSelectedKey();
  var selectedItem = this.getItemById(selectedKey); // i write the id of the tabstrip item as key
  return selectedItem;
};

// ======================================

sap.firefly.UxIconTabBar.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxIconTabBar.prototype.isBusy = function() {
  return sap.firefly.UxGeneric.prototype.isBusy.call(this);
};

sap.firefly.UxIconTabBar.prototype.setApplyContentPadding = function(applyContentPadding) {
  sap.firefly.UxGeneric.prototype.setApplyContentPadding.call(this, applyContentPadding);
  if (this.getNativeControl()) {
    this.getNativeControl().setApplyContentPadding(applyContentPadding);
  }
  return this;
};

sap.firefly.UxIconTabBar.prototype.isApplyContentPadding = function() {
  return sap.firefly.UxGeneric.prototype.isApplyContentPadding.call(this);
};

sap.firefly.UxIconTabBar.prototype.setEnableReordering = function(enableReordering) {
  sap.firefly.UxGeneric.prototype.setEnableReordering.call(this, enableReordering);
  if (this.getNativeControl()) {
    this.getNativeControl().setEnableTabReordering(enableReordering);
  }
  return this;
};

sap.firefly.UxIconTabBar.prototype.isEnableReordering = function() {
  return sap.firefly.UxGeneric.prototype.isEnableReordering.call(this);
};

sap.firefly.UxIconTabBar.prototype.setHeaderMode = function(headerMode) {
  sap.firefly.UxGeneric.prototype.setHeaderMode.call(this, headerMode);
  var nativeMode = sap.m.IconTabHeaderMode.Standard;
  if (headerMode == sap.firefly.UiIconTabBarHeaderMode.STANDARD) {
    nativeMode = sap.m.IconTabHeaderMode.Standard;
  } else if (headerMode == sap.firefly.UiIconTabBarHeaderMode.INLINE) {
    nativeMode = sap.m.IconTabHeaderMode.Inline;
  }
  if (this.getNativeControl()) {
    this.getNativeControl().setHeaderMode(nativeMode);
  }
  return this;
};

sap.firefly.UxIconTabBar.prototype.getHeaderMode = function() {
  return sap.firefly.UxGeneric.prototype.getHeaderMode.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxIconTabBar.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or content will break out of bounds
  $(element).find(".sapMITBContent").css("overflow", "auto");
  // position: relative, with and height are required for coreect setStretchContentHeight property
  element.style.position = "relative";
  element.style.width = "100%";
  element.style.height = "100%";
};

// Helpers
// ======================================

sap.firefly.UxIconTabBarItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxIconTabBarItem";
};
sap.firefly.UxIconTabBarItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxIconTabBarItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxIconTabBarItem();
  object.setup();
  return object;
};

sap.firefly.UxIconTabBarItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.IconTabFilter(this.getId());
  nativeControl.setKey(this.getId()); // used for selection
  nativeControl.setText("Tab");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxIconTabBarItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxIconTabBarItem.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxIconTabBarItem.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var nativeContent = content.getNativeControl();
    this.getNativeControl().addContent(nativeContent);
  }
  return this;
};

sap.firefly.UxIconTabBarItem.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxIconTabBarItem.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxIconTabBarItem.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxIconTabBarItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxIconTabBarItem.prototype.setIcon = function(icon) {
  sap.firefly.UxGeneric.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxIconTabBarItem.prototype.getIcon = function() {
  return sap.firefly.UxGeneric.prototype.getIcon.call(this);
};

sap.firefly.UxIconTabBarItem.prototype.setCount = function(count) {
  sap.firefly.UxGeneric.prototype.setCount.call(this, count);
  this.getNativeControl().setCount(count);
  return this;
};

sap.firefly.UxIconTabBarItem.prototype.getCount = function() {
  return sap.firefly.UxGeneric.prototype.getCount.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxDialog = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxDialog";
};
sap.firefly.UxDialog.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxDialog.prototype.newInstance = function() {
  var object = new sap.firefly.UxDialog();
  object.setup();
  return object;
};

sap.firefly.UxDialog.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Dialog(this.getId());
  nativeControl.setDraggable(true); // default is false, we want to have it default true

  // use setStretch on a mobile device (tablet and phone) to make sure that the dialog is full screen
  if (this.getUiManager().getDeviceInfo().isMobile() == true || sap.ui.Device.system.phone == true) {
    nativeControl.setStretch(true);
  }

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxDialog.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxDialog.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // beforeOpen event
  nativeControl.attachBeforeOpen(function(oEvent) {
    if (myself.getListenerOnBeforeOpen() !== null) {
      myself.getListenerOnBeforeOpen().onBeforeOpen(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // beforeClose event
  nativeControl.attachBeforeClose(function(oEvent) {
    if (myself.getListenerOnBeforeClose() !== null) {
      myself.getListenerOnBeforeClose().onBeforeClose(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // afterOpen event
  nativeControl.attachAfterOpen(function(oEvent) {
    if (myself.getListenerOnOpen() !== null) {
      myself.getListenerOnOpen().onOpen(sap.firefly.UiControlEvent.create(myself));
    }

    if (myself.getListenerOnAfterOpen() !== null) {
      myself.getListenerOnAfterOpen().onAfterOpen(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // afterClose event
  nativeControl.attachAfterClose(function(oEvent) {
    if (myself.getListenerOnClose() !== null) {
      myself.getListenerOnClose().onClose(sap.firefly.UiControlEvent.create(myself));
    }

    if (myself.getListenerOnAfterClose() !== null) {
      myself.getListenerOnAfterClose().onAfterClose(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxDialog.prototype.addDialogButton = function(dialogButton) {
  sap.firefly.UxGeneric.prototype.addDialogButton.call(this, dialogButton);
  var nativeDialogButton = dialogButton.getNativeControl();
  this.getNativeControl().addButton(nativeDialogButton);
  if (this.getDialogButtonCount() == 1) {
    this.getNativeControl().setInitialFocus(nativeDialogButton);
    nativeDialogButton.focus();
  }
  return this;
};

sap.firefly.UxDialog.prototype.insertDialogButton = function(dialogButton, index) {
  sap.firefly.UxGeneric.prototype.insertDialogButton.call(this, dialogButton, index);
  var nativeDialogButton = dialogButton.getNativeControl();
  this.getNativeControl().insertButton(nativeDialogButton, index);
  return this;
};

sap.firefly.UxDialog.prototype.removeDialogButton = function(dialogButton) {
  var nativeDialogButton = dialogButton.getNativeControl();
  this.getNativeControl().removeButton(nativeDialogButton);
  sap.firefly.UxGeneric.prototype.removeDialogButton.call(this, dialogButton);
  return this;
};

sap.firefly.UxDialog.prototype.clearDialogButtons = function() {
  sap.firefly.UxGeneric.prototype.clearDialogButtons.call(this);
  this.getNativeControl().removeAllButtons();
  return this;
};

// ======================================

sap.firefly.UxDialog.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var childNativeControl = content.getNativeControl();
    this.getNativeControl().addContent(childNativeControl);
  }
  return this;
};

sap.firefly.UxDialog.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxDialog.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
};

// ======================================

sap.firefly.UxDialog.prototype.open = function() {
  sap.firefly.UxGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

sap.firefly.UxDialog.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

sap.firefly.UxDialog.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

sap.firefly.UxDialog.prototype.shake = function() {
  sap.firefly.UxGeneric.prototype.shake.call(this);
  this._shakeDialog();
  return this;
};

// ======================================

sap.firefly.UxDialog.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setTitle(title);
  return this;
};

sap.firefly.UxDialog.prototype.getTitle = function() {
  return this.getNativeControl().getTitle();
};

sap.firefly.UxDialog.prototype.setResizable = function(resizable) {
  sap.firefly.UxGeneric.prototype.setResizable.call(this, resizable);
  this.getNativeControl().setResizable(resizable);
  return this;
};

sap.firefly.UxDialog.prototype.isResizable = function() {
  return sap.firefly.UxGeneric.prototype.isResizable.call(this);
};

sap.firefly.UxDialog.prototype.setIcon = function(icon) {
  sap.firefly.UxGeneric.prototype.setIcon.call(this, icon);
  return this;
};

sap.firefly.UxDialog.prototype.getIcon = function() {
  return sap.firefly.UxGeneric.prototype.getIcon.call(this);
};

sap.firefly.UxDialog.prototype.setState = function(state) {
  sap.firefly.UxGeneric.prototype.setState.call(this, state);
  var ui5State = sap.ui.core.ValueState.None;
  if (state === sap.firefly.UiValueState.NONE) {
    ui5State = sap.ui.core.ValueState.None;
  } else if (state === sap.firefly.UiValueState.ERROR) {
    ui5State = sap.ui.core.ValueState.Error;
  } else if (state === sap.firefly.UiValueState.INFORMATION) {
    ui5State = sap.ui.core.ValueState.Information;
  } else if (state === sap.firefly.UiValueState.SUCCESS) {
    ui5State = sap.ui.core.ValueState.Success;
  } else if (state === sap.firefly.UiValueState.WARNING) {
    ui5State = sap.ui.core.ValueState.Warning;
  }
  this.getNativeControl().setState(ui5State);
  return this;
};

sap.firefly.UxDialog.prototype.getState = function() {
  return sap.firefly.UxGeneric.prototype.getState.call(this);
};

sap.firefly.UxDialog.prototype.setShowHeader = function(showHeader) {
  sap.firefly.UxGeneric.prototype.setShowHeader.call(this, showHeader);
  this.getNativeControl().setShowHeader(showHeader);
  return this;
};

sap.firefly.UxDialog.prototype.isShowHeader = function() {
  return this.getNativeControl().getShowHeader();
};

// Overrides
// ======================================

sap.firefly.UxDialog.prototype.setWidth = function(width) {
  sap.firefly.DfUiContext.prototype.setWidth.call(this, width); // skip generic implementation
  var widthCss = this.calculateWidthCss();
  this.getNativeControl().setContentWidth(widthCss);
  return this;
};

sap.firefly.UxDialog.prototype.setHeight = function(height) {
  sap.firefly.DfUiContext.prototype.setHeight.call(this, height); // skip generic implementation
  var heightCss = this.calculateHeightCss();
  this.getNativeControl().setContentHeight(heightCss);
  return this;
};

sap.firefly.UxDialog.prototype.setDraggable = function(draggable) {
  sap.firefly.DfUiContext.prototype.setDraggable.call(this, draggable); // skip generic implementation
  this.getNativeControl().setDraggable(draggable);
  return this;
};

// Control specific style and attribute handling
// ======================================

sap.firefly.UxDialog.prototype.applyCustomCssStyling = function(element) {
  // scroll content should always have 100% (default is auto), this makes dynamic layouting better
  $(element).find(".sapMDialogScroll").css("height", "100%");
};

sap.firefly.UxDialog.prototype.applyPaddingCss = function(element, paddingCss) {
  $(element).find(".sapMDialogScrollCont").css("padding", paddingCss);
  if (paddingCss != null) {
    // when setting padding then i need to substract twice the padding from the height so that the content perfectly fits into the window
    var dialogScrollContent = $(element).find(".sapMDialogScrollCont").first();
    // only do that when the sapMDialogStretchContent exists on the element since this class sets height to 100%
    if (dialogScrollContent.hasClass("sapMDialogStretchContent")) {
      $(element).find(".sapMDialogScrollCont").css("height", "calc(100% - 2 * " + paddingCss + ")");
    }
  }
};

sap.firefly.UxDialog.prototype.applyMinWidthCss = function(element, minWidthCss) {
  $(element).find(".sapMDialogScroll").css("min-width", minWidthCss);
};

sap.firefly.UxDialog.prototype.applyMaxWidthCss = function(element, maxWidthCss) {
  $(element).find(".sapMDialogScroll").css("max-width", maxWidthCss);
};

sap.firefly.UxDialog.prototype.applyMinHeightCss = function(element, minHeightCss) {
  $(element).find(".sapMDialogScroll").css("min-height", minHeightCss);
};

sap.firefly.UxDialog.prototype.applyMaxHeightCss = function(element, maxHeightCss) {
  $(element).find(".sapMDialogScroll").css("max-height", maxHeightCss);
};

// Helpers
// ======================================

sap.firefly.UxDialog.prototype._shakeDialog = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    var domElement = this.getNativeControl().getDomRef();
    var distance = 6;
    var duration = 80;
    var index = 0;
    $(domElement).css("transition", "none");
    var shakeInterval = setInterval(function() {
      index++;
      $(domElement).finish().animate({
        left: ["+=" + distance, "swing"]
      }, duration, function() {
        $(domElement).animate({
          left: ["-=" + distance, "swing"]
        }, duration, function() {
          if (index > 2) {
            clearInterval(shakeInterval);
            $(domElement).css("transition", "");
          }
        });
      });
    }, 40 + (duration * 2));
  }
};

sap.firefly.UxDialogButton = function() {
   sap.firefly.UxButton.call(this);
  this._ff_c = "UxDialogButton";
};
sap.firefly.UxDialogButton.prototype = new sap.firefly.UxButton();

sap.firefly.UxDialogButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxDialogButton();
  object.setup();
  return object;
};

// DialogButton inherits from Button and it has the same properties

sap.firefly.UxAlert = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxAlert";

  this.m_labelView = null;
};
sap.firefly.UxAlert.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxAlert.prototype.newInstance = function() {
  var object = new sap.firefly.UxAlert();
  object.setup();
  return object;
};

sap.firefly.UxAlert.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Dialog(this.getId(), {
    title: "",
    type: "Message",
    resizable: false,
    draggable: false,
    endButton: new sap.m.Button(this.getId() + "_closeBtn", {
      text: "Ok",
      press: function() {
        nativeControl.close();
        // dialog.destroy();
      }
    })
  });

  // add the lavel view to the alert
  this.m_labelView = new sap.m.Label(this.getId() + "_label", {
    text: "",
    textAlign: sap.ui.core.TextAlign.Center,
    wrapping: true,
    width: "100%"
  });
  nativeControl.addContent(this.m_labelView);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxAlert.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxAlert.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // close event
  nativeControl.attachAfterClose(function(oEvent) {
    if (myself.getListenerOnClose() !== null) {
      myself.getListenerOnClose().onClose(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxAlert.prototype.open = function() {
  sap.firefly.UxGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

sap.firefly.UxAlert.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

sap.firefly.UxAlert.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

// ======================================

sap.firefly.UxAlert.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setTitle(title);
  return this;
};

sap.firefly.UxAlert.prototype.getTitle = function() {
  return this.getNativeControl().getTitle();
};

sap.firefly.UxAlert.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation
  this.m_labelView.setText(text);
  return this;
};

sap.firefly.UxAlert.prototype.getText = function() {
  return this.m_labelView.getText();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxToast = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxToast";

  this.m_isOpen = false;
};
sap.firefly.UxToast.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxToast.prototype.newInstance = function() {
  var object = new sap.firefly.UxToast();
  object.setup();
  return object;
};

sap.firefly.UxToast.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxToast.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxToast.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxToast.prototype.open = function() {
  sap.firefly.UxGeneric.prototype.open.call(this);
  var myself = this;
  sap.m.MessageToast.show(this.getText(), {
    duration: 5000,
    autoClose: false,
    onClose: function() {
      myself.m_isOpen = false;
    }
  });

  this._applyBackgroundAndFontColor();

  this.m_isOpen = true;

  return this;
};

sap.firefly.UxToast.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  // currently not possible to close a sap.m.MessageToast manually
  return this;
};

sap.firefly.UxToast.prototype.isOpen = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  return this.m_isOpen;
};

// ======================================

sap.firefly.UxToast.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxToast.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxToast.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxGeneric.prototype.setFontColor.call(this, fontColor);
  // toast has no native control so superclass method can be called here
  return this;
};

sap.firefly.UxToast.prototype.getFontColor = function() {
  return sap.firefly.UxGeneric.prototype.getFontColor.call(this);
};

sap.firefly.UxToast.prototype.setMessageType = function(messageType) {
  sap.firefly.UxGeneric.prototype.setMessageType.call(this, messageType);
  return this;
};

sap.firefly.UxToast.prototype.getMessageType = function() {
  return sap.firefly.UxGeneric.prototype.getMessageType.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxToast.prototype._applyBackgroundAndFontColor = function() {

  var messageType = this.getMessageType();
  var bgColor = null;
  var fontColor = null;

  if (messageType && messageType !== sap.firefly.UiMessageType.NONE) {
    // if message type set and not NONE then apply hard styling
    if (messageType === sap.firefly.UiMessageType.ERROR) {
      bgColor = "#FFD2D2";
      fontColor = "#D8000C";
    } else if (messageType === sap.firefly.UiMessageType.INFORMATION) {
      bgColor = "#BDE5F8";
      fontColor = "#00529B";
    } else if (messageType === sap.firefly.UiMessageType.SUCCESS) {
      bgColor = "#DFF2BF";
      fontColor = "#4F8A10";
    } else if (messageType === sap.firefly.UiMessageType.WARNING) {
      bgColor = "#FEEFB3";
      fontColor = "#9F6000";
    }
  } else {
    // if message type not set or NONE then use provided background and font color
    if (this.getBackgroundColor()) {
      bgColor = this.getBackgroundColor().getRgbaColor();
    }
    if (this.getFontColor()) {
      fontColor = this.getFontColor().getRgbaColor();
    }
  }

  // apply the colors if set
  if (bgColor !== null) {
    var oMessageToastDOM = $("#content").parent().find(".sapMMessageToast").last();
    oMessageToastDOM.css("background", bgColor);
  }

  if (fontColor !== null) {
    var oMessageToastDOM = $("#content").parent().find(".sapMMessageToast").last();
    oMessageToastDOM.css("color", fontColor);
  }
};

sap.firefly.UxPopover = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxPopover";
};
sap.firefly.UxPopover.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxPopover.prototype.newInstance = function() {
  var object = new sap.firefly.UxPopover();
  object.setup();
  return object;
};

sap.firefly.UxPopover.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Popover(this.getId());
  nativeControl.setShowHeader(false);
  nativeControl.setPlacement(sap.m.PlacementType.Auto);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxPopover.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxPopover.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // beforeOpen event
  nativeControl.attachBeforeOpen(function(oEvent) {
    if (myself.getListenerOnBeforeOpen() !== null) {
      myself.getListenerOnBeforeOpen().onBeforeOpen(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // beforeClose event
  nativeControl.attachBeforeClose(function(oEvent) {
    if (myself.getListenerOnBeforeClose() !== null) {
      myself.getListenerOnBeforeClose().onBeforeClose(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // afterOpen event
  nativeControl.attachAfterOpen(function(oEvent) {
    if (myself.getListenerOnAfterOpen() !== null) {
      myself.getListenerOnAfterOpen().onAfterOpen(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // afterClose event
  nativeControl.attachAfterClose(function(oEvent) {
    if (myself.getListenerOnAfterClose() !== null) {
      myself.getListenerOnAfterClose().onAfterClose(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

sap.firefly.UxPopover.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  var childControl = content.getNativeControl();
  this.getNativeControl().addContent(childControl);
  return this;
};

sap.firefly.UxPopover.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this );
};

sap.firefly.UxPopover.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxPopover.prototype.openAt = function(control) {
  sap.firefly.UxGeneric.prototype.openAt.call(this, control);
  if (control != null) {
    var nativeLocationControl = control.getNativeControl();
    this.getNativeControl().openBy(nativeLocationControl);
  }
  return this;
};

sap.firefly.UxPopover.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

sap.firefly.UxPopover.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

// ======================================

sap.firefly.UxPopover.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  if (title !== null && title !== undefined && title.length > 0) {
    this.getNativeControl().setShowHeader(true);
  } else {
    this.getNativeControl().setShowHeader(false);
  }
  this.getNativeControl().setTitle(title);
  return this;
};

sap.firefly.UxPopover.prototype.getTitle = function() {
  return this.getNativeControl().getTitle();
};

sap.firefly.UxPopover.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxPopover.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

sap.firefly.UxPopover.prototype.setPlacement = function(placementType) {
  sap.firefly.UxGeneric.prototype.setPlacement.call(this, placementType);
  if (placementType === sap.firefly.UiPlacementType.AUTO) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Auto);
  } else if (placementType === sap.firefly.UiPlacementType.RIGHT) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Right);
  } else if (placementType === sap.firefly.UiPlacementType.LEFT) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Left);
  } else if (placementType === sap.firefly.UiPlacementType.TOP) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Top);
  } else if (placementType === sap.firefly.UiPlacementType.BOTTOM) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Bottom);
  } else if (placementType === sap.firefly.UiPlacementType.HORIZONTAL) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Horizontal);
  } else if (placementType === sap.firefly.UiPlacementType.VERTICAL) {
    this.getNativeControl().setPlacement(sap.m.PlacementType.Vertical);
  }
  return this;
};

sap.firefly.UxPopover.prototype.getPlacement = function() {
  return sap.firefly.UxGeneric.prototype.getPlacement.call(this);
};

// Overrides
// ======================================

sap.firefly.UxPopover.prototype.setWidth = function(width) {
  // no need to call the generic implementation, we have dedicated methods available on this control
  sap.firefly.DfUiContext.prototype.setWidth.call(this, width); // skip generic implementation
  var widthCss = this.calculateWidthCss();
  this.getNativeControl().setContentWidth(widthCss);
  return this;
};

sap.firefly.UxPopover.prototype.setHeight = function(height) {
  // no need to call the generic implementation, we have dedicated methods available on this control
  sap.firefly.DfUiContext.prototype.setHeight.call(this, height); // skip generic implementation
  var heightCss = this.calculateHeightCss();
  this.getNativeControl().setContentHeight(heightCss);
  return this;
};

// Control specific style and attribute handling
// ======================================

sap.firefly.UxPopover.prototype.applyCustomCssStyling = function(element) {
  // scroll content should always have 100% (default is not set), this makes dynamic laouting better
  $(element).find(".sapMPopoverScroll").css("height", "100%");
};

sap.firefly.UxPopover.prototype.applyBackgroundColorCss = function(element, bgColor) {
  $(element).find(".sapMPopoverCont").css("background-color", bgColor);
};

sap.firefly.UxPopover.prototype.applyPaddingCss = function(element, paddingCss) {
  $(element).find(".sapMPopoverCont").css("padding", paddingCss);
};

sap.firefly.UxPopover.prototype.applyMarginCss = function(element, marginCss) {
  $(element).find(".sapMPopoverCont").css("margin", marginCss);
};

// Helpers
// ======================================

sap.firefly.UxMatrixLayout = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxMatrixLayout";
};
sap.firefly.UxMatrixLayout.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxMatrixLayout.prototype.newInstance = function() {
  var object = new sap.firefly.UxMatrixLayout();
  object.setup();
  return object;
};

sap.firefly.UxMatrixLayout.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.commons.layout.MatrixLayout(this.getId());

  sap.firefly.logWarning("WARNING: UxMatrixLayout uses deaprecated sap.ui.commons.layout.MatrixLayout sapui5 control, consider replacing it with another control.");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxMatrixLayout.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMatrixLayout.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxMatrixLayout.prototype.addMatrixLayoutRow = function(matrixLayoutRow) {
  sap.firefly.UxGeneric.prototype.addMatrixLayoutRow.call(this, matrixLayoutRow);
  var nativeItem = matrixLayoutRow.getNativeControl();
  this.getNativeControl().addRow(nativeItem);
  this.updateColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayout.prototype.insertMatrixLayoutRow = function(matrixLayoutRow, index) {
  sap.firefly.UxGeneric.prototype.insertMatrixLayoutRow.call(this, matrixLayoutRow, index);
  var nativeItem = matrixLayoutRow.getNativeControl();
  this.getNativeControl().insertRow(nativeItem, index);
  this.updateColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayout.prototype.removeMatrixLayoutRow = function(matrixLayoutRow) {
  var nativeItem = matrixLayoutRow.getNativeControl();
  this.getNativeControl().removeRow(nativeItem);
  sap.firefly.UxGeneric.prototype.removeMatrixLayoutRow.call(this, matrixLayoutRow);
  this.updateColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayout.prototype.clearMatrixLayoutRows = function() {
  sap.firefly.UxGeneric.prototype.clearMatrixLayoutRows.call(this);
  this.getNativeControl().removeAllRows();
  this.updateColumnWidths();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxMatrixLayout.prototype.updateColumnWidths = function() {
  var curWidths = [];
  for (var i = 0; i < this.getMatrixLayoutRowCount(); i++) {
    var tmpRow = this.getMatrixLayoutRow(i);
    for (var a = 0; a < tmpRow.getMatrixLayoutCellCount(); a++) {
      var tmpCell = tmpRow.getMatrixLayoutCell(a);
      var sizeObj = tmpCell.getSize();
      if (sizeObj) {
        var widthObj = sizeObj.getWidth();
        if (widthObj !== null) {
          curWidths[a] = widthObj.getCssValue();
        }
      }
    }
  }
  this.getNativeControl().setWidths(curWidths);
};

sap.firefly.UxMatrixLayoutRow = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxMatrixLayoutRow";
};
sap.firefly.UxMatrixLayoutRow.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxMatrixLayoutRow.prototype.newInstance = function() {
  var object = new sap.firefly.UxMatrixLayoutRow();
  object.setup();
  return object;
};

sap.firefly.UxMatrixLayoutRow.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.commons.layout.MatrixLayoutRow(this.getId());

  sap.firefly.logWarning("WARNING: UxMatrixLayoutRow uses deaprecated sap.ui.commons.layout.MatrixLayoutRow sapui5 control, consider replacing it with another control.");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxMatrixLayoutRow.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMatrixLayoutRow.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxMatrixLayoutRow.prototype.addMatrixLayoutCell = function(matrixLayoutCell) {
  sap.firefly.UxGeneric.prototype.addMatrixLayoutCell.call(this, matrixLayoutCell);
  var nativeItem = matrixLayoutCell.getNativeControl();
  this.getNativeControl().addCell(nativeItem);
  this._updateLayoutColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayoutRow.prototype.insertMatrixLayoutCell = function(matrixLayoutCell, index) {
  sap.firefly.UxGeneric.prototype.insertMatrixLayoutCell.call(this, matrixLayoutCell, index);
  var nativeItem = matrixLayoutCell.getNativeControl();
  this.getNativeControl().insertCell(nativeItem, index);
  this._updateLayoutColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayoutRow.prototype.removeMatrixLayoutCell = function(matrixLayoutCell) {
  var nativeItem = matrixLayoutCell.getNativeControl();
  this.getNativeControl().removeCell(nativeItem);
  sap.firefly.UxGeneric.prototype.removeMatrixLayoutCell.call(this, matrixLayoutCell);
  this._updateLayoutColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayoutRow.prototype.clearMatrixLayoutCells = function() {
  sap.firefly.UxGeneric.prototype.clearMatrixLayoutCells.call(this);
  this.getNativeControl().removeAllCells();
  this._updateLayoutColumnWidths();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxMatrixLayoutRow.prototype._updateLayoutColumnWidths = function() {
  if (this.getParent()) {
    this.getParent().updateColumnWidths();
  }
};

sap.firefly.UxMatrixLayoutCell = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxMatrixLayoutCell";
};
sap.firefly.UxMatrixLayoutCell.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxMatrixLayoutCell.prototype.newInstance = function() {
  var object = new sap.firefly.UxMatrixLayoutCell();
  object.setup();
  return object;
};

sap.firefly.UxMatrixLayoutCell.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.ui.commons.layout.MatrixLayoutCell(this.getId());

  sap.firefly.logWarning("WARNING: UxMatrixLayoutCell uses deaprecated sap.ui.commons.layout.MatrixLayoutCell sapui5 control, consider replacing it with another control.");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxMatrixLayoutCell.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMatrixLayoutCell.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxMatrixLayoutCell.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var childNativeControl = content.getNativeControl();
    this.getNativeControl().addContent(childNativeControl);
  }
  return this;
};

sap.firefly.UxMatrixLayoutCell.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxMatrixLayoutCell.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
};

// ======================================

sap.firefly.UxMatrixLayoutCell.prototype.setColumnSpan = function(span) {
  sap.firefly.UxGeneric.prototype.setColumnSpan.call(this, span);
  this.getNativeControl().setColSpan(span);
  return this;
};

sap.firefly.UxMatrixLayoutCell.prototype.getColumnSpan = function() {
  return sap.firefly.UxGeneric.prototype.getColumnSpan.call(this);
};

sap.firefly.UxMatrixLayoutCell.prototype.setRowSpan = function(span) {
  sap.firefly.UxGeneric.prototype.setRowSpan.call(this, span);
  this.getNativeControl().setRowSpan(span);
  return this;
};

sap.firefly.UxMatrixLayoutCell.prototype.getRowSpan = function() {
  return sap.firefly.UxGeneric.prototype.getRowSpan.call(this);
};

sap.firefly.UxMatrixLayoutCell.prototype.setWidth = function(width) {
  sap.firefly.DfUiContext.prototype.setWidth.call(this, width); // skip superclass implementation
  this._updateLayoutColumnWidths();
  return this;
};

sap.firefly.UxMatrixLayoutCell.prototype.setHeight = function(height) {
  sap.firefly.DfUiContext.prototype.setHeight.call(this, height); // skip superclass implementation
  this._updateLayoutColumnWidths();
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxMatrixLayoutCell.prototype._updateLayoutColumnWidths = function() {
  if (this.getParent() && this.getParent().getParent()) {
    this.getParent().getParent().updateColumnWidths();
  }
};

sap.firefly.UxScrollContainer = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxScrollContainer";
};
sap.firefly.UxScrollContainer.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxScrollContainer.prototype.newInstance = function() {
  var object = new sap.firefly.UxScrollContainer();
  object.setup();
  return object;
};

sap.firefly.UxScrollContainer.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.ScrollContainer(this.getId());
  nativeControl.setHorizontal(false);
  nativeControl.setVertical(true);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxScrollContainer.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxScrollContainer.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxScrollContainer.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content !== null) {
    var nativeControl = content.getNativeControl();
    this.getNativeControl().addContent(nativeControl);
  }
  return this;
};

sap.firefly.UxScrollContainer.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxScrollContainer.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxScrollContainer.prototype.scrollTo = function(x, y, duration) {
  sap.firefly.UxGeneric.prototype.scrollTo.call(this, x, y, duration);
  if (this.getNativeControl() != null) {
    this.getNativeControl().scrollTo(x, y, duration);
  }
  return this;
};

sap.firefly.UxScrollContainer.prototype.scrollToControl = function(control, duration) {
  sap.firefly.UxGeneric.prototype.scrollToControl.call(this, control, duration);
  if (this.getNativeControl() != null && control != null) {
    var nativeControl = control.getNativeControl();
    this.getNativeControl().scrollToElement(nativeControl, duration);
  }
  return this;
};

// ======================================

sap.firefly.UxScrollContainer.prototype.setBusy = function(busy) {
  sap.firefly.UxGeneric.prototype.setBusy.call(this, busy);
  return this;
};

sap.firefly.UxScrollContainer.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxScrollContainer.prototype.applyCustomCssStyling = function(element) {
  // scroll content should always have 100% (default is auto), this makes dynamic layouting better
  $(element).find(".sapMScrollContScroll").css("height", "100%");
};


// Helpers
// ======================================

sap.firefly.UxTileContainer = function() {
   sap.firefly.UxFlexLayout.call(this);
  this._ff_c = "UxTileContainer";
};
sap.firefly.UxTileContainer.prototype = new sap.firefly.UxFlexLayout();

sap.firefly.UxTileContainer.prototype.newInstance = function() {
  var object = new sap.firefly.UxTileContainer();
  object.setup();
  return object;
};

sap.firefly.UxTileContainer.prototype.initializeNative = function() {
  sap.firefly.UxFlexLayout.prototype.initializeNative.call(this);
  var myself = this;
  this.getNativeControl().setAlignContent(sap.m.FlexAlignContent.Start);
  this.getNativeControl().setWrap(sap.m.FlexWrap.Wrap);
};

sap.firefly.UxTileContainer.prototype.releaseObject = function() {
  sap.firefly.UxFlexLayout.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTileContainer.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onClick event
  nativeControl.onclick = function(oControlEvent) {
    myself.clickEventHandler(oControlEvent);
  };

  //onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    // onContextMenu click event, a check is required if we clicked an item or the container
    myself.fireOnContextMenuClickEvent(oControlEvent);

    // mark clicked tile item selected
    myself.clickEventHandler(oControlEvent);
  };
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTileContainer.prototype.markTileItemSelected = function(clickedTileItem) {
  for (var i = 0; i < this.getItemCount(); i++) {
    var tmpTileItem = this.getItem(i);
    if (tmpTileItem == clickedTileItem) {
      tmpTileItem.markSelected(true);
    } else {
      tmpTileItem.markSelected(false);
    }
  }
};

sap.firefly.UxTileContainer.prototype.clickEventHandler = function(oControlEvent) {
  if (oControlEvent && oControlEvent.srcControl && oControlEvent.srcControl != this.getNativeControl()) {
    var control = oControlEvent.srcControl;
    var parent = control.getParent();
    var ffTileItemControl = sap.firefly.UxGeneric.getUxControl(parent);

    // if i click on the tile item flex layout then my parent is the tile container, in that case the control is what i want, not the parent
    if (ffTileItemControl && ffTileItemControl.getUiType() === sap.firefly.UiType.TILE_CONTAINER) {
      ffTileItemControl = sap.firefly.UxGeneric.getUxControl(control);
    }

    if (ffTileItemControl && ffTileItemControl.getUiType() === sap.firefly.UiType.TILE_ITEM) {
      this.markTileItemSelected(ffTileItemControl);
    }
  } else {
    this.markTileItemSelected(null);
  }
};

sap.firefly.UxTileContainer.prototype.fireOnContextMenuClickEvent = function(oControlEvent) {
  var control = oControlEvent.srcControl;
  var ffControl = sap.firefly.UxGeneric.getUxControl(control);

  // only fire the event when i click on the tile container, and not on tile items
  if (ffControl && ffControl.getUiType() === sap.firefly.UiType.TILE_CONTAINER) {
    if (this.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      this.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(this, newParameters));
    }
  }
};

sap.firefly.UxTileItem = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTileItem";
};
sap.firefly.UxTileItem.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTileItem.prototype.newInstance = function() {
  var object = new sap.firefly.UxTileItem();
  object.setup();
  return object;
};

sap.firefly.UxTileItem.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.firefly.XtUi5FileIcon(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTileItem.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTileItem.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnClick() !== null) {
      myself.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  //onDoubleClick event
  nativeControl.ondblclick = function(oControlEvent) {
    if (myself.getListenerOnDoubleClick() !== null) {
      myself.getListenerOnDoubleClick().onDoubleClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  //onPress event
  nativeControl.ontap = function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  };

  //onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    if (myself.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      myself.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  };
};

// ======================================

sap.firefly.UxTileItem.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxTileItem.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxTileItem.prototype.setDescription = function(description) {
  sap.firefly.DfUiContext.prototype.setDescription.call(this, description); // skip superclass implementation
  this.getNativeControl().setFileType(description);
  return this;
};

sap.firefly.UxTileItem.prototype.getDescription = function() {
  return sap.firefly.UxGeneric.prototype.getDescription.call(this);
};

sap.firefly.UxTileItem.prototype.setSrc = function(src) {
  sap.firefly.DfUiContext.prototype.setSrc.call(this, src); // skip superclass implementation
  this.getNativeControl().setIconSrc(src);
  return this;
};

sap.firefly.UxTileItem.prototype.getSrc = function() {
  return sap.firefly.UxGeneric.prototype.getSrc.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTileItem.prototype.markSelected = function(mark) {
  if (mark === true) {
    this.getNativeControl().setBackgroundColor("#dfe4e6");
  } else {
    this.getNativeControl().setBackgroundColor(null);
  }
};

sap.firefly.UxVizGrid = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxVizGrid";
};
sap.firefly.UxVizGrid.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxVizGrid.prototype.newInstance = function() {
  var object = new sap.firefly.UxVizGrid();
  object.setup();
  return object;
};

sap.firefly.UxVizGrid.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.firefly.XtUi5CustomVizGrid(this.getId(), {});

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxVizGrid.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxVizGrid.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxVizGrid.prototype.setModelJson = function(modelJson) {
  sap.firefly.UxGeneric.prototype.setModelJson.call(this, modelJson);
  this.getNativeControl().setModelJson(modelJson);
  return this;
};

sap.firefly.UxVizGrid.prototype.getModelJson = function() {
  return sap.firefly.UxGeneric.prototype.getModelJson.call(this);
};

sap.firefly.UxVizGrid.prototype.setDataManifest = function(dataManifest) {
  sap.firefly.UxGeneric.prototype.setDataManifest.call(this, dataManifest);
  return this;
};

sap.firefly.UxVizGrid.prototype.getDataManifest = function() {
  return sap.firefly.UxGeneric.prototype.getDataManifest.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxFireflyGrid = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxFireflyGrid";
};
sap.firefly.UxFireflyGrid.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxFireflyGrid.prototype.newInstance = function() {
  var object = new sap.firefly.UxFireflyGrid();
  object.setup();
  return object;
};

sap.firefly.UxFireflyGrid.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  if (sap.zen && sap.zen.commons && sap.zen.commons.Grid) {
    nativeControl = new sap.m.VBox({
      width: "100%",
      height: "100%",
      items: [
        new sap.zen.commons.Grid(myself.getId())
      ]
    });

    var oGrid = nativeControl.getItems()[0];
    oGrid.setModel(new sap.ui.model.json.JSONModel(), "om");
    oGrid.getModel("om").setSizeLimit(2000000000);
    oGrid.bindCells({
      path: "om>/cells",
      model: "om",
      template: new sap.zen.commons.Cell({
        cellType: "{om>Semantic}",
        column: "{om>Column}",
        row: "{om>Row}",
        displayValue: "{om>Value}",
        displayLevel: "{om>DisplayLevel}",
        icon: "{om>Icon}",
        customData: [
          new sap.ui.core.CustomData({
            key: "Dimension",
            value: "{om>Dimension}"
          }),
          new sap.ui.core.CustomData({
            key: "Member",
            value: "{om>Member}"
          }),
          new sap.ui.core.CustomData({
            key: "DrillState",
            value: "{om>DrillState}"
          }),
          new sap.ui.core.CustomData({
            key: "TupleIndex",
            value: "{om>TupleIndex}"
          })
        ]
      })
    });
    this._addEvents(oGrid);
  } else {
    nativeControl = new sap.m.Label(this.getId());
    nativeControl.setText("Error loading the firefly grid control!");
  }

  this.setNativeControl(nativeControl);
};

sap.firefly.UxFireflyGrid.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxFireflyGrid.prototype._addEvents = function(nativeControl) {
  var myself = this;

  nativeControl.attachRightClick(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString("Action", "CellClick");
      newParameters.putString("Dimension", oControlEvent.getParameter("cell").data().Dimension);
      newParameters.putString("Member", oControlEvent.getParameter("cell").data().Member);
      newParameters.putString("top", jQuery(oControlEvent.getParameter("link").getDomRef()).offset().top);
      newParameters.putString("left", jQuery(oControlEvent.getParameter("link").getDomRef()).offset().left);
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });
  nativeControl.attachDrill(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString("Action", "Drill");
      newParameters.putString("Dimension", oControlEvent.getParameter("cell").data().Dimension);
      newParameters.putString("Member", oControlEvent.getParameter("cell").data().Member);
      newParameters.putString("TupleIndex", oControlEvent.getParameter("cell").data().TupleIndex);
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });
};


// ======================================

sap.firefly.UxFireflyGrid.prototype.setModelJson = function(modelJson) {
  sap.firefly.UxGeneric.prototype.setModelJson.call(this, modelJson);
  if (sap.zen && sap.zen.commons && sap.zen.commons.Grid) {
    var oGrid = this.getNativeControl().getItems()[0];
    oGrid.setVirtualRows(
      modelJson.getIntegerByKey("RowCount") - modelJson.getIntegerByKey("FixedRows")
    );
    var nColCount = modelJson.getIntegerByKey("ColCount");
    oGrid.setVirtualColumns(
      nColCount - modelJson.getIntegerByKey("FixedColumns")
    );

    oGrid.setFixedRows(modelJson.getIntegerByKey("FixedRows"));
    oGrid.setFixedColumns(modelJson.getIntegerByKey("FixedColumns"));
    oGrid.setOffsetRow(0);
    oGrid.setOffsetColumn(0);

    var aList = modelJson.getListByKey("Cells");
    var aCells = [];
    var o;
    for (var nIndex = 0; nIndex < aList.size(); ++nIndex) {
      o = aList.getStructureAt(nIndex);
      aCells.push({
        Value: o.getStringByKey("DisplayValue"),
        Semantic: o.getStringByKey("Semantic") || sap.firefly.UxUi5.CellType.STANDARD,
        Column: o.getIntegerByKey("Column"),
        Row: o.getIntegerByKey("Row"),
        TupleIndex: o.getIntegerByKey("ColumnTupleIndex") || o.getIntegerByKey("RowTupleIndex"),
        Dimension: o.getStringByKey("Dimension"),
        Member: o.getStringByKey("Member"),
        DisplayLevel: o.getIntegerByKey("DisplayLevel"),
        DrillState: o.getStringByKey("DrillState"),
        Icon: o.getStringByKey("Icon")
      });
    }
    delete oGrid._ColumnWidth;
    oGrid.getModel("om").setData({
      cells: aCells
    });
  }

  return this;
};

sap.firefly.UxFireflyGrid.prototype.getModelJson = function() {
  return sap.firefly.UxGeneric.prototype.getModelJson.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxVizFrame = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxVizFrame";
};
sap.firefly.UxVizFrame.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxVizFrame.prototype.newInstance = function() {
  var object = new sap.firefly.UxVizFrame();
  object.setup();
  return object;
};

sap.firefly.UxVizFrame.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.viz");
  var myself = this;
  var nativeControl = new sap.viz.ui5.controls.VizFrame(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxVizFrame.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxVizFrame.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxVizFrame.prototype.setModelJson = function(modelJson) {
  sap.firefly.UxGeneric.prototype.setModelJson.call(this, modelJson);
  return this;
};

sap.firefly.UxVizFrame.prototype.getModelJson = function() {
  return sap.firefly.UxGeneric.prototype.getModelJson.call(this);
};

sap.firefly.UxVizFrame.prototype.setDataManifest = function(dataManifest) {
  sap.firefly.UxGeneric.prototype.setDataManifest.call(this, dataManifest);
  return this;
};

sap.firefly.UxVizFrame.prototype.getDataManifest = function() {
  return sap.firefly.UxGeneric.prototype.getDataManifest.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxMicroChart = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxMicroChart";
};
sap.firefly.UxMicroChart.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxMicroChart.prototype.newInstance = function() {
  var object = new sap.firefly.UxMicroChart();
  object.setup();
  return object;
};

sap.firefly.UxMicroChart.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  sap.firefly.loadUi5LibIfNeeded("sap.suite.ui.microchart");
  var myself = this;

  var nativeControl = new sap.firefly.XtUi5ContentWrapper(this.getId() + "_wrapper", {
    width: "auto",
    height: "auto"
  });

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxMicroChart.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxMicroChart.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxMicroChart.prototype.setModelJson = function(modelJson) {
  sap.firefly.UxGeneric.prototype.setModelJson.call(this, modelJson);
  if (modelJson) {
    this.renderChart(modelJson.convertToNative());
  } else {
    console.log("Cannot load data!");
  }
  return this;
};

sap.firefly.UxMicroChart.prototype.getModelJson = function() {
  return sap.firefly.UxGeneric.prototype.getModelJson.call(this);
};

sap.firefly.UxMicroChart.prototype.setDataManifest = function(dataManifest) {
  sap.firefly.UxGeneric.prototype.setDataManifest.call(this, dataManifest);
  return this;
};

sap.firefly.UxMicroChart.prototype.getDataManifest = function() {
  return sap.firefly.UxGeneric.prototype.getDataManifest.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxMicroChart.prototype.renderChart = function(modelJson) {
  if (modelJson && modelJson.chart) {
    if (modelJson.chart === "Column") {
      this.renderColumnChart(modelJson);
    } else {
      this.showChartNotSupported();
    }
  } else {
    this.showChartNotSupported();
  }
};

sap.firefly.UxMicroChart.prototype.showChartNotSupported = function() {
  var notSupportedLbl = new sap.m.Label(this.getId() + "_notSupported");
  notSupportedLbl.setText("Chart not supported!");
  this.getNativeControl().addContent(notSupportedLbl);
  this.getNativeControl().setBackgroundColor("rgba(0,0,0,0.1)")
};

sap.firefly.UxMicroChart.prototype.renderColumnChart = function(modelJson) {
  var chartControl = new sap.suite.ui.microchart.ColumnMicroChart(this.getId());
  chartControl.setIsResponsive(true);

  if (modelJson.columns) {
    var columnsArr = modelJson.columns;
    var colSize = columnsArr.length;
    for (var a = 0; a < colSize; a++) {
      var tmpCol = columnsArr[a];

      var tmpNativeCol = new sap.suite.ui.microchart.ColumnMicroChartData();
      tmpNativeCol.setValue(tmpCol.value);
      tmpNativeCol.setDisplayValue(tmpCol.displayValue);
      tmpNativeCol.setLabel(tmpCol.label);
      tmpNativeCol.setColor(tmpCol.color);
      chartControl.addColumn(tmpNativeCol);
    }
  }

  if (modelJson.allowColumnLabels !== undefined) {
    chartControl.setAllowColumnLabels(modelJson.allowColumnLabels);
  }

  if (modelJson.leftTopLabel) {
    var leftTopLabel = new sap.suite.ui.microchart.ColumnMicroChartLabel();
    leftTopLabel.setLabel(modelJson.leftTopLabel.label);
    leftTopLabel.setColor(modelJson.leftTopLabel.color);
    chartControl.setLeftTopLabel(leftTopLabel);
  }

  if (modelJson.rightTopLabel) {
    var rightTopLabel = new sap.suite.ui.microchart.ColumnMicroChartLabel();
    rightTopLabel.setLabel(modelJson.rightTopLabel.label);
    rightTopLabel.setColor(modelJson.rightTopLabel.color);
    chartControl.setRightTopLabel(rightTopLabel);
  }

  if (modelJson.leftBottomLabel) {
    var leftBottomLabel = new sap.suite.ui.microchart.ColumnMicroChartLabel();
    leftBottomLabel.setLabel(modelJson.leftBottomLabel.label);
    leftBottomLabel.setColor(modelJson.leftBottomLabel.color);
    chartControl.setLeftBottomLabel(leftBottomLabel);
  }

  if (modelJson.rightBottomLabel) {
    var rightBottomLabel = new sap.suite.ui.microchart.ColumnMicroChartLabel();
    rightBottomLabel.setLabel(modelJson.rightBottomLabel.label);
    rightBottomLabel.setColor(modelJson.rightBottomLabel.color);
    chartControl.setRightBottomLabel(rightBottomLabel);
  }

  this.getNativeControl().addContent(chartControl);
};

sap.firefly.UxSpacer = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxSpacer";
};
sap.firefly.UxSpacer.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxSpacer.prototype.newInstance = function() {
  var object = new sap.firefly.UxSpacer();
  object.setup();
  return object;
};

sap.firefly.UxSpacer.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.m.Label(this.getId());
  nativeControl.setWidth("5px");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxSpacer.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxSpacer.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

sap.firefly.UxSpacer.prototype.applyCustomCssStyling = function(element) {
  // disable text selection since this is a label
  element.style.userSelect = "none";
  element.style.cursor = "default";
};

// Helpers
// ======================================

sap.firefly.UxWindow = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxWindow";

  this.m_window = null;
};
sap.firefly.UxWindow.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxWindow.prototype.newInstance = function() {
  var object = new sap.firefly.UxWindow();
  object.setup();
  return object;
};

sap.firefly.UxWindow.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  //initialize the window manager - pure native class required for window management
  // needs to be done only once, singelton will be created
  sap.firefly.XtWindowManager.staticSetup();

  // create the window
  if (this.m_window == null) {
    // create and get the window
    this.m_window = sap.firefly.XtWindowManager.manager().createNewWindow(this.getId());

    // since a window has currently no sapui5 custom control (native control) we need to do it here
    // the XtBaseWindow has the addStyleClass method implemented for it to work
    // required for some ui5 controls which expect that the parent has the size class applied like sap.m.Page and header sizing
    // also in UxTerminal
    this.applyContentDensity(this.m_window);

    this._addEvents(this.m_window);
  }

  this.setNativeControl(nativeControl);
};

sap.firefly.UxWindow.prototype.releaseObject = function() {
  if (this.m_window) {
    this.m_window.destroy();
    this.m_window = null;
  }
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxWindow.prototype._addEvents = function(nativeControl) {
  var myself = this;

  if (!this.m_window) {
    return;
  }

  //onOpen
  this.m_window.attachOnOpen(function(event) {
    if (myself.getListenerOnOpen() !== null) {
      myself.getListenerOnOpen().onOpen(sap.firefly.UiControlEvent.create(myself));
    }
  });

  // onClose
  this.m_window.attachOnClose(function(event) {
    if (myself.getListenerOnClose() !== null) {
      myself.getListenerOnClose().onClose(sap.firefly.UiControlEvent.create(myself));
    }
  });

  //onMove event
  this.m_window.attachOnMove(function(event) {
    if (myself.getListenerOnMove() !== null) {
      var newMoveEvent = sap.firefly.UiMoveEvent.createMove(myself, null, event.newPosX, event.newPosY);
      myself.getListenerOnMove().onMove(newMoveEvent);
    }
  });

  //onMoveStart event
  this.m_window.attachOnMoveStart(function(event) {
    if (myself.getListenerOnMoveStart() !== null) {
      var newMoveEvent = sap.firefly.UiMoveEvent.createMove(myself, null, event.newPosX, event.newPosY);
      myself.getListenerOnMoveStart().onMoveStart(newMoveEvent);
    }
  });

  //onMoveEnd event
  this.m_window.attachOnMoveEnd(function(event) {
    if (myself.getListenerOnMoveEnd() !== null) {
      var newMoveEvent = sap.firefly.UiMoveEvent.createMove(myself, null, event.newPosX, event.newPosY);
      myself.getListenerOnMoveEnd().onMoveEnd(newMoveEvent);
    }
  });

  //onResize event
  this.m_window.attachOnResize(function(event) {
    if (myself.getListenerOnResize() !== null) {
      var newResizeEvent = sap.firefly.UiResizeEvent.createResize(myself, null, event.newWidth, event.newHeight);
      myself.getListenerOnResize().onResize(newResizeEvent);
    }
  });

  //onClosePress event
  this.m_window.attachOnClosePress(function(event) {
    if (myself.getListenerOnButtonPress() !== null) {
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE, sap.firefly.UiPressedButtonType.CLOSE.getName());
      myself.getListenerOnButtonPress().onButtonPress(sap.firefly.UiControlEvent.create(myself, newParameters));
    } else {
      myself.close();
    }
  });

  //onMaximizePress event
  this.m_window.attachOnMaximizePress(function(event) {
    if (myself.getListenerOnButtonPress() !== null) {
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE, sap.firefly.UiPressedButtonType.MAXIMIZE.getName());
      myself.getListenerOnButtonPress().onButtonPress(sap.firefly.UiControlEvent.create(myself, newParameters));
    } else {
      if (myself.isMaximized(true)) {
        myself.restore();
      } else {
        myself.maximize(true);
      }
    }
  });

  //onHidePress event
  this.m_window.attachOnHidePress(function(event) {
    if (myself.getListenerOnButtonPress() !== null) {
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_PRESSED_BUTTON_TYPE, sap.firefly.UiPressedButtonType.HIDE.getName());
      myself.getListenerOnButtonPress().onButtonPress(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });
};

// ======================================

sap.firefly.UxWindow.prototype.open = function() {
  sap.firefly.UxGeneric.prototype.open.call(this);
  if (this.m_window) {
    this.m_window.open();
  }
  return this;
};

sap.firefly.UxWindow.prototype.close = function() {
  sap.firefly.UxGeneric.prototype.close.call(this);
  if (this.m_window) {
    this.m_window.close();
  }
  return this;
};

sap.firefly.UxWindow.prototype.isOpen = function() {
  return sap.firefly.UxGeneric.prototype.isOpen.call(this);
};

sap.firefly.UxWindow.prototype.maximize = function(animated) {
  sap.firefly.UxGeneric.prototype.maximize.call(this, animated);
  if (this.m_window) {
    this.m_window.maximize(animated);
  }
  return this;
};

sap.firefly.UxWindow.prototype.restore = function(animated) {
  sap.firefly.UxGeneric.prototype.restore.call(this, animated);
  if (this.m_window) {
    this.m_window.restore(animated);
  }
  return this;
};

sap.firefly.UxWindow.prototype.isMaximized = function() {
  if (this.m_window) {
    return this.m_window.isMaximized();
  }
  return sap.firefly.UxGeneric.prototype.isMaximized.call(this);
};

sap.firefly.UxWindow.prototype.hide = function(animated, refControl) {
  sap.firefly.UxGeneric.prototype.hide.call(this, animated, refControl);
  if (this.m_window) {
    var nativeRefControl = null;
    if (refControl) {
      nativeRefControl = refControl.getNativeControl();
    }
    this.m_window.hide(animated, nativeRefControl);
  }
  return this;
};

sap.firefly.UxWindow.prototype.show = function(animated, refControl) {
  sap.firefly.UxGeneric.prototype.show.call(this, animated, refControl);
  if (this.m_window) {
    this.m_window.show(animated);
  }
  return this;
};

sap.firefly.UxWindow.prototype.isHidden = function() {
  if (this.m_window) {
    return this.m_window.isHidden();
  }
  return sap.firefly.UxGeneric.prototype.isHidden.call(this);
};

sap.firefly.UxWindow.prototype.bringToFront = function() {
  sap.firefly.UxGeneric.prototype.bringToFront.call(this);
  if (this.m_window) {
    this.m_window.bringToFront();
  }
  return this;
};

// ======================================

sap.firefly.UxWindow.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  if (this.m_window) {
    var childControl = content.getNativeControl();
    if (childControl) {
      this.m_window.setContent(childControl);
    } else {
      this.m_window.setContent(null);
    }
  }
  return this;
};

sap.firefly.UxWindow.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxWindow.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  if (this.m_window) {
    this.m_window.clearContent();
  }
  return this;
};

// ======================================

sap.firefly.UxWindow.prototype.setTitle = function(title) {
  sap.firefly.UxGeneric.prototype.setTitle.call(this, title);
  if (this.m_window) {
    this.m_window.setTitle(title);
  }
  return this;
};

sap.firefly.UxWindow.prototype.getTitle = function() {
  return sap.firefly.UxGeneric.prototype.getTitle.call(this);
};

sap.firefly.UxWindow.prototype.setBackgroundColor = function(color) {
  sap.firefly.UxGeneric.prototype.setBackgroundColor.call(this, color);
  // superclass can be called here since there is anyway no ntive control here so nothing happens
  // TODO: Make UxWindow a custom ui5 control so i can set it as native control?
  // Same for UxTerminal
  if (this.m_window) {
    if (color) {
      this.m_window.setBackgroundColor(color.getRgbaColor());
    } else {
      this.m_window.setBackgroundColor(null);
    }
  }
  return this;
};

sap.firefly.UxWindow.prototype.getBackgroundColor = function() {
  return sap.firefly.UxGeneric.prototype.getBackgroundColor.call(this);
};

// Overrides
// ======================================

sap.firefly.UxWindow.prototype.registerOnFileDrop = function(listener) {
  sap.firefly.UxGeneric.prototype.registerOnFileDrop.call(this, listener);
  // add the file drop event listener only when user registers, since only then the drop-zone stylign should appear
  var myself = this;
  this.m_window.attachOnFileDrop(function(event) {
    myself.fireOnFileDropEventIfPossible(event.fileName, event.fileType, event.fileContent, event.fileSize, event.fileLastModified);
  });
  return this;
};

sap.firefly.UxWindow.prototype.setWidth = function(width) {
  // no need to call the generic implementation, we have dedicated methods available on this control
  sap.firefly.DfUiContext.prototype.setWidth.call(this, width); // skip superclass implementation
  if (this.m_window) {
    var widthCss = this.calculateWidthCss();
    this.m_window.setWidth(widthCss);
  }
  return this;
};

sap.firefly.UxWindow.prototype.setHeight = function(height) {
  // no need to call the generic implementation, we have dedicated methods available on this control
  sap.firefly.DfUiContext.prototype.setHeight.call(this, height); // skip superclass implementation
  if (this.m_window) {
    var heightCss = this.calculateHeightCss();
    this.m_window.setHeight(heightCss);
  }
  return this;
};

sap.firefly.UxWindow.prototype.setX = function(x) {
  // no need to call the generic implementation, we have dedicated methods available on this control
  sap.firefly.DfUiContext.prototype.setX.call(this, x); // skip superclass implementation
  if (this.m_window) {
    var xPosCss = this.calculatePosXCss();
    this.m_window.setX(xPosCss);
  }
  return this;
};

sap.firefly.UxWindow.prototype.setY = function(y) {
  // no need to call the generic implementation, we have dedicated methods available on this control
  sap.firefly.DfUiContext.prototype.setY.call(this, y); // skip superclass implementation
  if (this.m_window) {
    var yPosCss = this.calculatePosYCss();
    this.m_window.setY(yPosCss);
  }
  return this;
};

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxWindow.prototype.getWindow = function() {
  // used by tools like EmccLoader to get direct access to the window object
  return this.m_window;
};

sap.firefly.UxTerminal = function() {
   sap.firefly.UxWindow.call(this);
  this._ff_c = "UxTerminal";
};
sap.firefly.UxTerminal.prototype = new sap.firefly.UxWindow();

sap.firefly.UxTerminal.prototype.newInstance = function() {
  var object = new sap.firefly.UxTerminal();
  object.setup();
  return object;
};

sap.firefly.UxTerminal.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this); // skip super clas implementation
  var myself = this;
  var nativeControl = null;

  //initialize the window manager - pure native class required for window management
  // needs to be done only once, singelton will be created
  sap.firefly.XtWindowManager.staticSetup();

  if (this.m_window == null) {
    // create and get the terminal, m_window is a XtTerminal here
    this.m_window = sap.firefly.XtWindowManager.manager().createNewTerminal(this.getId());

    // since a window has currently no sapui5 custom control (native control) we need to do it here
    // the XtBaseWindow has the addStyleClass method implemented for it to work
    // required for some ui5 controls which expect that the parent has the size class applied like sap.m.Page and header sizing
    // also in UxWindow
    this.applyContentDensity(this.m_window);

    this._addEvents(this.m_window);
  }

  this.setNativeControl(nativeControl);
};

sap.firefly.UxTerminal.prototype.releaseObject = function() {
  sap.firefly.UxWindow.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTerminal.prototype._addEvents = function(nativeControl) {
  sap.firefly.UxWindow.prototype._addEvents.call(this, nativeControl);
  var myself = this;

  if (!this.m_window) {
    return;
  }

  //onExecute event
  this.m_window.attachOnExecute(function(event) {
    if (myself.getListenerOnExecute() !== null) {
      // prepare the properties
      var command = event.command;
      var newParameters = sap.firefly.XProperties.create();
      newParameters.putString(sap.firefly.UiControlEvent.PARAM_COMMAND, command);
      myself.getListenerOnExecute().onExecute(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  });

  //onTerminate event
  this.m_window.attachOnTerminate(function(event) {
    if (myself.getListenerOnTerminate() !== null) {
      myself.getListenerOnTerminate().onTerminate(sap.firefly.UiControlEvent.create(myself));
    }
  });
};

// ======================================

// base window stuff
sap.firefly.UxTerminal.prototype.open = function() {
  sap.firefly.UxWindow.prototype.open.call(this);
  return this;
};

sap.firefly.UxTerminal.prototype.close = function() {
  sap.firefly.UxWindow.prototype.close.call(this);
  return this;
};

sap.firefly.UxTerminal.prototype.isOpen = function() {
  return sap.firefly.UxWindow.prototype.isOpen.call(this);
};

sap.firefly.UxTerminal.prototype.maximize = function(animated) {
  sap.firefly.UxWindow.prototype.maximize.call(this, animated);
  return this;
};

sap.firefly.UxTerminal.prototype.restore = function(animated) {
  sap.firefly.UxWindow.prototype.restore.call(this, animated);
  return this;
};

sap.firefly.UxTerminal.prototype.isMaximized = function() {
  return sap.firefly.UxWindow.prototype.isMaximized.call(this);
};

sap.firefly.UxTerminal.prototype.hide = function(animated, refControl) {
  sap.firefly.UxWindow.prototype.hide.call(this, animated, refControl);
  return this;
};

sap.firefly.UxTerminal.prototype.show = function(animated, refControl) {
  sap.firefly.UxWindow.prototype.show.call(this, animated, refControl);
  return this;
};

sap.firefly.UxTerminal.prototype.isHidden = function() {
  return sap.firefly.UxWindow.prototype.isHidden.call(this);
};

sap.firefly.UxTerminal.prototype.bringToFront = function() {
  sap.firefly.UxWindow.prototype.bringToFront.call(this);
  return this;
};

// terminal stuff
sap.firefly.UxTerminal.prototype.print = function(text) {
  sap.firefly.UxWindow.prototype.print.call(this, text);
  if (this.m_window) {
    var escapedText = sap.firefly.XStringUtils.escapeHtml(text);
    this.m_window.print(escapedText);
  }
};

sap.firefly.UxTerminal.prototype.println = function(text) {
  sap.firefly.UxWindow.prototype.println.call(this, text);
  if (this.m_window) {
    var escapedText = sap.firefly.XStringUtils.escapeHtml(text);
    this.m_window.println(escapedText);
  }
};

sap.firefly.UxTerminal.prototype.startReadLine = function(text, numOfChars) {
  sap.firefly.UxWindow.prototype.startReadLine.call(this, text, numOfChars);
  if (this.m_window) {
    var myself = this;
    var callback = function(lineStr) {
      if (myself.getListenerOnReadLineFinished() !== null) {
        var newParameters = sap.firefly.XProperties.create();
        newParameters.putString(sap.firefly.UiControlEvent.PARAM_LINE, lineStr);
        myself.getListenerOnReadLineFinished().onReadLineFinished(sap.firefly.UiControlEvent.create(myself, newParameters));
      }
    };

    this.m_window.readLine(text, numOfChars, callback);
  }
  return this;
};

// ======================================

// base window stuff
sap.firefly.UxTerminal.prototype.setTitle = function(title) {
  sap.firefly.UxWindow.prototype.setTitle.call(this, title);
  return this;
};

sap.firefly.UxTerminal.prototype.getTitle = function() {
  return sap.firefly.UxWindow.prototype.getTitle.call(this);
};

// terminal stuff
sap.firefly.UxTerminal.prototype.setPath = function(path) {
  sap.firefly.UxWindow.prototype.setPath.call(this, path);
  if (this.m_window) {
    this.m_window.setPath(path);
  }
  return this;
};

sap.firefly.UxTerminal.prototype.getPath = function() {
  return sap.firefly.UxWindow.prototype.getPath.call(this);
};

sap.firefly.UxTerminal.prototype.setPrompt = function(prompt) {
  sap.firefly.UxWindow.prototype.setPrompt.call(this, prompt);
  if (this.m_window) {
    this.m_window.setPrompt(prompt);
  }
  return this;
};

sap.firefly.UxTerminal.prototype.getPrompt = function() {
  return sap.firefly.UxWindow.prototype.getPrompt.call(this);
};

sap.firefly.UxTerminal.prototype.setFontColor = function(fontColor) {
  sap.firefly.UxWindow.prototype.setFontColor.call(this, fontColor);
  // superclass can be called here since there is anyway no native control here so nothing happens
  // TODO: Make UxTerminal a custom ui5 control so i can set it as native control?
  if (this.m_window) {
    this.m_window.setTextColor(fontColor.getRgbaColor());
  }
  return this;
};

sap.firefly.UxTerminal.prototype.getFontColor = function() {
  return sap.firefly.UxWindow.prototype.getFontColor.call(this);
};

sap.firefly.UxTerminal.prototype.setCommandHistory = function(commandList) {
  sap.firefly.UxWindow.prototype.setCommandHistory.call(this, commandList);
  if (this.m_window) {
    if (commandList != null) {
      var tmpArray = [];
      var cmdListSize = commandList.size();
      for (var a = 0; a < cmdListSize; a++) {
        var tmpEle = commandList.get(a);
        tmpArray.push(tmpEle);
      }
      this.m_window.setCommandHistoryEntries(tmpArray);
    } else {
      this.m_window.clearCommandHistory();
    }
  }
};

sap.firefly.UxTerminal.prototype.getCommandHistory = function() {
  if (this.m_window) {
    var tmpCmds = this.m_window.getCommandHistory();
    if (tmpCmds != null && tmpCmds != undefined && tmpCmds.length > 0) {
      var oList = sap.firefly.XListOfString.create();
      for (var i = 0; i < tmpCmds.length; i++) {
        oList.add(tmpCmds[i]);
      }
      return oList;
    }
  }

  return sap.firefly.UxWindow.prototype.getCommandHistory.call(this);
};

sap.firefly.UxTerminal.prototype.setBusy = function(busy) {
  sap.firefly.UxWindow.prototype.setBusy.call(this, busy);
  if (this.m_window) {
    this.m_window.setBusy(busy);
  }
  return this;
};

sap.firefly.UxTerminal.prototype.isBusy = function() {
  return sap.firefly.UxWindow.prototype.isBusy.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxLaunchpad = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxLaunchpad";
};
sap.firefly.UxLaunchpad.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxLaunchpad.prototype.newInstance = function() {
  var object = new sap.firefly.UxLaunchpad();
  object.setup();
  return object;
};

sap.firefly.UxLaunchpad.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  //initialize the launchpad helper - pure native class required for helper methods and styling
  // needs to be done only once, singelton will be created
  sap.firefly.XtLaunchpadHelper.staticSetup();

  nativeControl = new sap.firefly.XtUi5Launchpad(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxLaunchpad.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxLaunchpad.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    if (myself.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      myself.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  };
};

// ======================================

sap.firefly.UxLaunchpad.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addIcon(nativeItem);
  return this;
};

sap.firefly.UxLaunchpad.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertIcon(nativeItem, index);
  return this;
};

sap.firefly.UxLaunchpad.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeIcon(nativeItem);
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxLaunchpad.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllIcons();
  return this;
};

// ======================================

sap.firefly.UxLaunchpad.prototype.getHeader = function() {
  return sap.firefly.UxGeneric.prototype.getHeader.call(this);
};

sap.firefly.UxLaunchpad.prototype.setHeader = function(header) {
  sap.firefly.UxGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    var nativeHeaderControl = header.getNativeControl();
    this.getNativeControl().setHeader(nativeHeaderControl);
  }
  return this;
};

sap.firefly.UxLaunchpad.prototype.clearHeader = function() {
  sap.firefly.UxGeneric.prototype.clearHeader.call(this);
  this.getNativeControl().destroyHeader();
  return this;
};

// ======================================

sap.firefly.UxLaunchpad.prototype.getFooter = function() {
  return sap.firefly.UxGeneric.prototype.getFooter.call(this);
};

sap.firefly.UxLaunchpad.prototype.setFooter = function(footer) {
  sap.firefly.UxGeneric.prototype.setFooter.call(this, footer);
  if (footer != null) {
    var nativeFooterControl = footer.getNativeControl();
    this.getNativeControl().setFooter(nativeFooterControl);
  }
  return this;
};

sap.firefly.UxLaunchpad.prototype.clearFooter = function() {
  sap.firefly.UxGeneric.prototype.clearFooter.call(this);
  this.getNativeControl().destroyFooter();
  return this;
};

// ======================================

sap.firefly.UxLaunchpad.prototype.setFooterHeight = function(footerHeight) {
  sap.firefly.UxGeneric.prototype.setFooterHeight.call(this, footerHeight);
  if (footerHeight) {
    this.getNativeControl().setFooterHeight(footerHeight.getCssValue());
  } else {
    this.getNativeControl().setFooterHeight(null);
  }
  return this;
};

sap.firefly.UxLaunchpad.prototype.getFooterHeight = function() {
  return sap.firefly.UxGeneric.prototype.getFooterHeight.call(this);
};

sap.firefly.UxLaunchpad.prototype.setHeaderHeight = function(headerHeight) {
  sap.firefly.UxGeneric.prototype.setHeaderHeight.call(this, headerHeight);
  if (headerHeight) {
    this.getNativeControl().setHeaderHeight(headerHeight.getCssValue());
  } else {
    this.getNativeControl().setHeaderHeight(null);
  }
  return this;
};

sap.firefly.UxLaunchpad.prototype.getHeaderHeight = function() {
  return sap.firefly.UxGeneric.prototype.getHeaderHeight.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxAppIcon = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxAppIcon";
};
sap.firefly.UxAppIcon.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxAppIcon.prototype.newInstance = function() {
  var object = new sap.firefly.UxAppIcon();
  object.setup();
  return object;
};

sap.firefly.UxAppIcon.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.firefly.XtUi5AppIcon(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxAppIcon.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxAppIcon.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onMove event
  nativeControl.attachOnMove(function(oControlEvent) {
    if (myself.getListenerOnMove() !== null) {
      var posX = oControlEvent.getParameters().newPosX;
      var posY = oControlEvent.getParameters().newPosY;
      var newMoveEvent = sap.firefly.UiMoveEvent.createMove(myself, null, posX, posY);
      myself.getListenerOnMove().onMove(newMoveEvent);
    }
  });

  //onMoveStart event
  nativeControl.attachOnMoveStart(function(oControlEvent) {
    if (myself.getListenerOnMoveStart() !== null) {
      var posX = oControlEvent.getParameters().newPosX;
      var posY = oControlEvent.getParameters().newPosY;
      var newMoveEvent = sap.firefly.UiMoveEvent.createMove(myself, null, posX, posY);
      myself.getListenerOnMoveStart().onMoveStart(newMoveEvent);
    }
  });

  //onMoveEnd event
  nativeControl.attachOnMoveEnd(function(oControlEvent) {
    if (myself.getListenerOnMoveEnd() !== null) {
      var posX = oControlEvent.getParameters().newPosX;
      var posY = oControlEvent.getParameters().newPosY;
      var newMoveEvent = sap.firefly.UiMoveEvent.createMove(myself, null, posX, posY);
      myself.getListenerOnMoveEnd().onMoveEnd(newMoveEvent);
    }
  });

  //onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnClick() !== null) {
      myself.getListenerOnClick().onClick(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // double on desktop is ondoubleclick and on mobile it is onTap
  if (typeof window.ontouchstart === "undefined") {
    //onDoubleClick event
    nativeControl.ondblclick = function(oControlEvent) {
      if (myself.getListenerOnDoubleClick() !== null) {
        myself.getListenerOnDoubleClick().onDoubleClick(sap.firefly.UiControlEvent.create(myself));
      }
    };
  } else {
    //onTap event for mobile devices emulates onDoubleClick
    nativeControl.ontap = function(oControlEvent) {
      // this event is also fired on desktop for a single click so i need to check ontouchstart is not undefined, then i know that it is running on mobile
      if (typeof window.ontouchstart !== "undefined") {
        if (myself.getListenerOnDoubleClick() !== null) {
          myself.getListenerOnDoubleClick().onDoubleClick(sap.firefly.UiControlEvent.create(myself));
        }
      }
    };
  }

  // onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    if (myself.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      myself.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  };
};

// ======================================

sap.firefly.UxAppIcon.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxAppIcon.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxAppIcon.prototype.setSrc = function(src) {
  sap.firefly.DfUiContext.prototype.setSrc.call(this, src); // skip superclass implementation
  this.getNativeControl().setIconSrc(src);
  return this;
};

sap.firefly.UxAppIcon.prototype.getSrc = function() {
  return sap.firefly.DfUiContext.prototype.getSrc.call(this);
};

// Overrides
// ======================================

sap.firefly.UxAppIcon.prototype.registerOnMove = function(listener) {
  this.getNativeControl().setDragInteractionEnabled(true); // only enable the drag icon movement when someone registers for the listener
  return sap.firefly.UxGeneric.prototype.registerOnMove.call(this, listener);
};

sap.firefly.UxAppIcon.prototype.registerOnMoveStart = function(listener) {
  this.getNativeControl().setDragInteractionEnabled(true); // only enable the drag icon movement when someone registers for the listener
  return sap.firefly.UxGeneric.prototype.registerOnMoveStart.call(this, listener);
};

sap.firefly.UxAppIcon.prototype.registerOnMoveEnd = function(listener) {
  this.getNativeControl().setDragInteractionEnabled(true); // only enable the drag icon movement when someone registers for the listener
  return sap.firefly.UxGeneric.prototype.registerOnMoveEnd.call(this, listener);
};

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTaskBar = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTaskBar";
};
sap.firefly.UxTaskBar.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTaskBar.prototype.newInstance = function() {
  var object = new sap.firefly.UxTaskBar();
  object.setup();
  return object;
};

sap.firefly.UxTaskBar.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.firefly.XtUi5TaskBar(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTaskBar.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTaskBar.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    if (myself.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      myself.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  };
};

// ======================================

sap.firefly.UxTaskBar.prototype.addItem = function(item) {
  sap.firefly.UxGeneric.prototype.addItem.call(this, item);
  if (item) {
    var nativeItem = item.getNativeControl();
    this.getNativeControl().addButton(nativeItem);
  }
  return this;
};

sap.firefly.UxTaskBar.prototype.insertItem = function(item, index) {
  sap.firefly.UxGeneric.prototype.insertItem.call(this, item, index);
  if (item) {
    var nativeItem = item.getNativeControl();
    this.getNativeControl().insertButton(nativeItem, index);
  }
  return this;
};

sap.firefly.UxTaskBar.prototype.removeItem = function(item) {
  if (item) {
    var nativeItem = item.getNativeControl();
    this.getNativeControl().removeButton(nativeItem);
  }
  sap.firefly.UxGeneric.prototype.removeItem.call(this, item);
  return this;
};

sap.firefly.UxTaskBar.prototype.clearItems = function() {
  sap.firefly.UxGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllButtons();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxTaskBarButton = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxTaskBarButton";
};
sap.firefly.UxTaskBarButton.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxTaskBarButton.prototype.newInstance = function() {
  var object = new sap.firefly.UxTaskBarButton();
  object.setup();
  return object;
};

sap.firefly.UxTaskBarButton.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = new sap.firefly.XtUi5TaskBarButton(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

sap.firefly.UxTaskBarButton.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxTaskBarButton.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onPress event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(sap.firefly.UiControlEvent.create(myself));
    }
  };

  // onContextMenu event
  nativeControl.oncontextmenu = function(oControlEvent) {
    if (myself.getListenerOnContextMenu() !== null) {
      oControlEvent.preventDefault(); // prevent opening the browser context menu
      oControlEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

      var newParameters = sap.firefly.XProperties.create();
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_X, oControlEvent.clientX);
      newParameters.putInteger(sap.firefly.UiControlEvent.PARAM_CLICK_Y, oControlEvent.clientY);
      myself.getListenerOnContextMenu().onContextMenu(sap.firefly.UiControlEvent.create(myself, newParameters));
    }
  };
};

// ======================================

sap.firefly.UxTaskBarButton.prototype.setText = function(text) {
  sap.firefly.UxGeneric.prototype.setText.call(this, text);
  return this;
};

sap.firefly.UxTaskBarButton.prototype.getText = function() {
  return sap.firefly.UxGeneric.prototype.getText.call(this);
};

sap.firefly.UxTaskBarButton.prototype.setSrc = function(src) {
  sap.firefly.DfUiContext.prototype.setSrc.call(this, src); // skip superclass implementation
  this.getNativeControl().setIconSrc(src);
  return this;
};

sap.firefly.UxTaskBarButton.prototype.getSrc = function() {
  return sap.firefly.UxGeneric.prototype.getSrc.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxRoot = function() {
   sap.firefly.UxGeneric.call(this);
  this._ff_c = "UxRoot";
};
sap.firefly.UxRoot.prototype = new sap.firefly.UxGeneric();

sap.firefly.UxRoot.prototype.newInstance = function() {
  var object = new sap.firefly.UxRoot();
  object.setup();
  return object;
};

sap.firefly.UxRoot.prototype.initializeNative = function() {
  sap.firefly.UxGeneric.prototype.initializeNative.call(this);
  var myself = this;
  var nativeControl = null;

  // if the custom XtUi5ContentWrapper control available then use that
  // has same content methods as sap.m.Page
  if (sap.firefly.XtUi5ContentWrapper) {
    nativeControl = new sap.firefly.XtUi5ContentWrapper(this.getId(), {
      width: "100%",
      height: "100%",
      position: "absolute"
    });
  } else {
    // use sap.m.Page as a fallback when XtUi5ContentWrapper is missing
    nativeControl = new sap.m.Page(this.getId(), {
      enableScrolling: false,
      showFooter: false,
      showHeader: false,
      showSubHeader: false
    });
  }

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);

  this._renderRoot();
};

sap.firefly.UxRoot.prototype.releaseObject = function() {
  sap.firefly.UxGeneric.prototype.releaseObject.call(this);
};

// ======================================

sap.firefly.UxRoot.prototype._addEvents = function(nativeControl) {
  var myself = this;
};

// ======================================

sap.firefly.UxRoot.prototype.setContent = function(content) {
  sap.firefly.UxGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent(); // remove previous content
  if (content !== null) {
    var childControl = content.getNativeControl();
    this.getNativeControl().addContent(childControl);
  }
  return this;
};

sap.firefly.UxRoot.prototype.getContent = function() {
  return sap.firefly.UxGeneric.prototype.getContent.call(this);
};

sap.firefly.UxRoot.prototype.clearContent = function() {
  sap.firefly.UxGeneric.prototype.clearContent.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

sap.firefly.UxRoot.prototype.setText = function(text) {
  sap.firefly.DfUiContext.prototype.setText.call(this, text); // skip superclass implementation since the property name is different
  document.title = value;
  return this;
};

sap.firefly.UxRoot.prototype.getText = function() {
  return document.title;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

sap.firefly.UxRoot.prototype._renderRoot = function() {
  //render the root proxy element
  var nativeAnchorObject = this.getUiManager().getNativeAnchorObject();
  var nativeAnchorId = this.getUiManager().getNativeAnchorId();

  if (nativeAnchorObject !== null) {
    if (nativeAnchorObject.addContent) {
      nativeAnchorObject.removeAllContent();
      nativeAnchorObject.addContent(this.getNativeControl());
    } else {
      sap.firefly.logCritical("UxRoot rendering error!");
      sap.firefly.logError("The specified native parent object is not supported and cannot be used as root! Make sure the content aggregation exists on the specified control!");
    }
  } else if (nativeAnchorId !== null) {
    var domElement = $Global.document.getElementById(nativeAnchorId);
    if (domElement) {
      domElement.innerHTML = ""; // clear the container content
      this.getNativeControl().placeAt(domElement);
    } else {
      sap.firefly.logCritical("UxRoot rendering error!");
      sap.firefly.logError("Element with id " + nativeAnchorId + " does not exist in DOM. Cannot render UI. Make sure that the specified element id is defined in the HTML DOM.");
    }
  } else {
    sap.firefly.logCritical("UxRoot rendering error!");
    sap.firefly.logError("No native anchor id or anchor object specified! Cannot render UI!");
  }
};

sap.firefly.NativeUiManager = function() {
   sap.firefly.DfUiManager.call(this);
  this._ff_c = "NativeUiManager";
};
sap.firefly.NativeUiManager.prototype = new sap.firefly.DfUiManager();

sap.firefly.NativeUiManager.s_idCounter = 0;

sap.firefly.NativeUiManager.create = function(session) {
   var newObject = new sap.firefly.NativeUiManager();
  newObject.setupSessionContext(session);
  return newObject;
};

sap.firefly.NativeUiManager.prototype.releaseObject = function() {
  sap.firefly.DfUiManager.prototype.releaseObject.call(this);
};

sap.firefly.NativeUiManager.prototype.setupSessionContext = function(session) {
  sap.firefly.DfUiManager.prototype.setupSessionContext.call(this, session);
  this.setDeviceInfo(this._createDeviceInfo());
  //jQuery.sap.log.setLevel(jQuery.sap.log.Level.ALL); // set log level to ALL to see sapui5 and ui.native debugging information
};

// ======================================

sap.firefly.NativeUiManager.prototype.generateIdWithType = function(uiType) {
  // mp 11.2018: For ui5 we need to create globally unique ids. When
  // multiple ui managers are running
  // in embedded scenarios the same ids would be generated. We have to
  // prevent this here by random ids.
  // currently we have a global id counter
  return uiType.getName() + "_" + this._getNextId();
};

sap.firefly.NativeUiManager.prototype.setTimer = function(milliseconds, listener, customIdentifier) {
  var theManager = this;
  var timerVar = null;

  timerVar = window.setInterval(function() {
    clearInterval(timerVar);
    listener.onTimer(theManager, customIdentifier);

  }, milliseconds);
};

sap.firefly.NativeUiManager.prototype.getPlatform = function() {
  return sap.firefly.XPlatform.UI5;
};

sap.firefly.NativeUiManager.prototype.setTheme = function(themeName, themeBaseUrl) {
  if(sap && sap.ui && sap.ui.getCore()){
    sap.ui.getCore().applyTheme(themeName, themeBaseUrl ? themeBaseUrl : undefined);
  }
};

//helpers
// ======================================

sap.firefly.NativeUiManager.prototype._getNextId = function() {
  sap.firefly.NativeUiManager.s_idCounter = sap.firefly.NativeUiManager.s_idCounter + 1;
  return sap.firefly.NativeUiManager.s_idCounter;
};

sap.firefly.NativeUiManager.prototype._createDeviceInfo = function() {
  var userAgent = window.navigator.userAgent;
  var platform = window.navigator.platform;
  var environment = sap.firefly.UiDeviceEnvironment.BROWSER;
  var framework = sap.firefly.UiDeviceFramework.UI5;
  var width = window.screen.width;
  var height = window.screen.height;
  var scale = window.devicePixelRatio;
  var maxTouchPoints = window.navigator.maxTouchPoints;

  return sap.firefly.UiDeviceInfo.createWithUserAgentAndPlatform(userAgent, platform, environment, framework, height, width, scale, maxTouchPoints);
};

sap.firefly.NativeUiManagerFactory = function() {
   sap.firefly.UiManagerFactory.call(this);
  this._ff_c = "NativeUiManagerFactory";
};
sap.firefly.NativeUiManagerFactory.prototype = new sap.firefly.UiManagerFactory();

sap.firefly.NativeUiManagerFactory.staticSetupNative = function() {
   var newObject = new sap.firefly.NativeUiManagerFactory();
  sap.firefly.UiManagerFactory.registerFactory(newObject);
};

sap.firefly.NativeUiManagerFactory.prototype.newUiManagerInstance = function(process) {
  var nativeUiManager = sap.firefly.NativeUiManager.create(process);
  return nativeUiManager;
};

sap.firefly.UiDriverModule = function() {
   sap.firefly.DfModule.call(this);
  this._ff_c = "UiDriverModule";
};
sap.firefly.UiDriverModule.prototype = new sap.firefly.DfModule();

sap.firefly.UiDriverModule.s_module = null;

sap.firefly.UiDriverModule.getInstance = function() {
   if (sap.firefly.UiDriverModule.s_module === null) {
    if (sap.firefly.UiModule.getInstance() === null) {
      throw sap.firefly.XException.createInitializationException();
    }

    sap.firefly.UiDriverModule.s_module = sap.firefly.DfModule.startExt(new sap.firefly.UiDriverModule());

    sap.firefly.XPlatform.setPlatform(sap.firefly.XPlatform.UI5);

    sap.firefly.UiType.BUTTON.setFactory(new sap.firefly.UxButton());
    sap.firefly.UiType.TOGGLE_BUTTON.setFactory(new sap.firefly.UxToggleButton());
    sap.firefly.UiType.CHECKBOX.setFactory(new sap.firefly.UxCheckbox());
    sap.firefly.UiType.SWITCH.setFactory(new sap.firefly.UxSwitch());
    sap.firefly.UiType.INPUT.setFactory(new sap.firefly.UxInput());
    sap.firefly.UiType.SEARCH_FIELD.setFactory(new sap.firefly.UxSearchField());
    sap.firefly.UiType.IMAGE.setFactory(new sap.firefly.UxImage());
    sap.firefly.UiType.ICON.setFactory(new sap.firefly.UxIcon());
    sap.firefly.UiType.SLIDER.setFactory(new sap.firefly.UxSlider());
    sap.firefly.UiType.RANGE_SLIDER.setFactory(new sap.firefly.UxRangeSlider());
    sap.firefly.UiType.RADIO_BUTTON.setFactory(new sap.firefly.UxRadioButton());
    sap.firefly.UiType.LINK.setFactory(new sap.firefly.UxLink());

    sap.firefly.UiType.SUGGESTION_ITEM.setFactory(new sap.firefly.UxSuggestionItem());

    sap.firefly.UiType.ICON_TAB_BAR.setFactory(new sap.firefly.UxIconTabBar());
    sap.firefly.UiType.ICON_TAB_BAR_ITEM.setFactory(new sap.firefly.UxIconTabBarItem());
    sap.firefly.UiType.TAB_BAR.setFactory(new sap.firefly.UxTabBar());
    sap.firefly.UiType.TAB_BAR_ITEM.setFactory(new sap.firefly.UxTabBarItem());
    sap.firefly.UiType.DROPDOWN.setFactory(new sap.firefly.UxDropDown());
    sap.firefly.UiType.DROPDOWN_ITEM.setFactory(new sap.firefly.UxDropDownItem());
    sap.firefly.UiType.COMBO_BOX.setFactory(new sap.firefly.UxComboBox());
    sap.firefly.UiType.MULTI_COMBO_BOX.setFactory(new sap.firefly.UxMultiComboBox());
    sap.firefly.UiType.RADIO_BUTTON_GROUP.setFactory(new sap.firefly.UxRadioButtonGroup());

    sap.firefly.UiType.TREE.setFactory(new sap.firefly.UxTree());
    sap.firefly.UiType.TREE_ITEM.setFactory(new sap.firefly.UxTreeItem());
    sap.firefly.UiType.CUSTOM_TREE_ITEM.setFactory(new sap.firefly.UxCustomTreeItem());

    sap.firefly.UiType.TREE_TABLE.setFactory(new sap.firefly.UxTreeTable());
    sap.firefly.UiType.TREE_TABLE_ROW.setFactory(new sap.firefly.UxTreeTableRow());

    sap.firefly.UiType.DATE_PICKER.setFactory(new sap.firefly.UxDatePicker());
    sap.firefly.UiType.TIME_PICKER.setFactory(new sap.firefly.UxTimePicker());
    sap.firefly.UiType.DATE_TIME_PICKER.setFactory(new sap.firefly.UxDateTimePicker());
    sap.firefly.UiType.CALENDAR.setFactory(new sap.firefly.UxCalendar());
    sap.firefly.UiType.CLOCK.setFactory(new sap.firefly.UxClock());

    sap.firefly.UiType.NAVIGATION_CONTAINER.setFactory(new sap.firefly.UxNavigationContainer());
    sap.firefly.UiType.PAGE.setFactory(new sap.firefly.UxPage());
    sap.firefly.UiType.PAGE_BUTTON.setFactory(new sap.firefly.UxPageButton());

    sap.firefly.UiType.LABEL.setFactory(new sap.firefly.UxLabel());
    sap.firefly.UiType.TEXT.setFactory(new sap.firefly.UxText());
    sap.firefly.UiType.TEXT_AREA.setFactory(new sap.firefly.UxTextArea());
    sap.firefly.UiType.CODE_EDITOR.setFactory(new sap.firefly.UxCodeEditor());

    sap.firefly.UiType.PANEL.setFactory(new sap.firefly.UxPanel());

    sap.firefly.UiType.TILE.setFactory(new sap.firefly.UxTile());

    sap.firefly.UiType.MENU.setFactory(new sap.firefly.UxMenu());
    sap.firefly.UiType.MENU_ITEM.setFactory(new sap.firefly.UxMenuItem());
    sap.firefly.UiType.TOOLBAR.setFactory(new sap.firefly.UxToolbar());

    sap.firefly.UiType.SEGMENTED_BUTTON.setFactory(new sap.firefly.UxSegmentedButton());
    sap.firefly.UiType.SEGMENTED_BUTTON_ITEM.setFactory(new sap.firefly.UxSegmentedButtonItem());

    sap.firefly.UiType.VERTICAL_SPLITTER.setFactory(new sap.firefly.UxVerticalSplitter());
    sap.firefly.UiType.HORIZONTAL_SPLITTER.setFactory(new sap.firefly.UxHorizontalSplitter());

    sap.firefly.UiType.LIST.setFactory(new sap.firefly.UxList());
    sap.firefly.UiType.LIST_ITEM.setFactory(new sap.firefly.UxListItem());
    sap.firefly.UiType.CUSTOM_LIST_ITEM.setFactory(new sap.firefly.UxCustomListItem());

    sap.firefly.UiType.VIZ_GRID.setFactory(new sap.firefly.UxVizGrid());
    sap.firefly.UiType.FIREFLY_GRID.setFactory(new sap.firefly.UxFireflyGrid());
    if(sap.firefly.UxSacTableGrid)
    {
      sap.firefly.UiType.SAC_TABLE_GRID.setFactory(new sap.firefly.UxSacTableGrid());
    }

    sap.firefly.UiType.CARD.setFactory(new sap.firefly.UxCard());

    sap.firefly.UiType.TABLE.setFactory(new sap.firefly.UxTable());
    sap.firefly.UiType.TABLE_COLUMN.setFactory(new sap.firefly.UxTableColumn());
    sap.firefly.UiType.TABLE_ROW.setFactory(new sap.firefly.UxTableRow());
    sap.firefly.UiType.TABLE_CELL.setFactory(new sap.firefly.UxTableCell());

    sap.firefly.UiType.RESPONSIVE_TABLE.setFactory(new sap.firefly.UxResponsiveTable());
    sap.firefly.UiType.RESPONSIVE_TABLE_COLUMN.setFactory(new sap.firefly.UxResponsiveTableColumn());
    sap.firefly.UiType.RESPONSIVE_TABLE_ROW.setFactory(new sap.firefly.UxResponsiveTableRow());
    sap.firefly.UiType.RESPONSIVE_TABLE_CELL.setFactory(new sap.firefly.UxResponsiveTableCell());

    sap.firefly.UiType.HORIZONTAL_LAYOUT.setFactory(new sap.firefly.UxHorizontalLayout());
    sap.firefly.UiType.VERTICAL_LAYOUT.setFactory(new sap.firefly.UxVerticalLayout());

    sap.firefly.UiType.FLEX_LAYOUT.setFactory(new sap.firefly.UxFlexLayout());
    sap.firefly.UiType.FLOW_LAYOUT.setFactory(new sap.firefly.UxFlowLayout());

    sap.firefly.UiType.CANVAS_LAYOUT.setFactory(new sap.firefly.UxCanvasLayout());

    sap.firefly.UiType.MATRIX_LAYOUT.setFactory(new sap.firefly.UxMatrixLayout());
    sap.firefly.UiType.MATRIX_LAYOUT_ROW.setFactory(new sap.firefly.UxMatrixLayoutRow());
    sap.firefly.UiType.MATRIX_LAYOUT_CELL.setFactory(new sap.firefly.UxMatrixLayoutCell());

    sap.firefly.UiType.SCROLL_CONTAINER.setFactory(new sap.firefly.UxScrollContainer());

    sap.firefly.UiType.SPACER.setFactory(new sap.firefly.UxSpacer());

    sap.firefly.UiType.ACTIVITY_INDICATOR.setFactory(new sap.firefly.UxActivityIndicator());
    sap.firefly.UiType.PROGRESS_INDICATOR.setFactory(new sap.firefly.UxProgressIndicator());

    sap.firefly.UiType.HTML.setFactory(new sap.firefly.UxHtml());
    sap.firefly.UiType.WEB_ASSEMBLY.setFactory(new sap.firefly.UxWebAssembly());

    sap.firefly.UiType.TILE_CONTAINER.setFactory(new sap.firefly.UxTileContainer());
    sap.firefly.UiType.TILE_ITEM.setFactory(new sap.firefly.UxTileItem());

    sap.firefly.UiType.DIALOG.setFactory(new sap.firefly.UxDialog());
    sap.firefly.UiType.DIALOG_BUTTON.setFactory(new sap.firefly.UxDialogButton());
    sap.firefly.UiType.ALERT.setFactory(new sap.firefly.UxAlert());
    sap.firefly.UiType.TOAST.setFactory(new sap.firefly.UxToast());
    sap.firefly.UiType.POPOVER.setFactory(new sap.firefly.UxPopover());
    if(sap.firefly.UxHighChart)
    {
      sap.firefly.UiType.CHART.setFactory(new sap.firefly.UxHighChart());
    }
    sap.firefly.UiType.VIZ_FRAME.setFactory(new sap.firefly.UxVizFrame());
    sap.firefly.UiType.MICRO_CHART.setFactory(new sap.firefly.UxMicroChart());

    sap.firefly.UiType.WINDOW.setFactory(new sap.firefly.UxWindow());
    sap.firefly.UiType.TERMINAL.setFactory(new sap.firefly.UxTerminal());
    sap.firefly.UiType.LAUNCHPAD.setFactory(new sap.firefly.UxLaunchpad());
    sap.firefly.UiType.APP_ICON.setFactory(new sap.firefly.UxAppIcon());
    sap.firefly.UiType.TASK_BAR.setFactory(new sap.firefly.UxTaskBar());
    sap.firefly.UiType.TASK_BAR_BUTTON.setFactory(new sap.firefly.UxTaskBarButton());

    sap.firefly.UiType.ROOT.setFactory(new sap.firefly.UxRoot());


    sap.firefly.NativeUiManagerFactory.staticSetupNative();

    sap.firefly.DfModule.stopExt(sap.firefly.UiDriverModule.s_module);
  }

  return sap.firefly.UiDriverModule.s_module;
};

sap.firefly.UiDriverModule.prototype.getName = function() {
   return "ff2210.ui.native";
};


sap.firefly.UiDriverModule.getInstance();


return sap.firefly;
	} );