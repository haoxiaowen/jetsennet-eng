

jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor","datepicker", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);
/**
查询审核列表
*/
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var gPgmRsColumns = [{ fieldName: "CHECK_ID", width: 30, align: "center", isCheck: 1, checkName: "chkPgmRs"},
                    { fieldName: "CHECK_USER", sortField: "CHECK_USER",  align: "center", name: "审核人员"},
                    { fieldName: "CHECK_OBJ_TYPE", sortField: "CHECK_OBJ_TYPE",  align: "center", name: "对象类型",format: function(val, vals){
                    	if(val == 1){
                    		return "借用申请单审核";
                    	}else if (val == 2) {
                            return "借用出库单审核";
                        }else if (val == 3) {
                            return "借用入库单审核";
                        }else{
                        	return "等等待定";
                        }
                    	
                    }},
                    { fieldName: "CHECK_OBJ_CODE", sortField: "CHECK_OBJ_CODE",  align: "center", name: "对象单据号"},
                    { fieldName: "CHECK_STATUS", sortField: "CHECK_STATUS",  align: "center", name: "审核状态",format: function(val, vals){
                    	if (val == 1) {
                            return "已审核";
                        } else if (val == 0) {
                            return "未审核";
                        }
                    }},
                    { fieldName: "CHECK_RESULT", sortField: "CHECK_RESULT",  align: "center", name: "审核结果",format: function(val, vals){
                    	if (val == 1) {
                            return "通过";
                        } else if (val == 0) {
                            return "未通过";
                        }
                    }},
                    { fieldName: "CHECK_RESULT_DESC", sortField: "CHECK_RESULT_DESC",  align: "center", name: "审核结果描述"},
                    { fieldName: "CHECK_LEVEL_INDEX", sortField: "CHECK_LEVEL_INDEX",  align: "center", name: "审核级别序号"},
                    { fieldName: "CHECK_LEVEL_NAME", sortField: "CHECK_LEVEL_NAME",  align: "center", name: "审核级别名称"},
                    { fieldName: "CHECK_LEVEL_CODE", sortField: "CHECK_LEVEL_CODE",  align: "center", name: "审核级别代码"},
                    { fieldName: "CHECK_IS_FINAL", sortField: "CHECK_IS_FINAL",  align: "center", name: "是否终审",format: function(val, vals){
                    	if (val == 1) {
                            return "是";
                        } else if (val == 0) {
                            return "否";
                        }
                    }},
                    { fieldName: "CHECK_TIME", sortField: "CHECK_TIME",  align: "center", name: "审核时间"},
                    { fieldName: "CHECK_ID", width: 45, align: "center", name: "审核", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "CHECK_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("ResConfirmList", gPgmRsColumns, "ResConfirmPageBar", "order by CHECK_ID"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_CHECK",
    name : "审核信息",
    className : "PpnRentCheck",
    checkId : "chkPgmRs",
    keyId : "t.CHECK_ID",
    cfgId : "addaudit",
    //{Function} 新建初始化时触发
    onAddInit : function() {
        $('#myTab a:first').tab('show');
        el('txt_CHECK_STATUS').disabled = true;
        el('txt_CHECK_RESULT').disabled = true;
    },
    //添加审核信息
    onAddGet : function() {
        return {
        	CHECK_USER : el('txt_CHECK_USER').value,
        	CHECK_OBJ_TYPE : el('txt_CHECK_OBJ_TYPE').value,
        	CHECK_OBJ_CODE : el('txt_CHECK_OBJ_CODE').value,
        	CHECK_STATUS : 0,
        	CHECK_RESULT : 0,
        	CHECK_RESULT_DESC : el('txt_CHECK_RESULT_DESC').value,
        	CHECK_LEVEL_INDEX : el('txt_CHECK_LEVEL_INDEX').value,
        	CHECK_LEVEL_NAME : el('txt_CHECK_LEVEL_NAME').value,
           	CHECK_LEVEL_CODE : el('txt_CHECK_LEVEL_CODE').value,
           	CHECK_IS_FINAL : el('txt_CHECK_IS_FINAL').value,
           	CHECK_TIME : el('txt_CHECK_TIME').value,
        };
    },
    addDlgOptions : {size : {width : 700, height : 500}},
    
    //{Function} 编辑初始化时触发
    onEditInit : function() {
    	el('txt_CHECK_STATUS').disabled = false;
    	el('txt_CHECK_RESULT').disabled = false;
    },
    //回显审核信息
    onEditSet : function(obj) {
        el("txt_CHECK_USER").value = valueOf(obj, "CHECK_USER", "");
        el("txt_CHECK_OBJ_TYPE").value = valueOf(obj, "CHECK_OBJ_TYPE", "");
        el("txt_CHECK_OBJ_CODE").value = valueOf(obj, "CHECK_OBJ_CODE", "");
        //el("txt_CHECK_STATUS").value = valueOf(obj, "CHECK_STATUS", "");
        //el("txt_CHECK_RESULT").value = valueOf(obj, "CHECK_RESULT", "");
        el("txt_CHECK_RESULT_DESC").value = valueOf(obj, "CHECK_RESULT_DESC", "");
        el("txt_CHECK_LEVEL_INDEX").value = valueOf(obj, "CHECK_LEVEL_INDEX", "");
        el('txt_CHECK_LEVEL_NAME').value = valueOf(obj, "CHECK_LEVEL_NAME", "");
        el("txt_CHECK_LEVEL_CODE").value = valueOf(obj, "CHECK_LEVEL_CODE", "");
        //el("txt_CHECK_IS_FINAL").value = valueOf(obj, "CHECK_IS_FINAL", "");
        el("txt_CHECK_TIME").value = valueOf(obj, "CHECK_TIME", "");
    },
    //编辑审核信息
    onEditGet : function(id) {
        return {
        	CHECK_ID : id,
        	CHECK_USER : el('txt_CHECK_USER').value,
        	CHECK_OBJ_TYPE : el('txt_CHECK_OBJ_TYPE').value,
        	CHECK_OBJ_CODE : el('txt_CHECK_OBJ_CODE').value,
        	CHECK_STATUS : el('txt_CHECK_STATUS').value,
        	CHECK_RESULT : el('txt_CHECK_RESULT').value,
        	CHECK_RESULT_DESC : el('txt_CHECK_RESULT_DESC').value,
        	CHECK_LEVEL_INDEX : el('txt_CHECK_LEVEL_INDEX').value,
        	CHECK_LEVEL_NAME : el('txt_CHECK_LEVEL_NAME').value,
           	CHECK_LEVEL_CODE : el('txt_CHECK_LEVEL_CODE').value,
           	CHECK_IS_FINAL : el('txt_CHECK_IS_FINAL').value,
           	CHECK_TIME : el('txt_CHECK_TIME').value,
        };
    },
    editDlgOptions : {size : {width : 700, height : 500}},
    //删除审核信息
    onRemoveValid : function(checkIds) {
        return true;
    }
});
gCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() {
	gCrud.load();
}


/**
 * 修改出库单审核状态
 */
gCrud.edit=function edit(id) {
	var $this = this;
    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
    if (checkIds.length != 1) {
        jetsennet.alert("请选择一个要" + this.msgEdit + "的" + this.name + "！");
        return;
    }
    var dialog = jetsennet.Crud.getConfigDialog( this.msgEdit + this.name,this.cfgId, this.editDlgOptions);
 
    dialog.controls = ["addaudit"];
    if (this.onEditInit) {
        this.onEditInit(checkIds[0]);
    }
    
    var oldObj = null;
    var outId=null;
   
    if (this.onEditSet) {
        var conditions = [ [ this.keyId, checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
        oldObj = this.dao.queryObj( "commonXmlQuery", this.keyId, this.tableName, this.tabAliasName, null, conditions);
        if (oldObj) {
            this.onEditSet(oldObj);
        }
    }
    var code=el('txt_CHECK_OBJ_CODE').value;
    var type=el('txt_CHECK_OBJ_TYPE').value;
    
    dialog.onsubmit = function() {  
    var objXml = "";
    //修改出库单审核状态
    	if(type==2){
    		var rentout= SYSDAO.queryObj( "commonXmlQuery", null, "PPN_RENT_OUT", "t", null, [ [ "t.OUT_CODE", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ]);
    		outId=rentout.OUT_ID;
    		objXml = "<TABLES>";
            var _Task = {
            		CHECK_ID : oldObj.CHECK_ID,
                	CHECK_USER : el('txt_CHECK_USER').value,
                	CHECK_OBJ_TYPE : el('txt_CHECK_OBJ_TYPE').value,
                	CHECK_OBJ_CODE : el('txt_CHECK_OBJ_CODE').value,
                	CHECK_STATUS : el('txt_CHECK_STATUS').value,
                	CHECK_RESULT : el('txt_CHECK_RESULT').value,
                	CHECK_RESULT_DESC : el('txt_CHECK_RESULT_DESC').value,
                	CHECK_LEVEL_INDEX : el('txt_CHECK_LEVEL_INDEX').value,
                	CHECK_LEVEL_NAME : el('txt_CHECK_LEVEL_NAME').value,
                   	CHECK_LEVEL_CODE : el('txt_CHECK_LEVEL_CODE').value,
                   	CHECK_IS_FINAL : el('txt_CHECK_IS_FINAL').value,
                   	CHECK_TIME : el('txt_CHECK_TIME').value,
            };
            objXml +=  jetsennet.xml.serialize(_Task,"TABLE"). replace("<TABLE>","<TABLE CLASS_NAME='PpnRentCheck'>");
            var _File= {  
            		OUT_ID:outId,
            		OUT_STATUS : el('txt_CHECK_STATUS').value,
            		OUT_CODE : el('txt_CHECK_OBJ_CODE').value,
                  
                  };
            var _fileXml=  jetsennet.xml.serialize(_File,"TABLE"). replace("<TABLE>","<TABLE CLASS_NAME='PpnRentOut'>");
           
        			
        		_fileXml = _fileXml.replace("<OUT_CODE></OUT_CODE>", "<OUT_CODE ref-field='PpnRentCheck.CHECK_OBJ_CODE' />");
        	
            objXml += _fileXml;
            objXml+="</TABLES>";
    	}
    
    //修改申请单审核状态
    	else if(type == 1){
    		var rentout= SYSDAO.queryObj( "commonXmlQuery", null, "PPN_RENT_ORD", "t", null, [ [ "t.ORD_CODE", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ]);
    		ordId=rentout.ORD_ID;
       
        	 objXml = "<TABLES>";
                var _Task = {
                		CHECK_ID :  oldObj.CHECK_ID,
                    	CHECK_USER : el('txt_CHECK_USER').value,
                    	CHECK_OBJ_TYPE : el('txt_CHECK_OBJ_TYPE').value,
                    	CHECK_OBJ_CODE : el('txt_CHECK_OBJ_CODE').value,
                    	CHECK_STATUS : el('txt_CHECK_STATUS').value,
                    	CHECK_RESULT : el('txt_CHECK_RESULT').value,
                    	CHECK_RESULT_DESC : el('txt_CHECK_RESULT_DESC').value,
                    	CHECK_LEVEL_INDEX : el('txt_CHECK_LEVEL_INDEX').value,
                    	CHECK_LEVEL_NAME : el('txt_CHECK_LEVEL_NAME').value,
                       	CHECK_LEVEL_CODE : el('txt_CHECK_LEVEL_CODE').value,
                       	CHECK_IS_FINAL : el('txt_CHECK_IS_FINAL').value,
                       	CHECK_TIME : el('txt_CHECK_TIME').value,
                };
                objXml +=  jetsennet.xml.serialize(_Task,"TABLE"). replace("<TABLE>","<TABLE CLASS_NAME='PpnRentCheck'>");
                var _File= {  
                		ORD_ID:ordId,
                		ORD_STATUS :3,
                		ORD_CODE : el('txt_CHECK_OBJ_CODE').value,
                      };
                var _fileXml=  jetsennet.xml.serialize(_File,"TABLE"). replace("<TABLE>","<TABLE CLASS_NAME='PpnRentOrd'>");
               
            			
            		_fileXml = _fileXml.replace("<ORD_CODE></ORD_CODE>", "<ORD_CODE ref-field='PpnRentCheck.CHECK_OBJ_CODE' />");
            	
                objXml += _fileXml;
                objXml+="</TABLES>";
        	}  
//    		console.debug(objXml);
            var params = new HashMap();
            params.put("updateXml", objXml);
            params.put("isFilterNull", true);
            SYSDAO.execute("commonObjsUpdateByPk", params, 
            		{success : function(resultVal) {
            			dialog.close();
            			jetsennet.ui.Windows.close("new-assignment"); 
            			gCrud.load();
            		 },
            		 wsMode:"WEBSERVICE"
            		}
            
            );
        }
 
    dialog.showDialog();
}
/**
 * 查询
 */
function searchConfirm() {
	var conditions = [];
    if($('#condition').val()){
    	conditions.push([ "t.CHECK_USER", $('#condition').val(), jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    	conditions.push([ "t.CHECK_OBJ_CODE", $('#condition').val(), jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gCrud.search(conditions);
}

