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

    @Resource(name = "fileUtils")
    private FileUtils fileUtils;

    @RequestMapping("/hello")
    public String Hello() {
        return "Hello test";
    }


//게시판 생성 API

    @RequestMapping(method = RequestMethod.POST, value = "/api/board")
    public Result addBoard(@RequestParam("file") MultipartFile file, BoardVO board) throws Exception {
        //TODO 중복체크
        boardMapper.insertBoard(board);
        int storedBoardId = boardMapper.selectBoardId(board);
        board.setBoard_id(storedBoardId);
        System.out.println("board: " + board);
        ImageVO image = fileUtils.parseInsertFileInfo(file, board);
        boardMapper.insertBoardImage(image);


        //테그 넣기
        if (boardMapper.existTag(board.getTag1()) == board.getTag1()) //테그가 있다면
        {
            System.out.println(board.getTag1() + "is exist");
            boardMapper.updateTag(board.getTag1()); //히트 +1
        } else {                          //테그가 없다면
            System.out.println(board.getTag1() + "is not exist");
            boardMapper.insertTag(board.getTag1()); //테그 삽입
        }

        if (boardMapper.existTag(board.getTag2()) == board.getTag2()) //테그가 있다면
        {
            System.out.println(board.getTag2() + "is exist");
            boardMapper.updateTag(board.getTag2()); //히트 +1
        } else {                          //테그가 없다면
            System.out.println(board.getTag2() + "is not exist");
            boardMapper.insertTag(board.getTag2()); //테그 삽입
        }

        if (boardMapper.existTag(board.getTag3()) == board.getTag3()) //테그가 있다면
        {
            System.out.println(board.getTag3() + "is exist");
            boardMapper.updateTag(board.getTag3()); //히트 +1
        } else {                          //테그가 없다면
            System.out.println(board.getTag3() + "is not exist");
            boardMapper.insertTag(board.getTag3()); //테그 삽입
        }

        //////////////////////Archive Emotion////////////////////////
        boardMapper.newBoardValue(storedBoardId);
        //게시글 단어테이블 생성

        ArrayList<String> wordsTable = board.getWords(); //단어 테이블 받아오기
        System.out.println("wordsTable: " + board);

        wordVO wordsValue = new wordVO();

        for (int counter = 0; counter < wordsTable.size() - 1; counter++) {
            if (wordsTable.get(counter) != null) {
                wordsValue = boardMapper.getWordsValue(wordsTable.get(counter));   //단어 감정값 얻어오기
                if (wordsValue != null) {
                    wordsValue.setBoard_id(storedBoardId);   //board_id 주입
                    wordsValue.setWord_num(wordsTable.size());
                    System.out.println("wordsValue: " + wordsValue);

                    boardMapper.updateValue(wordsValue);   //단어 감정값 적용
                    boardMapper.addWordToTag(board.getTag1(), wordsValue.getWord());
                    boardMapper.addWordToTag(board.getTag2(), wordsValue.getWord());
                    boardMapper.addWordToTag(board.getTag3(), wordsValue.getWord()); //단어 테그에 등록
                    //단어 감정값 테그에 적용
                }
            }
        }

//////////////////////////////////////////////////////////////////////////////
        return new Result(0, "success");
    }


    //board_id로 게시글 삭제 API
    @RequestMapping(method = RequestMethod.POST, value = "/api/deleteboard")
    public Result deleteBoard(@RequestBody BoardVO board) throws Exception {
        int boardId = board.getBoard_id();
        System.out.println("board_id: " + boardId);
        String FileName = boardMapper.getFileName(boardId);
        System.out.println("fileName: " + FileName);
        boolean isDeleted = fileUtils.deleteFile(FileName);
        System.out.println("isDeleted: " + isDeleted);
        boardMapper.deleteBoardImage(boardId); // 잘 만들어진 DB경우 한번에 지워질듯
        boardMapper.deleteBoard(boardId);
        return new Result(0, "success");
    }


    //댓글 쓰기 API
    @RequestMapping(method = RequestMethod.POST, value = "/api/reply")
    public Result InsertReply(@RequestBody Reply reply) {
        boardMapper.addReply(reply);
        return new Result(0, "success");
    }

    //댓글 보기 API
    @RequestMapping(method = RequestMethod.POST, value = "/api/showreply")
    public ArrayList<HashMap> ShowReply(@RequestBody BoardVO board) {
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

    //글 한개 최신화 보기
    @RequestMapping(method = RequestMethod.POST, value = "/api/boardOne")
    public HashMap getBoardList(@RequestBody HashMap board) {
        HashMap aBoard = boardMapper.findById(board);
        return aBoard;
    }


    //카테고리별 목록 보기
    @RequestMapping(method = RequestMethod.POST, value = "/api/boardlistByCatagory")
    public List<HashMap> getBoardListByCatagory(@RequestBody BoardVO board) {
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


    //공감
    @RequestMapping(method = RequestMethod.POST, value = "/api/likeBoard")
    public Result likeBoard(@RequestBody Like like) {
        System.out.println(like);

        boardMapper.addToLike(like);
        boardMapper.likeToBoard(like.getBoard_id());

        return new Result(0, "success");
    }

    //공감취소
    @RequestMapping(method = RequestMethod.POST, value = "/api/dislikeBoard")
    public Result dislikeBoard(@RequestBody Like like) {
        System.out.println(like);

        boardMapper.deleteFromLike(like);
        boardMapper.dislikeToBoard(like.getBoard_id());

        return new Result(0, "success");
    }


    //사용자 폴더 목록 보기
    @RequestMapping(method = RequestMethod.POST, value = "/api/folderlist")
    public List<HashMap> getFolderList(@RequestBody User user) {
        System.out.println(user + "'s folder List");
        int user_id = user.getUser_id();
        ArrayList<HashMap> folderList = boardMapper.getFolderById(user_id);

        return folderList;
    }


    //폴더에 집어넣기
    @RequestMapping(method = RequestMethod.POST, value = "/api/putInFolder")
    public Result putInFolder(@RequestBody Folder folder) {
        System.out.println(folder);

        boardMapper.putInFolder(folder);

        return new Result(0, "success");
    }


}
