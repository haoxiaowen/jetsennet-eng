/**
 * 申请管理
 */
jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");

var ordId = jetsennet.queryString("ORD_ID");
var ordCode = jetsennet.queryString("ORD_CODE");
//回传的数据
var retObj=[];
/**
 * 初始化 加载
 */
function pageInit(){
	
    if(ordId){
    	var conditions = [ [ 't.ORD_ID', ordId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
    	var joinTables =  [["PPN_RENT_ORD_ITEM", "p", "p.ORD_ID=t.ORD_ID", jetsennet.TableJoinType.Left]];
    	var results = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",joinTables, conditions, '*');
    	if(results){
    		el("ORD_USER_NAME").value = "("+results[0].ORD_USER_CODE+")"+ results[0].ORD_USER_NAME;
        	el('ORD_START_TIME').value = results[0].ORD_START_TIME;
        	el('ORD_END_TIME').value = results[0].ORD_END_TIME;
        	el('ORD_DESC').value = results[0].ORD_DESC;
        	el('txt_ORD_DEPT_NAME').value = "("+results[0].ORD_DEPT_CODE + ")" + results[0].ORD_DEPT_NAME;
        	el('txt_ORD_COLUMN_NAME').value = "("+results[0].ORD_COLUMN_CODE + ")" + results[0].ORD_COLUMN_NAME;
        	el('txt_ORD_NAME').value = results[0].ORD_NAME;
        	el('ORD_CREATE_TIME').value = results[0].ORD_CREATE_TIME;
        	el('txt_ORD_USE_CITY').value = results[0].ORD_USE_CITY;
    	}
    	var conditio = [ [ 't.ORD_ID', ordId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
    	var resul = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_ORD_ITEM', "t",null, conditio,
    			"ORD_ID,ITEM_CODE,ITEM_NAME,ITEM_OBJ_TYPE,ITEM_OBJ_KEY,ITEM_OBJ_NUM,"
    			+"ITEM_OBJ_UOM,ITEM_OBJ_UOM_SUM,ITEM_OBJ_PRICE,ITEM_OBJ_CURRENCY,ITEM_OBJ_DESC,ITEM_REMARK," +
    			"ITEM_START_TIME,ITEM_END_TIME,ITEM_CREATE_TIME,ITEM_OBJ_SPECS,ITEM_OBJ_CODE");
    	if(resul){
    		retObj = resul;
    		//set 借用内容
    		var subtable;
    		for(var i = 0; i < resul.length ; i++){
        		subtable = "<tr>"
        			
        		subtable += "<td width = \"3px\"><input type = \"checkBox\"  /></td>"+
        					"<td>"+resul[i].ITEM_NAME+"</td>"+
        					"<td>"+resul[i].ITEM_OBJ_UOM_SUM+"</td>"+
        					"<td>"+resul[i].ITEM_OBJ_UOM+"</td>"+
        					"<td>"+resul[i].ITEM_REMARK+"</td></tr>"
        		$("#spellTab").append(subtable);
        	}
    	}
    	
    	//set 审核情况
    	/*var condition = [ [ 'CHECK_OBJ_CODE', ordCode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
    	var result = SYSDAO.queryObjs('commonXmlQuery', 'CHECK_ID', 'PPN_RENT_CHECK', "t",null, condition, '*');
    	if(!result){
    		return;
    	}
    	var checktable;
    	for(var i = 0 ; i < result.length ; i++ ){
    		checktable = "<tr>"
    			checktable += "<td>"+result[i].ITEM_NAME+"</td>"+
        				"<td>"+result[i].ITEM_OBJ_NUM+"</td>"+
        				"<td>"+result[i].ITEM_OBJ_UOM+"</td>"+
        				"<td>"+result[i].ITEM_REMARK+"</td></tr>"
        	$("#spellChkTab").append(checktable);
    	}*/
    }else{
    	var code = jetsennet.Application.userInfo.LoginId;
		var name = jetsennet.Application.userInfo.UserName;
		el('ORD_USER_NAME').value = "("+code+")"+name;
		el('ORD_CREATE_TIME').value = new Date().toDateTimeString();
    }

}



var tr = [];
/**
 * 行 单击事件
 */
function tabtr(o){

}
function remove(){
	var o = document.getElementById('spellTab').getElementsByTagName('input');
	if(o.length>0){
		for(var i = o.length-1 ; i >= 0 ; i--){
			if (!o[i].checked) {  
		        continue;  
		    }
			var r = o[i].parentNode.parentNode;
			r.innerHTML = "";
			retObj.splice(i,1);
		}
	}
}
function checkdes(){
	if(el('ORD_USER_NAME').value == "" || el('ORD_USER_NAME').value == null){
		jetsennet.alert("申请人,不能为空！");
		return false;
	}
	if(el('txt_ORD_DEPT_NAME').value == "" || el('txt_ORD_DEPT_NAME').value == null){
		jetsennet.alert("申请部门,不能为空！");
		return false;
	}
	if(el('ORD_CREATE_TIME').value == "" || el('ORD_CREATE_TIME').value == null){
		jetsennet.alert("申请时间,不能为空！");
		return false;
	}
	if(el('txt_ORD_NAME').value == "" || el('txt_ORD_NAME').value == null){
		jetsennet.alert("申请单名称,不能为空！");
		return false;
	}
	if(el('txt_ORD_COLUMN_NAME').value == "" || el('txt_ORD_COLUMN_NAME').value == null){
		jetsennet.alert("申请栏目,不能为空！");
		return false;
	}
	if(el('ORD_START_TIME').value == "" || el('ORD_START_TIME').value == null){
		jetsennet.alert("开始时间,不能为空！");
		return false;
	}
	if(el('ORD_END_TIME').value == "" || el('ORD_END_TIME').value == null){
		jetsennet.alert("归还时间,不能为空！");
		return false;
	}
	if(el('txt_ORD_USE_CITY').value == "" || el('txt_ORD_USE_CITY').value == null){
		jetsennet.alert("使用城市,不能为空！");
		return false;
	}
	if(el('ORD_START_TIME').value.trim()>=el('ORD_END_TIME').value.trim()){
		 jetsennet.alert("起借日期不能大于归还日期");
		 return false;
	 }
	return true;
}
function save(val){
	if(!checkdes()){
		return;
	}
	if(ordId){
		
		var xml="";
		
		var tab = {
			//ORD_CODE : ordcode,
			ORD_ID : ordId,
			ORD_STATUS : "1",
			ORD_USER_NAME : el("ORD_USER_NAME").value.split(")")[1], 
			ORD_USER_CODE : el("ORD_USER_NAME").value.split(")")[0].replace("(",""), 
			ORD_START_TIME:el('ORD_START_TIME').value, 
			ORD_END_TIME:el('ORD_END_TIME').value, 
			//ORD_FEE_DESC:el('ORD_FEE_DESC').value, 
			ORD_DESC:el('ORD_DESC').value,
			ORD_DEPT_NAME:el('txt_ORD_DEPT_NAME').value.split(")")[1],
			ORD_DEPT_CODE : el('txt_ORD_DEPT_NAME').value.split(")")[0].replace("(",""),
			ORD_COLUMN_NAME:el('txt_ORD_COLUMN_NAME').value.split(")")[1], 
			ORD_COLUMN_CODE : el('txt_ORD_COLUMN_NAME').value.split(")")[0].replace("(",""),
			ORD_NAME:el('txt_ORD_NAME').value,
			ORD_CREATE_TIME:el('ORD_CREATE_TIME').value,
			ORD_USE_CITY:el('txt_ORD_USE_CITY').value,
		};
		xml += jetsennet.xml.serialize(tab,"jetsennet.jdlm.beans.PpnRentOrd");
		
		
	   
		 var params = new HashMap();
		 params.put("updateXml",xml);
		 params.put("className","jetsennet.jdlm.beans.PpnRentOrd");
		 params.put("isFilterNull", true);
	     var result = SYSDAO.execute("commonObjUpdateByPk", params);
	     if (result && result.errorCode == 0) {
	    	 
	    	 var params = new HashMap();
	    	 var conditions = [ [ 'ORD_ID', ordId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	         var results = SYSDAO.queryObjs('commonXmlQuery', 'ITEM_ID', 'PPN_RENT_ORD_ITEM', "t",null, conditions, 'ITEM_ID');
	         if(results){
	        	 var checkIds = "";
		         for(var i = 0 ; i < results.length ; i++){
		        	 if(i==results.length-1){
		        		 checkIds+=results[i].ITEM_ID
		        	 }else{
		        		 checkIds+=results[i].ITEM_ID +",";
		        	 }
		         }
		 		 params.put("className", "jetsennet.jdlm.beans.PpnRentOrdItem")
		 	     params.put("ids", checkIds);
		 		 //params.put("saveXml",xml);
		 	     var result = SYSDAO.execute("commonObjDelete", params,{wsMode:"WEBSERVICE"});
	         }
	         
	 	     if(retObj.length > 0){
	 	    	var retxml = "<TABLES>";
		 	    for(var i = 0; i < retObj.length; i++){
		 	    	retxml += jetsennet.xml.serialize(retObj[i],"TABLE")
						.replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentOrdItem'>")
						.replace("<ORD_ID></ORD_ID>", "<ORD_ID>"+ordId+"</ORD_ID>")
				}
		 	    retxml+="</TABLES>"
		 	    var para = new HashMap();
		 	    para.put("saveXml",retxml);
		 	    var res = SYSDAO.execute("commonObjsInsert", para);
		 	    if(res && res.errorCode == 0){
		 	    	if(val=="1"){

			        	 suCheck(ordId);
			         }
			         jetsennet.confirm("操作成功！",function(){
			        	 parent.location.reload(); 
			         });
			         //window.location.reload();
			         
			        // return true;
		 	    }
	 	     }else{
	 	    	jetsennet.confirm("操作成功！",function(){
		        	 parent.location.reload(); 
		         }); 
	 	     }
	 	    
	     }
		
		
	}else{
	var xml ="<TABLES>"
	var ordcode = new Date().getTime();
	var tab = {
		ORD_CODE : ordcode,
		ORD_STATUS : "1",
		ORD_USER_NAME : el("ORD_USER_NAME").value.split(")")[1], 
		ORD_USER_CODE : el("ORD_USER_NAME").value.split(")")[0].replace("(",""), 
		ORD_START_TIME:el('ORD_START_TIME').value, 
		ORD_END_TIME:el('ORD_END_TIME').value, 
		//ORD_FEE_DESC:el('ORD_FEE_DESC').value, 
		ORD_DESC:el('ORD_DESC').value,
		ORD_DEPT_NAME:el('txt_ORD_DEPT_NAME').value.split(")")[1],
		ORD_DEPT_CODE : el('txt_ORD_DEPT_NAME').value.split(")")[0].replace("(",""),
		ORD_COLUMN_NAME:el('txt_ORD_COLUMN_NAME').value.split(")")[1], 
		ORD_COLUMN_CODE : el('txt_ORD_COLUMN_NAME').value.split(")")[0].replace("(",""),
		ORD_NAME:el('txt_ORD_NAME').value,
		ORD_CREATE_TIME:el('ORD_CREATE_TIME').value,
		ORD_USE_CITY:el('txt_ORD_USE_CITY').value,
	};
	xml += jetsennet.xml.serialize(tab,"TABLE").replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentOrd'>")
	
	
	
	var tabs;
	for(var i = 0; i < retObj.length; i++){
		xml += jetsennet.xml.serialize(retObj[i],"TABLE")
			.replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentOrdItem'>")
			.replace("<ORD_ID></ORD_ID>", "<ORD_ID ref-field='jetsennet.jdlm.beans.PpnRentOrd.ORD_ID'/>")
	}
	//xml += jetsennet.xml.serialize(tab,"TABLE").replace("<TABLE>","<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentOrd'>")
	xml += "</TABLES>"
	 var params = new HashMap();
	 params.put("saveXml",xml);
     var result = SYSDAO.execute("commonObjsInsert", params);
     if (result && result.errorCode == 0) {
     	
         if(val=="1"){
        	 
        	var conditions = [ [ 'ORD_CODE', ordcode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
        	var results = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",null, conditions, 'ORD_ID');
        	 suCheck(results[0].ORD_ID);
         }
         jetsennet.confirm("操作成功！",function(){
        	 parent.location.reload(); 
         });
         /*window.location.reload();
         parent.location.reload(); */
         //return true;
     }
	}
	$("#new").attr("disabled","disabled");
	$("#news").attr("disabled","disabled");
	
}
function tabShow(val){
	if(val == '1'){
		el('divcanyuzhe').style.display = "";
		el('showdaitabbtn').style.display = "none";
	}else if(val == '0'){
		el('divcanyuzhe').style.display = "none";
		el('showdaitabbtn').style.display = "";
	}
	
}
function apShow(val){
	if(val == '1'){
		el('showauditbtn').style.display = "none";
		el('divauditzhe').style.display = ""
	}else if(val == '0'){
		el('showauditbtn').style.display = "";
		el('divauditzhe').style.display = "none"
	}
	
}
var bnum = 0;
//标记选择的对象
var objtyp;
//向缓存中放数据
function addincache(){
	el('txt_ITEM_OBJ_NUM').value = "1";
	var _dialog = new jetsennet.ui.Window("obj-divcacheShow");
	jQuery.extend(_dialog, {
		size : {
			width : 630,
			height : 370
		},
		title : "选择资源",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "subAddDia" ]
		
	});
	_dialog.onsubmit = function() {
		if(el('objType').value==""){
			return false;
		}
		if(el('txt_ITEM_NAME').value==""){
			return false;
		}
		if(el('txtObj').value==""){
			return false;
		}
		if(!(el('txt_ITEM_OBJ_NUM').value > 0)){
			jetsennet.alert("对象数量必须为大于0的整数！");
			el('txt_ITEM_OBJ_NUM').focus();
			return false;
		}
		if(!(el('txt_ITEM_OBJ_UOM_NUM').value > 0)){
			jetsennet.alert("单位数量必须为大于0的整数！");
			el('txt_ITEM_OBJ_UOM_NUM').focus();
			return false;
		}
		bnum+=1
		subtable = "<tr id = \""+bnum+"\" >" +
				"<td width = \"3px\"><input type = \"checkBox\"  /></td>"
		
    		subtable += //"<td>"+el('objType').value+"</td>"+
    					"<td>"+el('txt_ITEM_NAME').value+"</td>"+
    					"<td>"+el('txt_ITEM_OBJ_UOM_NUM').value+"</td>" +
    					"<td>"+el('txt_ITEM_OBJ_UOM').value+"</td>"+
    					"<td>"+el('txt_ITEM_REMARK').value+"</td>" +
    							/*"<td>"+el('txtObj').value+"</td>" +
    							*/
    							"</tr>"
    		$("#spellTab").append(subtable);
		var conditions = [ [ 'OBJ_CODE', jetsennet.util.trim(el('objtext').value), jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
    	var results = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_OBJ', "t",null, conditions, 'OBJ_KEY,OBJ_SPECS,OBJ_DESC');
    	if(!results){
    		return false;
    	}
		retObj.push({ 
			 ORD_ID : "",
			 ITEM_CODE : new Date().getTime(),
			 ITEM_OBJ_TYPE : el('objtypetext').value,//el('objType').value.split(")")[0].replace("(",""),
			 ITEM_NAME : el('txt_ITEM_NAME').value,
			 ITEM_OBJ_UOM : el('txt_ITEM_OBJ_UOM').value,
			 ITEM_OBJ_NUM : el('txt_ITEM_OBJ_NUM').value,
			 ITEM_OBJ_KEY : results[0].OBJ_KEY,
			 ITEM_OBJ_SPECS : results[0].OBJ_SPECS,
			 ITEM_OBJ_DESC : results[0].OBJ_DESC,
			 ITEM_REMARK : el('txt_ITEM_REMARK').value,
			 ITEM_OBJ_CURRENCY:price,
			 ITEM_OBJ_PRICE:cur,
			 ITEM_START_TIME:el('ORD_START_TIME').value,
			 ITEM_END_TIME:el('ORD_END_TIME').value,
			 ITEM_CREATE_TIME:el('ORD_CREATE_TIME').value,
			 ITEM_OBJ_CODE:el('objtext').value,
			 ITEM_OBJ_UOM_SUM : el('txt_ITEM_OBJ_UOM_NUM').value,
		});
		_dialog.close();
		//清空
		el('objtypetext').value = ""
		el('objtext').value=""
		el('objType').value="";
		el('txt_ITEM_NAME').value="";
		el('txt_ITEM_OBJ_UOM').value="";
		el('txt_ITEM_OBJ_NUM').value="";
		el('txt_ITEM_REMARK').value=""
		el('txtObj').value="",
		el('txt_ITEM_OBJ_UOM_NUM').value = ""
			
	}
	_dialog.showDialog()
}

/**
 * 提交审核
 * @param id
 */
function suCheck(id){
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkApply") : jetsennet.Crud.getCheckIds(id,"chkApply");
	if(checkIds < 1){
		jetsennet.alert("请选择借用申请！");
		return;
	}
	var conditions = [ [ 'ORD_ID', id, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var results = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",null, conditions, 't.*');
	if(!results){
		jetsennet.alert("请选择未提交申请！");
		return;
	}
			var tab = {
					//CHECK_ID : '',
					CHECK_TYPE : '0',
					CHECK_OBJ_TYPE : '1',
					CHECK_OBJ_CODE : results[0].ORD_CODE,
					CHECK_STATUS : 0
			};
			var params = new HashMap();
			params.put("className", "jetsennet.jdlm.beans.PpnRentCheck")
			params.put("updateXml", jetsennet.xml.serialize(tab,"TABLE"));
			params.put("isFilterNull", true);
			result = SYSDAO.execute("commonObjInsert", params,{wsMode:"WEBSERVICE"});
			if(!result){
				
				jetsennet.alert('审核提交失败！');
				return;
			}
			
			var obj = {
					ORD_ID : id,
					ORD_STATUS : '2'
			};
			var params = new HashMap();
			params.put("className", "jetsennet.jdlm.beans.PpnRentOrd")
			params.put("updateXml", jetsennet.xml.serialize(obj,"jetsennet.jdlm.beans.PpnRentOrd"));
			params.put("isFilterNull", true);
			result = SYSDAO.execute("commonObjUpdateByPk", params,{wsMode:"WEBSERVICE"});
			if(!result){
				jetsennet.alert('审核提交失败！');
				return;
			}

	
}




var gcColumnsDept = [  // { fieldName: "DEPART_ID", width: 30, align: "DEPART_ID", isCheck: 1, checkName: "chkdept"},
	   	                    { fieldName: "DEPART_NO", sortField: "DEPART_NO", width: 150, align: "center", name: "部门编码" },
	   	                    { fieldName: "NAME", sortField: "NAME", width: 150, align: "center", name: "部门名称"}
	   	                   ];
var gCrudDept = $.extend(new jetsennet.Crud("divDeptList", gcColumnsDept, "divDeptPage"), {
	    dao : SYSDAO,
	    tableName : "UUM_DEPARTMENT",
	    name : "部门信息",
	    //checkId : "chkdept",
	    keyId:   "t.DEPART_ID",

});
gCrudDept.grid.ondoubleclick = null;
var deptCode;
var deptName;
gCrudDept.grid.onrowclick = function(item, td) {
	deptCode = jetsennet.util.trim(item.DEPART_NO);
	deptName = jetsennet.util.trim(item.NAME);
	
}
//获取部门
function onDept(){
var _dialog = new jetsennet.ui.Window("obj-divDept");
	
	jQuery.extend(_dialog, {
		size : {
			width : 500,
			height : 320
		},
		title : "部门信息",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "divDeptFrame" ],
		showScroll : true
		
	});
	_dialog.onsubmit = function(){
		if(deptCode){
			el('txt_ORD_DEPT_NAME').value = "("+deptCode+")"+deptName
			_dialog.close();
		}else{
			jetsennet.alert("请选择一个部门！");
			return;
		}
		
	}
	gCrudDept.load();
	_dialog.showDialog();
	
}
function searchDept(){
	var conditions = [];
	var value = jetsennet.util.trim(el('txtDeptCode').value);
	if(value){
   	 conditions.push( ["t.DEPART_NO", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
   	 conditions.push( ["t.NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
   }
	gCrudDept.search(conditions)
}






var gcColumnsCol = [  // { fieldName: "COL_ID", width: 30, align: "DEPART_ID", isCheck: 1, checkName: "chkcol"},
   	                    { fieldName: "COL_CODE", sortField: "DEPART_NO", width: 150, align: "center", name: "栏目编码" },
   	                    { fieldName: "COL_NAME", sortField: "COL_NAME", width: 150, align: "center", name: "栏目名称"}
   	                   ];
var condCol = [];
var gCrudCol = $.extend(new jetsennet.Crud("divColList", gcColumnsCol, "divColPage"), {
    dao : SYSDAO,
    tableName : "PPN_CDM_COLUMN",
    name : "栏目信息",
    //checkId : "chkcol",
    keyId:   "t.COL_ID",
   // conditions : 

});
gCrudCol.grid.ondoubleclick = null;
var colCode;
var colName;
gCrudCol.grid.onrowclick = function(item, td) {
	colCode = jetsennet.util.trim(item.COL_CODE);
	colName = jetsennet.util.trim(item.COL_NAME);

}
//获取栏目
function onCol(){
	
	var _dialog = new jetsennet.ui.Window("obj-divCol");
	
	jQuery.extend(_dialog, {
	size : {
		width : 500,
		height : 320
	},
	title : "栏目信息",
	submitBox : true,
	cancelBox : true,
	maximizeBox : false,
	minimizeBox : false,
	controls : [ "divColumnFrame" ],
	showScroll : true
	
});
_dialog.onsubmit = function(){
	if(colCode){
		el('txt_ORD_COLUMN_NAME').value = "("+colCode+")"+colName
		_dialog.close();
	}else{
		jetsennet.alert("请选择一个栏目！");
		return;
	}
	
	}
	gCrudCol.search();
	_dialog.showDialog();

}
function searchCol(){
	var conditions = [];
	var value = jetsennet.util.trim(el('txtColCode').value);
	if(value){
		 conditions.push( ["t.COL_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		 conditions.push( ["t.COL_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gCrudCol.search(conditions)
}







/**
 * 资源类型
 */

var gcColumnsObt = [  // { fieldName: "OBJ_TYPE_ID", width: 30, align: "OBJ_TYPE_ID", isCheck: 1, checkName: "chkobt"},
  	                    { fieldName: "OBJ_TYPE_CODE", sortField: "OBJ_TYPE_CODE", width: 150, align: "center", name: "资源编码" },
  	                    { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: 150, align: "center", name: "资源名称"}
  	                   ];
var gCrudObt = $.extend(new jetsennet.Crud("divObtList", gcColumnsObt, "divObtPage"), {
   dao : SYSDAO,
   tableName : "PPN_RENT_OBJ_TYPE",
   name : "资源信息",
 //  checkId : "chkobt",
   keyId:   "t.OBJ_TYPE_ID",
   conditions : [["t.OBJ_TYPE_ID", '0', jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
});
gCrudObt.grid.ondoubleclick = null;
var obtCode;
var obtName;
var obtId;
var parId;
gCrudObt.grid.onrowclick = function(item, td) {
	obtCode = jetsennet.util.trim(item.OBJ_TYPE_CODE);
	obtName = jetsennet.util.trim(item.OBJ_TYPE_NAME);
	parId = jetsennet.util.trim(item.OBJ_TYPE_ID)
}
var price;
var cur;
//获取
function onObt(){
	var _dialog = new jetsennet.ui.Window("obj-divObt");
	
	jQuery.extend(_dialog, {
	size : {
		width : 500,
		height : 320
	},
	title : "资源类型",
	submitBox : true,
	cancelBox : true,
	maximizeBox : false,
	minimizeBox : false,
	controls : [ "divObjTypeFrame" ]
	
});
_dialog.onsubmit = function(){
	if(obtCode){
		obtId =parId;
		el('objtypetext').value = obtId;//资源类型ID
		el('objType').value = obtName
		var conditions = [ [ 'OBJ_TYPE_ID', obtId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
		var results = SYSDAO.queryObjs('commonXmlQuery', 'UOM_ID', 'PPN_RENT_OBJ_UOM', "t",null, conditions, 't.*');
		if(results){
			el('txt_ITEM_OBJ_UOM').value = results[0].UOM_NAME ;
			price = results[0].UOM_CURRENCY;
			cur = results[0].UOM_PRICE
		}
		
		_dialog.close();
	}else{
		jetsennet.alert("请选择一个资源类型！");
		return;
	}
	
	}
	gCrudObt.load();
	_dialog.showDialog();

}
function searchObt(){
	var conditions = [];
	var value = jetsennet.util.trim(el('txtObtCode').value);
	if(value){
		 conditions.push( ["t.OBJ_TYPE_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		 conditions.push( ["t.OBJ_TYPE_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gCrudObt.search(conditions)
}








/**
 * 资源obj
 */

var gcColumnsOb = [  // { fieldName: "OBJ_ID", width: 30, align: "OBJ_TYPE_ID", isCheck: 1, checkName: "chkob"},
  	                    { fieldName: "OBJ_CODE", sortField: "OBJ_TYPE_CODE", width: 150, align: "center", name: "资源编码" },
  	                    { fieldName: "OBJ_NAME", sortField: "OBJ_TYPE_NAME", width: 150, align: "center", name: "资源名称"}
  	                   ];
var gCrudOb = new jetsennet.Crud("divObList", gcColumnsOb, "divObPage");
gCrudOb.grid.ondoubleclick = null;
var obCode;
var obName;
gCrudOb.grid.onrowclick = function(item, td) {
	obCode = jetsennet.util.trim(item.OBJ_CODE);
	obName = jetsennet.util.trim(item.OBJ_NAME);

}
//获取
function onOb(){
	if(!obtId){
		jetsennet.alert("请先选择资源类型！")
		return;
	}
	var cond = [];
		
		for(var i = 0; i < retObj.length ; i++ ){
			cond.push(["t.OBJ_KEY", retObj[i].ITEM_OBJ_KEY, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]);
		}

	cond.push(["t.OBJ_TYPE_ID", obtId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
	cond.push(["t.OBJ_STATUS", "1", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]);
	gCrudOb = $.extend(gCrudOb,{
		   dao : SYSDAO,
		   tableName : "PPN_RENT_OBJ",
		   name : "资源信息",
		  // checkId : "chkob",
		   keyId:   "t.OBJ_ID",
		   conditions : cond
		});
	var _dialog = new jetsennet.ui.Window("obj-divOb");
	
	jQuery.extend(_dialog, {
	size : {
		width : 500,
		height : 320
	},
	title : "资源信息",
	submitBox : true,
	cancelBox : true,
	maximizeBox : false,
	minimizeBox : false,
	controls : [ "divObjFrame" ]
	
});
_dialog.onsubmit = function(){
	if(obCode){
		el('objtext').value = obCode
		el('txtObj').value = obName
		
		_dialog.close();
	}else{
		jetsennet.alert("请选择一个资源类型！");
		return;
	}
	
	}
	gCrudOb.load();
	_dialog.showDialog();

}
function searchOb(){
	var conditions = [];
	conditions.push(["t.OBJ_STATUS", "1", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ]);
	var value = jetsennet.util.trim(el('txtObCode').value);
	for(var i = 0; i < retObj.length ; i++ ){
		conditions.push(["t.OBJ_KEY", retObj[i].ITEM_OBJ_KEY, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]);
	}
	if(value){
		 conditions.push( ["t.OBJ_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		 conditions.push( ["t.OBJ_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gCrudOb.search(conditions)
}


/**
 * 单元
 */

var gcColumnsUom = [  // { fieldName: "OBJ_ID", width: 30, align: "OBJ_TYPE_ID", isCheck: 1, checkName: "chkob"},
  	                    { fieldName: "UOM_CODE", sortField: "UOM_CODE", width: 150, align: "center", name: "使用单位代码" },
  	                    { fieldName: "UOM_NAME", sortField: "UOM_NAME", width: 150, align: "center", name: "使用单位名称"}
  	                   ];
var gCrudUom = new jetsennet.Crud("divUomList", gcColumnsUom, "divUomPage");
gCrudUom.grid.ondoubleclick = null;
var UomCode;
var UomName;
gCrudUom.grid.onrowclick = function(item, td) {
	//obCode = jetsennet.util.trim(item.OBJ_CODE);
	UomName = jetsennet.util.trim(item.UOM_NAME);

}
//获取
function onUom(){
	if(!obtId){
		jetsennet.alert("请先选择单位！！")
		return;
	}
	var cond = [];

	cond.push(["t.OBJ_TYPE_ID", obtId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
	
	gCrudUom = $.extend(gCrudUom,{
		   dao : SYSDAO,
		   tableName : "PPN_RENT_OBJ_UOM",
		   name : "单位信息",
		  // checkId : "chkob",
		   keyId:   "t.UOM_ID",
		   conditions : cond
		});
	var _dialog = new jetsennet.ui.Window("Uom-divOb");
	
	jQuery.extend(_dialog, {
	size : {
		width : 500,
		height : 320
	},
	title : "单位信息",
	submitBox : true,
	cancelBox : true,
	maximizeBox : false,
	minimizeBox : false,
	controls : [ "divUomFrame" ]
	
});
_dialog.onsubmit = function(){
	if(UomName){
		el('txt_ITEM_OBJ_UOM').value = UomName
		
		_dialog.close();
	}else{
		jetsennet.alert("请选择一个资源类型！");
		return;
	}
	
	}
	gCrudUom.load();
	_dialog.showDialog();

}
function searchUom(){
	var conditions = [];
	conditions.push(["t.UOM_STATUS", "1", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Integer ]);
	var value = jetsennet.util.trim(el('txtUomCode').value);
	if(value){
		 conditions.push( ["t.UOM_CODE", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		 conditions.push( ["t.UOM_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gCrudUom.search(conditions)
}