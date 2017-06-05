jetsennet.require(["window", "gridlist", "pagebar", "pageframe", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);



function getRackId(id){
	var Request = new Object(); 
	Request = GetRequest(); 
	var id;
	id = Request['id'];
	var arr = id.split(',');
	var conditions = [];
	conditions.push(['RACK_ID', arr[0], jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
	var result = SYSDAO.queryObjs('commonXmlQuery', "SKU_ID", 'PPN_RENT_RACK_SKU', "t", null, conditions, 'SKU_ID,SKU_ROW_INDEX,SKU_COLUMN_INDEX', "order by SKU_ROW_INDEX");
	var html = '';
	for(var i = 0;i < arr[1];i++){
		
			html+="<tr>"
			for (var j = 0; j < arr[2];j ++) {
				var r = i; r+=1;var c =j;c+=1;
				if(!result){
					html += "<td style=\"width: 200px;height: 30px;background-color:#63FE63\"><div style = \"width: 100px;height: 30px;\">"+"第"+r+"层，第"+c+"格"+"</div></td>"
				}else{
					var k = 0;
					for(var t = 0; t < result.length;t++){
			        	
			        	if(result[t].SKU_ROW_INDEX == (i+1) && result[t].SKU_COLUMN_INDEX == j+1){
			        		 html += "<td style=\"width: 200px;height: 30px;background-color:#63FE63\" ondblclick =\"RespLocation("+result[t].SKU_ID+")\" onmousemove=\"javascript:showDefRack("+result[t].SKU_ID+")\"><div style = \"width: 100px;height: 30px;\">第"+r+"层，第"+c+"格</div></td>" ;
			        	     k++;
			        	}
			        }
					if(k==0){
						html += "<td style=\"width: 200px;height: 30px;background-color:#63FE63\"><div style = \"width: 100px;height: 30px;\">第"+r+"层，第"+c+"格</div></td>"
					}
				}
		    }
			html+='</tr>';
	}
	$("#tabOther").append(html);
	
}
function RespLocation(skuId){
	location.href = "GoodsObjManage.htm?SKU_ID="+skuId;
}
function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
		} 
	} 
	return theRequest; 
} 
/**
 * 页面初始化
 */
function pageInit() {
	// 页面布局
	gFrame = jQuery("#divPageFrame").pageFrame({splitType : 1, layout : [ 30, "auto" ]}).sizeBind(window);
	// 页面缩放
	jQuery(window).resize(function() {
		windowResized();
	});
	windowResized();
	
	getRackId();
    
}
/**
 * 根据不同的类型进行展示货架
 */
function showDefRack(id) {
				var htm1 = getConfHtm(id);
					jetsennet.tooltip(htm1,{reference:el("tabOther"),position:1,width:400});
	}
/**
 * 获取货架格子展示内容html
 * @param confId
 * @returns {String}
 */
function getConfHtm(id) {
	var htm = "<table>";
	htm += "<tr style='background-color:silver'><td style = 'width:100px'>名称</td><td style = 'width:100px'>编号</td><td style = 'width:100px'>状态</td></tr>";
	//
	joinTables = [["PPN_RENT_OBJ_2_RACK", "r", "r.SKU_ID=t.SKU_ID", jetsennet.TableJoinType.right],
	              ["PPN_RENT_OBJ","u","u.OBJ_ID = r.OBJ_ID", jetsennet.TableJoinType.right]];
	var conditions = [ [ 't.SKU_ID', id, jetsennet.SqlLogicType.And,
		         			jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'SKU_ID', 'PPN_RENT_RACK_SKU', "t",joinTables, conditions,"u.*");
	if(!result){return htm+"</table>"}
	
	for(var i = 0 ; i < result.length ; i++){
		var stat = "可用";
		if(result[i].OBJ_STATUS == 0){
			stat = "不可用";
		}
		htm += "<tr><td>"+result[i].OBJ_NAME+"</td><td>"+result[i].OBJ_CODE+"</td><td>"+stat+"</td></tr>"
	}
	
	
	htm += "</table>";
	return htm;
}
/**
 * 查询货格的对象
 * @param id
 */
function getRackConf(id){
	var conditions = [ [ 'SKU_ID', id, jetsennet.SqlLogicType.And,
	         			jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'SKU_ID', 'PPN_RENT_RACK_SKU', "t",
	         			null, conditions);
}
//更改尺寸,增加该函数能提高重绘速度
function windowResized() {
	var size = {
		width : jQuery(window).width(),
		height : jQuery(window).height()
	};
	gFrame.size = {
		width : size.width - 0,
		height : size.height - 0
	};
	gFrame.resize();
}