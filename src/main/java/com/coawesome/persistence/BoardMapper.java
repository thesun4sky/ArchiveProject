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

  //회원가입
  @Insert("INSERT INTO user(login_id, password, name, sex, born, email) VALUES(#{login_id}, #{password}, #{name}, #{sex}, #{born}, #{email})")
  void addUser(User user);
  @Insert("INSERT INTO friend(user_id, friend_id, status) VALUES(#{user_id}, #{user_id}, 2)")
  void initFriend(User user);

  //친구추가
  @Insert("INSERT INTO friend(user_id, friend_id) VALUES(#{user_id}, #{friend_id})")
  void requestFriend(Friend firend);

  //친구승낙
  @Update("UPDATE friend SET status='1' WHERE user_id = #{friend_id} and friend_id = #{user_id}")
  void updateFriend(Friend firend);
  @Insert("INSERT INTO friend(user_id, friend_id, status) VALUES(#{user_id}, #{friend_id}, '1')")
  void acceptFriend(Friend firend);

  //친구신청 조희
  @Select("SELECT a.user_id, a.login_id, a.name, a.sex, a.born, a.email FROM user AS a INNER JOIN friend AS b  ON a.user_id = b.user_id WHERE b.friend_id = #{user_id} AND b.status = '0' ")
  ArrayList<UserResult> checkFriendRequest(int user_id);

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
  ArrayList<UserResult> showFriendsById(@Param("user_id") int user_id);

  //게시글 등록
  @Insert("INSERT INTO board(user_id, public_level, tag1, tag2, tag3, line1, line1_x, line1_y, line2, line2_x, line2_y) VALUES(#{user_id}, #{public_level}, #{tag1}, #{tag2}, #{tag3}, #{line1}, #{line1_x}, #{line1_y}, #{line2}, #{line2_x}, #{line2_y})")
    void insertBoard(BoardVO board);
  @Insert("INSERT INTO board_image(board_id, original_file_name, stored_file_name, file_size, creator_id) VALUES(#{board_id}, #{original_file_name}, #{stored_file_name}, #{file_size}, #{creator_id})")
  void insertBoardImage(ImageVO image);


  //게시판 글 목록 조회 TODO 디테일 작업전
  @Select("select * from board left join board_image on board.board_id = board_image.board_id")
  ArrayList<HashMap> getBoardById(@Param("user_id") int user_id);


  //게시판 글 목록 조회 TODO 디테일 작업전
  @Select("select * from board left join board_image on board.board_id = board_image.board_id")
  ArrayList<HashMap> getBoard();





  //게시글 보기 TODO 디테일 작업전
  @Select("select * from board where board_id = #{board_id}")
  BoardVO findById(@Param("board_id") int board_id);
}
