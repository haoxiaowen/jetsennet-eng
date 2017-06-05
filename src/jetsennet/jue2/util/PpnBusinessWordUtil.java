package jetsennet.jue2.util;

import java.util.Map;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jue2.util.factory.DaoFactory;
import jetsennet.util.StringUtil;

import org.uorm.dao.common.ICommonDao;

/**
 * 业务受控词工具类
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2015-11-18       zw          创建<br/>
 */
public class PpnBusinessWordUtil
{
	
	/**
	 * 获得受控词内容
	 * @param bwordType
	 * @param bwordName
	 * @return
	 */
	public static String getBwordData(String bwordType, String bwordName)
	{
		String res = null;
		try
		{
			ICommonDao dao = DaoFactory.getPpnCommonDao();
			StringBuilder querySb = new StringBuilder();
			querySb.append("SELECT t.BWORD_DATA FROM PPN_BUSINESSWORD t WHERE BWORD_STATUS = 0");	//正常可用的业务受控词
			if (!StringUtil.isNullOrEmpty(bwordType))
			{
				querySb.append(" AND t.BWORD_TYPE = '").append(bwordType).append("'");
			}
			if (!StringUtil.isNullOrEmpty(bwordName))
			{
				querySb.append(" AND t.BWORD_NAME = '").append(bwordName).append("'");
			}
			Map<String, Object> resMap = dao.queryForMap(querySb.toString());
			if (resMap != null)
			{
				res = resMap.get("BWORD_DATA").toString();
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 获得受控词内容
	 * @param bwordType
	 * @param bwordName
	 * @param dao
	 * @return
	 * @throws Exception
	 */
	public static String getBwordData(String bwordType, String bwordName, IDao dao) throws Exception
	{
		String res = null;
		StringBuilder querySb = new StringBuilder();
		querySb.append("SELECT t.BWORD_DATA FROM PPN_BUSINESSWORD t WHERE BWORD_STATUS = 0");	//正常可用的业务受控词
		if (!StringUtil.isNullOrEmpty(bwordType))
		{
			querySb.append(" AND t.BWORD_TYPE = '").append(bwordType).append("'");
		}
		if (!StringUtil.isNullOrEmpty(bwordName))
		{
			querySb.append(" AND t.BWORD_NAME = '").append(bwordName).append("'");
		}
		Map<String, Object> resMap = dao.queryForMap(querySb.toString());
		if (resMap != null)
		{
			res = resMap.get("BWORD_DATA").toString();
		}
		return res;
	}
	
	
	/**
	 * 获得受控词内容
	 * @param bwordType
	 * @param bwordData
	 * @param dao
	 * @return
	 * @throws Exception
	 */
	public static String getBwordName(String bwordType, String bwordData, IDao dao) throws Exception
	{
		String res = null;
		StringBuilder querySb = new StringBuilder();
		querySb.append("SELECT t.BWORD_NAME FROM PPN_BUSINESSWORD t WHERE BWORD_STATUS = 0");	//正常可用的业务受控词
		if (!StringUtil.isNullOrEmpty(bwordType))
		{
			querySb.append(" AND t.BWORD_TYPE = '").append(bwordType).append("'");
		}
		if (!StringUtil.isNullOrEmpty(bwordData))
		{
			querySb.append(" AND t.BWORD_DATA = '").append(bwordData).append("'");
		}
		Map<String, Object> resMap = dao.queryForMap(querySb.toString());
		if (resMap != null)
		{
			res = resMap.get("BWORD_NAME").toString();
		}
		return res;
	}
}
