package com.coawesome.persistence;

import com.coawesome.domain.BoardVO;
import com.coawesome.domain.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface BoardMapper {

  //회원가입
  @Insert("INSERT INTO user(login_id, password, name, sex, born, address, email) VALUES(#{login_id}, #{password}, #{name}, #{sex}, #{born}, #{address}, #{email})")
  void addUser(User user);

  //로그인
  @Select("select password from user where login_id = #{login_id}")
  String Login(User user);

  //게시글 등록
  @Insert("INSERT INTO board(user_id, public_level, tag1, tag2, tag3, line1, line1_x, line1_y, line2, line2_x, line2_y) VALUES(#{user_id}, #{public_level}, #{tag1}, #{tag2}, #{tag3}, #{line1}, #{line1_x}, #{line1_y}, #{line2}, #{line2_x}, #{line2_y})")
    void insertBoard(BoardVO board);

  //게시판 글 목록 조회
  @Select("select * from board where user_id = #{user_id}")
  ArrayList<BoardVO> boardfindById(@Param("user_id") int user_id);


    @Select("select * from board where board_id = #{board_id}")
    BoardVO findById(@Param("board_id") int board_id);
}
