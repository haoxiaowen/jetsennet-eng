
jetsennet.require(["window","pageframe", "layoutit","gridlist", "pagebar", "jetsentree", "validate","device_grid_view_min", "device_monitor_min","datepicker","bootstrap/bootstrap","bootstrap/daterangepicker","bootstrap/moment", "crud", "jquery/jquery.md5"]);

//var parentId = "93B7A082-25BA-49FA-BECA-F43E48904C43";
var parentId = jetsennet.queryString("id");
var mainView = document.getElementById("main");
var monitor = new DeviceMonitor.View(mainView);
function plan(){
 	
	
	monitor.onCellClick = function(a,b,c,d){
		monitor.setSelectedCell(a,c);
	};
	
	/*图片*/
	/*var win = document.getElementById("w");
	var mac = document.getElementById("m");
	var lin = document.getElementById("l");*/
	
	var conditions = [ [ 'RACK_ID', parentId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'OBJ_ID', 'PPN_RENT_RACK', "t",
			null, conditions, '*', "order by RACK_CREATE_TIME");
	var view = monitor.appendSegment("CV1");
	view.borderWidth=3;
	view.beginX = 50;
	view.beginY = 50;
	//行
	for(var j = 0 ; j < result[0].RACK_ROW_SUM;j++){
		var row = new DeviceGrid.Row(100);
		//列
		for(var i = 0 ; i < result[0].RACK_COLUMN_SUM;i++){
			var k = 1;
			var conditions = [ [ 'SKU_COLUMN_INDEX', i+k, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ],
			                   [ 'SKU_ROW_INDEX', j+k, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ],
			                   [ 'RACK_ID', result[0].RACK_ID, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
			var rs = SYSDAO.queryObjs('commonXmlQuery', 'SKU_ID', 'PPN_RENT_RACK_SKU', "t",
					null, conditions, '*', "order by SKU_ROW_INDEX ASC,SKU_COLUMN_INDEX ASC");
			if(rs){
				var ce0 = new DeviceGrid.Cell('#63FE63',100,new DeviceGrid.CellFont('货架x'+j+","+i,'宋体',10,'#000000'),{name:rs[0].SKU_NAME,id:rs[0].SKU_ID});
		
				/*ce0.appendItem(new DeviceGrid.CellItem(win,35,35,45,45,{name:rs[0].SKU_NAME,id:rs[0].SKU_ID,ip:"192.168.1.100",status:"在线"}));
				ce0.appendItem(new DeviceGrid.CellItem(mac,115,35,45,45,{name:"apple",type:"mac",ip:"192.168.1.101",status:"在线"}));*/
				row.appendCell(ce0);
			}else if(rs == null){
				var ce0 = new DeviceGrid.Cell('#63FE63',100,new DeviceGrid.CellFont('货架x'+j+","+i,'宋体',10,'#000000'),{name:j+"行"+i+"列没有定义的货格",id:"-1"});
			
				/*ce0.appendItem(new DeviceGrid.CellItem(win,35,35,45,45,{name:rs[0].SKU_NAME,id:rs[0].SKU_ID,ip:"192.168.1.100",status:"在线"}));
				ce0.appendItem(new DeviceGrid.CellItem(mac,115,35,45,45,{name:"apple",type:"mac",ip:"192.168.1.101",status:"在线"}));*/
				row.appendCell(ce0);
			}
			
			
		}
		view.appendRow(row);
	}
	
	
	
	monitor.setPercentage(1.5);
	monitor.review();
	//monitor.review_icon();
	
	
}
monitor.onCellDoubleClick = function(a,b,c,d){
  var skuId = d.tag.id;
  location.href = "GoodsObjManageById.htm?SKU_ID="+skuId;
}
monitor.onCellMouseOver = function(a,b,c,d){
	 var skuId = d.tag.id;
	 var htm = "<table>";
		htm += "<tr style='background-color:silver'><td style = 'width:100px'>名称</td><td style = 'width:100px'>编号</td><td style = 'width:100px'>状态</td></tr>";
		//
		joinTables = [["PPN_RENT_OBJ_2_RACK", "r", "r.SKU_ID=t.SKU_ID", jetsennet.TableJoinType.right],
		              ["PPN_RENT_OBJ","u","u.OBJ_ID = r.OBJ_ID", jetsennet.TableJoinType.right]];
		var conditions = [ [ 't.SKU_ID', skuId, jetsennet.SqlLogicType.And,
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
		jetsennet.tooltip(htm1,{reference:el("tab"),position:1,width:400});
}
