jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);

var assignId =  jetsennet.queryString("dev_id");
var assignObj;
var process;
var address;
var port;
var gRequestId=1;

//var assignMsg  =  jetsennet.queryString("dev_msg");
//var assignMsgJson = assignMsg.replace(/\#/g,"\'");
//var assignObj =  (new Function("return " + assignMsgJson))();
//var process = assignObj.process;
//var assignId = assignObj.id;
//var address = assignObj.address;
//var port = assignObj.port;

function getData(){
	var params = new HashMap();
    params.put("devCode", assignId);
    params.put("reqId", 1);
    ENGDAO.execute("getDevInfo", params, 
    	 {success : function(resultVal) {
    		 if(resultVal){
    			 //alert("process:"+resultVal);
    			 var colomObj = eval("(" + resultVal + ")");
    			 //alert(colomObj);
 				 assignObj = colomObj;
 				 process = assignObj.process;
 				 //alert(process);
 				address = assignObj.address;
 				port = assignObj.port;
 				setStatu();
 			}
    	  },
    	  wsMode:"WEBSERVICE"
    	 }
    );
}

var processArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//0~32
function setStatu(){
	 var birnaryProcess = parseInt(process).toString(2);
	 var len = birnaryProcess.length;
	 for(var i=1; i<=len; i++){
	 	processArr[i] = birnaryProcess.substr(len-i,1);
	 }
}

var gProgressColumns = [{ fieldName: "PROC_ID", width: 0, align: "center", isCheck: 0, checkName: "chkPgmRs"},
                     { fieldName: "PROC_INDEX", sortField: "PROC_INDEX", align: "center", name: "进程序号"},
                     { fieldName: "PROC_NAME", sortField: "PROC_NAME", align: "center", name: "进程名称"},
                     { fieldName: "PROC_INDEX", sortField: "PROC_INDEX",  align: "center", name: "进程状态",format: function(val, vals){
                    	 return processArr[val] == 1 ? '启用' :'停用';
                     	}
                     }
                     ];
 var gProgressCrud = $.extend(new jetsennet.Crud("divProgressList", gProgressColumns, "divProgress", "order by PRMPD.PROC_INDEX"), {
     dao : SYSDAO,
     tableName : "PPN_RENT_MON_PROC_DEF",
     tabAliasName : 'PRMPD',
     joinTables: [[ "PPN_RENT_OBJ", "PRO", "PRMPD.OBJ_TYPE_ID = PRO.OBJ_TYPE_ID", jetsennet.TableJoinType.Left ]],
     conditions:[["PRO.OBJ_ASS_UID", assignId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],
     name : "设备进程",
     resultFields : "DISTINCT PRMPD.PROC_ID,PRMPD.PROC_NAME,PRMPD.PROC_INDEX",
     checkId : "chkPgmRs",
     keyId : "PRMPD.PROC_ID"
 });
 gProgressCrud.grid.onrowclick = null;	
 gProgressCrud.grid.ondoubleclick = null;
/**
 * 页面初始化
 */
function pageInit() {
	var layout = { splitType: 1,layout: [46, "auto", 40]};
	jQuery("#divPageFrame").pageFrame(layout).sizeBind(window);  
	//setStatu();
	getData();
	gProgressCrud.search();
};

/**
 * 查询进程
 */
function searchProgress() {
    var conditions = [];
    ["PRO.OBJ_ASS_UID", assignId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]
    if (el("txt_NAME").value != "") {
        conditions.push([ "PRMPD.PROC_NAME", el('txt_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "PRMPD.PROC_INDEX", el('txt_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gProgressCrud.search(conditions);
}

/**
 * 锁定
 */
function lock(){
	var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00005","address":address,"port":port};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			var retObj = eval("(" + resultVal + ")");
			var status = retObj.s;
			//alert(status);
			if(status==0){
				jetsennet.alert("操作成功!");
			}else{
				jetsennet.error("锁定网络超时!");
			}
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 终止授权
 */
function stop(){
	var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00004","address":address,"port":port,"auth":"160101"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			var retObj = eval("(" + resultVal + ")");
			var status = retObj.s;
			if(status==0){
				lock();
			}else{
				jetsennet.error("网络超时!");
			}
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 延长授权
 */
function lengthen(){
	var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00004","address":address,"port":port,"auth":"180101"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			var retObj = eval("(" + resultVal + ")");
			var status = retObj.s;
			if(status==0){
				jetsennet.alert("操作成功!");
			}else{
				jetsennet.error("网络超时!");
			}
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 发送消息
 */
function sendMsg(){
	var msg = prompt("请输入要发送的消息：","消息测试");
	if(msg){
		var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00010","address":address,"port":port,"message":msg};
		var params = new HashMap();
	    params.put("para", JSON.stringify(comd));
	    ENGDAO.execute("executeCommand", params, 
			{success : function(resultVal) {
				var retObj = eval("(" + resultVal + ")");
				var status = retObj.s;
				if(status==0){
					jetsennet.alert("操作成功!");
				}else{
					jetsennet.error("网络超时!");
				}
			 },
			 wsMode:"WEBSERVICE"
			}
	    );
	}
}
/**
 * 生成授权码
 */
function anthorization(){
	var params = new HashMap();
	//var date = new Date();
	//var startDate = date.getYear().toString().substr(date.getYear().toString().length-2)+(date.getMonth()+1).toString()+date.getDate().toString();
    params.put("START_DATE", new Date().Format("yyMMdd"));
    params.put("DURATIOIN", "7");
    params.put("DEVICE_CODE", assignId);
    ENGDAO.execute("generateCode", params,
		{success : function(resultVal) {
			jetsennet.alert("授权码:"+resultVal);
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 远程监控
 */
function remoteDesktop(){
	window.open("../../remote/desktop/remote.htm?dev_ip="+address+"&dev_port="+port);
    /*var dialog = jQuery.extend(new jetsennet.ui.Window("assignMsg"),{title:"远程桌面",submitBox:true,cancelBox:false,size:{width:1200,height:600},maximizeBox:false,minimizeBox:false});    
    dialog.controls =["divAssign"];
    dialog.showDialog();*/
    /*
	var comd = {"CtlCode":"00001","address":address,"port":port};
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

/**
 * 超级锁
 */
function superLock(){
	var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00007","address":address,"port":port,"lock":"1"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			setTimeout(lock,500);
			//jetsennet.alert("操作成功!");
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 解锁
 */
function superUnlock(){
	var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00007","address":address,"port":port,"lock":"0"};
	var params = new HashMap();
    params.put("para", JSON.stringify(comd));
    ENGDAO.execute("executeCommand", params, 
		{success : function(resultVal) {
			jetsennet.alert("操作成功，请重启!");
		 },
		 wsMode:"WEBSERVICE"
		}
    );
}

/**
 * 超级密码
 */
function superPwd(){
	jetsennet.alert("超级密码默认值：!QAZ@WSX");
}

/**
 * 超级密码
 */
function resetPwd(){
	var passwd = prompt("请输入要设置的密码：","!QAZ@WSX");
	if(passwd){
		var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00009","address":address,"port":port,"sp_code":passwd};
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
}

/**
 * 切换账号
 */
function exchangeUser(){
	var user = prompt("请输入要切换到的账户名称：","cctv");
	if(user){
		var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00008","address":address,"port":port,"login_name":user};
		var params = new HashMap();
	    params.put("para", JSON.stringify(comd));
	    ENGDAO.execute("executeCommand", params, 
			{success : function(resultVal) {
				var retObj = eval("(" + resultVal + ")");
				var status = retObj.s;
				//alert(status);
				if(status==0){
					lock();
				}else{
					jetsennet.error("切账号超时!");
				}
			 },
			 wsMode:"WEBSERVICE"
			}
	    );
	}
}

/**
 * 设备定位
 */
function getPosition(){
	//window.open("http://101.201.69.224:8080/jamp/jdvn/jdvnsystemweb/devicemap.htm?deviceName="+assignId);
	//12965679,4826761
	var params = new HashMap();
    params.put("devCode", assignId);
    ENGDAO.execute("getGpsInfo", params, 
    	 {success : function(resultVal) {
    		 if(resultVal){
    			 //alert("gps:"+resultVal);
    			 var gps = resultVal.split(",");
 				//央视116.471,39.921;天安门116.404,39.915
 				var para = "?deviceName="+assignId;
 				para += "&localX="+gps[0];
 				para += "&localY="+gps[1];
 				window.open("http://localhost:8060/jetsennet-eng/jdlm/jdlmsystemweb/baiduMap.htm"+para);
 			}else{
 				alert("获取设备定位坐标失败!");
 			}
    	  },
    	  wsMode:"WEBSERVICE"
    	 }
    );
}

//获取gRequestId
function getRequestId(){
	if(gRequestId>=255){
		gRequestId = 1;
	}
	return gRequestId++;
}

//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
