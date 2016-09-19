package com.coawesome.persistence;

import com.coawesome.domain.*;
import org.apache.ibatis.annotations.*;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface UserMapper {

  //회원가입
  @Insert("INSERT INTO user(login_id, password, name, sex, born, email) VALUES(#{login_id}, #{password}, #{name}, #{sex}, #{born}, #{email})")
  void addUser(User user);
  @Select("select user_id from user where login_id = #{login_id} LIMIT 1")
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

  //유저 클라우드 단어 가져오기
  @Select("SELECT tag as text, count(*)*8 as weight FROM (SELECT tag1 as tag FROM board WHERE user_id = #{user_id} UNION\n" +
          "SELECT tag2 as tag FROM board WHERE user_id = #{user_id} UNION SELECT tag3 as tag FROM board WHERE user_id = #{user_id}) as tags\n" +
          "GROUP BY tag LIMIT 25")
  ArrayList<CloudVO> getUserWords(User user);

  //유저 카테고리 값 가져오기
  @Select("SELECT catagory, COUNT(*) as cnt FROM board WHERE user_id = #{user_id} GROUP BY catagory")
  ArrayList<Catagory> getUserValueByCategory(User user);


  //최근 접속 시간 업데이트
  @Update("UPDATE user SET updated_time=#{updated_time} WHERE user_id=#{user_id}")
  void updateUserTime(User user);

  //사용자 검색
  @Select("select * from user where name Like  CONCAT('%', #{name}, '%')")
  ArrayList<UserResult> findUser(@Param("name") String name);

  //사용자 검색
  @Select("select * from user where name Like  CONCAT('%', #{name}, '%')")
  ArrayList<HashMap> findNotithings(String id);


  //친구 추천(내친구가아니고, 나의 카테고리 최대항목과 같은 게시글을 많이 가지고있는 유저)
  @Select("SELECT * FROM user\n" +
          "LEFT OUTER JOIN (SELECT friend.user_id from friend \n" +
          "          LEFT OUTER JOIN (SELECT userIN.user_id, userIN.updated_time from friend INNER JOIN user as userIN on friend.user_id = userIN.user_id where friend.friend_id= #{user_id} AND userIN.updated_time > now()-300 )\n" +
          "          as userIN on friend.user_id = userIN.user_id\n" +
          "              INNER JOIN user on friend.user_id = user.user_id\n" +
          "              WHERE friend.friend_id= #{user_id}) as myFriend ON myFriend.user_id = user.user_id\n" +
          "INNER JOIN board ON board.user_id = user.user_id\n" +
          "LEFT OUTER JOIN (SELECT catagory, COUNT(*) as cnt from board WHERE user_id = #{user_id} GROUP BY catagory ORDER BY cnt DESC LIMIT 1) as myCategory ON myCategory.catagory = board.catagory\n" +
          "WHERE myFriend.user_id IS NULL AND user.friend_id != #{user_id}  LIMIT 1")
  UserResult findCategoryFriend(User user);




  //알림
  @Select("SELECT friend.id, friend.status, user.user_id, user.name, user.user_img, friend.created from friend left outer join user on friend.user_id = user.user_id where friend_id = #{user_id} and #{checkedTime} < friend.created and friend.created < #{currentTime}\n" +
          "  union\n" +
          "  SELECT reply.id, myboard.board_id, user.user_id, user.name, user.user_img, reply.created from (SELECT board.board_id, board.user_id FROM board where board.user_id = #{user_id}) myboard inner join reply on myboard.board_id = reply.board_id left outer join user on reply.user_id = user.user_id  where #{checkedTime} < reply.created and reply.created < #{currentTime}\n" +
          "  union\n" +
          "  SELECT favorite.id, myboard.board_id, user.user_id, user.name, user.user_img, favorite.created from (SELECT board.board_id, board.user_id FROM board where board.user_id = #{user_id}) myboard inner join favorite on myboard.board_id = favorite.board_id left outer join user on favorite.user_id = user.user_id where #{checkedTime} < favorite.created and favorite.created < #{currentTime}\n" +
          "  union\n" +
          "  SELECT likes.id, myboard.board_id, user.user_id, user.name, user.user_img, likes.created from (SELECT board.board_id, board.user_id FROM board where board.user_id = #{user_id}) myboard inner join likes on myboard.board_id = likes.board_id left outer join user on likes.user_id = user.user_id where #{checkedTime} < likes.created")
  ArrayList<HashMap> notification(HashMap map);






}
