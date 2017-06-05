package jetsennet.jue2.centre.config;

/**
 * 配置工厂
 * @author 张儒仪
 */
public class ConfigFactory {
	/**
	 * 获取系统配置执行器
	 * @return
	 */
	public static IBusinessConfigExecutor getSystemConfigExecutor() throws Exception{
		IBusinessConfigExecutor result = null;
		try {
			result = new ConfigExecutorImpls();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return result;
	}
}
