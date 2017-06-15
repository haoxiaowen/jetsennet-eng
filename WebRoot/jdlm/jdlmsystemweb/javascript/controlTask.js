
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor","datepicker", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);
/**
查询监控任务列表
*/
/*var assignMsg  =  jetsennet.queryString("dev_msg");
var assignMsgJson = assignMsg.replace(/\#/g,"\'");
var assignObj =  (new Function("return " + assignMsgJson))();*/

var pgmObj;
var OBJ_NAME;
var OBJ_ASS_UID;
var obj_ass_uid = decodeURI(jetsennet.queryString("obj_ass_uid"));
var assignId =  jetsennet.queryString("obj_ass_uid");
var assignName =  decodeURI(jetsennet.queryString("obj_name"));
var assignObj;
var process;
var address;
var port;
var gRequestId=1;

jetsennet.importCss("bootstrap/daterangepicker-bs3");
var gPgmRsColumns = [{ fieldName: "TASK_ID", width: 0, align: "center", isCheck: 1, checkName: "chkPgmRs"},
                    { fieldName: "TASK_NAME", sortField: "TASK_NAME",  align: "center", name: "资源名称"},
                    { fieldName: "TASK_CODE", sortField: "TASK_CODE",  align: "center", name: "分配资源代码"},
                    { fieldName: "TASK_TYPE", sortField: "TASK_TYPE",  align: "center", name: "类型",format: function(val, vals){
                    	if (val == 1) {
                            return "设备禁用";
                        } else if (val == 2) {
                            return "切换账户";
                        } else if (val == 3) {
                            return "终止授权";
                        } else if (val == 4) {
                            return "延长授权";
                        } else if (val == 5) {
                            return "消息发送";
                        } else if (val == 6) {
                            return "远程监看";
                        } else if (val == 7) {
                            return "远程接管";
                        }
                    }},
                    { fieldName: "TASK_STATUS", sortField: "TASK_STATUS",  align: "center", name: "状态",format: function(val, vals){
                    	if (val == 1) {
                            return "待执行";
                        } else if (val == 2) {
                            return "执行中";
                        } else if (val == 3) {
                            return "执行完成";
                        } else if (val == 4) {
                            return "执行失败";
                        } else if (val == 5) {
                            return "执行终止";
                        }
                    }},
                    { fieldName: "TASK_CREATE_USER", sortField: "TASK_CREATE_USER",  align: "center", name: "创建人员"},
                    { fieldName: "TASK_CREATE_TIME", sortField: "TASK_CREATE_TIME",  align: "center", name: "创建时间"},
                    { fieldName: "TASK_DESC", sortField: "TASK_DESC",  align: "center", name: "申请描述"},
                    { fieldName: "TASK_REMARK", sortField: "TASK_REMARK",  align: "center", name: "任务备注"},
//                    { fieldName: "TASK_EXPIRE_TIME", sortField: "TASK_EXPIRE_TIME",  align: "center", name: "到期时间"},
                    { fieldName: "TASK_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "TASK_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}
                    ];
var gCrud = $.extend(new jetsennet.Crud("ResConfirmList", gPgmRsColumns, "ResConfirmPageBar", "order by TASK_ID"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_MON_TASK",
    name : "监控任务信息",
    className : "PpnRentMonTask",
    checkId : "chkPgmRs",
    keyId : "t.TASK_ID",
    cfgId : "addcontrol",
    //添加审核信息
    onAddInit : function() {
    	if(OBJ_NAME){
    		el('txt_TASK_NAME').value=OBJ_NAME;
    	}
    	if(OBJ_ASS_UID){
    		el('txt_TASK_CODE').value=OBJ_ASS_UID;
    	}
    },
    onAddGet : function() {
        return {       
        	TASK_NAME : el('txt_TASK_NAME').value,
        	TASK_CODE : el('txt_TASK_CODE').value,
        	TASK_TYPE : el('txt_TASK_TYPE').value,
        	TASK_STATUS : el('txt_TASK_STATUS').value,
        	TASK_CREATE_USER : jetsennet.Application.userInfo.UserName,
        	TASK_CREATE_TIME : new Date().toDateTimeString(),
        	TASK_DESC : el('txt_TASK_DESC').value,
        	TASK_REMARK : el('txt_TASK_REMARK').value,
        	TASK_EXPIRE_TIME : 0,
        };
    },
    addDlgOptions : {size : {width : 700, height : 400}},
    //回显审核信息
    onEditSet : function(obj) {
        el("txt_TASK_NAME").value = valueOf(obj, "TASK_NAME", "");
        el("txt_TASK_CODE").value = valueOf(obj, "TASK_CODE", "");
        el("txt_TASK_TYPE").value = valueOf(obj, "TASK_TYPE", "");
        el("txt_TASK_STATUS").value = valueOf(obj, "TASK_STATUS", "");
//        el("txt_TASK_CREATE_USER").value = valueOf(obj, "TASK_CREATE_USER", "");
        el("txt_TASK_CREATE_TIME").value = valueOf(obj, "TASK_CREATE_TIME", "");
        el("txt_TASK_DESC").value = valueOf(obj, "TASK_DESC", "");
        el('txt_TASK_REMARK').value = valueOf(obj, "TASK_REMARK", "");
//        el("txt_TASK_EXPIRE_TIME").value = valueOf(obj, "TASK_EXPIRE_TIME", "");
    },
    //编辑审核信息
    onEditGet : function(id) {
        return {
        	TASK_ID : id,
        	TASK_NAME : el('txt_TASK_NAME').value,
        	TASK_CODE : el('txt_TASK_CODE').value,
        	TASK_TYPE : el('txt_TASK_TYPE').value,
        	TASK_STATUS : el('txt_TASK_STATUS').value,
        	TASK_CREATE_USER : el('txt_TASK_CREATE_USER').value,
        	TASK_CREATE_TIME : el('txt_TASK_CREATE_TIME').value,
        	TASK_DESC : el('txt_TASK_DESC').value,
        	TASK_REMARK : el('txt_TASK_REMARK').value,
        	TASK_EXPIRE_TIME : el('txt_TASK_EXPIRE_TIME').value,
        };
    },
    editDlgOptions : {size : {width : 700, height : 450}},
    //删除审核信息
    onRemoveValid : function(checkIds) {
        return true;
    }
});
gCrud.grid.ondoubleclick = null;
gCrud.grid.onrowclick = getPgmType;
	

	
/**
 * 页面初始化
 */
function pageInit() {
	OBJ_NAME=decodeURI(jetsennet.queryString("obj_name"));
	OBJ_ASS_UID=decodeURI(jetsennet.queryString("obj_ass_uid"));
	
	searchTask();
	//gCrud.load();
}

/**
 * 查询
 */
function searchTask() {
    var conditions = [];
    if (assignId) {
        conditions.push([ "TASK_CODE", assignId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ]);
    }
    gCrud.search(conditions);
}

//查询展示申请单资源名称 OBJ_TYPE_NAME
var gobj = [{ fieldName: "OBJ_NAME", sortField: "OBJ_NAME",  align: "center", name: "资源名称"},
            { fieldName: "OBJ_CODE", sortField: "OBJ_CODE",  align: "center", name: "资源代码"},
            { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME",  align: "center", name: "资源类型"},
            ];

var gobjCrud = $.extend(new jetsennet.Crud("objList", gobj, "objListPage"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_OBJ",
    name : "资源名称",
    className : "PpnRentObj",
    checkId : "objcheck",
    keyId : "t.OBJ_ID",
    cfgId : "editMyInfoDialog",
    joinTables : [["PPN_RENT_OBJ_TYPE", "ru", "t.OBJ_TYPE_ID=ru.OBJ_TYPE_ID", jetsennet.TableJoinType.Left]],
    resultFields:"t.*,ru.OBJ_TYPE_NAME",
});
//查询申请单资源名称方法
function showUserInfo () 
{
    var areaElements = jetsennet.form.getElements("editMyInfoDialog");
    jetsennet.resetValue(areaElements);
    jetsennet.clearValidateState(areaElements);
    
    var dialog = new jetsennet.ui.Window("user-info-edit-dialog");
    jQuery.extend(dialog, {
        title : "资源名称",
        size : {
            width : 400,
            height : 350
        },
        maximizeBox : false,
        minimizeBox : false,
        submitBox : true,
        cancelBox : true,
        showScroll : false,
        controls : [ "editMyInfoDialog" ],
    });
    dialog.onsubmit = function() {
    	 if (dataObj==null ||dataObj=="undefined" || dataObj=="") {
             jetsennet.message("请选择资源名称");
             return false;
         }
    	el("txt_TASK_NAME").value = dataObj.OBJ_NAME;
    	el("txt_TASK_CODE").value = dataObj.OBJ_CODE;	//OBJ_ASS_UID
    	
    	 dialog.close();
    	};
    	gobjCrud.load();
    	dialog.showDialog();
}

	//角色gird单击事件
	var gResGrid = gobjCrud.grid;
	gResGrid.onrowclick = resOnRowClick;
	var dataObj;
	function resOnRowClick(item, td) {
		dataObj=item;
		//里面写方法
		//item 代表改行的数据 
	}
	
	
	
	//点击列表获取任务状态
	var pgmObjType;
	var gCurItem;
	var Assignment = new Object();
	var editId;
	function getPgmType(item, td){
		gCurItem = item;
		pgmObjType = item.TASK_TYPE;
		editId = item.TASK_ID;
	}
	
	//显示执行中动画
	function showProcessBar(){
		var dialog = new jetsennet.ui.Window("busy-dialog");
		jQuery.extend(dialog, {title:"执行中,请稍候...",controls:["busyDiv"],windowStyle:1,maximizeBox:false,minimizeBox:false,closeBox:false});
		dialog.showDialog();
	}
	
	//更新命令执行结果
	function updateStatus(val){
		jetsennet.ui.Windows.close("busy-dialog");
		
		var modifyStatus = {
			TASK_ID: editId,
			TASK_STATUS : val
		};
		var para = new HashMap();
		para.put("className", "PpnRentMonTask")
		para.put("updateXml", jetsennet.xml.serialize(modifyStatus,"PpnRentMonTask"));
		para.put("isFilterNull", true);
		SYSDAO.execute("commonObjUpdateByPk",para,
		{error:function(e){
			jetsennet.alert("状态更新失败，"+e);
		},
		success : function() {
			gCrud.load();
		},
		wsMode:"WEBSERVICE"});
	}
	
	//注销
	function logout(){
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
							updateStatus(3);
						}else{
							jetsennet.error("锁定网络超时!");
							updateStatus(4);
						}
				},
				wsMode:"WEBSERVICE"
				}
		);
	}
	
	//任务执行方法
	function execute(){
		if(!gCurItem){
			jetsennet.alert("请选中一个设备");
			return;
		}
		//getData();
		var params = new HashMap();
	    params.put("devCode", obj_ass_uid);
	    params.put("reqId", getRequestId());
	    ENGDAO.execute("getDevInfo", params, 
	    	 {success : function(resultVal) {
	    		 if(resultVal == ""){
	    			 jetsennet.alert("此设备不在线!");
	    		 }
	    		 if(resultVal){
	    			 //alert("process:"+resultVal);
	    			 var colomObj = eval("(" + resultVal + ")");
	    			 //alert(colomObj);
	 				 assignObj = colomObj;
	 				 process = assignObj.process;
	 				 //alert(process);
	 				address = assignObj.address;
	 				port = assignObj.port;
	 				
	 				if(pgmObjType == 1){		//设备禁用、设备启用
	 					showProcessBar();
	 					var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00005","address":address,"port":port};
	 					var params = new HashMap();
	 					params.put("para", JSON.stringify(comd));
	 					ENGDAO.execute("executeCommand", params, 
	 							{success : function(resultVal) {
	 								if(!resultVal){
	 									jetsennet.error("网络超时!");
	 									updateStatus(4);
	 									return;
	 								}
	 								var retObj = eval("(" + resultVal + ")");
	 								var status = retObj.s;
	 								//alert(status);
	 								if(status==0){
	 									jetsennet.alert("操作成功!");
	 									updateStatus(3);
	 								}else{
	 									jetsennet.error("指令发送失败!");
	 									updateStatus(4);
	 								}
	 							},
	 							wsMode:"WEBSERVICE"
	 							}
	 					);
	 					
	 				}
	 				else if(pgmObjType == 2){		//切换账户
	 					
	 					var user = prompt("请输入要切换到的账户名称：","cctv");
	 					//getData();
	 					if(user){
	 						showProcessBar();
	 						var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00008","address":address,"port":port,"login_name":user};
	 						var params = new HashMap();
	 					    params.put("para", JSON.stringify(comd));
	 					    ENGDAO.execute("executeCommand", params, 
	 							{success : function(resultVal) {
	 								if(!resultVal){
	 									jetsennet.error("网络超时!");
	 									updateStatus(4);
	 									return;
	 								}
	 								var retObj = eval("(" + resultVal + ")");
	 									var status = retObj.s;
	 									//alert(status);
	 									if(status==0){
	 										logout();
	 									}else{
	 										jetsennet.error("指令发送失败!");
	 										updateStatus(4);
	 									}
	 							 },
	 							 wsMode:"WEBSERVICE"
	 							}
	 					    );
	 					}
	 					
	 				}else if(pgmObjType == 3){		//终止授权
	 					showProcessBar();
	 					var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00004","address":address,"port":port,"auth":"160101"};
	 					var params = new HashMap();
	 					params.put("para", JSON.stringify(comd));
	 					ENGDAO.execute("executeCommand", params, 
	 							{success : function(resultVal) {
	 								if(!resultVal){
	 									jetsennet.error("网络超时!");
	 									updateStatus(4);
	 									return;
	 								}
	 								var retObj = eval("(" + resultVal + ")");
	 								var status = retObj.s;
	 								//alert(status);
	 								if(status==0){
	 									logout();
	 								}else{
	 									jetsennet.error("指令发送失败!");
	 									updateStatus(4);
	 								}
	 							},
	 							wsMode:"WEBSERVICE"
	 							}
	 					);
	 					
	 				}else if(pgmObjType == 4){		//延长授权
	 					showProcessBar();
	 					var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00004","address":address,"port":port,"auth":"180101"};
	 					var params = new HashMap();
	 				    params.put("para", JSON.stringify(comd));
	 				    ENGDAO.execute("executeCommand", params, 
	 						{success : function(resultVal) {
	 							if(!resultVal){
 									jetsennet.error("网络超时!");
 									updateStatus(4);
 									return;
 								}
	 							var retObj = eval("(" + resultVal + ")");
 								var status = retObj.s;
 								//alert(status);
 								if(status==0){
 									jetsennet.alert("操作成功!");
 									updateStatus(3);
 								}else{
 									jetsennet.error("指令发送失败!");
 									updateStatus(4);
 								}
	 						 },
	 						 wsMode:"WEBSERVICE"
	 						}
	 				    );
	 					
	 				}else if(pgmObjType == 5){		//消息发送
	 					var msg = prompt("请输入要发送的消息：","消息测试");
	 					if(msg){
	 						showProcessBar();
	 						var comd = {"requestId":getRequestId(),"id":assignId,"CtlCode":"00010","address":address,"port":port,"message":msg};
	 						var params = new HashMap();
	 					    params.put("para", JSON.stringify(comd));
	 					    ENGDAO.execute("executeCommand", params, 
	 							{success : function(resultVal) {
	 								if(!resultVal){
	 									jetsennet.error("网络超时!");
	 									updateStatus(4);
	 									return;
	 								}
	 								var retObj = eval("(" + resultVal + ")");
	 								var status = retObj.s;
	 								//alert(status);
	 								if(status==0){
	 									jetsennet.alert("操作成功!");
	 									updateStatus(3);
	 								}else{
	 									jetsennet.error("指令发送失败!");
	 									updateStatus(4);
	 								}
	 							 },
	 							 wsMode:"WEBSERVICE"
	 							}
	 					    );
	 					}
	 					
	 				}else if(pgmObjType == 6){		//远程监看
	 					window.open("../../remote/desktop/remote.htm?dev_ip="+address+"&dev_port="+port);
	 				}
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
	 * 设备定位
	 */
	function getPosition(){
		//window.open("http://101.201.69.224:8080/jamp/jdvn/jdvnsystemweb/devicemap.htm?deviceName="+assignId);
		//12965679,4826761
		var params = new HashMap();
	    params.put("devCode", assignId);
	    params.put("reqId", getRequestId());
	    ENGDAO.execute("getGpsInfo", params, 
	    	 {success : function(resultVal) {
	    		 if(resultVal){
	    			 //alert("gps:"+resultVal);
	    			 var gps = resultVal.split(",");
	 				//央视116.471,39.921;天安门116.404,39.915
	 				//var para = "?deviceName="+assignId;
	 				var para = "?deviceName="+assignName;
	 				para += "&localX="+gps[0];
	 				para += "&localY="+gps[1];
	 				window.open("./baiduMap.htm"+encodeURI(encodeURI(para))
);
	 			}else{
	 				alert("获取设备定位坐标失败!");
	 			}
	    	  },
	    	  wsMode:"WEBSERVICE"
	    	 }
	    );
	}
	
	
	function getData(){
		var params = new HashMap();
	    params.put("devCode", obj_ass_uid);
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
	
	
	/**
	 * 模糊查询
	 */
	function searchConfirm() {
		var conditions = [];
	    if($('#log_time').val()){
	    	conditions.push([ "t.TASK_NAME", $('#log_time').val(), jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	    	conditions.push([ "t.TASK_CODE", $('#log_time').val(), jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	    }
	    gCrud.search(conditions);
	}
