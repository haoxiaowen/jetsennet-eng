jetsennet.require(["window", "gridlist", "pagebar", "pageframe", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);

var win = document.getElementById("w");
var mainView = document.getElementById("main");
var monitor = new DeviceMonitor.View(mainView);
monitor.onCellClick = function(a,b,c,d){
	monitor.setSelectedCell(a,c);
};

monitor.onCellItemClick = function(a,b,c,d){
	 location.href = "Plan.htm?id=" +d.tag.ID;
	    
	//alert(JSON.stringify(d.tag));
};

monitor.onCellItemMouseOver = function(a,b,c,d){
	//alert("进入:"+JSON.stringify(d.tag));
};

monitor.onCellItemMouseOut = function(a,b,c,d){
	//alert("离开:"+JSON.stringify(d.tag));
};
var view = monitor.appendSegment("CV1");
view.borderWidth=3;
view.beginX = 50;
view.beginY = 50;
var row = new DeviceGrid.Row(100);

function getRackId(id){
	var Request = new Object(); 
	Request = GetRequest(); 
	var id;
	id =jetsennet.queryString("id");
	var obj= SYSDAO.queryObjs("commonXmlQuery", "ROOM_ID", "PPN_RENT_ROOM", "g",null,[["ROOM_ID", id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
	var groups = SYSDAO.queryObjs("commonXmlQuery", "RACK_ID", "PPN_RENT_RACK", "g",null,[["ROOM_ID", id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
	var ce0;
	if(groups!=null){
      ce0 = new DeviceGrid.Cell('#63FE63',35+groups.length*75,new DeviceGrid.CellFont(obj[0].ROOM_NAME,'宋体',25,'#000000'),{name:'1'});
      ce0.bd_line.push({direction : 4,pos: (groups.length*75) / 2,length:40,color:"#00FF00"})
	for(var i=0;i<groups.length;i++){
		ce0.appendItem(new DeviceGrid.CellItem(win,35+70*i,35,45,45,{NAME:groups[i].RACK_NAME,ID:groups[i].RACK_ID}));
	}
	}
	else{
		
		 ce0 = new DeviceGrid.Cell('#63FE63',200,new DeviceGrid.CellFont(obj[0].ROOM_NAME,'宋体',25,'#000000'),{name:'1'});	
		 ce0.bd_line.push({direction : 4,pos: (200 - 40) / 2,length:40,color:"#00FF00"})
	}
	row.appendCell(ce0);
	view.appendRow(row);

	monitor.setPercentage(1.5);
	monitor.review();
	
	
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
	

	
	getRackId();
    
}

