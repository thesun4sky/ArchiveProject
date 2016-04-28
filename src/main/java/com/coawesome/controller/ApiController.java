package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.BoardVO;
import com.coawesome.domain.Result;
import com.coawesome.domain.User;
import com.coawesome.persistence.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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




  //게시판 글 목록 보기
  @RequestMapping(method = RequestMethod.POST, value = "/api/boardlist")
  public List<BoardVO> getBoardList(@RequestBody User user) {
    System.out.println(user);
    int user_id = user.getUser_id();
    ArrayList<BoardVO> boardList = (ArrayList<BoardVO>) boardMapper.boardfindById(user_id);
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
