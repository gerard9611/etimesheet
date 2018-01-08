function AS_Btn_onclickActiverequestEmployeeinLaterTab(eventobject) {
    return AS_Button_a70eded5aadc43ae96ff5039413422c7(eventobject);
}

function AS_Button_a70eded5aadc43ae96ff5039413422c7(eventobject) {
    var searchText = frmApprovalHome.tbxLaterFilter.text;
    kony.apps.coe.ess.Approvals.DynamicSegmentSetDatabyEmployeeSearch(searchText, kony.apps.coe.ess.globalVariables.FrmApprovalsPeopleSearch);
    kony.apps.coe.ess.Approvals.ApprovalsHome.showEmployeeFilter();
}