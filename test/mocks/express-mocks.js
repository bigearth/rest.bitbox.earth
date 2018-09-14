/*
  Contains mocks of Express req and res objects.
*/

"use strict";

const sinon = require("sinon");

// Inspect JS Objects.
const util = require("util");
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
};

function fakeSend(arg) {
  console.log(`res.send: ${util.inspect(arg)}`);
  return arg;
}

function fakeJson(arg) {
  console.log(`res.json: ${util.inspect(arg)}`);
  return arg;
}

const mockReq = {
  accepts: sinon.stub().returns({}),
  acceptsCharsets: sinon.stub().returns({}),
  acceptsEncodings: sinon.stub().returns({}),
  acceptsLanguages: sinon.stub().returns({}),
  body: {},
  flash: sinon.stub().returns({}),
  get: sinon.stub().returns({}),
  is: sinon.stub().returns({}),
  params: {},
  query: {},
  session: {},
};

const mockRes = {
  append: sinon.stub().returns({}),
  attachement: sinon.stub().returns({}),
  clearCookie: sinon.stub().returns({}),
  cookie: sinon.stub().returns({}),
  download: sinon.stub().returns({}),
  end: sinon.stub().returns({}),
  format: {},
  get: sinon.stub().returns({}),
  headersSent: sinon.stub().returns({}),
  json: sinon.stub().callsFake(fakeJson),
  jsonp: sinon.stub().returns({}),
  links: sinon.stub().returns({}),
  locals: {},
  location: sinon.stub().returns({}),
  redirect: sinon.stub().returns({}),
  render: sinon.stub().returns({}),
  send: sinon.stub().callsFake(fakeSend),
  sendFile: sinon.stub().returns({}),
  sendStatus: sinon.stub().returns({}),
  set: sinon.stub().returns({}),
  status: sinon.stub().returns({}),
  type: sinon.stub().returns({}),
  vary: sinon.stub().returns({}),
  write: sinon.stub().returns({}),
};

module.exports = {
  mockReq,
  mockRes,
};
