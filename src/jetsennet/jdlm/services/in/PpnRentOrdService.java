
package jetsennet.jdlm.services.in;

import java.sql.SQLException;

import javax.jws.WebService;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import jetsennet.jdlm.business.PpnRentOrdBusiness;
import jetsennet.frame.service.BaseService;
import jetsennet.net.WSResult;


@Path(value = "/PpnRentOrdService")
@WebService(name = "/PpnRentOrdService")
public class PpnRentOrdService extends BaseService {
	private PpnRentOrdBusiness PpnRentOrdBusiness;
	
	
	@javax.jws.WebMethod(exclude = true)
	public PpnRentOrdBusiness getPpnRentOrdBusiness() {
		return PpnRentOrdBusiness;
	}


	@javax.jws.WebMethod(exclude = true)
	public void setPpnRentOrdBusiness(PpnRentOrdBusiness ppnRentOrdBusiness) {
		PpnRentOrdBusiness = ppnRentOrdBusiness;
	}
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/addSource")
	public  WSResult addSource(@FormParam("className") String className, @FormParam("saveXml") String xml) throws Exception
	{
			return PpnRentOrdBusiness.addSource(xml);
	}
	
	/**
     * 获取服务信息
	 * @throws SQLException 
     */
	@POST
	@Path(value = "/delSource")
	public  WSResult delSource(@FormParam("className") String className, @FormParam("delXml") String xml) throws Exception
	{
			return PpnRentOrdBusiness.delSource(xml);
	}
	
}
