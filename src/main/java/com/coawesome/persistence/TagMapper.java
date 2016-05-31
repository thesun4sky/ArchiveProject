package com.coawesome.persistence;

import com.coawesome.domain.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by eastflag on 2016-04-25.
 */
@Mapper
public interface TagMapper {

  //테그 프로필
  @Select("Select * from tag left outer join board on tag.tag = board.tag1 or tag.tag = board.tag2 or tag.tag = board.tag3\n" +
          "left outer join board_image on board.board_id = board_image.board_id where tag=#{tag} LIMIT 1")
  TagElement loadTagProfile(TagElement tagElement);

  //테그 검색
  @Select("select * from tag where tag Like  CONCAT('%', #{tag}, '%')")
  ArrayList<TagElement> findTag(@Param("tag") String tag);

  //테그 단어 리스트
  @Select("select word from tag_word where tag Like CONCAT('%', #{tag}, '%')")
  ArrayList<String> getTagWords(@Param("tag")String tag);


  //테그 리스트
  @Select("SELECT DISTINCT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, tag_1.hit as hit1,  board.tag2, tag_2.hit as hit2, board.tag3, tag_3.hit as hit3,\n" +
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
          "          WHERE (board.user_id != #{user_id}  AND ((friend.user_id = #{user_id} AND friend.status >= 1 AND board.public_level <= 1) OR board.public_level = 0) ) AND ( board.tag1 = #{tag} OR board.tag2 = #{tag} OR board.tag3 = #{tag})")
  ArrayList<HashMap> openTagFolder(TagElement tagElement);

}
