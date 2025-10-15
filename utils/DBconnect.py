import mysql.connector

class DBconnect:
    def __init__(self):
        """
        Các thông tin sau nên được cất giấu vào một file khác
        """
        self.__host = "localhost"
        self.__user = "root"
        self.__password = "duy732003"
        self.__database = "library"

        self.__conn = mysql.connector.connect(
            host=self.__host,
            user=self.__user,
            password=self.__password,
            database=self.__database)


    def executeVoidQuery(self, query):
        """
        Dùng cho INSERT/UPDATE/DELETE/DDL.
        Tự commit; rollback nếu lỗi.
        Trả về dict: {"row_count": ..., "last_row_id": ...}
        """
        cur = self.__conn.cursor()
        try:
            cur.execute(query)
            self.__conn.commit()
            # last_row_id chỉ có ý nghĩa với INSERT có AUTO_INCREMENT
            return {"row_count": cur.rowcount, "last_row_id": cur.lastrowid}
        except mysql.connector.Error:
            self.__conn.rollback()
            raise
        finally:
            cur.close()


    def executeReturnQuery(self, query):
        """
        Dùng cho SELECT.
        Trả về list các dict (mỗi dict là một dòng, key = tên cột).
        """
        cur = self.__conn.cursor(dictionary=True)
        try:
            cur.execute(query)
            rows = cur.fetchall()
            return rows
        finally:
            cur.close()


    def close(self):
        self.__conn.close()

