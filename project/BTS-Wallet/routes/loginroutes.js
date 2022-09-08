const mysql = require("mysql");
const dbconfig = require("../config/db");
const connection = mysql.createConnection(dbconfig);

exports.register = function (req, res) {
  var today = new Date();
  var users = {
    userid: req.body.userid,
    pwd: req.body.pwd,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    created: today,
    modified: today,
  };
  connection.query(
    "SELECT userid FROM user WHERE userid = ?",
    users.userid,
    function (error, results, fields) {
      if (error) {
        // DB error
        console.log("검색 실패 : ", error);
        res.send({
          code: 400,
          failed: "검색 실패",
        });
      } else {
        // phone 중복 검사 실행.
        if (results.toString() === "") {
          connection.query("INSERT INTO user SET ?", users, function (
            error,
            results,
            fields
          ) {
            if (error) {
              //DB error
              console.log("error ocurred", error);
              res.send({
                code: 400,
                failed: "error ocurred",
              });
            } else {
              //DB 추가 성공
              //로그 데이터 추가해야됨.
              console.log("DB 추가 성공");
              res.send({
                code: 200,
                success: "user registered sucessfully",
              });
            }
          });
        } else {
          console.log("이미 있는 ID 입니다.");
          res.send({
            code: 400,
            failed: "이미 있는 ID 입니다.",
          });
        }
      }
    }
  );
};

exports.login = function (req, res) {
  var userid = req.body.userid;
  var pwd = req.body.pwd;
  connection.query("SELECT * FROM user WHERE userid = ?", [userid], function (
    error,
    results,
    fields
  ) {
    if (error) {
      // console.log("error ocurred", error);
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      // console.log('The solution is: ', results);
      if (results.length > 0) {
        if (results[0].pwd == pwd) {
          res.send({
            code: 200,
            success: "login sucessfull",
          });
        } else {
          res.send({
            code: 204,
            success: "ID and password does not match",
          });
        }
      } else {
        res.send({
          code: 204,
          success: "Email does not exists",
        });
      }
    }
  });
};
