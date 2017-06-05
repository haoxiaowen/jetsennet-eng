var TempDefault = {};

/**
 * 版权信息
 */
TempDefault.right = "copyright      @2010-2016 北京捷成世纪科技股份有限公司";

/**
 * 应要求，顶部的布局宽度可以改变。 各个系统的logo大小可能不一致，各个系统的定制信息栏目个数可能不一样
 */
TempDefault.layout = {topLeft: 255, topRight:260};

/**
 * 右上方信息栏
 * 
 * 提示:可配置项title、css、img||font||content、badge、func
 *      title、badge的取值可以是字符串，数字，也可以是方法。
 *      当配置方法的时候，只需指定方法名称（不要用引号），该方法接收参数node（栏目的dom对象）
 *      图标可以是图片也可以是字体（字体只支持Font-Awesome）
 * img: "images/mainframe/message.PNG", font: "fa fa-envelope-o"
 * font: "fa fa-question-circle"
 */
TempDefault.messagebox=[{title:"个人资料", img: "images/mainframe/user.PNG", func: showUserInfo},
                        {title:"修改密码" , content: jetsennet.Application.userInfo.UserName, css: {"min-width": "50px", "max-width": "80px"}, func: changePassword},
                        {title:"消息", img: "images/mainframe/message.PNG", badge: initBadge, hover: false, func: showMessage},
                        {title:"帮助", img: "images/mainframe/help.PNG", badge: 1,  func: showHelp},
                        {title:"退出", font: "fa fa-sign-out", func: doLogout}];

function showMessage(node)
{
	/*var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = size.width;
	var height = size.height;
	var url = "../../../jue2/tasksystemweb/taskDetail.htm?";
	el("iframePopWin").src = url;
	gDialog = new jetsennet.ui.Window("show-divPopWin");
	jQuery.extend(gDialog, {
		size : {
			width : width,
			height : height
		},
		title : '任务单详情',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divPopWin" ];
	gDialog.show();*/
	var obj = new Object();
	obj.ID = "123456789";
	obj.NAME = "消息通知";
	obj.URL = "../../../jue2/jue2systemweb/receiveMes.htm";
	MyApp.showIframe(obj,false);
//	MyApp.showIframe({ID:"main", NAME:"我的首页", URL:"main.htm"}, true);
	
}
function showHelp(node)
{
    alert("相关帮助");
}
function initBadge(node)
{
	//首次登陆查询未读消息数量
	var gInt;
	var conditions = [];
	conditions.push([ "t.REC_STATUS",1, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ]);
	conditions.push([ "t.REC_READ",0, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ]);
	conditions.push([ "t.REC_USER",jetsennet.Application.userInfo.UserId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
    var queryRes=SYSDAO.query("commonXmlQuery", "REC_ID", "PPN_MSG_RECEIVE", "t",
    		[ [ "PPN_MSG", "p", "p.MSG_ID= t.MSG_ID", jetsennet.TableJoinType.Left ] ],conditions, "count(*) CT");
    var typeObjs = null;
    if (queryRes && queryRes.resultVal) {
    	if(jetsennet.xml.deserialize(queryRes.resultVal, "Record")!=null){
    		typeObjs = jetsennet.xml.deserialize(queryRes.resultVal, "Record")[0];
    		if (typeObjs != null) {
    			gInt = valueOf(typeObjs,"CT","");
    			}
    		}
    	}
    return gInt;
}

/**
 * 右下方工具栏
 * 
 * 配置参照messagebox，可配置项：title、css、font||img、func
 */
TempDefault.toolbox=[/*{title: "我的任务", font: "fa fa-tasks", func: showTasks},
                     {title: "系统配置", font: "fa fa-cog", func: sysConfig},
                     {title: "在线用户", font: "fa fa-users", func: showUsers},*/
                     {title: "日期时间", font: "fa fa-calendar", func: showDate}];

function showTasks()
{
    alert("我的任务");
}
function sysConfig()
{
    alert("系统配置");
}
function showUsers()
{
//    OnLineUser.list("divOnlineUserList");
}
function showDate()
{
    CalendarWidget.render("divCalendarWidget");
}

