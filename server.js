const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require("mongodb").MongoClient;
app.use('/public', express.static("public"));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const passport = require("passport");
const Localstragegy = require("passport-local").Strategy;
const session = require("express-session");

app.use(session({secret : "비밀코드", resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");
var db;
MongoClient.connect("mongodb+srv://tjdwls1286:dpdjzjs12!@@project-cluster.ebmatwj.mongodb.net/?retryWrites=true&w=majority", function(에러, client){
    if(에러){return console.log(에러)}
    db = client.db("todoapp");
    db.collection("post").insertOne({이름 : "성진", 나이 : 29, 꿈 : "개발자", _id : "헤어"}, function(에러,결과){
        console.log("저장완료")
    });
    app.listen(8080, function(){
        console.log('listening on 8080')
    });
})

app.use(bodyParser.urlencoded({extended : true}))



app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 사이트 입니다.')
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티 용품을 쇼핑할 수 있는 사이트 입니다.')
});

app.get('/', function(요청, 응답){
    응답.render('index.ejs')
});

app.get('/write', function(요청, 응답){
    응답.render('write.ejs')
});

app.post('/add', function(요청, 응답){
    
    응답.send('전송완료'); 
    db.collection("counter").findOne({name : "게시물갯수"},function(에러, 결과){
       console.log(결과.totalPost)
       var 총게시물갯수 = 결과.totalPost; 
       db.collection("post").insertOne({_id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date}, function(에러,결과){
        console.log("저장완료");
        db.collection("counter").updateOne({name : "게시물갯수"},{ $inc : {totalPost : 1}},function(에러, 결과){
        if(에러){return console.log(에러)}
        })
        });

    });
  });

app.get("/list", function(요청,응답){
    db.collection("post").find().toArray(function(에러,결과){
    console.log(결과)
    응답.render("list.ejs",{작명 : 결과})
}) 

});

app.delete("/delete",function(요청,응답){
    
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id)
    db.collection("post").deleteOne(요청.body,function(에러,결과){
    console.log("삭제완료")
    응답.status(200).send({ message : "성공했습니다."});
    })
})


app.get("/detail/:id", function(요청,응답){
  
   db.collection("post").findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){

        console.log(결과)
        응답.render("detail.ejs", {data : 결과})
   })
})

app.get("/edit/:id", function(요청, 응답){

    db.collection("post").findOne({ _id : parseInt(요청.params.id)},function(에러, 결과){
        console.log(결과)
    응답.render("edit.ejs", {작명제목 : 결과} )
    })
})

app.put("/edit", function(요청,응답){
    db.collection("post").updateOne({_id : parseInt(요청.body.id)},{ $set : { 제목 : 요청.body.title , 날짜 : 요청.body.date}},function(에러,결과){
        console.log("수정 완료")
        응답.redirect("/list")
    })
})