/* 
 * Copyright (c) 北京捷成世纪科技股份有限公司. All Rights Reserved.
 * 文件：jetsennet.jdvn.service.MessageServices.java
 * 日 期：2014-2-14 下午3:33:50
 * 作 者：蒋勇
 */
package jetsennet.jue2.services.in;

import javax.jws.WebService;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import jetsennet.frame.service.BaseService;
import jetsennet.jue2.business.PpnAssginBusiness;
import jetsennet.net.WSResult;
import jetsennet.util.StringUtil;

@Path(value = "/PpnAssignService")
@WebService(name = "/PpnAssignService")
public class PpnAssignService extends BaseService {
	
	private PpnAssginBusiness ppnAssignBusiness;
	
	@javax.jws.WebMethod(exclude = true)
	public PpnAssginBusiness getPpnAssignBusiness() {
		return ppnAssignBusiness;
	}

	@javax.jws.WebMethod(exclude = true)
	public void setPpnAssignBusiness(PpnAssginBusiness ppnAssignBusiness) {
		this.ppnAssignBusiness = ppnAssignBusiness;
	}
	
	/**
     * 指定资源分配技术人员
     */
	@POST
	@Path(value = "/assignUsersToRes")
	public WSResult assignUsersToRes(@FormParam("ASSIGN_IDS") String assignIds, @FormParam("USER_IDS") String userIds)
	{
		WSResult ret = new WSResult();
		try {
			ret = getResult(ppnAssignBusiness.assignUsersToRes(assignIds,userIds));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;
	}

	/**
     * 追加技术人员
     */
	@POST
	@Path(value = "/assignAddUsersToRes")
	public WSResult assignAddUsersToRes(@FormParam("ASSIGN_IDS") String assignIds, @FormParam("USER_IDS") String userIds)
	{
		WSResult ret = new WSResult();
		try {
			ret = getResult(ppnAssignBusiness.assignAddUsersToRes(assignIds,userIds));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 指定资源删除人员
     */
	@POST
	@Path(value = "/deleteUsersToRes")
	public WSResult deleteUsersToRes(@FormParam("ASSIGN_IDS") String assignIds, @FormParam("USER_IDS") String userIds)
	{
		WSResult ret = new WSResult();
		try {
			ret = getResult(ppnAssignBusiness.deleteUsersToRes(assignIds,userIds));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 更换设备
     */
	@POST
	@Path(value = "/assignChange")
	public WSResult assignChange(@FormParam("ASSIGN_IDS") String assignIds, @FormParam("RES_CODE") String resCode)
	{
		WSResult ret = new WSResult();
		try {
			ret = getResult(ppnAssignBusiness.assignChange(assignIds,resCode));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 启动任务
     */
	@POST
	@Path(value = "/startTask")
	public WSResult startTask(@FormParam("TASK_ID") String taskId)
	{
		WSResult ret = new WSResult();
		try {
			String retStr = ppnAssignBusiness.startTask(taskId);
			if("OK".equals(retStr)){
				ret = getResult(retStr);
			}else if("No".equals(retStr)){
				ret.setErrorCode(-1);
				ret.setErrorString("请检查工作站是否已开机以及网络是否连通");
			}else{
				ret.setErrorCode(-1);
				ret.setErrorString("启动任务失败，请查看错误日志");
			}
		} catch (Exception e) {
			ret.setErrorCode(-2);
			ret.setErrorString("服务调用失败，请查看错误日志");
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 资源排班同步
     */
	@POST
	@Path(value = "/syncTask")
	public WSResult syncTask(@FormParam("TASK_ID") String taskId)
	{
		WSResult ret = new WSResult();
		try {
			String retStr = ppnAssignBusiness.syncTask(taskId);
			if("OK".equals(retStr)){
				ret = getResult(retStr);
			}else{
				ret.setErrorCode(-1);
				ret.setErrorString("同步失败，请查看错误日志");
			}
		} catch (Exception e) {
			ret.setErrorCode(-2);
			ret.setErrorString("服务调用失败，请查看错误日志");
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 更改任务指派
     */
	@POST
	@Path(value = "/modifyAssign")
	public WSResult modifyAssign(@FormParam("ASSIGN_ID") String assignId)
	{
		WSResult ret = new WSResult();
		try {
			String retStr = ppnAssignBusiness.modifyAssign(assignId);
			if("OK".equals(retStr)){
				ret = getResult(retStr);
			}else if("No".equals(retStr)){
				ret.setErrorCode(-1);
				ret.setErrorString("请检查工作站是否已开机以及网络是否连通");
			}else{
				ret.setErrorCode(-1);
				ret.setErrorString("分配失败，请查看错误日志");
			}
		} catch (Exception e) {
			ret.setErrorCode(-2);
			ret.setErrorString("服务调用失败，请查看错误日志");
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 变更
     */
	@POST
	@Path(value = "/changeAssign")
	public WSResult changeAssign(@FormParam("TASK_ID") String taskId,@FormParam("ASSIGN_IDS") String assignIds)
	{
		WSResult ret = new WSResult();
		try {
			String retStr = ppnAssignBusiness.changeAssign(taskId,assignIds);
			if("OK".equals(retStr)){
				ret = getResult(retStr);
			}else if("No".equals(retStr)){
				ret.setErrorCode(-1);
				ret.setErrorString("请检查工作站是否已开机以及网络是否连通");
			}else{
				ret.setErrorCode(-1);
				ret.setErrorString("变更失败，请查看错误日志");
			}
		} catch (Exception e) {
			ret.setErrorCode(-2);
			ret.setErrorString("服务调用失败，请查看错误日志");
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 更改任务指派
     */
	@POST
	@Path(value = "/startPhase")
	public  WSResult startPhase(@FormParam("TASK_IDS") String taskID, @FormParam("PHARSE_IDS") String phaseIDS)
	{
		WSResult ret = new WSResult();
		try {
			if (StringUtil.isNullOrEmpty(taskID) && StringUtil.isNullOrEmpty(phaseIDS)) {
				throw new Exception("参数为空！");
			}
			ppnAssignBusiness.startPhase(phaseIDS,taskID);
		} catch (Exception e) {
			ret.setErrorCode(-1);
			ret.setErrorString(e.getMessage());
			e.printStackTrace();
		}
		
		return ret;
	}
	
	/**
     * 批量添加账户
     */
	@POST
	@Path(value = "/createUsers")
	public WSResult createUsers(@FormParam("USER_IDS") String userIds,@FormParam("STOR_IDS") String storIds)
	{
		WSResult ret = new WSResult();
		try {
			String retStr = ppnAssignBusiness.createUsers(userIds,storIds);
			if("OK".equals(retStr)){
				ret = getResult(retStr);
			}else if("Error".equals(retStr)){
				ret.setErrorCode(-1);
				ret.setErrorString("分配失败，请查看错误日志");
			}else{
				ret.setErrorCode(-3);
				ret.setErrorString("执行失败的设备："+retStr);
			}
		} catch (Exception e) {
			ret.setErrorCode(-2);
			ret.setErrorString("服务调用失败，请查看错误日志");
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 批量删除账户
     */
	@POST
	@Path(value = "/deleteUsers")
	public WSResult deleteUsers(@FormParam("USER_IDS") String userIds,@FormParam("STOR_IDS") String storIds)
	{
		WSResult ret = new WSResult();
		try {
			String retStr = ppnAssignBusiness.deleteUsers(userIds,storIds);
			if("OK".equals(retStr)){
				ret = getResult(retStr);
			}else if("Error".equals(retStr)){
				ret.setErrorCode(-1);
				ret.setErrorString("分配失败，请查看错误日志");
			}else{
				ret.setErrorCode(-3);
				ret.setErrorString("执行失败的设备："+retStr);
			}
		} catch (Exception e) {
			ret.setErrorCode(-2);
			ret.setErrorString("服务调用失败，请查看错误日志");
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
     * 添加人员
     */
	@POST
	@Path(value = "/selectUsers")
	public WSResult selectUsers(@FormParam("USER_IDS") String userIds)
	{
		WSResult ret = new WSResult();
		try {
			ret = ppnAssignBusiness.selectUsers(userIds, ret);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * 保存资源出库单
	 * */
	@POST
	@Path(value = "/saveSource")
	public  WSResult saveSource(@FormParam("saveXml") String xml) throws Exception
		{
		WSResult ret = new WSResult();
		try{
			ret = ppnAssignBusiness.saveSource(xml,ret);
		}catch(Exception e){
			e.printStackTrace();
		}
			return ret;
	}
	
	 //删除资源出库单
    @POST
	@Path(value = "/removeSource")
	public WSResult removeSource(String ids) {
		WSResult retObj = new WSResult();

		try {
			ppnAssignBusiness.removeSource(ids);
			retObj.setErrorCode(0);
		} catch (Exception e) {
			retObj.setErrorCode(1);
		}
		return retObj;

	}
    
    
    /**
     * 添加人员
     */
	@POST
	@Path(value = "/submitSource")
	public WSResult submitSource(@FormParam("item_id") String itemId)
	{
		WSResult ret = new WSResult();
		try {
		String itStr = ppnAssignBusiness.submitSource(itemId, ret);
		if("OK".equals(itStr)){
			ret = getResult(itStr);
		}else{
			ret.setErrorCode(-1);
			ret.setErrorString("提交审核失败");
		}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;
	}
	
}
