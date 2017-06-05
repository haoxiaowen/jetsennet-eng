package jetsennet.jue2.centre.config;

import jetsennet.jue2.centre.driver.IConfigDriver;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;


/**
 * 配置文件相关的工具类
 * @author 张儒仪 2011-12-5
 */
@SuppressWarnings("unchecked")
public class ConfigExecutorImpls implements IBusinessConfigExecutor{
	/**
	 * 系统配置文件实例
	 */
	private static Document systemDoc = null;
	
	/**
	 * 静态块中，初始化时加在系统配置文件
	 */
	static{
		try {
			SAXReader reader = new SAXReader();
			String systemFilePath = getConfigFilePath("business-mapping.xml");
			systemDoc = reader.read(systemFilePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * <p>获取ClassPath下的配置文件路径的方法</p>
	 * @param fileName CLASSPATH下的配置文件名称
	 * @return 配置文件路径
	 * @throws Exception 配置文件不存在
	 */
	public static String getConfigFilePath(String fileName) throws Exception {
		String path = null;
		try {
			path = Thread.currentThread().getContextClassLoader().getResource(
					fileName).toString();
		} catch (Exception e) {
			throw new Exception("ClassPath下无配置文件");
		}
		return path;
	}

	/**
	 * <p>根据接口的类路径及其配置项获取该接口对应的唯一实例</p>
	 * @param <T> 要返回的接口类型
	 * @param clazz 接口的CLASS
	 * @return 接口对应的唯一实例
	 */
	public <T> T getSingleObject(Class<T> clazz) throws Exception {
		T result = null;
		if(systemDoc == null){
			throw new Exception("配置文件错误");
		}
		try {
			String classPath = clazz.getName();
			//查找对应的配置项
			Node singleNode = systemDoc
					.selectSingleNode("/config/single-config/single-item[@id='"
							+ classPath + "']");
			if (singleNode != null) {
				//如果找到了该节点，获取要获取实例的类路径
				//在通过反射的方式创建该对象
				Element ele = (Element) singleNode;
				Attribute pathAttr = ele.attribute("path");
				String path = pathAttr.getText().trim();
				try {
					Class<?> instanceClass = Class.forName(path);
					Object instance = instanceClass.newInstance();
					result = (T) instance;
				} catch (Exception e) {
					e.printStackTrace();
					throw new Exception("实例化对象错误");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}


	/**
	 * 根据控制编号获取多实例中对应的实例(对外使用)
	 * 
	 * @param controlNumber
	 *            控制资源编号
	 * @return 多实例对象及其方法名
	 */
	public <T> IConfigDriver<T> getMulitObject(String controlNumber,Class<?> interfaceClass) {
		IConfigDriver result = null;
		try {
			result = this.getSingleObject(IConfigDriver.class);
			String xpath = null;
			if(interfaceClass == null){
				xpath = "/config/mulit-config/mulit-item[@id='"
					+ controlNumber + "']";
			} else {
				xpath = "/config/mulit-config/mulit-item[@id='"
					+ controlNumber + "' and @interface='"+ interfaceClass.getName() +"']";
			}
			Node singleNode = systemDoc.selectSingleNode(xpath);
			if (singleNode != null) {
				Element ele = (Element) singleNode;
				//类路径
				Attribute pathAttr = ele.attribute("path");
				//方法名
				Attribute methodAttr = ele.attribute("method");
				//是否启用对象池
				Attribute poolAttr = ele.attribute("object_pool");
				boolean fromObject = false;
				//判断是否从对象池中获取对象
				if(poolAttr!=null){
					String fromObjectString = poolAttr.getText().trim();
					if("true".equals(fromObjectString)){
						fromObject = true;
					}
				}
				String path = pathAttr.getText().trim();
				String methodName = methodAttr.getText().trim();
				//设置类路径
				result.setObjectClassPath(path);
				//设置方法名
				result.setMethodName(methodName);
				//设置对象池状态
				result.setObjectStatus(fromObject);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 获取指定的转换器实例
	 * 
	 * @param source  源对象路径
	 * @param target  目标对象路径
	 * @return 获取转换器的实例
	 * @throws Exception 
	 *//*
	public <T> IConfigDriver<T> getConverterObject(String source, String target) throws Exception {
		IConfigDriver result = null;
		//表示是否根据目标取值
		boolean isTarget = true;
		StringBuffer xpath = new StringBuffer(
				"/config/converter-config/converter-item[@source='")
			.append(source).append("' and @target='")
			.append(target).append("']");
		Node node = systemDoc.selectSingleNode(xpath.toString());
		if (node == null) {
			isTarget = false;
			xpath = new StringBuffer("/config/converter-config/converter-item[@source='")
						.append(target).append("' and @target='")
						.append(source).append("']");
				node= systemDoc.selectSingleNode(xpath.toString());
		}
		if(node != null){
			Element ele = (Element) node;
			String classPath = null;
			Attribute pathAttr = ele.attribute("path");
			if(pathAttr != null){
				classPath = pathAttr.getText().trim();
			}
			//获取驱动实例
			try {
				result = this.getSingleObject(IConfigDriver.class);
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}
			if(classPath!=null && !"".equals(classPath)){
				result.setObjectClassPath(classPath);
				//确定使用的方法
				String methodName = null;
				if(isTarget){
					methodName = "convertToTarget";
				} else {
					methodName = "convertToSource";
				}
				result.setMethodName(methodName);
			}
		}
		return result;
	}

	*//**
	 * 对象池暂不实现
	 *//*
	public <T> IConfigDriver<T> getObjectPool(Class<T> clazz) throws Exception {
		return null;
	}*/
}
