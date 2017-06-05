package jetsennet.jue2.action;

import jetsennet.jue2.business.PpnAssignMentChartBusiness;
import jetsennet.jue2.centre.IBusinessClass;


/**
 * 资源信息统计使用的Action
 * 
 * @author wxd
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-12-22       wxd          创建<br/>
 */
public class AssignMentChartAction implements IBusinessClass{

	/**
	 * 根据获取资源使用信息的统计
	 * @param objStr
	 * @return
	 * @throws Exception
	 */
	public String getAssignMentChart(String objStr) throws Exception{
		
		return PpnAssignMentChartBusiness.getInstance().getAssignMentChart(objStr);
		
	}
}
