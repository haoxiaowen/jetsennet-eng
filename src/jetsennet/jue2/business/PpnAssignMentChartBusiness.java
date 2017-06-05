package jetsennet.jue2.business;

import org.dom4j.Document;
import org.dom4j.Element;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jue2.util.factory.DaoFactory;

/**
 * 资源使用信息统计
 * 
 * @author wxd
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-12-22       wxd          创建<br/>
 */
public class PpnAssignMentChartBusiness {
	
	/**
	 * 私有构造
	 */
	private PpnAssignMentChartBusiness() {}
	
	private static PpnAssignMentChartBusiness assignMentChartBusiness = new PpnAssignMentChartBusiness();
	
	/**
	 * 获取实例
	 * @return
	 */
	public static PpnAssignMentChartBusiness getInstance(){
		return assignMentChartBusiness;
	}
	
	/**
	 * 根据节目id获得推送目标
	 * @param objStr
	 * @return
	 * @throws Exception
	 */
	public String getAssignMentChart(String objStr) throws Exception{
		String res = null;
		try{
			IDao dao = DaoFactory.getPpnCommonDao();
			String[] times = objStr.split("&");
			String cloomSql = String.format("SELECT DISTINCT nvl(AP.name,'other') AS name,count(1) AS value FROM ( ");
			String assignSql = String.format(" SELECT DISTINCT ASSIGN_PLAN_RES_CODE as name,count(1) AS value FROM PPN_RES_ASSIGNMENT ");
			cloomSql += "SELECT DISTINCT PRA.*,PCC.COL_CODE AS name FROM PPN_RES_ASSIGNMENT PRA ";
			cloomSql += "LEFT JOIN PPN_TASK_RES_ASSIGN PTRA ON PRA.ASSIGN_ID = PTRA.ASSIGN_ID ";
			cloomSql += "LEFT JOIN PPN_TASK PT ON PT.TASK_ID = PTRA.TASK_ID ";
			cloomSql += "LEFT JOIN PPN_PGM_PROGRAM PPR ON PT.PGM_ID = PPR.PGM_ID ";
			cloomSql += "LEFT JOIN PPN_CDM_COLUMN PCC ON PPR.PGM_OWNERSHIP_COLUMN = PCC.COL_CODE ";
			if(objStr.length() > 8){
				cloomSql += "WHERE PRA.ASSIGN_PLAN_END_TIME <= to_date('"+times[1]+"' ,'YYYY-MM-DD HH24:MI:SS') ";
				cloomSql += "AND PRA.ASSIGN_PLAN_START_TIME >= to_date('"+times[0]+"','YYYY-MM-DD HH24:MI:SS') ";
				assignSql += " WHERE ASSIGN_PLAN_END_TIME <= to_date('"+times[1]+"' ,'YYYY-MM-DD HH24:MI:SS')";
				assignSql += " AND ASSIGN_PLAN_START_TIME >= to_date('"+times[0]+"','YYYY-MM-DD HH24:MI:SS')";
			}
			cloomSql += "ORDER BY PRA.ASSIGN_PLAN_RES_CODE ) ";
			cloomSql += "AP GROUP BY  AP.name ";
			
			assignSql += " GROUP BY ASSIGN_PLAN_RES_CODE ";
			
			String colom = dao.fillJson(cloomSql);
			String assign = dao.fillJson(assignSql);
			
			res = colom + "&"+ assign;
		}catch(Exception e){
			e.printStackTrace();
			throw new Exception("获取数据异常", e);
		}
		return res;
	}

}
