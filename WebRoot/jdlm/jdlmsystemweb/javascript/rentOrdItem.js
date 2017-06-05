/**
 * 申请项订单条目信息
 * 
 */
jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var startTime;
var endTime;
var conditions=[];
var gR2tColumns = [{ fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes2Price"},
                 { fieldName: "ITEM_NAME", sortField: "ITEM_NAME", width: 150, align: "center", name: "条目名称"},
                // { fieldName: "ITEM_TYPE", sortField: "ITEM_TYPE", width: 180,align: "center", name: "出库项类型"},
                // { fieldName: "ITEM_CODE", sortField: "ITEM_CODE", width: 250, align: "center", name: "条目代码"},
                // { fieldName: "ITEM_STATUS", sortField: "ITEM_STATUS", width: 180, align: "center", name: "出库项状态"},
                 { fieldName: "B", sortField: "B", width: 100, align: "center", name: "对象类型"},
                 { fieldName: "A", sortField: "A", width: 200, align: "center", name: "对象名称"},
                 { fieldName: "ITEM_OBJ_NUM", sortField: "ITEM_OBJ_NUM", width: 70, align: "center", name: "对象数量"},
                 { fieldName: "ITEM_OBJ_UOM", sortField: "ITEM_OBJ_UOM", width: 70, align:"center", name: "使用单元"},
                 { fieldName: "ITEM_OBJ_UOM_SUM", sortField: "ITEM_OBJ_UOM_SUM", width: 70, align:"center", name: "单元数量"},
                 
                 { fieldName: "ITEM_OBJ_PRICE", sortField: "ITEM_OBJ_PRICE", width: 70, align: "center", name: "对象单价"},
                // { fieldName: "ITEM_OBJ_DESC", sortField: "ITEM_OBJ_DESC", width: 150, align:"center", name: "对象说明"},
                 { fieldName: "ITEM_OBJ_CURRENCY", sortField: "ITEM_OBJ_CURRENCY", width: 100, align:"center", name: "对象币种"},	
                 
               //  { fieldName: "ITEM_REMARK", sortField: "ITEM_REMARK", width: 180, align: "center", name: "条目备注"},
                 { fieldName: "ITEM_START_TIME", sortField: "ITEM_START_TIME", width: 180, align: "center", name: "开始时间"},
                 { fieldName: "ITEM_END_TIME", sortField: "ITEM_END_TIME", width: 180, align: "center", name: "结束时间"},
                
                 
                 
             /*    { fieldName: "ITEM_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                     return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                 }},
                 { fieldName: "ITEM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                     return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                 }}*/];

var gCrud = $.extend(new jetsennet.Crud("divRentOutItem", gR2tColumns,"divPageRentOutItem"), {
  dao : SYSDAO,
  tableName : "PPN_RENT_ORD_ITEM",
  tabAliasName:"t", 
  name : "申请项",
  joinTables :[["PPN_RENT_OBJ", "ob", "ob.OBJ_KEY= t.ITEM_OBJ_KEY", jetsennet.TableJoinType.Inner],
               ["PPN_RENT_OBJ_TYPE", "ty", "ty.OBJ_TYPE_ID = t.ITEM_OBJ_TYPE", jetsennet.TableJoinType.Inner]],
  className : "jetsennet.jdlm.beans.PpnRentOrdItem",
  keyId : "t.ITEM_ID",
  resultFields:"t.*,ob.OBJ_NAME a,ty.OBJ_TYPE_NAME b"
});

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
		conditions.push([ "t.ITEM_START_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);		
	}
	if(endTime){
		conditions.push(["t.ITEM_END_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
	 		
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






/**
 * 配置统计表
 */
/*var typeTotalColoums = [{ fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "22"},
                    { fieldName: "ITEM_OBJ_TYPE", sortField: "ITEM_OBJ_TYPE", width: 180, align: "center", name: "对象类型"},
                    { fieldName: "A1", sortField: "ITEM_OBJ_NUM", width: 180, align: "center", name: "对象数量"},
                    { fieldName: "A2", sortField: "ITEM_OBJ_UOM_SUM", width: 150, align:"center", name: "单元数量"}]
                    
                    

var gtotalCrud = $.extend(new jetsennet.Crud("divtotalList", typeTotalColoums), {
	  dao : SYSDAO,
	  tableName : "PPN_RENT_ORD_ITEM",
	  tabAliasName:"t",
	  name : "申请项",
	  className : "jetsennet.jdlm.beans.PpnRentOrdItem",	
	  resultFields:"sum(ITEM_OBJ_NUM) a1,sum(ITEM_OBJ_UOM_SUM) a2,ITEM_OBJ_TYPE",
	  groupFields:"t.ITEM_OBJ_TYPE",
	  keyId : "t.ITEM_ID",
	});


    var total=SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_ORD_ITEM", "t", null,conditions, "sum(ITEM_OBJ_NUM) a1,sum(ITEM_OBJ_UOM_SUM) a2");


*/
function objImage(){
	var url ="rentOrdItemObj.htm?startTime="+startTime+"&endTime="+endTime;
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