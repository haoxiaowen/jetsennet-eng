
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor","datepicker", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);
var  startTime;
var  endTime;
var gR2tColumns = [{ fieldName: "OBJ_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRes2Price"},
                    { fieldName: "A", sortField: "A", width: 230, align: "center", name: "设备名称"},
                    { fieldName: "ITEM_OBJ_UOM", sortField: "ITEM_OBJ_UOM", width: 100, align: "center", name: "使用天数"},
                    { fieldName: "S", sortField: "S", width: 100, align: "center", name: "维保天数"},
                    { fieldName: "C", sortField: "C", width: 100, align: "center", name: "出库时间"},
                    { fieldName: "MAINT_REQ_TIME", sortField: "MAINT_REQ_TIME", width: 100, align: "center", name: "维保申请时间"},
                    { fieldName: "MAINT_END_TIME", sortField: "MAINT_END_TIME", width: 100, align: "center", name: "维保完成时间"},
                  ];
   var gCrud = $.extend(new jetsennet.Crud("divRentOutItem", gR2tColumns,"divPageRentOutItem"), {
     dao : SYSDAO,
     tableName : "PPN_RENT_OBJ",//PPN_RENT_OUT_ITEM 出库项表
     tabAliasName:"ob",
     name : "设备使用统计",
     className : "jetsennet.jdlm.beans.PpnRentOutItem",
     joinTables :[
                  ["PPN_RENT_OUT_ITEM", "t", "ob.OBJ_ASS_UID = t.ITEM_OBJ_CODE", jetsennet.TableJoinType.Left],
                  ["PPN_RENT_OUT", "au", "t.OUT_ID = au.OUT_ID", jetsennet.TableJoinType.Left],
                  ["PPN_RENT_MAINT_2_OBJ", "mo", "mo.OBJ_ID = ob.OBJ_ID", jetsennet.TableJoinType.Left],
                  ["PPN_DEV_MAINT", "m", "m.MAINT_ID = mo.MAINT_ID", jetsennet.TableJoinType.Left]
                  ],
   
     keyId : "ob.OBJ_ID",
     resultFields:"ob.*,t.*,ob.OBJ_NAME a,au.OUT_CREATE_TIME c,m.* ,round(to_number(m.MAINT_END_TIME -m.MAINT_REQ_TIME)) s"
   });
   gCrud.grid.enableMultiSelect=true;
   gCrud.grid.ondoubleclick = null;

   /**
    * 页面初始化
    */
   function pageInit(){	
   	gCrud.load();
   }
   gCrud.grid.ondoubleclick = null;
   
   
   /**
    * 条件查询出库项
    */
   function searchConfirm(){
   	 conditions=[];
   	 startTime=el('txtStartTime').value;
   	 endTime=el('txtEndTime').value;
   	 var textName=el('txtObjName').value;
   	if(startTime){
   		conditions.push([ "au.OUT_CREATE_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);	
   		conditions.push([ "m.MAINT_REQ_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);
   	}
   	if(endTime){
   		conditions.push(["au.OUT_CREATE_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
   		conditions.push(["m.MAINT_END_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
   	}
   	if(textName){
   		conditions.push(["ob.OBJ_NAME", textName, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String]);
   	}
   	gCrud.search(conditions);
   	}
   
   /**
    * 查看统计
    */
   function objImage(){	
	   startTime=el('txtStartTime').value;
	   	 endTime=el('txtEndTime').value;
	   	 var textName=el('txtObjName').value;
	   var url = "devtotal.htm?startTime="+startTime+"&endTime="+endTime+"&textName="+textName;
	   showIframDialog(url,'统计','divPopWin',{size:{ width : 800,height : 580}});
	 }


	function showIframDialog(url,title, controlId, options){
		el("iframePopWin").src = url;
		var dialog = new jetsennet.ui.Window(title);
		    jQuery.extend(dialog, {
		        title : title,
		        size : {
		            width : 800,
		            height : 580
		        },
		        enableMove : false,
				showScroll : false,
				cancelBox : false,
				maximizeBox : false,
				minimizeBox : false,
		        controls : [ controlId ],
		    }, options);
		    dialog.showDialog();
	}

