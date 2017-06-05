/** ===========================================================================
 *
 * 附件
 * ============================================================================
 */

jetsennet.require(["pageframe", "window", "gridlist", "pagebar","datepicker", "tabpane", "validate", "crud","bootstrap/moment","bootstrap/daterangepicker","plugins"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var CHANDAO = new jetsennet.DefaultDal("ChnanalService");
var ATTADAO = new jetsennet.DefaultDal("AttaFileService");
var FileStyleVal;//文件性质值
var code;
var lastindex=1;
var jointables=[];
var conditions=[];
var gFuncColumns = [{ fieldName: "FILE_ID", width: 30, align: "center", isCheck: 1, checkName: "chkfile"},
                    { fieldName: "FILE_NAME", sortField: "FILE_NAME", width: 100, align: "center", name: "文件名称"},
                    { fieldName: "FILE_STATUS", sortField: "FILE_STATUS", width: 100, align: "center", name: "文件状态",
                    	format:function(val,vals){
                    		if(val==0){
                    			return "正常";
                    		}else if(val==1){
                    			return "回收站";
                    		}else{
                    			return "已删除";
                    		}
                    	}},
                    { fieldName: "FILE_IS_DIR", sortField: "FILE_IS_DIR", width: 100, align: "center", name: "是否目录",
                    	format:function(val,vals){
                    		if(val==1){
                    			return "是";
                    		}else{
                    			return "否";
                    		}
                    	}},
                    { fieldName: "FILE_LOC_HOST", sortField: "FILE_LOC_HOST", width: 100, align: "center", name: "所在主机"},
                    { fieldName: "FILE_LOC_PATH", sortField: "FILE_LOC_PATH", width: 200, align: "center", name: "所在路径"},
                    { fieldName: "FILE_CREATE_USER", sortField: "FILE_CREATE_USER", width: 100, align: "center", name: "创建者" },
                    { fieldName: "FILE_DESC", sortField: "FILE_DESC", width: 100, align: "center", name: "文件描述"},
                    { fieldName: "FILE_SIZE", sortField: "FILE_SIZE", width: 100, align: "center", name: "大小" },
                    { fieldName: "FILE_STATUS", sortField: "FILE_STATUS", width: 100, align: "center", name: "状态",
                    	format	:function(val,vals){
                    	 if(val==0){
                    		 return "正常";
                    	 }else if (val==1){
                    		 return "回收站";
                    	 }else{
                    		 return "已删除"; 
                    	 }
                     }
                    },
               
                    { fieldName: "FILE_CREATE_TIME", sortField: "FILE_CREATE_TIME", width: 120, align: "center", name: "创建时间"},
                    
                   
                   ];
var gCrud = $.extend(new jetsennet.Crud("divRentFileList", gFuncColumns, "divRentFilePage", "order by t.FILE_CREATE_TIME  desc"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_FILE",
    tabAliasName:"t",
    name : "附件",
    className : "jetsennet.jdlm.beans.PpnRentFile",
    cfgId : "divRentFile",
    checkId : "chkfile",
    joinTables:jointables,
    conditions:conditions,
    keyId : "t.FILE_ID",
  
    onAddInit : function() {
    	 el('FILE_STYLE').disabled = false;
    	 el('text_code').disabled = false;
    	el('FILE_STYLE').value=FileStyleVal;
    	if(FileStyleVal==1){
    		$("#code").html("申请单号 :");
    	}
    	else if(FileStyleVal==2){
    		$("#code").html("出库单号 :");
    	}
    	else{
    		$("#code").html("入库单号 :");
    	}
    	 queryCode(FileStyleVal);
        el('text_code').value=code;
        el('FILE_STYLE').disabled = true;
    	el('text_code').disabled = true;
    	 el('divsegFrame').style.display = "";
    	 el('chooseFile').style.display = "";
        ClearAllSign();
 
    },
    addDlgOptions : {size : {width :790, height : 470},showScroll :true},
    onEditInit : function() {
    	  el('FILE_STYLE').disabled = false;
    	  el('text_code').disabled = false;
    	  if(FileStyleVal==1){
      		$("#code").html("申请单号 :");
      	}
      	else if(FileStyleVal==2){
      		$("#code").html("出库单号 :");
      	}
      	else{
      		$("#code").html("入库单号 :");
      	}
    	 queryCode(FileStyleVal);
    	el('FILE_STYLE').value = FileStyleVal;
         el("text_code").value = code;
    	  el('FILE_STYLE').disabled = true;
    	  el('text_code').disabled = true;
    	 el('divsegFrame').style.display = "none";
    	 el('chooseFile').style.display = "none";
     
    },
    onEditSet : function(obj) {
    
        el("ATTA_TYPE").value = obj[0].ATTA_TYPE;
        el("FILE_DESC").value = obj[0].FILE_DESC;
    }, 
        editDlgOptions : {size : {width : 600, height : 500}},
    
});
    
  


/**
 * 页面初始化
 */

function pageInit() {
	//从页面url获取单号类型与单号
	FileStyleVal = jetsennet.queryString("FileStyleVal");
	code=jetsennet.queryString("code")	;
	if(code){
	if(FileStyleVal==1){
		jointables.push(["PPN_RENT_ORD_ATTACH", "au", "t.FILE_ID = au.FILE_ID", jetsennet.TableJoinType.Inner]);
		conditions.push(["au.ORD_ID", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
      	
   	}
   	else if(FileStyleVal==2){
   		jointables.push(["PPN_RENT_OUT_ATTACH", "au", "t.FILE_ID = au.FILE_ID", jetsennet.TableJoinType.Inner]);
		conditions.push(["au.OUT_ID", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);	
   
   	}
   	else if(FileStyleVal==3){
   		jointables.push(["PPN_RENT_RETURN_ATTACH", "au", "t.FILE_ID = au.FILE_ID", jetsennet.TableJoinType.Inner]);
		conditions.push(["au.RETU_ID", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);	   		
   	}
    else {
    	  jetsennet.warn("请传入正确的单号类型!");
    	  return false;
    }
	   }
	else{
		 jetsennet.warn("请传入单号!");
		 return false;
	}
	gCrud.load(); 
};

function onchageSelect(){
	 FileStyleVal=el('FILE_STYLE').value;
	if(FileStyleVal==1){
		$("#code").html("申请单号 :")
		queryCode(FileStyleVal);
	}
	if(FileStyleVal==2){
		$("#code").html("出库单号 :")
		queryCode(FileStyleVal);
	}
	if(FileStyleVal==3){
		$("#code").html("入库单号 :")
		queryCode(FileStyleVal);
	}
}

/**
 * 查询该表字段信息放入select中
 */
function queryCode(FileStyleVal){
	if(FileStyleVal=="2"){
	var objs= SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OUT", null, null, null,"OUT_ID" );
	  var elm = el("text_code");
	    elm.options.length = 0
	    elm.options.add(new Option("请选择",null));
	    if (objs) {
	        for (var i = 0; i < objs.length; i++) {
	            elm.options.add(new Option(objs[i].OUT_ID, objs[i].OUT_ID));
	        }
	    }
	}
	
	if(FileStyleVal=="1"){
		var objs= SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_ORD", null, null, null,"ORD_ID" );
		  var elm = el("text_code");
		    elm.options.length = 0
		    elm.options.add(new Option("请选择",null));
		    if (objs) {
		        for (var i = 0; i < objs.length; i++) {
		            elm.options.add(new Option(objs[i].ORD_ID, objs[i].ORD_ID));
		        }
		    }
		}
	
	if(FileStyleVal=="3"){
		var objs= SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_RETURN", null, null, null,"RETU_ID" );
		  var elm = el("text_code");
		    elm.options.length = 0
		    elm.options.add(new Option("请选择",null));
		    if (objs) {
		        for (var i = 0; i < objs.length; i++) {
		            elm.options.add(new Option(objs[i].RETU_ID, objs[i].RETU_ID));
		        }
		    }
		}
}


//移除tbody
function removeBreakpoint() {
	var obj = document.getElementById("segFrame");
	for(var n=obj.childNodes.length-1; n>=0; n-=1){
		var child = obj.childNodes[n];
		obj.removeChild(child);
	}
}

function findObj(theObj, theDoc) {
    var p, i, foundObj;
    if (!theDoc) theDoc = document;
    if ((p = theObj.indexOf("?")) > 0 && parent.frames.length) {
        theDoc = parent.frames[theObj.substring(p + 1)].document;
        theObj = theObj.substring(0, p);
    }
    if (!(foundObj = theDoc[theObj]) && theDoc.all) foundObj = theDoc.all[theObj];
    for (i = 0; !foundObj && i < theDoc.forms.length; i++) foundObj = theDoc.forms[i][theObj];
    for (i = 0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++) foundObj = findObj(theObj, theDoc.layers[i].document);
    if (!foundObj && document.getElementById) foundObj = document.getElementById(theObj);
    return foundObj;
} 

//动态拼接table

function AddSignRow(a /*String segname*/ , b, c, d) { //读取最后一行的行号，存放在txtTRLastIndex文本框中 
    //    alert("此时的行数："+txtTRLastIndex.value);
    var rowID = lastindex;

    var signFrame = findObj("segFrame", document);
    //添加行
    var newTR = signFrame.insertRow(signFrame.rows.length);
    newTR.id = "SignItem" + rowID;
    var newNameTD = newTR.insertCell(0);
        newNameTD.innerHTML = newTR.rowIndex.toString();//添加序号    
    var newMarkinTD = newTR.insertCell(1);
    //newMarkinTD.innerHTML = "<input type='text' id='txtFileName" + rowID +  "'value='" + a + "' /> ";
        newMarkinTD.innerHTML = a;

    var newMarkoutTD = newTR.insertCell(2);     
        newMarkoutTD.innerHTML =b;
    var newDurationTD = newTR.insertCell(3);
        newDurationTD.innerHTML = c;
    var newDurationTD = newTR.insertCell(4);
        newDurationTD.innerHTML = d;


    
    var newDurationTD = newTR.insertCell(5);
    //添加列内容
    newDurationTD.innerHTML = "<a href=\'#\' onclick=\'cRow("+rowID+")\'>删除</a>";
    //将行号推进下一行
    lastindex= lastindex+1
}

function OpenFileDialog() 
{	
	var rtVal = document.dvnclient.OpenFileDialog();
	 var objTemp = jetsennet.xml.deserialize(rtVal, "FILE");
	//获取标签指定属性值
	var FILE_PATH=objTemp[0].FILE_PATH

	var table = document.getElementById("segFrame");
	//判断文件是否已经引用
	for (var j = 1; j < lastindex; j++) {  
	    if(FILE_PATH== table.rows[j].cells[3].innerHTML){  
	    	jetsennet.alert("文件已经存在");
	    	return  false;
	    }    
	}
	var FILE_SIZE=objTemp[0].FILE_SIZE
	var FILE_TYPE=objTemp[0].FILE_TYPE
	var FILE_NAME = FILE_PATH.substring(FILE_PATH.lastIndexOf("\\")+1);  
	AddSignRow(FILE_NAME,"localhost", FILE_PATH, FILE_SIZE);  
}

function cRow(rowId){  
    var table=document.getElementById("segFrame");  
    table.deleteRow(rowId);
    lastindex=lastindex-1;
}

/**
 * 新建
 */
gCrud.add=function(){
	 var $this = this;
	    var dialog = jetsennet.Crud.getConfigDialog(this.msgAdd + this.name, this.cfgId, this.addDlgOptions);
	    if (this.onAddInit) {
	        this.onAddInit();
	    }
	    var table = document.getElementById("segFrame");
	   
	    dialog.onsubmit = function() {
	        var areaElements = jetsennet.form.getElements($this.cfgId);
	        if (!jetsennet.form.validate(areaElements, true)) {
	            return false;
	        }
	        if ($this.onAddValid && !$this.onAddValid()) {
	            return false;
	        }
	        var desc=el('FILE_DESC').value;
	        var params = new HashMap();
	        var ATTA_TYPE=$("#ATTA_TYPE").val();
	        if(ATTA_TYPE==null ||  ATTA_TYPE=="" ||  ATTA_TYPE=="undefined"){
	        	jetsennet.alert("请选择附件类型");
	        	return false;
	        }
	        if(lastindex==1){
	        	jetsennet.alert("请添加文件");
	        	return false;
	        }
	        var addXml = "<TABLES>";
	        for (var j = 1; j < lastindex; j++) {
	            addXml += "<TABLE TABLE_NAME='PPN_RENT_FILE'>" 
	            + "<FILE_NAME >" + table.rows[j].cells[1].innerHTML + "</FILE_NAME>"
	            + "<FILE_LOC_HOST >" + table.rows[j].cells[2].innerHTML + "</FILE_LOC_HOST>" 
	            + "<FILE_CODE >" +generateGuid()+ "</FILE_CODE>" 
	            + "<FILE_LOC_PATH >" +table.rows[j].cells[3].innerHTML+ "</FILE_LOC_PATH>"
	            + "<FILE_SIZE >" + table.rows[j].cells[4].innerHTML+ "</FILE_SIZE>"
	            + "<FILE_DESC >" +desc+ "</FILE_DESC>"
	            + "<FILE_NAME_EXT >" +getExecName(table.rows[j].cells[1].innerHTML)+ "</FILE_NAME_EXT>"
	            + "<FILE_STATUS >0</FILE_STATUS>"
	            + "<FILE_IS_DIR >0</FILE_IS_DIR>"
	            + "<FILE_TYPE >1</FILE_TYPE>"
	            + "<FILE_CREATE_USER >" + jetsennet.Application.userInfo.LoginId+ "</FILE_CREATE_USER>"
	            + "<FILE_CREATE_TIME >" +  new Date().toDateTimeString()+ "</FILE_CREATE_TIME>"
	            + "</TABLE>";
	            
	        }
	        addXml += "</TABLES>";
	        params.put("addXml", addXml);
	        params.put("code", code);
	        params.put("attaType", ATTA_TYPE);
	        params.put("filestyle", FileStyleVal);
	        
	        var result = ATTADAO.execute("insertObjecs", params);
	        if (result && result.errorCode == 0) {
	            if (this.onAddSuccess) {
	                this.onAddSuccess(obj);
	            }
	            gCrud.load();
	            return true;
	        }
	    };
	    dialog.showDialog();	
}

/**
 * 生成UUID
 */
function generateGuid() {  
	  var result, i, j;  
	  result = '';  
	  for(j=0; j<32; j++) {  
	    if( j == 8 || j == 12|| j == 16|| j == 20)   
	      result = result + '-';  
	    i = Math.floor(Math.random()*16).toString(16).toUpperCase();  
	    result = result + i;  
	  }  
	  return result;  
	}  


/**
 * 获取扩展名
 * @param file_name
 * @returns
 */
function getExecName(file_name){
var result =/\.[^\.]+/.exec(file_name);
return result;
}
/**
 * 清空表格
 */
function ClearAllSign() {
    var signFrame = findObj("segFrame", document);
    var rowscount = signFrame.rows.length;

    //循环删除行,从最后一行往前删除
    for (i = rowscount - 1; i > 0; i--) {
    	signFrame.deleteRow(i);
    }
    //重置最后行号为1
  lastindex = 1;
}
/**
 * 编辑任务
 */
gCrud.edit = function(id) {
    var $this = this;
    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
    if (checkIds.length != 1) {
        jetsennet.alert("请选择一个要" + this.msgEdit + "的" + this.name + "！");
        return;
    }
    
    var dialog = jetsennet.Crud.getConfigDialog(this.msgEdit + this.name, this.cfgId, this.editDlgOptions);
    if (this.onEditInit) {
        this.onEditInit(checkIds[0]);
    }
    
    var oldObj = null;
  
    if (this.onEditSet) {
    	if(FileStyleVal==1){
       	 var  jointables = [["PPN_RENT_ORD_ATTACH", "au", "cu.FILE_ID = au.FILE_ID", jetsennet.TableJoinType.Inner]];
        	oldObj = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_FILE ", "cu" , jointables,[ [ "au.FILE_ID",  checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],["au.ORD_ID", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],"au.*,cu.*");
    	}
    	else if(FileStyleVal==2){
    	 var  jointables = [["PPN_RENT_OUT_ATTACH", "au", "cu.FILE_ID = au.FILE_ID", jetsennet.TableJoinType.Inner]];
     	oldObj = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_FILE ", "cu" , jointables,[ [ "au.FILE_ID",  checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],["au.OUT_ID", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],"au.*,cu.*");
    	}
    	else{
    		 var  jointables = [["PPN_RENT_RETURN_ATTACH", "au", "cu.FILE_ID = au.FILE_ID", jetsennet.TableJoinType.Inner]];
         	oldObj = SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_FILE ", "cu" , jointables,[ [ "au.FILE_ID",  checkIds[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String],["au.RETU_ID", code, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]],"au.*,cu.*");
    	}      
        if (oldObj) {
            this.onEditSet(oldObj);
        }
    }    
    dialog.onsubmit = function() {
        var areaElements = jetsennet.form.getElements($this.cfgId);
        if (!jetsennet.form.validate(areaElements, true)) {
            return false;
        }
        if ($this.onEditValid && !$this.onEditValid(checkIds[0], oldObj)) {
            return false;
        }  
        var desc=el('FILE_DESC').value;
        var params = new HashMap();
        var updateXml="";       
        updateXml = "<TABLES>"    
   		+"<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentFile'>" 
        + "<FILE_ID >" + oldObj[0].FILE_ID[0] + "</FILE_ID>"          
        + "<FILE_DESC >" +desc+ "</FILE_DESC>"           
        + "</TABLE>"
        	+"</TABLES>";
        params.put("updateXml", updateXml);
        params.put("attaType", el('ATTA_TYPE').value);
        params.put("filestyle", FileStyleVal);
        var result = ATTADAO.execute("update", params);
        if (result && result.errorCode == 0) {
            if (this.onEditSuccess) {
                this.onEditSuccess(obj);
            }
            gCrud.load();
            return true;
        }
    };
    dialog.showDialog();
};
/**
 * 删除任务
 */
gCrud.remove=function(id){
	  var $this = this;
	    var checkIds = this.onGetCheckId ? this.onGetCheckId(id, this.checkId) : jetsennet.Crud.getCheckIds(id, this.checkId);
	    if (checkIds.length == 0) {
	        jetsennet.alert("请选择要" + this.msgRemove + "的" + this.name + "！");
	        return;
	    }
	    if (this.onRemoveValid && !this.onRemoveValid(checkIds)) {
	        return;
	    }
	    jetsennet.confirm(this.msgConfirmRemove, function() {
	        return deleteALL(checkIds);
	    });
}

function deleteALL(checkIds) {
	var ids=checkIds.join(",");
    var params = new HashMap();
    params.put("ids", ids);
    params.put("filestyle", FileStyleVal);
    var result = ATTADAO.execute("delete", params);
    if (result && result.errorCode == 0) {
        if (gCrud.onRemoveSuccess) {
        	gCrud.onRemoveSuccess(ids);
        }
        
    }
	gCrud.load();
    return true;
};


