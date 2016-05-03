package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.BoardVO;
import com.coawesome.domain.Reply;
import com.coawesome.domain.Result;
import com.coawesome.domain.User;
import com.coawesome.persistence.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping("/hello")
    public String Hello() {
        return "Hello test";
    }

  //게시판 생성 API
  @RequestMapping(method = RequestMethod.POST, value = "/api/board")
  public Result addBoard(@RequestBody BoardVO board) {
    System.out.println("board: " + board);

    boardMapper.insertBoard(board);

    return new Result(0, "success");
  }


  //회원가입
  @RequestMapping(method = RequestMethod.POST, value = "/user/join")
  public Result addUser(@RequestBody User user) {
    System.out.println("user: " + user);

    boardMapper.addUser(user);

    return new Result(0, "success");
  }


  //아이디 찾기
  @RequestMapping(method = RequestMethod.POST, value = "/user/findID")
  public Result findID(@RequestBody User user) {
    System.out.println("try to find id: " + user);

    String found_id = boardMapper.findID(user);
    if(found_id == null){
      System.out.println("해당하는 ID없음");
      return new Result(0, "fales");
    }
    System.out.println(found_id);
    return new Result(0, found_id);
  }


  //비밀번호 찾기
  @RequestMapping(method = RequestMethod.POST, value = "/user/findPASS")
  public Result findPASS(@RequestBody User user) {
    System.out.println("try to find pass: " + user);

    String found_pass = boardMapper.findPASS(user);
    if(found_pass == null){
      System.out.println("해당하는 password 없음");
      return new Result(0, "fales");
    }
    System.out.println(found_pass);
    return new Result(0, found_pass);
  }

  //로그인
  @RequestMapping(method = RequestMethod.POST, value = "/user/login")
  public Result Login(@RequestBody User user) {
    System.out.println("try to login user: " + user);

    String password = boardMapper.Login(user);
    String input_password = user.getPassword();
    System.out.println(password + " : " +  user.getPassword());
    if(!password.equals(input_password)) {
      return new Result(0, "fales");
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
  public ArrayList<Reply> ShowReply(@RequestBody BoardVO board){
    int board_id = board.getBoard_id();
    ArrayList<Reply> list = boardMapper.showreplybyId(board_id);
    return list;
  }



  //게시판 글 목록 보기
  @RequestMapping(method = RequestMethod.POST, value = "/api/boardlist")
  public List<HashMap> getBoardList(@RequestBody User user) {
    System.out.println(user);
    int user_id = user.getUser_id();
    ArrayList<HashMap> boardList = (ArrayList<HashMap>) boardMapper.getBoardById(user_id);
//    boardList =
    return boardList;
  }

    //게시판 글 상세 보기
    @RequestMapping(method = RequestMethod.GET, value = "/api/board/{board_id}")
    public BoardVO getBoard(@PathVariable int board_id) {
        System.out.println("board_id: " + board_id);

        BoardVO board = boardMapper.findById(board_id);

        return board;
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
}
