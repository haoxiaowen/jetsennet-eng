package jetsennet.jue2.util;

public class CommonResponseStatus {
	
	public static final int ok = 0;
	public static final int already_existed = 1;
	public static final int not_match = 2;
	public static final int not_exist = 3;
	public static final int parse_error = 4;
	public static final int lack_info = 10;
	public static final int other_error = 50;
	public static final int delay_ok = 100;
	
	public static String getCommonResponseStatusCode(int status){
		String ret = null;
		switch (status) {
//		case 0:
//			ret = "000";
//			break;
		case 1:
			ret = "001";
			break;
		case 2:
			ret = "002";
			break;
		case 3:
			ret = "003";
			break;
		case 4:
			ret = "004";
			break;
		case 10:
			ret = "010";
			break;
		case 50:
			ret = "050";
			break;
		case 100:
			ret = "100";
			break;
		default:
			ret = "000";
			break;
		}
		return ret;
	}
	
	
	public static String getCommonResponseStatusDesc(int status){
		String ret = null;
		switch (status) {
//		case 0:
//			ret = "000";
//			break;
		case 1:
			ret = "任务号已存在，拒绝接收";//用于任务接收。任务重复下发，拒绝接收任务
			break;
		case 2:
			ret = "任务类型不匹配（或不存在），拒绝接收";//用于任务接收、任务变更。
			break;
		case 3:
			ret = "任务号不存在，无法处理";
			break;
		case 4:
			ret = "业务对象实体无法解析";
			break;
		case 10:
			ret = "任务信息不完整，拒绝接收";
			break;
		case 50:
			ret = "其它错误";
			break;
		case 100:
			ret = "任务成功接收";//由于处理任务需要时间，所以再及时返回消息时，成功接受时返回该CODE
			break;
		default:
			ret = "任务指令已成功处理";
			break;
		}
		return ret;
	}

}
