package istt.tracking.tracking.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;

import istt.tracking.tracking.security.securityv2.CustomUserDetailsService;
import istt.tracking.tracking.security.securityv2.JwtAuthenticationEntryPoint;
import istt.tracking.tracking.security.securityv2.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	CustomUserDetailsService customUserDetailsService;
 
	@Autowired
	private JwtAuthenticationEntryPoint unauthorizedHandler;

	@Autowired
	private CustomAuthenticationProvider customAuthenticationProvider;

	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter();
	}

	@Autowired
	private NoPasswordAuthenticationProvider noPasswordAuthenticationProvider;

	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//		authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
		authenticationManagerBuilder.authenticationProvider(customAuthenticationProvider);
	}

	@Bean(BeanIds.AUTHENTICATION_MANAGER)
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors() // Enables CORS
				.and().csrf().disable() // Disable CSRF for stateless APIs
				.exceptionHandling().and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Disable
																														// session
																														// management
				.and().authorizeRequests()
				.antMatchers("/", "/favicon.ico", "/**/*.png", "/**/*.gif", "/**/*.svg", "/**/*.jpg", "/**/*.html",
						"/**/*.css", "/**/*.js", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/auth/**",
						"/businessdays/search", "localhost", "**")
				.permitAll() // Allows public access to the listed endpoints
				.anyRequest().authenticated(); // All other requests need authentication
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true); // Allows credentials like cookies
		config.addAllowedOriginPattern("*"); // Allows all origins (wildcard)
		config.addAllowedHeader("*"); // Allows all headers
		config.addAllowedMethod("*"); // Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
