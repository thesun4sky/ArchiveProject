package com.coawesome.restTeamplate;

import org.junit.Ignore;
import org.junit.Test;
import org.json.JSONObject;
import org.springframework.boot.json.JsonParser;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

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

        MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
        UriComponents uriComponents;
        String baseUrl = "https://api.poesis.kr/post/search.php";

        params.add("q", "경기도 부천시 원미구 상동 부흥로 71");
        params.add("v", "3.0.0-korea.r.center");
        params.add("ref", "localhost");

        uriComponents = UriComponentsBuilder.fromHttpUrl(baseUrl).queryParams(params).build();

        String resultStr = restTemplate.getForObject(uriComponents.toString(), String.class);

        JsonParser parser = new JsonParser() {
            @Override
            public Map<String, Object> parseMap(String json) {
                return null;
            }

            @Override
            public List<Object> parseList(String json) {
                return null;
            }
        };
        JSONObject json = parser.parse(resultStr).getAsJsonObject();  //TODO JsonObject 인식이 안됩니다.

        if (json.get("count").getAsInt() > 0) {
            JSONObject object = json.get("results").getAsJsonArray().get(0).getAsJsonObject(); //첫번째 json 객체
            String post = object.get("postcode5").getAsString();
            System.out.println("post code:" + post);
        }

        //System.out.println("result:" + resultStr);
    }
}