package com.coawesome.persistence;

import com.coawesome.domain.*;
import org.apache.ibatis.annotations.*;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface FolderMapper {
  //폴더 생성
  @Insert("INSERT INTO folder(folder_name, user_id) VALUES(#{folder_name}, #{user_id})")
  void newFolder(Folder folder);

  //폴더 삭제
  @Delete("DELETE FROM folder WHERE folder_id = #{folder_id} AND user_id = #{user_id}")
  void deleteFolder(Folder folder);
  @Delete("DELETE FROM fboard WHERE folder_id = #{folder_id}")
  void deleteFboard(Folder folder);

  //폴더목록 보기
  @Select("SELECT myfolder.folder_id, myfolder.folder_name, board_image.stored_file_name FROM (SELECT * FROM folder where user_id = #{user_id}) myfolder left outer join fboard on myfolder.folder_id = fboard.folder_id left outer join board_image on fboard.board_id = board_image.board_id group by folder_name")
  ArrayList<Folder> getFolderList(@Param("user_id") int user_id);

  //폴더에 게시글 추가
  @Insert("INSERT INTO fboard(folder_id, board_id) VALUES( #{folder_id} , #{board_id})")
  void addFboard(Folder folder);

  //친구(라인)폴더 열기
  @Select("SELECT DISTINCT user.name, board.board_id, user.user_id, user.user_img, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite, " +
          "          IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "          LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "          LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "WHERE (friend.user_id = #{user_id} AND friend.status = 2 AND board.public_level = 2)  OR board.public_level = 1 ORDER BY board.board_id DESC")
  ArrayList<BoardResult> openLineFolder(User user);

  //페이버릿폴더 열기
  @Select("SELECT DISTINCT user.name, board.board_id, user.user_id, user.user_img, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite, " +
          "          IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "          LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "          LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "WHERE favorite.user_id = #{user_id}  ORDER BY board.board_id DESC")
  ArrayList<BoardResult> openFavoriteFolder(User user);

  //내폴더 열기
  @Select("SELECT DISTINCT user.name, board.board_id, user.user_id, user.user_img, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite, " +
          "          IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "          LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "          LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "          WHERE board.user_id = #{user_id} ORDER BY board.board_id DESC")
  ArrayList<BoardResult> openMyFolder(User user);

  //친구프로필 게시글 목록
  @Select("SELECT DISTINCT user.name, board.board_id, user.user_id, user.user_img, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "          board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite, " +
          "          IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM board \n" +
          "          INNER JOIN friend on board.user_id = friend.friend_id \n" +
          "          INNER JOIN board_image on board.board_id = board_image.board_id \n" +
          "          INNER JOIN user on board.user_id = user.user_id\n" +
          "          LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "          LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "          LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "          LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id \n" +
          "          LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "          WHERE ((friend.user_id = #{user_id} AND friend.status = 2 AND board.public_level = 2) OR board.public_level = 1) AND board.user_id = #{friend_id} ORDER BY board.board_id DESC")
  ArrayList<BoardResult> openFriendProfileBoards(User user);


  @Select("SELECT * FROM board_value WHERE board_id = #{board_id} LIMIT 1")
  wordVO getValues(@Param("board_id") int board_id);

  //폴더 열기
  @Select("SELECT user.name, user.user_id, user.user_img, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
          "board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, IFNULL(favorite.user_id,0) as favorite,  \n" +
          "IFNULL(likes.user_id,0) as likes, replycnt.cnt, user.user_img FROM fboard " +
          "INNER JOIN board ON fboard.board_id = board.board_id \n" +
          "INNER JOIN board_image on fboard.board_id = board_image.board_id\n" +
          "INNER JOIN user on board.user_id = user.user_id\n" +
          "LEFT OUTER JOIN tag as tag_1 on board.tag1 = tag_1.tag\n" +
          "LEFT OUTER JOIN tag as tag_2 on board.tag2 = tag_2.tag\n" +
          "LEFT OUTER JOIN tag as tag_3 on board.tag3 = tag_3.tag " +
          "LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id\n" +
//          "LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id\n" +
          "          LEFT OUTER JOIN (SELECT board_id, COUNT(*) as cnt FROM reply group by board_id) as replycnt ON replycnt.board_id = board.board_id \n" +
          "LEFT OUTER JOIN (SELECT * FROM likes WHERE user_id = #{user_id}) as likes ON board.board_id = likes.board_id \n" +
          "WHERE fboard.folder_id = #{folder_id}  ORDER BY board.board_id DESC")
  ArrayList<BoardResult> openFolder(Folder folder);

}
