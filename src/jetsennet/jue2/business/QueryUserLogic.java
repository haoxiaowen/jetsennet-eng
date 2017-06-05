package jetsennet.jue2.business;

import java.sql.SQLException;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jue2.util.factory.DaoFactory;

import org.dom4j.Document;


/**
 * 获取用户信息逻辑
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-8-4       zw          创建<br/>
 */
public class QueryUserLogic
{
	/**
	 * 获取用户信息
	 * @param userCode
	 * @return xml
	 */
	public String getUserByCode(String userCode)
	{
		String res = null;
		IDao dao = DaoFactory.getPpnCommonDao();
		String queryStr = String.format("SELECT * FROM UUM_USER WHERE LOGIN_NAME = '%s'", userCode);
		
		try
		{
			Document doc = dao.fill(queryStr,"RecordSet","Table");
			res = doc.asXML();
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		return res;
	}
}
