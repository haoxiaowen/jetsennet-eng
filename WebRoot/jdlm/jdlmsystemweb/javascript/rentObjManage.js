/**
 * 对象管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
//存放从获取对象的表得到的对象主键
var objKey;
var assId;
var gGoodsColumns = [{ fieldName: "OBJ_ID", width: 30, align: "center", isCheck: 1, checkName: "chkObj"},
                   { fieldName: "OBJ_TYPE_ID", sortField: "OBJ_TYPE_ID", width: 100, align: "center", name: "对象类型",format: function(val, vals){
                	   var conditions = [['OBJ_TYPE_ID', val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
                	   var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t", null, conditions, 'OBJ_TYPE_NAME', null);
                	   if(result && result.length>0) {
                		   return result[0].OBJ_TYPE_NAME;
                	   }
                   }},

                   { fieldName: "OBJ_CODE", sortField: "OBJ_CODE", width: 135, align: "center", name: "编码"},
                   { fieldName: "OBJ_NAME", sortField: "OBJ_NAME", width: 135, align: "center", name: "名称"},
                   { fieldName: "OBJ_INTACT_PERCENT", sortField: "OBJ_INTACT_PERCENT", width: 135, align: "center", name: "完好度百分比"},
                   { fieldName: "OBJ_STATUS", sortField: "OBJ_STATUS", width: 80, align: "center", name: "状态", format: function(val, vals){
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
                    { fieldName: "OBJ_INTACT_DESC", sortField: "OBJ_INTACT_DESC", width: 80, align: "center", name: "完好度描述"},
                    { fieldName: "OBJ_KEEPER", sortField: "OBJ_KEEPER", width: 80, align: "center", name: "保管员"},
                    { fieldName: "OBJ_CREATE_TIME", sortField: "OBJ_CREATE_TIME", width: 145, align: "center", name: "创建时间"},
                    { fieldName: "OBJ_MODIFY_TIME", sortField: "OBJ_MODIFY_TIME", width: 145, align: "center", name: "更新时间"},
                    { fieldName: "OBJ_MODIFY_USER", sortField: "OBJ_MODIFY_USER", width: 100, align: "center", name: "更新人员"},
                    
                    { fieldName: "OBJ_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("remove('" + val + "')");
                    }},
                    { fieldName: "OBJ_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }}];
var gCrud = $.extend(new jetsennet.Crud("divGoodsList", gGoodsColumns, "divGoodsPage","order by OBJ_CREATE_TIME"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ",
    name : "对象管理",
    className : "jetsennet.jdlm.beans.PpnRentObj",
    keyId : "t.OBJ_ID",
    cfgId : "divGoods",
    checkId : "chkObj",
    conditions : [[ 'OBJ_STATUS', 0, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.Numeric ]],
	addDlgOptions : {size : {width : 600, height : 430}},
	editDlgOptions : {size : {width : 600, height : 430}},
	onAddInit : function (){
		var conditions = [ [ 'OBJ_ID', null, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t",null, conditions, 'OBJ_ASS_UID','order by OBJ_ASS_UID');
		if(results){
			i = results.length-1;
			assId = Number(results[i].OBJ_ASS_UID)+1;
		}else{
			assId = "1"
		}
	},
	onAddValid : function() {
        if (!(el('txt_OBJ_INTACT_PERCENT').value >= 1 && el('txt_OBJ_INTACT_PERCENT').value <=100)) {
            jetsennet.alert('完好度百分比应在1-100之间！');
            el('txt_OBJ_INTACT_PERCENT').focus();
            return false;
        }
        /*if(!(el('txt_OBJ_ASS_UID').value > 0)){
    		jetsennet.alert('资源分配号应是一个整数数字！');
    		return false;
    	}*/
	 	el('divPageFrame2').style.display = "none";
        return true;
    },
    onEditValid : function(id) {
    	if (!(el('txt_OBJ_INTACT_PERCENT').value >= 1 && el('txt_OBJ_INTACT_PERCENT').value <=100)) {
            jetsennet.alert('完好度百分比应在1-100之间！');
            el('txt_OBJ_INTACT_PERCENT').focus();
            return false;
        }
        return true;
    },
	onAddGet : function() {
        return {
        	OBJ_KEY : objKey,
        	OBJ_TYPE_ID :  typeId,
        	OBJ_CODE : new Date().getTime(),
        	OBJ_NAME : el('txt_OBJ_NAME').value,
        	OBJ_INTACT_PERCENT : el('txt_OBJ_INTACT_PERCENT').value,
        	OBJ_STATUS : el('txt_OBJ_STATUS').value,
        	OBJ_INTACT_DESC : el('txt_OBJ_INTACT_DESC').value,
        	OBJ_KEEPER : el('txt_OBJ_KEEPER').value,
        	OBJ_CREATE_TIME : new Date().toDateTimeString(),
        	OBJ_MODIFY_TIME : new Date().toDateTimeString(),
        	OBJ_MODIFY_USER : jetsennet.Application.userInfo.UserName,
        	OBJ_SPECS : el('txt_OBJ_SPECS').value,
        	OBJ_DESC : el('txt_OBJ_DESC').value,
        	OBJ_ASS_UID : assId//el('txt_OBJ_ASS_UID').value
        };
        
    },
    onEditSet : function(obj) {
    	
        var val = valueOf(obj, "OBJ_ID", "");
        var conditions = [['OBJ_ID', val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
 	   	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t", null, conditions, 'OBJ_TYPE_ID', null);
 	   	if(result){
 	   		typeId = result[0].OBJ_TYPE_ID;
 	   	}
 	   	//获取对象类型的名称（在obj中获取有问题）
 	   	var conditions = [['OBJ_TYPE_ID', typeId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
 	   	var res = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t", null, conditions, 'OBJ_TYPE_NAME', null);
	   	if(res){
	   		el("txt_OBJ_TYPE_ID").value = res[0].OBJ_TYPE_NAME
	   	}
 	   	
    	
    	//el("txt_OBJ_CODE").value = valueOf(obj, "OBJ_CODE", "");
    	el("txt_OBJ_NAME").value = valueOf(obj, "OBJ_NAME", "");
    	el("txt_OBJ_INTACT_PERCENT").value = valueOf(obj, "OBJ_INTACT_PERCENT", "");
    	el("txt_OBJ_STATUS").value = valueOf(obj, "OBJ_STATUS", "");
    	el("txt_OBJ_INTACT_DESC").value = valueOf(obj, "OBJ_INTACT_DESC", "");
    	el("txt_OBJ_KEEPER").value = valueOf(obj, "OBJ_KEEPER", "");
        el("txt_OBJ_SPECS").value = valueOf(obj,"OBJ_SPECS","")
        el('txt_OBJ_DESC').value = valueOf(obj,"OBJ_DESC","")
    	objKey = valueOf(obj, "OBJ_KEY", "");
        //el("txt_OBJ_ASS_UID").value = valueOf(obj,"OBJ_ASS_UID","");
    },
    onEditGet : function(id) {
        //获取操作用户信息
    	var modifyUser = jetsennet.Application.userInfo.UserName;
    	
    	return {
    		OBJ_ID : id,
    		OBJ_KEY : objKey,
    		OBJ_TYPE_ID : typeId,
    		//OBJ_CODE : el('txt_OBJ_CODE').value,
    		OBJ_NAME : el('txt_OBJ_NAME').value,
    		OBJ_INTACT_PERCENT : el('txt_OBJ_INTACT_PERCENT').value,
    		OBJ_STATUS : el('txt_OBJ_STATUS').value,
    		OBJ_INTACT_DESC : el('txt_OBJ_INTACT_DESC').value,
    		OBJ_KEEPER : el('txt_OBJ_KEEPER').value,
    		OBJ_MODIFY_TIME : new Date().toDateTimeString(),
    		OBJ_MODIFY_USER : modifyUser,
    		OBJ_SPECS : el('txt_OBJ_SPECS').value,
        	OBJ_DESC : el('txt_OBJ_DESC').value,
        	//OBJ_ASS_UID :el('txt_OBJ_ASS_UID').value
    	}
    },
    
});
gCrud.grid.ondoubleclick = null;
//gObjCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() {
 
    gCrud.load();

}

//由类表code获取对象表信息
function queryObj2Rack(id){
	var conditions = [['OBJ_ID', id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],
	                  ['SKU_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'O2R_ID', 'PPN_RENT_OBJ_2_RACK', "t", null, conditions, 'O2R_ID', null);
	return result[0].O2R_ID;
}

//对象类型列表
var selectObjTypeColumns = [
                            { fieldName: "OBJ_TYPE_CODE", sortField: "OBJ_TYPE_CODE", width: 135, align: "center", name: "类型编码"},
                            { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: 135, align: "center", name: "类型名称"},
                            { fieldName: "OBJ_TYPE_DESC", sortField: "OBJ_TYPE_DESC", width: 135, align: "center", name: "类型描述"},
                            { fieldName: "OBJ_TYPE_CREATE_TIME", sortField: "OBJ_TYPE_CREATE_TIME", width: 135, align: "center", name: "创建时间"}];
var gTypeCrud = new jetsennet.Crud("divTypeList", selectObjTypeColumns, "divTypePage","order by OBJ_TYPE_CREATE_TIME");
//对象类型ID
var typeId; 
//对象类型Name
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
 * 对象类型的查询方法
 */
function searchTypeCode(){
	typeId = ""; 
	typeName = "";
	var conditions = [["OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
	var value = jetsennet.util.trim(el('txt_Type_CODE').value);
	if(value){
		conditions.push(["OBJ_TYPE_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gTypeCrud.search(conditions);
}
/**
 * 放置对象类型列表的dialog
 */
function onAddI(){
	var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
	jQuery.extend(_dialog, {
		size : {
			width : 700,
			height : 450
		},
		title : "选择对象类型",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "divPageFrame3" ]
		
	});
	gTypeCrud = $.extend(gTypeCrud, {
	    dao : SYSDAO,
	    tableName : "PPN_RENT_OBJ_TYPE",
	    name : "对象类型",
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
			jetsennet.alert("请选择一个对象类型！");
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
		jetsennet.alert("请先选择对象类型！");
	}
/*	typeId = ""; 
	typeName = "";*/
}

/**
 * 对象的条件查询（对象编码）
 * 
 */
function searchGoods() {
	
	var conditions = [];
    var value = jetsennet.util.trim(el('txtGoodsCode').value);
    conditions.push(['OBJ_STATUS', 0, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.Numeric ]);
    if(value){
    	 conditions.push( ["t.OBJ_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
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
	//获取对象类型表信息
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
    		jetsennet.alert("该类型下没有配置对象！");
    		el("txt_OBJ_TYPE_ID").value = "";
    		return;
    	}
		
	}
		el("iframeObj").src = iframeUrl
							+ "?tableName="+tab
							+ "&typeValue="+typeValue;
	
	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:true,cancelBox:true,size:{width:700},title:"选择对象"});
	dialog.controls = ["divChooseObj"];
	dialog.onsubmit = function(){
  	var retVal = gObj;
  	
  	if(retVal){
  		el("txt_OBJ_NAME").value=retVal.NAME;
  		objKey = retVal.ID;
  	}else{
  		jetsennet.alert("请选择一个对象！");
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
        jetsennet.alert("请选择一个对象资源！");
        return;
    }
    //对象类型ID 对象ID
    var conditions = [ [ 'OBJ_ID', checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t",null, conditions, 'OBJ_TYPE_ID,OBJ_KEY');
	if(result){
		//表名
		var conditions = [ [ 'OBJ_TYPE_ID', result[0].OBJ_TYPE_ID, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t",
				null, conditions, 'OBJ_TYPE_TABLE_NAME');
		//对象表说明
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
			//查询对象数据
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
	dialog = jQuery.extend(dialog, {submitBox:true,cancelBox:false,size:{width:600,height:400},title:"对象规格"});
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
//对象类型假删 状态值更新到-99
function remove(id){
	var checkIds = this.onGetCheckId ? this.onGetCheckId(id, "chkObj") : jetsennet.Crud.getCheckIds(id, "chkObj");
	if(checkIds.length<1){
		jetsennet.alert("请选择至少一个对象！");
		return;
	}
	jetsennet.confirm("确定删除？",function(){
		for(var i = 0 ;i <checkIds.length ; i++ ){
			var stat = {
					OBJ_ID : checkIds[i],
					OBJ_STATUS : "-99"
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
 * 保存ip表
 */
function addTablib() {
	var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = size.width;
	var height = size.height;
	var url = "../../jdlm/jdlmsystemweb/tablib.htm?";
	el("iframeTablibWin").src = url;
	gDialog = new jetsennet.ui.Window("add-divTablib");
	jQuery.extend(gDialog, {
		size : {
			width : width,
			height : height
		},
		title : '添加ip',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divTablib" ];
	gDialog.show();
}
function searchRetu() {
    var conditions = [];
    gCrud.search(conditions);
}