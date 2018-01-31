const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      user : '', //completar
      password : '', //completar
      database : 'jsnode'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//Todos os resultados
server.get('/read', function (req, res, next) {
    knex('rest').then((dados) => {
        res.send(dados);
    }, next);

    return next();
});

//Inserir
server.post('/create', function(req, res, next){
    knex('rest')
        .insert(req.body)
        .then((dados) => {
            res.send(dados);
        }, next);
});

//Buscar por id
server.get('/show/:id', function (req, res, next) {
    const { id } = req.params;

    knex('rest')
        .where('id', id)
        .first()
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('Nenhum resultado encontrado'));

            res.send(dados);
        }, next);
});

//Atualizar por id
server.put('/update/:id', function (req, res, next) {
    const { id } = req.params;

    knex('rest')
        .where('id', id)
        .first()
        .update(req.body)
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('Nenhum resultado encontrado'));

            res.send('Dados atualizados!');
        }, next);
});

//Deletar por id
server.del('/delete/:id', function (req, res, next) {
    const { id } = req.params;

    knex('rest')
        .where('id', id)
        .first()
        .delete()
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('Nenhum resultado encontrado'));

            res.send('Dados excluídos!');
        }, next);
});

server.get(/\/(.*)?.*/, restify.plugins.serveStatic({
    directory: __dirname + '/src',
    default: 'index.html'
}));

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});