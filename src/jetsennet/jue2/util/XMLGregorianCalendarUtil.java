package jetsennet.jue2.util;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

/**
 * 
 * @author 吴东兴
 *
 */
public class XMLGregorianCalendarUtil {

	/**
	 * 返回当前日期的XMLGregorianCalendar类型
	 * @return
	 */
	static public XMLGregorianCalendar getDate(){
		return getDate(Calendar.getInstance());
	}
	
	/**
	 * 用指定的日期类型获得XMLGregorianCalendar类型
	 * @param calendar
	 * @return
	 */
	static public XMLGregorianCalendar getDate(Calendar calendar){
		XMLGregorianCalendar xgc = null;
		try {
			DatatypeFactory newInstance = DatatypeFactory.newInstance();
			xgc = newInstance.newXMLGregorianCalendar();
		} catch (DatatypeConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
		xgc.setYear(calendar.get(Calendar.YEAR));
		xgc.setMonth(calendar.get(Calendar.MONTH) +1);
		xgc.setDay(calendar.get(Calendar.DAY_OF_MONTH));	
		return xgc;
	}
	
	/**
	 * 用指定格式 format 来转化日期字符串为XMLGregorianCalendar类型
	 * @param str 转化的日期字符串
	 * @param format 转化格式
	 * @return
	 */
	static public XMLGregorianCalendar getDate(String str,String format){
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar calendar = Calendar.getInstance();
		try {
			calendar.setTime(sdf.parse(str));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return getDate(calendar);
	}
	
	
	/**
	 * 用格式 yyyy-MM-dd 的日期字符串获得XMLGregorianCalendar类型
	 * @param str
	 * @return
	 */
	static public XMLGregorianCalendar getDate(String str){
		return getDate(str,"yyyy-MM-dd");
	}
	
	/**
	 * 用指定格式将XMLGregorianCalendar类型转换为字符串类型
	 * @param date
	 * @param format
	 * @return
	 */
	public static String XMLGregorianCalendarDate2Str(XMLGregorianCalendar date,String format){
		GregorianCalendar ca = date.toGregorianCalendar();
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		return formatter.format(ca.getTime());
	}
	
	/**
	 * 用格式"yyyy-MM-dd"将XMLGregorianCalendar类型日期转换为字符串类型
	 * @param date
	 * @param format
	 * @return
	 */
	public static String XMLGregorianCalendarDate2Str(XMLGregorianCalendar date){
		return XMLGregorianCalendarDate2Str(date,"yyyy-MM-dd");
	}
	
	
	
	/**
	 * 获得当前时间的XMLGregorianCalendar类型
	 * @return
	 */
	static public XMLGregorianCalendar getTime(){
		XMLGregorianCalendar xgc = null;
		try {
			xgc = DatatypeFactory.newInstance().newXMLGregorianCalendar();
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		xgc.setHour(calendar.get(Calendar.HOUR_OF_DAY));
		xgc.setMinute(calendar.get(Calendar.MINUTE));
		xgc.setSecond(calendar.get(Calendar.SECOND));		
		return xgc;
	}
	
	/**
	 * 用给定的时间类型来获取XMLGregorianCalendar类型
	 * @return
	 */
	static public XMLGregorianCalendar getTime(Calendar calendar){
		XMLGregorianCalendar xgc = null;
		try {
			xgc = DatatypeFactory.newInstance().newXMLGregorianCalendar();
		} catch (Exception e) {
			e.printStackTrace();
		}
		xgc.setHour(calendar.get(Calendar.HOUR_OF_DAY));
		xgc.setMinute(calendar.get(Calendar.MINUTE));
		xgc.setSecond(calendar.get(Calendar.SECOND));		
		return xgc;
	}
	
	
	
	
	/**
	 * 用指定格式将时间字符串转化为XMLGregorianCalendar类型
	 * @param str
	 * @return
	 */
	static public XMLGregorianCalendar getTime(String str,String format){
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar calendar = Calendar.getInstance();
		try {
			calendar.setTime(sdf.parse(str));
		} 
		catch(Exception e){
			e.printStackTrace();
		}	
		return getTime(calendar);
	}
	
	/**
	 * 用格式"HH:mm:ss"将时间字符串转化为XMLGregorianCalendar类型
	 * @param str
	 * @return
	 */
	static public XMLGregorianCalendar getTime(String str){
		return getTime(str,"HH:mm:ss");
	}
	
	/**
	 * 用指定格式将XMLGregorianCalendar类型时间转换为字符串类型
	 * @param time
	 * @param format
	 * @return
	 */
	public static String XMLGregorianCalendarTime2Str(XMLGregorianCalendar time,String format){
		GregorianCalendar ca = time.toGregorianCalendar();
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		return formatter.format(ca.getTime());
	}
	
	/**
	 * 用格式"HH:mm:ss"将XMLGregorianCalendar类型时间转换为字符串类型
	 * @param time
	 * @return
	 */
	public static String XMLGregorianCalendarTime2Str(XMLGregorianCalendar time){
		return XMLGregorianCalendarTime2Str(time,"HH:mm:ss");
	}
	
	
	
	/**
	 * 获得当前日期和时间的XMLGregorianCalendar类型
	 * @return
	 */
	static public XMLGregorianCalendar getDateTime(){
		XMLGregorianCalendar xgc = null;
		try {
			xgc = DatatypeFactory.newInstance().newXMLGregorianCalendar();
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		xgc.setYear(calendar.get(Calendar.YEAR));
		xgc.setMonth(calendar.get(Calendar.MONTH) +1);
		xgc.setDay(calendar.get(Calendar.DAY_OF_MONTH));
		xgc.setHour(calendar.get(Calendar.HOUR_OF_DAY));
		xgc.setMinute(calendar.get(Calendar.MINUTE));
		xgc.setSecond(calendar.get(Calendar.SECOND));		
		xgc.setTimezone(calendar.get(Calendar.ZONE_OFFSET) / 60000 );
		return xgc;
	}
	
	/**
	 * 获得指定日期和时间的XMLGregorianCalendar类型
	 * @return
	 */
	static public XMLGregorianCalendar getDateTime(Calendar calendar){
		XMLGregorianCalendar xgc = null;
		try {
			xgc = DatatypeFactory.newInstance().newXMLGregorianCalendar();
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
		}
		xgc.setYear(calendar.get(Calendar.YEAR));
		xgc.setMonth(calendar.get(Calendar.MONTH) +1);
		xgc.setDay(calendar.get(Calendar.DAY_OF_MONTH));
		xgc.setHour(calendar.get(Calendar.HOUR_OF_DAY));
		xgc.setMinute(calendar.get(Calendar.MINUTE));
		xgc.setSecond(calendar.get(Calendar.SECOND));		
		xgc.setTimezone(calendar.get(Calendar.ZONE_OFFSET) / 60000 );
		return xgc;
	}
	
	/**
	 * 用指定格式将XMLGregorianCalendar类型的日期和时间转化为字符串
	 * @param str
	 * @param format
	 * @return
	 */
	static public XMLGregorianCalendar getDateTime(String str,String format){
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar calendar = Calendar.getInstance();
		try {
			calendar.setTime(sdf.parse(str));
		}
		catch (ParseException e) {
			e.printStackTrace();
		}
		return getDateTime(calendar);
	}
	
	/**
	 * 用格式"yyyy-MM-dd HH:mm:ss"将XMLGregorianCalendar类型的日期和时间转化为字符串
	 * @param str
	 * @param format
	 * @return
	 */
	static public XMLGregorianCalendar getDateTime(String str){
		return getDateTime(str,"yyyy-MM-dd HH:mm:ss");
	}
	
	/**
	 * 用指定格式将XMLGregorianCalendar类型时间转换为字符串类型
	 * @param dateTime
	 * @param format
	 * @return
	 */
	public static String XMLGregorianCalendarDateTime2Str(XMLGregorianCalendar dateTime,String format){
		GregorianCalendar ca = dateTime.toGregorianCalendar();
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		return formatter.format(ca.getTime());
	}
	
	/**
	 * 用格式"HH:mm:ss"将XMLGregorianCalendar类型时间转换为字符串类型
	 * @param time
	 * @return
	 */
	public static String XMLGregorianCalendarDateTime2Str(XMLGregorianCalendar dateTime){
		return XMLGregorianCalendarTime2Str(dateTime,"yyyy-MM-dd HH:mm:ss");
	}
	
	/**
	 * 获得当前时间戳
	 * @return
	 */
	static public XMLGregorianCalendar getTimeStamp(){
		XMLGregorianCalendar xgc = null;
		try {
			xgc = DatatypeFactory.newInstance().newXMLGregorianCalendar();
		} catch (DatatypeConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		xgc.setTimezone(8);
		Calendar calendar = Calendar.getInstance();
		xgc.setYear(calendar.get(Calendar.YEAR));
		xgc.setMonth(calendar.get(Calendar.MONTH) +1);
		xgc.setDay(calendar.get(Calendar.DAY_OF_MONTH));
		xgc.setHour(calendar.get(Calendar.HOUR_OF_DAY));
		xgc.setMinute(calendar.get(Calendar.MINUTE));
		xgc.setSecond(calendar.get(Calendar.SECOND));
		xgc.setMillisecond(calendar.get(Calendar.MILLISECOND));
		xgc.setTimezone(calendar.get(Calendar.ZONE_OFFSET) / 60000 );
		return xgc;
	}
	
	
	
	
	
	
	
	
	public static void main(String[] args){
		XMLGregorianCalendar test = XMLGregorianCalendarUtil.getTime("13:13:13");
		System.out.println(XMLGregorianCalendarUtil.XMLGregorianCalendarDate2Str(test, "HH:mm:ss"));
		System.out.println(XMLGregorianCalendarUtil.getDateTime("2011-07-25 15:15:12"));
	}
}
