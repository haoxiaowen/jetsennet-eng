
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
                    { fieldName: "CHECK_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "CHECK_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("ResConfirmList", gPgmRsColumns, "ResConfirmPageBar", "order by CHECK_ID"), {
    dao : UUMDAO,
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
        el("txt_CHECK_STATUS").value = valueOf(obj, "CHECK_STATUS", "");
        el("txt_CHECK_RESULT").value = valueOf(obj, "CHECK_RESULT", "");
        el("txt_CHECK_RESULT_DESC").value = valueOf(obj, "CHECK_RESULT_DESC", "");
        el("txt_CHECK_LEVEL_INDEX").value = valueOf(obj, "CHECK_LEVEL_INDEX", "");
        el('txt_CHECK_LEVEL_NAME').value = valueOf(obj, "CHECK_LEVEL_NAME", "");
        el("txt_CHECK_LEVEL_CODE").value = valueOf(obj, "CHECK_LEVEL_CODE", "");
        el("txt_CHECK_IS_FINAL").value = valueOf(obj, "CHECK_IS_FINAL", "");
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

