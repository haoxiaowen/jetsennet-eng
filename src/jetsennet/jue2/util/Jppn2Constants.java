package jetsennet.jue2.util;



public class Jppn2Constants {
	
	/**
	 * EMB查询模式，详细
	 */
	public static Integer emb_querymode_detail;
	/**
	 * EMB查询模式，任务
	 */
	public static Integer emb_querymode_task;
	
	
	public static String sys_ok_code = "0";
	public static String jetsen_actor_code = "JetsenActor";
	
	
	public static int mtfileexec_exec_type_src = 1;
	public static int mtfileexec_exec_type_dest = 2;
	
	
	
	
	public static String emb_sys_id = "EF02";
	public static String ppm_sys_code = "EM12";
	public static String sys_code_studiogw = "EP30";
	
	
	
	
	
	

	
	
	
	
	/*
	 * 
	 * 	0-	高清视频
		1-	标清视频
		2-	低码流视频
		3-	高清视音频
		4-	标清视音频
		5-	低码流视音频
		6-	音频
		7-	字幕文件
		8-	附件类型
	 * */
	
	
	public static final int mamtype_video_hd = 0;
	public static final int mamtype_video_sd = 1;
	public static final int mamtype_video_lb = 2;
	public static final int mamtype_av_hd = 3;
	public static final int mamtype_av_sd = 4;
	public static final int mamtype_av_lb = 5;
	public static final int mamtype_audio = 6;
	public static final int mamtype_subtitle = 7;
	public static final int mamtype_attachment = 8;
	public static final int mamtype_directory = 1000;
	
	
	public static final int ftp = 0;//0、	FTP路径
	public static final int unc = 1;//1、	UNC文件共享路
	

	
	/**
	 * 系统编号,
	 * //TODO 将由数据库保存。
	 */
	public static final String sys_code_ba1 = "EB02";
	
	/**
	 * twork与文件的关系类型
	 */
	public static final int TWKFILE_TYPE_CLIP = 1;
	public static final int TWKFILE_TYPE_PRODUCT = 2;
	
	
	
	public static final String sys_code_censor = "EP04";
	public static final String success_returnerror = "1";
	
	public static final Integer twork_status_complete = 0;
	public static final Integer twork_status_fail = 9;
	public static final String sys_code_trm = "EM13";
	public static final String syscode_censor = "EP04";
	public static final String sys_code_mam = "ES01";
	

}
