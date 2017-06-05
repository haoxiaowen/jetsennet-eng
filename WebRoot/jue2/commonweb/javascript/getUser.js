/**
 *  选择人员
 *  @author zw 2016-7-25
 */

jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud"]); 

var gUserColumns = [{ fieldName: "USER_LOGIN_NAME", sortField: "USER_LOGIN_NAME", width: 120, align: "center", name: "工号"},
                    { fieldName: "USER_SCOPE", sortField: "USER_SCOPE", width: 120, align: "center", name: "登录名"},
                    { fieldName: "USER_FIELD1", sortField: "USER_FIELD1", width: 120, align: "center", name: "用户名"}];

var gCrud = $.extend(new jetsennet.Crud("divUserList", gUserColumns, "divUserPage", "order by t.USER_UID"), {
    dao : SYSDAO,
    tableName : "PPN_STOR_USER",
    name : "人员",
    className : "jetsennet.juum.schma.User",
    keyId : "t.USER_ID",
    resultFields : "t.USER_LOGIN_NAME, t.USER_SCOPE, t.USER_FIELD1"
});
var gUsers;//如果选择的是单条资源，而且已经指派人员了

/**
 * 页面初始化
 */
function pageInit() {
	Layoutit("#divPageFrame", {hLayout:[{vLayout: [46, "auto", 40]},160]});
    gCrud.load();
    gUsers = jetsennet.queryString("user_codes");
    if(gUsers){
        var gUserCodes = gUsers.split(",");
        var gUserNames = unescape(jetsennet.queryString("user_names")).split(",");
    	for(var i=0; i<gUserCodes.length; i++){
        	gCurrentUser = new Object();
        	gCurrentUser.LOGIN_NAME = gUserCodes[i];
        	gCurrentUser.USER_NAME = gUserNames[i];
        	addUser();
    	}
    }
};

/**
 * 查询用户
 */
function searchUser() {
    var conditions = [];
    if (el("txt_NAME").value != "") {
        conditions.push([ "USER_LOGIN_NAME", el('txt_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "USER_SCOPE", el('txt_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "USER_FIELD1", el('txt_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gCrud.search(conditions);
}

/**
 * 处理选中的用户信息
 */
var gCurrentUser;
var gSelectedUsers;

//添加用户
function addUser(){
	if(gCurrentUser){
		if(!isExist()){
			var op=document.createElement("option");
			el("nameList").appendChild(op);
			op.text = gCurrentUser.USER_NAME;
			op.value = gCurrentUser.LOGIN_NAME;
			doReturn();
		}
	}else{
		jetsennet.alert("请在左侧列表中选择要添加的人员");
	}
}

//删除用户
function deleteUser(){
	var select = el("nameList");
	var index = select.options.selectedIndex;
	if(index!=-1){
		select.options.remove(index);
	}
	doReturn();
}

// 行单击事件
gCrud.grid.onrowclick = function (item, td) {
	gCurrentUser = new Object();
	gCurrentUser.LOGIN_NAME = item.USER_LOGIN_NAME;
	gCurrentUser.USER_NAME = item.USER_FIELD1;
};

//行单双击击事件
gCrud.grid.ondoubleclick = function (item, td) {
	gCurrentUser = new Object();
	gCurrentUser.LOGIN_NAME = item.USER_LOGIN_NAME;
	gCurrentUser.USER_NAME = item.USER_FIELD1;
	addUser();
};

//是否重复判断
function isExist(){
	var ret = false;
	var options = el("nameList").options;
	var lens = options.length;
	for(var i=0; i<lens; i+=1){
		if(gCurrentUser.LOGIN_NAME==options[i].value){
			ret = true;
		}
	}
	return ret;
}

//返回数据处理
function doReturn(){
	var users = [];
	var options = el("nameList").options;
	var lens = options.length;
	for(var i=0; i<lens; i+=1){
		users.push(options[i].value);
	}
	window.parent.UserInfo = users.join(",");
}
