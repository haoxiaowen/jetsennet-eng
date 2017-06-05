/**
 * 
 */
package jetsennet.jue2.services.in;


import javax.jws.WebService;

import jetsennet.jue2.business.PpnBusiness;
import jetsennet.jue2.centre.IBusinessControllor;
import jetsennet.jue2.centre.config.ConfigFactory;
import jetsennet.jue2.centre.config.IBusinessConfigExecutor;
import jetsennet.net.WSResult;

import org.apache.log4j.Logger;

/**
 * 定时任务模块对外提供的服务接口
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-3-22       zw          创建<br/>
 */
@WebService(name = "PpnServiceIn", targetNamespace = "http://JetsenNet/JPPN/")
public class PpnServiceIn
{
	protected Logger logger = Logger.getLogger(PpnServiceIn.class);
	
	private PpnBusiness ppnBusiness;

	/**
	 * 执行自定义业务方法的接口
	 * 
	 * @param controlNumber 控制资源编号
	 * @param jsonString 表示业务数据的JSON字符串
	 * @return
	 */	
	public WSResult ppnExecuteBusiness(String controlNumber, String jsonString) {
		logger.debug(String.format("[%s] [%s]", "ppnExecuteBusinessIn", jsonString));
		WSResult retObj = new WSResult();
		
		try {
			IBusinessConfigExecutor systemConfigExecutor = ConfigFactory.getSystemConfigExecutor();
			IBusinessControllor controllor = systemConfigExecutor.getSingleObject(IBusinessControllor.class);
			String result = controllor.execute(controlNumber, jsonString);
			retObj.setResultVal(result);
		} catch (Exception e) {
			Exception ex = (Exception)(e.getCause() == null ? e : e.getCause());
			errorProcess(retObj, "业务执行失败!", ex);
		}
		return retObj;
	}
	
	/**
	 * dhtmlxGrid通用分页查询
	 * @param queryXml
	 * @param startNum
	 * @param pageSize
	 * @param header
	 * @return
	 */
	public WSResult queryPage4hx(String queryXml,int startNum,int pageSize, boolean isTransfor) {
		WSResult retObj = new WSResult();
		
		if (retObj.getErrorCode() != 0){
			return retObj;
		}
		
		try {
			retObj = ppnBusiness.queryPage4hx(queryXml, startNum, pageSize, isTransfor);
		} catch (Exception ex) {
			logger.debug(ex.toString());
			errorProcess(retObj, "查询数据异常", ex);
		}
		
		return retObj;
	}
	
	/**
	 * dhtmlxGrid通用分页查询(直接转出dGrid所需节点)
	 * @param queryXml
	 * @param startNum
	 * @param pageSize
	 * @return
	 */
	public WSResult queryPage4hxTrans(String queryXml,int startNum,int pageSize)
	{
		return queryPage4hx(queryXml, startNum, pageSize, true);
	}
	
	/**通用查询方法
	 * @param objXml
	 * @throws Exception
	 */
	public WSResult query4hx(String queryXml, boolean isTransfor) {
		WSResult retObj = new WSResult();
		
		if (retObj.getErrorCode() != 0){
			return retObj;
		}
		
		try {
			retObj = ppnBusiness.commonXmlQuery4hx(queryXml, isTransfor);
		} catch (Exception ex) {
			logger.debug(ex.toString());
			errorProcess(retObj, "查询数据异常", ex);
		}
		
		return retObj;
	}
	
	/**
	 * 通用查询方法
	 * @param queryXml
	 * @return
	 */
	public WSResult query4hxTrans(String queryXml)
	{
		return query4hx(queryXml, true);
	}
	
	/**
	 * 错误处理
	 * @param result
	 * @param message
	 * @param ex
	 */
	protected void errorProcess(WSResult result, String message, Exception ex)
	{
		ex.printStackTrace();
		logger.error(message, ex);
		result.setErrorCode(-1);
		result.setErrorString(message +" : "+ ex.getMessage());
	}
	
	@javax.jws.WebMethod(exclude = true)
	public PpnBusiness getPpnBusiness()
	{
		return ppnBusiness;
	}

	@javax.jws.WebMethod(exclude = true)
	public void setPpnBusiness(PpnBusiness ppnBusiness)
	{
		this.ppnBusiness = ppnBusiness;
	}
	
	
	public void startPhases(String queryXml){
		System.out.println("====================");
	}
	
	
}
