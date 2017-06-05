/**
 *  入库项
 *  @author zjb
 */
jetsennet.require([ "pageframe", "pagebar", "gridlist","window","timeeditor","menu","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");

var ppnDs = new jetsennet.DefaultDal("PPNtransdsService");
ppnDs.dataType = "xml";
var dal = new defaultdal();
dal.dataType = 'xml';

var retuId;
var stateTime="";
var endTime="";

//资源列表
var gResColumns = [{ fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes"},
                   //{ fieldName: "RETU_ID", sortField: "RETU_ID", width: 180, align: "center", name: "入库单ID"},
                   { fieldName: "OBJ_NAME", sortField: "OBJ_NAME", width: "auto", align: "center", name: "设备名称"},
                    { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: "auto", align: "center", name: "设备类型"},
                    { fieldName: "ITEM_OBJ_NUM", sortField: "ITEM_OBJ_NUM", width: "auto", align: "center", name: "数量"},
                /*    { fieldName: "ITEM_OBJ_UOM", sortField: "ITEM_OBJ_UOM", width: "auto", align: "center", name: "使用单元"},
                    { fieldName: "ITEM_OBJ_UOM_SUM", sortField: "ITEM_OBJ_UOM_SUM", width: "auto", align: "center", name: "单元总量"},*/
                   /* { fieldName: "ITEM_OBJ_PRICE", sortField: "ITEM_OBJ_PRICE", width: "auto", align:"center", name: "对象单价"},*/
                   /* { fieldName: "ITEM_OBJ_DESC", sortField: "ITEM_OBJ_DESC", width: "auto", align:"center", name: "对象说明"},*/	
                    
                    /*{ fieldName: "ITEM_OBJ_CURRENCY", sortField: "ITEM_OBJ_CURRENCY", width: "auto", align: "center", name: "对象币种"},*/
                    { fieldName: "ITEM_CHECK_RESULT_WG", sortField: "ITEM_CHECK_RESULT_WG", width: "auto", align: "center", name: "外观检验",format: function(val, vals){
                    	if (val == 0) {
                    		return "未通过";
                    	} else if(val ==1) {
                    		return "通过";
                    	}
                    }},
                    { fieldName: "ITEM_CHECK_BEFORE_WG", sortField: "ITEM_CHECK_BEFORE_WG", width: "auto", align: "center", name: "与出库前比较",format: function(val, vals){
                    	if (val == 0) {
                    		return "未通过";
                    	} else if(val ==1) {
                    		return "通过";
                    	}
                    }},
                  /*  { fieldName: "ITEM_CHECK_REMARK_WG", sortField: "ITEM_CHECK_REMARK_WG", width: "auto", align:"center", name: "技术检验"},*/
                    { fieldName: "ITEM_RESULT", sortField: "ITEM_RESULT", width: "auto", align:"center", name: "入库结果",format: function(val, vals){
                    	if (val == 0) {
                    		return "待定";
                    	} else if(val ==1) {
                    		return "入库";
                    	}else if(val == 2){
                    		return "保养";
                    	}
                    }},
                    { fieldName: "RETU_TIME", sortField: "RETU_TIME", width: "auto", align: "center", name: "入库时间"}
                    /*{ fieldName: "ITEM_DESC", sortField: "ITEM_DESC", width: "auto", align: "center", name: "入库描述"}*/
                  ];

var gCrud = $.extend(new jetsennet.Crud("divContent", gResColumns, "divPage"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_IN_ITEM",
    name : "资源",
    className : "jetsennet.jdlm.beans.PpnRentInItem",
    keyId : "t.ITEM_ID",
    resultFields:"*",
    joinTables :[["PPN_RENT_RETURN", "au", "t.RETU_ID = au.RETU_ID", jetsennet.TableJoinType.Inner],["PPN_RENT_OBJ_TYPE", "f", "f.OBJ_TYPE_ID = t.ITEM_OBJ_TYPE", jetsennet.TableJoinType.Inner],["PPN_RENT_OBJ", "e", "e.OBJ_CODE = t.ITEM_OBJ_CODE", jetsennet.TableJoinType.Inner]],
});
gCrud.grid.enableMultiSelect=true;
gCrud.grid.ondoubleclick = null;

function pageInit() {
	
	gCrud.load();
	$('#log_time').daterangepicker(jQuery.extend({ opens : "right"}, dataPickerOptions));
};


function searchConfirm() {
	var conditions = [];
       if ($('#log_time').val()) {
        conditions.push([ "au.RETU_TIME", $('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
        conditions.push([ "au.RETU_TIME", $('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD 23:59:59'), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
       }
       if($('#text_OBJ_NAME').val()){
    	   conditions.push([ "e.OBJ_NAME", el('text_OBJ_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
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

/**
 * 统计
 */
/*function selectTj(){
	if($('#log_time').val()!=null&&$('#log_time').val()!=""){
		stateTime=$('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD');
		endTime=$('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD');
	}
    	var params = new HashMap();
    	params.put("stateTime", stateTime);
    	params.put("endTime", endTime);
    	 var resultSb = ppnDs.execute("selectTjSb",params);
    	 var resultDy = ppnDs.execute("selectTjDy",params);
    	 if(resultSb!=null&&resultSb!=""){
    		 jQuery('#divContents').html("");
    		 jQuery('#divSb').html("");
    		 AttrDys.dataSource = resultDy.resultVal;
    		 AttrDys.render("divContents");
    		 AttrSbs.dataSource = resultSb.resultVal;
    		 AttrSbs.render("divSb");
 			
    		 var dialog = new jetsennet.ui.Window("programCones-cccc-javamail-dialog");
    		 jQuery.extend(dialog, {
    		        title : "统计详情",
    		        size : {
    		            width : 800,
    		            height : "auto"
    		        },
    		        maximizeBox : false,
    		        minimizeBox : false,
    		        cancelBox : true,
    		        showScroll : false,
    		        controls : ["divProGramDetails"]
    		    });
    		 dialog.showDialog();
    	 }

};




//=========================================================  
  var AttrDy = [
                     { fieldName: "OBJTYPE", sortField: "OBJTYPE", width:"50%", align: "center", name: "单元类型"},
                     { fieldName: "SUMS", sortField: "SUMS", width: "50%", align: "center", name: "单元数量"},
                    
          ];
  var AttrDys = $.createGridlist ("divContents", AttrDy, null, null);
  
  
  var AttrSb = [
                     { fieldName: "RESULTS", sortField: "RESULTS", width:"50%", align: "center", name: "设备类型"},
                     { fieldName: "SBS", sortField: "SBS", width: "50%", align: "center", name: "设备数量"},
                    
          ];
  var AttrSbs = $.createGridlist ("divSb", AttrSb, null, null);
  */

/*function selectSb(){
	if($('#log_time').val()!=null&&$('#log_time').val()!=""){
		stateTime=$('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD');
		endTime=$('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD');
	}
    	var params = new HashMap();
    	params.put("stateTime", stateTime);
    	params.put("endTime", endTime);
    	 var resultSb = ppnDs.execute("selectTjSb",params);
    	 //console.info(resultSb.resultVal);
    	// var ps = new HashMap();
    	 var sb="";
    	 $(resultSb.resultVal).find("Record").each(function(i) { 
     		var SBS= $(this).children("SBS").text();
     		var RESULTS= $(this).children("RESULTS").text();
     		//ps.put(SUMS, OBJTYPE);
     		sb += ","+"{value:"+SBS+", name:'"+RESULTS+"'}";
     	 });
    	return sb.substring(1);
	
}
function selectDy(){
	if($('#log_time').val()!=null&&$('#log_time').val()!=""){
		stateTime=$('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD');
		endTime=$('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD');
	}
    	var params = new HashMap();
    	params.put("stateTime", stateTime);
    	params.put("endTime", endTime);
    	 var resultDy = ppnDs.execute("selectTjDy",params);
    	 //console.info(resultDy.resultVal);
    	// var ps = new HashMap();
    	 var dy="";
    	 $(resultDy.resultVal).find("Record").each(function(i) { 
    		var SUMS= $(this).children("SUMS").text();
    		var OBJTYPE= $(this).children("OBJTYPE").text();
    		//ps.put(SUMS, OBJTYPE);{value:3235, name:'直接访问'}
    		dy +=","+"{SUM:"+SUMS+", name:"+OBJTYPE+"}";
    	
    	 });
    	return dy.substring(1);
	
}
*/


function selectTj(){
	stateTime=$('#log_time').data('daterangepicker').startDate.format('YYYY-MM-DD');
	endTime=$('#log_time').data('daterangepicker').endDate.format('YYYY-MM-DD');
		var gDialog;
		var url = "../../jdlm/rent/ppnRentInItemPie.htm";
		if($('#log_time').val()){
			url += "?gStartTime="+stateTime+"&gEndTime="+endTime;
		}
		el("iframePopWin").src = url;
		gDialog = new jetsennet.ui.Window("show-divPopWin");
		jQuery.extend(gDialog, {
			size : {
				width : 1200,
				height : 580
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
  
  
 

