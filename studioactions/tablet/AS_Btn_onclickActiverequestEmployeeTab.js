function AS_Btn_onclickActiverequestEmployeeTab(eventobject) {
    return AS_Button_a1073f1e2e9a4f62bc84fb3908f5c53b(eventobject);
}

function AS_Button_a1073f1e2e9a4f62bc84fb3908f5c53b(eventobject) {
    var searchText = frmApprovalHome.tbxSearch.text;
    kony.apps.coe.ess.Approvals.DynamicSegmentSetDatabyEmployeeSearch(searchText, kony.apps.coe.ess.globalVariables.FrmApprovalsPeopleSearch);
    kony.apps.coe.ess.Approvals.ApprovalsHome.showEmployeeFilter();
}