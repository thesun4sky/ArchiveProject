package com.coawesome.persistence;
import com.coawesome.domain.BoardVO;
import com.coawesome.domain.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface BoardMapper {


  @Insert("INSERT INTO user(login_id, password, name) VALUES(#{login_id}, #{password}, #{name})")
  void addUser(User user);

   @Select("select  from user where user_id = #{login_id}")
    Usedddasdfasr (@Param("login_id") String )

  @Insert("INSERT INTO board(user_id, title, content) VALUES(#{user_id}, #{title}, #{content})")
    void insertBoard(BoardVO board);

  @Select("select * from board where board_id = #{board_id}")
    BoardVO findById(@Param("board_id") int board_id);
}
