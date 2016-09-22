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
        postParameters.add("text", "마지막 반전은 아무도 예상하지 못했다. 색다른 킬링타임 영화임에 틀림 없다");
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(postParameters, requestHeaders);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST , requestEntity, String.class);

        String result = responseEntity.toString();
        int in_text = result.indexOf("translatedText")+17;
        int out_text = result.substring(in_text).indexOf("}") + in_text -1;
        String result_text = result.substring(in_text,out_text);

//        System.out.println(board.getLine1() + " " + board.getLine2() + " ---translated_text-->" + result_text);


////////////////////////////////////////////감정 분석기///////////////////////////////////////

        RestTemplate restTemplateE = new RestTemplate();
        url = "https://gateway-a.watsonplatform.net/calls/text/TextGetEmotion?apikey=6823070d95896db14bd546523a009796cdb22927";

        HttpHeaders requestHeadersE = new HttpHeaders();

        MultiValueMap<String, String> postParametersE = new LinkedMultiValueMap<String, String>();
        postParametersE.add("outputMode", "json");
        postParametersE.add("text", result_text);
        HttpEntity<MultiValueMap<String, String>> requestEntityE = new HttpEntity<MultiValueMap<String, String>>(postParametersE, requestHeadersE);

        ResponseEntity<String> responseEntityE = restTemplateE.exchange(url, HttpMethod.POST , requestEntityE, String.class);

        String resultE = responseEntityE.toString();

        in_text = resultE.indexOf("anger")+9;
        out_text = resultE.substring(in_text).indexOf(",") + in_text -1;
        String anger = resultE.substring(in_text,out_text);
        double anger_double = Double.parseDouble(anger);
        int neg5 = (int)(anger_double * 100);
        int neg1 = (int)(anger_double * 100);   //anger = 후회, 실망

        in_text = resultE.indexOf("disgust")+11;
        out_text = resultE.substring(in_text).indexOf(",") + in_text -1;
        String disgust = resultE.substring(in_text,out_text);
        double digust_double = Double.parseDouble(disgust);
        int neg4 = (int)(digust_double * 100);
        int neg3 = (int)(digust_double * 100);  //digust = 지루, 혐오

        in_text = resultE.indexOf("fear")+8;
        out_text = resultE.substring(in_text).indexOf(",") + in_text -1;
        String fear = resultE.substring(in_text,out_text);
        double fear_double = Double.parseDouble(fear);
        int neg2 = (int)(fear_double  * 100);  //fear = 식상

        in_text = resultE.indexOf("joy")+7;
        out_text = resultE.substring(in_text).indexOf(",") + in_text -1;
        String joy = resultE.substring(in_text,out_text);
        double joy_double = Double.parseDouble(joy);
        int pos2 = (int)(joy_double * 100);
        int pos4 = (int)(joy_double * 100);
        int pos5 = (int)(joy_double * 100);   //joy = 반전, 박진감, 웃음, 통쾌

        in_text = resultE.indexOf("sadness")+11;
        out_text = 8 + in_text;
        String sadness = resultE.substring(in_text,out_text);
        double sad_double = Double.parseDouble(sadness);
        int pos3 = (int)(sad_double * 100);
        int pos1 = (int)(sad_double * 100);   //sadness = 만족

        System.out.println("result:" + resultE);
        System.out.println("result_value:" + pos1 + " "  + pos2 + " "  +pos3 + " "  +pos4 + " "  +pos5 + " "  + neg1 + " "  + neg2 +  " "  +neg3 + " "  + neg4 +  " "  +neg5);
    }
}