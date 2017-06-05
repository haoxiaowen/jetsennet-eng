package jetsennet.jue2.centre.driver.impls;

import jetsennet.jue2.centre.driver.IConfigDriver;


/**
 * IConfigDriver 驱动类实现
 * @author 张儒仪
 *
 */
@SuppressWarnings("unchecked")
public class ConfigDriverImpls<T> implements IConfigDriver<T>{
	/**
	 * 对象类路径
	 */
	private String objectClassPath;
	
	/**
	 * 对象池状态，作为保留
	 */
	private boolean objectPoolStatus;
	
	/**
	 * 对象实例
	 */
	private T objectInstance;
	
	/**
	 * 要执行的方法名
	 */
	private String methodName;
	
	/**
	 * 方法参数类型列表
	 */
	private Class[] methodArgsType;
	
	/**
	 * 获取方法名
	 */
	public String getMethodName() {
		return methodName;
	}
	
	/**
	 * 设置方法名
	 */
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	
	/**
	 * 获取方法参数类型
	 */
	public Class[] getMethodArgsType() {
		return methodArgsType;
	}
	
	/**
	 * 设置方法参数类型
	 */
	public void setMethodArgsType(Class[] methodArgsType) {
		this.methodArgsType = methodArgsType;
	}
	
	
	/**
	 * 获取对象实例
	 */
	public T getObjectInstance() throws Exception{
		if(this.objectInstance == null){
			if("".equals(this.objectClassPath)){
				throw new Exception("对象路径[objectInstance]为空");
			} else {
				//反射获得对象实例
				try {
					Class<?> instanceClass = Class.forName(this.objectClassPath);
					Object instance = instanceClass.newInstance();
					this.objectInstance = (T) instance;
				} catch (Exception e) {
					e.printStackTrace();
					throw new Exception("反射创建实例失败");
				}
			}
		}
		return this.objectInstance;
	}

	/**
	 * 设置类路径
	 * @param objectPath
	 */
	public void setObjectClassPath(String path) {
		this.objectClassPath = path;
		
	}
	
	/**
	 * 获取类路径
	 * @return
	 */
	public String getObjectClassPath() {
		return objectClassPath;
	}

	public boolean getObjectPoolStatus() {
		return this.objectPoolStatus;
	}

	public void setObjectStatus(boolean useObjectPool) {
		this.objectPoolStatus = useObjectPool;
	}

}
