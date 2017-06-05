/**
 * 
 */
package jetsennet.jue2.services.in;


import javax.jws.WebService;

import jetsennet.jue2.centre.IBusinessControllor;
import jetsennet.jue2.centre.config.ConfigFactory;
import jetsennet.jue2.centre.config.IBusinessConfigExecutor;
import jetsennet.net.WSResult;

import org.apache.log4j.Logger;

/**
 * Ppn模块对外提供的服务接口
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-3-22       zw          创建<br/>
 */
@WebService(name = "PpnService", targetNamespace = "http://JetsenNet/JPPN/")
public class PpnService
{
	protected Logger logger = Logger.getLogger(PpnService.class);
	
	/**
	 * 执行自定义业务方法的接口
	 * 
	 * @param controlNumber 控制资源编号
	 * @param jsonString 表示业务数据的JSON字符串
	 * @param header
	 * @return
	 */
	public String ppnExecuteBusiness(String controlNumber, String jsonString) {
		logger.debug(String.format("[%s] [%s]", "jppnExecuteBusiness", jsonString));
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
		return retObj.toXML();
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
	
}
