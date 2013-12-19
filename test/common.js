chai = require('chai');
sinon = require('sinon');
sinonChai = require("sinon-chai");
chai.should();
expect = chai.expect;
chai.use(sinonChai);
chai.use(require("chai-as-promised"));
require("mocha-as-promised")();

requireHijack = require('require-hijack');