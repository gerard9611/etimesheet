function AS_FlexContainer_6538a8daf09746f083150d923e3aa7e7(eventobject) {
    try {
        frmApprovalHome.flxNoPending.setVisibility(false);
        kony.apps.coe.ess.Approvals.ApprovalsHome.onclickFilterIcon();
    } catch (e) {
        handleError(new appException(kony.i18n.getLocalizedString("i18n.ess.frmApprovalHome.errorMessages.FilterSearch")));
    }
}