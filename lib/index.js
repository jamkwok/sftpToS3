'use strict';
const Client = require('ssh2-sftp-client');
let sftp = new Client();


class SFTPService {

	constructor(options) {
    //Initialise to Docker Sftp Server
		var options = options || { host: '127.0.0.1', port: '2222', username: 'foo', password: 'pass' };
    //Overide defaults to a proper
    this.host =  options.host;
    this.port =  options.port;
    this.username = options.username;
    this.password = options.password;
		return this;
	}

  getObjectStream(objectPath) {
    const self = this;
    return sftp.connect({
      host: self.host,
      port: self.port,
      username: self.username,
      password: self.password
    }).then(() => {
      //return sftp.list(objectPath);
			return sftp.get(objectPath);
    }).catch((err) => {
      console.log(err, 'catch error');
    });
  }

}

module.exports = {
	SFTPService: SFTPService
};
