package com.coawesome.persistence;

import com.coawesome.domain.BoardVO;
import com.coawesome.domain.ImageVO;
import com.coawesome.domain.User;
import com.coawesome.domain.UserResult;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface UserMapper {

  //회원가입
  @Insert("INSERT INTO user(login_id, password, name, sex, born, email) VALUES(#{login_id}, #{password}, #{name}, #{sex}, #{born}, #{email})")
  void addUser(User user);
  @Select("select user_id from user where login_id = #{login_id}")
  int getUserid(User user);
  @Insert("INSERT INTO friend(user_id, friend_id, status) VALUES(#{user_id}, #{user_id}, 2)")
  void initFriend(User user);

  //아이디 찾기
  @Select("select login_id from user where name = #{name} and born = #{born}")
  String findID(User user);

  //아이디 찾기
  @Select("select login_id from user where login_id = #{login_id}")
  String checkID(User user);

  //비밀전호 찾기
  @Select("select password from user where login_id = #{login_id} and email = #{email}")
  String findPASS(User user);


  //로그인
  @Select("select * from user where login_id = #{login_id}")
  User Login(User user);


  //프로필사진 등록
  @Update("UPDATE user SET user_img=#{user_img} WHERE user_id=#{user_id}")
  void insertUserImage(ImageVO image);


  //프로필 사진 불러오기

  @Select("Select * from user where user_id=#{user_id}")
  UserResult loadProfile(User user);

}
