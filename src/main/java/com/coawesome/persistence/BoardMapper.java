package com.coawesome.persistence;

import com.coawesome.domain.*;
import org.apache.ibatis.annotations.*;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface BoardMapper {
  //댓글 등록
  @Insert("INSERT INTO reply(user_id, board_id, likes_num, reply, created) VALUES(#{user_id}, #{board_id}, #{likes_num}, #{reply}, #{created})")
  void addReply(Reply reply);

  //댓글 확인
  @Select("SELECT user.user_img, user.name, user.user_id, reply.reply, reply.created from reply INNER JOIN user on reply.user_id = user.user_id where board_id = #{board_id}")
  ArrayList<HashMap> showreplybyId(@Param("board_id") int board_id);

  //게시글 등록
  @Insert("INSERT INTO board(user_id, public_level, tag1, tag2, tag3, line1, line1_x, line1_y, line2, line2_x, line2_y, catagory) VALUES(#{user_id}, #{public_level}, #{tag1}, #{tag2}, #{tag3}, #{line1}, #{line1_x}, #{line1_y}, #{line2}, #{line2_x}, #{line2_y},#{catagory})")
  void insertBoard(BoardVO board);
  @Select("SELECT board_id FROM board where user_id = #{user_id} AND line1 = #{line1} AND line2 = #{line2} LIMIT 1")
  int selectBoardId(BoardVO board);
  @Insert("INSERT INTO board_image(board_id, original_file_name, stored_file_name, file_size, creator_id) VALUES(#{board_id}, #{original_file_name}, #{stored_file_name}, #{file_size}, #{creator_id})")
  void insertBoardImage(ImageVO image);

  //게시글 감정테이블 생성
  @Insert("INSERT INTO board_value(board_id) VALUES(#{storedBoardId})")
  void newBoardValue(@Param("storedBoardId") int storedBoardId);

  //단어 감정값 얻어오기
  @Select("SELECT * FROM word where word = #{word} LIMIT 1")
  wordVO getWordsValue(@Param("word") String word);

  //단어 감정값 적용
  @Update("UPDATE board_value SET pos1=pos1+#{pos1}/#{word_num}, pos2=pos2+#{pos2}/#{word_num}, pos3=pos3+#{pos3}/#{word_num}, pos4=pos4+#{pos4}/#{word_num}, pos5=pos5+#{pos5}/#{word_num}, " +
          " neg1=neg1+#{neg1}/#{word_num}, neg2=neg2+#{neg2}/#{word_num}, neg3=neg3+#{neg3}/#{word_num}, neg4=neg4+#{neg4}/#{word_num}, neg5=neg5+#{neg5}/#{word_num} WHERE board_id = #{board_id}")
  void updateValue(wordVO wordsValue);

  //2차 단어 API 감정값 적용
  @Update("UPDATE board_value SET pos1=pos1+#{pos1}, pos2=pos2+#{pos2}, pos3=pos3+#{pos3}, pos4=pos4+#{pos4}, pos5=pos5+#{pos5}, " +
          " neg1=neg1+#{neg1}, neg2=neg2+#{neg2}, neg3=neg3+#{neg3}, neg4=neg4+#{neg4}, neg5=neg5+#{neg5} WHERE board_id = #{board_id}")
  void updateAPIValue(wordVO wordsValue);

  //게시판 글 목록 조회( 친구들의 친구공개 게시글, 모든사람의 전체공개 게시글 목록)
  @Select("SELECT DISTINCT user.name, board.board_id, board.user_id, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite, " +
          "          IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "          LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "          LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "          WHERE board.user_id != #{user_id}  AND ((friend.user_id = #{user_id} AND friend.status = 1 AND board.public_level = 2) OR board.public_level = 1) ORDER BY board_id DESC")
         // "LEFT OUTER JOIN (SELECT favorite.board_id as board_id, CASE favorite.board_id WHEN board.board_id THEN'1' ELSE '0' END as favorite FROM favorite INNER JOIN board ON board.board_id = favorite.board_id WHERE favorite.user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id  " +
ArrayList<HashMap> getBoardById(int user_id);

  //로그인 화면 모든 게시물 보기
  @Select("select * from board INNER JOIN board_image ON board.board_id = board_image.board_id INNER JOIN user on board.user_id = user.user_id \n" +
          "WHERE board.public_level=1 ORDER BY RAND() LIMIT 3")
  // "LEFT OUTER JOIN (SELECT favorite.board_id as board_id, CASE favorite.board_id WHEN board.board_id THEN'1' ELSE '0' END as favorite FROM favorite INNER JOIN board ON board.board_id = favorite.board_id WHERE favorite.user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id  " +
  ArrayList<HashMap> getAllBoard();



  //카테고리별 목록 조회
  @Select("select * from board INNER JOIN board_image ON board.board_id = board_image.board_id INNER JOIN user on board.user_id = user.user_id WHERE catagory = #{catagory} AND board.public_level = 0")
  ArrayList<HashMap> getBoardByCatagory(@Param("catagory") int catagory);



  //게시글 보기 TODO 디테일 작업전
//  @Select("select * from board left outer join board_image on board.board_id = board_image.board_id left outer join favorite on board.board_id = favorite.board_id left outer join (SELECT board_id, COUNT(*) as likes_num FROM likes WHERE board_id = #{board_id} group by board_id) WHERE board_id = #{board_id}")

  @Select("SELECT DISTINCT user.name, board.board_id, user.user_id, user.user_img, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite, " +
          "          IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "          LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "          LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "          WHERE board.board_id = #{board_id} and user.user_id = #{user_id} LIMIT 1")
  HashMap findById(HashMap map);


  //페이버릿 하기
  @Insert("INSERT INTO favorite(user_id, board_id) VALUES(#{user_id}, #{board_id})")
  void addToFavorite(Favorite favorite);
  @Update("UPDATE board SET favorite_num=favorite_num+1 WHERE board_id = #{board_id}")
  void addToBoard(int board_id);

  //페이버릿 취소
  @Delete("DELETE FROM favorite WHERE user_id = #{user_id} AND board_id = #{board_id}")
  void deleteFromFavorite(Favorite favorite);
  @Update("UPDATE board SET favorite_num=favorite_num-1 WHERE board_id = #{board_id}")
  void cancelToBoard(int board_id);



  //공감 하기
  @Insert("INSERT INTO likes(user_id, board_id) VALUES(#{user_id}, #{board_id})")
  void addToLike(Like like);
  @Update("UPDATE board SET likes_num=likes_num+1 WHERE board_id = #{board_id}")
  void likeToBoard(int board_id);

  //공감 취소
  @Delete("DELETE FROM likes WHERE user_id = #{user_id} AND board_id = #{board_id}")
  void deleteFromLike(Like like);
  @Update("UPDATE board SET likes_num=likes_num-1 WHERE board_id = #{board_id}")
  void dislikeToBoard(int board_id);

  //게시판 삭제
  @Select("SELECT stored_file_name FROM board_image WHERE board_id = #{board_id} LIMIT 1")
  String getFileName(int board_id);
  @Delete("DELETE FROM board WHERE board_id = #{board_id}")
  void deleteBoard(int board_id);
  @Delete("DELETE FROM board_image WHERE board_id = #{board_id}")
  void deleteBoardImage(int board_id);


  //테그 존재확인
  @Select("SELECT tag FROM tag WHERE tag = #{tag} LIMIT 1")
  String existTag(String tag);
  //히트 +1
  @Update("UPDATE tag SET hit=hit+1 WHERE tag = #{tag}")
  void updateTag(String tag);
  //테그 삽입
  @Insert("INSERT INTO tag(tag) VALUES(#{tag})")
  void insertTag(String tag);



  //테그 워드 테이블에 단어 추가
  @Insert("INSERT INTO tag_word(tag, word) VALUES(#{tag}, #{word})")
  void addWordToTag(@Param("tag")String tag, @Param("word")String word);


  //사용자 폴더목록 불러오기
  @Select("SELECT * FROM folder WHERE user_id = #{user_id}")
  ArrayList<HashMap> getFolderById(int user_id);

  //폴더에 집어넣기
  @Insert("INSERT INTO fboard(board_id, folder_id) VALUES(#{board_id}, #{folder_id})")
  void putInFolder(Folder folder);

}
