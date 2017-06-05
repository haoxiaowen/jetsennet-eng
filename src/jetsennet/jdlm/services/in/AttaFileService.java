/* 
 * Copyright (c) 北京捷成世纪科技股份有限公司. All Rights Reserved.
 * 文件：jetsennet.jdvn.service.MessageServices.java
 * 日 期：2014-2-14 下午3:33:50
 * 作 者：蒋勇
 */
package jetsennet.jdlm.services.in;

import java.sql.SQLException;

import javax.jws.WebService;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import jetsennet.frame.service.BaseService;
import jetsennet.jdlm.business.AttaFileBusiness;
import jetsennet.net.WSResult;

@Path(value = "/AttaFileService")
@WebService(name = "/AttaFileService")
public class AttaFileService extends BaseService {
	// PPNSystemService
	private AttaFileBusiness AttaFileBusiness;

	@javax.jws.WebMethod(exclude = true)
	public AttaFileBusiness getAttaFileBusiness() {
		return AttaFileBusiness;
	}

	@javax.jws.WebMethod(exclude = true)
	public void setAttaFileBusiness(AttaFileBusiness AttaFileBusiness) {
		this.AttaFileBusiness = AttaFileBusiness;
	}

	/**
	 * 获取服务信息 接口
	 * 
	 * @throws SQLException
	 */
	@POST
	@Path(value = "/insertObjecs")
	public WSResult insertObjecs(@FormParam("addXml") String addxml,
			@FormParam("code") String code, @FormParam("attaType") int type,
			@FormParam("filestyle") int codestyle) {
		try {
			return getResult(String.valueOf(AttaFileBusiness.insertObjecsPpn(
					addxml, code, type, codestyle)));
		} catch (SQLException e) {
			e.printStackTrace();
			return getResult("-1");
		}
	}

	/**
	 * 获取服务信息 接口
	 * 
	 * @throws SQLException
	 */
	@POST
	@Path(value = "/update")
	public WSResult update(@FormParam("updateXml") String updateXml,
			@FormParam("attaType") int type,
			@FormParam("filestyle") int codestyle) {
		try {
			return getResult(String.valueOf(AttaFileBusiness.update(updateXml,
					type, codestyle)));
		} catch (SQLException e) {
			e.printStackTrace();
			return getResult("-1");
		}
	}

	/**
	 * 获取服务信息 接口
	 * 
	 * @throws SQLException
	 */
	@POST
	@Path(value = "/delete")
	public WSResult delete(@FormParam("ids") String ids,
			@FormParam("filestyle") int codestyle) {
		try {
			return getResult(String.valueOf(AttaFileBusiness.delete(ids,
					codestyle)));
		} catch (SQLException e) {
			e.printStackTrace();
			return getResult("-1");
		}
	}
	
	/**
	 * 获取服务信息 接口
	 * 
	 * @throws SQLException
	 */
	@POST
	@Path(value = "/insertDevMaints")
	public WSResult insertDevMaints(@FormParam("saveXml") String xml, @FormParam("ids") String ids
			) {
		
		try {
			return getResult(String.valueOf(AttaFileBusiness.insertDevMaints(xml,
					ids)));
		} catch (SQLException e) {
			e.printStackTrace();
			return getResult("-1");
		}
	}
	
	/**
	 * 获取服务信息 接口
	 * 
	 * @throws SQLException
	 */
	@POST
	@Path(value = "/updateDev")
	public WSResult updateDev(@FormParam("updateXml") String xml,@FormParam("ids") String ids
			) {
		
		try {
			return getResult(String.valueOf(AttaFileBusiness.updateDev(xml,ids)));
		} catch (SQLException e) {
			e.printStackTrace();
			return getResult("-1");
		}
	}
}
