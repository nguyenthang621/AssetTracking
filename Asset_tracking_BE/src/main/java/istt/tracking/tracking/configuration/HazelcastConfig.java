package istt.tracking.tracking.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hazelcast.config.Config;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;

@Configuration
public class HazelcastConfig {

	@Bean
	public HazelcastInstance hazelcastInstance() {
		Config config = new Config();
		config.setInstanceName("hazelcast-instance");
		return Hazelcast.newHazelcastInstance(config);
	}

}
