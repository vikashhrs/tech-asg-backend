let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let assert = require('assert');

chai.use(chaiHttp);

describe('/GET Cars', () => {
      it('Acura and Ford should be present among all the cars', () => {
        chai.request(server)
            .get('/get/cars')
            .end((err, res) => {
                assert.equal("Acura" in res.body && "Ford" in res.body);
            });
      });
});

describe('/GET Models', () => {
      it('Models should have Escape and Edge for car Ford', () => {
        chai.request(server)
            .get('/get/models/Ford')
            .end((err, res) => {
                assert.ok("Edge" in res.body && "Escape" in res.body);
            });
      });
});