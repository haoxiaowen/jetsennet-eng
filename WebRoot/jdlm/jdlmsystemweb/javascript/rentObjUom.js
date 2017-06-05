/**
 * 单位管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);
var gUomColumns = [{ fieldName: "UOM_ID", width: 30, align: "center", isCheck: 1, checkName: "chkUom"},
                   { fieldName: "UOM_NAME", sortField: "UOM_NAME", width: 150, align: "center", name: "使用单位名称"},
                   { fieldName: "UOM_STATUS", sortField: "UOM_STATUS", width: 150, align: "center", name: "使用单位状态",
                   	format: function(val, vals){
  						 if (val == 1) {
  	                            return "可用";}
  	                       else {
  	                            return "不可用";
  	                        }
  					}},
  					{fieldName: "UOM_PRICE", sortField: "UOM_PRICE", width: 150, align: "center", name: "使用单价"},
  					{fieldName: "UOM_CURRENCY", sortField: "UOM_CURRENCY", width: 150, align: "center", name: "结算币种",format: function(val, vals){
						 if (val == "CNY") {
	                            return "人民币";}
	                       else {
	                            return "美元";
	                        }
					}},
					{fieldName: "OBJ_TYPE_ID", sortField: "OBJ_TYPE_ID", width: 200, align: "center", name: "资源类型",format: function(val, vals){
	                  	   var conditions = [['OBJ_TYPE_ID', val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]];
	                  	   var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_TYPE_ID', 'PPN_RENT_OBJ_TYPE', "t", null, conditions, 'OBJ_TYPE_NAME', null);
	                  	   if(result && result.length>0) {
	                  		   return result[0].OBJ_TYPE_NAME;
	                  	   }
	                     }},
                    { fieldName: "UOM_CODE", sortField: "UOM_CODE", width: 200, align: "center", name: "使用单位代码",},
                    { fieldName: "UOM_DESC", sortField: "UOM_DESC", width: 200, align: "center", name: "使用单位描述"},
                    {fieldName: "UOM_CREATE_TIME", sortField: "UOM_CREATE_TIME", width: 150, align: "center", name: "创建时间"},
                    { fieldName: "UOM_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "UOM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divRentObjUomList", gUomColumns, "divRentObjUomPage",'order by UOM_CREATE_TIME'), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ_UOM",
    name : "使用单位",
    className : "jetsennet.jdlm.beans.PpnRentObjUom",
    keyId : "t.UOM_ID",
   // resultFields : "t.WSLOG_ID,t.WSLOG_CODE,t.WSLOG_TARGETSYS",
    checkId : "chkUom",
    cfgId : "divRentObjUom",
    onAddInit : function() {
        $('#myTab a:first').tab('show'); 
        el('UOM_CODE').disabled=false;
        rack="";
    },
    onAddValid : function() {
        return !_checkFuncExist();
    },
    onAddGet : function() {
        return {        
        	OBJ_TYPE_ID : el('OBJ_TYPE_ID').value,
        	UOM_CODE : el('UOM_CODE').value,
        	UOM_NAME : el('UOM_NAME').value,
        	UOM_STATUS : el('UOM_STATUS').value,
        	UOM_DESC : el('UOM_DESC').value,
        	UOM_PRICE : el('UOM_PRICE').value,
        	UOM_CURRENCY : el('UOM_CURRENCY').value,
        	UOM_CREATE_TIME : new Date().toDateTimeString()
 
          	        
        };
    },
    addDlgOptions : {size : {width : 500, height : 500}},
    onEditInit : function() {
    	el('UOM_CODE').disabled=true;
        $('#myTab a:first').tab('show');   
     
    },
    onEditSet : function(obj) {
    	el('OBJ_TYPE_ID').value = valueOf(obj, "OBJ_TYPE_ID", "");
        el("UOM_CODE").value = valueOf(obj, "UOM_CODE", "");
        el("UOM_NAME").value = valueOf(obj, "UOM_NAME", ""); 
        el("UOM_STATUS").value = valueOf(obj, "UOM_STATUS", "");        
        el("UOM_DESC").value = valueOf(obj, "UOM_DESC", "");
        el("UOM_PRICE").value = valueOf(obj, "UOM_PRICE", "");
        el("UOM_CURRENCY").value = valueOf(obj, "UOM_CURRENCY", "");
        var groups = SYSDAO.queryObjs("commonXmlQuery", "RACK_ID", "PPN_RENT_OBJ_TYPE", "g",null,[["OBJ_TYPE_ID", obj.OBJ_TYPE_ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
        el("OBJ_TYPE_NAME").value=groups[0].OBJ_TYPE_NAME;
   
    }, 
    onEditGet : function(id) {
            return {
            	UOM_ID:id,
            	OBJ_TYPE_ID : el('OBJ_TYPE_ID').value,
            	UOM_CODE : el('UOM_CODE').value,
            	UOM_NAME : el('UOM_NAME').value,
            	UOM_STATUS : el('UOM_STATUS').value,
            	UOM_DESC : el('UOM_DESC').value,
            	UOM_PRICE : el('UOM_PRICE').value,
            	UOM_CURRENCY : el('UOM_CURRENCY').value,
            	UOM_CREATE_TIME : new Date().toDateTimeString()
            	
      
            };
        },
        editDlgOptions : {size : {width : 500, height :500}},
    
});

/**
 * 页面初始化
 */
function pageInit() {
	gCrud.load()
 
}

/**
 * 查询类
 */
function searchUom() {
    var conditions = [];
    
    var subConditions = [];
    if(el('txt_DESC').value){
    subConditions.push([[ "t.UOM_NAME",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ]
	                 ]);}
    
    gCrud.search(conditions, subConditions);
}

/**
 * 对象类型表格配置
 */

var gSelectRentObjTypeColumns = [ 
	{
	    fieldName : "OBJ_TYPE_ID",
	    width : 150,
	    align: "center",
	    name : "对象类型id"
	},
	{ fieldName : "OBJ_TYPE_NAME",
    width : 150,
    align: "center",
    name : "对象类型名称"
},
{
    fieldName : "OBJ_TYPE_CODE",
    width : 150,
    align: "center",
    name : "对象类型代码"
}];



var gRackCrud = $.extend(new jetsennet.Crud("divRentObjTypeList", gSelectRentObjTypeColumns), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ_TYPE",
    name : "对象类型",
    conditions : [["t.OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],   
    checkId : "chkRack"
});
gRackCrud.grid.ondoubleclick = null;
//角色gird单击事件
var gResGrid = gRackCrud.grid;
gResGrid.onrowclick = resOnRowClick;
var rack;
function resOnRowClick(item, td) {
	rack=item;
}

$("#OBJ_TYPE_NAME").click(function(){
    var dialog = new jetsennet.ui.Window("new-divControl");
    jQuery.extend(dialog, {
        title : "选择对象类型",
        size : {
            width : 520,
            height : 370
        },
        submitBox : true,
        cancelBox : true,
        showScroll : false,
        controls : ["divRentObjType"],
    } );
    dialog.onsubmit = function() {
    if(rack==""){
    	jetsennet.alert("请选择一个对象类型");
    	return ;
    }
    $("#OBJ_TYPE_NAME").val(rack.OBJ_TYPE_NAME);
    $("#OBJ_TYPE_ID").val(rack.OBJ_TYPE_ID);    
        return true;
    };
    dialog.showDialog();
    gRackCrud.load();
});

/**
 * 检查使用单位代码是否存在
 * @returns {Boolean}
 * @private
 */
function _checkFuncExist() {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", "UOM_ID", "PPN_RENT_OBJ_UOM", null, null,null, "UOM_CODE");
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