/**
 *  成品入出岛
 *  @author yyf 2016-12-20
 */

jetsennet.require([ "gridlist",  "window", "pagebar","datepicker", "bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker","pageframe", "crud"]); 
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var gResId;

//列表
var gReturnColumns = [{ fieldName: "TASK_ID", width: 30, align: "center", isCheck: 1, checkName: "chkTsbTask"},
                      { fieldName: "PGM_NAME", sortField: "PGM_NAME", width: 280,title:true, align: "center", name: "节目名称"},
                      { fieldName: "PGM_DURATION", sortField: "PGM_DURATION", title:true, align: "center", name: "节目时长"},
                      { fieldName: "TASK_NAME", sortField: "TASK_NAME",  title:true,align: "center", name: "任务名称"},
                      { fieldName: "TRANS_TYPE", sortField: "TRANS_TYPE",  title:true,align: "center", name: "类型",format	:function(val,vals){
                     	 if(val==3){
                    		 return "出岛";
                    	 }else  if(val==4){
                    		 return "接收";
                    	 }
                    	 else  if(val==5){
                    		 return "入媒资";
                    	 }
                    	 else  if(val==6){
                    		 return "直送";
                    	 }
                      }},
                      { fieldName: "BWORD_NAME_SRC", sortField: "BWORD_NAME_SRC",  title:true,align: "center", name: "源系统"},
                      { fieldName: "BWORD_NAME", sortField: "BWORD_NAME",  title:true,align: "center", name: "目标系统"},
                      { fieldName: "MATERIAL_NAME", sortField: "MATERIAL_NAME",width: 280,  title:true,align: "center", name: "文件名"},
                      { fieldName: "SEGMENT_INDEX", sortField: "SEGMENT_INDEX",  title:true,align:"center", name: "分段号"},
                      { fieldName: "TASK_CREATE_TIME", sortField: "TASK_CREATE_TIME",title:true, align:"center", name: "时间"},	
                    ];
var jointables =  [["ppn_pgm_program", "p", "p.pgm_id=t.pgm_id ", jetsennet.TableJoinType.Inner],["PPN_BUSINESSWORD", "busi", "busi.BWORD_DATA=t.TARGET_SYSCODE ", jetsennet.TableJoinType.Inner],["PPN_BUSINESSWORD", "busis", "busis.BWORD_DATA=t.SRC_SYSCODE ", jetsennet.TableJoinType.Inner]];
var resultFields = "t.*,p.PGM_NAME,p.PGM_DURATION,busi.BWORD_NAME,busis.BWORD_NAME BWORD_NAME_SRC";
var gCrud = $.extend(new jetsennet.Crud("divResList", gReturnColumns, null, "order by t.TASK_CREATE_TIME desc"), {
    dao : SYSDAO,
    tableName : "PPN_TSB_TASK",
    name : "推送成品",
    joinTables : jointables,
    resultFields :resultFields,  
    cfgId : "divRes",
    checkId : "chkTsbTask",
    keyId : "t.TASK_ID"
});

var gResGrid = gCrud.grid;
gResGrid.onrowclick = null;
gResGrid.ondoubleclick=null ;


/**
 * 页面初始化
 */
function pageInit() {
//	Layoutit("#divPageFrame", {hLayout: [{vLayout: [46,"auto",40], value:"70%"}, { vLayout: [46,"auto"]}]}); 	 
	var layout = { splitType: 1,layout: [46, "auto", 40]};
	jQuery("#divPageFrame").pageFrame(layout).sizeBind(window);  
	
//    gCrud.load();
	$('#priod_time').daterangepicker(jQuery.extend({ opens : "right"}, dataPickerOptions));
    searchPush();
    //初始化下拉框
};



/**
 * 查询
 */
function searchPush() {
	var subConditions = [];
	var value = jetsennet.util.trim(el('txt_RES_NAME').value);
    if (value) {
        subConditions.push([ [ "p.PGM_CODE", el('txt_RES_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ], 
                             [ "p.PGM_NAME", el('txt_RES_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ] ]);
    }
    var conditions = [];
    /*if($('#priod_time').val()){
    	conditions.push([ "t.TASK_CREATE_TIME", $('#priod_time').data('daterangepicker').startDate.format('YYYY-MM-DD'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    	conditions.push([ "t.TASK_CREATE_TIME", $('#priod_time').data('daterangepicker').endDate.format('YYYY-MM-DD'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }*/
    if(el('txtStartTime').value){
    	conditions.push([ "t.TASK_CREATE_TIME", el('txtStartTime').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(el('txtEndtTime').value){
    	conditions.push([ "t.TASK_CREATE_TIME", el('txtEndtTime').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(el("txt_transType").value){
    	
    	conditions.push([ "t.TRANS_TYPE", el("txt_transType").value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]);
    }
    if(el("txt_targetType").value){
    	
    	conditions.push([ "t.TARGET_TYPE", el("txt_targetType").value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]);
    }
    conditions.push([ "busi.BWORD_TYPE", 1, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
    gCrud.search(conditions,subConditions);
//    console.debug(gCrud.grid.dataCount)
}

/**
 * 导出成Excel
 */
function exportExcel() {
    if(gCrud.pageBar && gCrud.pageBar.rowCount==0) {
        jetsennet.message("当前条件下，暂无数据需要导出!");
    } else {
    	gCrud.exportData(true);
    }
};

//----------------------公共方法开始--------------------------------------------
jetsennet.Crud.prototype.showDlg = function(controlId, options) {
    jetsennet.Crud.showDlg("标题", controlId,options);
    this.load();
};

jetsennet.Crud.showDlg = function(title, controlId,options) {
    var dialog = new jetsennet.ui.Window(title);
    jQuery.extend(dialog, {
        title : title,
        size : {
            width : 520,
            height : 370
        },
        submitBox : false,
        cancelBox : false,
        showScroll : false,
        controls : [ controlId ],
    }, options);
    dialog.onsubmit =null,
    dialog.showDialog();
};



function showIframDialog(url,title, controlId, options){
	el("iframePopWin").src = url;
	var dialog = new jetsennet.ui.Window(title);
	    jQuery.extend(dialog, {
	        title : title,
	        size : {
	            width : 1000,
	            height : 370
	        },
	        enableMove : false,
			showScroll : false,
			cancelBox : false,
			maximizeBox : false,
			minimizeBox : false,
	        controls : [ controlId ],
	    }, options);
	    dialog.showDialog();
}

//---------------------公共方法结束---------------------------------------------

var gShowCrud = $.extend(new jetsennet.Crud("divShowList", gShowColumns), {
	dao : SYSDAO,
	tableName : "PPN_TSB_TASK",
	groupFields:"t.target_type",
    name : "推送事件",
    resultFields:"count(*) T_NUM ,get_control_word_name('PPN_TSB_TASK','TARGET_TYPE',TARGET_TYPE) TARGET_TYPE_TXT "
});


function showPie(){
	/*var url ="../../jdlm/rent/pushProductionPie.htm?";
	if(el('txtStartTime').value){
	    url+="startTime="+el('txtStartTime').value+"&&";
	}
	if(el('txtEndtTime').value){
    	url+="endTime="+el('txtEndtTime').value;
    }*/
	    
	var url ="../../jdlm/rent/pushProductionPie.htm";
	showIframDialog(url,'事件统计','divPopWin',{size:{ width : 800,height : 500}});
}








