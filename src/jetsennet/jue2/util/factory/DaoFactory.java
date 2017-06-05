package jetsennet.jue2.util.factory;

import jetsennet.frame.dataaccess.BaseDao;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.util.SpringContextUtil;

/**
 * 数据连接工具生成工厂
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2014-4-25       zw          创建<br/>
 */
public class DaoFactory {
	
	public static IDao getPpnCommonDao(){
		//从对象池中获得对象
	    IDao dao = SpringContextUtil.getBean("baseDao", BaseDao.class);
		return dao;
	}
}