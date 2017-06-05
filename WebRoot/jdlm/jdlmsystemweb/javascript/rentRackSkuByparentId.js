/**
 * 货格管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);
var parentId;
var parentName;

var gUserColumns = [{ fieldName: "SKU_ID", width: 30, align: "center", isCheck: 1, checkName: "chkMsg"},
                    { fieldName: "SKU_CODE", sortField: "SKU_CODE", width: 200, align: "left", name: "货格编号",},
                    { fieldName: "SKU_NAME", sortField: "SKU_CODE", width: 200, align: "left", name: "货格名称",},
                    { fieldName: "SKU_ROW_INDEX", sortField: "SKU_ROW_INDEX", width: 100, align: "center", name: "货格行号",},                    
                    { fieldName: "SKU_COLUMN_INDEX", sortField: "SKU_COLUMN_INDEX", width: 100, align: "center", name: "货格列号"},
                    { fieldName: "SKU_LENGTH", sortField: "SKU_LENGTH", width: 100, align: "center", name: "货格长"},
                    { fieldName: "SKU_WIDTH", sortField: "SKU_WIDTH", width: 100, align: "center", name: "货格宽",},
                    {fieldName: "SKU_HIGHTH", sortField: "SKU_HIGHTH", width: 100, align: "center", name: "货格高"},
                    {fieldName: "SKU_STATUS", sortField: "SKU_STATUS", width: 100, align: "center", name: "货格状态",
                    	format: function(val, vals){
      						 if (val == 1) {
      	                            return "启用";}
      	                       else {
      	                            return "禁用";
      	                        }
      					}},
      					
      				{fieldName: "SKU_DESC", sortField: "SKU_DESC", width: 210, align: "center", name: "货格描述"},
                    { fieldName: "SKU_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "SKU_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divRentRackSkuList", gUserColumns, "divRentRackSkuPage",'order by SKU_ID'), {
    dao : SYSDAO,
    tableName : "PPN_RENT_RACK_SKU",
    name : "货格",
    className : "jetsennet.jdlm.beans.PpnRentRackSku",
    keyId : "t.SKU_ID",
   // resultFields : "t.WSLOG_ID,t.WSLOG_CODE,t.WSLOG_TARGETSYS",
    checkId : "chkMsg",
    cfgId : "divRentRackSku",
    onAddInit : function() {
        $('#myTab a:first').tab('show'); 
        rack="";
        $("#RACK_NAME").val(parentName)
    },
    onAddGet : function() {
        return {
        	RACK_ID : parentId,
        	SKU_CODE : el('SKU_CODE').value,
        	SKU_NAME : el('SKU_NAME').value,
        	SKU_ROW_INDEX : el('SKU_ROW_INDEX').value,
        	SKU_COLUMN_INDEX : el('SKU_COLUMN_INDEX').value,
        	SKU_LENGTH : el('SKU_LENGTH').value,
        	SKU_WIDTH : el('SKU_WIDTH').value,
        	SKU_HIGHTH : el('SKU_HIGHTH').value,
        	SKU_STATUS : el('SKU_STATUS').value,
        	SKU_DESC : el('SKU_DESC').value,       	        
        };
    },
    addDlgOptions : {size : {width : 600, height : 500}},
    onEditInit : function() {
        $('#myTab a:first').tab('show');   
     
    },
    onEditSet : function(obj) {
    	el('RACK_ID').value = valueOf(obj, "RACK_ID", "");
    	el('RACK_NAME').value = parentName;
        el("SKU_CODE").value = valueOf(obj, "SKU_CODE", "");
        el("SKU_NAME").value = valueOf(obj, "SKU_NAME", "");
        el("SKU_ROW_INDEX").value = valueOf(obj, "SKU_ROW_INDEX", "");
        el("SKU_COLUMN_INDEX").value = valueOf(obj, "SKU_COLUMN_INDEX", "");
        el("SKU_LENGTH").value = valueOf(obj, "SKU_LENGTH", "");        
        el("SKU_WIDTH").value = valueOf(obj, "SKU_WIDTH", "");
        el("SKU_HIGHTH").value = valueOf(obj, "SKU_HIGHTH", "");       
        el("SKU_STATUS").value = valueOf(obj, "SKU_STATUS", "");
        el("SKU_DESC").value = valueOf(obj, "SKU_DESC", "");
        var groups = SYSDAO.queryObjs("commonXmlQuery", "RACK_ID", "PPN_RENT_RACK", "g",null,[["RACK_ID", obj.RACK_ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
        el("RACK_NAME").value=groups[0].RACK_NAME;
    }, 
    onEditGet : function(id) {
            return {
            	SKU_ID:id,
            	RACK_ID : el('RACK_ID').value,
            	SKU_CODE : el('SKU_CODE').value,
            	SKU_NAME : el('SKU_NAME').value,
            	SKU_ROW_INDEX : el('SKU_ROW_INDEX').value,
            	SKU_COLUMN_INDEX : el('SKU_COLUMN_INDEX').value,
            	SKU_LENGTH : el('SKU_LENGTH').value,
            	SKU_WIDTH : el('SKU_WIDTH').value,
            	SKU_HIGHTH : el('SKU_HIGHTH').value,
            	SKU_STATUS : el('SKU_STATUS').value,
            	SKU_DESC : el('SKU_DESC').value,       	      
            	
      
            };
        },
        editDlgOptions : {size : {width : 600, height : 500}},
    
});

/**
 * 页面初始化
 */
function pageInit() {
	parentId=jetsennet.queryString("id");

	$("#RACK_NAME").val(11)
	
	//el('RACK_NAME').value=11;
		var condition=[ [ 'RACK_ID', parentId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
	 var oldObj = SYSDAO.queryObj("commonXmlQuery", 'RACK_ID', 'PPN_RENT_RACK', 't', null, condition);
	parentName= oldObj.RACK_NAME;
	
		gCrud.search(condition)

	
 
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
        params.put("className","jetsennet.jdlm.beans.PpnRentRackSku");
        params.put("saveXml", jetsennet.xml.serialize(obj, "PPN_RENT_RACK_SKU"));
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
        params.put("className", "jetsennet.jdlm.beans.PpnRentRackSku");
        params.put("updateXml", jetsennet.xml.serialize(obj, "PPN_RENT_RACK_SKU"));
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
 * 查询货格
 */
function searchSku() {
    var conditions=[ [ 'RACK_ID', parentId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
    var subConditions = [];
    if(el('txt_DESC').value){
    subConditions.push([[ "t.SKU_CODE",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ],
	                 [ "t.SKU_DESC", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]]);
    }
    gCrud.search(conditions, subConditions);
}

/**
 * 双击进入货物对象管理页面
 */
gCrud.grid.ondoubleclick = function(obj){
	vals = obj.SKU_ID;	
    location.href = "rentObjSubManage.htm?SKU_ID=" + vals;

}
