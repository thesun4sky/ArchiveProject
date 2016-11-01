package com.coawesome.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by TeaSun on 2016-05-03.
 */
@Configuration
public class CORSConfig {
  //api로 들어오는 요청은 CORS 허용한다.
  public WebMvcConfigurer corsConfigurer(){
    return new WebMvcConfigurerAdapter() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**");
      }
    };
  }
}
