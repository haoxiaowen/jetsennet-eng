/**
 *  资源管
 *  @author zw 2016-4-28
 */

jetsennet.require([ "pageframe", "pagebar", "gridlist","window","timeeditor","menu","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var gResId;

//资源列表
var gResColumns = [{ fieldName: "TASK_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes"},
                    { fieldName: "TASK_CODE", sortField: "TASK_CODE", width: "auto", align: "center", name: "任务代码"},
                    { fieldName: "TASK_NAME", sortField: "TASK_NAME", width: "auto", align: "center", name: "任务名称"},
                    { fieldName: "TASK_STATUS", sortField: "TASK_STATUS", width: "auto", align: "center", name: "任务状态"},
                    { fieldName: "TASK_TYPE", sortField: "TASK_TYPE", width: "auto", align: "center", name: "任务类型"},
                    { fieldName: "TASK_TEMPLATE", sortField: "TASK_TEMPLATE", width: "auto", align: "center", name: "任务模板"},
                    { fieldName: "TASK_DESC", sortField: "TASK_DESC", width: "auto", align:"center", name: "任务描述"},
                    { fieldName: "TASK_START_TIME", sortField: "TASK_START_TIME", width: "auto", align:"center", name: "开始时间"},	
                    { fieldName: "TASK_END_TIME", sortField: "TASK_END_TIME", width: "auto", align: "left", name: "结束时间"},
                    
                    { fieldName: "TASK_AVG_SPEED", sortField: "TASK_AVG_SPEED", width: "auto", align: "center", name: "平均速度"},
                    { fieldName: "TASK_TOTAL_SIZE", sortField: "TASK_TOTAL_SIZE", width: "auto", align: "center", name: "任务总大小"},
                    { fieldName: "TASK_DURATION", sortField: "TASK_DURATION", width: "auto", align:"center", name: "任务时长"},
                    { fieldName: "TASK_SOURCE_SYS", sortField: "TASK_SOURCE_SYS", width: "auto", align:"center", name: "源系统"},	
                    { fieldName: "TASK_CREATE_USER", sortField: "TASK_CREATE_USER", width: "auto", align: "left", name: "创建者"},
                    { fieldName: "TASK_CREATE_TIME", sortField: "TASK_CREATE_TIME", width: "auto", align: "center", name: "创建时间"},
            ];

var gCrud = $.extend(new jetsennet.Crud("divResList", gResColumns, "divResPage", "order by t.TASK_CODE"), {
    dao : SYSDAO,
    tableName : "PPN_TU_TASK",
    name : "传输任务",
    className : "jetsennet.jue2.trm.bean.PpnTuTask",
    cfgId : "divRes",
    checkId : "chkRes",
    keyId : "t.TASK_ID",
   // resultFields : "t.*, get_control_word_name('PPN_RM2_RESOURCE','RES_STATUS',t.RES_STATUS) RES_STATUS_TXT",
    
});

var gResGrid = gCrud.grid;
gResGrid.onrowclick = resOnRowClick;


/**
 * 页面初始化
 */
function pageInit() {
//	Layoutit("#divPageFrame", {hLayout: [{vLayout: [46,"auto",40], value:"70%"}, { vLayout: [46,"auto"]}]}); 	 
	jQuery("#divPageFrame").pageFrame({ showSplit: true, layout:   
	    [{ splitType: 1,layout: [46, "auto", 40], size:{width:"65%",height:0}},  {splitType:1, layout: [46,"auto"]}] }).sizeBind(window);  
	
	$('#log_time').daterangepicker(jQuery.extend({ opens : "right"}, dataPickerOptions));
    gCrud.load();
 };

/**
 * 查询使用单元
 */
 function searchConfirm() {
		var conditions = [];
	       if ($('#log_time').val()) {
	        conditions.push([ "t.TASK_CREATE_TIME", $('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
	        conditions.push([ "t.TASK_CREATE_TIME", $('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD 23:59:59'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
	    }
	       gCrud.search(conditions);
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
        '昨天' : [ moment().subtract('days', 1), moment().subtract('days', 1) ], 
        '最近一周' : [ moment().subtract('days', 6), moment() ], 
        '最近一月' : [ moment().subtract('days', 29), moment() ],
        '本月' : [ moment().startOf('month'), moment().endOf('month') ], 
        '上月' : [ moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month') ] 
      }, 
      format: 'YYYY-MM-DD', //
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
		format : 'YYYY-MM-DD ',
		showDropdowns : true,  
        timePicker : true, 
        timePickerIncrement : 01,
        timePicker12Hour : false	
};



/**
 *  资源行单击事件
 * @param item
 * @param td
 */
function resOnRowClick(item, td) {
	gResId = item.TASK_ID;
	loadResType();
}

/****************************************************************   资源类型  *********************************************************************************************/

//资源类型
var gR2tColumns = [/*{ fieldName: "FILE_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes2Price"},*/
                 { fieldName: "TASK_ID", sortField: "TASK_ID", width: "auto", align: "center", name: "任务ID"},
                 { fieldName: "FILE_CODE", sortField: "FILE_CODE", width: "auto",align: "center", name: "文件编码"},
                 { fieldName: "FILE_NAME", sortField: "FILE_NAME", width: "auto", align: "center", name: "文件名"},
                 { fieldName: "FILE_STATUS", sortField: "FILE_STATUS", width: "auto",align: "center", name: "任务状态"},
                 { fieldName: "FILE_IS_DIR", sortField: "FILE_IS_DIR", width: "auto", align: "center", name: "是否目录"},
                 { fieldName: "FILE_LOC_HOST", sortField: "FILE_LOC_HOST", width: "auto",align: "center", name: "所在宿主"},
                 
                 
                 { fieldName: "FILE_LOC_PATH", sortField: "FILE_LOC_PATH", width: "auto",align: "center", name: "所在路径"},
                 { fieldName: "FILE_SIZE", sortField: "FILE_SIZE", width: "auto", align: "center", name: "大小"},
                 { fieldName: "FILE_MD5", sortField: "FILE_MD5", width: "auto",align: "center", name: "MD5串"},
                 
                 ];

var gR2tCrud = $.extend(new jetsennet.Crud("divRes2TypeList", gR2tColumns), {
  dao : SYSDAO,
  tableName : "PPN_TU_FILE",
  name : "传输文件信息",
  className : "jetsennet.jue2.beans.PpnTuFile",
  cfgId : "divRes2Price",
  checkId : "chkRes2Price",
  keyId : "t.FILE_ID",
  resultFields : "*",
  joinTables : [["PPN_TU_TASK", "p", "p.TASK_ID=t.TASK_ID", jetsennet.TableJoinType.Left]],
 
});

/**
 *  加载资源定价
 */
function loadResType() {
	var conditions = [];
	conditions.push([ "t.TASK_ID", gResId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
	gR2tCrud.search(conditions);
}


/*
* 导出成Excel
*/
function exportExcel() {
   if(gCrud.pageBar && gCrud.pageBar.rowCount==0) {
       jetsennet.message("当前条件下，暂无数据需要导出!");
   } else {
	   gCrud.exportData(true);
   }
};



function selectTj(){
	stateTime=$('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD');
	endTime=$('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD');
		var gDialog;
		var url = "../../jdlm/rent/ppnTuTaskPie.htm";
		if($('#log_time').val()){
			url += "?gStartTime="+stateTime+"&gEndTime="+endTime;
		}
		el("iframePopWin").src = url;
		gDialog = new jetsennet.ui.Window("show-divPopWin");
		jQuery.extend(gDialog, {
			size : {
				width : 1200,
				height : 680
			},
			title : '统计详情',
			enableMove : false,
			showScroll : false,
			cancelBox : false,
			maximizeBox : false,
			minimizeBox : false
		});
		gDialog.controls = [ "divPopWin" ];
		gDialog.show();
}


