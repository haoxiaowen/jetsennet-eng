/** 
 * 资源确认
 */
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);
var startTime = 0;
var endTime = 0;

/**
 * 排班列表
 */
var gConfirmColumns = [	{ fieldName: "ASSIGN_ID", width: 0, align: "center", isCheck: false, checkName: "chkConfirm"},
                       	{ fieldName: "COLNAME",  sortField: "PCC.COL_NAME", align: "center", name: "所属栏目"},
                       	{ fieldName: "ASSIGN_CODE",  sortField: "PRA.ASSIGN_CODE", align: "center", name: "申请条目代码"},
						{ fieldName: "ASSIGN_PLAN_START_TIME",  sortField: "ASSIGN_PLAN_END_TIME", align: "center", name: "计划开始时间"},
						{ fieldName: "ASSIGN_PLAN_END_TIME",  sortField: "ASSIGN_PLAN_END_TIME", align: "center", name: "计划结束时间"},
						/*{ fieldName: "ASSIGN_RES_NUM", width: 90, sortField: "ASSIGN_RES_NUM", align: "center", name: "主资源数量"},
						{ fieldName: "ASSIGN_RES_UOM_CODE", width: 110, sortField: "ASSIGN_RES_UOM_CODE", align: "center", name: "主资源单元代码"},*/
						{ fieldName: "ASSIGN_RES_UOM_NAME",  sortField: "ASSIGN_RES_UOM_NAME", align: "center", name: "主资源单元名称"},
						{ fieldName: "ASSIGN_PLAN_RES_CODE",  sortField: "ASSIGN_PLAN_RES_CODE", align: "center", name: "资源代码"},
						{ fieldName: "RESNAME", sortField: "RESNAME", align: "center", name: "工作站名称"},
						{ fieldName: "STATUS",  sortField: "ASSIGN_STATUS", align: "center", name: "资源状态"},
						{ fieldName: "ASSIGN_PART_CODE", sortField: "ASSIGN_PART_CODE", align: "center", name: "资源方案编码"}
						/*{ fieldName: "ASSIGN_PROD_TASK_CODE", sortField: "ASSIGN_PROD_TASK_CODE", align: "center", name: "生成任务代码"},*/
                       ];

var gConfirmCrud = $.extend(new jetsennet.Crud("ResConfirmList", gConfirmColumns, "ResConfirmPageBar", "order by PRA.ASSIGN_PLAN_RES_CODE"), {
	dao : UUMDAO,
    tableName : "PPN_RES_ASSIGNMENT",
    tabAliasName : 'PRA',
    joinTables: [[ "PPN_TASK_RES_ASSIGN", "PTRA", "PRA.ASSIGN_ID = PTRA.ASSIGN_ID", jetsennet.TableJoinType.Left ],
                 [ "PPN_TASK", "PT", "PT.TASK_ID = PTRA.TASK_ID", jetsennet.TableJoinType.Left ],
                 [ "PPN_PGM_PROGRAM", "PPR", "PT.PGM_ID = PPR.PGM_ID", jetsennet.TableJoinType.Left ],
                 [ "PPN_RM2_RESOURCE", "PRR", " PRA.ASSIGN_PLAN_RES_CODE = PRR.RES_CODE", jetsennet.TableJoinType.Left],
                 [ "PPN_CDM_COLUMN", "PCC", "PPR.PGM_OWNERSHIP_COLUMN = PCC.COL_CODE", jetsennet.TableJoinType.Left ]],
    resultFields : "DISTINCT PRA.*,get_control_word_name('PPN_RES_ASSIGNMENT','ASSIGN_STATUS',PRA.ASSIGN_STATUS) STATUS,PCC.COL_NAME AS COLNAME, PRR.RES_NAME AS RESNAME",//,PPR.PGM_NAME AS PGMNAME
    name : "资源确认",
    checkId : "chkConfirm",
    keyId : "PRA.ASSIGN_ID"
});
gConfirmCrud.grid.onrowclick = schOnRowclick;
gConfirmCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() { 
	gConfirmCrud.load();
    $('#log_time').daterangepicker(jQuery.extend({ opens : "right"}, dataPickerOptions));
}



/**
 * 查询确认单
 */
function searchConfirm() {
	var conditions = [];
    if ($('#log_time').val()) {
        conditions.push([ "PRA.ASSIGN_PLAN_START_TIME", $('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD HH:mm:ss'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
        conditions.push([ "PRA.ASSIGN_PLAN_END_TIME", $('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD HH:mm:ss'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
        startTime = $('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD HH:mm:ss');
        endTime = $('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD HH:mm:ss');
    }
    if($('#log_contain').val()){
    	conditions.push([ "PRA.ASSIGN_PLAN_RES_CODE", $('#log_contain').val(), jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    	conditions.push([ "PRR.RES_NAME", $('#log_contain').val(), jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gConfirmCrud.search(conditions);
}

var checkId;
var Assignment = new Object();
function schOnRowclick(item, td){
	checkId = item.ASSIGN_ID;
	Assignment.assign_id = item.ASSIGN_ID;
	Assignment.start_time = item.ASSIGN_PLAN_START_TIME;
	Assignment.end_time = item.ASSIGN_PLAN_END_TIME;
	Assignment.cfm_id = item.CFM_ID;
	Assignment.cfm_status = item.CFM_STATUS;
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


/**
 * 导出成Excel
 */
function exportExcel() {
    if(gConfirmCrud.pageBar && gConfirmCrud.pageBar.rowCount==0) {
        jetsennet.message("当前条件下，暂无数据需要导出!");
    } else {
    	gConfirmCrud.exportData(true);
    }
};


/**
 * 查看统计信息
 */



/*Layoutit("#divChart", {hLayout:[{vLayout:["auto"]}]});

var gChartColumns = [{ fieldName: "COLNAME",sortField: "COLNAME", align: "center", name: "栏目名称"},
                     { fieldName: "ASSIGN_PLAN_RES_CODE", sortField: "ASSIGN_PLAN_RES_CODE", align: "center", name: "资源代码"},
                     { fieldName: "COUNTNUM", width: 100,sortField: "COUNTNUM", align: "center", name: "使用单元数量"}];
var gChartCrud = $.createGridlist ("divChartList", gChartColumns, null, null);
function searchChart(){
	var searchTime = startTime +"&"+endTime;
	var params = new HashMap();
	params.put("controlNumber", "CTL20161222201100000");
    params.put("jsonString", searchTime);
    PPNDAO.execute("ppnExecuteBusiness", params, 
    		{success : function(resultVal) {
    			jQuery('#divChartList').html("");
    			gChartCrud.dataSource = resultVal;	
    			gChartCrud.render("divChartList");
    		 },
    		 error : function(ex){
    			 jetsennet.error(ex);
    		 },
    		 wsMode:"WEBSERVICE"
    });
    var areaElements = jetsennet.form.getElements('divChart');
	jetsennet.form.resetValue(areaElements);
	jetsennet.form.clearValidateState(areaElements);
	var dialog = jQuery.extend(new jetsennet.ui.Window("new-assignMent"),{title:"资源统计信息",submitBox:true,cancelBox:false,size:{width:540,height:450},maximizeBox:false,minimizeBox:false});    
    dialog.controls = ["divChart"];
    dialog.showDialog();
}*/

function searchChartPie() {
	el("iframeChartPie").src ="chartPie.htm" ;
    var dialog = jQuery.extend(new jetsennet.ui.Window("chartPie"),{title:"资源使用统计",submitBox:true,cancelBox:false,size:{width:1200,height:580},maximizeBox:false,minimizeBox:false,showScroll : false});    
    dialog.controls =["divChartPie"];
    var searchTime = startTime +"&"+endTime;
	var params = new HashMap();
	params.put("controlNumber", "CTL20161222201100000");
    params.put("jsonString", searchTime);
    PPNDAO.execute("ppnExecuteBusiness", params, 
    		{success : function(resultVal) {
    			//console.log(resultVal);
    		 },
    		 error : function(ex){
    			 jetsennet.error(ex);
    		 },
    		 wsMode:"WEBSERVICE"
    });
    dialog.showDialog();
}


function showIframDialog(url,title, controlId, options){
	el("iframeChartPie").src = url;
	var dialog = new jetsennet.ui.Window(title);
	jQuery.extend(dialog, {
		title : title,
		size : {
			width : 1200,
			height : 580
		},
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		submitBox:true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ controlId ],
	}, options);
	dialog.showDialog();
}



function showPieData(){
	var colomData = 0;
	var assignData = 0;
	var searchTime = startTime +"&"+endTime;
	var params = new HashMap();
	params.put("controlNumber", "CTL20161222201100000");
    params.put("jsonString", searchTime);
    PPNDAO.execute("ppnExecuteBusiness", params, 
    		{success : function(resultVal) {
    			if(resultVal){
    				var data = resultVal.split("&");
        			colomData = data[0];
        			assignData = data[1];
    			}
    		 },
    		 error : function(ex){
    			 jetsennet.error(ex);
    		 },
    		 wsMode:"WEBSERVICE"
    });
    var showDiv = el("iframeChartPie");
	var url ="../../jue2/trm/chartPie.htm?colomData="+colomData+"&assignData="+assignData;
	showIframDialog(showDiv,url,'事件统计','divChartPie',{size:{ width : 1200,height : 580}});
}


function showLineData(){
	var url ="../../jue2/trm/chartLine.htm";
	var showDiv = el("iframeChartLine");
	showIframDialog(showDiv,url,'折线统计','divChartLine',{size:{ width : 1200,height : 600}});
}


function showIframDialog(showDiv,url,title, controlId, options){
	showDiv.src = url;
	var dialog = new jetsennet.ui.Window(title);
	jQuery.extend(dialog, {
		title : title,
		size : {
			width : 1200,
			height : 580
		},
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		submitBox:true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ controlId ],
	}, options);
	dialog.showDialog();
}
