/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/zen/dsh/utils/EmccLoader",
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/dsh/firefly/ff2210.ui.native"
  ],
  function (jQuery, Log, _) {
    jQuery.sap.declare("sap.zen.dsh.utils.EmccLoader");
    function readVfsFile(oSession, sName) {
      var oF = sap.firefly.XFile.createExt(oSession, "vfs://" + sName, sap.firefly.PathFormat.URL, sap.firefly.VarResolveMode.NONE);
      return oF.loadExt().getString();
    }
    function writeVfsFile(oSession, sName, sContent) {
      var oFile = sap.firefly.XFile.createExt(oSession, "vfs://" + sName, sap.firefly.PathFormat.URL, sap.firefly.VarResolveMode.NONE);
      var oContent = sap.firefly.XContent.createStringContent(sap.firefly.ContentType.TEXT, sContent);
      oFile.saveExt(oContent, sap.firefly.CompressionType.NONE);
    }
    function EmccLoader(sProgram, oBridge) {
      var that = this;
      var fStartHandler;
      var aInput = [];
      var fInputResolve;
      var handleInput = function (s) {
        aInput.push(s);
        if (fInputResolve) {
          var sResult = aInput[0];
          aInput = _.drop(aInput);
          fInputResolve(sResult);
        }
      };
      that.getInputPromise = function () {
        function handleDialog(resolve) {
          fInputResolve = resolve;
        }
        return new Promise(handleDialog);
      };
      that.getInputCallback = function () {
        return handleInput;
      };
      if (oBridge.println) {
        that.print = function (nAscii) {
          oBridge.print(String.fromCharCode(nAscii));
        };
        that.printString = oBridge.println.bind(oBridge);
      } else {
        that.print = function (text) {
          if ( arguments.length > 1){
            text = Array.prototype.slice.call(arguments).join(
              " "
            );
          }
          if (oBridge.getValue() === "") {
            oBridge.setValue(oBridge.getValue() + text);
          } else {
            oBridge.setValue(oBridge.getValue() + "\n" + text);
          }
        };
        that.printErr = function (text) {
          if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(" ");
          Log.error(text);
        };
      }
      that.setStatus = function (text) {
        window.title = text;
      };
      that.totalDependencies = 0;
      that.locateFile = function () {
        return sProgram + ".wasm";
      };
      that.noInitialRun = true;
      var fExitHandler = null;
      if (oBridge.getSession) {
        oBridge.getSession().registerOnExit = function (fHandler) {
          fExitHandler = fHandler;
        };
        oBridge.getSession().registerOnStart = function (fHandler) {
          fStartHandler = fHandler;
        };
      }
      that.loadProgram = function () {
        var fResolve, fReject;
        function handleDialog(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }
        var sInput = null, nIndex;
        sap.ui.require(
          [sProgram],
          function (oProgram) {
            var oDomElem = null;
            fResolve({
              run: function () {
                that.arguments = _.map(arguments);
                var oP = new oProgram(that);
                Object.defineProperty(that, "keyboardListeningElement", {
                  get: function () {
                    return oDomElem;
                  }
                });
                that.getSession = function () {
                  return oBridge.getSession ? oBridge.getSession() : null;
                };
                that.ff_openWindowPromise = function (s) {
                  var fResolve, fReject;
                  var oApplication = sap.firefly.ApplicationFactory.createDefaultApplication();
                  var oUiManager = oApplication.getUiManager();
                  var oFreeGenesis = oUiManager.getFreeGenesis();
                  function handle(resolve, reject) {
                    fResolve = resolve;
                    fReject = reject;
                  }
                  var oProm = new Promise(handle);
                  var oWindow = oFreeGenesis.newControl(sap.firefly.UiType.WINDOW);
                  oWindow.registerOnClose({
                    onClose: function () {
                      that.ff_exit();
                    }
                  });
                  oWindow.registerOnOpen({
                    onOpen: function () {
                      try {
                        var oWebView = oFreeGenesis.newControl(sap.firefly.UiType.HTML);
                        oWebView.registerOnLoadFinished({
                          onLoadFinished: function () {
                            fResolve(oWindow);
                          }
                        });
                        oWindow.setContent(oWebView);
                        oWebView.setValue("<canvas width='100%' height='100%'/>");
                      } catch (e) {
                        fReject(e);
                      }
                    }
                  });
                  oWindow.registerOnButtonPress({
                    onButtonPress: function (oEvent) {
                      switch (oEvent.getParameters().getStringByKeyExt("pressedButtonType")) {
                      case "CloseBtn":
                        oWindow.close();
                        break;
                      case "MaximizeBtn":
                        oWindow.maximize();
                        break;
                      case "MinimizeBtn":
                        oWindow.minimize();
                        break;
                      }
                    }
                  });
                  oWindow.open();
                  return oProm.then(
                    function () {
                      oWindow.setTitle(s);
                      return oWindow.getContent().getNativeControl().getDomRef().children[0];
                    });
                };
                that.ff_openWindow = function (s) {
                  return oP.getAsyncify().handleAsync(function () {
                    var fResolve, fReject;
                    function handleDialog(resolve, reject) {
                      fResolve = resolve;
                      fReject = reject;
                    }
                    Promise.resolve(null).then(
                      function () {
                        return that.ff_openWindowPromise(s);
                      }
                    ).then(
                      function (oCanvas) {
                        that.canvas = oCanvas;
                        fResolve(0);
                      }
                    ).catch(
                      function (oError) {
                        Log.error(oError);
                        fReject(oError);
                      }
                    );
                    return new Promise(handleDialog);
                  });
                };
                that.inputAsync = function () {
                  // Note how we return the output of handleAsync() here.
                  return oP.getAsyncify().handleAsync(function () {
                    var nAscii;
                    var fResolve, fReject;
                    function handleDialog(resolve, reject) {
                      fResolve = resolve;
                      fReject = reject;
                    }
                    Promise.resolve(null).then(
                      function () {
                        return (sInput === null) ? that.getInputPromise() : null;
                      }
                    ).then(
                      function (sLine) {
                        try {
                          Log.info("line read");
                          if (typeof (sLine) === "string") {
                            sInput = sLine;
                            nIndex = 0;
                          }
                          if (nIndex < sInput.length) {
                            nAscii = sInput.charCodeAt(nIndex);
                            nIndex++;
                            fResolve(nAscii);
                          } else {
                            sInput = null;
                            fResolve(13);
                          }
                        } catch (e) {
                          Log.error(e);
                          fReject(e);
                        }
                      }
                    ).catch(
                      function (oError) {
                        Log.error(oError);
                        fReject(oError);
                      });
                    return new Promise(handleDialog);
                  });
                };
                that.readVfsFile = readVfsFile.bind(that, that.getSession());
                that.writeVfsFile = writeVfsFile.bind(that, that.getSession());
                that.preRun = function () {
                  if (oP.getFS) {
                    oP.getFS().init(function () {
                      Log.error("Input");
                      return oP.getAsyncify().handleAsync(function () {
                        var fResolve;
                        function handleDialog(resolve, reject) {
                          fResolve = resolve;
                          fReject = reject;
                        }
                        Promise.resolve(null).then(function () {
                          var s = window.prompt();
                          fResolve(s.length ? s.charCodeAt(0) : null);
                        });
                        return new Promise(handleDialog);
                      });
                    }, that.print, that.print);
                  }
                  if (fStartHandler) {
                    fStartHandler();
                  }
                };
                var fEndProgram;
                that.ff_exit = function (nExitCode) {
                  fEndProgram(nExitCode);
                };
                function handleDialog(fResolve) {
                  fEndProgram = fResolve;
                }
                var oPromise = new Promise(handleDialog);
                var oPro = oP.run.apply(oP, arguments);
                if (oPro && oPro.then) {
                  return oPro;
                } else {
                  return oPromise;
                }
              }
            });
          },
          function (oError) {
            try {
              oBridge.print("Source program not found");
              if (fExitHandler) {
                fExitHandler();
              }
              fReject(oError);
            } catch (e) {
              fReject(e);
            }
          });
        return new Promise(handleDialog);
      };
    }
    sap.zen.dsh.utils.EmccLoader = EmccLoader;
    //**************** Register Terminal Programs ******************************//
    //source emscripten programs
    sap.firefly.emccLoader = function(){
      var that = this;
      sap.firefly.DfProgram.apply( that,arguments);
      that.newProgram = function () {
        var newPrg = new sap.firefly.emccLoader();
        newPrg.setup();
        return newPrg;
      };
      that.runProcess = function () {
        var that = this;
        var oLoader = new EmccLoader(
          [
            "programs",
            that.getArguments().getArgumentList().get(0),
            that.getArguments().getArgumentList().get(0)
          ].join("/"), that);
        that.getProcess().getParentProcess().getProgramCfg().getProgramContainer().getTerminalContainer().getWindow().enableCaptureMode(
          oLoader.getInputCallback()
        );
        oLoader.loadProgram().then(
          function (oProgram) {
            return oProgram.run.apply(
              oProgram,
              that.getArguments().getArgumentList().getListFromImplementation().slice(1)
            );
          }
        ).then(
          function (nExitCode) {
            Log.info("Exit: " + nExitCode);
            that.getProcess().getParentProcess().getProgramCfg().getProgramContainer().getTerminalContainer().getWindow().disableCaptureMode();
            that.exitNow(0 | nExitCode);
          }
        ).catch(
          function (oError) {
            Log.error(oError);
            that.getProcess().getParentProcess().getProgramCfg().getProgramContainer().getTerminalContainer(
            ).getWindow().disableCaptureMode();
            that.exitNow(13);
          }
        );
      };
    };
    sap.firefly.emccLoader.prototype = new sap.firefly.DfProgram();
    sap.firefly.ProgramRegistration.setProgramFactory("source", new sap.firefly.emccLoader());
    return EmccLoader;
  });
