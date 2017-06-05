/**
 *  资源管理前台逻辑
 *  @author zw 2016-4-28
 */
jetsennet.require([ "pageframe", "pagebar", "gridlist","window","timeeditor","menu","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");

//临时数据，上周下周时用
var gTmpYear = 2016;
var gTmpMonth = 4;
var gTmpDay = 29;
/****************************************************************   资源类型  *********************************************************************************************/

//资源类型
var gR2tColumns = [//{ fieldName: "OUT_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes2Price"},
                   { fieldName: "RETU_ID", sortField: "RETU_ID", width: 180, align: "center", name: "入库单ID"},
                 { fieldName: "RETU_CODE", sortField: "RETU_CODE", width: 180, align: "center", name: "入库单号"},
                 { fieldName: "RETU_NAME", sortField: "RETU_NAME", align: "center", name: "入库单名称"},
                 //{ fieldName: "OUT_TYPE", sortField: "ITEM_CODE", width: 180, align: "center", name: "出库项代码"},
                // { fieldName: "ITEM_STATUS", sortField: "ITEM_STATUS", width: 180, align: "center", name: "出库项状态"},
                 { fieldName: "RETU_TYPE", sortField: "RETU_TYPE", width: 60, align: "center", name: "入库单类型"},
                 { fieldName: "RETU_STATUS", sortField: "RETU_STATUS", width: 100, align: "center", name: "入库单状态"},
                 { fieldName: "RETU_USER", sortField: "RETU_USER", width: 180, align: "center", name: "入库管理员"},
                 { fieldName: "RETU_MANAGE_USER", sortField: "RETU_MANAGE_USER", width: 150, align:"center", name: "入库人员"},
                /* { fieldName: "OUT_START_TIME", sortField: "ITEM_OBJ_UOM_SUM", width: 150, align:"center", name: "单元数量"},
                 
                 { fieldName: "OUT_END_TIME", sortField: "ITEM_OBJ_PRICE", width: 180, align: "center", name: "对象单价"},*/
                 { fieldName: "RETU_COLUMN_CODE", sortField: "RETU_COLUMN_CODE", width: 150, align:"center", name: "入库栏目"},
                 { fieldName: "RETU_DEPT_CODE", sortField: "RETU_DEPT_CODE", width: 150, align:"center", name: "入库部门"},	
                 
                 { fieldName: "RETU_TIME", sortField: "RETU_TIME", width: 180, align: "center", name: "入库时间"},
                 { fieldName: "RETU_CHECK_USER", sortField: "RETU_CHECK_USER", width: 150, align:"center", name: "复核人员"},
                 { fieldName: "RETU_CHECK_DESC", sortField: "RETU_CHECK_DESC", width: 150, align:"center", name: "复核意见"},
                 
                 
                 { fieldName: "RETU_CHECK_TIME", sortField: "RETU_CHECK_TIME", width: 180, align: "center", name: "复核时间"},
                
                 { fieldName: "RETU_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                     return jetsennet.Crud.getEditCell("gR2tCrud.edit('" + val + "')");
                 }},
                 { fieldName: "RETU_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                     return jetsennet.Crud.getDeleteCell("gR2tCrud.remove('" + val + "')");
                 }}];

var gR2tCrud = $.extend(new jetsennet.Crud("divContent", gR2tColumns,"divPage"), {
  dao : SYSDAO,
  tableName : "PPN_RENT_RETURN",
  tabAliasName:"t",
  name : "资源类型",
  className : "jetsennet.jdlm.beans.PpnRentReturn",
  keyId : "t.RETU_ID",
 
});

function pageInit() {
	var conditions = [];
	gR2tCrud.search(conditions);
	$('#log_time').daterangepicker(jQuery.extend({ opens : "right"}, dataPickerOptions));
};

function searchConfirm() {
	var conditions = [];
       if ($('#log_time').val()) {
        conditions.push([ "t.RETU_TIME", $('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
   
       gR2tCrud.search(conditions);
}

/**
 * 清除时间
 */
function clearTime(){
	$('#log_time').val('');
}

//日期范围选取框通用配置
var dataPickerOptions = { 
      ranges : { 
        '今天' : [ moment(), moment()], 
        '昨天' : [ moment().subtract('days', 1), moment().subtract('days', 0) ], 
        '最近一周' : [ moment().subtract('days', 6), moment() ], 
        '最近一月' : [ moment().subtract('days', 29), moment() ],
        '本月' : [ moment().startOf('month'), moment().endOf('month') ], 
        '上月' : [ moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month') ] 
      }, 
      format: 'YYYY-MM-DD HH:mm:ss', //
      startDate: new Date(), 
      showDropdowns: true, 
      separator:' --- ', 
      locale: { 
        applyLabel: '确定',
        cancelLabel: '取消', 
        fromLabel: '开始时间', 
        toLabel: '结束时间', 
        customRangeLabel: '其他', 
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'], 
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], 
        firstDay: 0 
      } ,
      timePicker : true,
      timePickerIncrement : 01, 
      timePicker12Hour : false,
};

var dateSelectPickerOptions = {
		startDate : moment().startOf('hours'),
		singleDatePicker : true,
		format : 'YYYY-MM-DD HH:mm:ss',
		showDropdowns : true,  
        timePicker : true, 
        timePickerIncrement : 01,
        timePicker12Hour : false	
};


/*
* 导出成Excel
*/
function exportExcel() {
   if(gConfirmCrud.pageBar && gConfirmCrud.pageBar.rowCount==0) {
       jetsennet.message("当前条件下，暂无数据需要导出!");
   } else {
	   gR2tCrud.exportData(true);
   }
};




