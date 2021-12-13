/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/model/odata/type/String", "sap/ui/model/ValidateException"], function (ODataStringType, ValidateException) {
  "use strict";

  var emailW3CRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
  var EmailType = ODataStringType.extend("sap.fe.core.type.Email", {
    validateValue: function (sValue) {
      if (!emailW3CRegexp.test(sValue)) {
        throw new ValidateException(sap.ui.getCore().getLibraryResourceBundle("sap.fe.core").getText("T_EMAILTYPE_INVALID_VALUE"));
      }

      ODataStringType.prototype.validateValue.apply(this, [sValue]);
    }
  });
  return EmailType;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVtYWlsLnRzIl0sIm5hbWVzIjpbImVtYWlsVzNDUmVnZXhwIiwiRW1haWxUeXBlIiwiT0RhdGFTdHJpbmdUeXBlIiwiZXh0ZW5kIiwidmFsaWRhdGVWYWx1ZSIsInNWYWx1ZSIsInRlc3QiLCJWYWxpZGF0ZUV4Y2VwdGlvbiIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImdldFRleHQiLCJwcm90b3R5cGUiLCJhcHBseSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7OztBQUNBLE1BQU1BLGNBQWMsR0FBRyxxRUFBdkI7QUFDQSxNQUFNQyxTQUFTLEdBQUdDLGVBQWUsQ0FBQ0MsTUFBaEIsQ0FBdUIsd0JBQXZCLEVBQWlEO0FBQ2xFQyxJQUFBQSxhQURrRSxZQUNwREMsTUFEb0QsRUFDcEM7QUFDN0IsVUFBSSxDQUFDTCxjQUFjLENBQUNNLElBQWYsQ0FBb0JELE1BQXBCLENBQUwsRUFBa0M7QUFDakMsY0FBTSxJQUFJRSxpQkFBSixDQUNMQyxHQUFHLENBQUNDLEVBQUosQ0FDRUMsT0FERixHQUVFQyx3QkFGRixDQUUyQixhQUYzQixFQUdFQyxPQUhGLENBR1UsMkJBSFYsQ0FESyxDQUFOO0FBTUE7O0FBQ0RWLE1BQUFBLGVBQWUsQ0FBQ1csU0FBaEIsQ0FBMEJULGFBQTFCLENBQXdDVSxLQUF4QyxDQUE4QyxJQUE5QyxFQUFvRCxDQUFDVCxNQUFELENBQXBEO0FBQ0E7QUFYaUUsR0FBakQsQ0FBbEI7U0FhZUosUyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RyaW5nIGFzIE9EYXRhU3RyaW5nVHlwZSB9IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdHlwZVwiO1xuaW1wb3J0IHsgVmFsaWRhdGVFeGNlcHRpb24gfSBmcm9tIFwic2FwL3VpL21vZGVsXCI7XG5cbmNvbnN0IGVtYWlsVzNDUmVnZXhwID0gL15bYS16QS1aMC05LiEjJCUm4oCZKisvPT9eX2B7fH1+LV0rQFthLXpBLVowLTktXSsoPzouW2EtekEtWjAtOS1dKykqJC87XG5jb25zdCBFbWFpbFR5cGUgPSBPRGF0YVN0cmluZ1R5cGUuZXh0ZW5kKFwic2FwLmZlLmNvcmUudHlwZS5FbWFpbFwiLCB7XG5cdHZhbGlkYXRlVmFsdWUoc1ZhbHVlOiBzdHJpbmcpIHtcblx0XHRpZiAoIWVtYWlsVzNDUmVnZXhwLnRlc3Qoc1ZhbHVlKSkge1xuXHRcdFx0dGhyb3cgbmV3IFZhbGlkYXRlRXhjZXB0aW9uKFxuXHRcdFx0XHRzYXAudWlcblx0XHRcdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHRcdFx0LmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpXG5cdFx0XHRcdFx0LmdldFRleHQoXCJUX0VNQUlMVFlQRV9JTlZBTElEX1ZBTFVFXCIpXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRPRGF0YVN0cmluZ1R5cGUucHJvdG90eXBlLnZhbGlkYXRlVmFsdWUuYXBwbHkodGhpcywgW3NWYWx1ZV0pO1xuXHR9XG59KTtcbmV4cG9ydCBkZWZhdWx0IEVtYWlsVHlwZTtcbiJdfQ==