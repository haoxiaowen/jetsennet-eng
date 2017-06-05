//=============================================================================
// Jsystemmanageweb application
//=============================================================================
jetsennet.require(["layoutit", "bootstrap/moment", "bootstrap/daterangepicker"]);
jetsennet.importCss([ "jetsen", "bootstrap/bootstrap"]);

//uumdao
var UUMDAO = new jetsennet.DefaultDal("UUMSystemService");

//sysdao
var SYSDAO = new jetsennet.DefaultDal("SystemService");
SYSDAO.dataType = "xml";

var PPN_SERVICE = jetsennet.appPath + "../../services/PpnServiceIn?wsdl";

var SYS_SERVICE =  jetsennet.appPath + "../../services/SystemService?wsdl";

//权限模式:disable,hidden
var AUTH_MODE = "disable";

//日期范围选取框通用配置
var dataPickerOptions = { 
      ranges : { 
        '今天' : [ moment(), moment()], 
        '昨天' : [ moment().subtract('days', 1), moment().subtract('days', 0) ], 
        '最近一周' : [ moment().subtract('days', 6), moment() ], 
        '最近一月' : [ moment().subtract('days', 29), moment() ],
        '本月' : [ moment().startOf('month'), moment().endOf('month') ], 
        '上月' : [ moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month') ] 
      }, 
      format: 'YYYY-MM-DD HH:mm:ss', //
      startDate: new Date(), 
      showDropdowns: true, 
      separator:' --- ', 
      locale: { 
        applyLabel: '确定',
        cancelLabel: '取消', 
        fromLabel: '开始时间', 
        toLabel: '结束时间', 
        customRangeLabel: '其他', 
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'], 
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], 
        firstDay: 0 
      } ,
      timePicker : true,
      timePickerIncrement : 01, 
      timePicker12Hour : false,
};

var dateSelectPickerOptions = {
		startDate : moment().startOf('hours'),
		singleDatePicker : true,
		format : 'YYYY-MM-DD HH:mm:ss',
		showDropdowns : true,  
        timePicker : true, 
        timePickerIncrement : 01,
        timePicker12Hour : false	
};

/**
 * 清除时间
 */
function clearTime(){
	$('#priod_time').val('');
}

/**
 * 取系统配置
 * @param {String} configNames 配置项列表
 */
jetsennet.application.getSysConfig = function(configNames) {
    var param = new HashMap();
    param.put("params", configNames);
    var result = SYSDAO.execute("getVagueMutiConfigFromDB", param);
    var configs = {};
    if (result && result.resultVal) {
        var objs = jQuery.parseJSON(result.resultVal);
        if (objs && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                configs[obj.NAME] = obj.DATA;
            }
        }
    }
    return configs;
};

/**
 * 校验界面上的控件是否可用
 */
jetsennet.application.checkFunctionValidate = function() {
    var menuId = jetsennet.queryString("sysid");
    if (!menuId) {
        return;
    }
    var param = new HashMap();
    param.put("userId", jetsennet.application.userInfo.UserId);
    param.put("menuId", menuId);
    var result = UUMDAO.execute("uumGetUserOperateFunction", param);
    if (result && result.resultVal) {
        var objs = jetsennet.xml.toObject(result.resultVal, "Table");
        if (objs && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                var element = $(".func-" + objs[i]["PARAM"]);
                if (element) {
                    if (!objs[i]["STATE"] == "0") {
                        if (AUTH_MODE == "hidden") {
                            element.hide();
                        } else {
                            element.attr("disabled", true);
                        }
                    }
                }
            }
        }
    }
};

function getSelectedRow(divid,_rowindex) {  
	var _id = divid+"-tab-body";
	var table = document.getElementById(_id);//获取第一个表格  
    var child = table.getElementsByTagName("tr")[_rowindex];//获取行的第一个单元格  
    var divspan = $(child.children[0].getElementsByTagName("div")[0].getElementsByTagName("span")[0]); //child.firstChild.innerHTML
    return divspan.attr("value");
}

//选择栏目
var gSelectColColumns = [ {
    fieldName : "COL_ID,COL_CODE,COL_NAME",
    width : 30,
    align : "center",
    isCheck : 1,
    display:0,
    checkName : "chk_SelectCol",
    format : function(val, vals) {
        return vals[0] + "," + vals[1] + "," +vals[2];
    }
}, {
    fieldName : "COL_NAME",
    sortField : "COL_NAME",
    align : "left",
    name : "栏目名称"
}, {
    fieldName : "COL_CODE",
    sortField : "COL_CODE",
    align : "left",
    name : "栏目代码"
},{
    fieldName : "COL_CREATE_TIME",
    sortField : "COL_CREATE_TIME",
    align : "left",
    name : "创建时间"
} ];
//选择出库单
var gSelectOutResColumns = [{ fieldName: "OUT_ID", width: 30, align: "center", display:0,isCheck: 1, checkName: "chkOUT"},
                            { fieldName: "OUT_NAME", sortField: "OUT_CODE", width: 160, align: "center", name: "出库单"},
                            { fieldName: "OUT_CODE", sortField: "OUT_CODE", width: 160, align: "center", name: "出库代码"},
                            { fieldName: "OUT_USER", sortField: "OUT_USER", width: 160, align: "center", name: "借用人员"},
                            { fieldName: "OUT_DEPT_CODE", sortField: "OUT_DEPT_CODE", width: 160, align: "center", name: "借用部门"},
                            { fieldName: "OUT_COLN_CODE", sortField: "OUT_COLN_CODE", width: 160, align: "center", name: "借用栏目"},
                            
                            { fieldName: "OUT_START_TIME", sortField: "OUT_START_TIME", width: 135, align: "center", name: "起借时间"},
                            { fieldName: "OUT_END_TIME", sortField: "OUT_END_TIME", width: 135, align: "center", name: "归还时间"},
                            { fieldName: "OUT_CHECK_USER", sortField: "OUT_CHECK_USER", width: 160, align: "center", name: "出库人员"},
                            { fieldName: "OUT_CREATE_TIME", sortField: "OUT_CREATE_TIME", width: 135, align: "center", name: "出库时间"},
                            { fieldName: "OUT_STATUS", sortField: "OUT_STATUS", width: 100, align: "center", name: "状态",
                            	format	:function(val,vals){
                            	 if(val==1){
                            		 return "已出库";
                            	 }
                             }
                            },
                            { fieldName: "OUT_DESC", sortField: "OUT_DESC", width: 160, align: "center", name: "出库备注"},
                            { fieldName: "ITEM_NAME", sortField: "ITEM_NAME", width: 160, align: "center", name: "关联申请单"}
                            ];
//选择资源
var gSelectResObjColumns = [ {
    fieldName : "OBJ_ID,OBJ_CODE,OBJ_NAME,OBJ_DESC,OBJ_SPECS,OBJ_TYPE_ID",
    width : 30,
    align : "center",
    isCheck : 1,
    display:0,
    checkName : "chk_SelectResObj",
    format : function(val, vals) {
        return vals[0] + "," + vals[1] + "," +vals[2]+ "," +vals[3]+ "," +vals[4]+ "," +vals[5];
    }
}, {
    fieldName : "OBJ_NAME",
    sortField : "OBJ_NAME",
    align : "left",
    name : "名称"
}, {
    fieldName : "OBJ_CODE",
    sortField : "OBJ_CODE",
    align : "left",
    name : "代码"
} ];
//选择部门
var gSelectDeptColumns = [ {
    fieldName : "DEPART_ID,DEPART_NO,NAME",
    width : 30,
    align : "center",
    isCheck : 1,
    display:0,
    checkName : "chk_SelectDept",
    format : function(val, vals) {
        return vals[0] + "," + vals[1] + "," +vals[2];
    }
}, {
    fieldName : "NAME",
    sortField : "NAME",
    align : "left",
    name : "部门名称"
}, {
    fieldName : "DEPART_NO",
    sortField : "DEPART_NO",
    align : "left",
    name : "部门代码"
} ];

//选择用户表格配置
var gSelectUserColumns = [ {
    fieldName : "ID,USER_NAME,STATE",
    width : 30,
    align : "center",
    isCheck : 1,
    display:0,
    checkName : "chk_SelectUser",
    format : function(val, vals) {
        var state = vals[2]!=0?" (已停用)":"";
        return vals[0] + "," + vals[1] + state;
    }
}, {
    fieldName : "USER_NAME",
    sortField : "USER_NAME",
    width : "25%",
    align : "left",
    name : "用户姓名"
}, {
    fieldName : "LOGIN_NAME",
    sortField : "LOGIN_NAME",
    width : "25%",
    align : "left",
    name : "登录名称"
}, {
    fieldName : "DESCRIPTION,STATE",
    width : "50%",
    align : "left",
    name : "描述",
    format : function(val, vals) {
        var state = vals[1]!=0?"<font color=\"#f0ad4e\">已停用</font>":"";
        if(val && state) {
            return val + "(" + state + ")";
        }else if(val){
            return val;
        }else{
            return state;
        }
    }
} ];


var gShowColumns = [ {
    fieldName : "TARGET_TYPE_TXT",
    sortField : "TARGET_TYPE_TXT",
    align : "left",
    name : "类型"
}, {
    fieldName : "T_NUM",
    sortField : "T_NUM",
    align : "left",
    name : "数量"
} ];