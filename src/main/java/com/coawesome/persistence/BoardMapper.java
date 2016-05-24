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
  @Select("select * from reply where board_id = #{board_id}")
  ArrayList<Reply> showreplybyId(@Param("board_id") int board_id);

  //사용자 검색
  @Select("select * from user where name Like  CONCAT('%', #{name}, '%')")
  ArrayList<UserResult> findUser(@Param("name") String name);

  //게시글 등록
  @Insert("INSERT INTO board(user_id, public_level, tag1, tag2, tag3, line1, line1_x, line1_y, line2, line2_x, line2_y, catagory) VALUES(#{user_id}, #{public_level}, #{tag1}, #{tag2}, #{tag3}, #{line1}, #{line1_x}, #{line1_y}, #{line2}, #{line2_x}, #{line2_y},#{catagory})")
  void insertBoard(BoardVO board);
  @Select("SELECT board_id FROM board where user_id = #{user_id} AND line1 = #{line1} AND line2 = #{line2}")
  int selectBoardId(BoardVO board);
  @Insert("INSERT INTO board_image(board_id, original_file_name, stored_file_name, file_size, creator_id) VALUES(#{board_id}, #{original_file_name}, #{stored_file_name}, #{file_size}, #{creator_id})")
  void insertBoardImage(ImageVO image);




  //게시판 글 목록 조회( 친구들의 친구공개 게시글, 모든사람의 전체공개 게시글 목록)
  @Select("SELECT DISTINCT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, board.tag2, board.tag3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, reply.replier, reply.likes_num, reply.reply, IFNULL(favorite.user_id,0) as favorite FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id \n" +
          "          WHERE board.user_id != #{user_id}  AND ((friend.user_id = #{user_id} AND friend.status >= 1 AND board.public_level <= 1) OR board.public_level = 0)")
         // "LEFT OUTER JOIN (SELECT favorite.board_id as board_id, CASE favorite.board_id WHEN board.board_id THEN'1' ELSE '0' END as favorite FROM favorite INNER JOIN board ON board.board_id = favorite.board_id WHERE favorite.user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id  " +
ArrayList<HashMap> getBoardById(int user_id);

  //카테고리별 목록 조회
  @Select("select * from board INNER JOIN board_image ON board.board_id = board_image.board_id INNER JOIN user on board.user_id = user.user_id WHERE catagory = #{catagory} AND board.public_level = 0")
  ArrayList<HashMap> getBoardByCatagory(@Param("catagory") int catagory);



  //게시글 보기 TODO 디테일 작업전
  @Select("select * from board where board_id = #{board_id}")
  BoardVO findById(@Param("board_id") int board_id);


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

  //게시판 삭제
  @Select("SELECT stored_file_name FROM board_image WHERE board_id = #{board_id}")
  String getFileName(int board_id);
  @Delete("DELETE FROM board WHERE board_id = #{board_id}")
  void deleteBoard(int board_id);
  @Delete("DELETE FROM board_image WHERE board_id = #{board_id}")
  void deleteBoardImage(int board_id);


}
