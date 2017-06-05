/**
 * 
 */
package jetsennet.jue2.util;

import java.util.List;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jue2.beans.PpnPgmProgram;
import jetsennet.jue2.beans.PpnTask;

import org.apache.log4j.Logger;

/**
 * 工作流服务业务通用功能类
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2014-4-11       zw          创建<br/>
 */
public class WfmUtil {
	
	private static Logger logger = Logger.getLogger(WfmUtil.class);
	
	/**
	 * 通过节目获得对应的任务
	 * @param pgm
	 * @param dao
	 * @return
	 * @throws Exception
	 */
	public static PpnTask getPpnTaskByPgm(PpnPgmProgram pgm, IDao dao) throws Exception
	{
		PpnTask task = null;
		try
		{
			List<PpnTask> ppnTasks = dao.queryBusinessObjs(PpnTask.class, String.format("SELECT * FROM PPN_TASK t WHERE t.PGM_ID = '%s'", pgm.getPgmId()));
			if (ppnTasks == null || ppnTasks.isEmpty())
			{
				throw new Exception(String.format("没找到[%s]对应的任务信息", pgm.getPgmCode()));
			}
			task = ppnTasks.get(0);
		} catch (Exception e)
		{
			logger.error(e.getMessage());
			throw e;
		}
		return task;
	}

}
