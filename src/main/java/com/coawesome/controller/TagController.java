package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.*;
import com.coawesome.persistence.TagMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by eastflag on 2016-04-25.
 */
@RestController
public class TagController {

    @Autowired
    private TagMapper tagMapper;

    //프로필불러오기
    @RequestMapping(method = RequestMethod.POST, value = "/tag/loadTagProfile")
    public TagElement loadTagProfile(@RequestBody TagElement tagElement) {

        TagElement tagProfile = tagMapper.loadTagProfile(tagElement);
        System.out.println("Load TagProfile : " + tagProfile);
        return tagProfile;
    }

    //테그 검색
    @RequestMapping(method = RequestMethod.GET, value = "/tag/findTag/{tag}")
    public ArrayList<TagElement> findUser(@PathVariable("tag") String tag)  {
        System.out.println("try to find tag: " + tag);

        ArrayList<TagElement> find_tag = tagMapper.findTag(tag);
        if(find_tag == null){
            System.out.println("해당하는 테그없음");
            return new ArrayList<>();
        }
        System.out.println(find_tag);
        return find_tag;
    }


    //테그 단어 리스트
    @RequestMapping(method = RequestMethod.POST, value = "/tag/getTagWords")
    public List<CloudVO> getTagWords(@RequestBody TagElement tagElement) {
        String tag =  tagElement.getTag();
        System.out.println("get word list of tag : " + tag);
        ArrayList<CloudVO> tagWordList = tagMapper.getTagWords(tag);

        System.out.println("tag word list : " + tagWordList);
        return tagWordList;
    }

    //테그 단어 레이더 데이터
    @RequestMapping(method = RequestMethod.POST, value = "/tag/getTagValue")
    public int[] getTagValue(@RequestBody TagElement tagElement) {
        String tag =  tagElement.getTag();
        System.out.println("get value of tag : " + tag);
        wordVO tagValue = tagMapper.getTagValue(tag);
        int[] numbers = new int[10];
        numbers[0] = tagValue.getPos1();
        numbers[1] = tagValue.getPos2();
        numbers[2] = tagValue.getPos3();
        numbers[3] = tagValue.getPos4();
        numbers[4] = tagValue.getPos5();
        numbers[5] = tagValue.getNeg1();
        numbers[6] = tagValue.getNeg2();
        numbers[7] = tagValue.getNeg3();
        numbers[8] = tagValue.getNeg4();
        numbers[9] = tagValue.getNeg5();

        System.out.println("tag value : " + numbers);
        return numbers;
    }


    //테그 단어 라인 데이터
    @RequestMapping(method = RequestMethod.POST, value = "/tag/getLineValue")
    public int[][] getLineValue(@RequestBody TagElement tagElement) {
        String tag =  tagElement.getTag();
        System.out.println("get line value of tag : " + tag);
        ArrayList<LineValue> lineValue = tagMapper.getLineValue(tag);
        int[][] numbers = new int[2][7];

        for(int i=0; i<7; i++){
            if(lineValue.get(i).getPositive() == 0) {
                numbers[0][6-i] = lineValue.get(i+1).getPositive();  //이번주를 마지막에 넣기위해 6에서 빼줌
                numbers[1][6-i] = lineValue.get(i+1).getNegative();
            }
            else{
                numbers[0][6-i] = lineValue.get(i).getPositive();
                numbers[1][6-i] = lineValue.get(i).getNegative();
            }
        }

        System.out.println("tag line value : " + numbers);
        return numbers;
    }


    //테그 게시글 리스트
    @RequestMapping(method = RequestMethod.POST, value = "/tag/openTagFolder")
    public List<HashMap> openTagFolder(@RequestBody TagElement tagElement) {
        String tag =  tagElement.getTag();
        System.out.println("user : " + tagElement.getUser_id() + "open tag boards : " + tag);
        ArrayList<HashMap> tagBoardList = tagMapper.openTagFolder(tagElement);
        System.out.println("tag boards : " + tagBoardList);
        return tagBoardList;
    }



}
