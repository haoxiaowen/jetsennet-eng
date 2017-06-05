package jetsennet.jue2.util;

/**
 * 字符串Id处理
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2014-11-21       zw          创建<br/>
 */
public class StringIdsUtils
{

	/**
	 * 将字符串型的Id转成sql可以拼接的字符串
	 * eg：abc,dsf --> 'abc','dsf'
	 * @param objIds
	 * @return
	 */
	public static String getSqlIds(String objIds)
	{
		return String.format("'%s'", objIds.replaceAll(",", "','"));
	}
}
