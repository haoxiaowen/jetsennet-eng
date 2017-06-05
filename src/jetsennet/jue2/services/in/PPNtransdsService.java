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
import jetsennet.jue2.business.PPNtransDsBusiness;
import jetsennet.net.WSResult;


@Path(value = "/PPNtransdsService")
@WebService(name = "/PPNtransdsService")
public class PPNtransdsService extends BaseService {
//PPNSystemService
	private PPNtransDsBusiness PPNtransDsBusiness;
	
	
	@javax.jws.WebMethod(exclude = true)
	public PPNtransDsBusiness getPPNtransDsBusiness() {
		return PPNtransDsBusiness;
	}
	@javax.jws.WebMethod(exclude = true)
	public void setPPNtransDsBusiness(PPNtransDsBusiness PPNtransDsBusiness) {
		this.PPNtransDsBusiness = PPNtransDsBusiness;
	}
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/deleteObjecsDsAndUserAndDest")
	public  WSResult deleteObjecsMdsAndUserAndDest(@FormParam("className") String className, @FormParam("deleteIds") String ids) throws Exception
	{
			return getResult(PPNtransDsBusiness.deleteObjecsAllMUD(ids));
	}//
	
	
	/**
     * 获取服务信息                             接口
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/insertObjecsDsOrUser")
	public  WSResult insertObjecsMdsOrUser(@FormParam("className") String className, @FormParam("saveXml") String xml) throws Exception
	{
			return getResult(String.valueOf(PPNtransDsBusiness.insertObjecsPpn(xml)));
	}//
	
	
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/updataObjecsDsOrUser")
	public  WSResult updataObjecsMdsOrUser(@FormParam("updateXml") String xml) throws Exception
	{
		return getResult(String.valueOf(PPNtransDsBusiness.updataObjecsDsOrUserOrMedia(xml)));
	}//createObjecsMdsOrUser
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/createObjecsDsOrUser")
	public  WSResult createObjecsMdsOrUser(@FormParam("id") String id) throws Exception
	{
		return getResult(PPNtransDsBusiness.createObjecsDsOrUserOrMedia(id));
	}//
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getPPNtransDsUserById")
	public  WSResult getPPNtransDsUserById(@FormParam("className") String className, @FormParam("DS_ID") String id) throws Exception
	{
			return getResult(PPNtransDsBusiness.createTransDsUserById(id));
	}
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getPPNtransDsMediaById")
	public  WSResult getPPNtransMdtDestById(@FormParam("className") String className, @FormParam("DS_ID") String id) throws Exception
	{
			return getResult(PPNtransDsBusiness.createTransDsMediaById(id));
	}
	
	/**
	 * selectTj
     * 
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/selectTj")
	public  WSResult selectTj(@FormParam("stateTime") String stateTime,@FormParam("endTime") String endTime) throws Exception
	{
			return getResult(String.valueOf(PPNtransDsBusiness.selectTj(stateTime,endTime)));
	}
}
