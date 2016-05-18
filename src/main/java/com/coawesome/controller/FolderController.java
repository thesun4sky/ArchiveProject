package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.*;
import com.coawesome.persistence.BoardMapper;
import com.coawesome.persistence.FolderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by eastflag on 2016-04-25.
 */
@RestController
public class FolderController {

    @Autowired
    private FolderMapper folderMapper;

  //폴더 생성
  @RequestMapping(method = RequestMethod.POST, value = "/folder/newFolder" )
  public Result newFolder(@RequestBody Folder folder) {
    String folder_name = folder.getFolder_name();
    System.out.println("make folder : " + folder_name);

    folderMapper.newFolder(folder);

    return new Result(0, "success");
  }


    //폴더 삭제
    @RequestMapping(method = RequestMethod.POST, value = "/folder/deleteFolder" )
    public Result deleteFolder(@RequestBody Folder folder) {
        int folder_id = folder.getFolder_id();
        System.out.println("delete folder : " + folder_id);

        folderMapper.deleteFolder(folder);
        folderMapper.deleteFboard(folder);

        return new Result(0, "success");
    }


    //폴더 목록 보기
    @RequestMapping(method = RequestMethod.POST, value = "/folder/getFolderList")
    public List<Folder> getFolderList(@RequestBody User user) {
        System.out.println(user + "의 폴더리스트 출력");
        int user_id = user.getUser_id();
        ArrayList<Folder> folderList = folderMapper.getFolderList(user_id);

        return folderList;
    }


    //폴더에 게시물 추가
    @RequestMapping(method = RequestMethod.POST, value = "/folder/addFboard" )
    public Result addFboard(@RequestBody Folder folder) {
        String folder_id = folder.getFolder_name();
        int board_id = folder.getBoard_id();
        System.out.println("board (" + board_id + ") add to folder : " + folder_id);

        folderMapper.addFboard(folder);

        return new Result(0, "success");
    }


}
