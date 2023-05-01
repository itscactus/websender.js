const net = require('net');
const crypto = require('crypto');

class WebsenderAPI {
  constructor(host, password, port) {
    this.timeout = 30;
    this.host = host;
    this.password = password;
    this.port = port;
    this.socket = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection({
        port: this.port,
        host: this.host
      }, () => {
        this.writeRawByte(1);
        const hash = crypto.createHash('sha512');
        this.readRawInt()
          .then(num => {
            hash.update(num + this.password);
            this.writeString(hash.digest('hex'));
            this.readRawInt()
              .then(num => {
                if (num === 1) {
                  resolve(true);
                } else {
                  reject(false);
                }
              })
              .catch(() => reject(false));
          })
          .catch(() => reject(false));
      });
      
      this.socket.on('error', (err) => reject(err));
    });
  }

  sendCommand(command) {
    this.writeRawByte(2);
    this.writeString(Buffer.from(command).toString('base64'));
    return this.readRawInt()
      .then(num => num === 1);
  }

  sendMessage(message) {
    this.writeRawByte(4);
    this.writeString(Buffer.from(message).toString('base64'));
    return this.readRawInt()
      .then(num => num === 1);
  }

  disconnect() {
    if (!this.socket) {
      return false;
    }
    this.writeRawByte(3);
    return true;
  }

  writeRawInt(i) {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(i);
    this.socket.write(buffer);
  }

  writeRawByte(b) {
    const buffer = Buffer.alloc(1);
    buffer.writeInt8(b);
    this.socket.write(buffer);
  }

  writeString(string) {
    const buffer = Buffer.from(string);
    this.writeRawInt(buffer.length);
    for (const byte of buffer) {
      this.writeRawByte((0xff & (byte >> 8)));
      this.writeRawByte((0xff & byte));
    }
  }

  readRawInt() {
    return new Promise((resolve, reject) => {
      this.socket.once('data', data => {
        try {
          const num = data.readInt32BE();
          resolve(num);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  readRawByte() {
    return new Promise((resolve, reject) => {
      this.socket.once('data', data => {
        try {
          const num = data.readInt8();
          resolve(num);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = WebsenderAPI;