/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/TableFormatterTypes"], function (TableFormatterTypes) {
  "use strict";

  var _exports = {};
  var MessageType = TableFormatterTypes.MessageType;

  /**
   * Gets a MessageType enum value from a CriticalityType enum value.
   *
   * @param {CriticalityType} criticalityEnum The CriticalityType enum value
   * @returns {MessageType} Returns the MessageType enum value
   */
  function getMessageTypeFromCriticalityType(criticalityEnum) {
    var messageType;

    switch (criticalityEnum) {
      case "UI.CriticalityType/Negative":
      case "UI.CriticalityType/VeryNegative":
        messageType = MessageType.Error;
        break;

      case "UI.CriticalityType/Critical":
        messageType = MessageType.Warning;
        break;

      case "UI.CriticalityType/Positive":
      case "UI.CriticalityType/VeryPositive":
        messageType = MessageType.Success;
        break;

      case "UI.CriticalityType/Information":
        messageType = MessageType.Information;
        break;

      case "UI.CriticalityType/Neutral":
      default:
        messageType = MessageType.None;
    }

    return messageType;
  }

  _exports.getMessageTypeFromCriticalityType = getMessageTypeFromCriticalityType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNyaXRpY2FsaXR5LnRzIl0sIm5hbWVzIjpbImdldE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5VHlwZSIsImNyaXRpY2FsaXR5RW51bSIsIm1lc3NhZ2VUeXBlIiwiTWVzc2FnZVR5cGUiLCJFcnJvciIsIldhcm5pbmciLCJTdWNjZXNzIiwiSW5mb3JtYXRpb24iLCJOb25lIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sV0FBU0EsaUNBQVQsQ0FBMkNDLGVBQTNDLEVBQXFHO0FBQzNHLFFBQUlDLFdBQUo7O0FBQ0EsWUFBUUQsZUFBUjtBQUNDLFdBQUssNkJBQUw7QUFDQSxXQUFLLGlDQUFMO0FBQ0NDLFFBQUFBLFdBQVcsR0FBR0MsV0FBVyxDQUFDQyxLQUExQjtBQUNBOztBQUNELFdBQUssNkJBQUw7QUFDQ0YsUUFBQUEsV0FBVyxHQUFHQyxXQUFXLENBQUNFLE9BQTFCO0FBQ0E7O0FBQ0QsV0FBSyw2QkFBTDtBQUNBLFdBQUssaUNBQUw7QUFDQ0gsUUFBQUEsV0FBVyxHQUFHQyxXQUFXLENBQUNHLE9BQTFCO0FBQ0E7O0FBQ0QsV0FBSyxnQ0FBTDtBQUNDSixRQUFBQSxXQUFXLEdBQUdDLFdBQVcsQ0FBQ0ksV0FBMUI7QUFDQTs7QUFDRCxXQUFLLDRCQUFMO0FBQ0E7QUFDQ0wsUUFBQUEsV0FBVyxHQUFHQyxXQUFXLENBQUNLLElBQTFCO0FBakJGOztBQW1CQSxXQUFPTixXQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENyaXRpY2FsaXR5VHlwZSwgRW51bVZhbHVlIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5cbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVGFibGVGb3JtYXR0ZXJUeXBlc1wiO1xuXG4vKipcbiAqIEdldHMgYSBNZXNzYWdlVHlwZSBlbnVtIHZhbHVlIGZyb20gYSBDcml0aWNhbGl0eVR5cGUgZW51bSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge0NyaXRpY2FsaXR5VHlwZX0gY3JpdGljYWxpdHlFbnVtIFRoZSBDcml0aWNhbGl0eVR5cGUgZW51bSB2YWx1ZVxuICogQHJldHVybnMge01lc3NhZ2VUeXBlfSBSZXR1cm5zIHRoZSBNZXNzYWdlVHlwZSBlbnVtIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUoY3JpdGljYWxpdHlFbnVtOiBFbnVtVmFsdWU8Q3JpdGljYWxpdHlUeXBlPik6IE1lc3NhZ2VUeXBlIHtcblx0bGV0IG1lc3NhZ2VUeXBlOiBNZXNzYWdlVHlwZTtcblx0c3dpdGNoIChjcml0aWNhbGl0eUVudW0pIHtcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL05lZ2F0aXZlXCI6XG5cdFx0Y2FzZSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9WZXJ5TmVnYXRpdmVcIjpcblx0XHRcdG1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuRXJyb3I7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL0NyaXRpY2FsXCI6XG5cdFx0XHRtZXNzYWdlVHlwZSA9IE1lc3NhZ2VUeXBlLldhcm5pbmc7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL1Bvc2l0aXZlXCI6XG5cdFx0Y2FzZSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9WZXJ5UG9zaXRpdmVcIjpcblx0XHRcdG1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuU3VjY2Vzcztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJVSS5Dcml0aWNhbGl0eVR5cGUvSW5mb3JtYXRpb25cIjpcblx0XHRcdG1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuSW5mb3JtYXRpb247XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL05ldXRyYWxcIjpcblx0XHRkZWZhdWx0OlxuXHRcdFx0bWVzc2FnZVR5cGUgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9XG5cdHJldHVybiBtZXNzYWdlVHlwZTtcbn1cbiJdfQ==