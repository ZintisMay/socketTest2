var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const log = console.log

var quizBoss = "bob"

class Quiz {
	constructor(author, questions){
		this.author = author
		this.questions = questions
		this.currentQuestionIndex = -1
		this.currentQuestion = this.questions[this.currentQuestionIndex]
	}
	setCurrentQuestion(x){
		if(x){this.currentQuestionIndex = x}
		this.currentQuestion = this.questions[this.currentQuestionIndex]
	}
	nextQuestion(){
		this.currentQuestionIndex++
		if(this.currentQuestionIndex >= this.questions.length){
			this.currentQuestionIndex = this.questions.length - 1

			log("exceed top bound of questions")
			return null
		}
		this.setCurrentQuestion()
		return this.currentQuestion
	}
	prevQuestion(){
		this.currentQuestionIndex--
		if(this.currentQuestionIndex < 0){
			this.currentQuestionIndex = 0
			log("exceed bottom bound of questions")
			return null
		}
		this.setCurrentQuestion()
		return this.currentQuestion

	}
	addQuestion(q){
		this.questions.push(q)
	}
	removeQuestion(i){
		this.questions.splice(i,1)
	}
	answerQuestion(msg){
		this.currentQuestion.userAnswers[msg.user] = msg.answer
	}
}


	var questions = [
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
		},
		{
			type: "multipleChoice",
			answers:{
				0:"a",
				1:"b",
				2:"c",
				3:"d"
			},
			correctAnswer:0,
			userAnswers:{

			}
		},
		{
			type: "multipleChoice",
			answers:{
				0:"w",
				1:"x",
				2:"y",
				3:"z"
			},
			correctAnswer:0,
			userAnswers:{

			}
		}
	]

	var dummyQuiz = new Quiz("zintis", questions)


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

  log('a user connected');

  socket.on('disconnect', () => {
    log('user disconnected');
  });

  // Emit to all upon connect
  // socket.broadcast.emit('hi');

  socket.on('chat message', (msg) => {
    log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('next question', (msg) => {
  	log("next question")
    io.emit('next question', dummyQuiz.nextQuestion());
  });

});

// Turn on server
http.listen(3000, () => {
  log('listening on *:3000');
});