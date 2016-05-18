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

}
