/**
 * 出库项
 * 
 */
jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var startTime;
var endTime;
var conditions=[];
var gR2tColumns = [{ fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes2Price"},
                // { fieldName: "ITEM_NAME", sortField: "ITEM_NAME", width: 180, align: "center", name: "出库项名称"},
               //  { fieldName: "ITEM_TYPE", sortField: "ITEM_TYPE", width: 180,align: "center", name: "出库项类型"},
                   { fieldName: "A", sortField: "A", width: 230, align: "center", name: "设备名称"},
                 //{ fieldName: "ITEM_CODE", sortField: "ITEM_CODE", width: 230, align: "center", name: "出库项代码"},
                // { fieldName: "ITEM_STATUS", sortField: "ITEM_STATUS", width: 180, align: "center", name: "出库项状态"},
                 { fieldName: "B", sortField: "B", width: 100, align: "center", name: "设备类型"},
                
                 { fieldName: "ITEM_OBJ_NUM", sortField: "ITEM_OBJ_NUM", width: 100, align: "center", name: "设备数量"},
                 { fieldName: "ITEM_OBJ_UOM", sortField: "ITEM_OBJ_UOM", width: 100, align:"center", name: "使用天数"},
               //  { fieldName: "ITEM_OBJ_UOM_SUM", sortField: "ITEM_OBJ_UOM_SUM", width: 100, align:"center", name: "单元数量"},
                 
                 { fieldName: "OS", sortField: "OS", width: 150, align: "center", name: "起借时间"},
                 { fieldName: "OE", sortField: "OE", width: 150, align:"center", name: "归还时间"},
                 //{ fieldName: "ITEM_OBJ_CURRENCY", sortField: "ITEM_OBJ_CURRENCY", width: 100, align:"center", name: "对象币种"},	
                 { fieldName: "C", sortField: "C", width: 180, align: "center", name: "出库时间"},
                 //{ fieldName: "ITEM_REMARK", sortField: "ITEM_REMARK", width: 180, align: "center", name: "对象备注"},
                // { fieldName: "ITEM_FOLLOW_PERSON", sortField: "ITEM_FOLLOW_PERSON", width: 150, align:"center", name: "跟机人"},
               //  { fieldName: "ITEM_OBJ_SPECS", sortField: "ITEM_OBJ_SPECS", width: 150, align:"center", name: "规格"},	
                 
                 
                /* { fieldName: "ITEM_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                     return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                 }},*/
              /*   { fieldName: "ITEM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                     return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                 }}*/];

var gCrud = $.extend(new jetsennet.Crud("divRentOutItem", gR2tColumns,"divPageRentOutItem","order by au.OUT_CREATE_TIME DESC"), {
  dao : SYSDAO,
  tableName : "PPN_RENT_OUT_ITEM",
  tabAliasName:"t",
  name : "出库项",
  className : "jetsennet.jdlm.beans.PpnRentOutItem",
  joinTables :[["PPN_RENT_OUT", "au", "t.OUT_ID = au.OUT_ID", jetsennet.TableJoinType.Inner],
               ["PPN_RENT_OBJ", "ob", "ob.OBJ_CODE = t.ITEM_OBJ_CODE", jetsennet.TableJoinType.Inner],
               ["PPN_RENT_OBJ_TYPE", "ty", "ty.OBJ_TYPE_ID = t.ITEM_OBJ_TYPE", jetsennet.TableJoinType.Inner]],
  keyId : "t.ITEM_ID",
  resultFields:"t.*,ob.OBJ_NAME A,ty.OBJ_TYPE_NAME B,au.OUT_CREATE_TIME C,au.OUT_START_TIME OS ,au.OUT_END_TIME OE"
});
gCrud.grid.enableMultiSelect=true;
gCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit(){	
	gCrud.load();
}
gCrud.grid.ondoubleclick = null;

/**
 * 条件查询出库项
 */
function searchItem(){
	conditions=[];
	 startTime=el('txtStartTime').value;
	 endTime=el('txtEndTime').value;
	 var textName=el('txtObjName').value;
	if(startTime){
		conditions.push([ "au.OUT_CREATE_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);		
	}
	if(endTime){
		conditions.push(["au.OUT_CREATE_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
	 		
	}
	if(textName){
		conditions.push(["ob.OBJ_NAME", textName, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String]);
	}
	gCrud.search(conditions);
	}


/**
 * 导出成Excel
 */
function exportExcel() {
    if(gCrud.pageBar && gCrud.pageBar.rowCount==0) {
        jetsennet.message("当前条件下，无数据需要导出!");
    } else {
        gCrud.exportData(true);
    }
};

function objImage(){	
	 startTime=el('txtStartTime').value;
	 endTime=el('txtEndTime').value;
	 var textName=el('txtObjName').value;
	  // var url = "rentOutItemObj.htm?startTime="+startTime+"&endTime="+endTime+"&textName="+textName;
	   var url = "rentOutItemByName.htm?startTime="+startTime+"&endTime="+endTime+"&textName="+textName;
	   showIframDialog(url,'统计','divPopWin',{size:{ width : 1200,height : 580}});
	 }


function showIframDialog(url,title, controlId, options){
	el("iframePopWin").src = url;
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
			maximizeBox : false,
			minimizeBox : false,
	        controls : [ controlId ],
	    }, options);
	    dialog.showDialog();
}
//--------add by yyf--------------start-----------------
function printOut(){
	var id = null;
	var val = 1;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkRes2Price") : jetsennet.Crud.getCheckIds(id,"chkRes2Price");
	if(checkIds.length !=1){
		jetsennet.alert("请选择单个资源！");
		return;
	}
	/*title = "打印出库单";
	el("iframePopWin").src = "../rent/printOut.htm" + "?itemID="+checkIds[0];
	var dialog = new jetsennet.ui.Window("retrun-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:1500,height:1000},title:title});
	dialog.controls = ["divPopWin"];
	dialog.showDialog();*/
	window.open("../rent/printOut.htm" + "?itemID="+checkIds[0]);
}



//--------add by yyf--------------end-------------------
