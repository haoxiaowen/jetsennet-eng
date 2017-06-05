/**
 *  出库单
 *  @author yyf 2016-12-13
 */

jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud"]); 

var gResId;

//资源列表
var gReturnColumns = [{ fieldName: "RETU_ID", width: 30, align: "center",display:1, isCheck: 1, checkName: "chkRetu"},
                      { fieldName: "RETU_NAME", sortField: "RETU_NAME",title:true, width: 280, align: "center", name: "入库名称"},
                      { fieldName: "RETU_CODE", sortField: "RETU_CODE", width: 180, align: "center", name: "入库单号"},
                      { fieldName: "RETU_MANAGE_USER", sortField: "RETU_MANAGE_USER", width: 180, align: "center", name: "人员"},
                      { fieldName: "RETU_COLUMN_CODE", sortField: "RETU_COLUMN_CODE",title:true, align: "center", name: "栏目"},
                      { fieldName: "RETU_DEPT_CODE", sortField: "RETU_DEPT_CODE",  align: "center", name: "部门"},
                      /*{ fieldName: "RETU_TYPE", sortField: "RETU_TYPE", width: 180, align: "center", name: "类型"},*/
                      { fieldName: "RETU_STATUS", sortField: "RETU_STATUS", align:"center", name: "状态",format: function(val, vals){
                      	if (val == 2) {
                    		return "成功";
                    	} else{
                    		return "成功";
                    	}
                    }},
                      { fieldName: "RETU_TIME", sortField: "RETU_TIME", align:"center", name: "入库时间"},	
                    ];

var gCrud = $.extend(new jetsennet.Crud("divResList", gReturnColumns, "divResPage", "order by t.RETU_TIME desc"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_RETURN",
    name : "入库",
    cfgId : "divRes",
    checkId : "chkRetu",
    keyId : "t.RETU_ID"
});

var gResGrid = gCrud.grid;
gResGrid.onrowclick = null;
gResGrid.ondoubleclick=null ;
gCrud.grid.enableMultiSelect=true;


/**
 * 页面初始化
 */
function pageInit() {
//	Layoutit("#divPageFrame", {hLayout: [{vLayout: [46,"auto",40], value:"70%"}, { vLayout: [46,"auto"]}]}); 	 
	var layout = { splitType: 1,layout: [46, "auto", 40]};
	jQuery("#divPageFrame").pageFrame(layout).sizeBind(window);  
	
    gCrud.load();
    //初始化下拉框
};

/*function addReturn(){
	var obj = new Object();
	obj.ID = "12121212";
	obj.NAME = "入库申请单";
	obj.URL = "../../jdlm/rent/rentReturnDetail.htm";
	parent.MyApp.showIframe(obj,false);
}*/

/**
 * 添加附件
 */
function addAttaFile() {
	var id= null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkRetu") : jetsennet.Crud.getCheckIds(id, "chkRetu");
	if(checkIds.length ==0){
		jetsennet.alert("请选择一个项！");
		return;
	}
	if(checkIds.length >1){
		jetsennet.alert("只能选择一个项添加附件！");
		return;
	}
	var taskid = checkIds[0];
	var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = 1000;
	var height = size.height;
	var url = "../../jdlm/jdlmsystemweb/rentAttaFile.htm?";
	url += "FileStyleVal=3&&";
	url += "code=" + taskid;
	el("iframePopWin").src = url;
	gDialog = new jetsennet.ui.Window("show-divPopWin");
	jQuery.extend(gDialog, {
		size : {
			width : width,
			height : height
		},
		title : '添加附件',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divPopWin" ];
	gDialog.show();
}

/**
 * 添加入库申请单
 */
function addReturn() {
	var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = size.width;
	var height = size.height;
	var url = "../../jdlm/rent/rentReturnDetail.htm?";
	el("iframePopWin").src = url;
	gDialog = new jetsennet.ui.Window("add-divPopWin");
	jQuery.extend(gDialog, {
		size : {
			width : 1500,
			height : 1000
		},
		title : '入库申请单',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divPopWin" ];
	gDialog.show();
}


function delReturn(){
	if (gCrud.grid.selectedRows[0] == null
			|| typeof (gCrud.grid.selectedRows[0]) == undefined) {
		jetsennet.alert("请选择项！");
		return;
	}
	var id = null;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkRetu") : jetsennet.Crud.getCheckIds(id,"chkRetu");
	var xml = "<TABLES>";
	for(var i=0;i<checkIds.length;i++){
		var taskid = checkIds[i];
		xml +=  "<TABLE TABLE_NAME='PPN_RENT_IN_ITEM'>"
			+ "	<SqlWhereInfo>"
			+ "		<RETU_ID ParamType='String' RelationType='Equal' LogicType='And'>"
			+ taskid
			+ 		"</RETU_ID>"
			+ "	</SqlWhereInfo>"
			+ "</TABLE>"
			+ "<TABLE TABLE_NAME='PPN_RENT_RETURN_ATTACH'>"
			+ "	<SqlWhereInfo>"
			+ "		<RETU_ID ParamType='String' RelationType='Equal' LogicType='And'>"
			+ taskid
			+ 		"</RETU_ID>"
			+ "	</SqlWhereInfo>"
			+ "</TABLE>"
			+ "<TABLE TABLE_NAME='PPN_RENT_RETURN'>"
			+ "	<SqlWhereInfo>"
			+ "		<RETU_ID ParamType='String' RelationType='Equal' LogicType='And'>"
			+ taskid
			+ 		"</RETU_ID>"
			+ "	</SqlWhereInfo>"
			+ "</TABLE>";
			
	}
	xml += "</TABLES>";
	var params = new HashMap();
	params.put("deleteXml", xml);
	jetsennet.confirm("确定删除？", function() {
		SYSDAO.execute("commonObjsDeleteByCondition", params, {
			success : function(resultVal) {
				 gCrud.load();
			},
			wsMode : "WEBSERVICE"
		}
	
		);
		return true;
	});	
}

/**
 * 查询
 */
function searchRetu() {
    var conditions = [];
    el('txt_RES_NAME').value = jetsennet.util.trim(el('txt_RES_NAME').value);
    if (el('txt_RES_NAME').value != "") {
        conditions.push([ "t.RETU_DEPT_CODE", el('txt_RES_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "t.RETU_COLUMN_CODE", el('txt_RES_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "t.RETU_MANAGE_USER", el('txt_RES_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gCrud.search(conditions);
//    var xml ="<RecordSet TotalCount='1'><Record><RETU_ID>BACFAB69-1D3C-4D54-9AD4-A2261581FED6</RETU_ID><RETU_CODE>1482461878699</RETU_CODE><RETU_NAME>郝晓文test</RETU_NAME><RETU_TYPE/><RETU_STATUS>2</RETU_STATUS><RETU_USER>admin</RETU_USER><RETU_MANAGE_USER>张建华</RETU_MANAGE_USER><RETU_COLUMN_CODE>实况录像</RETU_COLUMN_CODE><RETU_DEPT_CODE>办公室</RETU_DEPT_CODE><RETU_TIME>2016-12-23 10:57:58</RETU_TIME><RETU_CHECK_USER>admin</RETU_CHECK_USER><RETU_CHECK_DESC/><RETU_CHECK_TIME>2016-12-23 10:57:58</RETU_CHECK_TIME><RETU_FIELD1/><RETU_FIELD2/></Record></RecordSet>"
//    gCrud.grid.renderXML(xml)*/
	/*var xml = "<RecordSet TotalCount='"
	var  htt =[{"process":6,"address":"192.168.1.112","memory":76,"last":1482461718033,"port":9528,"cpu":30,"id":"102"},{"process":6,"address":"192.168.1.112","memory":76,"last":1482461718033,"port":9528,"cpu":30,"id":"102"}]
	var obj = eval(htt);
	var len = obj.length;
	xml+=len+"'>";
	for(var i=0; i<len;i++){
		xml+="<Record>";
		xml+="<PROCESS>"+obj[0].process+"</PROCESS>";
		xml+="<ADDRESS>"+obj[0].address+"</ADDRESS>";
		xml+="<MEMORY>"+obj[0].memory+"</MEMORY>";
		xml+="<PORT>"+obj[0].process+"</PORT>";
		xml+="<CPU>"+obj[0].process+"</CPU>";
		xml+="<ID>"+obj[0].process+"</ID>";
		xml+="</Record>";
	}
	xml+="</RecordSet>";
	console.debug(xml);*/
	
}












