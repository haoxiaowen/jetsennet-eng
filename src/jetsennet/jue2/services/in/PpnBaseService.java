package jetsennet.jue2.services.in;

import jetsennet.net.WSResult;

import org.apache.log4j.Logger;

/**
 * Ppn基础服务类
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-7-14       zw          创建<br/>
 */
public class PpnBaseService
{
	protected Logger logger = Logger.getLogger(PpnBaseService.class);
	
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
