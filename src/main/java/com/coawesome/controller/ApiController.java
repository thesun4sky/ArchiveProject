package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.*;
import com.coawesome.persistence.BoardMapper;
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
public class ApiController {

    @Autowired
    private BoardMapper boardMapper;

  @Resource(name="fileUtils")
  private FileUtils fileUtils;

    @RequestMapping("/hello")
    public String Hello() {
        return "Hello test";
    }
  //게시판 생성 API
  @RequestMapping(method = RequestMethod.POST, value = "/api/board" )
  public Result addBoard(@RequestParam("file") MultipartFile file, BoardVO board) throws Exception {
    //TODO 중복체크
    boardMapper.insertBoard(board);
    int storedBoardId = boardMapper.selectBoardId(board);
    board.setBoard_id(storedBoardId);
    System.out.println("board: " + board);
    ImageVO image = fileUtils.parseInsertFileInfo(file,board);
    boardMapper.insertBoardImage(image);

    //////////////////////Archive Emotion////////////////////////
    boardMapper.newBoardValue(storedBoardId);
    //게시글 단어테이블 생성

    ArrayList<String> wordsTable = board.getWords(); //단어 테이블 받아오기
    System.out.println("wordsTable: " + board);

   wordVO wordsValue = new wordVO();

    for(int counter = 0; counter < wordsTable.size()-1; counter++) {
      wordsValue = boardMapper.getWordsValue(wordsTable.get(counter));   //단어 감정값 얻어오기
      wordsValue.setBoard_id(storedBoardId);   //board_id 주입
      wordsValue.setWord_num(wordsTable.size()-1);
      System.out.println("wordsValue: " + wordsValue);

      boardMapper.updateValue(wordsValue);   //단어 감정값 적용
      //단어 감정값 테그에 적용
    }
/*
    for(int counter = 0; counter < wordsTable.size(); counter++) {
      ArrayList<HashMap> wordsEmotion = boardMapper.getWordsEmotion(wordsTable);
      //TODO 단어 감성값 얻어오기
      boardMapper.updateUserEmotion(wordsValue);
      //TODO 단어 감성값 사용자 프로필에 적용
    }
*/

    return new Result(0, "success");
  }


  //board_id로 게시글 삭제 API
  @RequestMapping(method = RequestMethod.POST, value = "/api/deleteboard" )
  public Result deleteBoard(@RequestBody BoardVO board) throws Exception {
    int boardId = board.getBoard_id();
    System.out.println("board_id: " + boardId);
    String FileName = boardMapper.getFileName(boardId);
    System.out.println("fileName: " + FileName);
    boolean isDeleted = fileUtils.deleteFile(FileName);
    if(isDeleted)
      {
        System.out.println("isDeleted: " + isDeleted);
        boardMapper.deleteBoardImage(boardId); // 잘 만들어진 DB경우 한번에 지워질듯
        boardMapper.deleteBoard(boardId);
      }
    return new Result(0, "success");
  }






  //댓글 쓰기 API
  @RequestMapping(method = RequestMethod.POST, value = "/api/reply")
  public Result InsertReply(@RequestBody Reply reply){
    boardMapper.addReply(reply);
    return new Result(0, "success");
  }

  //댓글 보기 API
  @RequestMapping(method = RequestMethod.POST, value = "/api/showreply")
  public ArrayList<HashMap> ShowReply(@RequestBody BoardVO board){
    System.out.println(board);
    int board_id = board.getBoard_id();
    ArrayList<HashMap> list = boardMapper.showreplybyId(board_id);
    return list;
  }



  //게시판 글 목록 보기
  @RequestMapping(method = RequestMethod.POST, value = "/api/boardlist")
  public List<HashMap> getBoardList(@RequestBody User user) {
    System.out.println(user);
    int user_id = user.getUser_id();
    ArrayList<HashMap> boardList = boardMapper.getBoardById(user_id);

    return boardList;
  }


  //카테고리별 목록 보기
  @RequestMapping(method = RequestMethod.POST, value = "/api/boardlistByCatagory")
  public List<HashMap> getBoardListByCatagory(@RequestBody BoardVO board ) {
    int catagory = board.getCatagory();
    System.out.println(catagory);
    ArrayList<HashMap> boardList = boardMapper.getBoardByCatagory(catagory);
//    boardList =
    return boardList;
  }

    //게시판 글 수정하기
    @RequestMapping(method = RequestMethod.PUT, value = "/api/board/{board_id}")
    public BoardVO modifyBoard(@PathVariable int board_id, @RequestBody BoardVO inBoard) {
        System.out.println("board_id: " + board_id);

        BoardVO board = new BoardVO();
        board.setBoard_id(board_id);
        if (inBoard.getLine1() != null) {
            board.setLine1(inBoard.getLine1());
        }

      if (inBoard.getLine2() != null) {
        board.setLine2(inBoard.getLine2());
      }
        return board;
    }

    //게시판 글 삭제하기
    @RequestMapping(method = RequestMethod.DELETE, value = "/api/board/{board_id}")
    public Result removeBoard(@PathVariable String board_id) {
        System.out.println("board_id: " + board_id);

        return new Result(0, "success");
    }



  //페이버릿하기
  @RequestMapping(method = RequestMethod.POST, value = "/api/favoriteBoard")
  public Result favoriteBoard(@RequestBody Favorite favorite) {
    System.out.println(favorite);

    boardMapper.addToFavorite(favorite);
    boardMapper.addToBoard(favorite.getBoard_id());

    return new Result(0, "success");
  }

  //페이버릿 취소하기
  @RequestMapping(method = RequestMethod.POST, value = "/api/UnfavoriteBoard")
  public Result UnfavoriteBoard(@RequestBody Favorite favorite) {
    System.out.println(favorite);

    boardMapper.deleteFromFavorite(favorite);
    boardMapper.cancelToBoard(favorite.getBoard_id());

    return new Result(0, "success");
  }


}
