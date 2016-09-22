package com.coawesome.restTeamplate;

import com.google.gson.JsonObject;
import org.junit.Ignore;
import org.junit.Test;
import com.google.gson.JsonParser;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Created by TeasunKim on 2016-09-19.
 */
public class PostTest {
    @Ignore
    @Test
    public void PostTest() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://openapi.naver.com/v1/language/translate";

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.set("Content-Type", "application/x-www-form-urlencoded");
        requestHeaders.set("X-Naver-Client-Id", "WYtueaQWm4bbvmwPEn6R");
        requestHeaders.set("X-Naver-Client-Secret", "yXj4Gj6oPL");

        MultiValueMap<String, String> postParameters = new LinkedMultiValueMap<String, String>();
        postParameters.add("source", "ko");
        postParameters.add("target", "en");
        postParameters.add("text", "안녕하세요. 반갑습니다. 저는 학생 입니다.");
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(postParameters, requestHeaders);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST , requestEntity, String.class);

        System.out.println("result:" + responseEntity);
    }
}