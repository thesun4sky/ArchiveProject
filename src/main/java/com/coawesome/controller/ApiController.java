package com.coawesome.controller;

/**
 * Created by 이호세아 on 2016-04-26.
 */

import com.coawesome.domain.*;
import com.coawesome.persistence.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

/////////////////////////////////2차 감정분석(네이버 기계번역 API-> 알치마이 감정분석 API)/////////////////////////////////////////////

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://openapi.naver.com/v1/language/translate";

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.set("Content-Type", "application/x-www-form-urlencoded");
        requestHeaders.set("X-Naver-Client-Id", "WYtueaQWm4bbvmwPEn6R");
        requestHeaders.set("X-Naver-Client-Secret", "yXj4Gj6oPL");

        MultiValueMap<String, String> postParameters = new LinkedMultiValueMap<String, String>();
        postParameters.add("source", "ko");
        postParameters.add("target", "en");
        postParameters.add("text", board.getLine1() + ". " + board.getLine2());
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(postParameters, requestHeaders);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST , requestEntity, String.class);

        String result = responseEntity.toString();
        int in_text = result.indexOf("translatedText")+17;
        int out_text = result.substring(in_text).indexOf("}") + in_text -1;
        String result_text = result.substring(in_text,out_text);

        System.out.println(board.getLine1() + " " + board.getLine2() + " ---translated_text-->" + result_text);

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
        int pos5 = (int)(joy_double * 100);   //joy = 박진감, 웃음, 통쾌

        in_text = resultE.indexOf("sadness")+11;
        out_text = 5 + in_text;
        String sadness = resultE.substring(in_text,out_text);
        double sad_double = Double.parseDouble(sadness);
        int pos3 = (int)(sad_double * 100);
        int pos1 = (int)(sad_double * 100);   //sadness = 반전, 만족

        wordVO wordsValue2 = new wordVO();
        wordsValue2.setBoard_id(storedBoardId);
        wordsValue2.setPos1(pos1);
        wordsValue2.setPos2(pos2);
        wordsValue2.setPos3(pos3);
        wordsValue2.setPos4(pos4);
        wordsValue2.setPos5(pos5);
        wordsValue2.setNeg1(neg1);
        wordsValue2.setNeg2(neg2);
        wordsValue2.setNeg3(neg3);
        wordsValue2.setNeg4(neg4);
        wordsValue2.setNeg5(neg5);

        System.out.println("Emotion API result : "+ pos1 + " "  + pos2 + " "  +pos3 + " "  +pos4 + " "  +pos5 + " "  + neg1 + " "  + neg2 +  " "  +neg3 + " "  + neg4 +  " "  +neg5);

        boardMapper.updateAPIValue(wordsValue2);   //2차 API 단어 감정값 적용

/////////////////////////////////////////////////////////////////////////////

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

    //로그인 화면 모든 글 목록 보기
    @RequestMapping(method = RequestMethod.GET, value = "/api/Allboardlist")
    public List<HashMap> getAllBoardList() {
        ArrayList<HashMap> boardList = boardMapper.getAllBoard();
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


    //네이버 API테스트
    @RequestMapping(method = RequestMethod.POST, value = "/api/naverTrans")
    public Result naverTrans(@RequestBody TransVO trans) throws IOException {
        System.out.println("trans: " + trans.getText_trans());


        //TODO 네이버 기계번역API를 서버단에서 호출
        StringBuilder sj = new StringBuilder();
        Map<String,String> arguments = new HashMap<>();
        for(Map.Entry<String,String> entry : arguments.entrySet()) {
            sj.append(URLEncoder.encode(entry.getKey(), "UTF-8") + "=" + URLEncoder.encode(entry.getValue(), "UTF-8") + "&");
        }
        byte[] out = sj.toString().getBytes();

        String rawData = "source=ko, target=en, text="+"안녕하세요.";
        String type = "application/x-www-form-urlencoded";
        String client_id = "WYtueaQWm4bbvmwPEn6R";
        String client_secret = "yXj4Gj6oPL";
        arguments.put("source", "ko");
        arguments.put("target", "en");
        arguments.put("text", "한글");

        String encodedData = URLEncoder.encode( rawData );
        URL u = new URL("https://openapi.naver.com/v1/language/translate");
        HttpURLConnection conn = (HttpURLConnection) u.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty( "Content-Type", type );
        conn.setRequestProperty( "X-Naver-Client-Id", client_id );
        conn.setRequestProperty( "X-Naver-Client-Secret", client_secret );
//        conn.setRequestProperty( "Content-Length", String.valueOf(encodedData.length()));
        conn.connect();
        try
        {
            OutputStream os = conn.getOutputStream();
            os.write(out);
        }
        catch (Exception e)
        {

        }
//        OutputStream os = conn.getOutputStream();
//        os.write(encodedData.getBytes());
        System.out.println(out.toString());

        return new Result(0, trans.getText_trans());
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
