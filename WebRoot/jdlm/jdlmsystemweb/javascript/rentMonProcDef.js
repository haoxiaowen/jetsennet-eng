/**
 * 监控进程名称
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
var gRackColumns = [{ fieldName: "PROC_ID", width: 30, align: "center", isCheck: 1, checkName: "chkDef"},
                   { fieldName: "PROC_CODE", sortField: "PROC_CODE", width: 230, align: "center", name: "进程定义代码"},
                   { fieldName: "PROC_NAME", sortField: "PROC_NAME", width: 230, align: "center", name: "进程定义名称"},
                   { fieldName: "PROC_STATUS", sortField: "PROC_STATUS", width: 175, align: "center", name: "进程定义状态",format : function(val,vals){
                	   if(val == "0"){
                		   return "禁用";
                	   }else if(val == "1"){
                		   return "可用"
                	   }
                   }},
                    { fieldName: "PROC_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }},
                    { fieldName: "PROC_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }}];
var index = 0;
var gCrud = $.extend(new jetsennet.Crud("divDefList", gRackColumns, "divDefPage","order by PROC_INDEX"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_MON_PROC_DEF",
    name : "监控管理",
    className : "jetsennet.jdlm.beans.PpnRentMonProcDef",
    keyId : "t.PROC_ID",
    cfgId : "divDef",
    checkId : "chkDef",
    addDlgOptions : {size : {width : 700, height : 260}},
	editDlgOptions : {size : {width : 700, height : 260}},
	
	onAddGet : function() {
		
        return {
    		PROC_CODE : new Date().getTime(),
    		PROC_NAME : el('txt_PROC_NAME').value,
    		PROC_STATUS : el('txt_PROC_STATUS').value,
    		PROC_INDEX : index,
    		OBJ_TYPE_ID : obtId,
        };
    },
    onAddInit : function(){
    	var conditions = [ [ 'PROC_ID', null, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'PROC_ID', 'PPN_RENT_MON_PROC_DEF', "t",null, conditions, 'PROC_INDEX','order by PROC_INDEX');
		if(results){
			i = results.length-1;
			index = Number(results[i].PROC_INDEX)+1;
		}else{
			index = "1"
		}
    },
    onEditSet : function(obj) {
    	var conditions = [ [ 'OBJ_TYPE_ID', valueOf(obj, "OBJ_TYPE_ID", ""), jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",null, conditions, 'OBJ_TYPE_NAME');
		if(results){
			el("txt_OBJ_TYPE_ID").value = results[0].OBJ_TYPE_NAME;
		}
    	el("txt_PROC_NAME").value = valueOf(obj, "PROC_NAME", "");
    	el("txt_PROC_STATUS").value = valueOf(obj, "PROC_STATUS", "");
    	//el("txt_PROC_INDEX").value = valueOf(obj,"PROC_INDEX","");
    	obtId = valueOf(obj, "OBJ_TYPE_ID", "");
    },
    onEditGet : function(id) {
    	
    	return {
    		PROC_ID : id,
    		PROC_CODE : new Date().getTime(),
    		PROC_NAME : el('txt_PROC_NAME').value,
    		PROC_STATUS : el('txt_PROC_STATUS').value,
    		PROC_INDEX : index,
    		OBJ_TYPE_ID : obtId,
    	}
    },
    
});

/**
 * 页面初始化
 */
function pageInit() {
    
	gCrud.load();
}
/**
 * 条件查询
 * @param objName
 */
function searchDef() {
	var conditions = [];
    var value = jetsennet.util.trim(el('txtDefCode').value);
    if(value){
    	 conditions.push( ["t.PROC_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gCrud.search(conditions);
}

/**
 * 资源类型
 */

var gcColumnsObt = [  // { fieldName: "OBJ_TYPE_ID", width: 30, align: "OBJ_TYPE_ID", isCheck: 1, checkName: "chkobt"},
  	                    { fieldName: "OBJ_TYPE_CODE", sortField: "OBJ_TYPE_CODE", width: 150, align: "center", name: "资源编码" },
  	                    { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: 150, align: "center", name: "资源名称"}
  	                   ];
var gCrudObt = $.extend(new jetsennet.Crud("divObtList", gcColumnsObt, "divObtPage"), {
   dao : SYSDAO,
   tableName : "PPN_RENT_OBJ_TYPE",
   name : "资源信息",
 //  checkId : "chkobt",
   keyId:   "t.OBJ_TYPE_ID",
   conditions : [["t.OBJ_TYPE_ID", '0', jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
});
gCrudObt.grid.ondoubleclick = null;
var obtCode;
var obtName;
var obtId;
var parId;
gCrudObt.grid.onrowclick = function(item, td) {
	obtCode = jetsennet.util.trim(item.OBJ_TYPE_CODE);
	obtName = jetsennet.util.trim(item.OBJ_TYPE_NAME);
	parId = jetsennet.util.trim(item.OBJ_TYPE_ID)
}

//获取
function onObt(){
	var _dialog = new jetsennet.ui.Window("obj-divObt");
	
	jQuery.extend(_dialog, {
	size : {
		width : 500,
		height : 320
	},
	title : "资源类型",
	submitBox : true,
	cancelBox : true,
	maximizeBox : false,
	minimizeBox : false,
	controls : [ "divObjTypeFrame" ]
	
});
_dialog.onsubmit = function(){
	if(obtCode){
		obtId =parId;
		el('txt_OBJ_TYPE_ID').value = obtName
		_dialog.close();
	}else{
		jetsennet.alert("请选择一个资源类型！");
		return;
	}
	}
	gCrudObt.load();
	_dialog.showDialog();

}
function searchObt(){
	var conditions = [];
	var value = jetsennet.util.trim(el('txtObtCode').value);
	if(value){
		 conditions.push( ["t.OBJ_TYPE_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		 conditions.push( ["t.OBJ_TYPE_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gCrudObt.search(conditions)
}
