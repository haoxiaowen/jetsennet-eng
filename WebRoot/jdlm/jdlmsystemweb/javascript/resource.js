/** ===========================================================================
 * 用户管理
 * 20161211，jianghaisheng，新建
 * 20161211，jianghaisheng，修改
 * Copyright (c) Beijing Jetsen Technology Co., Ltd. All Rights Reserved.
 * ============================================================================
 */
jetsennet.require(["pageframe","window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "datepicker", "jquery/jquery.md5","plugins"]);

var ASSIGNDAO = new jetsennet.DefaultDal("PpnSourceService");
ASSIGNDAO.dataType = "xml";

/**
 * 页面初始化
 */
function pageInit() {
	gSour.load();
}

/**
 * 保存申请单
 */
function addSource() {
	var gDialog;
	var size = jetsennet.util.getWindowViewSize();
	var width = size.width;
	var height = size.height;
	var url = "../../jdlm/jdlmsystemweb/resourceDetail.htm?";
	el("iframeSourceWin").src = url;
	gDialog = new jetsennet.ui.Window("add-divSourceWin");
	jQuery.extend(gDialog, {
		size : {
			width : width,
			height : height
		},
		title : '出库单',
		enableMove : false,
		showScroll : false,
		cancelBox : false,
		maximizeBox : false,
		minimizeBox : false
	});
	gDialog.controls = [ "divSourceWin" ];
	gDialog.show();
}

function editSource(){
	var obj = new Object();
	obj.URL = "../../jdlm/jdlmsystemweb/resourceDetail.htm";
	parent.MyApp.showIframe(obj,false);
}


var gApplicationColumns = [{ fieldName: "OUT_ID", width: 30, align: "center", isCheck: 1, checkName: "chkOUT"},
                           { fieldName: "OUT_NAME", sortField: "OUT_NAME", width: 160, align: "center", name: "出库单名称"},
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
                           		 return "未提交";
                           	 }else if(val==2){
                           		 return "已出库";
                           	 }else if(val==3){
                           		 return "已审核";
                           	 }else if(val == 4){
                           		 return "已取消";
                           	 }
                            }
                           },
                           
                           { fieldName: "OUT_DESC", sortField: "OUT_DESC", width: 160, align: "center", name: "出库备注"}];
       var gSour = $.extend(new jetsennet.Crud("divApplicationList", gApplicationColumns, "divApplicationPage"), {
           dao : ASSIGNDAO,
           tableName : "PPN_RENT_OUT",
           joinTables :[["UUM_DEPARTMENT", "u", "u.POSTALCODE = t.OUT_DEPT_CODE", jetsennet.TableJoinType.Left],
                        ["PPN_CDM_COLUMN", "c", "C.COL_CODE = t.OUT_COLN_CODE", jetsennet.TableJoinType.Left]],
           resultFields : "t.OUT_ID,t.OUT_NAME,t.OUT_USER,u.name as OUT_DEPT_CODE,c.COL_NAME as OUT_COLN_CODE,t.OUT_START_TIME,t.OUT_END_TIME,t.OUT_CHECK_USER,t.OUT_CREATE_TIME,t.OUT_DESC,t.OUT_STATUS",
           tabAliasName : 't',
           name : "出库单",
           className : "jetsennet.jue2.beans.PpnRentOut",
           cfgId : "divadd",
           checkId : "chkOUT",
       });
       gSour.grid.ondoubleclick = null;
       
     //出库项
       var gcColumnsource = [  { fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "item_id"},
       	                    { fieldName: "ITEM_CODE", sortField: "ITEM_CODE", width: 90, align: "center", name: "资源代码"},
       	                    { fieldName: "ITEM_OBJ_CODE", sortField: "ITEM_OBJ_CODE", width: 90, align: "center", name: "序列号" },
       	                    { fieldName: "ITEM_NAME", sortField:"ITEM_NAME", width: 90, align: "center", name: "资源名称" },
       	                    { fieldName: "ITEM_OBJ_UOM", sortField:"ITEM_OBJ_UOM", width: 90, align: "center", name: "单元数量" },
       	                    { fieldName: "ITEM_OBJ_TYPE", sortField:"ITEM_OBJ_TYPE", width: 90, align: "center", name: "资源类型" },
       	                    { fieldName: "ITEM_OBJ_NUM", sortField:"ITEM_OBJ_NUM", width: 90, align: "center", name: "资源数量" },
       	                    { fieldName: "ITEM_MATH_CODE", sortField:"ITEM_MATH_CODE", width: 90, align: "center", name: "验证码" },
       	                    { fieldName: "ITEM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
       	                	  return jetsennet.Crud.getDeleteCell("gCrudSource.remove('" + val + "')");
                           }}
       	                   ];
       var gCrudItem = $.extend(new jetsennet.Crud("divoutItem", gcColumnsource, "divPageItem", "order by t.ITEM_ID"), {
       	    dao : ASSIGNDAO,
       	    tableName : "PPN_RENT_OUT_ITEM",
       	    name : "出库项信息",
       	    className : "jetsennet.jue2.beans.PpnRentOutItem",
       	    checkId : "item_id",
       	    cfgId : "divsour",
       	    keyId:   "ITEM_ID",
       });
       gCrudItem.grid.ondoubleclick = null;
       
       /**
        * 单击事件  点击左边的出库单grid，显示右边的出库项
        */
       var gSourGrid = gSour.grid;
       gSourGrid.onrowclick = resOnRowClick;

       function resOnRowClick(item, td) {
       	gId = item.OUT_ID;
       	loadResType(gId);
       }
       function loadResType(ID){
       	var conditions = [["t.OUT_ID", ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
       	gCrudItem.search(conditions);
       }
       
       function examineSub(){
    		//出库单ID、出库项ID 
    		var checkIds = jetsennet.form.getCheckedValues("chkOUT"); 
    		if(checkIds.length==0){
    			alert("请选择出库单");
    			return;
    		}
    		if(obj.length != ""){
    				 var params = new HashMap();
     				 params.put("out_id", checkIds.join(","));
     					 ASSIGNDAO.execute("submitSource", params, {
     					 	    success: function(result) {
     					 	    	jetsennet.alert("提交审核成功!");
     					 	    	gCrudItem.load();
     					 	    	return true;
     					 	    },
     					 	   error: function(errCode,errStr) {
     						    	jetsennet.error("提交审核失败");
     						    	gCrudItem.load();
     						    	return false;
     						    },
     					 	}); 
    			  }
    			}
       
       function removeSource(id){
    		  var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkOUT") : jetsennet.Crud.getCheckIds(id,"chkOUT");
    			 if (checkIds.length == 0) {
    			        jetsennet.alert("请选择要删除的数据！");
    			        return;
    			    }
    			jetsennet.confirm(gSour.msgConfirmRemove, function() {
    		        var result = ASSIGNDAO.execute("removeSource", checkIds.join(","));
    		        if (result && result.errorCode == 0) {
    		        	gSour.load();
    		        }
    		        return true;
    		    });
    	  }
    
function uploadSour(id){
  /*var id;
  var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkOUT") : jetsennet.Crud.getCheckIds(id,"chkOUT");
  if (checkIds.length == 0) {
      jetsennet.alert("请选择选择上传的数据！");
      return;
  }else if(checkIds.length == 1){
	  //window.location.href = "../../jdlm/jdlmsystemweb/rentAttaFile.htm?code='"+checkIds.join(",")+"'&FileStyleVal="+2;
	  window.location.href = "../../jdlm/jdlmsystemweb/rentAttaFile.htm?code="+checkIds.join(",")+"&FileStyleVal="+2;
  }else{
	  alert("请选择一条数据上传！");
  }*/
  	var id = null;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkOUT") : jetsennet.Crud.getCheckIds(id,"chkOUT");
	if(checkIds.length != 1){
		jetsennet.alert("请选择一条上传的数据！");
		return;
	}
	el("iframeSourcefile").src = "../../jdlm/jdlmsystemweb/rentAttaFile.htm?code="+checkIds.join(",")+"&FileStyleVal="+2;
	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:true,showScroll:true,size:{width:800,height:630},title:"出库单"});
	dialog.controls = ["divSourcefile"];
	dialog.showDialog();
}
/**
 * 查询
 */
function searchRetu() {
    var conditions = [];
    gSour.search(conditions);
}