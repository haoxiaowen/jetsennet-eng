/**
 * 
 */
package jetsennet.jue2.util.fileoperater;

/**
 * 文件操作任务类型
 * 1 创建目录 2 获取MD5 3 文件大小 4 目录大小 5文件删除 6 目录删除 7 写文件 8 读文件 9 重命名文件
 * 10迁移文件 11 迁移目录 12拷贝文件 13 拷贝目录
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">张维</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2014-4-22       zw          创建<br/>
 */
public enum FileOperaterType
{
	NULL, CREATE_DIRECTORY, MD5, FILE_SIZE, DIRECTORY_SIZE, DEL_FILE,
	DEL_DIRECTORY, WRITE_FILE, READ_FILE, RENAME_FILE, MOVE_FILE,
	MOVE_DIRECTORY, COPY_FILE, COPY_DIRECTORY, WRITE_UTF8_FILE, READ_UTF8_FILE,
	FILE_EXISTS
}
