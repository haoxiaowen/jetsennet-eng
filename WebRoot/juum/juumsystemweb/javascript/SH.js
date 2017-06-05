
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);
/**
显示审核列表
*/

var gPgmRsColumns = [{ fieldName: "CHECK_ID", width: 30, align: "center", isCheck: 1, checkName: "chkPgmRs"},
                    { fieldName: "CHECK_TYPE", sortField: "CHECK_TYPE", align: "center", name: "审核类型"},
                    { fieldName: "CHECK_USER ", sortField: "CHECK_USER",  align: "center", name: "审核人员"},
                    { fieldName: "CHECK_STATUS ", sortField: "CHECK_STATUS",  align: "center", name: "审核状态"},
                    { fieldName: "CHECK_RESULT ", sortField: "CHECK_RESULT",  align: "center", name: "审核结果"},
                    { fieldName: "CHECK_LEVEL_INDEX ", sortField: "CHECK_LEVEL_INDEX",  align: "center", name: "审核级别序号"},
                    { fieldName: "CHECK_LEVEL_NAME ", sortField: "CHECK_LEVEL_NAME",  align: "center", name: "审核级别名称"},
                    { fieldName: "CHECK_LEVEL_CODE ", sortField: "CHECK_LEVEL_CODE",  align: "center", name: "审核级别代码"},
                    { fieldName: "CHECK_IS_FINAL ", sortField: "CHECK_IS_FINAL",  align: "center", name: "是否审核"},
                    { fieldName: "CHECK_TIME ", sortField: "CHECK_TIME",  align: "center", name: "审核时间"}
                    ];
var gPgmRsCrud = $.extend(new jetsennet.Crud("ResConfirmList", gPgmRsColumns, "ResConfirmPageBar", "order by CHECK_ID"), {
    dao : UUMDAO,
    tableName : "PPN_RENT_CHECK",
    name : "审核",
    checkId : "chkPgmRs",
    keyId : "t.CHECK_ID"
});
gPgmRsCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() { 
    gPgmRsCrud.load();
}