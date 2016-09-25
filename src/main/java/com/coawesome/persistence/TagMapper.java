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
  @Select("select word as text, count(*)*8 as weight from tag_word where tag Like CONCAT('%', #{tag}, '%') group by word")
  ArrayList<CloudVO> getTagWords(@Param("tag")String tag);


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
          "          WHERE (((friend.user_id = #{user_id} AND friend.status >= 1 AND board.public_level <= 1) OR board.public_level = 0) ) AND ( board.tag1 = #{tag} OR board.tag2 = #{tag} OR board.tag3 = #{tag})  ORDER BY board.board_id DESC")
  ArrayList<HashMap> openTagFolder(TagElement tagElement);

  //테그 레이더 값 얻어오기
  @Select("SELECT avg(v.pos1) as pos1, avg(v.pos2) as pos2, avg(v.pos3) as pos3, avg(v.pos4) as pos4, avg(v.pos5) as pos5, avg(v.neg1) as neg1, avg(v.neg2) as neg2, avg(v.neg3) as neg3, avg(v.neg4) as neg4, avg(v.neg5) as neg5 FROM board " +
          "INNER JOIN board_value as v ON board.board_id = v.board_id " +
          "WHERE board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag} ;")
  wordVO getTagValue(@Param("tag")String tag);

  //테그 꺽은선그래프 값 얻어오기
  @Select("SELECT 0 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag}) AND  (to_days(now())-to_days(board.created) < 7)\n" +
          "UNION\n" +
          "SELECT 1 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag})  AND  (to_days(now())-to_days(board.created) < 14)\n" +
          "UNION\n" +
          "SELECT 2 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag})  AND  (to_days(now())-to_days(board.created) < 21)\n" +
          "UNION\n" +
          "SELECT 3 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag})  AND  (to_days(now())-to_days(board.created) < 30)\n" +
          "UNION\n" +
          "SELECT 4 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag})  AND  (to_days(now())-to_days(board.created) < 60)\n" +
          "UNION\n" +
          "SELECT 5 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag})  AND  (to_days(now())-to_days(board.created) < 90)\n" +
          "UNION\n" +
          "SELECT 6 as period, avg(v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, avg(v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "          INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "          WHERE (board.tag1= #{tag} OR board.tag2= #{tag} OR board.tag3= #{tag})  AND  (to_days(now())-to_days(board.created) < 120)")
  ArrayList<LineValue> getLineValue(@Param("tag")String tag);


  //추천 테그 리스트
  @Select("SELECT board.tag1 as tag, I.stored_file_name, (v.pos1+v.pos2+v.pos3+v.pos4+v.pos5) as positive, (v.neg1+v.neg2+v.neg3+v.neg4+v.neg5) as negative FROM board\n" +
          "\t INNER JOIN board_value as v ON board.board_id = v.board_id \n" +
          "     INNER JOIN board_image as I ON I.board_id = v.board_id\n" +
          "     WHERE (to_days(now())-to_days(board.created) < 14) AND board.catagory = #{catagory}\n" +
          "     ORDER BY positive DESC LIMIT 1")
  TagElement loadRecommandTag(@Param("catagory")int catagory);

}
