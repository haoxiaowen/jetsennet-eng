/**
 * 资源管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
//存放从获取资源的表得到的资源主键
var objCode;
var objKey;
var assId;
var objAddress;
var size = jetsennet.util.getWindowViewSize();
var width = size.width;
var height = size.height;
var gGoodsColumns = [{ fieldName: "OBJ_ID", width: 30, align: "center", isCheck: 1, checkName: "chkObj"},
                     { fieldName: "OBJ_NAME", sortField: "OBJ_NAME", width: 290, align: "center", name: "资源名称"},
                     { fieldName: "OBJ_STATUS", sortField: "OBJ_STATUS", width: 130, align: "center", name: "状态", format: function(val, vals){
                  	   if (val == "1") {
                             return  "在库";     
                         } else if (val == "2") {
                             return "保养";
                         }else if(val == "3"){
                      	   return "维修";
                         }else if(val == "4"){
                      	   return "报废"
                         }else if(val == "5"){
                      	   return "丢失";
                         }else if(val == "6"){
                      	   return "出库";
                         }else if(val == "7"){
                      	   return "预约";
                         }
                     }},
                     { fieldName: "OBJ_ASS_UID", sortField: "OBJ_ASS_UID", width: 150, align: "center", name: "分配资源号"},
                     {fieldName: "OBJ_TYPE_ID", sortField: "OBJ_TYPE_ID", width: 290, align: "center", name: "资源类型",format: function(val, vals){
                  	   var conditions = [['OBJ_TYPE_ID', val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
                  	   var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t", null, conditions, 'OBJ_TYPE_NAME', null);
                  	   if(result && result.length>0) {
                  		   return result[0].OBJ_TYPE_NAME;
                  	   }
                     }},
                     {fieldName: "OBJ_CODE", sortField: "OBJ_CODE", width: 290, align: "center", name: "编码"},
                    { fieldName: "OBJ_CREATE_TIME", sortField: "OBJ_CREATE_TIME", width: 290, align: "center", name: "登记时间"},
                    { fieldName: "OBJ_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("remove('" + val + "')");
                    }},
                    { fieldName: "OBJ_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }}];
var codeName;
var idName;
var objName;
var objAddressName;
var gCrud = $.extend(new jetsennet.Crud("divGoodsList", gGoodsColumns, "divGoodsPage","order by OBJ_NAME"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ",
    name : "资源",
    className : "jetsennet.jdlm.beans.PpnRentObj",
    keyId : "t.OBJ_ID",
    cfgId : "divGoods",
    checkId : "chkObj",
    conditions : [[ 'OBJ_STATUS', 0, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.Numeric ]],
	addDlgOptions : {size : {width : 670, height : 330}},
	editDlgOptions : {size : {width : 670, height : 330}},
	onAddInit : function (){
		var conditions = [ [ 'OBJ_ASS_UID', null, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t",null, conditions, 'OBJ_ASS_UID','order by OBJ_ASS_UID');
		if(results){
			i = results.length-1;
			assId = Number(results[i].OBJ_ASS_UID)+1;
		}else{
			assId = "1"
		}
		el('txt_check').checked = false;
		el('actId').innerHTML = "";
		el('txt_OBJ_d').style.display = ""
	},
	onEditInit : function (){
		el('txt_check').checked = false;
		el('actId').innerHTML = "";
		el('txt_OBJ_d').style.display = ""
	},
	onAddValid : function(){
		if(el('txt_check').checked){
			var jxml = {};
			var conditions = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var ress = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",
					null, conditions, 'OBJ_TYPE_TABLE_NAME');
			
			var condition = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var res = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_OBJ_TYPE_ITEM', "t",
					null, condition, '*');
			for(var i = 0 ; i < res.length ; i++){
				/*if(!res[i].ITEM_IS_PK == "1"||!el(res[i].ITEM_COLUMN_NAME).value){
					jetsennet.alert("请完善资源信息！");
					return;
				}*/
				//ID自动生成
				if(res[i].ITEM_IS_PK == "1"){
					//objKey = res[i].ITEM_COLUMN_NAME;
					idName = res[i].ITEM_COLUMN_NAME;
					continue;
				}
				if(res[i].ITEM_IS_CODE == "1"){
					objCode = new Date().getTime();
					codeName = res[i].ITEM_COLUMN_NAME
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=new Date().getTime()");
					continue;
				}
				if(res[i].ITEM_IS_STATUS == "1"){
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"= 1");
					continue;
				}
				if(res[i].ITEM_IS_NAME == "1"){
					objName = res[i].ITEM_COLUMN_NAME;
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=el(res[i].ITEM_COLUMN_NAME).value");
					continue;
					
				}
				if(res[i].ITEM_IS_CREATE_TIME == "1"){
					createTimeName = res[i].ITEM_COLUMN_NAME;
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=new Date().toDateTimeString()");
					continue;
				}
				if(res[i].ITEM_IS_MAC_ADDRESS == "1"){
					objAddressName = res[i].ITEM_COLUMN_NAME;
					objAddress = el(res[i].ITEM_COLUMN_NAME).value;
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=el(res[i].ITEM_COLUMN_NAME).value");
					continue;
				}
				if(!el(res[i].ITEM_COLUMN_NAME).value){
					jetsennet.alert(res[i].ITEM_DISPLAY_NAME+"不能为空！");
					return false;
				}
				eval("jxml."+res[i].ITEM_COLUMN_NAME+"=el(res[i].ITEM_COLUMN_NAME).value");
				
			}
			
			var condition = [ [ objAddressName, objAddress, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var res = SYSDAO.queryObjs('commonXmlQuery', idName, ress[0].OBJ_TYPE_TABLE_NAME, "t",null, condition, '*');
			if(res){
				jetsennet.alert("已存在相同的地址！");
				return false;
			}
			
			var params = new HashMap();
			params.put("tableName", ress[0].OBJ_TYPE_TABLE_NAME)
			params.put("updateXml", jetsennet.xml.serialize(jxml,"TABLE"));
			params.put("isFilterNull", true);
			result = SYSDAO.execute("commonObjInsert", params,{
																error :  function(ex) {
																	jetsennet.error("资源类型配置错误！"+ex);
																}, wsMode:"WEBSERVICE"});
			if(!(result&&result.errorCode == "0")){
				return false;
			}
			var ref = idName+","+objAddressName;
			var conditions = [ [ codeName, objCode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var results = SYSDAO.queryObjs('commonXmlQuery', idName, ress[0].OBJ_TYPE_TABLE_NAME, "t",null, conditions, ref);
			if(results){
				objKey = results[0][idName];
				objAddress = results[0][objAddressName];
				
				//objCode = results[0].DEV_CODE;
				//el('txt_OBJ_NAME').value = el('txt_DEV_NAME').value;
			}
		}
		if(!el('txt_check').checked){
			if(!el('txt_OBJ_NAME').value){
				jetsennet.alert("资源不能为空！");
				return false;
			}
			objName ='txt_OBJ_NAME'
		}
		return true;
	},
	onEditValid : function(){
		if(el('txt_check').checked){
			var jxml = {};
			
			
			
			var conditions = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var ress = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",
					null, conditions, 'OBJ_TYPE_TABLE_NAME');
			
			var condition = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var res = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_OBJ_TYPE_ITEM', "t",
					null, condition, '*');
			for(var i = 0 ; i < res.length ; i++){
				/*if(!res[i].ITEM_IS_PK == "1"||!el(res[i].ITEM_COLUMN_NAME).value){
					jetsennet.alert("请完善资源信息！");
					return;
				}*/
				//ID自动生成
				if(res[i].ITEM_IS_PK == "1"){
					//objKey = res[i].ITEM_COLUMN_NAME;
					idName = res[i].ITEM_COLUMN_NAME;
					continue;
				}
				if(res[i].ITEM_IS_CODE == "1"){
					objCode = new Date().getTime();
					codeName = res[i].ITEM_COLUMN_NAME
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=new Date().getTime()");
					continue;
				}
				if(res[i].ITEM_IS_STATUS == "1"){
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"= 1");
					continue;
				}
				if(res[i].ITEM_IS_NAME == "1"){
					objName = res[i].ITEM_COLUMN_NAME;
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=el(res[i].ITEM_COLUMN_NAME).value");
					continue;
					
				}
				if(res[i].ITEM_IS_CREATE_TIME == "1"){
					createTimeName = res[i].ITEM_COLUMN_NAME;
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=new Date().toDateTimeString()");
					continue;
				}
				if(res[i].ITEM_IS_MAC_ADDRESS == "1"){
					objAddressName = res[i].ITEM_COLUMN_NAME;
					objAddress = el(res[i].ITEM_COLUMN_NAME).value;
					eval("jxml."+res[i].ITEM_COLUMN_NAME+"=el(res[i].ITEM_COLUMN_NAME).value");
					continue;
				}
				if(!el(res[i].ITEM_COLUMN_NAME).value){
					jetsennet.alert(res[i].ITEM_DISPLAY_NAME+"不能为空！");
					return false;
				}
				eval("jxml."+res[i].ITEM_COLUMN_NAME+"=el(res[i].ITEM_COLUMN_NAME).value");
				
			}
			var condition = [ [ objAddressName, objAddress, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var res = SYSDAO.queryObjs('commonXmlQuery', idName, ress[0].OBJ_TYPE_TABLE_NAME, "t",null, condition, '*');
			if(res){
				jetsennet.alert("已存在相同的地址！");
				return false;
			}
			var params = new HashMap();
			params.put("tableName", ress[0].OBJ_TYPE_TABLE_NAME)
			params.put("updateXml", jetsennet.xml.serialize(jxml,"TABLE"));
			params.put("isFilterNull", true);
			result = SYSDAO.execute("commonObjInsert", params,{
											error :  function(ex) {
													jetsennet.error("资源类型配置错误！");
											}, wsMode:"WEBSERVICE"});
			if(!(result&&result.errorCode == "0")){
				return false;
			}
			var ref = idName+","+objAddressName;
			var conditions = [ [ codeName, objCode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var results = SYSDAO.queryObjs('commonXmlQuery', idName, ress[0].OBJ_TYPE_TABLE_NAME, "t",null, conditions, ref);
			if(results){
				objKey = results[0][idName];
				objAddress = results[0][objAddressName]
				//objCode = results[0].DEV_CODE;
				//el('txt_OBJ_NAME').value = el('txt_DEV_NAME').value;
			}
		}
		if(!el('txt_check').checked){
			if(!el('txt_OBJ_NAME').value){
				jetsennet.alert("资源不能为空！");
				return false;
			}
			objName ='txt_OBJ_NAME'
		}
		return true;
	},
	onAddGet : function() {
		
		el('txt_check').checked = false;
		el('txt_OBJ_d').style.display = "";
        return {
        	OBJ_KEY : objKey,
        	OBJ_TYPE_ID :  typeId,
        	OBJ_CODE : objCode,
        	OBJ_NAME : el(objName).value,
        	OBJ_INTACT_PERCENT : "100",//el('txt_OBJ_INTACT_PERCENT').value,
        	OBJ_STATUS : el('txt_OBJ_STATUS').value,
        	OBJ_INTACT_DESC : "1",//el('txt_OBJ_INTACT_DESC').value,
        	OBJ_KEEPER : "ad",//el('txt_OBJ_KEEPER').value,
        	OBJ_CREATE_TIME : new Date().toDateTimeString(),
        	OBJ_MODIFY_TIME : new Date().toDateTimeString(),
        	OBJ_MODIFY_USER : jetsennet.Application.userInfo.UserName,
        	OBJ_SPECS : "1",//el('txt_OBJ_SPECS').value,
        	OBJ_DESC : "1",//el('txt_OBJ_DESC').value,
        	OBJ_ASS_UID : assId,//el('txt_OBJ_ASS_UID').value
        	OBJ_MAC_ADDRESS : objAddress
        };
        
    },
    onEditSet : function(obj) {
    	
        var val = valueOf(obj, "OBJ_ID", "");
        var conditions = [['OBJ_ID', val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
 	   	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t", null, conditions, 'OBJ_TYPE_ID', null);
 	   	if(result){
 	   		typeId = result[0].OBJ_TYPE_ID;
 	   	}
 	   	//获取资源类型的名称（在obj中获取有问题）
 	   	var conditions = [['OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
 	   	var res = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t", null, conditions, 'OBJ_TYPE_NAME', null);
	   	if(res){
	   		el("txt_OBJ_TYPE_ID").value = res[0].OBJ_TYPE_NAME
	   	}
    	el("txt_OBJ_NAME").value = valueOf(obj, "OBJ_NAME", "");
    	el("txt_OBJ_STATUS").value = valueOf(obj, "OBJ_STATUS", "");
    	objKey = valueOf(obj, "OBJ_KEY", "");
    },
    onEditGet : function(id) {
    	
		el('txt_check').checked = false;
		el('txt_OBJ_d').style.display = "";
        //获取操作用户信息
    	var modifyUser = jetsennet.Application.userInfo.UserName;
    	
    	return {
    		OBJ_ID : id,
    		OBJ_KEY : objKey,
    		OBJ_TYPE_ID : typeId,
    		OBJ_CODE : objCode,
    		OBJ_NAME : el(objName).value,
    		OBJ_INTACT_PERCENT : "100",//el('txt_OBJ_INTACT_PERCENT').value,
    		OBJ_STATUS : el('txt_OBJ_STATUS').value,
    		OBJ_INTACT_DESC : "1",//el('txt_OBJ_INTACT_DESC').value,
    		OBJ_KEEPER : "admin",//el('txt_OBJ_KEEPER').value,
    		OBJ_MODIFY_TIME : new Date().toDateTimeString(),
    		OBJ_MODIFY_USER : modifyUser,
    		OBJ_SPECS : "1",//el('txt_OBJ_SPECS').value,
        	OBJ_DESC : "1",//el('txt_OBJ_DESC').value,
        	OBJ_MAC_ADDRESS : objAddress
    	}
    },
    
});
var gItem;
gCrud.grid.enableMultiSelect=true;
gCrud.grid.ondoubleclick = null;
gCrud.grid.onrowclick = function(item, td) {
	gItem = item;
}

/**
 * 页面初始化
 */
function pageInit() {
 
    gCrud.load();

}

//由类表code获取资源表信息
function queryObj2Rack(id){
	var conditions = [['OBJ_ID', id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],
	                  ['SKU_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'O2R_ID', 'PPN_RENT_OBJ_2_RACK', "t", null, conditions, 'O2R_ID', null);
	return result[0].O2R_ID;
}

//资源类型列表
var selectObjTypeColumns = [{ fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: 155, align: "center", name: "类型名称"},
                            { fieldName: "OBJ_TYPE_CODE", sortField: "OBJ_TYPE_CODE", width: 155, align: "center", name: "类型编码"},
                            { fieldName: "OBJ_TYPE_DESC", sortField: "OBJ_TYPE_DESC", width: 155, align: "center", name: "类型描述"},
                            { fieldName: "OBJ_TYPE_CREATE_TIME", sortField: "OBJ_TYPE_CREATE_TIME", width: 155, align: "center", name: "创建时间"}];
var gTypeCrud = new jetsennet.Crud("divTypeList", selectObjTypeColumns, "divTypePage","order by OBJ_TYPE_CREATE_TIME");
//资源类型ID
var typeId; 
//资源类型Name
var typeName;
var parId;
gTypeCrud.grid.ondoubleclick = null;
/**
 * 单击获取类型Id和Name
 */
gTypeCrud.grid.onrowclick = function(item, td) {
	parId = item.OBJ_TYPE_ID;
	typeName = item.OBJ_TYPE_NAME;
}

/**
 * 资源类型的查询方法
 */
function searchTypeCode(){
	typeId = ""; 
	typeName = "";
	var conditions = [["OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
	var value = jetsennet.util.trim(el('txt_Type_CODE').value);
	if(value){
		//conditions.push(["OBJ_TYPE_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		conditions.push(["OBJ_TYPE_NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gTypeCrud.search(conditions);
}
/**
 * 放置资源类型列表的dialog
 */
function onAddI(){
	var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
	jQuery.extend(_dialog, {
		size : {
			width : 700,
			height : 450
		},
		title : "选择资源类型",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "divPageFrame3" ]
		
	});
	gTypeCrud = $.extend(gTypeCrud, {
	    dao : SYSDAO,
	    tableName : "PPN_RENT_OBJ_TYPE",
	    name : "资源类型",
	    keyId : "t.OBJ_TYPE_ID",
	    conditions :[["OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
	    checkId : "chkType"});
	_dialog.show();
	gTypeCrud.load();

	_dialog.onsubmit = function() {
		typeId = parId;
		if(typeId){
			//getObjInfo();
			_dialog.close();
			el("txt_OBJ_TYPE_ID").value = typeName;
			if(el('txt_OBJ_NAME').value != '' &&el('txt_OBJ_NAME').value != null){
				el('txt_OBJ_NAME').value = ''
			}
		}else{
			jetsennet.alert("请选择一个资源类型！");
			return;
		}
		
	}
	_dialog.showDialog()
}
//点击名称触发的方法
function onObjName(){
	if(el("txt_OBJ_TYPE_ID").value){
		getObjInfo();
	}else{
		jetsennet.alert("请先选择资源类型！");
	}
/*	typeId = ""; 
	typeName = "";*/
}

/**
 * 资源的条件查询（资源编码）
 * 
 */
function searchGoods() {
	
	var conditions = [];
    var value = jetsennet.util.trim(el('txtGoodsCode').value);
    conditions.push(['OBJ_STATUS', 0, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.Numeric ]);
    if(value){
    	 conditions.push( //["t.OBJ_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ],
    			 ["t.OBJ_NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    	 //conditions.push( );
    }
    //conditions.push(['OBJ_ID', objId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]);
    gCrud.search(conditions);
}

var gObj;
function getObjInfo(){
	var tab;
	var iframeUrl;
	var typeValue = typeId;
	if(typeValue == null || typeValue == ""){
		return;
	}
	//获取资源类型表信息
	var conditions = [ [ 'OBJ_TYPE_ID', typeValue, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",
			null, conditions, 't.*', "order by OBJ_TYPE_CREATE_TIME");
	//iframeUrl = "ObjIframe.htm";
	if(result){
		var conditions = [ [ 'OBJ_TYPE_ID', typeValue, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
    	var res = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_OBJ_TYPE_ITEM', "t",
    			null, conditions, 'ITEM_COLUMN_NAME,ITEM_DISPLAY_NAME,ITEM_IS_PK,ITEM_IS_NAME');
    	if(res){
    		tab = result[0].OBJ_TYPE_TABLE_NAME;
    		iframeUrl = result[0].OBJ_TYPE_URL;
    	}else{
    		jetsennet.alert("该类型下没有配置资源！");
    		el("txt_OBJ_TYPE_ID").value = "";
    		return;
    	}
		
	}
		el("iframeObj").src = iframeUrl
							+ "?tableName="+tab
							+ "&typeValue="+typeValue;
	
	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:true,cancelBox:true,size:{width:700,height:430},title:"选择资源"});
	dialog.controls = ["divChooseObj"];
	dialog.onsubmit = function(){
  	var retVal = gObj;
  	
  	if(retVal){
  		el("txt_OBJ_NAME").value=retVal.NAME;
  		objKey = retVal.ID;
  		objCode = retVal.CODE;
  		objAddress = retVal.ADDRESS;
  	}else{
  		jetsennet.alert("请选择一个资源！");
  		return;
  	}
  	jetsennet.ui.Windows.close("choose-object");
  };
  dialog.showDialog();
}

gCrud.msg = function(id){
	$("#standard").empty();
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
    if (checkIds.length != 1) {
        jetsennet.alert("请选择一个资源！");
        return;
    }
    //资源类型ID 资源ID
    var conditions = [ [ 'OBJ_ID', checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t",null, conditions, 'OBJ_TYPE_ID,OBJ_KEY');
	if(result){
		//表名
		var conditions = [ [ 'OBJ_TYPE_ID', result[0].OBJ_TYPE_ID, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",
				null, conditions, 'OBJ_TYPE_TABLE_NAME');
		//资源表说明
		var condition = [ [ 'OBJ_TYPE_ID', result[0].OBJ_TYPE_ID, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
		var res = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_OBJ_TYPE_ITEM', "t",
				null, condition, 'ITEM_COLUMN_NAME,ITEM_DISPLAY_NAME,ITEM_IS_PK,ITEM_IS_NAME');
		
		if(res){
			var varPK;
			for(var i = 0; i < res.length ; i++){
				if(res[i].ITEM_IS_PK == '1'){
					varPK = res[i].ITEM_COLUMN_NAME
					break;
				}
			}
			//查询资源数据
			var conditionTw = [ [ varPK, result[0].OBJ_KEY, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
			var resTw = SYSDAO.queryObjs('commonXmlQuery', varPK, results[0].OBJ_TYPE_TABLE_NAME, "t",
					null, conditionTw, 't.*');
			if(resTw){
				var htm = "<table align='center' style = 'font-size:15px;'>";
				//每行两条数据
				for(var i = 0 ; i < res.length ; i+=2){
					if(res[i].ITEM_IS_PK == '1'){
						i+=1;
					}
					htm += "<tr><td style = 'height:4px'>&nbsp;&nbsp;</td><tdstyle = 'height:4px'>&nbsp;&nbsp;</td></tr><tr>";
					htm+="<td align='center' valign='middle' width ='100px'>"+res[i].ITEM_DISPLAY_NAME+":&nbsp;"+"</td>";
					htm+="<td align='center'>" +"<input type='text' class='form-control' id='txt_OBJ_CODE' value='"+resTw[0][res[i].ITEM_COLUMN_NAME]+"'>"
						+"</input></td>"
					var j = i+1;
					if(j < res.length){
						htm+="<td align='center' valign='middle' width ='100px'>"+res[j].ITEM_DISPLAY_NAME+":&nbsp;"+"</td>";
						htm+="<td align='center'>" +"<input type='text' class='form-control' id='txt_OBJ_CODE' value='"+resTw[0][res[i+1].ITEM_COLUMN_NAME]+"'>"
							+"</input></td>"
					}
					htm+="</tr>"
				}
				htm+="<table>";
				//el('standard').append(htm);
				
				$("#standard").append(htm);
				htm = "";
			}
			
		}
	}
	
	
	
	
	var dialog = new jetsennet.ui.Window("msg-object");
	dialog = jQuery.extend(dialog, {submitBox:true,cancelBox:true,size:{width:690,height:400},title:"资源规格"});
	dialog.controls = ["standard"];
	dialog.onsubmit = function(){
		//$("#standard").replaceAll("");
		jetsennet.ui.Windows.close("msg-object");
		
	}
	dialog.showDialog();
}
function exportSour(){
	 var id;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id,"chkObj");
	if(checkIds.length == 1){
		el("objId").value = checkIds.join(",");
		el("subForm").submit();
	  }
}
//资源类型假删 状态值更新到-99
function remove(id){
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length<1){
		jetsennet.alert("请选择至少一个资源！");
		return;
	}
	jetsennet.confirm("确定删除？",function(){
		for(var i = 0 ;i <checkIds.length ; i++ ){
			var stat = {
					OBJ_ID : checkIds[i],
					OBJ_STATUS : "-99",
					OBJ_CODE : new Date().getTime(),
			        OBJ_MAC_ADDRESS : ""
			}
			 xml = jetsennet.xml.serialize(stat,"jetsennet.jdlm.beans.PpnRentObj");
			 var params = new HashMap();
			 params.put("updateXml",xml);
			 params.put("className","jetsennet.jdlm.beans.PpnRentObj");
			 params.put("isFilterNull", true);
		     var result = SYSDAO.execute("commonObjUpdateByPk", params);
		     if(!(result && result.errorCode == 0)){
		    	 jetsennet.alert("删除出错！");
		    	 return false;
		     }
		}
		searchGoods();
		return true;
	});
	
}

/**
 * 生成授权码
 */
function authorCode(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length !=1){
		jetsennet.alert("请选择一个资源！");
		return;
	}
	var authoercd;
	var conditionTw = [[ "OBJ_ID", checkIds[0], jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 't.*');
	//authoercd = resTw[0].OBJ_ASS_UID + new Date().toDateTimeString() + "7" ;
	var params = new HashMap();
    params.put("START_DATE", new Date().Format("yyMMdd"));
    params.put("DURATIOIN", "7");
    params.put("DEVICE_CODE", resTw[0].OBJ_ASS_UID);
    alert(params);
    var param = (params.toJson());// 转换成JSON数组
    alert(JSON.stringify(param));
    //../../services/rest/PpnEngService/generateCode
    $.ajax({
        url : "../../services/rest/PpnEngService/generateCode",// 后台处理方法
        async : false,
        type : "POST",
        dataType : "json",
        data : param,
        success : function(sResult) {
            if (sResult) {
            	alert(JSON.stringify(sResult));
            	jetsennet.alert(sResult.resultVal);
            } else {
            	jetsennet.error("返回数据为空！");
            }
        },
        error : function(obj, ex) {
        	jetsennet.error("请求异常：" + ex);
        }
    });
    
    /*
    ENGDAO.execute("generateCode", params, 
    		{success : function(resultVal) {
    			jetsennet.alert(resultVal);
    		 }
    		}
    );
    */

}

/**
 * 超级密码
 */
function superCode(){
	var id = null;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id,"chkObj");
	if(checkIds.length <=0){
		jetsennet.alert("请选择资源！");
		return;
	}
		var conditionTw = [[ "OBJ_STATUS", "6", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ],
			               [ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
		var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 't.*');
		if(!resTw){
			jetsennet.alert("请选择出库的资源！");
			return;
		}else{
			//查询资源对象
			var conditions = [ [ 'obj_id', checkIds.join(","), jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
			var res = SYSDAO.queryObjs('commonXmlQuery', 'obj_id', 'ppn_rent_obj', "t",null, conditions, 't.OBJ_CODE');
			var objcode="";
			if(res){
				for(var i = 0;i<res.length;i++){
					objcode+=(res[i].OBJ_CODE)+",";
				}
			}
			var ocode = objcode.substring(0, objcode.length-1);
			//查询出库项
			var conditions = [ [ 'item_code', ocode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
			var result = SYSDAO.queryObjs('commonXmlQuery', 'item_id', 'ppn_rent_out_item', "t",null, conditions, 't.OUT_ID');
		    var outid = "";
		    if(result){
		    	for(var j = 0;j<result.length;j++){
		    		outid+=(result[j].OUT_ID)+",";
		    	}
		    }
		    var outId = outid.substring(0,outid.length-1);
		    //查询出库单
		    var results = SYSDAO.query("commonXmlQuery", "p.out_id", "ppn_rent_out", "p", 
					[["ppn_rent_out_item", "t", "p.out_id = t.out_id", jetsennet.TableJoinType.Left]],
			  		[["p.out_id",outId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In,jetsennet.SqlParamType.String]],	
			  		"p.OUT_ID");
		    var obj = jetsennet.xml.deserialize(results.resultVal, "Record");
		    var outId="";
		    if(obj){
		    	for(var k = 0; k<obj.length;k++){
		    		outId+=(obj[k].OUT_ID)+",";
		    	}
		    }
		    var outid = outId.substring(0,outId.length-1);
		    //查询出库单
		    var condition = [['OUT_ID', outid, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]];
			var objs = SYSDAO.queryObjs('commonXmlQuery', 'OUT_ID', 'PPN_RENT_OUT', "t", null, condition, '*', "order by OUT_CODE DESC" );
			var outids = "";
			if(objs){
				outids = objs[0].OUT_ID;
			}
			var rest = SYSDAO.query("commonXmlQuery", "p.obj_id", "PPN_RENT_OUT", "p", 
					[["PPN_RENT_OUT_ITEM", "t", "p.out_id = t.out_id", jetsennet.TableJoinType.Left]],
			  		[["t.item_code",ocode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In,jetsennet.SqlParamType.String],
			  		 ["p.out_id",outids, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],	
			  		"p.*,t.*");
			 var objs = jetsennet.xml.deserialize(rest.resultVal, "Record");
			 if(objs){
				 for(var l=0;l<objs.length;l++){
					  //objs[l].ITEM_MATH_CODE;
					  jetsennet.alert(objs[l].ITEM_MATH_CODE);
				 }
			 }
		
			
			
		}
}

/**
 * 监看按钮 传json串
 */
function jsonStr(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length != 1){
		jetsennet.alert("请选择一个资源！")
		return;
	}
	var conditionTw = [[ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
	var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 'OBJ_CODE,OBJ_TYPE_ID,OBJ_NAME,OBJ_ASS_UID');
	if(resTw){
		var UId = resTw[0].OBJ_ASS_UID;
		
			
		el("iframeObj_0").src = "../../jdlm/jdlmsystemweb/deviceProgress.htm"+ "?dev_id="+UId;
			
		el("iframeObj_1").src = "../../jdlm/jdlmsystemweb/chartLine.htm" + "?dev_id="+UId;

		var dialog = new jetsennet.ui.Window("choose-object");
		dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:width,height:height},title:"监看"});
		dialog.controls = ["divChooseObj_1"];
		dialog.showDialog();
	}
	/*json字符串转json资源：jQuery.parseJSON(jsonStr);
	json资源转json字符串：JSON.stringify(jsonObj);*/
}

/**
 * 监控
 */
function jsonControl(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length != 1){
		jetsennet.alert("请选择一个资源！")
		return;
	}
	var conditionTw = [[ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
	var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 'OBJ_CODE,OBJ_TYPE_ID,OBJ_NAME,OBJ_ASS_UID');
	if(resTw){
		//var UId = resTw[0].OBJ_ASS_UID;
		/*el("iframeObj").src = "../../jdlm/jdlmsystemweb/controlTask.htm"+ "?obj_name="+resTw[0].OBJ_NAME+"&obj_ass_uid="+resTw[0].OBJ_ASS_UID;*/
		el("iframeObj").src = "../../jdlm/jdlmsystemweb/controlTask.htm"+ "?obj_name="+encodeURI(encodeURI(resTw[0].OBJ_NAME))+"&obj_ass_uid="+encodeURI(encodeURI(resTw[0].OBJ_ASS_UID));
		var dialog = new jetsennet.ui.Window("choose-object");
		dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:width,height:height},title:"监控"});
		dialog.controls = ["divChooseObj"];
		dialog.showDialog();
	}
}

/**
 * 进程
 */
function jsonProcess(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length != 1){
		jetsennet.alert("请选择一个资源！")
		return;
	}
	var conditionTw = [[ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
	var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 'OBJ_CODE,OBJ_TYPE_ID,OBJ_NAME,OBJ_ASS_UID');
	if(resTw){
		var UId = resTw[0].OBJ_ASS_UID;
		el("iframeObj").src = "../../jdlm/jdlmsystemweb/deviceProgressNew.htm"+ "?dev_id="+UId;
		var dialog = new jetsennet.ui.Window("choose-object");
		dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:width,height:height},title:"进程"});
		dialog.controls = ["divChooseObj"];
		dialog.showDialog();
	}
}

function position(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length != 1){
		jetsennet.alert("请选择一个资源！")
		return;
	}
	var para = "";
	if(gItem){
		para = "?deviceName="+gItem.OBJ_ASS_UID;
	}
	window.open("http://101.201.69.224:8080/jamp/jdvn/jdvnsystemweb/devicemap.htm"+para);//deviceName=255
}

/**
 * 是否创建
 */
function reCheck(){
	if(!typeId){
		jetsennet.alert("请选择资源类型！");
		el('txt_check').checked = false;
		return;
	}
	var html = "";
	if(el('txt_check').checked){
		el('txt_OBJ_d').style.display = "none"
				//表名
				var conditions = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
				var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",
						null, conditions, 'OBJ_TYPE_TABLE_NAME');
				//资源表说明
				var condition = [ [ 'OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
				var res = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_OBJ_TYPE_ITEM', "t",
						null, condition, 'ITEM_COLUMN_NAME,ITEM_DISPLAY_NAME,ITEM_IS_PK,ITEM_IS_NAME,ITEM_IS_CREATE_TIME,ITEM_IS_STATUS,ITEM_IS_CODE');
				
				if(res){
					var varPK;
					for(var i = 0; i < res.length ; i++){
						if(res[i].ITEM_IS_PK == '1'){
							varPK = res[i].ITEM_COLUMN_NAME
							break;
						}
					}
						
						//每行两条数据
						html += "<div class=\"form-group\">"
						for(var i = 0 ; i < res.length ; i++){
							
							
							if(res[i].ITEM_IS_PK == '1'){
								continue;
							}
							if(res[i].ITEM_IS_CODE == '1'){
								continue;
							}
							if(res[i].ITEM_IS_CREATE_TIME == '1'){
								continue;
							}
							if(res[i].ITEM_IS_STATUS == '1'){
								continue;
							}
							
							html += "<label for="+res[i].ITEM_COLUMN_NAME+" class=\"col-sm-2 control-label\">"+res[i].ITEM_DISPLAY_NAME+":</label>" +
										"<div class=\"col-sm-4\">" +
										"<div class=\"input-group input-group-sm\">"+
										"<input type=\"text\" class=\"form-control\" id="+res[i].ITEM_COLUMN_NAME+"  /> " +
												"<span class=\"input-group-addon\"style=\"color: Red\">*</span>" +
												"</div>" +
												"</div>"
							if((i+1)%2 == 0 && (i+1) < res.length){
								html += "</div><div class=\"form-group\">"
							}			
							if(i+1 == res.length){
								html+="</div>";
								if((i+1)%2 == 1){
									html+="</div>";
								}
							}					
						}
						
						/*$("#formId").append(html);
						html = "";*/
						el('actId').innerHTML = html;
					
					
				}
			
			
	}else{
		el('actId').innerHTML = "";
		el('txt_OBJ_d').style.display = ""
		
	}
	
}
/**
 * 维保
 */
function maint(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length < 1){
		jetsennet.alert("请选择资源！");
		return;
	}
	var ids = checkIds.join(",");
	el("iframeObj").src = "printOut.htm"
		+ "?objIds="+ids;
	

	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:width,height:height},title:"监控"});
	dialog.controls = ["divChooseObj"];
	dialog.showDialog();
}

//新建出库单
function library() {
	
	var id = null;
	var val = 1;
	var objid;
	
	var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = 1000;
	var height = size.height;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id,"chkObj");
	if(checkIds.length <=0){
		jetsennet.alert("请选择资源！");
		return;
	}
	var title = "";
		if(val==1){
			var conditionTw = [[ "OBJ_STATUS", "6", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ],
				               [ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
			var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 't.*');
			if(resTw){
				jetsennet.alert("请选择在库的资源！");
				return;
			}else{
				var url = "resourceDetail.htm";
				url += "?objId="+checkIds.join(",");
				url += "&type="+val;
				el("iframeSourceWindows").src = url;
			}
			title = "新建出库单"
		}
	gDialog = new jetsennet.ui.Window("show-divSourceWindows");
	jQuery.extend(gDialog, {
		size : {
			width : width,
			height : height
		},
		title : '新建出库单',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divSourceWindows" ];
	gDialog.show();
}
function searchRetu(){
	gCrud.load();
}

//续借出库单
function renew() {
	
	var id = null;
	var val = 2;
	var objid;
	
	var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = 1000;
	var height = size.height;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id,"chkObj");
	if(checkIds.length <=0){
		jetsennet.alert("请选择资源！");
		return;
	}
	var title = "";
	if(val==2){
		var conditionTw = [[ "OBJ_STATUS", "6", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ],
			               [ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
		var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 't.*');
		if(!resTw){
			jetsennet.alert("请选择出库的资源！");
			return;
		}else{
			var url = "resourceDetail.htm";
			url += "?objId="+checkIds.join(",");
			url += "&type="+val;
			el("iframeSourceWindows").src = url;
		}
		title = "续借出库单"
	}
	gDialog = new jetsennet.ui.Window("show-divSourceWindows");
	jQuery.extend(gDialog, {
		size : {
			width : width,
			height : height
		},
		title : '续借出库单',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divSourceWindows" ];
	gDialog.show();
}
function searchRetu(){
	gCrud.load();
}

//--------add by yyf--------------start-----------------
/**
 * 设备入库
 */
function rentReturn(){
	var id = null;
	var val = 1;
	var objid;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id,"chkObj");
	if(checkIds.length <=0){
		jetsennet.alert("请选择资源！");
		return;
	}
	var title = "";
		if(val==1){
			var conditionTw = [[ "OBJ_STATUS", "1,2,3", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ],
				               [ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
			var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 't.*');
			if(resTw){
				jetsennet.alert("请选择出库的资源！");
				return;
			}else{
				
				var conditionT = [[ "OBJ_STATUS", "1,2,3", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotIn, jetsennet.SqlParamType.String ],
					               [ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
				var resT = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionT, 't.*');
				var key = ""

				for(var i = 0 ; i < resT.length; i++){
					var condition = [[ "ITEM_OBJ_CODE", resT[i].OBJ_CODE, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ],
					                 [ "ITEM_OBJ_TYPE", resT[i].OBJ_TYPE_ID, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
					
					var res = SYSDAO.queryObjs('commonXmlQuery', "ITEM_ID", "PPN_RENT_OUT_ITEM", "t",null, condition, 't.*');
					if(res){
						if(i == 0){
							key = res[0].OUT_ID;
						}else if(key != res[0].OUT_ID){
							jetsennet.alert("请选择同一出库单的数据！");
							return;
						}
					}else{
						/*jetsennet.alert("无效的数据！");*/
						return;
					}
				}

				el("iframeObj").src = "../rent/rentReturnDetailFromObj.htm"
					+ "?objId="+checkIds.join(",")
					+ "&type="+val;
			}
			title = "新建入库单"
				
				
			
		}
	
	var dialog = new jetsennet.ui.Window("retrun-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:800,height:500},title:title});
	dialog.controls = ["divChooseObj"];
	dialog.showDialog();
}
//--------add by yyf--------------end-----------------

/**
 * 维保
 */
function maint(){
	var id = null;
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length < 1){
		jetsennet.alert("请选择资源！");
		return;
	}
	var conditionTw = [[ "OBJ_STATUS", "1", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ],
		               [ "OBJ_ID", checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
	var resTw = SYSDAO.queryObjs('commonXmlQuery', "OBJ_ID", "PPN_RENT_OBJ", "t",null, conditionTw, 't.*');
	if(resTw){
		jetsennet.alert("请选择状态为在库的资源进行维保！");
		return;
	}
	var ids = checkIds.join(",");
	el("iframeObj").src = "devMaintIframe.htm"
		+ "?ids="+ids;
	

	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:false,size:{width:width,height:height},title:"维保"});
	dialog.controls = ["divChooseObj"];
	dialog.showDialog();
}

//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}