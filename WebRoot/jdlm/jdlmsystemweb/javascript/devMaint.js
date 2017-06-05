/**
 * 维保记录
 */
jetsennet.require(["window","pageframe", "layoutit","gridlist", "pagebar", "jetsentree", "validate", "datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");

var gMaintColumns = [{ fieldName: "MAINT_ID", width: 30, align: "center", isCheck: 1, checkName: "chkTemp"},
                    { fieldName: "MAINT_CODE", sortField: "MAINT_CODE", width: 150, align: "center", name: "维保单号"},
                   // { fieldName: "OBJ_NAME", sortField: "OBJ_NAME", width: 150, align: "center", name: "维保对象"},
                    { fieldName: "MAINT_TYPE", sortField: "MAINT_TYPE", width: 70, align: "center", name: "维保类型",format: function(val, vals){
						 if (val == 1) {
	                            return "保养";}
	                       else {
	                            return "维修";
	                        }
					}},
                    { fieldName: "MAINT_STATUS", sortField: "MAINT_STATUS", width: 70, align: "center", name: "维修状态",format: function(val, vals){
						 if (val == 0) {
	                            return "待维保";}
	                       else if(val==1){
	                            return "维保中";
	                        }else{
	                        	return "已结束";
	                        }
					}},
     					
                    {fieldName: "MAINT_REQ_TIME", sortField: "MAINT_REQ_TIME", width: 100, align: "center", name: "申请时间"},
                    {fieldName: "MAINT_REQ_USER", sortField: "MAINT_REQ_USER", width: 100, align: "center", name: "申请人员"},
                    {fieldName: "MAINT_REQ_USER_TEL", sortField: "MAINT_REQ_USER_TEL", width: 150, align: "center", name: "申请人电话"},
                    {fieldName: "MAINT_REQ_UNIT_NAME", sortField: "MAINT_REQ_UNIT_NAME", width: 100, align: "center",name: "申请单位名称"},
                    {fieldName: "MAINT_REASON", sortField: "MAINT_REASON", width: 150, align: "center", name: "申请原因"},
                    {fieldName: "MAINT_END_TIME", sortField: "MAINT_END_TIME", width: 100, align: "center", name: "完成时间"},
                    //{fieldName: "MAINT_DESC", sortField: "MAINT_DESC", width: 150, align: "center", name: "维保意见"},
                   // {fieldName: "MAINT_DEAL_USER", sortField: "MAINT_DEAL_USER", width: 100, align: "center", name: "维保人员"},
      					  
					  // {fieldName: "MAINT_STATION", sortField: "MAINT_STATION", width: 100, align: "center", name: "维修商家"},
					   //{fieldName: "MAINT_TOTAL_FEE", sortField: "MAINT_TOTAL_FEE", width: 100, align: "center", name: "费用，最小结算单元"},
                    { fieldName: "MAINT_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                  /*  { fieldName: "MAINT_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}*/
                    ];
var gCrud = $.extend(new jetsennet.Crud("divDevMaintList", gMaintColumns, "divDevMaintPage"), {
    dao : SYSDAO,
    tableName : "PPN_DEV_MAINT",
    name : "维保记录",
    className : "jetsennet.jdlm.beans.PpnDevMaint",
    keyId : "t.MAINT_ID",
   // joinTables :[["PPN_RENT_MAINT_2_OBJ", "au", "t.MAINT_ID = au.MAINT_ID", jetsennet.TableJoinType.Inner],
               //  ["PPN_RENT_OBJ", "ob", "ob.OBJ_ID = au.OBJ_ID", jetsennet.TableJoinType.Inner]],
  // resultFields : "t.*,ob.*",
    checkId : "chkTemp",
    cfgId : "divDevMaint", 
    });

/**
 * 页面初始化
 */
function pageInit() {
	gCrud.load();
}
/**
*条件查询
 */
 function searchMaint(){
	 var conditions = [];
	    var val=el('txt_DESC').value;
	    if (val) {
	        conditions.push([ "ob.OBJ_NAME", val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	    }
	    gUserCrud.search(conditions);
 }

 function showIframDialog(url,title, controlId){
		el("iframePopWin").src = url;
		var size = jetsennet.util.getWindowViewSize();
		var width = size.width;
		var height = size.height;
		var dialog = new jetsennet.ui.Window(title);
		    jQuery.extend(dialog, {
		        title : title,
		        size : {
		            width : width,
		            height : height
		        },
		        submitBox:false,cancelBox:true,
		        controls : [ controlId ],
		    });
		    dialog.showDialog();
	}
 
 gCrud.add=function(){
	/*	var obj = new Object();
		obj.URL = "../../jdlm/jdlmsystemweb/resourceDetail.htm";
		parent.MyApp.showIframe(obj,false);*/
		
	 var url ="devMaintIframe.htm";
	 //parent.MyApp.showIframe(obj,false);
		showIframDialog(url,'维保新增','divPopWin');
 }
 gCrud.edit=function(id){
	   var $this = this;
	    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
	    if (checkIds.length != 1) {
	        jetsennet.alert("请选择一个要" + this.msgEdit + "的" + this.name + "！");
	        return;
	    }
	    var jointable=[["PPN_RENT_MAINT_2_OBJ", "au", "t.MAINT_ID = au.MAINT_ID", jetsennet.TableJoinType.Inner],
	                   ["PPN_RENT_OBJ", "ob", "ob.OBJ_ID = au.OBJ_ID", jetsennet.TableJoinType.Inner],
	                 ];		   		    
       oldObj =  SYSDAO.queryObjs("commonXmlQuery", null, "PPN_DEV_MAINT", "t", jointable,[["t.MAINT_ID", checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],"t.*,ob.*");
       if(!oldObj){
    	 jetsennet.warn("该记录关联的资源已经被删除");
   		return false; 
       }
		 var url ="devMaintIframe.htm?id="+checkIds[0];
		 //parent.MyApp.showIframe(obj,false);
			showIframDialog(url,'维保编辑','divPopWin');
	 }