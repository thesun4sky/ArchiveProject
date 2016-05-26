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



    @RequestMapping(method = RequestMethod.POST, value = "/tag/openTagFolder")
    public List<HashMap> openTagFolder(@RequestBody TagElement tagElement) {
        String tag =  tagElement.getTag();
        System.out.println("user : " + tagElement.getUser_id() + "open tag boards : " + tag);
        ArrayList<HashMap> tagBoardList = tagMapper.openTagFolder(tagElement);
        System.out.println("tag boards : " + tagBoardList);
        return tagBoardList;
    }


}
