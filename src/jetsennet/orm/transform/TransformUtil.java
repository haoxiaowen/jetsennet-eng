package jetsennet.orm.transform;

public class TransformUtil
{
	public static String removeSelect(String sql)
	{
		//修改zw 2016-5-6 不直接返回大写查询语句。大写查询语句只作为获取截取位置的临时字符串
		String sqlUpper = sql.toUpperCase();
		int beginPos = sqlUpper.indexOf("FROM");
		int dispos = sqlUpper.substring(0, beginPos).indexOf("DISTINCT");
		if (dispos > 0)
		{
			return sql;
		}

		return sql.substring(beginPos);
	}
}