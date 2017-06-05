package jetsennet.jue2.util;

import java.util.regex.Pattern;

public class PgmHelper {
	
	public static final String hms = "[0-9][0-9]:[0-5][0-9]:[0-5][0-9]";
	public static final String hmsf = "[0-9][0-9]:[0-5][0-9]:[0-5][0-9]:[0-2][0-4]";
	public static final String pgmDelimeter = ":";
	
	
	
	public static long getDurationFrame(String durationStr){
		long ret = -1;
		if(Pattern.matches(hms, durationStr)){
			long l = 0;
			String[] ars = durationStr.split(pgmDelimeter);
			l += Integer.parseInt(ars[2]) * 25;
			l += Integer.parseInt(ars[1]) * 25 * 60;
			l += Integer.parseInt(ars[0]) * 25 * 60 * 60;
			ret = l;
		}
		else if(Pattern.matches(hmsf, durationStr)){
			long l = 0;
			String[] ars = durationStr.split(pgmDelimeter);
			l += Integer.parseInt(ars[3]);
			l += Integer.parseInt(ars[2]) * 25;
			l += Integer.parseInt(ars[1]) * 25 * 60;
			l += Integer.parseInt(ars[0]) * 25 * 60 * 60;
			ret = l;
		}
		else{
			throw new RuntimeException("unkown duration string pattern..");
		}
		return ret;
	}
	
	

	/**
	 * 从"时：分：秒"格式的时长转换为帧数
	 * 
	 * @param hms  必须符合[0-9][0-9]:[0-5][0-9]:[0-5][0-9]
	 * @return
	 */
	public static long getFrameSumFromHMS(String hms){
		boolean b = Pattern.matches(hms,hms);
		if(!b){
			throw new IllegalArgumentException("不符合时分秒时长格式:" + hms);
		}
		String[] s = hms.split(":");
		int hour = Integer.parseInt(s[0]);
		int minute = Integer.parseInt(s[1]);
		int second = Integer.parseInt(s[2]);
		
		int seconds = hour*60*60 + minute*60 + second;
		return seconds*25;
	}
	
	
	
	
	/**
	 * 从"时:分:秒:帧"格式的时长转换为帧数
	 * 
	 * @param hms  必须符合[0-9][0-9]:[0-5][0-9]:[0-5][0-9]:[0-2][0-9]
	 * @return
	 */
	public static int getFrameSumFromHMSF(String hms){
		boolean b = Pattern.matches(hmsf,hms);
		if(!b){
			throw new IllegalArgumentException("不符合时分秒时长格式:" + hmsf);
		}
		String[] s = hms.split(":");
		int hour = Integer.parseInt(s[0]);
		int minute = Integer.parseInt(s[1]);
		int second = Integer.parseInt(s[2]);
		int frame = Integer.parseInt(s[3]);
		
		int seconds = hour*60*60 + minute*60 + second;
		return seconds*25 + frame;
	}
	
	
	
	public static String formatHMSF(String duration){
		String ret = null;
		boolean b = Pattern.matches(hmsf,duration);
		if(!b){
			b = Pattern.matches(hms,duration);
			if(b){
				ret = duration + ":00";
			}
		}
		if(ret == null){
			throw new RuntimeException("unkown duration format");
		}
		return ret;
	}
	
	
	
	public static String getDurationHMS(long duration) {
//		i
		long h = duration / (25 * 60 * 60);
		duration =  duration % (25 * 60*60);
		long m = duration / (25 * 60);
		duration = duration %(25 * 60);
		long s = duration / 25;
		String hStr = ""+h;
		if(hStr.length() == 1){
			hStr = "0" + hStr;
		}
		String mStr = ""+m;
		if(mStr.length() == 1){
			mStr = "0" + mStr;
		}
		String sStr = ""+s;
		if(sStr.length() == 1){
			sStr = "0" + sStr;
		}
		String ret = hStr + pgmDelimeter + mStr + pgmDelimeter + sStr;
		return ret;
	}

	
	public static String getDurationHMSF(long duration) {
		long h = duration / (25 * 60 * 60);
		duration =  duration % (25 * 60*60);
		long m = duration / (25 * 60);
		duration = duration %(25 * 60);
		long s = duration / 25;
		long f = duration % 25;
		String hStr = ""+h;
		if(hStr.length() == 1){
			hStr = "0" + hStr;
		}
		String mStr = ""+m;
		if(mStr.length() == 1){
			mStr = "0" + mStr;
		}
		String sStr = ""+s;
		if(sStr.length() == 1){
			sStr = "0" + sStr;
		}
		String fStr = ""+f;
		if(fStr.length() == 1){
			fStr = "0" + fStr;
		}
		String ret = hStr + pgmDelimeter + mStr + pgmDelimeter + sStr + pgmDelimeter + fStr;
		return ret;
	}

	
	
	public static int frames_persecond = 25;
	public static long one_hour_frames = 60*60*frames_persecond;
	
	public static void main(String[] args){
		
//		System.out.println(Pattern.matches(""));
		
		System.out.println(getDurationFrame("00:00:10"));
		System.out.println(getDurationFrame("01:00:25:00"));
		
		System.out.println(getDurationHMSF(90625));
	}
}
