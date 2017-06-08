/* 
 * Copyright (c) 北京捷成世纪科技股份有限公司. All Rights Reserved.
 * 文件：jetsennet.jdvn.service.MessageServices.java
 * 日 期：2014-2-14 下午3:33:50
 * 作 者：蒋勇
 */
package jetsennet.jue2.services.in;

import java.sql.SQLException;

import javax.jws.WebService;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import jetsennet.frame.service.BaseService;
import jetsennet.jue2.business.PpnEngBusiness;
import jetsennet.net.WSResult;


@Path(value = "/PpnEngService")
@WebService(name = "/PpnEngService")
public class PpnEngService extends BaseService {
	
	private PpnEngBusiness PpnEngBusiness;
	
	@javax.jws.WebMethod(exclude = true)
	public PpnEngBusiness getPpnEngBusiness() {
		return PpnEngBusiness;
	}
	@javax.jws.WebMethod(exclude = true)
	public void setPpnEngBusiness(PpnEngBusiness PpnEngBusiness) {
		this.PpnEngBusiness = PpnEngBusiness;
	}
	
	/**
     * 执行命令
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/executeCommand")
	public  WSResult executeCommand(@FormParam("para") String para) throws Exception
	{
		return getResult(PpnEngBusiness.executeCommand(para));
	}
	
	/**
     * 获取设备信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getDevInfo")
	public  WSResult getDevInfo(@FormParam("devCode")String devCode, @FormParam("reqId")String reqId) throws Exception
	{
		return getResult(PpnEngBusiness.getDevInfo(devCode,reqId));
	}
	
	/**
     * 获取定位信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getGpsInfo")
	public  WSResult getGpsInfo(@FormParam("devCode")String devCode,@FormParam("reqId")String reqId) throws Exception
	{
		return getResult(PpnEngBusiness.getGpsInfo(devCode,reqId));
	}
	
	/**
     * 生成授权码
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/generateCode")
	public  WSResult generateCode(@FormParam("START_DATE") String startDate,@FormParam("DURATIOIN") String duration,@FormParam("DEVICE_CODE") String deviceCode) throws Exception
	{
			return getResult(PpnEngBusiness.generateCode(startDate,duration,deviceCode));
	}
	
}
