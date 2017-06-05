jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor","datepicker", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);


var assignMsg  =  jetsennet.queryString("assignMsg");
var assignMsgJson = assignMsg.replace(/\#/g,"\'");
var assignObj =  (new Function("return " + assignMsgJson))();
/**
设备管理列表
*/
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var gPgmRsColumns = [{ fieldName: "OBJ_NAME", sortField: "OBJ_NAME",  align: "center", name: "设备代码"},
                     { fieldName: "OBJ_NAME", sortField: "OBJ_NAME",  align: "center", name: "设备名称"},
                     { fieldName: "OBJ_NAME", sortField: "OBJ_NAME",  align: "center", name: "端口"},
                     { fieldName: "OBJ_NAME", sortField: "OBJ_NAME",  align: "center", name: "内存使用率(%)"},
                     { fieldName: "OBJ_NAME", sortField: "OBJ_NAME",  align: "center", name: "CPU使用率(%)"},];

var gCrud = $.extend(new jetsennet.Crud("ResConfirmList", gPgmRsColumns, "ResConfirmPageBar"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ",
    name : "资源名称",
    className : "PpnRentObj",
    checkId : "objcheck",
    keyId : "t.OBJ_ID",
    cfgId : "editMyInfoDialog",
});
gCrud.grid.ondoubleclick = null;


/**
 * 页面初始化
 */
function pageInit() {
	gCrud.load();
	alert(assignObj.id);
}

/**
 * 查看管控
 */
function control(){
	location.href="controlTask.htm";
}

/**
 * 禁用设备
 */
function lock(){
	var params = new HashMap();
    params.put("para", "{\"CtlCode\":\"00005\",\"address\":\"10.121.164.21\",\"port\":\"39779\"}");
    ENGDAO.execute("executeCommand", params, 
    		{success : function(resultVal) {
    				jetsennet.alert(resultVal);
    		 },
    		 wsMode:"WEBSERVICE"
    		}
    
    );
}

/**
 * 终止授权
 */
function stop(){
	alert("终止授权")
}

/**
 * 延长授权
 */
function lengthen(){
	alert("延长授权")
}

/**
 * 生成授权码
 */
function anthorization(){
	alert("生成授权码")
}

/**
 * 远程监控
 */
function longDistance(){
	alert("远程监控")
}

/**
 * 消息发送
 */
function news(){
	alert("消息发送")
}

