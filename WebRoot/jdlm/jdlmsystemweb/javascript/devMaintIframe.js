/**
 * 维保记录
 */
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","datepicker", "tabpane", "validate", "crud","bootstrap/moment","bootstrap/daterangepicker","plugins"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var ATTADAO = new jetsennet.DefaultDal("AttaFileService");
ATTADAO.dataType = "xml";
var ids;//接收来自对象页面传过来的对象id
var gNum=1;
var id;//编辑时接收到维保单的ID
var objIds=[];
var user="";


/**
 * 页面初始化
 */
function pageInit() {
	var obj;
	id=jetsennet.queryString("id");
    ids =jetsennet.queryString("ids");
	if(ids!="" && ids!=null && ids!="undefined"){
   // ids ="E96F5201-455C-4EFE-94EC-CCFB15494B0E,D3616D10-94EF-4119-B260-D411358BE4E1"
	var arr = ids.split(',');

	for(var i=0;i<arr.length;i++){
		obj =  SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ", "t", [["PPN_RENT_OBJ_TYPE", "au", "t.OBJ_TYPE_ID = au.OBJ_TYPE_ID", jetsennet.TableJoinType.Inner]],[["t.OBJ_ID", arr[i], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],"t.*,au.*");
		 generateTableFormRes(obj[0]) 
	}
	}
	if(id!=="undefined" && id!="" && id!=null){
		 var jointable=[["PPN_RENT_MAINT_2_OBJ", "au", "t.MAINT_ID = au.MAINT_ID", jetsennet.TableJoinType.Inner],
		                   ["PPN_RENT_OBJ", "ob", "ob.OBJ_ID = au.OBJ_ID", jetsennet.TableJoinType.Inner],
		                   ["PPN_RENT_OBJ_TYPE", "ty", "ob.OBJ_TYPE_ID = ty.OBJ_TYPE_ID", jetsennet.TableJoinType.Inner]];		   		    
	 oldObj =  SYSDAO.queryObjs("commonXmlQuery", null, "PPN_DEV_MAINT", "t", jointable,[["t.MAINT_ID", id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],"t.*,ob.*,ty.*");
	if(oldObj){     
     setObj(oldObj[0])//回写数据
      for(var i=0;i<oldObj.length;i++){
		  objIds.push(oldObj[i].OBJ_ID); //获取obj的ID，便于回写OBJ状态
		  generateTableFormRes(oldObj[i])
		    }
	}
	
	}
	

}	

 function setObj(obj) {
	el('MAINT_CODE').value = valueOf(obj, "MAINT_CODE", "");
    el("MAINT_TYPE").value = valueOf(obj, "MAINT_TYPE", "");
    el("MAINT_STATUS").value = valueOf(obj, "MAINT_STATUS", "");
   // el("TEMP_CREATE_TIME").value = valueOf(obj, "TEMP_CREATE_TIME", "");  
    el("MAINT_REQ_TIME").value = valueOf(obj, "MAINT_REQ_TIME", "");  
    el("MAINT_REQ_USER").value = valueOf(obj, "MAINT_REQ_USER", "");  
    el("MAINT_REQ_USER_TEL").value = valueOf(obj, "MAINT_REQ_USER_TEL", "");  
    el("MAINT_REQ_UNIT_NAME").value = valueOf(obj, "MAINT_REQ_UNIT_NAME", "");  
    el("MAINT_REASON").value = valueOf(obj, "MAINT_REASON", "");  
    el("MAINT_END_TIME").value = valueOf(obj, "MAINT_END_TIME", "");  
    el("MAINT_DESC").value = valueOf(obj, "MAINT_DESC", "");  
    el("MAINT_DEAL_USER").value = valueOf(obj, "MAINT_DEAL_USER", "");         
  /*  el("MAINT_STATION").value = valueOf(obj, "MAINT_STATION", "");  
    el("MAINT_TOTAL_FEE").value = valueOf(obj, "MAINT_TOTAL_FEE", "");  
    el("MAINT_FEE_DESC").value = valueOf(obj, "MAINT_FEE_DESC", "");  
    el("MAINT_FEE_STATUS").value = valueOf(obj, "MAINT_FEE_STATUS", "");  */      

}

/**
	 * 根据资源填写维保单
	 * @param objout
	 * @param type 
	 */
	function generateTableFormRes(objout) {
		var bodydiv = jQuery("#divdetail");//动态添加table所在div
		// 构造出库项详情table--------开始------------
		var restable = document.createElement("table");
		jQuery(restable).addClass("table-info");// 设置tableclass
		restable.id = 'tableres' + gNum;// 设置tableid
	/*	if(type){
			jQuery(restable).css("visibility", "hidden");
		}else{
			jQuery(restable).css("visibility", "visible");
		}*/
		jQuery(restable).css("visibility", "visible");
		var restbody = jQuery("#resdemo");
		var restblBody = document.createElement("tbody");
		jQuery(restblBody).addClass("divchukudan");
		jQuery(restblBody).html(restbody.html());
		jQuery(restable).append(restblBody);
		bodydiv.append(restable);
		
		jQuery(restblBody).find("tbody").find("tr input[type='text']").each(
				function(i) {
				if ($(this).attr('name') == 'txt_OBJ_CODE') {
					$(this).val(objout.OBJ_CODE);
					$(this).attr('id','txt_OBJ_CODE' + gNum);
				}
				if ($(this).attr('name') == 'txt_OBJ_NAME') {
					$(this).val(objout.OBJ_NAME);
					$(this).attr('id','txt_OBJ_NAME' + gNum);
				}
				if ($(this).attr('name') == 'txt_OBJ_TYPE_NAME') {
					$(this).val(objout.OBJ_TYPE_NAME);
					$(this).attr('id','txt_OBJ_TYPE_NAME' + gNum);
				}
				
				});
		gNum++;
	}



/**
 * 查询
 */

function searchtemp() {
    var conditions = [];
    var subConditions = [];
    if(el('txt_DESC').value){
    subConditions.push([[ "t.TEMP_CODE",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ],
	                 [ "t.TEMP_NAME", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]]);
    }
    gCrud.search(conditions, subConditions);
}


var gSelectUserColumns = [ {
    fieldName : "ID,USER_NAME,STATE",
    width : 30,
    align : "center",
    isCheck : 0,
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
Layoutit("#divSelectUser", {vLayout: [50, "auto", 35]});
var gUserCrud = $.extend(new jetsennet.Crud("divSelectUserList", gSelectUserColumns, "divSelectUserPage", "order by t.ID"), {
    dao : UUMDAO,
    tableName : "UUM_USER",
    name : "用户",
});
gUserCrud.grid.ondoubleclick = null;
var userGrid = gUserCrud.grid;//表格单击时间
userGrid.onrowclick = userOnRowClick;
function userOnRowClick(item, td) {
	user=item;
}



/**
 *  保存按钮
 */
function goParent() {
	
		if(!($("#MAINT_CODE").prop("value"))){
			jetsennet.warn("维保代码不能为空!");
			return;
		}
		if(!($("#MAINT_REQ_TIME").prop("value"))){
			jetsennet.warn("申请时间不能为空!");
			return;
		}
		if(!($("#MAINT_REQ_USER").prop("value"))){
			jetsennet.warn("申请人员不能为空!");
			return;
		}
		if(!($("#MAINT_REASON").prop("value"))){
			jetsennet.warn("申请原因不能为空!");
			return;
		}
		if(!($("#MAINT_END_TIME").prop("value"))){
			jetsennet.warn("完成时间不能为空!");
			return;
		}	if(!($("#MAINT_DEAL_USER").prop("value"))){
			jetsennet.warn("维保人员不能为空!");
			return;
		}
		if(el('MAINT_REQ_TIME').value.trim()>=el('MAINT_END_TIME').value.trim()){
			 jetsennet.alert("申请日期不能大于完成日期");
			 return false;
		 }
		if(id!=null && id!=""&& id!="undefined"){ //编辑
			if(!_checkEditCode(id)){
				jetsennet.warn("维保单号已存在!");
				return;
			}
			var objXml = "<TABLES>";
			var _Task = {  
					MAINT_ID:id,
	        		MAINT_CODE : el('MAINT_CODE').value,
	        		MAINT_TYPE : el('MAINT_TYPE').value,
	        		MAINT_STATUS : el('MAINT_STATUS').value,
	        		MAINT_REQ_TIME : el('MAINT_REQ_TIME').value,
	        		MAINT_REQ_USER :el('MAINT_REQ_USER').value,
	        		MAINT_REQ_USER_TEL : el('MAINT_REQ_USER_TEL').value,
	        		MAINT_REQ_UNIT_NAME : el('MAINT_REQ_UNIT_NAME').value,
	        		MAINT_REASON : el('MAINT_REASON').value,
	        		MAINT_END_TIME : el('MAINT_END_TIME').value,
	        		MAINT_DESC : el('MAINT_DESC').value,
	        		MAINT_DEAL_USER : el('MAINT_DEAL_USER').value,
	        /*		MAINT_STATION : el('MAINT_STATION').value,
	        		MAINT_TOTAL_FEE : el('MAINT_TOTAL_FEE').value,
	        		MAINT_FEE_DESC : el('MAINT_FEE_DESC').value,
	        		MAINT_FEE_STATUS : el('MAINT_FEE_STATUS').value,    */		
	        };
	        objXml+=  jetsennet.xml.serialize(_Task,"TABLE"). replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnDevMaint'>");
	  
	        objXml+="</TABLES>";
	        var params = new HashMap();
	        params.put("updateXml", objXml);
	        params.put("ids", objIds.join(","));
	        ATTADAO.execute("updateDev", params, 
	        		{success : function(resultVal) {
	        			parent.location.reload();
	        		 },
	        		 wsMode:"WEBSERVICE"
	        		}
	        
	        );
		}
		else{ //新增
			if(!_checkCode()){
				jetsennet.warn("维保单号已存在!");
			}
		var objXml = "<TABLES>";
		var _Task = {       	
        		MAINT_CODE : el('MAINT_CODE').value,
        		MAINT_TYPE : el('MAINT_TYPE').value,
        		MAINT_STATUS : el('MAINT_STATUS').value,
        		MAINT_REQ_TIME : el('MAINT_REQ_TIME').value,
        		MAINT_REQ_USER :el('MAINT_REQ_USER').value,
        		MAINT_REQ_USER_TEL : el('MAINT_REQ_USER_TEL').value,
        		MAINT_REQ_UNIT_NAME : el('MAINT_REQ_UNIT_NAME').value,
        		MAINT_REASON : el('MAINT_REASON').value,
        		MAINT_END_TIME : el('MAINT_END_TIME').value,
        		MAINT_DESC : el('MAINT_DESC').value,
        		MAINT_DEAL_USER : el('MAINT_DEAL_USER').value,
        /*		MAINT_STATION : el('MAINT_STATION').value,
        		MAINT_TOTAL_FEE : el('MAINT_TOTAL_FEE').value,
        		MAINT_FEE_DESC : el('MAINT_FEE_DESC').value,
        		MAINT_FEE_STATUS : el('MAINT_FEE_STATUS').value,    */		
        };
        objXml+=  jetsennet.xml.serialize(_Task,"TABLE"). replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnDevMaint'>");
  
        objXml+="</TABLES>";
        var params = new HashMap();
        params.put("saveXml", objXml);
        params.put("ids",ids);
      //  var result = ATTADAO.execute("insertDevMaints", params);
     ATTADAO.execute("insertDevMaints", params, 
        		{success : function(resultVal) {
        			parent.location.reload();
        		 },
        		 wsMode:"WEBSERVICE"
        		}
        
        );
		}
}
function getDealUser(){
    var dialog = new jetsennet.ui.Window("new-divControl1");
    jQuery.extend(dialog, {
        title : "选择人员",
        size : {
            width : 520,
            height : 370
        },
        submitBox : true,
        cancelBox : true,
        showScroll : false,
        controls : ["divSelectUser"],
    } );
    dialog.onsubmit = function() {
    if(user==""){
    	jetsennet.alert("请选择一个人员");
    	return ;
    }
    $("#MAINT_DEAL_USER").val(user.USER_NAME);  
        return true;
    };
    dialog.showDialog();
    gUserCrud.load();
};

function selectUser(){
    var dialog = new jetsennet.ui.Window("new-divControl2");
    jQuery.extend(dialog, {
        title : "选择人员",
        size : {
            width : 520,
            height : 370
        },
        submitBox : true,
        cancelBox : true,
        showScroll : false,
        controls : ["divSelectUser"],
    } );
    dialog.onsubmit = function() {
    if(user==""){
    	jetsennet.alert("请选择一个人员");
    	return ;
    }
    $("#MAINT_REQ_USER").val(user.USER_NAME);  
        return true;
    };
    dialog.showDialog();
    gUserCrud.load();
};

/**
 * 查询用户
 */
function searchSelectUserData() {
    var conditions = [];
    el('txtUserName').value = jetsennet.util.trim(el('txtUserName').value);
    el('txtLoginName').value = jetsennet.util.trim(el('txtLoginName').value);
    if (el('txtUserName').value != "") {
        conditions.push([ "t.USER_NAME", el('txtUserName').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    if (el('txtLoginName').value != "") {
        conditions.push([ "t.LOGIN_NAME", el('txtLoginName').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gUserCrud.search(conditions);
}
/**
 * 检查单号是够重复 新增条件
 * @returns {Boolean}
 */
function _checkCode() {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_DEV_MAINT", null, null,null);
    if (funcs) {
        var CODE = el("MAINT_CODE").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].MAINT_CODE) {
                el('MAINT_CODE').focus();
                return false;
            }
        }
    }
    return true;
}
/**
 * 检查单号是够重复 编辑条件
 * @returns {Boolean}
 */
function _checkEditCode(id) {
    var funcs = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_DEV_MAINT", null, null,null);
    if (funcs) {
        var CODE = el("MAINT_CODE").value;
        for (var i = 0; i < funcs.length; i++) {
            if (CODE == funcs[i].MAINT_CODE && funcs[i].MAINT_ID!=id) {
                el('MAINT_CODE').focus();
                return false;
            }
        }
    }
    return true;
}