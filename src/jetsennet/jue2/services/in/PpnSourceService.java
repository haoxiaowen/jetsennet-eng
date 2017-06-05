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
import jetsennet.jue2.business.PpnSourceBusiness;
import jetsennet.net.WSResult;
import jetsennet.util.StringUtil;

@Path(value = "/PpnSourceService")
@WebService(name = "/PpnSourceService")
public class PpnSourceService extends BaseService {
	
	private PpnSourceBusiness ppnSourceBusiness;
	
	@javax.jws.WebMethod(exclude = true)
	public PpnSourceBusiness getPpnSourceBusiness() {
		return ppnSourceBusiness;
	}
	@javax.jws.WebMethod(exclude = true)
	public void setPpnSourceBusiness(PpnSourceBusiness ppnSourceBusiness) {
		this.ppnSourceBusiness = ppnSourceBusiness;
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
			ret = ppnSourceBusiness.selectUsers(userIds, ret);
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
			ret = ppnSourceBusiness.saveSource(xml,ret);
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
			ppnSourceBusiness.removeSource(ids);
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
		String itStr = ppnSourceBusiness.submitSource(itemId, ret);
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
