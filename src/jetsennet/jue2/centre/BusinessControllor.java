package jetsennet.jue2.centre;

import jetsennet.jue2.centre.config.ConfigFactory;
import jetsennet.jue2.centre.config.IBusinessConfigExecutor;
import jetsennet.jue2.centre.driver.IConfigDriver;
import jetsennet.jue2.centre.ognl.IOgnlExecutor;



/**
 * 业务控制器
 * 用于执行特定业务
 * @author 张儒仪
 */
public class BusinessControllor implements IBusinessControllor{
	
	public String execute(String ctlNum, String jsonString) throws Exception {
		//先根据控制资源编号，获取对应的类
		IBusinessConfigExecutor systemConfigExecutor = ConfigFactory.getSystemConfigExecutor();
		//获取配置文件实例
		IConfigDriver<IBusinessClass> config = systemConfigExecutor.getMulitObject(ctlNum, IBusinessClass.class);
		//获取OGNL实例
		IOgnlExecutor ognl = systemConfigExecutor.getSingleObject(IOgnlExecutor.class);
		//获取业务类实例
		IBusinessClass objectInstance = config.getObjectInstance();
		//封装参数
		//IParameterDriver driver = systemConfigExecutor.getSingleObject(IParameterDriver.class);
		//将参数转换为参数
		//driver.jsonToParameter(ParameterType.IN_PARAMETER, NameTactics.EQUALS, jsonString);
		//执行代理后的业务方法
		String result = ognl.executeBusiness(config.getMethodName(), objectInstance, jsonString);
		//将执行结果转换为json字符串，返回给前台
		//String resultJson = result.parameterToJson(ParameterType.OUT_PARAMETER, NameTactics.EQUALS);
		return result;
	}
	
	public static void main(String[] args) throws Exception {
		long time = System.currentTimeMillis();
//		String jsonString = "{CW_PARENTID:0,CW_TYPE:0,CW_NAME:'TestKey',CW_DATA:'TestValue',CW_TABLENAME:'TestTableName',CW_FIELDNAME:'TestFieldName',CW_STATUS:0,CW_DESC:'Test'}";
//		String ctlNum = "CTL20120203110702453";
		//String jsonString = "{CW_ID:5}";
		//String ctlNum = "CTL20120203123953015";
//		String jsonString = "{CW_ID:6,CW_PARENTID:1,CW_TYPE:1,CW_NAME:'TestKey1',CW_DATA:'TestValue1',CW_TABLENAME:'TestTableName1',CW_FIELDNAME:'TestFieldName1',CW_STATUS:1,CW_DESC:'Test1'}";
//		String ctlNum = "CTL20120203124349796";
//		String jsonString = "{CW_ID:6,CW_PARENTID:1,CW_TYPE:1,CW_NAME:'TestKey1',CW_DATA:'TestValue1',CW_TABLENAME:'TestTableName1',CW_FIELDNAME:'TestFieldName1',CW_STATUS:1,CW_DESC:'Test1'}";
//		String ctlNum = "CTL20120203125333734";
		String jsonString = "{CW_ID:6,CW_PARENTID:1,CW_TYPE:1,CW_NAME:'TestKey1',CW_DATA:'TestValue1',CW_TABLENAME:'TestTableName1',CW_FIELDNAME:'TestFieldName1',CW_STATUS:1,CW_DESC:'Test1'}";
		String ctlNum = "CTL20120203130049203";
		String execute = new BusinessControllor().execute(ctlNum, jsonString);
		long time1 = System.currentTimeMillis();
		System.out.println(time1-time);
		System.out.println("result:" + execute);
	}
	
}
