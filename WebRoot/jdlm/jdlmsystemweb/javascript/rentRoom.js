/**
 * 库房管理
 */
jetsennet.require(["window","pageframe", "layoutit","gridlist", "pagebar", "jetsentree", "validate", "datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);
var gUserColumns = [{ fieldName: "ROOM_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRoom"},
                    { fieldName: "ROOM_CODE", sortField: "ROOM_CODE", width: 200, align: "left", name: "库房代码",},
                    { fieldName: "ROOM_NAME", sortField: "ROOM_NAME", width: 150, align: "center", name: "库房名称",},
                    { fieldName: "ROOM_STATUS", sortField: "ROOM_STATUS", width: 100, align: "center", name: "库房状态",
                    	format: function(val, vals){
     						 if (val == 1) {
     	                            return "可用";}
     	                       else {
     	                            return "不可用";
     	                        }
     					}},
     					
                    {fieldName: "ROOM_TYPE", sortField: "ROOM_TYPE", width: 100, align: "center", name: "库房类型"},
                    {fieldName: "ROOM_LOCATION", sortField: "ROOM_LOCATION", width: 170, align: "center", name: "库房位置",},
                    {fieldName: "ROOM_DESC", sortField: "ROOM_DESC", width: 150, align: "center", name: "库房描述"},
                    {fieldName: "ROOM_CREATE_TIME", sortField: "ROOM_CREATE_TIME", width: 200, align: "center", name: "创建时间",
                    	},
      					
      			
                    { fieldName: "ROOM_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "ROOM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divRentRoomList", gUserColumns, "divRentRoomPage"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_ROOM",
    name : "库房",
    className : "jetsennet.jdlm.beans.PpnRentRoom",
    keyId : "t.ROOM_ID",
   // resultFields : "t.WSLOG_ID,t.WSLOG_CODE,t.WSLOG_TARGETSYS",
    checkId : "chkRoom",
    cfgId : "divRentRoom",
    onAddInit : function() {
        $('#myTab a:first').tab('show');     
    },
    onAddValid : function() {
        return !_checkFuncExist();
    },
    onAddGet : function() {
        return {
        	ROOM_CODE : el('ROOM_CODE').value,
        	ROOM_NAME : el('ROOM_NAME').value,
        	ROOM_STATUS : el('ROOM_STATUS').value,
        	ROOM_TYPE : el('ROOM_TYPE').value,
        	ROOM_LOCATION : el('ROOM_LOCATION').value,
        	ROOM_DESC : el('ROOM_DESC').value,
        	ROOM_CREATE_TIME:new Date().toDateTimeString()
               
        };
    },
    addDlgOptions : {size : {width :600, height : 500}},
    onEditInit : function() {
    	el('ROOM_CODE').disabled = true;
    	el('ROOM_NAME').disabled = true;
        $('#myTab a:first').tab('show');   
     
    },
    onEditSet : function(obj) {
    	el('ROOM_CODE').value = valueOf(obj, "ROOM_CODE", "");
        el("ROOM_NAME").value = valueOf(obj, "ROOM_NAME", "");
        el("ROOM_STATUS").value = valueOf(obj, "ROOM_STATUS", "");
        el("ROOM_TYPE").value = valueOf(obj, "ROOM_TYPE", "");
        el("ROOM_LOCATION").value = valueOf(obj, "ROOM_LOCATION", "");        
        el("ROOM_DESC").value = valueOf(obj, "ROOM_DESC", "");     
    }, 
    onEditGet : function(id) {
            return {
            	ROOM_ID:id,
            	ROOM_CODE : el('ROOM_CODE').value,
            	ROOM_NAME : el('ROOM_NAME').value,
            	ROOM_STATUS : el('ROOM_STATUS').value,
            	ROOM_TYPE : el('ROOM_TYPE').value,
            	ROOM_LOCATION : el('ROOM_LOCATION').value,
            	ROOM_DESC : el('ROOM_DESC').value,  
            	
            	
      
            };
        },
        editDlgOptions : {size : {width : 600, height : 500}},
    
});

/**
 * 页面初始化
 */
function pageInit() {
	gCrud.load()
 
}

/**
 *   新建任务
 */
gCrud.add = function() {
    var $this = this;
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
        var params = new HashMap();
        params.put("className", "jetsennet.jdlm.beans.PpnRentRoom");
        params.put("saveXml", jetsennet.xml.serialize(obj, "PPN_RENT_ROOM"));
        var result = SYSDAO.execute("commonObjInsert", params);
        if (result && result.errorCode == 0) {
            if (this.onAddSuccess) {
                this.onAddSuccess(obj);
            }
            gCrud.load();
            return true;
        }
    };
    dialog.showDialog();
};

/**
 * 编辑任务
 */
jetsennet.Crud.prototype.edit = function(id) {
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
        oldObj = SYSDAO.queryObj("commonXmlQuery", this.keyId, this.tableName, this.tabAliasName, null, conditions);
        if (oldObj) {
            this.onEditSet(oldObj);
        }
    }
    
    dialog.onsubmit = function() {
        var areaElements = jetsennet.form.getElements($this.cfgId);
        if (!jetsennet.form.validate(areaElements, true)) {
            return false;
        }
        if ($this.onEditValid && !$this.onEditValid(checkIds[0], oldObj)) {
            return false;
        }
        var obj = $this.onEditGet(checkIds[0], $this.oldObj);
        var params = new HashMap();
        params.put("className", "jetsennet.jdlm.beans.PpnRentRoom");
        params.put("updateXml", jetsennet.xml.serialize(obj, "PPN_RENT_ROOM"));
        params.put("isFilterNull", true);
        var result = SYSDAO.execute("commonObjUpdateByPk", params);
        if (result && result.errorCode == 0) {
            if (this.onEditSuccess) {
                this.onEditSuccess(obj);
            }
            gCrud.load();
            return true;
        }
    };
    dialog.showDialog();
};
/**
 * 删除任务
 */
jetsennet.Crud.prototype.remove = function(id) {
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
        return $this.directRemove(checkIds.join(","));
    });
};

/**
 * 查询
 */

function searchRoom() {
    var conditions = [];
    var subConditions = [];
    if(el('txt_DESC').value){
    subConditions.push([[ "t.ROOM_CODE",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ],
	                 [ "t.ROOM_NAME", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ],
    				 [ "t.ROOM_DESC", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]]);
    }
    gCrud.search(conditions, subConditions);
}
/**
 * 双击进入货架管理页面
 */
gCrud.grid.ondoubleclick = function(obj){
	vals = obj.ROOM_ID;	
    location.href = "rackManage.htm?room_id=" + vals;

}

/**
 * 检查使用库房代码和库房名称是否存在
 * @returns {Boolean}
 * @private
 */
function _checkFuncExist() {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", "UOM_ID", "PPN_RENT_OBJ_UOM", null, null,null, "UOM_CODE,");
    if (funcs) {
        var CODE = el("UOM_CODE").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].UOM_CODE) {
                jetsennet.alert("该单位代码已被使用！");
                el('UOM_CODE').focus();
                return true;
            }
        }
    }
    return false;
}
/**
 * 检查使用库房代码和名称是否存在
 * @returns {Boolean}
 * @private
 */
function _checkFuncExist() {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", "ROOM_ID", "PPN_RENT_ROOM", null, null,null, "ROOM_CODE,ROOM_NAME");
    if (funcs) {
        var CODE = el("ROOM_CODE").value;
        var NAME = el("ROOM_NAME").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].ROOM_CODE) {
                jetsennet.alert("该库房代码已被使用！");
                el('ROOM_CODE').focus();
                return true;
            }
        }
        for (var i = 0; i < funcs.length; i++) {
            if (NAME == funcs[i].ROOM_NAME) {
                jetsennet.alert("该库房名称已被使用！");
                el('ROOM_NAME').focus();
                return true;
            }
        }
    }
    return false;
}
gCrud.show=function show(id){
	  var $this = this;
	    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
	    if (checkIds.length != 1) {
	        jetsennet.alert("请选择一个要展示的" + this.name + "！");
	        return;
	    }
	    var vals=checkIds[0];
	    location.href = "roomshow.htm?id=" + vals;
	    
}