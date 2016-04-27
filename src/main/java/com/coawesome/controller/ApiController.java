package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.BoardVO;
import com.coawesome.domain.User;
import com.coawesome.domain.Result;
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
  @RequestMapping(method = RequestMethod.POST, value = "/user/join.do")
  public Result addUser(@RequestBody User user) {
    System.out.println("user: " + user);

    boardMapper.addUser(user);

    return new Result(0, "success");
  }






  //게시판 글 목록 보기
    @RequestMapping(method = RequestMethod.GET, value = "/api/board")
    public List<BoardVO> getBoardList() {
        BoardVO board = new BoardVO();
        board.setBoard_id(1);
        board.setTitle("제목");
        board.setContent("내용입니다.");
      BoardVO board2 = new BoardVO();
      board2.setBoard_id(2);
      board2.setTitle("제목2");
      board2.setContent("내용입니다.2");
      BoardVO board3 = new BoardVO();
      board3.setBoard_id(3);
      board3.setTitle("제목3");
      board3.setContent("내용입니다.3");

        ArrayList<BoardVO> boardList = new ArrayList<BoardVO>();
      boardList.add(board);
      boardList.add(board2);

        return boardList;
    }

    //게시판 글 상세 보기
    @RequestMapping(method = RequestMethod.GET, value = "/api/board/{board_id}")
    public BoardVO getBoard(@PathVariable int board_id) {
        System.out.println("board_id: " + board_id);
    /*BoardVO board = new BoardVO();
    board.setTitle("제목");
    board.setContent("내용입니다.");*/
        BoardVO board = boardMapper.findById(board_id);

        return board;
    }


    //게시판 글 수정하기
    @RequestMapping(method = RequestMethod.PUT, value = "/api/board/{board_id}")
    public BoardVO modifyBoard(@PathVariable int board_id, @RequestBody BoardVO inBoard) {
        System.out.println("board_id: " + board_id);

        BoardVO board = new BoardVO();
        board.setBoard_id(board_id);
        if (inBoard.getContent() != null) {
            board.setContent(inBoard.getContent());
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
