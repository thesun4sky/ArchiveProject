package com.coawesome.persistence;

import com.coawesome.domain.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface UserMapper {

  //회원가입
  @Insert("INSERT INTO user(login_id, password, name, sex, born, email) VALUES(#{login_id}, #{password}, #{name}, #{sex}, #{born}, #{email})")
  void addUser(User user);
  @Insert("INSERT INTO friend(user_id, friend_id, status) VALUES(#{user_id}, #{user_id}, 2)")
  void initFriend(User user);

  //아이디 찾기
  @Select("select login_id from user where name = #{name} and born = #{born}")
  String findID(User user);

  //비밀전호 찾기
  @Select("select password from user where login_id = #{login_id} and email = #{email}")
  String findPASS(User user);


  //로그인
  @Select("select * from user where login_id = #{login_id}")
  User Login(User user);

}
