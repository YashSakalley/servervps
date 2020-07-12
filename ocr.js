var app = require('express')();
const fs = require('fs'),
	multer = require('multer'),
	{createWorker} = require('tesseract.js');
//const worker = createWorker();

const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,"./upload")
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
});

const upload = multer({storage:storage}).single('avatar');
app.set('view engine','ejs');

app.get('/uploads',function(req,res){
	console.log(hey);
})

app.get('/',function(req,res){
	res.render('index.ejs');
})

app.post('/uploads',function(req,res){
	upload(req,res,err=> {
		console.log(req.file);
		fs.readFile('./upload/'+String(req.file.originalname),(err,data)=>{
		if(err){return console.log(err)}

		// worker.recognize(data,"eng",{tessjs_create_pdf:'1'})
		// .progress(progress=>{
		// 	console.log(progress);
		// }).then(result=>{
		// 	res.send(result.text);
		// })
		// .finally(()=> worker.terminate());


		const worker = createWorker({
		  logger: m => console.log(m)
		});

		(async function() {
		  await worker.load();
		  await worker.loadLanguage('eng');
		  await worker.initialize('eng');
		  const { data: { text } } = await worker.recognize(data);
		  res.send(text);
		  await worker.terminate();
		})();
	})
	})
})

const port = 5000 || process.env.PORT;
app.listen(port,()=> console.log('Hey I am running on $(port)'))


