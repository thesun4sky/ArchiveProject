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
  @Select("SELECT DISTINCT user.name, board.board_id, board.public_level, board.catagory, board.likes_num, board.tag1, board.tag2, board.tag3\n" +
          ",board.line1_x, board.line1_y,board.line1, board.line2, board.line2_x, board.line2_y, board.created, board_image.stored_file_name, board.favorite_num, reply.replier, reply.likes_num, reply.reply, IFNULL(favorite.user_id,0) as favorite FROM board \n" +
          "INNER JOIN board_image on board.board_id = board_image.board_id\n" +
          "INNER JOIN user on board.user_id = user.user_id\n" +
          "LEFT OUTER JOIN (SELECT * FROM favorite WHERE user_id = #{user_id}) as favorite ON board.board_id = favorite.board_id\n" +
          "LEFT OUTER JOIN (SELECT user.name as replier, reply.reply, reply.likes_num, reply.board_id FROM reply INNER JOIN user ON reply.user_id = user.user_id where (reply.user_id, reply.reply_id) IN (select user_id, min(reply_id) from reply)) as reply on board.board_id = reply.board_id\n" +
          "WHERE board.tag1 = #{tag} OR board.tag2 = #{tag} OR board.tag3 = #{tag}")
  ArrayList<HashMap> openTagFolder(TagElement tagElement);

}
