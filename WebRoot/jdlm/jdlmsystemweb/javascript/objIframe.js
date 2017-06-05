jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
//表名
var tableName = jetsennet.queryString("tableName");
	//资源类型表主键ID
var typeId = jetsennet.queryString("typeValue");
	
	//选择资源表的资源说明
var tableDesc;
var tableCode;
var gSelectObjColumns = [];
var gObjCrud = new jetsennet.Crud("divObjList",gSelectObjColumns,"divObjPage");
var cds = [];
//选择资源表主键id
var tablePK;
var macAddress;
//获取资源表的信息（字段，字段名，主键，名称说明）
function getListMsg(){
   
 	
	var conditions = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_OBJ_TYPE_ITEM', "t",
			null, conditions, 'ITEM_COLUMN_NAME,ITEM_DISPLAY_NAME,ITEM_IS_PK,ITEM_IS_NAME,ITEM_IS_CODE,ITEM_IS_MAC_ADDRESS','order by  ITEM_IS_NAME desc');
	
	if(result){
		for(var i = 0;i<result.length;i++){
     		if(result[i].ITEM_IS_PK == 1){
     			tablePK = result[i].ITEM_COLUMN_NAME
     		}else{
     			gSelectObjColumns.push({ fieldName: result[i].ITEM_COLUMN_NAME, sortField: result[i].ITEM_COLUMN_NAME, width: 235, align: "center", name: result[i].ITEM_DISPLAY_NAME});
     		}
     		if(result[i].ITEM_IS_NAME == 1){
     			tableDesc = result[i].ITEM_COLUMN_NAME
     		}
     		if(result[i].ITEM_IS_CODE == 1){
     			tableCode = result[i].ITEM_COLUMN_NAME
     		}
     		if(result[i].ITEM_IS_MAC_ADDRESS == 1){
     			macAddress = result[i].ITEM_COLUMN_NAME;
     			
     		}
     		
     	}
		if(!tablePK){
 			jetsennet.alert("类型配置信息不完整，缺少主键！");
 			return false;
 		}
 		if(!tableDesc){
 			jetsennet.alert("类型配置信息不完整，缺少名称！");
 			return false;
 		}
 		if(!tableCode){
 			jetsennet.alert("类型配置信息不完整，缺少编码！");
 			return false;
 		}
 		
 		
	}
	cds.push([macAddress, null, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String]);
	var reskey = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t",
			null, [['OBJ_ID', null, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ],
			    	['OBJ_STATUS', '-99', jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]], 'OBJ_KEY');
		
	if(reskey){
	   for(var i = 0; i < reskey.length; i++){
		   cds.push([tablePK, reskey[i].OBJ_KEY, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String]);
		   
	   }
	   
	}
		return true;
}



	
	
	
//条件查询(资源名称)
function searchCnd(){
	//var conditions = [];
	var val = el('txtMsg').value
	var cnd = cds
	if(val){
		cnd.push([tableDesc, val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	//conditions.concat(cds);
	
	gObjCrud.search(cnd);
}
gObjCrud.grid.ondoubleclick = null;
//列表单击事件
gObjCrud.grid.onrowclick = function(item, td) {
	if(item[tablePK]||item[tableCode]){
		var retObj = new Object();
    	retObj.ID = item[tablePK];
		retObj.NAME = item[tableDesc];//valueOf(obj, tableField[1], "");
		retObj.CODE = item[tableCode];
		retObj.ADDRESS = item[macAddress]
		if(window.parent){
			window.parent.gObj = retObj;
		}
	}else{
		jetsennet.alert("请选择一个资源！");
		return;
	}
	
};

//页面初始化
function pageInit() {
	if(!getListMsg()){
		return;
	};
	
	gObjCrud = $.extend(gObjCrud, {
		dao : SYSDAO,
		tableName : tableName,
		name : "资源",
		keyId : tablePK,
		conditions : cds,
		//checkId : "chkKey",
	});
	gObjCrud.load();
	
}