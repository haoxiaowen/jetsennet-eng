package jetsennet.jue2.centre.ognl.impls;

import java.lang.reflect.Method;

import jetsennet.jue2.centre.ognl.IOgnlExecutor;


/**
 * IOgnlExecutor的实现类
 * @author 张儒仪
 */

@SuppressWarnings("unchecked")
public class OgnlExecutorImpls implements IOgnlExecutor {

	public Object execute(String method, Object targetInstance,
			Object[] argsValue, Class<?>... argsType) throws Exception {
		Object result = null;
		if(targetInstance != null && method!=null && !"".equals(method)){
			try {
				Method invokeMethod = targetInstance.getClass().getMethod(method, argsType);
				result = invokeMethod.invoke(targetInstance, argsValue);
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}
		} else {
			throw new Exception("参数错误");
		}
		return result;
	}

	public Object execute(String ognlString, Object[] argsValue,
			Class<?>... argsType) throws Exception {
		Object result = null;
		if(ognlString!=null && !"".equals(ognlString)){
			String objectName = ognlString.substring(0,ognlString.lastIndexOf("."));
			String methodName = ognlString.substring(ognlString.lastIndexOf(".")+1);
			Class instanceClass = null;
			Method method = null;
			try {
				instanceClass = Class.forName(objectName);
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}
			Object instance = null;
			
			if(methodName.charAt(0)=='@'){
				if(methodName.charAt(1)=='@'){
					//如果是静态方法
					methodName = methodName.substring(2);
				} else {
					methodName = methodName.substring(1);
					try {
						instance = instanceClass.newInstance();
					} catch (Exception e) {
						e.printStackTrace();
						throw e;
					}
				}
				try {
					method = instanceClass.getMethod(methodName, argsType);
					result = method.invoke(instance, argsValue);
				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				}
			} else {
				throw new Exception("OGNL字符串解析错误");
			}
		}
		return result;
	}

	public String executeBusiness(String method, Object targetInstance, String driver) throws Exception {
		if(targetInstance != null && method!=null && !"".equals(method)){
			try {
				//获取方法实例
				Method invokeMethod = targetInstance.getClass().getMethod(method, String.class);
				driver = (String) invokeMethod.invoke(targetInstance,driver);
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			} catch (Throwable error){
				error.printStackTrace();
				throw new Exception("执行方法时发生错误");
			}
		} else {
			throw new Exception("参数错误");
		}
		return driver;
	}
}
