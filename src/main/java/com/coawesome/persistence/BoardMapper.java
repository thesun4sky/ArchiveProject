package com.coawesome.persistence;

import com.coawesome.domain.BoardVO;
import com.coawesome.domain.Reply;
import com.coawesome.domain.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface BoardMapper {

  //회원가입
  @Insert("INSERT INTO user(login_id, password, name, sex, born, email) VALUES(#{login_id}, #{password}, #{name}, #{sex}, #{born}, #{email})")
  void addUser(User user);

  //아이디 찾기
  @Select("select login_id from user where name = #{name} and born = #{born}")
  String findID(User user);

  //비밀전호 찾기
  @Select("select password from user where login_id = #{login_id} and email = #{email}")
  String findPASS(User user);

  //댓글 등록
  @Insert("INSERT INTO reply(user_id, board_id, likes_num, reply, created) VALUES(#{user_id}, #{board_id}, #{likes_num}, #{reply}, #{created})")
  void addReply(Reply reply);


  //댓글 확인
  @Select("select * from reply where board_id = #{board_id}")
  ArrayList<Reply> showreplybyId(@Param("board_id") int board_id);




  //로그인
  @Select("select password from user where login_id = #{login_id}")
  String Login(User user);

  //친구목록 조회
  @Select("select friend.friend_id as user_id, user.name, user.email, user.sex, user.login_id, user.born from friend left outer join user on friend.friend_id = user.user_id where friend.user_id = #{user_id}")
  ArrayList<User> showFriendsById(@Param("user_id") int user_id);

  //게시글 등록
  @Insert("INSERT INTO board(user_id, public_level, tag1, tag2, tag3, line1, line1_x, line1_y, line2, line2_x, line2_y) VALUES(#{user_id}, #{public_level}, #{tag1}, #{tag2}, #{tag3}, #{line1}, #{line1_x}, #{line1_y}, #{line2}, #{line2_x}, #{line2_y})")
    void insertBoard(BoardVO board);
//  @Insert("INSERT INTO board(board_id, original_file_name, stored_file_name, file_size) VALUES()")
//  void insertBoardImage(HashMap board);
  @Insert("INSERT INTO board(board_id, original_file_name, stored_file_name, file_size) VALUES(#{board_id}, #{original_file_name}, #{stored_file_name}, #{file_size})")
  void insertFile(Map board);


  //게시판 글 목록 조회 TODO 디테일 작업전
  @Select("select * from board left join board_image on board.board_id = board_image.board_id")
  ArrayList<HashMap> getBoardById(@Param("user_id") int user_id);
/*

  //게시판 글 목록 조회 TODO 디테일 작업전
  @Select("select * from board left join board_image on board.board_id = board_image.board_id")
  ArrayList<HashMap> getBoardById(@Param("user_id") int user_id);

*/



  //게시글 보기 TODO 디테일 작업전
  @Select("select * from board where board_id = #{board_id}")
  BoardVO findById(@Param("board_id") int board_id);
}
