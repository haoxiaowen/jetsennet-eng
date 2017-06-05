/**
 * 
 */
package jetsennet.jue2.util;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * 分隔字符串工具类
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2014-6-26       zw          创建<br/>
 */
public class StringSplit4Db
{
	
	/**
	 * 将原字符串按字节
	 * @param str		源字符串
	 * @param length		截取长度
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static List<String> splitStr(String str, int length) throws UnsupportedEncodingException
	{
		String isoStr = new String(str.getBytes("utf-8"), "iso-8859-1");
		int resLen = isoStr.length()/length + 1;
		List<String> res = new ArrayList<String>(resLen);
		char[] isoCharArray = isoStr.toCharArray();
		
		int beginIndex = 0;
		int endIndex = 0;
		
		for (int i = 0; i < resLen; i++)
		{
			//计算开始和结束位置
			endIndex = beginIndex + length -1;
			endIndex = endIndex >= isoStr.length() ? isoStr.length()-1 : endIndex;
			
			if (beginIndex >= endIndex)
			{
				break;
			}
			if (isEnglishNum(String.valueOf(isoStr.charAt(endIndex))))
			{
				//如果是英文或数字，则可以直接截取
//				System.out.println("~|"  + toUtf8(isoStr.substring(beginIndex, endIndex+1)));
				res.add(toUtf8(isoStr.substring(beginIndex, endIndex + 1)));
				beginIndex = endIndex + 1;
			} 
			else
			{
				if (endIndex > isoStr.length() -2)
				{
					res.add(toUtf8(isoStr.substring(beginIndex)));
					break;
				}
				
				//一个utf-8汉字的汉字占用3个字节，所以只需要判断连续的3个位置，便可得到当前位置是否为中文
				//endexIndex -2 当前判断的索引下标-2，正好用最后3个utf-8的char拼为一个汉字
				if (isChinese(getUtf8Char(isoCharArray, endIndex-2)))
				{
					//endexIndex+1 正好能截取字节到索引下标为endexIndex
//					System.out.println("="  + toUtf8(isoStr.substring(beginIndex, endIndex+1)));
					res.add(toUtf8(isoStr.substring(beginIndex, endIndex+1)));
					beginIndex = endIndex+1;
				}
				else if (isChinese(getUtf8Char(isoCharArray, endIndex-3)))
				{
//					System.out.println("=="  + toUtf8(isoStr.substring(beginIndex, endIndex)));
					res.add(toUtf8(isoStr.substring(beginIndex, endIndex)));
					beginIndex = endIndex;
				}
				else if (isChinese(getUtf8Char(isoCharArray, endIndex-1)))
				{
//					System.out.println("==="  + toUtf8(isoStr.substring(beginIndex, endIndex-1)));
					res.add(toUtf8(isoStr.substring(beginIndex, endIndex-1)));
					beginIndex = endIndex-1;
				}
				else
				{
					//如果是英文或数字，则可以直接截取
//					System.out.println("===="  + toUtf8(isoStr.substring(beginIndex, endIndex-1)));
					res.add(toUtf8(isoStr.substring(beginIndex, endIndex-1)));
					beginIndex = endIndex-1;
				}
			}
		}
		
		return res;
	}
	
	/**
	 * 将iso字符转成utf-8字符
	 * @param str
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	private static String toUtf8(String str) throws UnsupportedEncodingException
	{
		return new String(str.getBytes("iso-8859-1"), "utf-8");
	}
	
	/**
	 * 判断是否为英文或数字
	 * @param charaString
	 * @return
	 */
	private static boolean isEnglishNum(String charaString)
	{
		return charaString.matches("^[a-zA-Z0-9]*");
	}
	
	/**
	 * 将iso-8859-1的字符转为utf-8
	 * @param charArray
	 * @param endIndex
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	private static char getUtf8Char(char[] charArray, int endIndex) throws UnsupportedEncodingException {
		char c;
		char[] chineses = new char[3];
		System.arraycopy(charArray, endIndex, chineses, 0, 3);
		String nesStr = new String((new String(chineses)).getBytes("iso-8859-1"), "utf-8");
		c = nesStr.charAt(0);
		return c;
	}
	
	/**
	* 判断字符是否为中文
	* @param c
	* @return
	*/
	public static boolean isChinese(char c)
	{
		Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
		if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
				|| ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
				|| ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
				|| ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
				|| ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
				|| ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS)
		{
			return true;
		}
		return false;
	}
	
}
