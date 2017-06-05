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
import jetsennet.jue2.business.PPNtransMadtBusiness;
import jetsennet.net.WSResult;


@Path(value = "/PPNtransmdtService")
@WebService(name = "/PPNtransmdtService")
public class PPNtransmdtService extends BaseService {
//PPNSystemService
	private PPNtransMadtBusiness ppntransMadtBusiness;
	
	
	@javax.jws.WebMethod(exclude = true)
	public PPNtransMadtBusiness getPpntransMadtBusiness() {
		return ppntransMadtBusiness;
	}
	@javax.jws.WebMethod(exclude = true)
	public void setPpntransMadtBusiness(PPNtransMadtBusiness ppntransMadtBusiness) {
		this.ppntransMadtBusiness = ppntransMadtBusiness;
	}
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/deleteObjecsMdsAndUserAndDest")
	public  WSResult deleteObjecsMdsAndUserAndDest(@FormParam("className") String className, @FormParam("deleteIds") String ids) throws Exception
	{
			return getResult(ppntransMadtBusiness.deleteObjecsAllMUD(ids));
	}//
	
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/insertObjecsMdsOrUser")
	public  WSResult insertObjecsMdsOrUser(@FormParam("className") String className, @FormParam("saveXml") String xml) throws Exception
	{
			return getResult(String.valueOf(ppntransMadtBusiness.insertObjecsPpn(xml)));
	}//
	
	
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/updataObjecsMdsOrUser")
	public  WSResult updataObjecsMdsOrUser(@FormParam("updateXml") String xml) throws Exception
	{
		return getResult(String.valueOf(ppntransMadtBusiness.updataObjecsMdsOrUserOrDest(xml)));
	}//createObjecsMdsOrUser
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/createObjecsMdsOrUser")
	public  WSResult createObjecsMdsOrUser(@FormParam("id") String id) throws Exception
	{
		return getResult(ppntransMadtBusiness.createObjecsMdOrUserOrDest(id));
	}//
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getPPNtransDsUserById")
	public  WSResult getPPNtransDsUserById(@FormParam("className") String className, @FormParam("MDT_ID") String id) throws Exception
	{
			return getResult(ppntransMadtBusiness.createTransDsUserById(id));
	}
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/getPPNtransMdtDestById")
	public  WSResult getPPNtransMdtDestById(@FormParam("className") String className, @FormParam("MDT_ID") String id) throws Exception
	{
			return getResult(ppntransMadtBusiness.createTransMdtDestById(id));
	}
}
