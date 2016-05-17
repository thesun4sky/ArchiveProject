package com.coawesome.persistence;

import com.coawesome.domain.*;
import org.apache.ibatis.annotations.*;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface FriendMapper {

  //친구신청
  @Insert("INSERT INTO friend(user_id, friend_id) VALUES(#{user_id}, #{friend_id})")
  void requestFriend(Friend firend);

  //친구승낙
  @Update("UPDATE friend SET status='1' WHERE user_id = #{user_id} and friend_id = #{friend_id}")
  void updateFriend(Friend firend);
  @Insert("INSERT INTO friend(user_id, friend_id, status) VALUES(#{friend_id}, #{user_id}, '1')")
  void acceptFriend(Friend firend);

  //친구 삭제
  @Delete("DELETE FROM friend WHERE friend.user_id = #{user_id} AND friend.friend_id = #{friend_id}")
  void deleteFriend(Friend firend);

  //친구신청 조희
  @Select("SELECT a.user_id, a.login_id, a.name, a.sex, a.born, a.email FROM user AS a INNER JOIN friend AS b  ON a.user_id = b.user_id WHERE b.friend_id = #{user_id} AND b.status = '0' ")
  ArrayList<UserResult> checkFriendRequest(int user_id);

  //친구목록 조회
  @Select("select friend.friend_id, friend.user_id, user.name, user.email, user.sex, user.login_id, user.born, friend.status from friend INNER JOIN user on friend.user_id = user.user_id where friend.friend_id= #{user_id}")
  ArrayList<UserResult> showFriendsById(@Param("user_id") int user_id);


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

}
