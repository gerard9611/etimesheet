kony = kony || {};
kony.sdk = kony.sdk || {};
kony.sdk.mvvm = kony.sdk.mvvm || {};
kony.sdk.mvvm.log = kony.sdk.mvvm.log || {};
kony.sdk.mvvm.constants = kony.sdk.mvvm.constants || {};
kony.sdk.mvvm.constants["ENABLE_JSON_STRINGIFY_PRINTS"] = false;
kony.sdk.mvvm.constants["ENABLE_LAZY_LOADING"] = true;
kony.sdk.mvvm.constants["DYNAMIC_THEME_ENABLED"] = false;

kony.sdk.mvvm.LoginAction = function(status, successCallBack, errorCallback) {
    kony.print("---------------------In LoginAction MFLogin.js-------------");
    var options = {};
    var authConfig;
    var identityServiceName = kony.apps.coe.ess.appconfig.identityServiceSAP;
    if (kony.apps.coe.ess.globalVariables.isSPA === true || kony.apps.coe.ess.globalVariables.isWebDesktop === true) {
        options = {
            "access": "online"
        };
            if (kony.apps.coe.ess.globalVariables.isSPA === true) {
      var username = kony.apps.coe.ess.frmLogin.username;
      var password = kony.apps.coe.ess.frmLogin.password;
     } else {
      var username = kony.apps.coe.ess.frmLoginDesk.username;
      var password = kony.apps.coe.ess.frmLoginDesk.password;
       }
        authConfig = {
            "authParams": {
                "userid": username,
                "password": password,
                "callerId": username + kony.apps.coe.ess.appconfig.ACFAppID + kony.sdk.mvvm.Utils.getDeviceID(),
                "loginOptions": {
                    "isOfflineEnabled": false,
                    "isSSOEnabled": false,
                    "include_profile": true,
                }
            },
            "options": options,
            "identityServiceName": identityServiceName
        };
    } else {

        if (status == "DeepLink") {
            kony.apps.coe.ess.frmLogin.username = appserviceUsername;
            kony.apps.coe.ess.frmLogin.password = appservicePassword;
            options = {
                "access": "offline"
            };
            authConfig = {
                "authParams": {
                    "userid": appserviceUsername,
                    "password": appservicePassword,
                    "callerId": appserviceUsername + kony.apps.coe.ess.appconfig.ACFAppID + kony.sdk.mvvm.Utils.getDeviceID(),
                    "loginOptions": {
                        "isOfflineEnabled": true,
                        "isSSOEnabled": false,
                        "include_profile": true,
                    }
                },
                "options": options,
                "identityServiceName": identityServiceName
            };
        } else if (status == "ssoEnable") {
            if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
                var unique_id = null;
                var sso_token = kony.sdk.util.getSSOToken();
                if (kony.apps.coe.ess.frmLogin.username === null || kony.apps.coe.ess.frmLogin.username === " " || kony.apps.coe.ess.frmLogin.username === undefined) {
                    unique_id = sso_token;
                } else {
                    unique_id = kony.apps.coe.ess.frmLogin.username;
                }
                options = {
                    "access": "online"
                };
                authConfig = {
                    "authParams": {
                        "callerId": unique_id + kony.apps.coe.ess.appconfig.ACFAppID + kony.sdk.mvvm.Utils.getDeviceID(),
                        "loginOptions": {
                            "isOfflineEnabled": false,
                            "isSSOEnabled": false,
                            "include_profile": true,
                        }
                    },
                    "options": options,
                    "identityServiceName": identityServiceName
                };
            } else {
                options = {
                    "access": "offline"
                };
                var username = kony.apps.coe.ess.frmLogin.username;
                var password = kony.apps.coe.ess.frmLogin.password;
                authConfig = {
                    "authParams": {
                        "userid": username,
                        "password": password,
                        "callerId": username  + kony.apps.coe.ess.appconfig.ACFAppID +  kony.sdk.mvvm.Utils.getDeviceID(),
                        "loginOptions": {
                            "isOfflineEnabled": true,
                            "isSSOEnabled": false,
                            "include_profile": true,
                        }
                    },
                    "options": options,
                    "identityServiceName": identityServiceName
                };
            }
        } else {
            //#ifdef windows8
            options = {
                "access": "online"
            };
            //#else
            options = {
                "access": "offline"
            };
            //#endif
            var username = kony.apps.coe.ess.frmLogin.username;
            var password = kony.apps.coe.ess.frmLogin.password;
            authConfig = {
                "authParams": {
                    "userid": username,
                    "password": password,
                    "callerId": username  + kony.apps.coe.ess.appconfig.ACFAppID +  kony.sdk.mvvm.Utils.getDeviceID(),
                    "loginOptions": {
                        //#ifdef windows8
                        "isOfflineEnabled": false,
                        "isSSOEnabled": false,
                        //#else
                        "isOfflineEnabled": true,
                        "isSSOEnabled": false,
                        //#endif
                        "include_profile": true,
                    }
                },
                "options": options,
                "identityServiceName": identityServiceName
            };
        }
    } // else block end of spa


    //--------------


    kony.sdk.mvvm.KonyApplicationContext.init();
    var appFactory = kony.sdk.mvvm.KonyApplicationContext.getFactorySharedInstance();
    var initManager = appFactory.createAppInitManagerObject();
    initManager.registerService("AuthenticationServiceManager", {
        "object": appFactory.createAuthManager(),
        "params": authConfig
    });
    initManager.registerService("MetadataServiceManager", {
        "object": appFactory.createMetadataServiceManagerObject(),
        "params": {
            "options": options
        }
    });
    // Set callbacks if they were not passed as arguments of the function
    if(successCallBack === undefined || successCallBack === null){
      successCallBack = applicationSuccessCallback;
    }
    if(errorCallback === undefined || errorCallback === null){
      errorCallback = applicationErrorCallback;
    }
    initManager.executeRegistedServices(successCallBack, errorCallback);
};

function applicationSuccessCallback() {
  _removeTokenHeaders();

  if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
    kony.sdk.getCurrentInstance().getIdentityService(kony.apps.coe.ess.appconfig.identityServiceSAP).getProfile(true, userDetailsSucess, userDetailsSucess);
  }
  else{
    userDetailsSucess();
  }
}

//Dynamic skinning success callback function
function dynamicSkinningSuccess(resp) {
    kony.print(resp);
}

function userDetailsSucess(response) {
    try {
        if (response!=undefined) {
          kony.apps.coe.ess.frmLogin.username = response.userid;
        }
        var appInstance = kony.sdk.mvvm.KonyApplicationContext.getAppInstance();
        kony.print("------------ appInstance: " + JSON.stringify(appInstance));
        if (appInstance) {
          	frmLogin.lblApploadTime.setVisibility(true);
			frmLogin.lblwait.setVisibility(true);
            kony.application.showLoadingScreen("", kony.i18n.getLocalizedString("i18n.ess.Login.initializing"), constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});
            //Initialize ApplicationForms
            kony.sdk.mvvm.initApplicationForms(appInstance);
           if (kony.apps.coe.ess.globalVariables.isSPA) {

              showApprovalHome();
                    return;
      			}
            else if(kony.apps.coe.ess.globalVariables.isWebDesktop === true){
              kony.apps.coe.ess.frmLogin.afterloginSuccess();
               var objSvc = kony.sdk.getCurrentInstance().getObjectService("Employee", {
                        "access": "online"
                    });
                    var dataObject= new kony.sdk.dto.DataObject("Employee");
                    //dataObject.setOdataUrl("$filter=IsEmployee eq '1'");
                    var options = {
                        "dataObject": dataObject
                    };
                    objSvc.fetch(options,
                        function(res) {
                         for (var i in res.records)
                           {
                             if(res.records[i].IsEmployee==="1")
                               {
                                 kony.apps.coe.ess.globalVariables.EmployeeID=res.records[i].Communication_Channel[1].Employee_Id;
                                 kony.print("----filtered employee id is "+ kony.apps.coe.ess.globalVariables.EmployeeID);
                                showApprovalsDashboard();
                               }
                           }

                        },
                        function(err) {
                            kony.print("---------- dataObject error: " + JSON.stringify(err));
                        });

                    return;
      			}
            //Initialize SyncLib
            else {// (kony.apps.coe.ess.globalVariables.isNative == true) {
                kony.apps.coe.ess.Sync.initializeSync(function() {
                    //SyncInit Success
                    kony.apps.coe.ess.Sync.doDownload = true;
                    //Check if New User is loging in device and reset old users database
                    kony.apps.coe.ess.frmLogin.resetDbIncaseOfNewUser(function(isNewUser) {

                        var syncSessionSuccess = function() {
                            kony.apps.coe.ess.frmLogin.afterloginSuccess();
                            //After Sync Session is Successfully completed, Check for initialize & show landing form
                            var updateSyncDate = function() {
                              kony.apps.coe.ess.globalVariables.lastSyncDate=new Date();
                                var months = [
                                    "Jan", "Feb", "Mar",
                                    "Apr", "May", "Jun", "Jul",
                                    "Aug", "Sep", "Oct",
                                    "Nov", "Dec"
                                ];

                                var currDate = new Date();
                                var currDay = currDate.getDate();
                                var currMonth = currDate.getMonthNameShort(kony.store.getItem("localeToBeSet"));//months[currDate.getMonth()];
                                var currYear = currDate.getFullYear();
                                var currTime = currDate.toHHMMSS(":");
                                var suffix;
                                if (parseInt(currDate.getHours()) >= 12) {
                                    suffix = "PM";
                                } else {
                                    suffix = "AM";
                                }
//                               	//bbe-101 menu sync
//                               	kony.apps.coe.ess.globalVariables.lastSyncDate=currDay + " " + currMonth + " " + currYear;
// 								kony.apps.coe.ess.globalVariables.lastSyncTime= currTime.substring(0, 5);// + " " + suffix;
//                                 //#ifndef windows8
//                                 if (kony.application.getCurrentForm().lblSyncDate !== null || kony.application.getCurrentForm().lblSyncTime !== null) {
                                    frmHamburger.lblSyncDate.text = currDay + " " + currMonth + " " + currYear;
                                    frmHamburger.lblSyncTime.text = currTime.substring(0, 5); //+ " " + suffix;
//                                 }
//                                 //#endif
                            }
                            updateSyncDate();
                          	var success = function () {
                              frmSettings.imgPushNotification.src = "on.png";
                              frmLogin.lblApploadTime.setVisibility(false);
							  frmLogin.lblwait.setVisibility(false);
                              kony.application.dismissLoadingScreen();
                            };
                            var failure = function () {
                              frmSettings.imgPushNotification.src = "off.png"
                              toastMsg.showToastMsg(kony.i18n.getLocalizedString("i18n.ess.common.errorOnEnableNotifications"), 3000);
                              frmLogin.lblApploadTime.setVisibility(false);
							  frmLogin.lblwait.setVisibility(false);
                              kony.application.dismissLoadingScreen();
                            };
                            if (kony.apps.coe.ess.globalVariables.isNativeTablet === true) {
                                kony.apps.coe.ess.globalVariables.updateTabEmployeeID(); // open approvals dashboard form
                              if (isNewUser) {
                                    kony.apps.coe.ess.KMS.enablePushNotifications(success.bind(this), failure);
                                }
                            } else {
                                kony.apps.coe.ess.Approvals.Footer.SetFocus(1);
                                var sqlquery = "select Id,Designation_Id ,First_Name , Last_Name from Employee where IsEmployee = 1";
                                kony.sync.single_select_execute(kony.sync.getDBName(), sqlquery, null, function(data) {
                                        kony.print("---Employee data: " + JSON.stringify(data));
                                        if (data.length > 0) {
                                            kony.print("---String: " + data[0].Designation_Id + "\nInteger: " + parseInt(data[0].Designation_Id));
                                            kony.apps.coe.ess.globalVariables.designation_id = data[0].Designation_Id;
                                            kony.apps.coe.ess.globalVariables.user_id = data[0].User_Id;
                                            //Invoking Dynamic Skinning Configurations
		                                    //If network is available
        		                          	if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
                		                        kony.servicesapp.loadAndConfigureApp(kony.apps.coe.ess.appconfig.runtimeurl, dynamicSkinningSuccess);
                        		            }
                                		  	//If network is not available
                                    		else{
                                      			var themeString = kony.store.getItem("dynamicSkinningTheme");
	  											var jsonObj1 = JSON.parse(themeString);
      											kony.theme.createThemeFromJSONString(JSON.stringify(jsonObj1), "MyTheme1", onThemeSettingSuccessCallback, onThemeSettingErrorCallback);
      											kony.theme.setCurrentTheme("MyTheme1", onThemeSettingSuccessCallback, onThemeSettingErrorCallback);
      										}
                                          kony.apps.coe.ess.globalVariables.employeeName =data[0].First_Name+" "+ data[0].Last_Name;
                                  		}
                                    },
                                    function(err) {
                                        kony.print("--Error in getting Employee_id--");
                                    });
                                kony.apps.coe.ess.globalVariables.Status.updateStatus();
                                if (isNewUser) {
                                  	kony.apps.coe.ess.KMS.enablePushNotifications(success.bind(this), failure);
                                }
                                kony.apps.coe.ess.QRCode.navigatingThroughQRCode = false;
                            }
                            //kony.apps.coe.ess.locale.setLanguageServiceLocale();
							kony.apps.coe.ess.locale.notificationLanguageServiceLocale();
                        };
                        var syncSessionFailure = function(err) {
                            //Incase of Any Sync Failure
                            //ToDo : What to show on Sync Failure
                          	frmLogin.lblApploadTime.setVisibility(false);
							frmLogin.lblwait.setVisibility(false);
                            kony.application.dismissLoadingScreen();
                            kony.apps.coe.ess.QRCode.navigatingThroughQRCode = false;
                            //#ifdef windows8
                            frmLogin.flxLogin.onClick = function() {
                                kony.apps.coe.ess.frmLogin.btnLoginOnclick();
                            };
                            //#else
                            frmLogin.btnLogin.onClick = function() {
                                kony.apps.coe.ess.frmLogin.btnLoginOnclick();
                            };
                            //#endif
                            handleError(err);
                        };
                        var syncAndShowLandingForm = function() {
                            //Operations to be done after successful authentication
                            if (!kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
                                // we call syncSessionSuccess in case of offline mode
                                syncSessionSuccess();
                            } else {
                              	frmLogin.lblApploadTime.setVisibility(true);
								frmLogin.lblwait.setVisibility(true);
                                // //After Successfull verification of New user, Start Sync Session
                                kony.application.showLoadingScreen("", kony.i18n.getLocalizedString("i18n.ess.Login.SyncingData"), constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});
                                //kony.apps.coe.ess.Sync.startSyncSession(syncSessionSuccess, syncSessionFailure);
                              	kony.apps.coe.ess.Sync.resetSyncDb(mfresetLocalDBSucess, mfresetLocalDBError);
                            }
                        };
                        var mfresetLocalDBSucess = function() {
                          kony.application.showLoadingScreen("", kony.i18n.getLocalizedString("i18n.ess.Login.SyncingData"), constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});
                          frmLogin.lblApploadTime.setVisibility(true);
						  frmLogin.lblwait.setVisibility(true);
                          kony.apps.coe.ess.Sync.doDownload = true;
                          kony.apps.coe.ess.Sync.startSyncSession(syncSessionSuccess, syncSessionFailure);
                        };
                        var mfresetLocalDBError = function(error) {
                          kony.print(JSON.stringify(error));
                        };
                        try {
                            //#ifdef windows8
                            syncAndShowLandingForm();
                            //#else
                            if (isNewUser) {
                                //Show Enable TouchID Popup for new user - If TouchID is supported
                                if (kony.apps.coe.ess.TouchID.isTouchAuthenticationSupported()) {
                                    if (applaunchMode == 3 || kony.apps.ess.deepLinkingSSO.ssotoken) {
                                        syncAndShowLandingForm();
                                        return;
                                    } else {
                                      	frmLogin.lblApploadTime.setVisibility(false);
										frmLogin.lblwait.setVisibility(false);
                                        kony.application.dismissLoadingScreen();
                                        //Show ToucID enable popup only if it's not enabled
                                        if (kony.store.getItem("useTouchID") === null || kony.store.getItem("useTouchID") === false) {
                                            if (kony.application.getCurrentForm() === frmLogin) {
                                                kony.apps.coe.ess.frmLogin.showEnableTouchIDPopup(syncAndShowLandingForm);
                                                return;
                                            }
                                        }
                                    }
                                }
                                syncAndShowLandingForm();
                            } else {
                                kony.apps.coe.ess.Sync.syncOnLandingForm = true;
                                syncSessionSuccess();
                            }
                            //#endif
                        } catch (e) { //In android, exceptio may be thrown for touchID functions
                            handleError(e);
                            kony.print("Error occured while using touch_id functions : MFLogin.js : " + JSON.stringify(e));
                        }

                    });
                }, function(err) {
                    //Sync InitFailed
                    kony.sdk.mvvm.log.error("Sync is not initialized");
                    applicationErrorCallback("Application is not initialized");
                });
            }
        } else {
            //If appInstance is null/undefined, It means app is not initialized properly
            kony.sdk.mvvm.log.error("Application is not initialized");
            applicationErrorCallback("Application is not initialized");
        }
    } catch (excp) {
        kony.sdk.mvvm.log.error("Exception Occured in applicationSuccessCallback of LoginAction " + JSON.stringify(excp));
        handleError(excp);
    }
}

function applicationErrorCallback(error) {
  _removeTokenHeaders();

	kony.sdk.mvvm.log.error("failed to load app");
	error = error!==null && error.getRootErrorObj !== undefined && error.getRootErrorObj !== null ? error.getRootErrorObj() : error;
	if(kony.apps.coe.ess.globalVariables.isWebDesktop){
    frmLoginDesk.flxLoginMain.flxErrorSpace.setVisibility(true);
    frmLoginDesk.forceLayout();
    frmLoginDesk.tbUsername.skin = "sknTbWrongCredentials";
    frmLoginDesk.tbPassword.skin = "sknTbWrongCredentials";
    if (error !== null && error !== undefined && error.mfcode !== null && error.mfcode !== undefined && error.mfcode == "Auth-7") {
        if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
          frmLoginDesk.flxLoginMain.flxErrorSpace.setVisibility(true);
          frmLoginDesk.forceLayout();
         // frmLoginDesk.lblLoginErrorMessage.text = kony.i18n.getLocalizedString("i18n.ess.Login.wrongCredentials");
        } else {
           frmLoginDesk.flxLoginMain.flxErrorSpace.setVisibility(true);
           frmLoginDesk.forceLayout();
           // frmLoginDesk.lblLoginErrorMessage.text = kony.i18n.getLocalizedString("i18n.ess.Login.offlineLoginFailure");
        }
    }
    if (kony.application.getCurrentForm() !== frmLoginDesk) {
        frmLoginDesk.show();
    }
    kony.print("Error Occured on LoginAction : " + JSON.stringify(error));
    frmLogin.lblApploadTime.setVisibility(false);
	frmLogin.lblwait.setVisibility(false);
    kony.application.dismissLoadingScreen();
	  frmLoginDesk.imgLogin.onClick = function() {
        kony.apps.coe.ess.frmLogin.btnLoginOnclick();
      };
	}
	else{
    frmLogin.lblLoginErrorMessage.isVisible = true;
    frmLogin.tbUsername.skin = "sknTbWrongCredentials";
    frmLogin.tbPassword.skin = "sknTbWrongCredentials";
    if (error !== null && error !== undefined && error.mfcode !== null && error.mfcode !== undefined && error.mfcode == "Auth-4") {
        if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
            frmLogin.lblLoginErrorMessage.text = kony.i18n.getLocalizedString("i18n.ess.Login.wrongCredentials");
        } else {
            frmLogin.lblLoginErrorMessage.text = kony.i18n.getLocalizedString("i18n.ess.Login.offlineLoginFailure");
        }
    } else {
        //Clear SSO Cache
       // kony.sdk.resetCacheKeys(kony.sdk.getCurrentInstance());
        kony.sdk.util.deleteSSOToken();
    }

    if (kony.application.getCurrentForm() !== frmLogin) {
        frmLogin.show();
    }
    kony.print("Error Occured on LoginAction : " + JSON.stringify(error));
    frmLogin.lblApploadTime.setVisibility(false);
	frmLogin.lblwait.setVisibility(false);
    kony.application.dismissLoadingScreen();
    kony.apps.coe.ess.QRCode.navigatingThroughQRCode = false;
    //#ifdef windows8
    frmLogin.flxLogin.onClick = function() {
        kony.apps.coe.ess.frmLogin.btnLoginOnclick();
    };
    //#else
    frmLogin.btnLogin.onClick = function() {
        kony.apps.coe.ess.frmLogin.btnLoginOnclick();
    };
    //#endif

    handleError(error);
}
}

function _removeTokenHeaders(){
  if(kony.sdk.getCurrentInstance() !== undefined && kony.sdk.getCurrentInstance() !== null ){
    // Remove token headers, if present
    kony.sdk.getCurrentInstance().removeGlobalRequestParam(kony.apps.coe.ess.globalVariables.login_sap_spnego_token, "headers");
    kony.sdk.getCurrentInstance().removeGlobalRequestParam(kony.apps.coe.ess.globalVariables.login_sap_access_token, "headers");
    kony.sdk.getCurrentInstance().removeGlobalRequestParam(Constants.AUTHORIZATION_HEADER, "headers");
  }
}

kony.sdk.mvvm.LogoutAction = function() {
  //commenting auto sync timer
  try {
    kony.timer.cancel("serviceDeltaSyncTimer");
  } catch (e) {
    kony.print(e);
  }
  sync.stopSession(function() {
    kony.apps.coe.ess.Sync.UI.stopSyncProgressBar();
  });
  // Stop login auto refresh
  try {
    kony.timer.cancel("loginAutoRefreshTimer");
  } catch (e) {
    kony.print("Error canceling login auto refresh timer: " + e);
  }
  options = {};
  options.slo = true;

  if (kony.apps.coe.ess.appconfig.useOkta === true && kony.apps.coe.ess.globalVariables.active_login_service !== undefined && kony.apps.coe.ess.globalVariables.active_login_service !== null && kony.apps.coe.ess.globalVariables.active_login_service !== "") {
    // Clear login variables
    kony.store.removeItem("username");
    kony.store.removeItem("password");
    kony.store.removeItem("rememberme");
    kony.store.removeItem("oktaToken");
    kony.sdk.util.deleteSSOToken();
    kony.net.clearCookies();
	frmLogin.lblApploadTime.setVisibility(true);
	frmLogin.lblwait.setVisibility(true);
    kony.application.showLoadingScreen("", kony.i18n.getLocalizedString(""), constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});

    // Function to logout of Okta identity services
    function destroyOktaSession(){
      // Destroy Okta session
      try {
        if (kony.apps.coe.ess.globalVariables.active_login_service == kony.apps.coe.ess.appconfig.identityServiceOktaRefresh) {
          var loginRefreshService = kony.sdk.getCurrentInstance().getIdentityService(kony.apps.coe.ess.appconfig.identityServiceOktaRefresh);
          loginRefreshService.logout(function() {
            kony.print("Logout of okta refresh completed");
          }, function(err) {
            kony.print("Error on logout of okta refresh service: " + JSON.stringify(err));
          }, {});
        }
        if (kony.apps.coe.ess.globalVariables.used_pre_login === true) {
          var loginService = kony.sdk.getCurrentInstance().getIdentityService(kony.apps.coe.ess.appconfig.identityServiceOkta);
          loginService.logout(function() {
            kony.print("Logout of okta login completed");
            kony.sdk.mvvm.KonyApplicationContext.logout(sucCallback, errCallback, options);
          }, function(err) {
            kony.print("Error on logout of okta login service: " + JSON.stringify(err));
            kony.sdk.mvvm.KonyApplicationContext.logout(sucCallback, errCallback, options);
          }, {"browserWidget": frmLogin.browserOkta});
        } else {
          kony.sdk.mvvm.KonyApplicationContext.logout(sucCallback, errCallback, options);
        }
      } catch (exception) {
        kony.sdk.mvvm.KonyApplicationContext.logout(sucCallback, errCallback, options);
      }
    };

    // Function to revoke okta token
    function revokeOktaToken(type, token, successCallback, errorCallback){
      var params = {
          "token": token,
          "token_type_hint": type
      };
      var oktaTokenService = kony.sdk.getCurrentInstance().getIntegrationService(kony.apps.coe.ess.appconfig.oktaTokenService);
      oktaTokenService.invokeOperation("logout", {}, params, successCallback, errorCallback);
    };

    // Get Okta tokens and then revoke them
    var loginService = kony.sdk.getCurrentInstance().getIdentityService(kony.apps.coe.ess.globalVariables.active_login_service);
    kony.apps.coe.ess.globalVariables.active_login_service = "";
    loginService.getSecurityAttributes(function(res){
      if(res !== null && res !== undefined && res.refresh_token !== null && res.refresh_token !== undefined && res.access_token !== null && res.access_token !== undefined) {
        // First revoke the refresh token and afterwards the access token - it doesn't matter if any of the operations fails
        revokeOktaToken("refresh_token", res.refresh_token, function(){
          revokeOktaToken("access_token", res.access_token, destroyOktaSession, destroyOktaSession);
        }, function(){
          revokeOktaToken("access_token", res.access_token, destroyOktaSession, destroyOktaSession);
        });
      } else {
        destroyOktaSession();
      }
    }, destroyOktaSession);
  } else {
    kony.sdk.mvvm.KonyApplicationContext.logout(sucCallback, errCallback, options);
  }

  function sucCallback() {
    frmLogin.lblApploadTime.setVisibility(false);
	frmLogin.lblwait.setVisibility(false);
    kony.application.dismissLoadingScreen();
    if(kony.application.getCurrentForm().id !== "frmLogin") {
      frmLogin.show();
    } else {
      frmLogin.forceLayout();
    }
    frmApprovalHome.destroy();
  }

  function errCallback(err) {
    frmLogin.lblApploadTime.setVisibility(false);
	frmLogin.lblwait.setVisibility(false);
    kony.application.dismissLoadingScreen();
    if(kony.application.getCurrentForm().id !== "frmLogin") {
      frmLogin.show();
    } else {
      frmLogin.forceLayout();
    }
    frmApprovalHome.destroy();
    kony.print(JSON.stringify(err));
  }
};

//In case of offline it retains previous configurations and navigates to home screen
function onThemeSettingSuccessCallback(successresp){
  //Navigating to frmApprovalHome on applying the dynamic skins.
  var navigateLandingPage = function() {
  	var formController = kony.sdk.mvvm.KonyApplicationContext.getAppInstance().getFormController("frmApprovalHome");
  	formController.loadDataAndShowForm();
  }
  kony.apps.coe.ess.globalVariables.updateEmployeeID(navigateLandingPage);
}

function onThemeSettingErrorCallback(errorresp){
  kony.print(errorresp);
}

kony.sdk.mvvm.Logout_DW=function()
{
  frmLoginDesk.flxErrorSpace.setVisibility(false);
  frmLoginDesk.forceLayout();
  frmLoginDesk.show();
  frmApprovalsDashboard.destroy();
  frmDelegationRequests.destroy();
  frmHamburgerDW.destroy();
  frmHistory.destroy();
  frmPendingRequest.destroy();
  frmTeamCalendar.destroy();

};


// Override of the OAuth handler
function OAuthHandler(serviceUrl, providerName, appkey, callback, type, options) {
  var logger = new konyLogger();
  var urlType = "/" + type + "/";
  var isSuccess = true;
  var isLogout = false;
  var slo;
  if (options && typeof(options["logout"]) == "boolean" && options["logout"]) {
    isLogout = true;
  }

  if (!kony.sdk.isNullOrUndefined(options) && (options["slo"] === true || options["slo"] === false)) {
    slo = options["slo"];
  }

  if (typeof(XMLHttpRequest) !== 'undefined') {
    var _window = window;
    var _popup = null;
    var _listener = function(event) {
      var _contents = event.data;
      _popup.close();
      _detachEvent();
      try {
        var headers = {};
        if (type == "oauth2" || type == "saml") {
          headers["Content-Type"] = "application/x-www-form-urlencoded"
        }
        callback(urlType + "token", {
          code: _contents
        }, headers);
      } catch (err) {
        logger.log("exception ::" + err);
        failureCallback();
      }
    };
    var _attachEvent = function() {
      if (_window.addEventListener) {
        _window.addEventListener('message', _listener, false);
      } else if (_window.attachEvent) {
        _window.attachEvent('message', _listener);
      } else {
        throw new Exception(Errors.INIT_FAILURE, "environment doesn't support event attaching");
      }
    };

    var _detachEvent = function() {
      if (_window.detachEvent) {
        _window.detachEvent('message', _listener);
      } else if (_window.removeEventListener) {
        _window.removeEventListener('message', _listener);
      } else {
        throw new Exception(Errors.INIT_FAILURE, "environment doesn't support detaching an event");
      }
    };
    _attachEvent();
    if (isLogout) {
      _popup = _window.open(serviceUrl + urlType + "logout?provider=" + providerName + "&appkey=" + appkey + "&slo=" + slo);
    } else {
      _popup = _window.open(serviceUrl + urlType + "login?provider=" + providerName + "&appkey=" + appkey);
    }
  } else {
    var browserSF;
    var userDefined = false;
    if (options && options["browserWidget"] && kony.type(options["browserWidget"]) === "kony.ui.Browser") {
      browserSF = options["browserWidget"];
      userDefined = true;
    } else {
      var formBasic = {
        id: "popUp",
        skin: null,
        isModal: false,
        transparencyBehindThePopup: 80,
        "needAppMenu": false
      };
      var formLayout = {
        containerWeight: 100,
        padding: [5, 5, 5, 5],
        "paddingInPixel": true
      };
      var formPSP = {
        "titleBar": true,
        "titleBarConfig": {
          "renderTitleText": true,
          "prevFormTitle": false,
          "titleBarLeftSideView": "button",
          "labelLeftSideView": "Back",
          "titleBarRightSideView": "none"
        },
        "titleBarSkin": "slTitleBar"
      };
      //to do.. this is a workaround for android browser issue.. need to refactor this code
      browserSF = new kony.ui.Browser({
        "id": "browserSF",
        "text": "Browser",
        "isVisible": true,
        "detectTelNumber": true,
        "screenLevelWidget": true,
        "enableZoom": false
      }, {
        "margin": [0, 0, 0, 0],
        "marginInPixel": true,
        "paddingInPixel": true,
        "containerWeight": 100
      }, {});

      var prevForm = kony.application.getCurrentForm();
      var oauthForm = new kony.ui.Form2(formBasic, formLayout, formPSP);
      oauthForm.add(browserSF);
      oauthForm.show();
    }
    var urlConf;
    var headersConf = {};
    if (!kony.sdk.isNullOrUndefined(konyRef.currentClaimToken)) {
      headersConf[Constants.APP_AUTHORIZATION_HEADER] = konyRef.currentClaimToken;
    }
    konyRef.appendGlobalHeaders(headersConf);
    if (isLogout) {
      browserSF.onSuccess = handleOAuthLogoutSuccessCallback;
      browserSF.onFailure = handleOAuthLogoutFailureCallback;
      urlConf = {
        URL: serviceUrl + urlType + "logout?provider=" + providerName + "&appkey=" + appkey + "&slo=" + slo,
        requestMethod: constants.BROWSER_REQUEST_METHOD_GET
      };
      if (Object.keys(headersConf).length > 0) {
        urlConf["headers"] = headersConf;
      }
      browserSF.requestURLConfig = urlConf;

      try {
        kony.timer.cancel("oauth2callbacklogouttimer");
      } catch (e) {
        kony.print("Error canceling oautch2callbacklogouttimer: " + e);
      }
      try {
        kony.timer.schedule("oauth2callbacklogouttimer", function() {
          return function() {
            callback(isSuccess);
          }
        }(), kony.apps.coe.ess.globalVariables.logoutDelay, false);
      } catch (e) {
        kony.print("Error starting oauth2callbacklogouttimer: " + e);
      }

    } else {
      //#ifdef android
      browserSF.onPageStarted = handleRequestCallback;
      //#else
      browserSF.handleRequest = handleRequestCallback;
      //#endif
      urlConf = {
        URL: serviceUrl + urlType + "login?provider=" + providerName + "&appkey=" + appkey,
        requestMethod: constants.BROWSER_REQUEST_METHOD_GET
      };
      if (Object.keys(headersConf).length > 0) {
        urlConf["headers"] = headersConf;
      }
      browserSF.requestURLConfig = urlConf;
    }

    function handleOAuthLogoutSuccessCallback() {
      if (!userDefined) {
        var prevFormPostShow = prevForm.postShow;

        function postShowOverride() {
          oauthForm.destroy();
          if (prevFormPostShow) {
            prevFormPostShow();
          }
          prevForm.postShow = prevFormPostShow;
        }

        prevForm.postShow = postShowOverride;
        prevForm.show();
      }
    }

    function handleOAuthLogoutFailureCallback() {
      isSuccess = false;
    }

    function displayPrevForm() {
      var prevFormPostShow = prevForm.postShow;

      function postShowOverride() {
        oauthForm.destroy();
        if (prevFormPostShow) {
          prevFormPostShow();
        }
        prevForm.postShow = prevFormPostShow;
      }
      prevForm.postShow = postShowOverride;
      prevForm.show();
    }

    function handleRequestCallback(browserWidget, params) {

      var originalUrl = params["originalURL"];
      if (typeof(params.queryParams) !== "undefined" && typeof(params.queryParams.code) !== "undefined") {
        if (!userDefined) {
          displayPrevForm();
        }
        var headers = {};
        if (type == "oauth2" || type == "saml") {
          headers["Content-Type"] = "application/x-www-form-urlencoded"
        }
        // make request for tokens
        try {
          kony.timer.cancel("oauth2callbacktimer");
        } catch (e) {
          kony.print("Error canceling oautch2callbacktimer: " + e);
        }
        try {
          kony.timer.schedule("oauth2callbacktimer", function(url, callback, code, headers) {
            return function() {
              callback(url, {
                code: code
              }, headers);
            }
          }(urlType + "token", callback, decodeURIComponent(params.queryParams.code), headers), 1, false);
        } catch (e) {
          kony.print("Error starting oauth2callbacktimer: " + e);
        }
      } else if (typeof(params.queryParams) !== "undefined" && typeof(params.queryParams.error) !== "undefined") {
        if (!userDefined) {
          displayPrevForm();
        }
        callback(urlType + "token", {
          "error": params.queryParams.error
        }, headers, true);
      }
      return false;
    }
  }

}
