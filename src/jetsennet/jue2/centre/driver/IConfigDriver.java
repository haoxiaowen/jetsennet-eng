package jetsennet.jue2.centre.driver;


@SuppressWarnings("unchecked")
public interface IConfigDriver<T> extends IDriverType{
	
	public boolean getObjectPoolStatus();
	
	public void setObjectStatus(boolean useObjectPool);
	
	public void setObjectClassPath(String path);
	
	public void setMethodName(String methodName);
	
	public T getObjectInstance() throws Exception;
	
	public String getMethodName();
	
	public Class[] getMethodArgsType();
	
	public void setMethodArgsType(Class[] methodArgsType);
}
