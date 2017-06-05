/* 
 * Copyright (c) 北京捷成世纪科技股份有限公司. All Rights Reserved.
 * 文件：jetsennet.jdvn.service.MessageServices.java
 * 日 期：2014-2-14 下午3:33:50
 * 作 者：蒋勇
 */
package jetsennet.jue2.services.in;

import java.sql.SQLException;
import java.util.Map;

import javax.jws.WebService;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import net.sf.json.JSONObject;
import jetsennet.frame.service.BaseService;
import jetsennet.jue2.business.PPNdevdeviceBusiness;
import jetsennet.net.WSResult;


@Path(value = "/PPNdevdeviceService")
@WebService(name = "/PPNdevdeviceService")
public class PPNdevdeviceService extends BaseService {
   //PPNdevdeviceService
	private PPNdevdeviceBusiness ppndevdeviceBusiness;


	@javax.jws.WebMethod(exclude = true)
	public PPNdevdeviceBusiness getPpndevdeviceBusiness() {
		return ppndevdeviceBusiness;
	}


	@javax.jws.WebMethod(exclude = true)
	public void setPpndevdeviceBusiness(PPNdevdeviceBusiness ppndevdeviceBusiness) {
		this.ppndevdeviceBusiness = ppndevdeviceBusiness;
	}



	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/insertAllObjects")
	public  WSResult insertAllObjects(@FormParam("saveXml") String xml) throws Exception
	{
			return getResult(String.valueOf(ppndevdeviceBusiness.insertObjecsPpn(xml)));
	}//devObjsUpdate
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/devObjsUpdate")
	public  WSResult devObjsUpdate(@FormParam("updateXml") String xml) throws Exception
	{
			return getResult(String.valueOf(ppndevdeviceBusiness.devObjsUpdate(xml)));
	}//
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/devctrObjsUpdate")
	public  WSResult devctrObjsUpdate(@FormParam("updateXml") String xml) throws Exception
	{
			return getResult(String.valueOf(ppndevdeviceBusiness.devctrObjsUpdate(xml)));
	}//
	
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/deleteDevObjecs")
	public  WSResult deleteDevObjecs(@FormParam("className") String className, @FormParam("deleteIds") String ids) throws Exception
	{
			return getResult(ppndevdeviceBusiness.deleteDevObjecs(ids));
	}
	/**
     * 获取设备状态
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/SelectDevStatus")
	public  WSResult SelectDevStatus(@FormParam("className") String className, @FormParam("selectIds") String id) throws Exception
	{
		     WSResult retObj = new WSResult();
		     retObj.setErrorCode(0);
		     //判断设备是否连通
		     Map<String,Boolean> pingMap=ppndevdeviceBusiness.SelectDevStatus(id);
		     JSONObject jsonObject = JSONObject.fromObject(pingMap);
		     retObj.setResultVal(jsonObject.toString());
		     return retObj;
	}
	
}
