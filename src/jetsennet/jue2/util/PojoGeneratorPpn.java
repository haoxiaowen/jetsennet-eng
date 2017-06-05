package jetsennet.jue2.util;

import org.uorm.pojo.generator.PojoGenerator;

/**
 * 继承框架中的PojoGenerator， 实现子类的change2properTypeName方法
 * 主要应对orale中的Timestamp类型转java.sql.Timestamp类型后，框架不支持xml形式保存。
 * 因此将oracle中的Timestamp转为java.util.Date
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0 ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期	 修订人 	描述<br/>
 * 2016-4-8 	zw 	创建<br/>
 */
public class PojoGeneratorPpn extends PojoGenerator
{

	/**
	 * 有参构造
	 * 
	 * @param driver
	 * @param url
	 * @param username
	 * @param password
	 * @param packageName
	 * @param destination
	 */
	public PojoGeneratorPpn(String driver, String url, String username, String password, String packageName,
			String destination)
	{
		super(driver, url, username, password, packageName, destination);
	}

	/**
	 * 类型转换
	 */
	protected String change2properTypeName(String typeName, boolean pk, boolean fk)
	{
		String name = typeName;
		if (typeName.equals("oracle.sql.TIMESTAMP"))
		{
			name = "java.util.Date"; // "java.sql.Timestamp";
		} else if (typeName.equals("java.math.BigDecimal"))
		{
			if ((pk) || (fk))
			{
				name = "java.lang.Long";
			}else
			{
				name = "java.lang.Integer";
			}

		} else if (typeName.equals("java.sql.Date") || typeName.equals("java.sql.Timestamp"))
		{
			name = "java.util.Date";
		} else if (typeName.equals("java.sql.Clob"))
		{
			name = "java.lang.String";
		} else if (typeName.equals("java.sql.Blob"))
		{
			name = "byte[]";
		}
		return name;
	}

}
