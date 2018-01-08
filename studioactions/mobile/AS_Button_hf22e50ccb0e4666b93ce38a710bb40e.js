function AS_Button_hf22e50ccb0e4666b93ce38a710bb40e(eventobject) {
    frmApprovalHome.tbxLaterFilter.text = "";
    frmApprovalHome.flxNoPending.setVisibility(false);
    kony.apps.coe.ess.Approvals.ApprovalsHome.sliderAnimationToLater();
    frmApprovalHome.flxSPAFilter.isVisible = false;
    frmApprovalHome.flxFooterOptions.isVisible = false;
}