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

  //아이디 찾기
  @Select("select login_id from user where name = #{name} and born = #{born}")
  String findID(User user);

  //비밀전호 찾기  TODO 비밀번호를 이메일로 보내기
  @Select("select password from user where login_id = #{login_id} and email = #{email}")
  String findPASS(User user);

  //로그인
  @Select("select password from user where login_id = #{login_id}")
  String Login(User user);

  //게시글 등록
  @Insert("INSERT INTO board(user_id, public_level, tag1, tag2, tag3, line1, line1_x, line1_y, line2, line2_x, line2_y) VALUES(#{user_id}, #{public_level}, #{tag1}, #{tag2}, #{tag3}, #{line1}, #{line1_x}, #{line1_y}, #{line2}, #{line2_x}, #{line2_y})")
    void insertBoard(BoardVO board);

  //게시판 글 목록 조회 TODO 디테일 작업전
  @Select("select * from board where user_id = #{user_id}")
  ArrayList<BoardVO> boardfindById(@Param("user_id") int user_id);

    //게시글 보기 TODO 디테일 작업전
    @Select("select * from board where board_id = #{board_id}")
    BoardVO findById(@Param("board_id") int board_id);

  //TODO
}
