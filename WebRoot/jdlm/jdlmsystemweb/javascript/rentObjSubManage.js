/**
 * 对象管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
var parentId = "";
var conditionBy = [];
var objId = "";
//var o2rId = "";
var gGoodsColumns = [{ fieldName: "OBJ_ID", width: 30, align: "center", isCheck: 1, checkName: "chkObj"},
                   { fieldName: "OBJ_TYPE_ID", sortField: "OBJ_TYPE_ID", width: 100, align: "center", name: "对象类型",format: function(val, vals){
                	   var conditions = [['OBJ_TYPE_ID', val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
                	   var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t", null, conditions, 'OBJ_TYPE_NAME', null);
                	   if(result && result.length>0) {
                		   return result[0].OBJ_TYPE_NAME;
                	   }
                   }},

                   { fieldName: "OBJ_CODE", sortField: "OBJ_CODE", width: 135, align: "center", name: "编码"},
                   { fieldName: "OBJ_NAME", sortField: "OBJ_NAME", width: 80, align: "center", name: "名称"},
                   { fieldName: "OBJ_INTACT_PERCENT", sortField: "OBJ_INTACT_PERCENT", width: 80, align: "center", name: "完好度百分比"},
                   { fieldName: "OBJ_STATUS", sortField: "OBJ_STATUS", width: 80, align: "center", name: "可用状态", format: function(val, vals){
                	   if (val == '0') {
                           return  "不可用";     
                       } else if (val == '1') {
                           return "可用";
                       }
                   }},
                    { fieldName: "OBJ_INTACT_DESC", sortField: "OBJ_INTACT_DESC", width: 80, align: "center", name: "完好度描述"},
                    { fieldName: "OBJ_KEEPER", sortField: "OBJ_KEEPER", width: 80, align: "center", name: "保管员"},
                    { fieldName: "OBJ_CREATE_TIME", sortField: "OBJ_CREATE_TIME", width: 150, align: "center", name: "创建时间"},
                    { fieldName: "OBJ_MODIFY_TIME", sortField: "OBJ_MODIFY_TIME", width: 150, align: "center", name: "更新时间"},
                    { fieldName: "OBJ_MODIFY_USER", sortField: "OBJ_MODIFY_USER", width: 100, align: "center", name: "更新人员"},
                    
                    { fieldName: "OBJ_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.removes('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divGoodsList", gGoodsColumns, "divGoodsPage","order by OBJ_CREATE_TIME"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ",
    name : "货架管理",
    className : "jetsennet.jdlm.beans.PpnRentObj",
    keyId : "t.OBJ_ID",
    checkId : "chkObj",
    conditions : conditionBy, 
    joinTables : [[ "PPN_RENT_OBJ_2_RACK", "u", "t.OBJ_ID=u.OBJ_ID", jetsennet.TableJoinType.Inner ]],
	addDlgOptions : {size : {width : 600, height : 500}},
	editDlgOptions : {size : {width : 600, height : 500}},
	onAddValid : function() {
        if (!(el('txt_OBJ_INTACT_PERCENT').value >= 1 && el('txt_OBJ_INTACT_PERCENT').value <=100)) {
            jetsennet.alert('完好度百分比应在1-100之间！');
            el('txt_OBJ_INTACT_PERCENT').focus();
            return false;
        }
        var conditions = [['OBJ_CODE', el('txt_OBJ_CODE').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
 	   	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t", null, conditions, 'OBJ_ID', null);
	 	if(result){
	 		 jetsennet.alert('已存在相同编码的对象！');
	 		 return false;
	 	}
        
        return true;
    },

});

gCrud.grid.ondoubleclick = null;
/**
 * 页面初始化
 **/
function pageInit() {
    
    parentId = jetsennet.queryString("SKU_ID");
    if(parentId!=null){
    	getCondition(parentId);
    }
    //searchGoods()
    gCrud.search(conditionBy);
    //gCrud.load();
}
/**
 * 删除、新增时的重置条件操作
 */
function getCondition(parentId){
		conditionNot = [[ 'OBJ_STATUS', 1, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]];
		conditionBy = [];
		objId = "";
		var condition =[['SKU_ID', parentId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
    	var results = SYSDAO.queryObjs('commonXmlQuery', 'O2R_ID', 'PPN_RENT_OBJ_2_RACK', "t", null, condition, 'OBJ_ID', null);
    	if(results){
    		for(var j=0; j < results.length ; j++ ){
    			if(j==results.length-1){
        			objId+=results[j].OBJ_ID;
        			
        			//查询货格中对象condition
        			conditionBy.push(['t.OBJ_ID', objId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]);
        			conditionBy.push(['u.SKU_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
    			}else if(j<results.length-1){
        				objId+=results[j].OBJ_ID+",";
        			}
    			
    			//查询非货格中对象condition
    			conditionNot.push(['OBJ_ID', results[j].OBJ_ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String]);
    			
    		}
    	}else{
    		conditionBy.push(['t.OBJ_ID','', jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
    		conditionBy.push(['u.SKU_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]);
    	}
	}


/**
 * 删除中间表-关系
 * 
 */
gCrud.removes = function(id){
		var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
	    if (checkIds.length == 0) {
	        jetsennet.alert("请选择要删除的对象！");
	        return;
	    }
	    if (this.onRemoveValid && !this.onRemoveValid(checkIds)) {
	        return;
	    }
	    
	    jetsennet.confirm('您确定要删除该对象吗?',function(){
	    	//getCondition(parentId);
	    	var idst = [];
		    for(var i = 0;i < checkIds.length; i++){
		    	idst.push(queryObj2Rack(checkIds[i]));
		    }
		    var ids = idst.join(",");
			var params = new HashMap();
		    params.put("className", "jetsennet.jdlm.beans.PpnRentObj2Rack");
		    params.put("deleteIds", ids);
		    //params.put("isFilterNull", true);
		    var result = SYSDAO.execute("commonObjDelete", params, {wsMode:"WEBSERVICE"});
		    if (result && result.errorCode == 0) {
		        if (this.onRemoveSuccess) {
		            this.onRemoveSuccess(ids);
		        }
		        
		    }
		    searchGoods();
		    return true;
	    });
}


/**由对象ID获取中间表ID
 * 
 * @param id
 * @returns
 */
function queryObj2Rack(id){
	var conditions = [['OBJ_ID', id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],
	                  ['SKU_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'O2R_ID', 'PPN_RENT_OBJ_2_RACK', "t", null, conditions, 'O2R_ID', null);
	return result[0].O2R_ID;
}
//待选对象列表
var gSelectObjColumns = [{ fieldName: "OBJ_ID", width: 30, align: "center", isCheck: 1, checkName: "chkObjs"},
                         { fieldName: "OBJ_CODE", sortField: "OBJ_CODE", width: 100, align: "center", name: "编码"},
                         { fieldName: "OBJ_NAME", sortField: "OBJ_NAME", width: 100, align: "center", name: "名称"},
                         { fieldName: "OBJ_INTACT_PERCENT", sortField: "OBJ_INTACT_PERCENT", width: 100, align: "center", name: "完好度百分比"},
                         { fieldName: "OBJ_INTACT_DESC", sortField: "OBJ_INTACT_DESC", width: 100, align: "center", name: "完好度描述"},
                         { fieldName: "OBJ_KEEPER", sortField: "OBJ_KEEPER", width: 100, align: "center", name: "保管员"},
                         { fieldName: "OBJ_CREATE_TIME", sortField: "OBJ_CREATE_TIME", width: 135, align: "center", name: "创建时间"}];
//获取待选对象的过滤条件
var conditionNot = [[ 'OBJ_STATUS', 1, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]];
var gObjCrud = new jetsennet.Crud("divObjDesc",gSelectObjColumns,"divObjPage","order by OBJ_CREATE_TIME");


/**展示对象
 * 
 * @param id
 */
function showcontent(id) {
		getCondition(parentId);
		gObjCrud = $.extend(gObjCrud, {
			dao : SYSDAO,
			tableName : "PPN_RENT_OBJ",
			name : "角色",
			checkId : "chkObjs",
			conditions : conditionNot
		});
		var _dialog = new jetsennet.ui.Window("obj-divShow");
		jQuery.extend(_dialog, {
			size : {
				width : 700,
				height : 450
			},
			
			title : "新增对象",
			submitBox : true,
			cancelBox : true,
			maximizeBox : false,
			minimizeBox : false,
			controls : [ "divPageFrame2" ]
			
		});
		_dialog.show();
		gObjCrud.load();
	
	_dialog.onsubmit = function(id) {
		
		var checkIds = jetsennet.Crud.getCheckIds(null,gObjCrud.checkId);
	    if (checkIds.length == 0) {
	        jetsennet.alert("请选择要新增的对象");
	        return;
	    }
	    for(var i = 0; i < checkIds.length ; i++){
	    	 var objMoreXml = "<TABLES>";
	     	//向对象货格表插入数据
	         var _TaskFile = {

	         		SKU_ID:parentId,
	         		OBJ_ID:checkIds[i],
	         		
	     	};
	         objMoreXml +=  jetsennet.xml.serialize(_TaskFile,"TABLE").replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentObj2Rack'>");
	         		     
	         objMoreXml += "</TABLES>";
	         var params = new HashMap();
	         params.put("saveXml",objMoreXml);
	         var result = SYSDAO.execute("commonObjsInsert", params);
	    }
	    
	    _dialog.close();
	    searchGoods();//gCrud.load();
	}

}
/**
 * 条件查询（货物编码）
 * @param objName
 */
function searchGoods() {
	getCondition(parentId);
	var conditions = [];
    var value = jetsennet.util.trim(el('txtGoodsCode').value);
    if(value){
    	 conditions.push( ["t.OBJ_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    conditions.push(['t.OBJ_ID', objId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]);
    conditions.push(['u.SKU_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
    gCrud.search(conditions);
}
/**
 * 
 * dialog中的对象查询
 */
function searchObjDia(){
	getCondition(parentId);
	var conditions = conditionNot;
	var value = jetsennet.util.trim(el('txtObjCode').value);
	if(value){
		conditions.push( ["OBJ_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gObjCrud.search(conditions);
	value = "";
}
gObjCrud.adds = function(obj){
	showcontent();
}
gObjCrud.grid.ondoubleclick = null;


