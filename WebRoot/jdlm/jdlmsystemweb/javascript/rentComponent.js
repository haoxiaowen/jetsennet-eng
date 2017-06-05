/**
 * 配件管理
 */
jetsennet.require(["window","pageframe", "layoutit","gridlist", "pagebar", "jetsentree", "validate", "datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);
var gUserColumns = [{ fieldName: "COMP_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRoom"},
                    { fieldName: "COMP_NAME", sortField: "COMP_NAME", width: 200, align: "left", name: "配件名称",},
                    { fieldName: "COMP_CODE", sortField: "COMP_CODE", width: 150, align: "center", name: "配件代码",},
                    { fieldName: "COMP_TYPE", sortField: "COMP_TYPE", width: 100, align: "center", name: "配件类型",
                    	format: function(val, vals){
     						 if (val == 1) {
     	                            return "鼠标";}
     	                       else {
     	                            return "其他";
     	                        }
     					}},
     					
                    {fieldName: "COMP_TOTAL_NUM", sortField: "COMP_TOTAL_NUM", width: 100, align: "center", name: "配件总数量"},
                    {fieldName: "COMP_ALIVE_NUM", sortField: "COMP_ALIVE_NUM", width: 170, align: "center", name: "可用数量",},
                    {fieldName: "COMP_DESC", sortField: "COMP_DESC", width: 150, align: "center", name: "配件描述"},
                    {fieldName: "COMP_CREATE_TIME", sortField: "COMP_CREATE_TIME", width: 200, align: "center", name: "创建时间",
                    	},
      					
      			
                    { fieldName: "COMP_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "COMP_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divRentComponentList", gUserColumns, "divRentComponentPage"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_COMPONENT",
    name : "配件",
    className : "jetsennet.jdlm.beans.PpnRentComponent",
    keyId : "t.COMP_ID",
   // resultFields : "t.WSLOG_ID,t.WSLOG_CODE,t.WSLOG_TARGETSYS",
    checkId : "chkRoom",
    cfgId : "divRentComponent",
    onAddInit : function() {
        $('#myTab a:first').tab('show');     
    },
   onAddValid : function() {
        return !_checkFuncExist();
    },
    onAddGet : function() {
        return {
        	COMP_NAME : el('COMP_NAME').value,
        	COMP_CODE : el('COMP_CODE').value,
        	COMP_TYPE : el('COMP_TYPE').value,
        	COMP_TOTAL_NUM : el('COMP_TOTAL_NUM').value,
        	COMP_ALIVE_NUM : el('COMP_ALIVE_NUM').value,
        	COMP_DESC : el('COMP_DESC').value,
        	COMP_CREATE_TIME:new Date().toDateTimeString()
               
        };
    },
    addDlgOptions : {size : {width :600, height : 500}},
/*    onEditInit : function() {
    	el('ROOM_CODE').disabled = true;
    	el('ROOM_NAME').disabled = true;
        $('#myTab a:first').tab('show');   
     
    },*/
    onEditSet : function(obj) {
    	el('COMP_NAME').value = valueOf(obj, "COMP_NAME", "");
        el("COMP_CODE").value = valueOf(obj, "COMP_CODE", "");
        el("COMP_TYPE").value = valueOf(obj, "COMP_TYPE", "");
        el("COMP_TOTAL_NUM").value = valueOf(obj, "COMP_TOTAL_NUM", "");
        el("COMP_ALIVE_NUM").value = valueOf(obj, "COMP_ALIVE_NUM", "");        
        el("COMP_DESC").value = valueOf(obj, "COMP_DESC", "");     
    }, 
    onEditGet : function(id) {
            return {
            	COMP_ID:id,
            	COMP_NAME : el('COMP_NAME').value,
            	COMP_CODE : el('COMP_CODE').value,
            	COMP_TYPE : el('COMP_TYPE').value,
            	COMP_TOTAL_NUM : el('COMP_TOTAL_NUM').value,
            	COMP_ALIVE_NUM : el('COMP_ALIVE_NUM').value,
            	COMP_DESC : el('COMP_DESC').value,
            	
            	
            	
      
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
 * 查询
 */

function searchComp() {
    var conditions = [];
    var subConditions = [];
    if(el('txt_DESC').value){
    subConditions.push([[ "t.COMP_NAME",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ],
	                 [ "t.COMP_CODE", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]
    				]);
    }
    gCrud.search(conditions, subConditions);
}


/**
 * 检查使用库房代码和名称是否存在
 * @returns {Boolean}
 * @private
 */
function _checkFuncExist() {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", "COMP_ID", "PPN_RENT_COMPONENT", null, null,null, "COMP_CODE,COMP_NAME");
    if (funcs) {
        var CODE = el("COMP_CODE").value;
        var NAME = el("COMP_NAME").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].COMP_CODE) {
                jetsennet.alert("该库房代码已被使用！");
                el('COMP_CODE').focus();
                return true;
            }
        }
        for (var i = 0; i < funcs.length; i++) {
            if (NAME == funcs[i].COMP_NAME) {
                jetsennet.alert("该库房名称已被使用！");
                el('COMP_NAME').focus();
                return true;
            }
        }
    }
    return false;
}
