/** ===========================================================================
 * 对象类型
 * ============================================================================
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree","ztree/jquery.ztree.all-3.5", "ztree/jztree",  "validate", "datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);
jetsennet.importCss(["ztree/zTreeStyle"]);
var gParentId;
var gTable_name;
var gId
var editId;
var primary;


var gTypeColumns = [{ fieldName: "OBJ_TYPE_ID", width: 30, align: "center", isCheck: 1, checkName: "chkType"},
           
                    { fieldName: "OBJ_TYPE_CODE", sortField: "OBJ_TYPE_CODE", width: 150, align: "center", name: "对象类型代码"},
                    { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: 150, align: "center", name: "对象类型名称"},
                    { fieldName: "OBJ_TYPE_STATUS", sortField: "OBJ_TYPE_STATUS", width: 100, align: "center", name: "对象类型状态",format: function(val, vals){
						 if (val == 1) {
	                            return "可用";}
	                       else {
	                            return "不可用";
	                        }
					}},
                    {fieldName: "OBJ_TYPE_STATUS_DESC", sortField: "OBJ_TYPE_STATUS_DESC", width: 150, align: "center", name: "类型状态描述"},
                    {fieldName: "OBJ_TYPE_DESC", sortField: "OBJ_TYPE_DESC", width: 200, align: "center", name: "对象类型描述"},
                    {fieldName: "OBJ_TYPE_CREATE_TIME", sortField: "OBJ_TYPE_CREATE_TIME", width: 150, align: "center", name: "创建时间"},
                    { fieldName: "OBJ_TYPE_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "OBJ_TYPE_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divRentObjTypeList", gTypeColumns, "divRentObjTypePage",'order by OBJ_TYPE_CREATE_TIME'), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ_TYPE",
    name : "对象类型",
    className : "jetsennet.jdlm.beans.PpnRentObjType",
    conditions : [["t.OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],              
    keyId : "t.OBJ_TYPE_ID",
   // resultFields : "t.WSLOG_ID,t.WSLOG_CODE,t.WSLOG_TARGETSYS",
    checkId : "chkType",
    cfgId : "divRentObjType",
    onAddInit : function() {
    	 el('OBJ_TYPE_TABLE_NAME').disabled = false;
        el('OBJ_TYPE_URL').value="objIframe.htm";
        _loadObjTypeTree();
    },
    onAddValid : function() {
    	if(!_checkFuncExist()){
            jetsennet.alert("对象代码已存在!");
            return false;
            }
    	  if(!checkTypeNameExist()){
    	        jetsennet.alert("对象名称已存在!");
    	        return false;
    	        }
        return true;
    },
    onAddGet : function() {
        return {        
        	OBJ_TYPE_PARENT_ID : el('OBJ_TYPE_PARENT_ID').value,
        	OBJ_TYPE_CODE : el('OBJ_TYPE_CODE').value,
        	OBJ_TYPE_NAME : el('OBJ_TYPE_NAME').value,
        	OBJ_TYPE_STATUS : el('OBJ_TYPE_STATUS').value,
        	OBJ_TYPE_STATUS_DESC : el('OBJ_TYPE_STATUS_DESC').value,
        	OBJ_TYPE_DESC : el('OBJ_TYPE_DESC').value,
        	OBJ_TYPE_CREATE_TIME : new Date().toDateTimeString(),
        	OBJ_TYPE_URL:  el('OBJ_TYPE_URL').value,
        	OBJ_TYPE_CHECK_RULE : el('OBJ_TYPE_CHECK_RULE').value,
        	OBJ_TYPE_TABLE_NAME : el('OBJ_TYPE_TABLE_NAME').value,   	        
        };
    },
    onEditValid : function(id) {
        if (el('OBJ_TYPE_PARENT_ID').value == id) {
            jetsennet.alert("所属对象类型不为能自身,请重新选择所属对象类型!");
            return false;
        }
        if(!checkTypeEditNameExist(id)){
        jetsennet.alert("对象名称已存在!");
        return false;
        }
        if(!_checkEditCodeExist(id)){
            jetsennet.alert("对象代码已存在!");
            return false;
            }
        return true;
    },
    addDlgOptions : {size : {width :900, height : 470}},
    onEditInit : function() {
    	 el('OBJ_TYPE_TABLE_NAME').disabled = false;
        _loadObjTypeTree();   
    },
    onEditSet : function(obj) {   	
        el("OBJ_TYPE_PARENT_ID").value = valueOf(obj, "OBJ_TYPE_PARENT_ID", "");
        el("OBJ_TYPE_CODE").value = valueOf(obj, "OBJ_TYPE_CODE", ""); 
        el("OBJ_TYPE_NAME").value = valueOf(obj, "OBJ_TYPE_NAME", "");        
        el("OBJ_TYPE_STATUS").value = valueOf(obj, "OBJ_TYPE_STATUS", "");
        el("OBJ_TYPE_STATUS_DESC").value = valueOf(obj, "OBJ_TYPE_STATUS_DESC", "");
        el("OBJ_TYPE_DESC").value = valueOf(obj, "OBJ_TYPE_DESC", "");     
        
        var node = getTreeNodeById("divFunctionTree", obj.OBJ_TYPE_PARENT_ID);
        if (node) {
            $.fn.zTree.getZTreeObj("divFunctionTree").selectNode(node);
            el('OBJ_TYPE_PARENT_NAME').value = node["name"];
        } else {
            el('OBJ_TYPE_PARENT_NAME').value = "";
        }
        el("OBJ_TYPE_URL").value = valueOf(obj, "OBJ_TYPE_URL", "");
        el("OBJ_TYPE_CHECK_RULE").value = valueOf(obj, "OBJ_TYPE_CHECK_RULE", "");
        el("OBJ_TYPE_TABLE_NAME").value = valueOf(obj, "OBJ_TYPE_TABLE_NAME", "");
    }, 
    onEditGet : function(id) {
            return {
            	OBJ_TYPE_ID:id,
            	OBJ_TYPE_PARENT_ID : el('OBJ_TYPE_PARENT_ID').value,
            	OBJ_TYPE_CODE : el('OBJ_TYPE_CODE').value,
            	OBJ_TYPE_NAME : el('OBJ_TYPE_NAME').value,
            	OBJ_TYPE_STATUS : el('OBJ_TYPE_STATUS').value,
            	OBJ_TYPE_STATUS_DESC : el('OBJ_TYPE_STATUS_DESC').value,
            	OBJ_TYPE_DESC : el('OBJ_TYPE_DESC').value,
            	OBJ_TYPE_CREATE_TIME : new Date().toDateTimeString(),
            	OBJ_TYPE_URL:  el('OBJ_TYPE_URL').value,
            	OBJ_TYPE_CHECK_RULE : el('OBJ_TYPE_CHECK_RULE').value,
            	OBJ_TYPE_TABLE_NAME : el('OBJ_TYPE_TABLE_NAME').value,
            };
        },
        editDlgOptions : {size : {width :900, height :470}},
        onCopySet : function(obj) {   	
            el("OBJ_TYPE_PARENT_ID").value = valueOf(obj, "OBJ_TYPE_PARENT_ID", "");
            el("OBJ_TYPE_CODE").value = valueOf(obj, "OBJ_TYPE_CODE", ""); 
            el("OBJ_TYPE_NAME").value = valueOf(obj, "OBJ_TYPE_NAME", "");        
            el("OBJ_TYPE_STATUS").value = valueOf(obj, "OBJ_TYPE_STATUS", "");
            el("OBJ_TYPE_STATUS_DESC").value = valueOf(obj, "OBJ_TYPE_STATUS_DESC", "");
            el("OBJ_TYPE_DESC").value = valueOf(obj, "OBJ_TYPE_DESC", "");     
            
            var node = getTreeNodeById("divFunctionTree", obj.OBJ_TYPE_PARENT_ID);
            if (node) {
                $.fn.zTree.getZTreeObj("divFunctionTree").selectNode(node);
                el('OBJ_TYPE_PARENT_NAME').value = node["name"];
            } else {
                el('OBJ_TYPE_PARENT_NAME').value = "";
            }
            el("OBJ_TYPE_URL").value = valueOf(obj, "OBJ_TYPE_URL", "");
            el("OBJ_TYPE_CHECK_RULE").value = valueOf(obj, "OBJ_TYPE_CHECK_RULE", "");
            el("OBJ_TYPE_TABLE_NAME").value = valueOf(obj, "OBJ_TYPE_TABLE_NAME", "");
        }, 
    
});
gCrud.grid.ondoubleclick = null;


/**
 * 对象关联表字段
 */
var gTypeItemColumns = [{ fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "chkTypeItem"},
                    
                    { fieldName: "ITEM_COLUMN_NAME", sortField: "ITEM_COLUMN_NAME", width: 150, align: "center", name: "字段名"},
                    { fieldName: "ITEM_DISPLAY_NAME", sortField: "ITEM_DISPLAY_NAME", width: 150, align: "center", name: "字段显示名"},
                    { fieldName: "ITEM_IS_PK", sortField: "ITEM_IS_PK", width: 100, align: "center", name: "是否主键",format: function(val, vals){
						 if (val == 1) {
	                            return "是";}
	                       else {
	                            return "否";
	                        }
					}},
                    {fieldName: "ITEM_IS_NAME", sortField: "ITEM_IS_NAME", width: 150, align: "center", name: "是否名称",format: function(val, vals){
						 if (val == 1) {
	                            return "是";}
	                       else {
	                            return "否";
	                        }
					}},
                    
                    { fieldName: "ITEM_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gItemCrud.edit('" + val + "')");
                    }},
                    { fieldName: "ITEM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gItemCrud.remove('" + val + "')");
                    }}
                    ];

var gItemCrud = $.extend(new jetsennet.Crud("divRentObjTypeItemList", gTypeItemColumns, "divRentObjTypeItemPage"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ_TYPE_ITEM",
    name : "对象关联表",
    className : "jetsennet.jdlm.beans.PpnRentObjTypeItem",
    checkId : "chkTypeItem",
    keyId : "t.ITEM_ID",
    cfgId : "divRentObjTypeItem",
        onAddInit : function() {
        },
        onAddValid : function() {
         
           if(checkItemExist()){
           return checkNameExist();}
           else{
        	   return checkItemExist();
           }
        },
        onAddGet : function() {
            return {        
            	OBJ_TYPE_ID : gId,
            	ITEM_COLUMN_NAME : el('ITEM_COLUMN_NAME').value,
            	ITEM_DISPLAY_NAME : el('ITEM_DISPLAY_NAME').value,
            	ITEM_IS_PK : el('ITEM_IS_PK').value,
            	ITEM_IS_NAME : el('ITEM_IS_NAME').value,
            	ITEM_IS_CODE : el('ITEM_IS_CODE').value,
            	ITEM_IS_STATUS : el('ITEM_IS_STATUS').value,
            	ITEM_IS_CREATE_TIME : el('ITEM_IS_CREATE_TIME').value,
            	ITEM_IS_MAC_ADDRESS : el('ITEM_IS_MAC_ADDRESS').value
            };
        },
        addDlgOptions : {size : {width :600, height : 400}},
        onEditValid : function(id) {
        
        	   editId=id;
        	   if(checkItemExist()){
                   return checkNameExist();}
                   else{
                	   return checkItemExist();
                   }
        },
        onEditSet : function(obj) {   	
           
            el("ITEM_COLUMN_NAME").value = valueOf(obj, "ITEM_COLUMN_NAME", ""); 
            el("ITEM_DISPLAY_NAME").value = valueOf(obj, "ITEM_DISPLAY_NAME", "");        
            el("ITEM_IS_PK").value = valueOf(obj, "ITEM_IS_PK", "");
            el("ITEM_IS_NAME").value = valueOf(obj, "ITEM_IS_NAME", "");   
            el("ITEM_IS_CODE").value = valueOf(obj, "ITEM_IS_CODE", ""); 
            el("ITEM_IS_STATUS").value = valueOf(obj, "ITEM_IS_STATUS", ""); 
            el("ITEM_IS_CREATE_TIME").value = valueOf(obj, "ITEM_IS_CREATE_TIME", ""); 
            el("ITEM_IS_MAC_ADDRESS").value = valueOf(obj, "ITEM_IS_MAC_ADDRESS", ""); 
        }, 
        onEditGet : function(id) {
                return {
                	ITEM_ID:id,
                	OBJ_TYPE_ID : gId,
                	ITEM_COLUMN_NAME : el('ITEM_COLUMN_NAME').value,
                	ITEM_DISPLAY_NAME : el('ITEM_DISPLAY_NAME').value,
                	ITEM_IS_PK : el('ITEM_IS_PK').value,
                	ITEM_IS_NAME : el('ITEM_IS_NAME').value,  
                	ITEM_IS_CODE : el('ITEM_IS_CODE').value,
                	ITEM_IS_STATUS : el('ITEM_IS_STATUS').value,
                	ITEM_IS_CREATE_TIME : el('ITEM_IS_CREATE_TIME').value,
                	ITEM_IS_MAC_ADDRESS : el('ITEM_IS_MAC_ADDRESS').value
                };
            },
            editDlgOptions : {size : {width :600, height :400}},
});

/**
 * 页面初始化
 */
function pageInit() {
	gCrud.load()
	//gItemCrud.load();
	addSelectItem();
}

/**
 * 查询类
 */
function searchType() {
    var  conditions =[["t.OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]]
    
    var subConditions = [];
    if(el('txt_DESC').value){
    subConditions.push([[ "t.OBJ_TYPE_NAME",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ]
	                 ]);}
    
    gCrud.search(conditions, subConditions);
}

/**
 * 加载对象类型树
 * @private
 */
function _loadObjTypeTree() {
    var sResult = UUMDAO.query("commonXmlQuery", "OBJ_TYPE_ID", "PPN_RENT_OBJ_TYPE", null, null, [ [ "OBJ_TYPE_STATUS", 1, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ] ], "OBJ_TYPE_ID,OBJ_TYPE_NAME,OBJ_TYPE_PARENT_ID", "Order By OBJ_TYPE_PARENT_ID");
    if (sResult && sResult.errorCode == 0) {
        var onclickEvent = function() {
            var treeNode = getTreeSelectedNodes("divFunctionTree");
            el("OBJ_TYPE_PARENT_ID").value = treeNode["id"];//隐藏Input，用于保存选中的树节点ID
            el("OBJ_TYPE_PARENT_NAME").value = treeNode["name"];//用于显示选中树节点名称
        }
        createTree(sResult.resultVal, "OBJ_TYPE_ID", "OBJ_TYPE_PARENT_ID", "OBJ_TYPE_NAME", "divFunctionTree", onclickEvent, false, null, null, null, true);
    }
}

/**
 * 显示对象类型树
 * @param {String} hideTree 树id
 * @param {String} relate 相对位置控件id
 */
function popHiddenTree(hideTree, relate) {
    var relateWid = $("#" + relate.id).css("width").replace("px", "");
    var minWidth = $("#" + hideTree.id).attr("minWidth").replace("px", "");
    var width = relateWid > minWidth ? relateWid : minWidth;
    $("#" + hideTree.id).css("width", width);
    jetsennet.popup(hideTree, {
        reference : relate
    });
}

/**
 * 检查对象对象类型代码是否存在 编辑情况
 * @returns {Boolean}
 * @private
 */
function _checkEditCodeExist(id) {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", "OBJ_TYPE_ID", "PPN_RENT_OBJ_TYPE", null, null,null);
    if (funcs) {
        var CODE = el("OBJ_TYPE_CODE").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].OBJ_TYPE_CODE && funcs[i].OBJ_TYPE_ID!=id) {
               // jetsennet.alert("该对象类型代码已被使用！");
                el('OBJ_TYPE_CODE').focus();
                return false;
            }
        }
    }
    return true;
}

/**
 * 检查对象对象类型代码是否存在 新增情况
 * @returns {Boolean}
 * @private
 */
function _checkFuncExist() {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", "OBJ_TYPE_ID", "PPN_RENT_OBJ_TYPE", null, null,null);
    if (funcs) {
        var CODE = el("OBJ_TYPE_CODE").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].OBJ_TYPE_CODE) {
               // jetsennet.alert("该对象类型代码已被使用！");
                el('OBJ_TYPE_CODE').focus();
                return false;
            }
        }
    }
    return true;
}
/**
 * 查询所有表名
 */
function queryAllTables(){
	var sqlQuery = new jetsennet.SqlQuery();
	var queryTable = jetsennet.createQueryTable("TABS");
	
	jQuery.extend(sqlQuery,{IsPageResult:0,KeyId:null,PageInfo:null,ResultFields:"TABLE_NAME",               
            QueryTable:queryTable});
    var ws = new jetsennet.Service(SYS_SERVICE);
	ws.soapheader = jetsennet.Application.authenticationHeader;
	ws.async = false;
	ws.async = false;	
	var result = null;
	ws.oncallback = function(ret)
	{
		result = ret.resultVal;
	}
	ws.onerror = function(ex){};
	ws.call("commonXmlQuery",[sqlQuery.toXml()]);
	return result;
}
/**
 * 在select下拉框中注入所有表名
 */
function addSelectItem(){
	var selectObj =el('OBJ_TYPE_TABLE_NAME');
	var data = jetsennet.xml.deserialize(queryAllTables(),"Record");
	var list = selectObj.options;
	list.length = 0;
	if(typeof(data)!= null){
			var i = 0;
			for(var i in data){
				var opt = new Option(data[i].TABLE_NAME,data[i].TABLE_NAME);
				list.add(opt);
				selectObj.selectedIndex = 0;
			}
	}
}
/**
 * 单击事件  点击左边的对象类型grid，显示右边的对象关联表
 */
var gResGrid = gCrud.grid;
gResGrid.onrowclick = resOnRowClick;

function resOnRowClick(item, td) {
	gId = item.OBJ_TYPE_ID;
	gTable_name=item.OBJ_TYPE_TABLE_NAME;
	loadResType(gId);
	queryColums(gTable_name);
	primary=getPrimary();
}

function loadResType(ID){
	var conditions = [["t.OBJ_TYPE_ID", ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	gItemCrud.search(conditions);
}

function getPrimary(){
	 var  jointables = [["user_constraints", "au", "cu.constraint_name = au.constraint_name", jetsennet.TableJoinType.Inner]];
	  var groups = SYSDAO.queryObjs("commonXmlQuery", null, "user_cons_columns ", "cu" , jointables,[ [ "au.table_name ", gTable_name, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],["au.constraint_type ", "P", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
	  return groups[0].COLUMN_NAME;
}
/**
 * 对象关联表新建任务
 */
gItemCrud.add = function() {
    var $this = this;
    if(gId==null || gId=="undefined" || gId==""){
		 jetsennet.alert("没有对象类型，请单击左边表中对象类型");	
		 return false;
	}
    var dialog = jetsennet.Crud.getConfigDialog(this.msgAdd + this.name, this.cfgId, this.addDlgOptions);
    if (this.onAddInit) {
        this.onAddInit();
    }
    dialog.onsubmit = function() {
        var areaElements = jetsennet.form.getElements($this.cfgId);
        if (!jetsennet.form.validate(areaElements, true)) {
            return false;
        }
        if ($this.onAddValid && !$this.onAddValid()) {
            return false;
        }
        var obj = $this.onAddGet();
        return $this.directAdd(obj);
    };
    dialog.showDialog();
};
/*gItemCrud.load=function(){
	loadResType(gId);
}*/

/**
 * 查询该表所有的列信息并将字段名放入select中
 */
function queryColums(gTable_name){
	var objs= SYSDAO.queryObjs("commonXmlQuery", null, "USER_TAB_COLUMNS", null, null, [ [ "TABLE_NAME ", gTable_name, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String] ] );
	  var elm = el("ITEM_COLUMN_NAME");
	    elm.options.length = 0
	    if (objs) {
	        for (var i = 0; i < objs.length; i++) {
	            elm.options.add(new Option(objs[i].COLUMN_NAME, objs[i].COLUMN_NAME));
	        }
	    }
	
}
/**
 * 对象类型编辑任务
 * @param obj
 * @returns {Boolean}
 */

gCrud.edit = function(id) {
    var $this = this;
    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
    if (checkIds.length != 1) {
        jetsennet.alert("请选择一个要" + this.msgEdit + "的" + this.name + "！");
        return;
    }
    
    var dialog = jetsennet.Crud.getConfigDialog(this.msgEdit + this.name, this.cfgId, this.editDlgOptions);
    if (this.onEditInit) {
        this.onEditInit(checkIds[0]);
    }
    
    var oldObj = null;
    if (this.onEditSet) {
        var conditions = [ [ this.keyId, checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
        oldObj = SYSDAO.queryObj(this.objQueryMethodName, this.keyId, this.tableName, this.tabAliasName, null, conditions);
        if (oldObj) {
            this.onEditSet(oldObj);
        }
    }
   var oldTableName= oldObj.OBJ_TYPE_TABLE_NAME
    dialog.onsubmit = function() {
        var areaElements = jetsennet.form.getElements($this.cfgId);
        if (!jetsennet.form.validate(areaElements, true)) {
            return false;
        }
        if ($this.onEditValid && !$this.onEditValid(checkIds[0], oldObj)) {
            return false;
        }
        var obj = $this.onEditGet(checkIds[0], $this.oldObj);
        if(obj.OBJ_TYPE_TABLE_NAME!=oldTableName){
        	deleteItems(obj.OBJ_TYPE_ID);
        	
        	
        }
        return $this.directEdit(obj);
    };
    dialog.showDialog();
};

function deleteItems(id) {
   var groups=SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE_ITEM", null, null, [ [ "OBJ_TYPE_ID ", id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String] ] ,"ITEM_ID");
   var vals = [];
   if(groups){
	for(var i=0;i<groups.length;i++){
		vals.push(groups[i].ITEM_ID)
	}
	var ids=vals.join(",");
	var params = new HashMap();
    params.put("className", "jetsennet.jdlm.beans.PpnRentObjTypeItem");
    params.put("deleteIds",ids);
    var result = SYSDAO.execute("commonObjDelete", params);
    if (result && result.errorCode == 0) {
        if (this.onRemoveSuccess) {
            this.onRemoveSuccess(ids);
        }        
    }
    loadResType(gId);//重新加载一下对象关联表
   }
};

/**
 * 对象类型删除任务
 */
gCrud.remove=function(id){
	  var $this = this;
	    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
	    if (checkIds.length == 0) {
	        jetsennet.alert("请选择要" + this.msgRemove + "的" + this.name + "！");
	        return;
	    }
	    if (this.onRemoveValid && !this.onRemoveValid(checkIds)) {
	        return;
	    }
	    jetsennet.confirm(this.msgConfirmRemove, function() {
	        return deleteALL(checkIds);
	    });
}

function deleteALL(checkIds) {
	for(var i=0;i<checkIds.length;i++){;
		deleteItems(checkIds[i])
	}
	var ids=checkIds.join(",");
    var params = new HashMap();
    params.put("className", "jetsennet.jdlm.beans.PpnRentObjType");
    params.put("deleteIds", ids);
    var result = SYSDAO.execute("commonObjDelete", params);
    if (result && result.errorCode == 0) {
        if (gCrud.onRemoveSuccess) {
        	gCrud.onRemoveSuccess(ids);
        }
        
    }
	gCrud.load();
	gId=null;
    return true;
};

/**
 * 检查字段名是否存在
 * @returns {Boolean}
 * @private
 */
function checkItemExist() {
    var groups = SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_OBJ_TYPE_ITEM", null, null,[ [ "OBJ_TYPE_ID ", gId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String] ]);
    if (groups) {
        var ITEM_COLUMN_NAME = el("ITEM_COLUMN_NAME").value;
        for (var i = 0; i < groups.length; i++) {
            if (ITEM_COLUMN_NAME == groups[i].ITEM_COLUMN_NAME && groups[i].ITEM_ID!=editId) {
                jetsennet.alert("该字段名已经被使用！");
                el('ITEM_COLUMN_NAME').focus();
                return false;
            }
        }
    }
    return true;
}

/**
 * 检查对象类型名字是否存在 编辑情况
 * @returns {Boolean}
 * @private
 */
function checkTypeEditNameExist(id) {
    var groups = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE", null, null,null);
    if (groups) {
        var OBJ_TYPE_NAME = el("OBJ_TYPE_NAME").value;
        for (var i = 0; i < groups.length; i++) {
            if (OBJ_TYPE_NAME == groups[i].OBJ_TYPE_NAME && groups[i].OBJ_TYPE_ID!=id) {
              //  jetsennet.alert("该字段名已经被使用！");
                el('ITEM_COLUMN_NAME').focus();
                return false;
            }
        }
    }
    return true;
}

/**
 * 检查对象类型名字是否存在 新增情况
 * @returns {Boolean}
 * @private
 */
function checkTypeNameExist() {
    var groups = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE", null, null,null);
    if (groups) {
        var OBJ_TYPE_NAME = el("OBJ_TYPE_NAME").value;
        for (var i = 0; i < groups.length; i++) {
            if (OBJ_TYPE_NAME == groups[i].OBJ_TYPE_NAME) {
              //  jetsennet.alert("该字段名已经被使用！");
                el('ITEM_COLUMN_NAME').focus();
                return false;
            }
        }
    }
    return true;
}

/**
 * 检查 “是否名称” 的唯一性
 * @returns {Boolean}
 * @private
 */
function checkNameExist() {
    var groups = SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_OBJ_TYPE_ITEM", null, null,[ [ "OBJ_TYPE_ID ", gId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String] ]);
    if (groups) {
        var ITEM_IS_NAME = el("ITEM_IS_NAME").value;
        if(1==ITEM_IS_NAME){
        for (var i = 0; i < groups.length; i++) {
            if (1 == groups[i].ITEM_IS_NAME && groups[i].ITEM_ID!=editId) {
                jetsennet.alert("“是否名称” 不能为是，请重新更改！");
                el('ITEM_IS_NAME').focus();
                return false;
            }
        }
    }
        }
    return true;
}
/**
 * 判断是否为主键
 */
function isPrimary(){
	var  ITEM_COLUMN_NAME=el('ITEM_COLUMN_NAME').value;
	if(ITEM_COLUMN_NAME==primary){
		el('ITEM_IS_PK').value=1;
	}
	else{
		el('ITEM_IS_PK').value=0;
	}
}

/**
 * 复制任务
 */
gCrud.copy = function(id) {
    var $this = this;
    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
    if (checkIds.length != 1) {
        jetsennet.alert("请选择一个要复制的"+ this.name + "！");
        return;
    }
    
    var dialog = jetsennet.Crud.getConfigDialog("复制" + this.name, this.cfgId, this.editDlgOptions);
    if (this.onEditInit) {
        this.onEditInit(checkIds[0]);
    }
    
    var oldObj = null;
    if (this.onCopySet) {  
    		// var  jointables = [["PPN_RENT_OBJ_TYPE_ITEM", "au", "t.OBJ_TYPE_ID = au.OBJ_TYPE_ID", jetsennet.TableJoinType.Inner]];
         	oldObj = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE ", null, null,[ [ "OBJ_TYPE_ID",  checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);       
        if (oldObj) {
            this.onCopySet(oldObj[0]);
        }
    } 
    el('OBJ_TYPE_TABLE_NAME').disabled = true;
    var objItem=SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE_ITEM ", null , null,[ [ "OBJ_TYPE_ID",  checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
    dialog.onsubmit = function() {
        var areaElements = jetsennet.form.getElements($this.cfgId); 
        if (el('OBJ_TYPE_PARENT_ID').value == checkIds[0]) {
            jetsennet.alert("所属对象类型不为能自身,请重新选择所属对象类型!");
            return false;
        }
        if(!checkTypeNameExist()){
        jetsennet.alert("对象名称已存在!");
        return false;
        }
        if(!_checkFuncExist()){
            jetsennet.alert("对象代码已存在!");
            return false;
            }
        var params = new HashMap();
        var objXml="<TABLES>";
    	var itemXml="";
        var typeXml="<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentObjType'>"
    		+"<OBJ_TYPE_PARENT_ID>" + el('OBJ_TYPE_PARENT_ID').value+ "</OBJ_TYPE_PARENT_ID>"
    		+"<OBJ_TYPE_CODE>" + el('OBJ_TYPE_CODE').value + "</OBJ_TYPE_CODE>"
    		+"<OBJ_TYPE_NAME>" +el('OBJ_TYPE_NAME').value + "</OBJ_TYPE_NAME>"
    		+"<OBJ_TYPE_STATUS>" + el('OBJ_TYPE_STATUS').value + "</OBJ_TYPE_STATUS>"
    		+"<OBJ_TYPE_STATUS_DESC >" + el('OBJ_TYPE_STATUS_DESC').value + "</OBJ_TYPE_STATUS_DESC >"
    		+"<OBJ_TYPE_DESC>" + el('OBJ_TYPE_DESC').value + "</OBJ_TYPE_DESC>"
    		+"<OBJ_TYPE_URL>" + el('OBJ_TYPE_URL').value + "</OBJ_TYPE_URL>"
    		+"<OBJ_TYPE_CHECK_RULE >" + el('OBJ_TYPE_CHECK_RULE').value + "</OBJ_TYPE_CHECK_RULE>"
    		+"<OBJ_TYPE_TABLE_NAME >" + el('OBJ_TYPE_TABLE_NAME').value+ "</OBJ_TYPE_TABLE_NAME>"		
    		+"<OBJ_TYPE_CREATE_TIME >" + new Date().toDateTimeString()+ "</OBJ_TYPE_CREATE_TIME>"
    		+"</TABLE>";   
        if(objItem){
        	for(var i=0;i<objItem.length;i++){
        		itemXml+="<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentObjTypeItem'>"
        			+"<OBJ_TYPE_ID  ref-field='jetsennet.jdlm.beans.PpnRentObjType.OBJ_TYPE_ID'></OBJ_TYPE_ID>"
        			+"<ITEM_COLUMN_NAME >" + objItem[i].ITEM_COLUMN_NAME+ "</ITEM_COLUMN_NAME>"
        			+"<ITEM_DISPLAY_NAME >" + objItem[i].ITEM_DISPLAY_NAME + "</ITEM_DISPLAY_NAME>"
        			+"<ITEM_IS_PK >" + objItem[i].ITEM_IS_PK + "</ITEM_IS_PK>"
        			+"<ITEM_IS_NAME >" + objItem[i].ITEM_IS_NAME + "</ITEM_IS_NAME>"
        			+"<ITEM_IS_CODE >" + objItem[i].ITEM_IS_CODE + "</ITEM_IS_CODE>"
        			+"<ITEM_IS_STATUS >" + objItem[i].ITEM_IS_STATUS + "</ITEM_IS_STATUS>"
        			+"<ITEM_IS_CREATE_TIME >" + objItem[i].ITEM_IS_CREATE_TIME + "</ITEM_IS_CREATE_TIME>"
        			+"<ITEM_IS_MAC_ADDRESS >" + objItem[i].ITEM_IS_MAC_ADDRESS + "</ITEM_IS_MAC_ADDRESS>"
        			+"</TABLE>";
        	}
        }
        objXml+=typeXml+itemXml+"</TABLES>";
        params.put("saveXml", objXml);
        var result = SYSDAO.execute("commonObjsInsert", params);
        if (result && result.errorCode == 0) {
            gCrud.load();
            return true;
        }
    };
    dialog.showDialog();
};
