package jetsennet.jue2.centre.ognl;



public interface IOgnlExecutor {
	
	public Object execute(String method,Object targetInstance,Object[] argsValue,Class<?>...argsType) throws Exception;

	public Object execute(String ognlString,Object[] argsValue,Class<?>...argsType) throws Exception;
	
	public String executeBusiness(String method, Object targetInstance,String driver) throws Exception;
}
