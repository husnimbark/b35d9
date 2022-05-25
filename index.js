const express = require ('express');

const db = require('./connection/db')

const pg = require('pg');

const app = express();
const port = 4500;

const isLogin = true;
let projects = [
    {
        title: 'Photo Studio',
        startDate: '2022-05-24',
        endDate: '2022-06-24',
        duration: '1 Months',
        description: 'Photo Editors are in charge of coordinating photo assignments by selecting, editing, and positioning photos, and publishing images in print publications and on the web.',
        html: 'public/html.png',
        css: 'public/css.png',
        javascript: 'public/javascript.png',
        react: 'public/react.png',
        image: '1.webp',
        date : '24 May 2022 - 24 June 2022'
    },
];

// TEST CONNECTION DB
db.connect(function(err, _, done){
  if (err) throw err;

  console.log('Database Connection Success');
});
 
// PORT
app.listen(port, function () {
    console.log(`Server running on port: ${port}`);
});

// VIEW ENGINE
app.set('view engine', 'hbs');

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

pg.types.setTypeParser(1082, function(stringValue) {
  return stringValue; });
  
// ROUTING
app.get('/', function (req, res) {
    db.connect(function(err, client, done) {
      if (err) throw err;
    
    const query = 'SELECT * FROM tb_project';

    client.query(query, function (err, result){
      if (err) throw err;

    const projectsData = result.rows;

    const newProject = projectsData.map((project) => {
    project.isLogin = isLogin;
    project.duration = difference(project["startDate"], project["endDate"]);
    project.date = getFullTime(project["startDate"], project["startDate"]);
      return project;
    });

    console.log(newProject);

    res.render('index', {isLogin: isLogin, projects: newProject});
    });

    done();
  });
});

app.get('/home', function (req, res){
    db.connect(function(err, client, done) {
      if (err) throw err;
    
    const query = 'SELECT * FROM tb_project';

    client.query(query, function (err, result){
      if (err) throw err;

    const projectsData = result.rows;

    const newProject = projectsData.map((project) => {
    project.isLogin = isLogin;
    project.duration = difference(project["startDate"], project["endDate"]);
    project.date = getFullTime(project["startDate"], project["startDate"]);
      return project;
    });

    console.log(newProject);

      res.render('index', {isLogin: isLogin, projects: newProject});
    });

    done();
  });
})


app.get('/add-project', function (req, res){
    res.render('add-project');
});

app.post('/add-project', function (req, res){
    const data = req.body;

    console.log(data);

    data.duration = difference(data["startDate"],data["endDate"]);
    data.date = getFullTime(data["startDate"],data["startDate"]);

    projects.push(data);

    res.redirect('/');
});

app.get('/project-detail/:index', function (req, res){
  db.connect(function(err, client, done) {
    if (err) throw err;
  
  const query = 'SELECT * FROM tb_project';

  client.query(query, function (err, result){
    if (err) throw err;
    
    const index = req.params.index;
    const project = result.rows[index];
    const detail = project;  

    detail.duration = difference(detail["startDate"], detail["endDate"]);
    detail.date = getFullTime(detail["startDate"], detail["startDate"]);

    res.render('project-detail', {isLogin: isLogin, detail: detail})
    });
    done();
  });
})



app.get('/contact', function(req, res){
    res.render('contact', {isLogin: isLogin});
});

app.get('/edit-project/:index', function(req, res){
    const index = req.params.index;
    const edit = projects[index];  

    res.render('edit-project', {isLogin: isLogin, edit, id:index})
});

app.post('/edit-project/:index', function(req, res){
    const data = req.body;
    const index = req.params.index;

    data.duration = difference(data["startDate"],data["endDate"]);
    data.date = getFullTime(data["startDate"],data["startDate"]);

    projects[index]=data;


  res.redirect('/');
});

app.get('/delete-project/:index', (req, res) => {
    const index = req.params.index;
    projects.splice(index, 1);
  
    res.redirect('/');
  });

// TIME

const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  
  // DURATION DATE
  function getFullTime(startDate,endDate){
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return `${startDate.getDate()} ${month[startDate.getMonth()]} ${startDate.getFullYear()} - ${endDate.getDate()} ${month[endDate.getMonth()]} ${endDate.getFullYear()}`;
  }

  // DURATION TIME
  function difference(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      day = 1000*60*60*24;
      dif =(date2utc - date1utc)/day;
    return dif < 30 ? dif +" Days" : parseInt(dif/30)+" Months"
  }
  
  
