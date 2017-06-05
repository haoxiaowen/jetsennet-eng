package jetsennet.jue2.business;

import java.util.List;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jue2.util.factory.DaoFactory;
import jetsennet.net.WSResult;
import jetsennet.orm.configuration.ConfigurationBuilderProp;
import jetsennet.sqlclient.ISqlParser;
import jetsennet.sqlclient.SqlClientObjFactory;
import jetsennet.sqlclient.SqlQuery;
import jetsennet.util.SerializerUtil;
import jetsennet.util.SpringContextUtil;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;

/**
 * 通用业务类
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-5-1       zw          创建<br/>
 */
public class PpnBusiness
{
	protected Logger logger = Logger.getLogger(PpnBusiness.class);
	
	/**通用查询方法
	 * @param objXml SqlQuery
	 * @throws Exception
	 */
	public WSResult commonXmlQuery4hx(String objXml, boolean isTransfor) {
		WSResult retObj = new WSResult();
		try {
			ConfigurationBuilderProp cfg = SpringContextUtil.getBean("defaultDBBuilderProp", ConfigurationBuilderProp.class);
			
			//前台JS对应的SQL转化成普通SQL
			SqlQuery query = SerializerUtil.deserialize(SqlQuery.class, objXml);
			ISqlParser sqlParser = SqlClientObjFactory.createSqlParser(cfg.genConfiguration().connInfo.driver);
			
			IDao dao = DaoFactory.getPpnCommonDao();
			//解析SQL语句
			String sql = sqlParser.getSelectCommandString(query);
			Document ds = dao.fill(sql, "rows", "row");
			formatDoc4hx(ds, query, isTransfor);
			retObj.setResultVal(ds.asXML());

		} catch (Exception ex) {
			logger.debug(ex.toString());
		}
		
		return retObj;
	}
	
	/**
	 * 通用分页查询方法
	 * @param queryXml	查询xml
	 * @param rootName	查询结果根节点名称
	 * @param itemName	
	 * @param startNum	开始页数，页码从0开始
	 * @param pageSize	每页大小
	 * @return
	 */
	public WSResult queryPage4hx(String queryXml,int startNum, int pageSize,boolean isTransfor) {
		WSResult retObj = new WSResult();
		try {
			ConfigurationBuilderProp cfg = SpringContextUtil.getBean("defaultDBBuilderProp", ConfigurationBuilderProp.class);
			
			//前台JS对应的SQL转化成普通SQL
			SqlQuery query = SerializerUtil.deserialize(SqlQuery.class, queryXml);
			ISqlParser sqlParser = SqlClientObjFactory.createSqlParser(cfg.genConfiguration().connInfo.driver);
			
			IDao dao = DaoFactory.getPpnCommonDao();
			
			//解析SQL语句
			String sql = sqlParser.getSelectCommandString(query);	//没有用到keyId
			Document ds = dao.fillByPagedQuery(sql, "rows", "row", startNum, pageSize);
			formatDoc4hx(ds, query, isTransfor);
			retObj.setResultVal(ds.asXML());
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.debug(ex.toString());
		}
		
		return retObj;
	}

	
	/**
	 * 为dhtmlGrid处理结果集
	 * @author zw	2014-11-20 12:42:44
	 * @param ds
	 * @param query
	 * @param isTransfor
	 */
	private void formatDoc4hx(Document ds, SqlQuery query, boolean isTransfor) {
		Element rootEle = ds.getRootElement();
		String keyIdName = query.keyId;
		String[] keyIdNames = keyIdName.split(",");
		List<Element> rowsEle = rootEle.elements();
		for (Element rowEle : rowsEle)
		{
			StringBuffer sb = new StringBuffer();
			for (String key : keyIdNames)
			{
				//设置主键
				Element keyEle = rowEle.element(key);
				if (keyEle != null)
				{
					sb.append(keyEle.getText()).append("|");
				}
			}
			if (sb.length() > 0)
			{					
				sb.deleteCharAt(sb.length()-1);
			}
			rowEle.addAttribute("id", sb.toString());
			
			if (isTransfor)
			{
				//修改内容节点名称
				List<Element> cellEles = rowEle.elements();
				for (Element cellEle : cellEles)
				{
					cellEle.setName("cell");
				}
			}
		}
	}
}
