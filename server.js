var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var quizBoss = "bob"

var quiz = {
	currentQuestion:0,
	next:function(){
		this.currentQuestion++
	},
	questions:[
		{
			type: "multipleChoice",
			answers:{
				0:"banana",
				1:"apple",
				2:"pear",
				3:"orange"
			},
			correctAnswer:0,
			userAnswers:{

			}
		}
	]
}

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Serve homepage
app.get('/quiz', (req, res) => {
  res.sendFile(__dirname + '/quiz.html');
});
// Serve homepage
app.get('/quizBoss', (req, res) => {
  res.sendFile(__dirname + '/quizBoss.html');
});

// Serve  
io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Emit to all upon connect
  // socket.broadcast.emit('hi');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('next question', (msg) => {
  	console.log("next question")
    io.emit('next question', quiz.questions[0]);
  });

});

// Turn on server
http.listen(3000, () => {
  console.log('listening on *:3000');
});