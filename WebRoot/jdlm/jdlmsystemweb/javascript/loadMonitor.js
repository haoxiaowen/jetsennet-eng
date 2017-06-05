
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins","datepicker",]);

/**
查询审核列表
*/

var devId;
var process;
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var gPgmRsColumns = [{ fieldName: "ID", sortField: "ID",  align: "center", name: "设备代码"},
                    { fieldName: "ADDRESS", sortField: "ADDRESS",  align: "center", name: "设备名称"},
                    { fieldName: "PORT", sortField: "PORT",  align: "center", name: "端口"},
                    { fieldName: "MEMORY", sortField: "MEMORY",  align: "center", name: "内存使用率(%)"},
                    { fieldName: "CPU", sortField: "CPU",  align: "center", name: "CPU使用率(%)"}
                    ];
var gCrud = $.extend(new jetsennet.Crud("ResConfirmList", gPgmRsColumns, "ResConfirmPageBar", "order by CHECK_ID"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_CHECK",
    name : "消息信息",
    className : "PpnRentCheck",
    checkId : "chkPgmRs",
    keyId : "t.CHECK_ID",    
});
gCrud.grid.ondoubleclick = null;

gCrud.grid.onrowclick = function(item,td){
	//alert(item.ID);
	gCurItem = item;
	devId = item.ID;
	process = item.PROCESS
};

var gCurItem;

/**
 * 页面初始化
 */
function pageInit() {
	//gCrud.load();
	gCrud.grid.renderXML("<RecordSet/>");
	loadInfo();
}

//实时刷新在线数据
function loadInfo(){
	var comd = {"CtlCode":"00003"};
	//alert(JSON.stringify(comd));
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));//"{\"CtlCode\":\"00003\"}"
    ENGDAO.execute("executeCommand", params, 
    		{success : function(resultVal) {
    			//jetsennet.alert(resultVal);
    			//var  htt =[{"process":6,"address":"192.168.1.112","memory":76,"last":1482461718033,"port":9528,"cpu":30,"id":"102"}];
    			var xml = "<RecordSet TotalCount='"
    				var obj = eval(resultVal);//eval(htt);
    				var len = obj.length;
    				xml+=len+"'>";
    				for(var i=0; i<len;i++){
    					xml+="<Record>";
    					xml+="<PROCESS>"+obj[i].process+"</PROCESS>";
    					xml+="<ADDRESS>"+obj[i].address+"</ADDRESS>";
    					xml+="<MEMORY>"+obj[i].memory+"</MEMORY>";
    					xml+="<PORT>"+obj[i].port+"</PORT>";
    					xml+="<CPU>"+obj[i].cpu+"</CPU>";
    					xml+="<ID>"+obj[i].id+"</ID>";
    					xml+="</Record>";
    				}
    				xml+="</RecordSet>";
    				//alert(xml)
    			gCrud.grid.renderXML(xml);
    		 },
    		 wsMode:"WEBSERVICE"
    		}
    );
}

/**
 * 锁定
 */
function lock(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var comd = {"CtlCode":"00005","address":gCurItem.ADDRESS,"port":gCurItem.PORT};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
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
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var comd = {"CtlCode":"00004","address":gCurItem.ADDRESS,"port":gCurItem.PORT,"auth":"160101"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert(resultVal);
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 延长授权
 */
function lengthen(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var comd = {"CtlCode":"00004","address":gCurItem.ADDRESS,"port":gCurItem.PORT,"auth":"180101"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert(resultVal);
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}
/**
 * 发送消息
 */
function sendMsg(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var msg = prompt("请输入要发送的消息：","消息测试");
	var comd = {"CtlCode":"00010","address":gCurItem.ADDRESS,"port":gCurItem.PORT,"auth":"180101","message":msg};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert(resultVal);
		 },
		 wsMode:"WEBSERVICE"
		}
    );
	
}

/**
 * 超级锁
 */
function superLock(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var comd = {"CtlCode":"00007","address":gCurItem.ADDRESS,"port":gCurItem.PORT,"lock":"1"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert("操作成功!");
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 超级密码
 */
function superPwd(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var comd = {"CtlCode":"00009","address":gCurItem.ADDRESS,"port":gCurItem.PORT,"sp_code":"12345678890"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert("操作成功!\n!QAZ@WSX3edc4rfv");
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 切换账号
 */
function exchangeUser(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var user = prompt("请输入要切换到的账户名称：","administrator");
	var comd = {"CtlCode":"00008","address":gCurItem.ADDRESS,"port":gCurItem.PORT,"login_name":user};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert("操作成功!");
		 },
		 wsMode:"WEBSERVICE"
		}
    );
	
}

/**
 * 生成授权码
 */
function anthorization(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	var params = new HashMap();
    params.put("START_DATE", "161230");
    params.put("DURATIOIN", "7");
    params.put("DEVICE_CODE", gCurItem.ID);
    ENGDAO.execute("generateCode", params, 
		{success : function(resultVal) {
			jetsennet.alert(resultVal);
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 远程监控
 */
function remoteDesktop(){
	if(!gCurItem){
		jetsennet.alert("请选中一个设备");
		return;
	}
	window.open("../../remote/desktop/remote.htm?dev_ip="+gCurItem.ADDRESS+"&dev_port="+gCurItem.PORT);
	
	/*	
	el("iframeAssignMsg").src="../../remote/desktop/remote.htm?dev_ip="+gCurItem.ADDRESS+"&dev_port="+gCurItem.PORT;
    var dialog = jQuery.extend(new jetsennet.ui.Window("assignMsg"),{title:"远程桌面",submitBox:true,cancelBox:false,size:{width:1200,height:600},maximizeBox:false,minimizeBox:false});    
    dialog.controls =["divAssign"];
    dialog.showDialog();
	var comd = {"CtlCode":"00001","address":gCurItem.ADDRESS,"port":gCurItem.PORT};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert(resultVal);
		 },
		 wsMode:"WEBSERVICE"
		}
    );
    */
}

/*//查询设备信息
function executed(){
	
	var params = new HashMap();
    //params.put("para", "{CtlCode:\"00003\",address:\"192.168.2.6\",port:\"9527\",auth:\"170214\"}");
    params.put("para", "{\"CtlCode\":\"00003\"}");
    ENGDAO.execute("executeCommand", params, 
    		{success : function(resultVal) {
    			//jetsennet.alert(resultVal);
    			var  htt =[{"process":6,"address":"192.168.1.112","memory":76,"last":1482461718033,"port":9528,"cpu":30,"id":"102"}];
    			var xml = "<RecordSet TotalCount='"
    				//var  htt =[{"process":6,"address":"192.168.1.112","memory":76,"last":1482461718033,"port":9528,"cpu":30,"id":"102"},{"process":6,"address":"192.168.1.112","memory":76,"last":1482461718033,"port":9528,"cpu":30,"id":"102"}];
    				var obj = eval(resultVal);//eval(htt);
    				var len = obj.length;
    				xml+=len+"'>";
    				for(var i=0; i<len;i++){
    					xml+="<Record>";
    					xml+="<PROCESS>"+obj[0].process+"</PROCESS>";
    					xml+="<ADDRESS>"+obj[0].address+"</ADDRESS>";
    					xml+="<MEMORY>"+obj[0].memory+"</MEMORY>";
    					xml+="<PORT>"+obj[0].port+"</PORT>";
    					xml+="<CPU>"+obj[0].cpu+"</CPU>";
    					xml+="<ID>"+obj[0].id+"</ID>";
    					xml+="</Record>";
    				}
    				xml+="</RecordSet>";
    				//alert(xml)
    			gCrud.grid.renderXML(xml);
    		 },
    		 wsMode:"WEBSERVICE"
    		}
    );
}*/

/**
 * 动态图表
 */
function loadChart(){
	var url ="../../jdlm/jdlmsystemweb/chartLine.htm?dev_id="+devId;
	var showDiv = el("iframeChartLine");
	showIframDialog(showDiv,url,'设备信息监控','divChartLine',{size:{ width : 1200,height : 600}});
}

/**
 * 设备进程
 */
function loadProgress(){
	//var url ="../../jdlm/jdlmsystemweb/deviceProgress.htm?dev_id="+devId+"&process="+process;
	var devMsg = JSON.stringify(gCurItem).replace(/\"/g,"#");
	var url ="../../jdlm/jdlmsystemweb/deviceProgress.htm?dev_msg="+devMsg;
	var showDiv = el("iframeProgress");
	showIframDialog(showDiv,url,'设备进程信息','divProgress',{size:{ width : 1200,height : 600}});
}


function showIframDialog(showDiv,url,title, controlId, options){
	showDiv.src = url;
	var dialog = new jetsennet.ui.Window(title);
	jQuery.extend(dialog, {
		title : title,
		size : {
			width : 1200,
			height : 580
		},
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		submitBox:true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ controlId ],
	}, options);
	dialog.showDialog();
}
