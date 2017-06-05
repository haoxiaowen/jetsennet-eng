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
import jetsennet.jue2.business.PpnMsgBusiness;
import jetsennet.jue2.business.PpnMsgBusiness;
import jetsennet.net.WSResult;


@Path(value = "/PpnMsgService")
@WebService(name = "/PpnMsgService")
public class PpnMsgService extends BaseService {
//PPNSystemService
	private PpnMsgBusiness PpnMsgBusiness;
	
	
	@javax.jws.WebMethod(exclude = true)
	public PpnMsgBusiness getPpnMsgBusiness() {
		return PpnMsgBusiness;
	}
	@javax.jws.WebMethod(exclude = true)
	public void setPpnMsgBusiness(PpnMsgBusiness PpnMsgBusiness) {
		this.PpnMsgBusiness = PpnMsgBusiness;
	}
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/deleteObjecsDsAndUserAndDest")
	public  WSResult deleteObjecsMdsAndUserAndDest(@FormParam("className") String className, @FormParam("deleteIds") String ids) throws Exception
	{
			return getResult(PpnMsgBusiness.deleteObjecsAllMUD(ids));
	}//
	
	
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/sendmsg")
	public  WSResult sendmsg(@FormParam("className") String className, @FormParam("msgId") String msgId, @FormParam("msgsendto") String msgsendto) throws Exception
	{
			return getResult(String.valueOf(PpnMsgBusiness.sendmsg(msgId,msgsendto)));
	}//
	
	/**
     * 获取服务信息                             接口
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/insertObjecsDsOrUser")
	public  WSResult insertObjecsMdsOrUser(@FormParam("className") String className, @FormParam("saveXml") String xml) throws Exception
	{
			return getResult(String.valueOf(PpnMsgBusiness.insertObjecsPpn(xml)));
	}//
	
	
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/updataObjecs")
	public  WSResult updataObjecs(@FormParam("updateXml") String xml) throws Exception
	{
		return getResult(String.valueOf(PpnMsgBusiness.updataObjecsDsOrUserOrMedia(xml)));
	}//createObjecsMdsOrUser
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/createObjecsDsOrUser")
	public  WSResult createObjecsMdsOrUser(@FormParam("id") String id) throws Exception
	{
		return getResult(PpnMsgBusiness.createObjecsDsOrUserOrMedia(id));
	}//
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getPPNtransDsUserById")
	public  WSResult getPPNtransDsUserById(@FormParam("className") String className, @FormParam("DS_ID") String id) throws Exception
	{
			return getResult(PpnMsgBusiness.createTransDsUserById(id));
	}
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getPPNtransDsMediaById")
	public  WSResult getPPNtransMdtDestById(@FormParam("className") String className, @FormParam("DS_ID") String id) throws Exception
	{
			return getResult(PpnMsgBusiness.createTransDsMediaById(id));
	}
	
	/**
    * 获取服务信息
	 * @throws SQLException 
    */
	@POST
	@Path(value = "/getusers")
	public  WSResult getusers(@FormParam("updateXml") String xml) throws Exception
	{
		return getResult(String.valueOf(PpnMsgBusiness.getusers(xml)));
	}//createObjecsMdsOrUser
	
	/**
	 * 获取服务信息
   * @throws SQLException 
	 */
	@POST
	@Path(value = "/getRoleToUser")
	public  WSResult getRoleToUser(@FormParam("id") String id) throws Exception
		{
			return getResult(String.valueOf(PpnMsgBusiness.getRoleToUser(id)));
		}
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/deleteMsg")
	public  WSResult deleteMsg(@FormParam("className") String className, @FormParam("ids") String ids) throws Exception
	{
			return getResult(PpnMsgBusiness.deleteMsg(ids));
	}//
}
