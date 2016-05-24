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

    //폴더 열기
    @RequestMapping(method = RequestMethod.POST, value = "/folder/openFolder")
    public List<HashMap> openFolder(@RequestBody Folder folder) {
        int folder_id =  folder.getFolder_id();
        System.out.println("open folder : " + folder_id);
        ArrayList<HashMap> boardList = folderMapper.openFolder(folder);
        return boardList;
    }

    //친구(라인)폴더 열기
    @RequestMapping(method = RequestMethod.POST, value = "/folder/openLineFolder")
    public List<HashMap> openLineFolder(@RequestBody User user) {
        int user_id =  user.getUser_id();
        System.out.println("open friends folder of : " + user_id);
        ArrayList<HashMap> boardList = folderMapper.openLineFolder(user);
        return boardList;
    }

    //페이버릿폴더 열기
    @RequestMapping(method = RequestMethod.POST, value = "/folder/openFavoriteFolder")
    public List<HashMap> openFavoriteFolder(@RequestBody User user) {
        int user_id =  user.getUser_id();
        System.out.println("open favorite folder of : " + user_id);
        ArrayList<HashMap> boardList = folderMapper.openFavoriteFolder(user);
        return boardList;
    }


    //내폴더 열기
    @RequestMapping(method = RequestMethod.POST, value = "/folder/openMyFolder")
    public List<BoardResult> openMyFolder(@RequestBody User user) {
        int user_id =  user.getUser_id();
        int[][] numbers = new int[1000][10];
        System.out.println("open my folder of : " + user_id);
        ArrayList<BoardResult> boardList = folderMapper.openMyFolder(user);
        for(int x=0; x < boardList.size(); x++){
            wordVO values = folderMapper.getValues( boardList.get(x).getBoard_id() );
            System.out.println("insert values" + values);
            if(values != null) {
                numbers[x][0] = values.getPos1();
                numbers[x][1] = values.getPos2();
                numbers[x][2] = values.getPos3();
                numbers[x][3] = values.getPos4();
                numbers[x][4] = values.getPos5();
                numbers[x][5] = values.getNeg1();
                numbers[x][6] = values.getNeg2();
                numbers[x][7] = values.getNeg3();
                numbers[x][8] = values.getNeg4();
                numbers[x][9] = values.getNeg5();
                boardList.get(x).setValues(numbers[x]);   //게시글 별로 단어 테이블 주입
            }
            System.out.println("insert values in for 문" + boardList.get(x));
        }
        System.out.println("insert values" + boardList);
        return boardList;
    }




}
