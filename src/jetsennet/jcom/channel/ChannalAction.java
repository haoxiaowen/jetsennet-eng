package jetsennet.jcom.channel;

import java.sql.SQLException;

import javax.jws.WebService;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import jetsennet.frame.service.BaseService;
import jetsennet.net.WSResult;

@Path(value = "/ChnanalService")
@WebService(name = "/ChnanalService")
public class ChannalAction extends BaseService {
	private ChannalBusiness channalBusiness;

	@javax.jws.WebMethod(exclude = true)
	public ChannalBusiness getChannalBusiness() {
		return channalBusiness;
	}

	@javax.jws.WebMethod(exclude = true)
	public void setChannalBusiness(ChannalBusiness channalBusiness) {
		this.channalBusiness = channalBusiness;
	}

	// 保存频道
	@POST
	@Path(value = "/saveSchs2Objs")
	public WSResult saveSchs2Objs(@FormParam("saveXml") String xml)
			throws Exception {
		WSResult retObj = new WSResult();
		retObj = channalBusiness.saveSchs2Objs(xml, retObj);
		return retObj;
	}

	// 保存栏目
	@POST
	@Path(value = "/saveCOL")
	public WSResult saveCOL(@FormParam("saveXml") String xml) throws Exception {
		WSResult retObj = new WSResult();
	   retObj = channalBusiness.saveCOL(xml, retObj);
       return retObj;
	}

	// 删除栏目信息
	@POST
	@Path(value = "/removecol")
	public WSResult removecol(String ids) throws Exception {

		WSResult retObj = new WSResult();
		try {
			channalBusiness.removecol(ids);

		} catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;
	}

	// 删除频道信息
	@POST
	@Path(value = "/removechan")
	public WSResult removechan(String ids) throws Exception {

		WSResult retObj = new WSResult();
		try {
			channalBusiness.removechan(ids);
			retObj.setErrorCode(0);
		} catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;
	}

	// 保存时长
	@POST
	@Path(value = "/saveCOLlength")
	public WSResult saveCOLlength(@FormParam("saveXml") String xml)
			throws Exception {
		WSResult retObj = new WSResult();
		try {

			retObj = channalBusiness.saveCOLlength(xml, retObj);

		} catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;
	}

	// 保存播出计划
	@POST
	@Path(value = "/saveCOLplan")
	public WSResult saveCOLplan(@FormParam("saveXml") String xml)
			throws Exception {
		WSResult retObj = new WSResult();
		try {

			retObj = channalBusiness.saveCOLplan(xml, retObj);

		} catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;
	}

	// 保存成品文件
	@POST
	@Path(value = "/savefile")
	public WSResult savefile(@FormParam("saveXml") String xml,@FormParam("group_id") String groupid) throws Exception {
		WSResult retObj = new WSResult();
		try {
             retObj = channalBusiness.savefile(xml,groupid,retObj);
       } catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;
	}

	@POST
	@Path(value = "/removefile")
	public WSResult removefile(String ids) {
		WSResult retObj = new WSResult();

		try {
			channalBusiness.removeflie(ids);
			retObj.setErrorCode(0);
		} catch (Exception e) {
			retObj.setErrorCode(1);
		}
		return retObj;

	}

	// 修改保存素材编目
	@POST
	@Path(value = "/savecate")
	public WSResult savecate(@FormParam("saveXml") String xml) {

		WSResult retObj = new WSResult();
		try {
          retObj = channalBusiness.savecate(xml, retObj);
         } catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;

	}


//查询选中的成品文件是否是同一任务
@POST
@Path(value="/selecttask")
public WSResult selecttask(String ids) throws SQLException{
	WSResult retObj = new WSResult();
	retObj = channalBusiness.selecttask(ids, retObj);
	return retObj;
}


//删除编目信息
	@POST
	@Path(value = "/removecata")
	public WSResult removecata(String ids) throws Exception {
       WSResult retObj = new WSResult();
		try {
			channalBusiness.removecata(ids);
			retObj.setErrorCode(0);
		} catch (Exception e) {
			retObj.setErrorCode(1);
		}

		return retObj;
	}
	@POST
	@Path(value = "/savefileAndcata")
public WSResult savefileAndcata(String xml)throws Exception{
	   WSResult retObj = new WSResult();
	   retObj = channalBusiness.savefileAndcata(xml, retObj);
	   return retObj;
}
           //修改保存节目编目savepgmcate
	    @POST
		@Path(value = "/savepgmcate")
		public WSResult savepgmcate(@FormParam("saveXml") String xml) {

			WSResult retObj = new WSResult();
			try {
	          retObj = channalBusiness.savepgmcate(xml, retObj);
	         } catch (Exception e) {
				retObj.setErrorCode(1);
			}

			return retObj;

		}
	    //删除节目编目
	    @POST
		@Path(value = "/removepgmcata")
		public WSResult removepgmcata(String ids) {
			WSResult retObj = new WSResult();

			try {
				channalBusiness.removepgmcata(ids);
				retObj.setErrorCode(0);
			} catch (Exception e) {
				retObj.setErrorCode(1);
			}
			return retObj;

		}
	    
	    //统计
	    @POST
		@Path(value = "/selectTj")
		public WSResult  selectTj(@FormParam("GROUP_TYPE") String group_type,@FormParam("txtStartDate") String txtStartDate,@FormParam("txtEndDate") String txtEndDate) throws Exception {
	    	WSResult retObj =new WSResult() ;
	    	 retObj = channalBusiness.getselectTj(group_type,txtStartDate,txtEndDate,retObj);
	        return retObj;

		}
	    //统计
	    @POST
		@Path(value = "/selectTjSource")
		public WSResult  selectTjSource(@FormParam("GROUP_TYPE") String group_type,@FormParam("txtStartDate") String txtStartDate,@FormParam("txtEndDate") String txtEndDate) throws Exception {
	    	WSResult retObj =new WSResult() ;
	    	 retObj = channalBusiness.selectTjSource(group_type,txtStartDate,txtEndDate,retObj);
	        return retObj;

		}
}