package jetsennet.jue2.services.in;

import javax.jws.WebService;

@WebService(name = "/TestResService", targetNamespace = "http://JetsenNet/JPPN/")
public class TestResService
{	
	public String callBack(String para)
	{
		System.out.println("========================================");
		System.out.println(para);
		System.out.println("========================================");
		return "OK";
	}
	
}
