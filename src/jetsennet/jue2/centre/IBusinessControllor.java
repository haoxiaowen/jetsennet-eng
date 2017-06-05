package jetsennet.jue2.centre;

/**
 * 业务控制器接口
 * @author 张儒仪
 *
 */
public interface IBusinessControllor {
	/**
	 * 根据控制资源编号执行一个业务方法
	 * @param ctlNum 控制资源编号
	 * @param jsonString 标准的json字符串
	 * @return 业务方法的执行结果
	 */
	public String execute(String ctlNum,String jsonString) throws Exception;
}
