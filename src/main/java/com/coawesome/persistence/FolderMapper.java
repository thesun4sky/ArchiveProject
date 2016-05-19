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
  @Select("SELECT * FROM folder WHERE user_id = #{user_id}")
  ArrayList<Folder> getFolderList(@Param("user_id") int user_id);

  //폴더에 게시글 추가
  @Insert("INSERT INTO fboard(folder_id, board_id) VALUES( #{folder_id} , #{board_id})")
  void addFboard(Folder folder);

  //폴더 열기
  @Select("SELECT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, board.tag2, board.tag3\n" +
          ",board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, reply.replier, reply.likes_num, reply.reply, IFNULL(favorite.user_id,0) as favorite FROM fboard \n" +
          "INNER JOIN board ON fboard.board_id = board.board_id \n" +
          "INNER JOIN board_image on fboard.board_id = board_image.board_id\n" +
          "INNER JOIN user on board.user_id = user.user_id\n" +
          "LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id\n" +
          "LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id\n" +
          "WHERE fboard.folder_id = #{folder_id}")
  ArrayList<HashMap> openFolder(Folder folder);

  //친구(라인)폴더 열기
  @Select("SELECT DISTINCT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, board.tag2, board.tag3\n" +
          ",board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, reply.replier, reply.likes_num, reply.reply, IFNULL(favorite.user_id,0) as favorite FROM friend \n" +
          "INNER JOIN board on friend.friend_id = board.user_id\n" +
          "INNER JOIN board_image on board.board_id = board_image.board_id\n" +
          "INNER JOIN user on friend.friend_id = user.user_id\n" +
          "LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id\n" +
          "LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id\n" +
          "WHERE friend.user_id = #{user_id}")
  ArrayList<HashMap> openLineFolder(User user);

  //페이버릿폴더 열기
  @Select("SELECT DISTINCT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, board.tag2, board.tag3\n" +
          ",board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, reply.replier, reply.likes_num, reply.reply, IFNULL(favorite.user_id,0) as favorite FROM board \n" +
          "INNER JOIN board_image on board.board_id = board_image.board_id\n" +
          "INNER JOIN user on board.user_id = user.user_id\n" +
          "LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id\n" +
          "LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id\n" +
          "WHERE favorite.user_id = #{user_id}")
  ArrayList<HashMap> openFavoriteFolder(User user);

  //내폴더 열기
  @Select("SELECT DISTINCT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, board.tag2, board.tag3\n" +
          ",board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, reply.replier, reply.likes_num, reply.reply, IFNULL(favorite.user_id,0) as favorite FROM board \n" +
          "INNER JOIN board_image on board.board_id = board_image.board_id\n" +
          "INNER JOIN user on board.user_id = user.user_id\n" +
          "LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id\n" +
          "LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id\n" +
          "WHERE board.user_id = #{user_id}")
  ArrayList<HashMap> openMyFolder(User user);

}
