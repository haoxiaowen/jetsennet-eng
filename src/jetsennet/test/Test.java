package jetsennet.test;

import redis.clients.jedis.Jedis;

public class Test {
	public static void main(String[] args) {
		Jedis jedis = new Jedis("10.11.4.118",6379);
		jedis.auth("jetsen");
		
		System.out.println(jedis.select(0));
		String xy = jedis.get("user1");
		System.out.println(xy);
	}
}
