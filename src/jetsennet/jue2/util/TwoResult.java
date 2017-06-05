/**
 * 
 */
package jetsennet.jue2.util;

/**
 * 二元返回结果通用类
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2014-5-18       zw          创建<br/>
 */
public class TwoResult<A, B>
{
	public final A frist;
	public final B second;
	
	public TwoResult(A a,B b)
	{
		frist = a;
		second = b;
	}
}
