package jetsennet.jue2.centre.config;

import jetsennet.jue2.centre.driver.IConfigDriver;


/**
 * 业务配置文件的相关操作接口
 * @author 张儒仪
 */
public interface IBusinessConfigExecutor {
	
	/**
	 * <p>根据接口的路径及其配置项获取该接口对应的唯一实例</p>
	 * @param <T> 要返回的接口类型
	 * @param clazz 接口的CLASS
	 * @return 接口对应的唯一实例
	 */
	public <T> T getSingleObject(Class<T> clazz) throws Exception;
	
	/**
	 * 获取指定的转换器实例
	 * @param <T>实例类型
	 * @param source 源对象路径
	 * @param target 目标对象路径
	 * @return 转换器实例信息
	 * @throws Exception
	 */
	//public <T> IConfigDriver<T> getConverterObject(String source, String target) throws Exception;
	
	/**
	 * 根据控制编号获取多实例中对应的实例
	 * @param <T>实例类型
	 * @param controlNumber 控制资源编号
	 * @param interfaceClass 所属接口
	 * @return 多实例对象及其方法名
	 */
	public <T> IConfigDriver<T> getMulitObject(String controlNumber,Class<?> interfaceClass)  throws Exception;
	
	/**
	 * 根据对象获取对象池实例
	 * @param <T>实例类型
	 * @param 要获取的对象
	 * @return 获取后的对象
	 * @throws Exception
	 */
	//public <T> IConfigDriver<T> getObjectPool(Class<T> clazz) throws Exception;
}
